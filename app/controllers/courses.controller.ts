import { raw, Request, Response } from "express";
import {
  selectCourses,
  selectCategories,
  selectCourseBySlug,
  insertCourseReview,
  insertCategory,
  insertCourse as insertCourseModel,
  updateCourse as updateCourseModel,
  deleteCourse as deleteCourseModel,
} from "../models/courses.model";
import {
  CoursesQuery,
  CoursePayload,
  CourseReviewRequestBody,
} from "../types/courses";
import { uploadBuffer } from "../aws/aws-upload";
import { getCourseDuration, getVideoDuration } from "../utils/getVideoDuration";

const uploadProgressHash = new Map<
  string,
  {
    folder: string;
    filename: string;
    buffer: Buffer<ArrayBufferLike>;
    mimetype: string;
  }
>();

export const getCourses = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { sort, category, price, rating, lang } = req.query as CoursesQuery;
    const courses = await selectCourses({
      sort,
      category,
      price,
      rating,
      lang,
    });
    res.status(200).send({ data: courses });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      message: "Ошибка сервера",
      data: (e as { message?: string })?.message ?? "",
    });
  }
};

export const getCoursesBySlug = async (
  req: Request<{ slug: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { slug } = req.params;
    if (!slug) {
      res.status(404).send({ message: "Неверный slug" });
      return;
    }
    const course = await selectCourseBySlug(slug);
    res.status(200).send(course);
  } catch (e) {
    console.error(e);
    res.status(500).send({
      message: "Ошибка сервера",
      data: (e as { message?: string })?.message ?? "",
    });
  }
};

export const getCategories = async (
  _: Request,
  res: Response,
): Promise<void> => {
  try {
    const categories = await selectCategories();
    res.status(200).send(categories);
  } catch (e) {
    console.error(e);
    res.status(500).send({
      message: "Ошибка сервера",
      data: (e as { message?: string })?.message ?? "",
    });
  }
};

export const postCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).send({ message: "Неверное тело запроса" });
      return;
    }
    await insertCategory(name);
    res.status(200).send({ message: "Успешно" });
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Ошибка сервера" });
  }
};

export const uploadFile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    const { id, name } = req.body;
    if (!files?.length) {
      res.status(400).send({ message: "Файлы не найдены" });
      return;
    }

    if (files?.length > 1) {
      res
        .status(400)
        .send({ message: "Тело запроса не должно превышать один файл" });
      return;
    }

    const file = files[0];
    const folder = `${name}/`;
    const fileName = file.originalname;

    uploadProgressHash.set(id, {
      folder,
      filename: fileName,
      buffer: file.buffer,
      mimetype: file.mimetype,
    });

    req.on("close", () => {
      if (!req.complete) {
        uploadProgressHash.delete(id);
      }
    });

    res.status(200).send({ message: "Файл успешно получен" });
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Ошибка сервера" });
  }
};

export const getProgress = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  const send = (type: string, data: unknown) => {
    res.write(`event: ${type}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const metadata = uploadProgressHash.get(id);

    if (!metadata) {
      res.status(404).send({ message: "Файл не найден" });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    const upload = await uploadBuffer(
      "video-courses",
      metadata.folder,
      metadata.filename,
      metadata.buffer,
      metadata.mimetype,
    );

    upload.on("httpUploadProgress", ({ loaded, total }) => {
      if (loaded !== undefined && total !== undefined && total > 0) {
        send("progress", String((loaded / total) * 100));
      }
    });

    const result = await upload.done();
    const duration = await getVideoDuration(metadata.buffer);

    send("done", {
      path: "/" + result.Key,
      duration,
    });

    req.on("close", () => {
      if (!req.complete) {
        upload.abort();
        uploadProgressHash.delete(id);
      }
    });
  } catch (e) {
    console.error(e);
    if (res.headersSent) {
      send("error", JSON.stringify({ message: "Ошибка сервера" }));
    } else {
      res.status(500).send({ message: "Ошибка сервера" });
    }
  } finally {
    uploadProgressHash.delete(id);
    res.end();
  }
};

function parseCoursePayload(
  body: Record<string, string>,
  posterPath?: string,
): CoursePayload {
  return {
    slug: body.slug,
    poster: posterPath ?? body.poster,
    name: body.name,
    author: body.author,
    description: body.description,
    language: body.language,
    duration: getCourseDuration(body.lessons ? JSON.parse(body.lessons) : []),
    is_free: body.is_free === "true",
    price: body.price ? Number(body.price) : null,
    categoryIds: body.categoryIds ? JSON.parse(body.categoryIds) : [],
    lessons: body.lessons ? JSON.parse(body.lessons) : [],
  };
}

export const createCourse = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const files = req.files as Record<string, Express.Multer.File[]>;
    const posterFile = files?.["poster"]?.[0];
    if (!posterFile) {
      res.status(400).send({ message: "Постер обязателен" });
      return;
    }

    let posterPath: string;
    try {
      const upload = await uploadBuffer(
        "books",
        "course-posters/",
        posterFile.originalname,
        posterFile.buffer,
        posterFile.mimetype,
      );
      await upload.done();
      req.on("close", () => {
        if (!req.complete) {
          upload.abort();
        }
      });
      posterPath = `/course-posters/${posterFile.originalname}`;
    } catch (e) {
      console.error(e);
      res.status(500).send({ message: "Ошибка при загрузке постера" });
      return;
    }

    const body = parseCoursePayload(req.body, posterPath);
    if (!body.name || !body.slug || !body.language) {
      res.status(400).send({ message: "Неверное тело запроса" });
      return;
    }
    const course = await insertCourseModel(body);
    res.status(201).send({ data: course, message: "Курс создан" });
  } catch (e) {
    if ((e as Error).message === "SLUG_CONFLICT") {
      res.status(409).send({ message: "Курс с таким slug уже существует" });
      return;
    }
    console.error(e);
    res.status(500).send({ message: "Ошибка сервера" });
  }
};

export const updateCourse = async (
  req: Request<{ slug: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { slug } = req.params;
    const files = req.files as Record<string, Express.Multer.File[]>;
    const posterFile = files?.["poster"]?.[0];

    let posterPath: string | undefined;
    if (posterFile) {
      try {
        const upload = await uploadBuffer(
          "books",
          "course-posters/",
          posterFile.originalname,
          posterFile.buffer,
          posterFile.mimetype,
        );
        await upload.done();
        req.on("close", () => {
          if (!req.complete) {
            upload.abort();
          }
        });
        posterPath = `/course-posters/${posterFile.originalname}`;
      } catch (e) {
        console.error(e);
        res.status(500).send({ message: "Ошибка при загрузке постера" });
        return;
      }
    }

    const body = parseCoursePayload(req.body, posterPath);
    const course = await updateCourseModel(slug, body);
    res.status(200).send({ data: course, message: "Курс обновлён" });
  } catch (e) {
    if ((e as Error).message === "NOT_FOUND") {
      res.status(404).send({ message: "Курс не найден" });
      return;
    }
    if ((e as Error).message === "SLUG_CONFLICT") {
      res.status(409).send({ message: "Курс с таким slug уже существует" });
      return;
    }
    console.error(e);
    res.status(500).send({ message: "Ошибка сервера" });
  }
};

export const deleteCourse = async (
  req: Request<{ slug: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { slug } = req.params;
    const found = await deleteCourseModel(slug);
    if (!found) {
      res.status(404).send({ message: "Курс не найден" });
      return;
    }
    res.status(200).send({ message: "Курс удалён" });
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Ошибка сервера" });
  }
};

export const postReview = async (
  req: Request<{ id: string }, {}, CourseReviewRequestBody>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { course_id, user_id, rating, comment } = req.body;

    if (!id) {
      res.status(404).send({ message: "Курс не найден!" });
      return;
    }

    if (!course_id || !user_id || !rating) {
      res.status(400).send({
        message: `Невалидные поля: ${!course_id ? "book_id" : ""} ${
          !user_id ? "user_id" : ""
        } ${!rating ? "rating" : ""}`,
      });
      return;
    }

    const result = await insertCourseReview(
      course_id,
      user_id,
      rating,
      comment ?? null,
    );
    res.status(200).send({ data: result });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: "Не удалось добавить отзыв. Ошибка сервера!" });
  }
};

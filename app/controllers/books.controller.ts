import { Request, Response } from "express";
import {
  selectBooks,
  insertBook,
  selectBookById,
  insertReview,
  selectPosterPathById,
  selectPdfPathById,
  updateBookModel,
  deleteBookModel,
  selectSuggestions,
  insertSuggestions,
  deleteSuggestionModel,
  selectSuggestionById,
} from "../models/books.model";
import { ReviewRequestBody, BookInsert } from "../types/books";
import { deleteFile, uploadBuffer } from "../aws/aws-upload";

export const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, page, pageSize, sort_by_rating } = req.query;
    const parsedPage = parseInt(page as string) || 1;
    const parsedPageSize = parseInt(pageSize as string) || 15;
    const result = await selectBooks(
      parsedPageSize,
      parsedPage,
      (search as string) || "",
      sort_by_rating as string | undefined,
    );
    res.status(200).send(result);
  } catch (err) {
    console.error("get books err: ", err);
    res.status(500).send({ message: "Ошибка сервера" });
  }
};

export const getSuggestions = async (
  _: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await selectSuggestions();
    res.status(200).send(result);
  } catch (err) {
    console.error("get suggestions err: ", err);
    res.status(500).send({ message: "Ошибка сервера" });
  }
};

export const postSuggestion = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const body = req.body;
    const { name, author, released, description } = body as BookInsert;
    const invalidFields: string[] = [];

    for (const key in body) {
      if (!body[key]) {
        invalidFields.push(key);
      }
    }

    if (invalidFields.length) {
      res.status(400).send({
        message: `Неверно заполнены поля: ${invalidFields.join(",")}`,
      });
      return;
    }

    const files = req.files as Record<string, Express.Multer.File[]>;
    const image = files["image"]?.[0];
    const pdf = files["pdf"]?.[0];

    try {
      const upload = await uploadBuffer(
        "books",
        "suggestion-poster/",
        image?.originalname,
        image?.buffer,
        image?.mimetype,
      );
      await upload.done();
      req.on("close", () => {
        if (!req.complete) {
          upload.abort();
        }
      });
    } catch (e) {
      console.error(e);
      res.status(500).send({ message: "Ошибка обработки постера" });
      return;
    }

    try {
      const upload = await uploadBuffer(
        "books",
        "suggestion-pdf/",
        pdf?.originalname,
        pdf?.buffer,
        pdf?.mimetype,
      );
      await upload.done();
      req.on("close", () => {
        if (!req.complete) {
          upload.abort();
        }
      });
    } catch (e) {
      console.error(e);
      res.status(500).send({ message: "Ошибка обработки pdf" });
      return;
    }

    await insertSuggestions({
      name,
      author,
      description,
      released,
      image: `/suggestion-poster/${image.originalname}`,
      pdf: `/suggestion-pdf/${pdf.originalname}`,
    });
    res.status(200).send({ message: "Успешно добавлено" });
  } catch (err) {
    console.error("get suggestions err: ", err);
    res.status(500).send({ message: "Ошибка сервера" });
  }
};

export const deleteSuggestion = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    deleteOldImage(id as string, "suggestion-poster/");
    deleteOldPdf(id as string, "suggestion-pdf/");
    const deleted = await deleteSuggestionModel(id as string);
    if (!deleted) {
      res.status(404).send({ message: "Книга не найдена" });
      return;
    }
    res.status(200).send({ message: "Книга удалена" });
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Ошибка сервера" });
  }
};

export const acceptSuggestion = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const suggestion = await selectSuggestionById(id);
    if (!suggestion) {
      res.status(404).send({ message: "Предложенная книга не найдена" });
      return;
    }

    deleteSuggestionModel(id);

    const { name, author, image, pdf, released, description } = suggestion;
    await insertBook({
      name,
      author,
      image,
      pdf,
      released,
      description,
    });
    res.status(200).send({ message: "Книга успешно добавлена" });
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Ошибка сервера" });
  }
};

export const getBookById = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(404).send({ message: "Неверный id" });
      return;
    }

    const book = await selectBookById(id);
    res.status(200).send(book);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: "Не удалось получить данные. Ошибка сервера!" });
  }
};

export const postReview = async (
  req: Request<{ id: string }, {}, ReviewRequestBody>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { book_id, user_id, rating, comment } = req.body;

    if (!id) {
      res.status(404).send({ message: "Книга не найдена!" });
      return;
    }

    if (!book_id || !user_id || !rating) {
      res.status(400).send({
        message: `Невалидные поля: ${!book_id ? "book_id" : ""} ${
          !user_id ? "user_id" : ""
        } ${!rating ? "rating" : ""}`,
      });
      return;
    }

    const result = await insertReview(
      book_id,
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

async function deleteOldImage(id: string, folder = "uploads/") {
  try {
    const filename = await selectPosterPathById(id);
    deleteFile("books", folder, filename);
  } catch (e) {
    console.error(e);
  }
}

async function deleteOldPdf(id: string, folder = "pdf/") {
  try {
    const filename = await selectPdfPathById(id);
    deleteFile("books", folder, filename);
  } catch (e) {
    console.error(e);
  }
}

export const updateBook = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { body } = req;
    const dataToUpdate: Record<string, string | number> = {};
    for (const key in body) {
      const value = body[key];
      if (value) {
        dataToUpdate[key] = value;
      }
    }

    const files = req?.files as Record<string, Express.Multer.File[]>;
    if (files?.["image"]) {
      try {
        deleteOldImage(id as string);
        const image = files["image"]?.[0];
        const upload = await uploadBuffer(
          "books",
          "uploads/",
          image.originalname,
          image.buffer,
          image.mimetype,
        );
        await upload.done();
        req.on("close", () => {
          if (!req.complete) {
            upload.abort();
          }
        });
        dataToUpdate["image"] = `/uploads/${image.originalname}`;
      } catch (e) {
        console.error(e);
        res.status(500).send({ message: "Ошибка при добавлении постера" });
        return;
      }
    }

    if (files?.["pdf"]) {
      try {
        deleteOldPdf(id as string);
        const pdf = files["pdf"]?.[0];
        const upload = await uploadBuffer(
          "books",
          "pdf/",
          pdf.originalname,
          pdf.buffer,
          pdf.mimetype,
        );
        await upload.done();
        req.on("close", () => {
          if (!req.complete) {
            upload.abort();
          }
        });
        dataToUpdate["pdf"] = `/pdf/${pdf.originalname}`;
      } catch (e) {
        console.error(e);
        res.status(500).send({ message: "Ошибка при добавлении pdf" });
        return;
      }
    }

    await updateBookModel(id as string, dataToUpdate);
    res.status(200).send({ message: "Успешно" });
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Ошибка сервера" });
  }
};

export const postBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { body } = req;
    const { name, author, released, description } = body as BookInsert;
    const invalidFields: string[] = [];

    for (const key in body) {
      if (!body[key]) {
        invalidFields.push(key);
      }
    }

    if (invalidFields.length) {
      res.status(400).send({
        message: `Неверно заполнены поля: ${invalidFields.join(",")}`,
      });
      return;
    }

    const files = req.files as Record<string, Express.Multer.File[]>;
    const image = files["image"]?.[0];
    const pdf = files["pdf"]?.[0];

    try {
      const upload = await uploadBuffer(
        "books",
        "uploads/",
        image?.originalname,
        image?.buffer,
        image?.mimetype,
      );
      await upload.done();
      req.on("close", () => {
        if (!req.complete) {
          upload.abort();
        }
      });
    } catch (e) {
      console.error(e);
      res.status(500).send({ message: "Ошибка обработки постера" });
      return;
    }

    try {
      const upload = await uploadBuffer(
        "books",
        "pdf/",
        pdf?.originalname,
        pdf?.buffer,
        pdf?.mimetype,
      );
      await upload.done();
      req.on("close", () => {
        if (!req.complete) {
          upload.abort();
        }
      });
    } catch (e) {
      console.error(e);
      res.status(500).send({ message: "Ошибка обработки pdf" });
      return;
    }

    await insertBook({
      name,
      author,
      image: `/uploads/${image.originalname}`,
      pdf: `/pdf/${pdf.originalname}`,
      released,
      description,
    });
    res.status(201).send({ message: "Книга успешно добавлена!" });
  } catch (err) {
    console.error("post book error: ", err);
    res.status(500).send({ message: "Ошибка сервера!" });
  }
};

export const deleteBook = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    deleteOldImage(id as string);
    deleteOldPdf(id as string);
    const deleted = await deleteBookModel(id as string);
    if (!deleted) {
      res.status(404).send({ message: "Книга не найдена" });
      return;
    }
    res.status(200).send({ message: "Книга удалена" });
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Ошибка сервера" });
  }
};

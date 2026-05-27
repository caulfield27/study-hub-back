import { Request, Response } from "express";
import {
  selectCourses,
  selectCategories,
  selectCourseBySlug,
  insertCourseReview,
} from "../models/courses.model";
import { CoursesQuery, CourseReviewRequestBody } from "../types/courses";

export const getCourses = async (req: Request, res: Response): Promise<void> => {
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
    res
      .status(500)
      .send({ message: "Ошибка сервера", data: (e as { message?: string })?.message ?? "" });
  }
};

export const getCoursesBySlug = async (
  req: Request<{ slug: string }>,
  res: Response
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
    res
      .status(500)
      .send({ message: "Ошибка сервера", data: (e as { message?: string })?.message ?? "" });
  }
};

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await selectCategories();
    res.status(200).send(categories);
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .send({ message: "Ошибка сервера", data: (e as { message?: string })?.message ?? "" });
  }
};

export const postReview = async (
  req: Request<{ id: string }, {}, CourseReviewRequestBody>,
  res: Response
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
      comment ?? null
    );
    res.status(200).send({ data: result });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: "Не удалось добавить отзыв. Ошибка сервера!" });
  }
};

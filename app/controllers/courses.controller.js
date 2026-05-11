const {
  selectCourses,
  selectCourseById,
  selectCategories,
  selectCourseBySlug,
  insertCourseReview,
} = require("../models/courses.model");

module.exports = {
  getCourses: async (req, res) => {
    try {
      const { sort, category, price, rating, lang } = req.query;
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
        .send({ message: "Ошибка сервера", data: e?.message ?? "" });
    }
  },
  getCoursesBySlug: async (req, res) => {
    try {
      const { slug } = req.params;
      if (!slug) {
        res.status(404).send({ message: "Неверный slug" });
      }
      const course = await selectCourseBySlug(slug);
      res.status(200).send(course);
    } catch (e) {
      console.error(e);
      res
        .status(500)
        .send({ message: "Ошибка сервера", data: e?.message ?? "" });
    }
  },
  getCategories: async (req, res) => {
    try {
      const categories = await selectCategories();
      res.status(200).send(categories);
    } catch (e) {
      console.error(e);
      res
        .status(500)
        .send({ message: "Ошибка сервера", data: e?.message ?? "" });
    }
  },
  postReview: async (req, res) => {
    try {
      const { id } = req.params;
      const { course_id, user_id, rating, comment } = req.body;

      if (!id) {
        res.status(404).send({ message: "Курс не найден!" });
      }

      if (!course_id || !user_id || !rating) {
        res.status(400).send({
          message: `Невалидные поля: ${!course_id ? "book_id" : ""} ${
            !user_id ? "user_id" : ""
          } ${!rating ? "rating" : ""}`,
        });
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
  },
};

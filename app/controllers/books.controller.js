const {
  selectBooks,
  insertBook,
  selectBookById,
  insertReview,
} = require("../models/books.model");
const fs = require("fs");
const path = require("path");

module.exports = {
  getBooks: async (req, res) => {
    try {
      const { search, page, pageSize } = req.query;
      const parsedPage = parseInt(page) || 1;
      const parsedPageSize = parseInt(pageSize) || 15;
      const result = await selectBooks(
        parsedPageSize,
        parsedPage,
        search || ""
      );
      res.status(200).send(result);
    } catch (err) {
      console.error("get books err: ", err);
      res.status(500).send({ message: "Ошибка сервера" });
    }
  },
  getBookById: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(404).send({ message: "Неверный id" });
      }
      const book = await selectBookById(id);
      res.status(200).send(book);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .send({ message: "Не удалось получить данные. Ошибка сервера!" });
    }
  },
  postReview: async (req, res) => {
    try {
      const { id } = req.params;
      const { book_id, user_id, rating, comment } = req.body;
      
      if (!id) {
        res.status(404).send({ message: "Книга не найдена!" });
      }

      if (!book_id || !user_id || !rating) {
        res.status(400).send({
          message: `Невалидные поля: ${!book_id ? "book_id" : ""} ${
            !user_id ? "user_id" : ""
          } ${!rating ? "rating" : ""}`,
        });
      }

      const result = await insertReview(
        book_id,
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
  },
  postBook: async (req, res) => {
    try {
      const { body } = req;
      const { name, author, image, pdf, rating, released, description } = body;
      const invalidFields = [];

      for (const key in body) {
        if (!body[key]) {
          invalidFields.push(key);
        }
      }

      if (invalidFields.length) {
        res.status(400).send({
          message: `Неверно заполнены поля: ${invalidFields.join(",")}`,
        });
      }

      const fileData = image.split(",");
      const fileType = fileData[0].split("/")[1].split(";")[0];
      const fileName = `${name.replaceAll(" ", "_")}.${fileType}`;
      const buffer = Buffer.from(fileData[1], "base64");

      const imagePath = path.join(__dirname, "..", "uploads", fileName);

      try {
        fs.writeFileSync(imagePath, buffer);
      } catch (_) {
        res.status(500, { message: "Не удалось добавить изображение!" });
      }

      await insertBook({
        name,
        author,
        image: `uploads/${fileName}`,
        pdf,
        rating,
        released,
        description,
      });
      res.status(201).send({ message: "Книга успешно добавлена!" });
    } catch (err) {
      console.error("post book error: ", err);
      res.status(500).send({ message: "Ошибка сервера!" });
    }
  },
};

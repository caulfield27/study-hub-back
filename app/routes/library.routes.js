const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  getBookById,
  getBooks,
  postBook,
  postReview,
} = require("../controllers/books.controller");
// const authMiddleware = require("../middlewares/auth.middleware");
const upload = multer();

router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/review/:id", postReview);
router.post("/", upload.none(), postBook);

module.exports = router;

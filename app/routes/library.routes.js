const express = require("express");
const multer = require("multer");
const router = express.Router();
const controller = require("../controllers/books.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = multer();


router.get("/", authMiddleware, controller.getBooks);
router.post("/", upload.none(), controller.postBook);

module.exports = router;
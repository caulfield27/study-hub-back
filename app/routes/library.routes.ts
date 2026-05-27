import express from "express";
import multer from "multer";
import {
  acceptSuggestion,
  deleteBook,
  deleteSuggestion,
  getBookById,
  getBooks,
  getSuggestions,
  postBook,
  postReview,
  postSuggestion,
  updateBook,
} from "../controllers/books.controller";
import { requireAdmin } from "../middlewares/requireAdmin.middleware";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const uploadFields = [
  { name: "image", maxCount: 1 },
  { name: "pdf", maxCount: 1 },
];

// suggestions
router.get("/suggestions", getSuggestions);
router.post("/suggestions", upload.fields(uploadFields), postSuggestion);
router.delete("/suggestions/:id", requireAdmin, deleteSuggestion);
router.post("/suggestions/:id", requireAdmin, acceptSuggestion);


router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/review/:id", postReview);
router.post("/", upload.fields(uploadFields), requireAdmin, postBook);
router.patch("/:id", upload.fields(uploadFields), requireAdmin, updateBook);
router.delete("/:id", requireAdmin, deleteBook);


export default router;

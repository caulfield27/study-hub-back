import express from "express";
import {
  getQuizById,
  getQuizes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} from "../controllers/quizes.controller";
import { requireAdmin } from "../middlewares/requireAdmin.middleware";

const router = express.Router();

router.get("/", getQuizes);
router.get("/:id", getQuizById);
router.post("/", requireAdmin, createQuiz);
router.patch("/:id", requireAdmin, updateQuiz);
router.delete("/:id", requireAdmin, deleteQuiz);

export default router;

import express from "express";
import { getQuizById, getQuizes } from "../controllers/quizes.controller";

const router = express.Router();

router.get("/", getQuizes);
router.get("/:id", getQuizById);

export default router;

import { Router } from "express";
import {
  getCourses,
  getCoursesBySlug,
  getCategories,
  postReview,
} from "../controllers/courses.controller";

const router = Router();

router.get("/", getCourses);
router.get("/categories", getCategories);
router.get("/:slug", getCoursesBySlug);
router.post("/review/:id", postReview);

export default router;

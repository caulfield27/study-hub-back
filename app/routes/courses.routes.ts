import { Router } from "express";
import multer from "multer";
import {
  getCourses,
  getCoursesBySlug,
  getCategories,
  postReview,
  postCategory,
  uploadFile,
  createCourse,
  updateCourse,
  deleteCourse,
  getProgress,
} from "../controllers/courses.controller";
import { requireAdmin } from "../middlewares/requireAdmin.middleware";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
const uploadPoster = upload.fields([{ name: "poster", maxCount: 1 }]);

router.get("/categories", getCategories);
router.post("/categories", requireAdmin, postCategory);

router.post("/upload", requireAdmin, upload.array("file"), uploadFile);
router.get("/upload/progress/:id", getProgress);

router.delete("/:slug", requireAdmin, deleteCourse);
router.patch("/:slug", requireAdmin, uploadPoster, updateCourse);
router.get("/:slug", getCoursesBySlug);
router.post("/review/:id", postReview);

router.get("/", getCourses);
router.post("/", requireAdmin, uploadPoster, createCourse);


export default router;

const { Router } = require("express");
const {
  getCourses,
  getCoursesBySlug,
  getCategories,
  postReview,
} = require("../controllers/courses.controller");
const router = Router();

router.get("/", getCourses);
router.get("/categories", getCategories);
router.get("/:slug", getCoursesBySlug);
router.post("/review/:id", postReview);

module.exports = router;

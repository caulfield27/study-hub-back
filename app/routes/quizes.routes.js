const express = require("express");
const controller = require("../controllers/quizes.controller"); 
const router = express.Router();

router.get("/", controller.getQuizes);
router.get("/:id", controller.getQuizById);

module.exports = router;
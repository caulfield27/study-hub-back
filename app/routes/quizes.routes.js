const express = require("express");
const {getQuizById, getQuizes} = require("../controllers/quizes.controller"); 
const router = express.Router();

router.get("/", getQuizes);
router.get("/:id", getQuizById);

module.exports = router;
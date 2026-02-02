const express = require("express");
const { registrUser, login } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", registrUser);
router.post("/login", login);

module.exports = router;

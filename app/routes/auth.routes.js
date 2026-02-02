const { Router } = require("express");
const { registrUser, login, getMe } = require("../controllers/auth.controller");

const router = Router();

router.post("/register", registrUser);
router.post("/login", login);
router.get("/me", getMe);

module.exports = router;

const { Router } = require("express");
const { registrUser, login } = require("../controllers/auth.controller");

const router = Router();

router.post("/register", registrUser);
router.post("/login", login);

module.exports = router;

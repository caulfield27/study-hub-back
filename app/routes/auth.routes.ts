import { Router } from "express";
import { registrUser, login, getMe } from "../controllers/auth.controller";

const router = Router();

router.post("/register", registrUser);
router.post("/login", login);
router.get("/me", getMe);

export default router;

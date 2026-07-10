import { Router } from "express";
import {
  registrUser,
  login,
  getMe,
  updateMe,
  handleChangePassport,
} from "../controllers/auth.controller";
import multer from "multer";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/register", registrUser);
router.post("/login", login);

router.put("/me/password", authMiddleware, handleChangePassport);
router.put("/me", authMiddleware, upload.array("avatar"), updateMe);
router.get("/me", authMiddleware, getMe);

export default router;

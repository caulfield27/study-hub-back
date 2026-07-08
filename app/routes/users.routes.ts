import express from "express";
import { getUsers } from "../controllers/users.controller";
import { requireAdmin } from "../middlewares/requireAdmin.middleware";

const router = express.Router();

router.get("/", requireAdmin, getUsers);

export default router;

import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../utils/getEnv";

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = req.header("Authorization");
  if (!token) {
    res.status(401).send({ message: "Пользователь не авторизован" })
    return;
  };

  try {
    jwt.verify(
      token!.startsWith("Bearer") ? token!.split(" ")[1] : token!,
      JWT_SECRET
    );
    next();
  } catch (e) {
    console.error(e);
    res.status(400).send({ message: "Неправильный токен" });
  }
}

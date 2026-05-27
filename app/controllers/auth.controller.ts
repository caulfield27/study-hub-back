import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { createUser, findUser } from "../models/auth.model";
import { JWT_SECRET } from "../utils/getEnv";
import { AppError } from "../types/common";
import { JwtPayload, RegisterRequestBody, LoginRequestBody } from "../types/auth";

export const registrUser = async (req: Request<{}, {}, RegisterRequestBody>, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).send({
        message: `Неверно заполнены поля ${!username ? "username" : ""} ${
          !email ? "email" : ""
        } ${!password ? "password" : ""}`,
      });
      return;
    }

    const hashedPw = await bcrypt.hash(password, 10);
    await createUser(username, email, hashedPw);
    res.status(201).send({ message: "Пользователь успешно зарегистрирован" });
  } catch (e) {
    const err = e as AppError;
    const status = err?.status ?? 500;
    const message = err?.message ?? "Ошибка сервера";
    res.status(status).send({ message });
  }
};

export const login = async (req: Request<{}, {}, LoginRequestBody>, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    const user = await findUser(username);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).send({ message: "Неверный пароль" });
      return;
    }
    const token = jwt.sign(
      { username, email: user.email, id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
    res
      .status(200)
      .send({ data: token, message: "Пользователь успешно вошел в систему" });
  } catch (err) {
    const error = err as AppError;
    const status = error?.status ?? 500;
    const message = error?.message ?? "Ошибка сервера";
    res.status(status).send({ message });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.header("Authorization");
    if (!token){
      res.status(401).send({ message: "Пользователь не авторизован" });
      return;
    }

    const user = jwt.verify(
      token!.startsWith("Bearer") ? token!.split(" ")[1] : token!,
      JWT_SECRET
    ) as JwtPayload;

    res.status(200).send({ data: user });
  } catch (e) {
    console.error(e);
    res.status(401).send({ message: "Пользователь не авторизован" });
  }
};

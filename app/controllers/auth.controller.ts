import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import {
  createUser,
  findPasswordById,
  findUser,
  findUserById,
  updatePassword,
  updateUser,
} from "../models/auth.model";
import { JWT_SECRET } from "../utils/getEnv";
import { AppError } from "../types/common";
import { RegisterRequestBody, LoginRequestBody } from "../types/auth";
import { deleteFile, uploadBuffer } from "../aws/aws-upload";

export const registrUser = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response,
): Promise<void> => {
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

export const login = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response,
): Promise<void> => {
  try {
    const { username, password } = req.body;
    const user = await findUser(username);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).send({ message: "Неверный пароль" });
      return;
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });
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
    const id = req?.user?.id;
    if (!id) {
      res.status(404).send({ message: "Пользователь не найден" });
      return;
    }

    const user = await findUserById(String(id));
    res.status(200).send({ data: user });
  } catch (e) {
    console.error(e);
    res.status(401).send({ message: "Пользователь не авторизован" });
  }
};

export const updateMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.user?.id;

    if (!id) {
      res.status(404).send({ message: "неверный id" });
      return;
    }

    const user = await findUserById(String(id));
    const files = req.files as Express.Multer.File[];
    const avatarFile = files?.[0];
    const username = req.body?.username;
    const email = req.body?.email;

    let avatarPath;
    if (avatarFile) {
      try {
        const filename = user?.avatar?.split("/")?.[2];
        if (filename) {
          await deleteFile("books", "avatar/", filename);
        }
      } catch (e) {
        console.error(e);
      }

      const upload = await uploadBuffer(
        "books",
        "avatar/",
        avatarFile.originalname,
        avatarFile.buffer,
        avatarFile.mimetype,
      );

      const result = await upload.done();
      avatarPath = "/" + (result.Key ?? "");

      req.on("close", () => {
        if (!req.complete) {
          upload.abort();
        }
      });
    }

    const result = await updateUser(
      username ?? null,
      email ?? null,
      avatarPath ?? null,
      user.id,
    );
    res.status(200).send(result);
  } catch (err) {
    const error = err as AppError;
    const status = error?.status ?? 500;
    const message = error?.message ?? "Ошибка сервера";
    res.status(status).send({ message });
  }
};

export const handleChangePassport = async (req: Request, res: Response) => {
  try {
    const id = req?.user?.id;

    if (!id) {
      res.status(400).send({ message: "неверный id" });
      return;
    }

    const { currentPassword, newPassword } = req.body;
    const realPasswordHash = await findPasswordById(String(id));

    const isMatch = await bcrypt.compare(currentPassword, realPasswordHash);

    if (!isMatch) {
      res.status(400).send({ message: "Неверно введен текущий пароль" });
      return;
    }

    const newPasswordHashed = await bcrypt.hash(newPassword, 10);
    await updatePassword(newPasswordHashed, String(id));
    res.status(200).send({ message: "Пароль успешно изменен" });
  } catch (err) {
    const error = err as AppError;
    const status = error?.status ?? 500;
    const message = error?.message ?? "Ошибка сервера";
    res.status(status).send({ message });
  }
};

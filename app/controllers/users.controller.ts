import { Request, Response } from "express";
import { SelectUsers } from "../models/users.model";

export async function getUsers(req: Request, res: Response) {
  try {
    const { search } = req.query as { search?: string };
    const users = await SelectUsers(search);
    res.status(200).send(users);
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Ошибка сервера" });
  }
}

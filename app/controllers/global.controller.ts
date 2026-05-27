import { Request, Response } from "express";
import { getSearchResult } from "../models/globals.model";

export const globalSearch = async (req: Request, res: Response): Promise<void> => {
  const { q } = req.query;
  try {
    const data = await getSearchResult((q as string) ?? "");
    const total = data.books.length + data.courses.length + data.quizes.length;
    res.status(200).send({ data, total });
  } catch (e) {
    res.status(500).send({ message: "Ошибка сервера: " + ((e as { message?: string })?.message ?? "") });
  }
};

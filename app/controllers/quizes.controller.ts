import { Request, Response } from "express";
import { selectQuizes, selectQuizById } from "../models/quizes.model";

export const getQuizes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { recommended } = req.query;
    const quizes = await selectQuizes(recommended as string | undefined);
    res.status(200).send(quizes);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: "Не удалось получить данные. Ошибка сервера!" });
  }
};

export const getQuizById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(404).send({ message: "id не найден" });
      return;
    }
    const quiz = await selectQuizById(id);
    res.status(200).send(quiz);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: "Не удалось получить данные. Ошибка сервера!" });
  }
};

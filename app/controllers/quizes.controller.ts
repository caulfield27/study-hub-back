import { Request, Response } from "express";
import {
  selectQuizes,
  selectQuizById,
  insertQuizModal,
  updateQuizModel,
  deleteQuizModal,
} from "../models/quizes.model";
import { QuizPayload } from "../types/quizes";

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

export const createQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload: QuizPayload = req.body;
    const quiz = await insertQuizModal(payload);
    res.status(201).send(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Не удалось создать тест. Ошибка сервера!" });
  }
};

export const updateQuiz = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const payload: QuizPayload = req.body;
    const quiz = await updateQuizModel(id, payload);
    res.status(200).send(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Не удалось обновить тест. Ошибка сервера!" });
  }
};

export const deleteQuiz = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    await deleteQuizModal(id);
    res.status(200).send({ message: "Тест удалён" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Не удалось удалить тест. Ошибка сервера!" });
  }
};

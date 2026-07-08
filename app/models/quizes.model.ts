import pool from "../db/database";
import { Quiz, QuizPayload, QuizSummary } from "../types/quizes";

export async function selectQuizes(
  isRecommended: string | boolean | undefined = false
): Promise<QuizSummary[]> {
  const query = `SELECT id,name,complexity,img,lang,recommended FROM quizes ${
    isRecommended ? "WHERE recommended = TRUE" : ""
  }`;
  const result = await pool.query<QuizSummary>(query);
  return result.rows;
}

export async function selectQuizById(id: string | number): Promise<Quiz> {
  const query = "SELECT * FROM quizes WHERE id = $1";
  const result = await pool.query<Quiz>(query, [id]);
  return result.rows[0];
}

export async function updateQuizModel(id: string | number, data: QuizPayload): Promise<Quiz> {
  const query = `
    UPDATE quizes
    SET name = $1, complexity = $2, img = $3, lang = $4, recommended = $5, questions = $6
    WHERE id = $7
    RETURNING *
  `;
  const result = await pool.query<Quiz>(query, [
    data.name, data.complexity, data.img, data.lang, data.recommended, JSON.stringify(data.questions), id,
  ]);
  return result.rows[0];
}

export async function insertQuizModal(data: QuizPayload): Promise<Quiz> {
  const query = `
    INSERT INTO quizes (name, complexity, img, lang, recommended, questions)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const result = await pool.query<Quiz>(query, [
    data.name, data.complexity, data.img, data.lang, data.recommended, JSON.stringify(data.questions),
  ]);
  return result.rows[0];
}

export async function deleteQuizModal(id: string | number): Promise<void> {
  const query = "DELETE FROM quizes WHERE id = $1";
  await pool.query(query, [id]);
}
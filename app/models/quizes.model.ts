import pool from "../db/database";
import { Quiz, QuizSummary } from "../types/quizes";

export async function selectQuizes(
  isRecommended: string | boolean | undefined = false
): Promise<QuizSummary[]> {
  const query = `SELECT id,name,complexity,img FROM quizes ${
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

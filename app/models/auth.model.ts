import pool from "../db/database";
import { AppError } from "../types/common";
import { User } from "../types/auth";

export async function createUser(
  username: string,
  email: string,
  password: string
): Promise<void> {
  try {
    const now = new Date();
    const findQuery = `SELECT * FROM users WHERE username = $1 OR email = $2`;
    const findResult = await pool.query<User>(findQuery, [username, email]);

    if (findResult.rowCount) {
      const error = new Error(
        "Пользователь с таким именем или почтой уже существует"
      ) as AppError;
      error.status = 400;
      throw error;
    } else {
      const createQuery = `INSERT INTO users (username, email, password, created_at, updated_at)
        VALUES ($1,$2,$3,$4,$5)`;
      await pool.query(createQuery, [username, email, password, now, now]);
    }
  } catch (e) {
    throw e;
  }
}

export async function findUser(username: string): Promise<User> {
  try {
    const query = `SELECT * FROM users WHERE username = $1`;
    const result = await pool.query<User>(query, [username]);
    if (!result?.rowCount) {
      const error = new Error("Пользователь не найден") as AppError;
      error.status = 404;
      throw error;
    } else {
      return result.rows[0];
    }
  } catch (e) {
    throw e;
  }
}

import pool from "../db/database";
import { AppError } from "../types/common";
import { User } from "../types/auth";

export async function createUser(
  username: string,
  email: string,
  password: string,
): Promise<void> {
  try {
    const now = new Date();
    const findQuery = `SELECT * FROM users WHERE username = $1 OR email = $2`;
    const findResult = await pool.query<User>(findQuery, [username, email]);

    if (findResult.rowCount) {
      const error = new Error(
        "Пользователь с таким именем или почтой уже существует",
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

export async function findUserById(id: string): Promise<User> {
  try {
    const query = `SELECT id, username, email, avatar, role FROM users WHERE id = $1`;
    const result = await pool.query<User>(query, [id]);
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

export async function findPasswordById(id: string): Promise<string> {
  try {
    const query = `SELECT password FROM users WHERE id = $1`;
    const result = await pool.query<User>(query, [id]);
    if (!result?.rowCount) {
      const error = new Error("Пользователь не найден") as AppError;
      error.status = 404;
      throw error;
    } else {
      console.log('p: ', result.rows);
      
      return result.rows[0]?.password ?? "";
    }
  } catch (e) {
    throw e;
  }
}

export async function updateUser(
  username: string | null,
  email: string | null,
  avatar: string | null,
  id: number,
) {
  const query = `
  UPDATE users SET
    username = COALESCE($1,username),
    email = COALESCE($2,email),
    avatar = COALESCE($3,avatar) 
  WHERE id = $4
  RETURNING id, username, email, avatar
                `;

  const result = await pool.query(query, [username, email, avatar, id]);
  return result.rows[0];
}

export async function updatePassword(password: string, id: string) {
  const query = "UPDATE users SET password = $1 WHERE id = $2";
  await pool.query(query, [password, id]);
}

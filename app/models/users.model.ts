import pool from "../db/database";

export async function SelectUsers(search?: string) {
  const searchFilter = search
    ? "AND (username ILIKE $1 OR email ILIKE $1)"
    : "";
  const query = `
    SELECT id, username, email, created_at, updated_at FROM users
    WHERE role = 'user'
    ${searchFilter}
  `;
  const values = search ? [`%${search}%`] : [];

  const result = await pool.query(query, values);
  return result?.rows || [];
}

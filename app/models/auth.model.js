const pool = require("../db/database");

module.exports = {
  createUser: async function (username, email, password) {
    try {
      const now = new Date();
      const findQuery = `SELECT * FROM users WHERE username = $1 OR email = $2`;
      const findResult = await pool.query(findQuery, [username, email]);

      if (findResult.rowCount) {
        const error = new Error("Пользователь с таким именем или почтой уже существует");
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
  },

  findUser: async function (username) {
    try {
      const query = `SELECT * FROM users WHERE username = $1`;
      const result = await pool.query(query, [username]);
      if (!result?.rowCount) {
        const error = new Error("Пользователь не найден");
        error.status = 404;
        throw error;
      } else {
        return result.rows[0];
      }
    } catch (e) {
      throw e;
    }
  },
};

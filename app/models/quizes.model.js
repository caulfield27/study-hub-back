const pool = require("../db/database");

async function selectQuizes(isRecommended = false) {
  const query = `SELECT id,name,complexity,img FROM quizes ${
    isRecommended ? "WHERE recommended = TRUE" : ""
  }`;
  const result = await pool.query(query);
  return result.rows;
}

async function selectQuizById(id) {
  const query = "SELECT * FROM quizes WHERE id = $1";
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

module.exports = { selectQuizes, selectQuizById };

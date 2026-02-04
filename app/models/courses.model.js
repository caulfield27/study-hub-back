const pool = require("../db/database");

async function selectCourses() {
  try {
    const query = `
        SELECT (
        id,
        poster,
        name,
        description,
        language,
        duration,
        isFree,
        price,
        course_categories
        ) FROM courses`;
    const result = await pool.query(query);
    return result.rows;
  } catch (e) {
    throw e;
  }
}

module.exports = {selectCourses};
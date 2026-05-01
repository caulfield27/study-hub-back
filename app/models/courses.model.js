const pool = require("../db/database");

async function selectCourses() {
  try {
    const courseQuery = `
        SELECT (
        id,
        poster,
        name,
        description,
        language,
        duration,
        is_free,
        price
        ) FROM courses`;
    const categoryQuery = `
      SELECT co.id AS course_id, c.name AS category_name
      FROM courses co
      JOIN course_categories cc ON co.id = cc.course_id
      JOIN categories c ON c.id = cc.category_id
    `;
    const courses = await pool.query(courseQuery);
    const categories = await pool.query(categoryQuery);
    return [...courses.rows, categories.row];
  } catch (e) {
    throw e;
  }
}

module.exports = { selectCourses };

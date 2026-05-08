const pool = require("../db/database");

async function selectCourses() {
  try {
    const query = `
        SELECT (
        с.id,
        c.poster,
        c.name,
        c.description,
        c.language,
        c.duration,
        c.is_free,
        c.price,
        c.lessons,
        JSON_AGG(
          JSON_BUILD_OBJECT(
              'id', cat.id,
              'name', cat.name
            )
          ) FILTER (WHERE cat.id IS NOT NULL) AS categories
        ) 
      FROM courses c
      LEFT JOIN course_categories cc ON cc.course_id = c.id
      LEFT JOIN categories cat ON cat.id = cc.category_id
      GROUP BY c.id`;
    const result = await pool.query(query);
    return result.rows;
  } catch (e) {
    throw e;
  }
}

module.exports = { selectCourses };

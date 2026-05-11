const pool = require("../db/database");

async function getSearchResult(query) {
  try {
    const booksQuery =
      "SELECT * FROM books WHERE name ILIKE $1 OR author ILIKE $1";
    const quizesQuery = "SELECT * FROM quizes WHERE name ILIKE $1";
    const coursesQuery = `SELECT
        c.id,
        c.slug,
        c.poster,
        c.author,
        c.name,
        c.description,
        c.language,
        c.duration,
        c.is_free,
        c.price,
        c.rating_avg,
        c.reviews_count,
        c.created_at,
        JSON_AGG(
          JSON_BUILD_OBJECT(
              'id', cat.id,
              'name', cat.name
            )
          ) FILTER (WHERE cat.id IS NOT NULL) AS categories
      FROM courses c
      LEFT JOIN course_categories cc ON cc.course_id = c.id
      LEFT JOIN categories cat ON cat.id = cc.category_id
      WHERE
        c.name ILIKE $1
        OR c.author ILIKE $1
        OR cat.name ILIKE $1
      GROUP BY c.id
      `;
    const promises = [
      pool.query(booksQuery, ["%" + query + "%"]),
      pool.query(quizesQuery, ["%" + query + "%"]),
      pool.query(coursesQuery, ["%" + query + "%"]),
    ];
    const [booksReult, quizesResult, coursesResult] =
      await Promise.all(promises);
    return {
      books: booksReult.rows,
      quizes: quizesResult.rows,
      courses: coursesResult.rows,
    };
  } catch (e) {
    throw e;
  }
}

module.exports = { getSearchResult };

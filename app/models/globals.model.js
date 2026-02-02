const pool = require("../db/database");

async function getSearchResult(query) {
  try {
    const booksQuery = 'SELECT * FROM books WHERE name ILIKE $1 OR author ILIKE $1';
    const quizesQuery = 'SELECT * FROM quizes WHERE name ILIKE $1';
    const promises = [
      pool.query(booksQuery, ['%'+query+'%']),
      pool.query(quizesQuery, ['%'+query+'%'])
    ]
    const [booksReult, quizesResult] = await Promise.all(promises);
    return {
      books: booksReult.rows,
      quizes: quizesResult.rows,
      courses: []
    };
  } catch (e) {
    throw e;
  }
}

module.exports = {getSearchResult};
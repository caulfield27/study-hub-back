const pool = require("../db/database");

async function selectBooks(pageSize, page, search) {
  const offset = (page - 1) * pageSize;
  const searchValue = `%${search}%`;

  const searchFilter = search ? `WHERE name ILIKE $1 OR author ILIKE $2` : "";
  const searchQuery = `
      SELECT * FROM books
      ${searchFilter}
      LIMIT $${search ? 3 : 1}
      OFFSET $${search ? 4 : 2}
    `;
  const values = search
    ? [searchValue, searchValue, pageSize, offset]
    : [pageSize, offset];

  const countQuery = `
  SELECT COUNT(*) FROM books
  ${searchFilter}
  `;

  const searchResult = await pool.query(searchQuery, values);
  const totalRes = await pool.query(
    countQuery,
    search ? [searchValue, searchValue] : []
  );

  const total = parseInt(totalRes.rows[0].count);

  return {
    data: searchResult.rows,
    total,
  };
}

async function selectBookById(id, page = 1, perPage = 5) {
  const offset = (page - 1) * perPage;
  const book = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
  const reviews = await pool.query(
    `
    SELECT r.*, u.username 
    FROM reviews r 
    JOIN users u ON u.id = r.user_id 
    WHERE r.book_id = $1 
    ORDER BY r.created_at DESC 
    LIMIT $2 OFFSET $3
`,
    [id, perPage, offset]
  );

  return {
    ...book.rows[0],
    reviews: reviews.rows,
  };
}

async function insertReview(book_id, user_id, rating, comment) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const insertRes = await client.query(
      `
      INSERT INTO reviews (book_id, user_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING id, created_at
    `,
      [book_id, user_id, rating, comment]
    );

    const newReview = insertRes.rows[0];

    await client.query(
      `
      WITH stats AS (
        SELECT 
          COUNT(*) AS total_reviews,
          COALESCE(AVG(rating), 0)::NUMERIC(2,1) AS avg_rating
        FROM reviews 
        WHERE book_id = $1
      )
      UPDATE books
      SET 
        reviews_count = stats.total_reviews,
        rating_avg = stats.avg_rating
      FROM stats
      WHERE id = $1
    `,
      [book_id]
    );

    await client.query("COMMIT");

    return newReview;
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Ошибка при добавлении отзыва:", err);
    throw err;
  } finally {
    client.release();
  }
}

async function insertBook(book) {
  const query = `INSERT INTO books (name, author, image, pdf, rating, released, description) 
              VALUES ($1,$2,$3,$4,$5,$6,$7);`;
  const values = [
    book.name,
    book.author,
    book.image,
    book.pdf,
    book.rating,
    book.released,
    book.description,
  ];
  await pool.query(query, values);
}

module.exports = { selectBooks, insertBook, selectBookById, insertReview };

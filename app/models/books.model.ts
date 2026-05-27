import pool from "../db/database";
import {
  Book,
  BookInsert,
  BookReview,
  BooksResult,
  NewReview,
  Suggestion,
} from "../types/books";

export async function selectBooks(
  pageSize: number,
  page: number,
  search: string,
  sort_by_rating?: string | string[] | boolean,
): Promise<BooksResult> {
  const offset = (page - 1) * pageSize;
  const searchValue = `%${search}%`;

  const searchFilter = search ? "WHERE name ILIKE $1 OR author ILIKE $2" : "";
  const orderQuery = sort_by_rating ? "ORDER BY rating_avg DESC" : "";
  const searchQuery = `
      SELECT * FROM books
      ${searchFilter}
      ${orderQuery}
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

  const searchResult = await pool.query<Book>(searchQuery, values);
  const totalRes = await pool.query<{ count: string }>(
    countQuery,
    search ? [searchValue, searchValue] : [],
  );

  const total = parseInt(totalRes.rows[0].count);

  return {
    data: searchResult.rows,
    total,
  };
}

export async function selectBookById(
  id: string | number,
  page: number = 1,
  perPage: number = 5,
): Promise<Book & { reviews: BookReview[] }> {
  const offset = (page - 1) * perPage;
  const book = await pool.query<Book>("SELECT * FROM books WHERE id = $1", [
    id,
  ]);
  const reviews = await pool.query<BookReview>(
    `
    SELECT r.*, u.username
    FROM book_reviews r
    JOIN users u ON u.id = r.user_id
    WHERE r.book_id = $1
    ORDER BY r.created_at DESC
    LIMIT $2 OFFSET $3
`,
    [id, perPage, offset],
  );

  return {
    ...book.rows[0],
    reviews: reviews.rows,
  };
}

export async function selectPosterPathById(id: string) {
  const query = `SELECT image FROM books WHERE id = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0]?.image || "";
}

export async function selectPdfPathById(id: string) {
  const query = `SELECT pdf FROM books WHERE id = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0]?.pdf || "";
}

export async function insertReview(
  book_id: number,
  user_id: number,
  rating: number,
  comment: string | null,
): Promise<NewReview> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const insertRes = await client.query<NewReview>(
      `
      INSERT INTO book_reviews (book_id, user_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING id, created_at
    `,
      [book_id, user_id, rating, comment],
    );

    const newReview = insertRes.rows[0];

    await client.query(
      `
      WITH stats AS (
        SELECT
          COUNT(*) AS total_reviews,
          COALESCE(AVG(rating), 0)::NUMERIC(2,1) AS avg_rating
        FROM book_reviews
        WHERE book_id = $1
      )
      UPDATE books
      SET
        reviews_count = stats.total_reviews,
        rating_avg = stats.avg_rating
      FROM stats
      WHERE id = $1
    `,
      [book_id],
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

export async function insertBook(book: Partial<BookInsert>): Promise<void> {
  const query = `INSERT INTO books (name, author, image, pdf, released, description)
              VALUES ($1,$2,$3,$4,$5,$6);`;
  const values = [
    book.name,
    book.author,
    book.image,
    book.pdf,
    book.released,
    book.description,
  ];
  await pool.query(query, values);
}

export async function updateBookModel(
  id: string,
  fields: Record<string, string | number>,
) {
  const keys = Object.keys(fields);

  if (keys.length === 0) return;

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const values = Object.values(fields);

  const query = `UPDATE books SET ${setClause} WHERE id = $${keys.length + 1}`;

  await pool.query(query, [...values, id]);
}

export async function deleteBookModel(id: string): Promise<boolean> {
  const query = "DELETE FROM books WHERE id = $1";
  const result = await pool.query(query, [id]);
  return (result?.rowCount || 1) > 0;
}

export async function deleteSuggestionModel(id: string): Promise<boolean> {
  const query = "DELETE FROM suggestions WHERE id = $1";
  const result = await pool.query(query, [id]);
  return (result?.rowCount || 1) > 0;
}

export async function selectSuggestions() {
  const query = "SELECT * FROM suggestions";
  const result = await pool.query(query);
  return result.rows;
}

export async function selectSuggestionById(id: string) : Promise<Suggestion | null> {
  const query =
    "SELECT name, author, description, image, pdf, released FROM suggestions WHERE id = $1";
  const result = await pool.query(query, [id]);
  return result.rows?.[0] || null;
}

export async function insertSuggestions(data: Suggestion) {
  const { name, author, description, image, pdf, released } = data;
  const query = `INSERT INTO suggestions (
  name, 
  author, 
  description, 
  image, 
  pdf, 
  released) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6
  )`;
  await pool.query(query, [name, author, description, image, pdf, released]);
}

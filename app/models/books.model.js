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
  const values = search ? [searchValue, searchValue, pageSize, offset] : [pageSize, offset];
  
  const countQuery = `
  SELECT COUNT(*) FROM books
  ${searchFilter}
  `;
  
  const searchResult = await pool.query(searchQuery, values);
  const totalRes = await pool.query(countQuery, search ? [searchValue, searchValue] : []);
  
  const total = parseInt(totalRes.rows[0].count);

  return {
    data: searchResult.rows,
    total,
  };
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

module.exports = { selectBooks, insertBook };

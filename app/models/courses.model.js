const pool = require("../db/database");

async function selectCourses(queries) {
  try {
    const { sort, category, price, rating, lang } = queries;
    const values = [];
    const conditions = [];
    let courseIdsSubquery = "";

    if (category) {
      const categories = category.split(",");
      const placeholders = [];
      categories.forEach((c, i) => {
        values.push(c);
        placeholders.push(`cat2.name = $${values.length}`);
      });
      courseIdsSubquery = `
    WHERE c.id IN (
      SELECT cc2.course_id
      FROM course_categories cc2
      JOIN categories cat2 ON cat2.id = cc2.category_id
      WHERE ${placeholders.join(" OR ")}
    )
  `;
    }

    if (lang) {
      values.push(lang);
      conditions.push(`c.language = $${values.length}`);
    }

    if (price === "free") {
      conditions.push(`c.is_free = true`);
    }

    if (price === "paid") {
      conditions.push(`c.is_free = false`);
    }

    if (rating) {
      values.push(Number(rating));
      conditions.push(`c.rating_avg >= $${values.length}`);
    }

    let whereQuery = "";

    if (courseIdsSubquery) {
      whereQuery = `${courseIdsSubquery} ${conditions.length ? `AND ${conditions.join(" AND ")}` : ""}`;
    }

    if (!courseIdsSubquery && conditions.length) {
      whereQuery = `WHERE ${conditions.join(" AND ")}`;
    }

    let orderQuery = "";

    switch (sort) {
      case "popularity":
        orderQuery = `ORDER BY c.reviews_count DESC`;
        break;

      case "rating":
        orderQuery = `ORDER BY c.rating_avg DESC`;
        break;
      case "created_at":
        orderQuery = `ORDER BY c.created_at DESC`;
        break;
      default:
        orderQuery = `ORDER BY c.id DESC`;
    }

    const query = `
        SELECT
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
      ${whereQuery}
      GROUP BY c.id
      ${orderQuery}
      `;

    const result = await pool.query(query, values);
    return result.rows;
  } catch (e) {
    throw e;
  }
}

async function selectCourseBySlug(slug, page = 1, perPage = 5) {
  try {
    const query = `
    SELECT
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
    c.lessons,
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
        WHERE c.slug = $1
        GROUP BY c.id
        `;

    const result = await pool.query(query, [slug]);
    const course_id = result.rows?.[0]?.id;
    if (!course_id) {
      throw e;
      return;
    }

    const offset = (page - 1) * perPage;
    const reviewsQuery = `
        SELECT r.*, u.username
        FROM course_reviews r
        JOIN users u ON u.id = r.user_id
        WHERE r.course_id = $1
        ORDER BY r.created_at DESC 
        LIMIT $2 OFFSET $3
        `;

    const reviews = await pool.query(reviewsQuery, [
      course_id,
      perPage,
      offset,
    ]);
    return { ...result.rows[0], reviews: reviews.rows };
  } catch (e) {
    throw e;
  }
}

async function selectCategories() {
  try {
    const query = "SELECT * FROM categories";
    const result = await pool.query(query);
    return result.rows;
  } catch (e) {
    throw e;
  }
}

async function insertCourseReview(course_id, user_id, rating, comment) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const insertRes = await client.query(
      `
      INSERT INTO course_reviews (course_id, user_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING id, created_at
    `,
      [course_id, user_id, rating, comment],
    );

    const newReview = insertRes.rows[0];

    await client.query(
      `
      WITH stats AS (
        SELECT 
          COUNT(*) AS total_reviews,
          COALESCE(AVG(rating), 0)::NUMERIC(2,1) AS avg_rating
        FROM course_reviews 
        WHERE course_id = $1
      )
      UPDATE courses
      SET 
        reviews_count = stats.total_reviews,
        rating_avg = stats.avg_rating
      FROM stats
      WHERE courses.id = $1
    `,
      [course_id],
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

module.exports = {
  selectCourses,
  selectCourseBySlug,
  selectCategories,
  insertCourseReview,
};

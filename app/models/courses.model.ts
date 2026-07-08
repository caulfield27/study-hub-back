import pool from "../db/database";
import {
  Category,
  Course,
  CourseWithReviews,
  CourseReview,
  CoursesQuery,
  CoursePayload,
  NewReview,
} from "../types/courses";

export async function selectCourses(queries: CoursesQuery): Promise<Course[]> {
  try {
    const { sort, category, price, rating, lang } = queries;
    const values: (string | number | boolean)[] = [];
    const conditions: string[] = [];
    let courseIdsSubquery = "";

    if (category) {
      const categories = category.split(",");
      const placeholders: string[] = [];
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

    const result = await pool.query<Course>(query, values);
    return result.rows;
  } catch (e) {
    throw e;
  }
}

export async function selectCourseBySlug(
  slug: string,
  page: number = 1,
  perPage: number = 5,
): Promise<CourseWithReviews> {
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

    const result = await pool.query<Course>(query, [slug]);
    const course_id: number | undefined = result.rows?.[0]?.id;
    if (!course_id) {
      throw new Error("Курс не найден");
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

    const reviews = await pool.query<CourseReview>(reviewsQuery, [
      course_id,
      perPage,
      offset,
    ]);
    return { ...result.rows[0], reviews: reviews.rows };
  } catch (e) {
    throw e;
  }
}

export async function selectCategories(): Promise<Category[]> {
  try {
    const query = "SELECT * FROM categories";
    const result = await pool.query<Category>(query);
    return result.rows;
  } catch (e) {
    throw e;
  }
}

export async function insertCategory(name: string) {
  const query = "INSERT INTO categories (name) VALUES ($1) RETURNING *";
  await pool.query(query, [name]);
}

export async function insertCourse(data: CoursePayload): Promise<Course> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const result = await client.query<Course>(
      `INSERT INTO courses (slug, poster, name, author, description, language, duration, is_free, price, lessons)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        data.slug, data.poster, data.name, data.author, data.description,
        data.language, data.duration, data.is_free, data.price,
        JSON.stringify(data.lessons ?? []),
      ],
    );

    const course = result.rows[0];

    for (const categoryId of data.categoryIds ?? []) {
      await client.query(
        "INSERT INTO course_categories (course_id, category_id) VALUES ($1, $2)",
        [course.id, categoryId],
      );
    }

    await client.query("COMMIT");
    return course;
  } catch (err) {
    await client.query("ROLLBACK");
    if ((err as { code?: string }).code === "23505") {
      throw new Error("SLUG_CONFLICT");
    }
    throw err;
  } finally {
    client.release();
  }
}

export async function updateCourse(slug: string, data: CoursePayload): Promise<Course> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const result = await client.query<Course>(
      `UPDATE courses
       SET slug = $1, poster = $2, name = $3, author = $4, description = $5,
           language = $6, duration = $7, is_free = $8, price = $9, lessons = $10
       WHERE slug = $11
       RETURNING *`,
      [
        data.slug, data.poster, data.name, data.author, data.description,
        data.language, data.duration, data.is_free, data.price,
        JSON.stringify(data.lessons ?? []), slug,
      ],
    );

    if (!result.rows[0]) {
      throw new Error("NOT_FOUND");
    }

    const course = result.rows[0];

    await client.query("DELETE FROM course_categories WHERE course_id = $1", [course.id]);

    for (const categoryId of data.categoryIds ?? []) {
      await client.query(
        "INSERT INTO course_categories (course_id, category_id) VALUES ($1, $2)",
        [course.id, categoryId],
      );
    }

    await client.query("COMMIT");
    return course;
  } catch (err) {
    await client.query("ROLLBACK");
    if ((err as { code?: string }).code === "23505") {
      throw new Error("SLUG_CONFLICT");
    }
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteCourse(slug: string): Promise<boolean> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const courseRes = await client.query<{ id: number }>(
      "SELECT id FROM courses WHERE slug = $1",
      [slug],
    );

    if (!courseRes.rows[0]) {
      await client.query("ROLLBACK");
      return false;
    }

    const courseId = courseRes.rows[0].id;

    await client.query("DELETE FROM course_categories WHERE course_id = $1", [courseId]);
    await client.query("DELETE FROM courses WHERE id = $1", [courseId]);

    await client.query("COMMIT");
    return true;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function insertCourseReview(
  course_id: number,
  user_id: number,
  rating: number,
  comment: string | null,
): Promise<NewReview> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const insertRes = await client.query<NewReview>(
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

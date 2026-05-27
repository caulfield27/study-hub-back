import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_CONNECTION,
});

export default pool;

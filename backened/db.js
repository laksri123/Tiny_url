import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

// TEST CONNECTION
pool
  .query("SELECT NOW()")
  .then(() => console.log("✅ Connected to PostgreSQL (Render)"))
  .catch((err) => console.error("❌ Database connection error:", err));

export default pool;

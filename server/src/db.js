import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function ensureSchema() {
  const dim = process.env.EMBEDDING_DIMENSIONS || "768";
  const sql = fs
    .readFileSync(path.join(__dirname, "db", "schema.sql"), "utf8")
    .replaceAll("{{DIM}}", dim);
  await pool.query(sql);
}

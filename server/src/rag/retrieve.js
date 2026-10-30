import { pool } from "../db.js";
import { embed } from "../ollama.js";

export const TOP_K = Number(process.env.RETRIEVAL_TOP_K || 6);
export const MIN_SCORE = 0.35;

// Read from the chunks table rather than the content folder, so the list
// reflects what was actually ingested, not just what's on disk.
export async function listSources() {
  const { rows } = await pool.query(`SELECT DISTINCT source FROM chunks ORDER BY source`);
  return rows.map((r) => r.source);
}

export async function retrieve(question) {
  const queryEmbedding = await embed(question);
  const vectorLiteral = `[${queryEmbedding.join(",")}]`;

  const { rows } = await pool.query(
    `SELECT source, content, 1 - (embedding <=> $1) AS score
     FROM chunks
     ORDER BY embedding <=> $1
     LIMIT $2`,
    [vectorLiteral, TOP_K]
  );

  return rows
    .filter((r) => Number(r.score) >= MIN_SCORE)
    .map((r) => ({
      source: r.source,
      score: Number(r.score),
      snippet: r.content.length > 220 ? `${r.content.slice(0, 220)}…` : r.content,
      content: r.content,
    }));
}

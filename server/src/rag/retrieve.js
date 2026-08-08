import { pool } from "../db.js";
import { embed } from "../ollama.js";

const TOP_K = Number(process.env.RETRIEVAL_TOP_K || 6);
export const MIN_SCORE = 0.35;

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

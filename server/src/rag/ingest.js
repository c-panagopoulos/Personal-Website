import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool, ensureSchema } from "../db.js";
import { embed } from "../ollama.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, "..", "..", "content");

function chunkText(text, maxLen = 700, overlap = 150) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const chunks = [];
  let current = "";
  for (const para of paragraphs) {
    if (current && (current.length + para.length + 2) > maxLen) {
      chunks.push(current);
      current = current.slice(-overlap) + "\n\n" + para;
    } else {
      current = current ? `${current}\n\n${para}` : para;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

async function main() {
  await ensureSchema();

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  if (!files.length) {
    console.log(`No content files found in ${CONTENT_DIR}`);
    return;
  }

  for (const file of files) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const text = raw.replace(/<!--[\s\S]*?-->/g, "").trim();
    const chunks = chunkText(text);
    console.log(`Ingesting ${file}: ${chunks.length} chunk(s)`);

    await pool.query(`DELETE FROM chunks WHERE source = $1 AND chunk_index >= $2`, [file, chunks.length]);

    for (let i = 0; i < chunks.length; i++) {
      const embedding = await embed(chunks[i]);
      const vectorLiteral = `[${embedding.join(",")}]`;
      await pool.query(
        `INSERT INTO chunks (source, chunk_index, content, embedding)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (source, chunk_index)
         DO UPDATE SET content = EXCLUDED.content, embedding = EXCLUDED.embedding`,
        [file, i, chunks[i], vectorLiteral]
      );
    }
  }

  console.log("Ingestion complete.");
  await pool.end();
}

main().catch((err) => {
  console.error("Ingestion failed:", err.message);
  process.exit(1);
});

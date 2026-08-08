import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool, ensureSchema } from "../db.js";
import { embed } from "../ollama.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, "..", "..", "content");

// Sentence-aware packing, ported from the real Hermes backend's chunker
// (server/src/routes/chat.js's sibling project — private repo, read directly
// off disk): splits on sentence boundaries so a chunk never gets cut
// mid-sentence, and overlap is measured in words carried from the tail of
// one chunk into the start of the next, not raw characters.
function chunkText(text, chunkSize = 500, overlap = 50) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks = [];
  let current = "";

  for (const sentence of sentences) {
    if ((current + sentence).length > chunkSize && current.length > 0) {
      chunks.push(current.trim());
      const words = current.split(" ");
      current = words.slice(-overlap).join(" ") + " " + sentence;
    } else {
      current += sentence;
    }
  }

  if (current.trim()) chunks.push(current.trim());
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

const BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text";

export async function embed(text) {
  const res = await fetch(`${BASE_URL}/api/embeddings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: EMBED_MODEL, prompt: text }),
  });
  if (!res.ok) {
    throw new Error(`Ollama embeddings request failed (${res.status}). Is Ollama running with ${EMBED_MODEL} pulled?`);
  }
  const data = await res.json();
  return data.embedding;
}

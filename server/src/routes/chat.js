import { Router } from "express";
import { retrieve, MIN_SCORE } from "../rag/retrieve.js";
import { chatStream } from "../groq.js";

const router = Router();

const SYSTEM_PROMPT = `You are the portfolio assistant for Charalampos Panagopoulos, a full-stack developer.
Answer ONLY using the provided context. If the context doesn't contain the answer, say plainly that you
don't have that indexed rather than guessing. Keep answers to 2-4 sentences, first person as Charalampos.`;

function sseWrite(res, event, data) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

router.post("/chat", async (req, res) => {
  const { question } = req.body || {};
  if (!question || typeof question !== "string") {
    res.status(400).json({ error: "question is required" });
    return;
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  try {
    const chunks = await retrieve(question);
    sseWrite(res, "sources", {
      threshold: MIN_SCORE,
      chunks: chunks.map(({ source, score, snippet, content }) => ({ source, score, snippet, content })),
    });

    const context = chunks.length
      ? chunks.map((c) => `Source: ${c.source}\n${c.content}`).join("\n\n---\n\n")
      : "No indexed context matched this question.";

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Context:\n${context}\n\nQuestion: ${question}` },
    ];

    await chatStream(messages, (token) => {
      sseWrite(res, "token", token);
    });

    sseWrite(res, "done", {});
  } catch (err) {
    sseWrite(res, "error", { message: err.message || "Assistant error" });
  } finally {
    res.end();
  }
});

export default router;

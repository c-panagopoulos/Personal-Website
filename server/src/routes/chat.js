import { Router } from "express";
import rateLimit from "express-rate-limit";
import { retrieve, MIN_SCORE } from "../rag/retrieve.js";
import { chatStream } from "../groq.js";

const router = Router();

// Overridable via the SYSTEM_PROMPT env var (single-line — .env/docker
// compose interpolation doesn't handle real newlines) so it can be tuned
// without a code change. Falls back to this default when unset.
const DEFAULT_SYSTEM_PROMPT =
  "You are the portfolio assistant for Charalampos Panagopoulos, a full-stack developer. Answer as him, in first person. Answer ONLY using the provided context. If the context doesn't contain the answer, say plainly that you don't have that indexed rather than guessing. Be concise: 1-3 sentences that directly answer what was asked, never more. Skip context details that aren't relevant to this specific question even if they're interesting, and don't repeat or restate the question before answering.";
const SYSTEM_PROMPT = process.env.SYSTEM_PROMPT || DEFAULT_SYSTEM_PROMPT;

const MAX_QUESTION_LENGTH = 500;
const GENERIC_ERROR_MESSAGE =
  "Something broke on my end, not yours. The model or retrieval pipeline hit a snag, try again in a bit.";

// Each request here costs a real (paid) Groq call plus a retrieval pass, so
// this is deliberately tighter than a typical API rate limit.
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      type: "rate_limited",
      message: "Slow down, that's faster than I can retrieve.",
    });
  },
});

function sseWrite(res, event, data) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

router.post("/chat", chatLimiter, async (req, res) => {
  const { question } = req.body || {};
  if (!question || typeof question !== "string") {
    res.status(400).json({ type: "bad_input", message: "question is required" });
    return;
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    res.status(400).json({ type: "bad_input", message: "That's a lot to ask at once, try a shorter question." });
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
    // The real error (DB down, Groq quota, whatever) is only useful
    // server-side — the client gets a friendly, in-character message
    // instead of a raw error string that could leak internals.
    console.error("chat stream error:", err);
    sseWrite(res, "error", { type: "generic", message: GENERIC_ERROR_MESSAGE });
  } finally {
    res.end();
  }
});

export default router;

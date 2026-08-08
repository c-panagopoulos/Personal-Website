# Hermes — AI Customer Service Chatbot

Hermes is a production-ready AI chatbot built for Lumio, a fictional e-commerce platform. It combines a
polished React frontend with a custom Node.js backend that implements Retrieval-Augmented Generation (RAG),
token streaming over SSE, session tracking, and automatic human-handoff escalation. The backend is private;
the frontend repo's README covers the full architecture.

Live demo: https://hermes.cpanagopoulos.dev — deployed on Vercel with a custom Cloudflare domain, connecting
to the private Hermes backend running on a cloud server.

## Features

Chat interface: real-time token streaming (responses appear word-by-word via Server-Sent Events), markdown
rendering, per-conversation session IDs tracked on the backend, animated message entry (GSAP), an animated
WebGL starfield background (OGL), auto-scroll, and multilingual replies (optimised for English and Greek).

Admin panel (JWT-protected): a stats dashboard (total sessions, escalation rate, containment rate, average
messages per session, average handle time, a 30-day daily chart, live polling every 30 seconds), and a
document-ingestion screen — drag-and-drop PDF or TXT upload straight into the RAG knowledge base.

Escalation system: the AI detects when a customer mentions lawyers or formal complaints and flags the
conversation for human review. When escalation triggers, the frontend fires a webhook with the full
conversation history, the backend marks the session as escalated in the database, and the UI reflects the
escalated state.

## Architecture

The React frontend talks to the private Hermes backend (Express 5) over REST and SSE: `/api/chat` streams
answers, `/api/session/start` and `/api/session/end` manage the UUID session lifecycle, `/api/ingest` feeds
the RAG pipeline, `/api/stats` powers the admin analytics, and `/api/register` plus `/api/login` handle
admin auth. PostgreSQL stores three tables: sessions (id, created_at, ended_at, message_count, escalated),
messages (role, content, session_id), and documents (content, embedding, source) for the RAG knowledge base.

## Backend deep dive

RAG pipeline: documents (PDF or plain text) are chunked using a sentence-aware algorithm with configurable
size and overlap to avoid cutting mid-sentence. Each chunk is embedded with `text-embedding-3-small` and
stored in PostgreSQL via pgvector. At query time the user message is embedded and the top-k most similar
chunks (above a cosine similarity threshold) are injected into the system prompt as context. The knowledge
base for this instance is two FAQ files covering Lumio's policies, shipping, returns, and account
management, in both English and Greek.

Streaming over SSE: `/api/chat` streams the LLM response token by token using the OpenAI-compatible
streaming API, which works against both Ollama and Groq. Each token is serialized as an SSE `data:` event;
a final `done` event carries the escalation flag. The frontend consumes this with the Streams API
(`response.body.getReader()`), appending tokens directly to the last message in state — no buffering, no
delay.

Session tracking: every chat session gets a UUID. Messages are written to the database in real time (user
message before the LLM call, assistant message after). The `sessions` table records creation time, end
time, message count, and escalation status, feeding the admin stats dashboard.

Escalation & webhook: a regex runs on every completed LLM response. If it matches escalation keywords
(`lawyer`, `complaint`, `human agent`, etc.), the backend sets `escalate: true` in the SSE done event. The
frontend then POSTs the full conversation history to a configurable webhook URL (e.g. an n8n or Zapier
automation).

Rate limiting: two layers via `express-rate-limit` — a general 50 req / 15 min limit on all `/api` routes,
and a stricter 10 req / 1 min limit on `/api/chat` specifically.

Authentication: admin routes (`/api/ingest`, `/api/stats`) are protected with JWT. Passwords are hashed
with bcrypt. The frontend stores the token in `localStorage` and sends it as a `Bearer` header.

## Tech stack

Frontend — React 19, Vite 8, Tailwind CSS v4 + shadcn/ui, GSAP 3 + Motion (Framer Motion) + animate-ui, OGL
for the WebGL stars background, react-markdown, deployed on Vercel.

Backend — Node.js (ESM), Express 5, PostgreSQL + pgvector, OpenAI text-embedding-3-small for embeddings,
Groq (llama-3.1-8b-instant) as the production LLM, Ollama (local GGUF) for development, JWT + bcrypt for
auth, pdfjs-dist for PDF parsing, express-rate-limit, n8n for the escalation webhook.

## Project structure

The frontend's `App.jsx` owns session lifecycle and SSE chat logic. Components are split into `Chat/`
(message list, loading indicator, end button, welcome message), `Controls/` (input field and send button),
`Admin/` (sidebar layout, stats, drag-and-drop document ingestion, bento grid), `Login/` (JWT login form),
plus `animate-ui/` for animation primitives and `ui/` for shadcn components and custom wrappers. Reusable
hooks live in `hooks/`, utility functions in `lib/`.

MIT licensed.

<h1 align="center">🌐 Personal Portfolio — React + Express + pgvector + Ollama</h1>
<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/pgvector-3B82F6?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Ollama-000000?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
</p>
<p align="center">
  <strong>My portfolio as a full-stack developer — with a retrieval-augmented assistant that answers
  questions about me from my own CV, project notes and homelab docs, embedding locally via Ollama and
  answering via Groq.</strong>
</p>

---

## Architecture

A single-page React app talks to an Express API. The API embeds the incoming question locally via Ollama,
retrieves the closest chunks from a Postgres table via `pgvector`, and streams a grounded answer back from
Groq over Server-Sent Events. Postgres, Ollama, and the app itself run from one `docker compose up`, the
same "single-image Docker, own hardware" pattern used by the other projects the site describes — Groq is
the one hosted piece, kept for chat-generation speed.

```
client/    React (Vite) — the whole page, including the assistant UI
server/    Express API — /api/chat (SSE), retrieval + Groq orchestration
  content/ Markdown source docs embedded for retrieval
```

## Running it locally

```bash
cp .env.example .env
```

Add a `GROQ_API_KEY` to `.env` (free at https://console.groq.com/keys) — this is what generates the
assistant's answers. Then:

```bash
docker compose up --build
```

Pull the embedding model Ollama needs (first run only):

```bash
docker compose exec ollama ollama pull nomic-embed-text
```

Index the content so the assistant has something to retrieve from:

```bash
npm install
npm run ingest
```

The site is then served at `http://localhost:3100` (mapped from the container's internal port 3000 to
avoid clashing with anything already using 3000 on the host — change the `app` port mapping in
`docker-compose.yml` if you'd rather use a different one).

### Without Docker
Install Postgres (with the `vector` extension) and Ollama yourself, point `.env` at them (plus
`GROQ_API_KEY`), then:
```bash
npm install
npm run dev:server   # Express API on :3000
npm run dev:client   # Vite dev server on :5173, proxies /api to :3000
```

## The assistant's content
`server/content/*.md` holds the CV, about-me, and project/homelab notes the assistant retrieves from. Edit
those files (or add new ones — any `.md` file in that directory gets picked up), then re-run
`npm run ingest` — it's idempotent, so re-running it after edits just re-embeds and upserts the changed
chunks.

## Tech Stack
- **React** (Vite) — frontend
- **Express** — API, SSE streaming, static file serving
- **PostgreSQL + pgvector** — chunk storage and cosine-similarity retrieval
- **Ollama** — local embeddings (`nomic-embed-text`), no external API key needed for retrieval
- **Groq** — chat generation (`llama-3.3-70b-versatile` by default), fast hosted inference
- **Docker / Docker Compose** — one command spins up the whole stack

## Author
**Charalampos Panagopoulos**
Full-Stack Web Developer
Passionate about self-hosting, automation, and building AI-powered tools that solve real problems.

🔗 GitHub: https://github.com/c-panagopoulos

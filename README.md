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
  questions about me from my own CV, project notes and homelab docs, running entirely on local Ollama models.</strong>
</p>

---

## Architecture

A single-page React app talks to an Express API. The API embeds the incoming question, retrieves the
closest chunks from a Postgres table via `pgvector`, and streams a grounded answer back from a local Ollama
model over Server-Sent Events. Everything — Postgres, Ollama, and the app itself — runs from one
`docker compose up`, the same "single-image Docker, own hardware" pattern used by the other projects the
site describes.

```
client/    React (Vite) — the whole page, including the assistant UI
server/    Express API — /api/chat (SSE), retrieval + Ollama orchestration
  content/ Markdown source docs embedded for retrieval (placeholders — see below)
```

## Running it locally

```bash
cp .env.example .env
docker compose up --build
```

Then pull the models Ollama needs (first run only):

```bash
docker compose exec ollama ollama pull nomic-embed-text
docker compose exec ollama ollama pull llama3.2:3b
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
Install Postgres (with the `vector` extension) and Ollama yourself, point `.env` at them, then:
```bash
npm install
npm run dev:server   # Express API on :3000
npm run dev:client   # Vite dev server on :5173, proxies /api to :3000
```

## The assistant's content
`server/content/*.md` currently holds **placeholder** text (CV, about-me, project and homelab notes) so the
pipeline works out of the box. Replace those files with the real thing, then re-run `npm run ingest` — it's
idempotent, so re-running it after edits just re-embeds and upserts the changed chunks.

## Tech Stack
- **React** (Vite) — frontend
- **Express** — API, SSE streaming, static file serving
- **PostgreSQL + pgvector** — chunk storage and cosine-similarity retrieval
- **Ollama** — local embeddings (`nomic-embed-text`) and chat generation (`llama3.2:3b`), no external API keys
- **Docker / Docker Compose** — one command spins up the whole stack

## Author
**Charalampos Panagopoulos**
Full-Stack Web Developer
Passionate about self-hosting, automation, and building AI-powered tools that solve real problems.

🔗 GitHub: https://github.com/c-panagopoulos

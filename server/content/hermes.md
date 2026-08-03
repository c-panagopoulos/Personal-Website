<!-- PLACEHOLDER CONTENT — replace with your real Hermes README/notes, then re-run `npm run ingest`. -->

# Hermes — AI Customer Service Chatbot

Hermes is a production-oriented RAG chatbot designed to answer customer questions from real internal
documentation instead of hallucinating.

## Architecture
- Custom retrieval pipeline over PostgreSQL + pgvector: incoming questions are embedded, matched against
  indexed document chunks, and only the top matches are passed to the model as context
- Real-time token streaming to the browser over Server-Sent Events, so answers appear as they're generated
  instead of all at once
- JWT-protected admin dashboard with live analytics on question volume and unanswered queries
- Escalation via n8n: when a customer seems dissatisfied, a webhook automatically opens a case in
  Salesforce for a human agent to pick up

## Deployment
Dockerized and self-hosted on a Hetzner VPS. The same retrieval-then-generate pattern used here is what
powers the assistant on this portfolio site, just pointed at personal documents (CV, project notes) instead
of a support knowledge base, and running fully on local Ollama models instead of a hosted API.

## Lesson learned
The hardest part wasn't the model — it was making the system honest about what it doesn't know. Citing
sources and refusing to answer when nothing relevant was retrieved mattered more than raw model quality.

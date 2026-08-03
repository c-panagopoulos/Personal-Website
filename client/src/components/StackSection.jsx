import Reveal from "./Reveal.jsx";
import { useChat } from "../hooks/useChat.js";
import { RetrievalStatus, SourceChips, ThinkingDots } from "./RetrievalStatus.jsx";

const STACK = [
  { name: "React", where: "client/, Vite build", note: "hooks-only, no state library" },
  { name: "Express", where: "server/, single process", note: "serves the API and the built client" },
  { name: "PostgreSQL + pgvector", where: "one container, one volume", note: "cosine similarity search" },
  { name: "Ollama", where: "own container, own hardware", note: "embeddings + chat, no API keys" },
  { name: "Docker Compose", where: "one `docker compose up`", note: "matches the homelab habit" },
  { name: "Server-Sent Events", where: "POST /api/chat", note: "tokens streamed, not polled" },
  { name: "Vite", where: "client/ build tool", note: "fast dev server, small bundles" },
];

export default function StackSection() {
  const chat = useChat();

  return (
    <div id="stack" className="stack-section">
      <Reveal className="stack-section__head">
        <span className="stack-section__head-label">STACK</span>
        <span className="stack-section__head-rule" />
        <span className="stack-section__head-note">EVERY ROW IS A QUESTION</span>
      </Reveal>
      <p className="stack-section__lede">
        No proficiency bars. Each line says where the thing actually runs — click it and the assistant defends it.
      </p>
      <Reveal className="stack-grid">
        {STACK.map((s) => (
          <button key={s.name} className="stack-row" onClick={() => chat.ask(`Why did you choose ${s.name}?`)}>
            <span className="stack-row__meta">
              <span className="stack-row__name">{s.name}</span>
              <span className="stack-row__where">
                {s.where} · {s.note}
              </span>
            </span>
            <span className="stack-row__ask">ask ❯</span>
          </button>
        ))}
      </Reveal>
      {chat.open && (
        <div className="stack-answer">
          <div className="assistant-card__question">&gt; {chat.question}</div>
          {chat.isRetrieving && <RetrievalStatus note="" />}
          {chat.showSources && <SourceChips sources={chat.sources} />}
          {chat.isThinking && <ThinkingDots note="" />}
          {chat.hasText && (
            <p className="assistant-card__answer" style={{ fontSize: ".96rem" }}>
              {chat.text}
              {!chat.done && <span className="caret">▍</span>}
            </p>
          )}
          {chat.error && <p className="chat-bubble__text--muted">{chat.error}</p>}
        </div>
      )}
    </div>
  );
}

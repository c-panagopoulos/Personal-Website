import { useChat } from "../hooks/useChat.js";
import ChatInput from "./ChatInput.jsx";
import { RetrievalStatus, SourceChips, ThinkingDots } from "./RetrievalStatus.jsx";
import DotField from "./DotField.jsx";

const CHIPS = [
  "What's Hermes?",
  "Tell me about tapstudy",
  "Why Ollama instead of a hosted API?",
  "Are you open to opportunities?",
];

const TEASER_CARDS = [
  { title: "tapstudy", score: "featured", body: "An NFC-triggered study tracker, Dockerized and running since day one.", tags: ["React", "Express", "PostgreSQL"] },
  { title: "Hermes", score: "featured", body: "A production RAG support chatbot with streamed answers and source citations.", tags: ["pgvector", "SSE", "Docker"] },
  { title: "Homelab", score: "featured", body: "One Intel N100, no open ports, everything reachable over Tailscale.", tags: ["Linux", "Tailscale", "n8n"] },
];

export default function Hero() {
  const chat = useChat();

  const cards = chat.sources.length
    ? chat.sources.map((s) => ({
        title: s.source,
        score: typeof s.score === "number" ? s.score.toFixed(2) : s.score,
        body: s.snippet || "",
        tags: [],
      }))
    : TEASER_CARDS;

  return (
    <div className="hero">
      <div className="hero__left">
        <div className="hero__byline">
          <img className="hero__avatar" src="/images/prof3.png" alt="Charalampos" />
          <span className="hero__label">CHARALAMPOS PANAGOPOULOS · FULL-STACK</span>
        </div>
        <h1 className="hero__title">I build the things I needed to exist.</h1>
        <p className="hero__subtitle">
          Every project below started as a friction in my own week — then got built, Dockerized and left running
          on my own hardware. Ask the assistant; it answers from my repos and CV.
        </p>

        <div className="hero__interact">
          {chat.open && (
            <div className="assistant-card shader-panel">
              <div className="shader-panel__canvas">
                <DotField
                  dotRadius={2.2}
                  dotSpacing={11}
                  bulgeStrength={26}
                  cursorRadius={180}
                  gradientFrom="rgba(166, 139, 139, 0.65)"
                  gradientTo="rgba(60, 56, 68, 0.4)"
                />
              </div>
              <div className="assistant-card__question">&gt; {chat.question}</div>
              {chat.isRetrieving && <RetrievalStatus note="searching indexed chunks · repos, cv, notes" />}
              {chat.isThinking && <ThinkingDots note="sources locked — writing an answer" />}
              {chat.hasText && (
                <p className="assistant-card__answer">
                  {chat.text}
                  {!chat.done && <span className="caret">▍</span>}
                </p>
              )}
              {chat.error && <p className="chat-bubble__text--muted">{chat.error}</p>}
              {chat.done && (
                <a className="assistant-card__jump" href="#scene-01">
                  see the projects ↓
                </a>
              )}
            </div>
          )}

          <ChatInput
            placeholder="Ask about the stack, the homelab, or whether I'd fit your team…"
            onSend={chat.ask}
          />

          <div className="chip-row">
            {CHIPS.map((label) => (
              <button key={label} className="chip" onClick={() => chat.ask(label)}>
                {label}
              </button>
            ))}
          </div>
          <div className="hero__hint">↓ or scroll — everything is still a normal page</div>
        </div>
      </div>

      <div className="hero__right">
        <div className="hero__panel-head">
          <span className="hero__panel-label">{chat.showSources ? "RETRIEVED SOURCES" : "FEATURED"}</span>
          {chat.showSources && <span className="live-dot">● live</span>}
        </div>
        {chat.showSources && <SourceChips sources={chat.sources} />}
        {cards.map((card) => (
          <div className="card" key={card.title}>
            <div className="card__head">
              <span className="card__title">{card.title}</span>
              <span className="card__score">{card.score}</span>
            </div>
            {card.body && <p className="card__body">{card.body}</p>}
            {card.tags?.length > 0 && (
              <div className="card__tags">
                {card.tags.map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        <div className="hero__footnote">pgvector · top-k 4 · ollama, local</div>
      </div>
    </div>
  );
}

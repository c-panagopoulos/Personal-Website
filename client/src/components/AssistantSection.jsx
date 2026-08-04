import { useChat } from "../hooks/useChat.js";
import ChatInput from "./ChatInput.jsx";
import { RetrievalStatus, SourceChips, ThinkingDots } from "./RetrievalStatus.jsx";
import DotField from "./DotField.jsx";

const CHIPS = [
  "Walk me through the RAG pipeline",
  "What breaks most often in the homelab?",
  "Why pgvector over a managed vector DB?",
  "What would you build next?",
];

export default function AssistantSection() {
  const chat = useChat();

  return (
    <div id="assistant" className="assistant-section">
      <div className="assistant-section__topbar">
        <div className="nav__brand">
          <div className="nav__mark" style={{ width: 26, height: 26 }}>
            cp
          </div>
          <span className="nav__name">assistant</span>
          <span className="hero__panel-label">· RETRIEVAL ONLINE</span>
        </div>
        <span className="hero__label">INTERMISSION</span>
      </div>
      <div className="assistant-section__body">
        <div className="assistant-section__sidebar">
          <div>
            <div className="assistant-section__sidebar-block-label">SOURCES INDEXED</div>
            <div className="assistant-section__sidebar-block-value">
              cv.md
              <br />
              tapstudy.md
              <br />
              hermes.md
              <br />
              about-me.md
            </div>
          </div>
          <div>
            <div className="assistant-section__sidebar-block-label">RETRIEVAL</div>
            <div className="assistant-section__sidebar-block-value">pgvector · cosine · top-k 4</div>
          </div>
          <div>
            <div className="assistant-section__sidebar-block-label">MODEL</div>
            <div className="assistant-section__sidebar-block-value">
              ollama, local
              <br />
              embeddings + chat
            </div>
          </div>
          <div className="assistant-section__sidebar-footnote">
            IT ONLY ANSWERS FROM
            <br />
            WHAT IT CAN CITE
          </div>
        </div>
        <div className="assistant-section__main shader-panel shader-panel--vignette">
          <div className="shader-panel__canvas">
            <DotField
              dotRadius={2.6}
              dotSpacing={11}
              bulgeStrength={26}
              cursorRadius={180}
              gradientFrom="rgba(55, 138, 221, 0.85)"
              gradientTo="rgba(42, 58, 82, 0.55)"
              pulseActive={chat.open && !chat.done}
              pulseColor="#a9c9f5"
            />
          </div>
          <div className="shader-panel__fade shader-panel__fade--x" />
          <div className="shader-panel__fade shader-panel__fade--y" />
          <h3 className="assistant-section__title">
            Stop reading about me.
            <br />
            Ask instead.
          </h3>
          <p className="assistant-section__subtitle">
            This is the same assistant I built for Hermes, pointed at my own repos and CV. It shows the chunks it
            used, so you can catch it being wrong.
          </p>

          <div className="chat-thread">
            {chat.open && (
              <div className="chat-turn">
                <div className="chat-bubble--user">{chat.question}</div>
                {chat.isRetrieving && <RetrievalStatus note="searching indexed chunks · repos, cv, notes" />}
                {chat.showSources && <SourceChips sources={chat.sources} />}
                {chat.isThinking && <ThinkingDots note="" />}
                {chat.hasText && (
                  <div className="chat-bubble--assistant">
                    <div className="chat-bubble__avatar">cp</div>
                    <p className="chat-bubble__text">
                      {chat.text}
                      {!chat.done && <span className="caret">▍</span>}
                    </p>
                  </div>
                )}
                {chat.error && <p className="chat-bubble__text--muted">{chat.error}</p>}
              </div>
            )}
          </div>

          <div className="assistant-section__composer">
            <div className="chip-row" style={{ marginBottom: 14 }}>
              {CHIPS.map((label) => (
                <button key={label} className="chip chip--ghost" onClick={() => chat.ask(label)}>
                  {label}
                </button>
              ))}
            </div>
            <ChatInput variant="assistant" placeholder="Ask anything about the work above…" onSend={chat.ask} />
          </div>
        </div>
      </div>
    </div>
  );
}

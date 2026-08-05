import Reveal from "./Reveal.jsx";
import { useChat } from "../hooks/useChat.js";
import { RetrievalStatus, SourceChips, ThinkingDots } from "./RetrievalStatus.jsx";
import DotField from "./DotField.jsx";

const STACK_GROUPS = [
  { label: "Frontend", items: ["React", "Vite"] },
  { label: "Backend", items: ["Express", "SSE"] },
  { label: "Data", items: ["Postgres", "pgvector"] },
  { label: "Infrastructure", items: ["Docker", "Linux", "Tailscale"] },
  { label: "AI", items: ["Ollama", "RAG"] },
];

export default function StackSection() {
  const chat = useChat();

  return (
    <div id="stack" className="stack-section">
      <Reveal className="stack-section__head">
        <span className="stack-section__head-label">STACK</span>
        <span className="stack-section__head-rule" />
        <span className="stack-section__head-note">EVERY ITEM IS A QUESTION</span>
      </Reveal>
      <p className="stack-section__lede">
        No proficiency bars. Click anything below and the assistant defends the choice.
      </p>

      <div className="stack-layout">
        <Reveal className="stack-groups">
          {STACK_GROUPS.map((group, i) => (
            <div className="stack-group" key={group.label}>
              <div className="stack-group__label">{group.label}</div>
              <div className="stack-tags">
                {group.items.map((name) => (
                  <button
                    key={name}
                    className={"stack-tag" + (chat.question === `Why did you choose ${name}?` ? " stack-tag--active" : "")}
                    onClick={() => chat.ask(`Why did you choose ${name}?`)}
                  >
                    {name}
                  </button>
                ))}
              </div>
              {i < STACK_GROUPS.length - 1 && <div className="stack-group__divider" />}
            </div>
          ))}
        </Reveal>

        <div className="stack-answer-panel shader-panel">
          <div className="shader-panel__canvas">
            <DotField
              dotRadius={2.2}
              dotSpacing={11}
              bulgeStrength={26}
              cursorRadius={180}
              gradientFrom="rgba(211, 218, 217, 0.3)"
              gradientTo="rgba(68, 68, 78, 0.4)"
              pulseActive={chat.open && !chat.done}
              pulseColor="#9c8683"
            />
          </div>
          {chat.open ? (
            <div className="stack-answer">
              <div className="assistant-card__question">&gt; {chat.question}</div>
              {chat.isRetrieving && <RetrievalStatus note="" />}
              {chat.showSources && <SourceChips sources={chat.sources} />}
              {chat.isThinking && <ThinkingDots note="" />}
              {chat.hasText && (
                <p className="assistant-card__answer">
                  {chat.text}
                  {!chat.done && <span className="caret">▍</span>}
                </p>
              )}
              {chat.error && <p className="chat-bubble__text--muted">{chat.error}</p>}
            </div>
          ) : (
            <div className="stack-answer-panel__idle">
              <span className="stack-answer-panel__idle-label">STACK Q&amp;A</span>
              <p>Click anything on the left to see why it&rsquo;s there.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

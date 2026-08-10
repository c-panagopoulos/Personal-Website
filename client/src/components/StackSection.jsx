import { useChat } from "../hooks/useChat.js";
import { RetrievalStatus, SourceChips, ThinkingDots } from "./RetrievalStatus.jsx";
import DotField from "./DotField.jsx";
import { useSceneTrigger } from "../hooks/useSceneTrigger.js";
import { anim } from "../lib/anim.js";

const STACK_GROUPS = [
  { label: "Frontend", items: ["React", "Vite"] },
  { label: "Backend", items: ["Express", "SSE"] },
  { label: "Data", items: ["Postgres", "pgvector"] },
  { label: "Infrastructure", items: ["Docker", "Linux", "Tailscale"] },
  { label: "AI", items: ["Ollama"] },
];

export default function StackSection() {
  const chat = useChat();
  const [ref, visible] = useSceneTrigger({ threshold: 0.15 });

  return (
    <div id="stack" className="stack-section" ref={ref}>
      <div className="stack-section__inner">
        <div className="stack-section__head">
          <h2 className="stack-section__head-label" style={anim(visible, "rowRise", 0.4, 0.1)}>
            STACK
          </h2>
          <span className="stack-section__head-rule" style={anim(visible, "ruleGrow", 0.55, 0.25)} />
          <span className="stack-section__head-note" style={anim(visible, "rowRise", 0.4, 0.1)}>
            EVERY ITEM IS A QUESTION
          </span>
        </div>
        <p className="stack-section__lede" style={anim(visible, "sceneRiseBlur", 0.6, 0.5)}>
          No proficiency bars. Click anything below and the assistant defends the choice.
        </p>

        <div className="stack-panel">
          <div className="stack-groups">
            {STACK_GROUPS.map((group, gi) => (
              <div className="stack-group" key={group.label} style={anim(visible, "rowRise", 0.4, 0.9 + gi * 0.1)}>
                <div className="stack-group__head">
                  <span className="stack-group__label">{group.label}</span>
                  <span className="stack-group__rule" />
                </div>
                <div className="stack-tags">
                  {group.items.map((name, ti) => (
                    <button
                      key={name}
                      className={"stack-tag" + (chat.question === `Why did you choose ${name}?` ? " stack-tag--active" : "")}
                      onClick={() => chat.ask(`Why did you choose ${name}?`)}
                      style={anim(visible, "tagPop", 0.4, 1.0 + gi * 0.1 + ti * 0.06)}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="stack-panel__divider" style={anim(visible, "dividerGrow", 0.8, 1.5)} />

          <div className="stack-answer-panel shader-panel" style={anim(visible, "panelFade", 0.6, 1.7, "ease")}>
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
                  <p className="assistant-card__answer" aria-live="polite">
                    {chat.text}
                    {!chat.done && <span className="caret" aria-hidden="true">▍</span>}
                  </p>
                )}
                {chat.error && <p className="chat-bubble__text--muted">{chat.error}</p>}
              </div>
            ) : (
              <div className="stack-answer-panel__idle" style={anim(visible, "sceneRiseBlur", 0.5, 1.9)}>
                <span className="stack-answer-panel__idle-label">STACK Q&amp;A</span>
                <p>Click anything on the left to see why it&rsquo;s there.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef } from "react";
import { useSharedChat } from "../context/ChatContext.jsx";
import ChatInput from "./ChatInput.jsx";
import { RetrievalStatus, RetrievedChunks, SourceChips, ThinkingDots } from "./RetrievalStatus.jsx";
import DotField from "./DotField.jsx";
import { useSceneTrigger } from "../hooks/useSceneTrigger.js";
import { anim } from "../lib/anim.js";

const CHIPS = [
  "How does this assistant retrieve information?",
  "What breaks most often in the homelab?",
  "Why pgvector over a managed vector DB?",
  "What would you build next?",
];

function ChatTurn({ turn }) {
  // Each turn gets its own fresh scroll trigger instead of reusing the
  // section's single `visible` flag — that flag is one-shot and, once
  // fired, stays true forever, including on a visit where the visitor
  // already scrolled past this section earlier (e.g. explored the whole
  // page once) before coming back to Hero to ask a new question. In that
  // case the section-level flag is already true, so a message asked from
  // Hero would play its entrance animation immediately at click-time —
  // off-screen, finished long before they scroll down to see it. A
  // per-turn trigger checks this specific row's actual position the
  // moment it's created, regardless of the section's scroll history.
  const [rowRef, visible] = useSceneTrigger({ threshold: 0.1 });
  return (
    <>
      <div className="chat-row--user" ref={rowRef} style={anim(visible, "rise", 0.8)}>
        <div className="chat-bubble--user">{turn.question}</div>
      </div>
      {turn.isRetrieving && (
        <div style={anim(visible, "rise", 0.8)}>
          <RetrievalStatus note="searching indexed chunks · repos, cv, notes" />
        </div>
      )}
      {turn.showSources && !turn.hasText && (
        <div style={anim(visible, "rise", 0.8)}>
          <SourceChips sources={turn.sources} />
        </div>
      )}
      {turn.isThinking && (
        <div style={anim(visible, "rise", 0.8)}>
          <ThinkingDots note="" />
        </div>
      )}
      {turn.hasText && (
        <div className="chat-row--assistant" style={anim(visible, "rise", 0.8)}>
          <div className="chat-bubble__avatar">cp</div>
          <div className="chat-bubble__content">
            {turn.showSources && <SourceChips sources={turn.sources} />}
            <p className="chat-bubble__text">
              {turn.text}
              {!turn.done && <span className="caret">▍</span>}
            </p>
          </div>
        </div>
      )}
      {turn.error && <p className="chat-bubble__text--muted">{turn.error}</p>}
    </>
  );
}

export default function AssistantSection() {
  const chat = useSharedChat();
  const [ref, visible] = useSceneTrigger({ threshold: 0.15 });
  const threadRef = useRef(null);

  // Scroll only the bounded .chat-thread container itself, not
  // scrollIntoView — that walks up through every scrollable ancestor
  // including the page itself, which yanks the whole viewport down to this
  // section even when a question was asked from Hero's composer (Hero and
  // this section share one chat instance, so every history change fires
  // here regardless of which composer triggered it).
  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chat.history]);

  return (
    <div id="assistant" className="assistant-section" ref={ref}>
      <div className="assistant-section__topbar" style={anim(visible, "rowRise", 0.4, 0.15)}>
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
          <div className="assistant-section__sidebar-card" style={anim(visible, "rowRise", 0.4, 0.35)}>
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
          <div className="assistant-section__sidebar-row">
            <div className="assistant-section__sidebar-card" style={anim(visible, "rowRise", 0.4, 0.5)}>
              <div className="assistant-section__sidebar-block-label">RETRIEVAL</div>
              <div className="assistant-section__sidebar-block-value">
                pgvector
                <br />
                cosine · top-k 6
              </div>
            </div>
            <div className="assistant-section__sidebar-card" style={anim(visible, "rowRise", 0.4, 0.65)}>
              <div className="assistant-section__sidebar-block-label">MODEL</div>
              <div className="assistant-section__sidebar-block-value">
                ollama, local
                <br />
                groq — chat
              </div>
            </div>
          </div>
          {chat.sources.length > 0 && <RetrievedChunks sources={chat.sources} threshold={chat.threshold} />}
          <div className="assistant-section__sidebar-footnote" style={anim(visible, "rowRise", 0.4, 0.8)}>
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
              gradientFrom="rgba(211, 218, 217, 0.32)"
              gradientTo="rgba(68, 68, 78, 0.55)"
              pulseActive={chat.open && !chat.done}
              pulseColor="#9c8683"
            />
          </div>
          <div className="assistant-section__main-inner">
            <h3 className="assistant-section__title">
              <span style={{ display: "block", ...anim(visible, "titleWipe", 0.8, 1) }}>Stop reading about me.</span>
              <span style={{ display: "block", ...anim(visible, "titleWipe", 0.8, 1.15) }}>Ask instead.</span>
            </h3>
            <p className="assistant-section__subtitle" style={anim(visible, "sceneRiseBlur", 0.65, 1.5)}>
              This is the same assistant I built for Hermes, pointed at my own repos and CV. It shows the chunks it
              used, so you can catch it being wrong.
            </p>

            <div className="chat-thread" ref={threadRef}>
              {chat.history.map((turn, i) => (
                <ChatTurn key={i} turn={turn} />
              ))}
            </div>

            <div className="assistant-section__composer">
              <div className="chip-row" style={{ marginBottom: 14 }}>
                {CHIPS.map((label, i) => (
                  <button
                    key={label}
                    className="chip chip--ghost"
                    onClick={() => chat.ask(label, "assistant")}
                    style={anim(visible, "composerPop", 0.5, 1.8 + i * 0.05)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div style={anim(visible, "composerPop", 0.5, 1.95)}>
                <ChatInput
                  variant="assistant"
                  placeholder="Ask anything about the work above…"
                  onSend={(question) => chat.ask(question, "assistant")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

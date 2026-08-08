import { useEffect, useState } from "react";
import { useSharedChat } from "../context/ChatContext.jsx";
import ChatInput from "./ChatInput.jsx";
import { RetrievalStatus, SourceChips, ThinkingDots } from "./RetrievalStatus.jsx";

const CHIPS = [
  "What's Hermes?",
  "Tell me about tapstudy",
  "Why Ollama instead of a hosted API?",
  "Are you open to opportunities?",
];

const BYLINE = "CHARALAMPOS PANAGOPOULOS · FULL-STACK";
const SCRAMBLE_CHARS = "!<>-_\\/[]{}=+*^?#$%&";
const EASE = "cubic-bezier(0.2, 0.7, 0.2, 1)";

function randomScrambleChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

export default function Hero() {
  const chat = useSharedChat();
  const [bylineDisplay, setBylineDisplay] = useState("");

  useEffect(() => {
    let raf;
    const start = performance.now();
    const delay = 550;
    const duration = 850;
    const tick = (now) => {
      const elapsed = now - start - delay;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(1, elapsed / duration);
      const revealCount = Math.floor(progress * BYLINE.length);
      let out = "";
      for (let i = 0; i < BYLINE.length; i++) {
        const ch = BYLINE[i];
        out += ch === " " || ch === "·" ? ch : i < revealCount ? ch : randomScrambleChar();
      }
      setBylineDisplay(out);
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setBylineDisplay(BYLINE);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="hero">
      <div className="hero__backdrop" />
      <div className="hero__curtain hero__curtain--left" />
      <div className="hero__curtain hero__curtain--right" />
      <div className="hero__flare" />

      <div className="hero__left">
        <div className="hero__dotgrid" />

        <div className="hero__content">
          <div className="hero__byline">
            <img
              className="hero__avatar"
              src="/images/prof3.png"
              alt="Charalampos"
              style={{ animation: "avatarSpring 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.5s both" }}
            />
            <span className="hero__label" style={{ whiteSpace: "pre", minWidth: 1 }}>
              {bylineDisplay || " "}
            </span>
          </div>
          <h1 className="hero__title">
            <span style={{ display: "block", animation: `titleWipe 0.8s ${EASE} 1s both` }}>I build the</span>
            <span style={{ display: "block", animation: `titleWipe 0.8s ${EASE} 1.15s both` }}>things I needed</span>
            <span style={{ display: "block", animation: `titleWipe 0.8s ${EASE} 1.3s both` }}>to exist.</span>
          </h1>
          <p className="hero__subtitle" style={{ animation: `sceneRiseBlur 0.8s ${EASE} 1.7s both` }}>
            Ask the assistant below anything about the work that follows — it only answers from my repos and CV.
          </p>

          <div className="hero__interact">
            <div style={{ animation: `composerPop 0.7s ${EASE} 2s both, glowPulse 4.2s ease-in-out 2s infinite` }}>
              <ChatInput
                placeholder="Ask about the stack, the homelab, or whether I'd fit your team…"
                onSend={chat.ask}
              />
            </div>

            <div className={"hero-answer" + (chat.open ? " hero-answer--open" : "")}>
              <div className="hero-answer__clip">
                <div className="hero-answer__inner">
                  <span className="hero-answer__label">ANSWER</span>
                  {chat.isRetrieving && <RetrievalStatus note="searching indexed chunks · repos, cv, notes" />}
                  {chat.showSources && <SourceChips sources={chat.sources} />}
                  {chat.isThinking && <ThinkingDots note="sources locked — writing an answer" />}
                  {chat.hasText && (
                    <p className="hero-answer__text">
                      {chat.text}
                      {!chat.done && <span className="caret">▍</span>}
                    </p>
                  )}
                  {chat.error && <p className="chat-bubble__text--muted">{chat.error}</p>}
                  {chat.done && (
                    <a className="hero-answer__jump" href="#assistant">
                      see exactly how it answered — continue below ↓
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="chip-row">
              {CHIPS.map((label, i) => (
                <button
                  key={label}
                  className="chip"
                  onClick={() => chat.ask(label)}
                  style={{ animation: `chipPop 0.55s ${EASE} ${2.3 + i * 0.12}s both` }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

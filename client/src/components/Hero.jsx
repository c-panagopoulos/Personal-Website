import { useEffect, useState } from "react";
import { useSharedChat } from "../context/ChatContext.jsx";
import ChatInput from "./ChatInput.jsx";
import { RetrievalStatus, SourceChips, ThinkingDots } from "./RetrievalStatus.jsx";
import ChatError from "./ChatError.jsx";

const CHIPS = [
  "What have you built?",
  "What technologies do you use?",
  "Am I a fit for a junior role?",
];

const NAME_LINE = "CHARALAMPOS PANAGOPOULOS";
const ROLE_LINE = "JUNIOR FULL-STACK SOFTWARE ENGINEER";
const SCRAMBLE_CHARS = "!<>-_\\/[]{}=+*^?#$%&";
const EASE = "cubic-bezier(0.2, 0.7, 0.2, 1)";

function randomScrambleChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

// Reveals `text` by resolving random scramble characters into the real
// string over `duration`ms, starting `delay`ms after mount — used to give
// the byline's two lines their own independent, staggered reveal.
function useScramble(text, delay, duration) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start - delay;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(1, elapsed / duration);
      const revealCount = Math.floor(progress * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        out += ch === " " ? ch : i < revealCount ? ch : randomScrambleChar();
      }
      setDisplay(out);
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setDisplay(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, delay, duration]);

  return display;
}

export default function Hero() {
  const chat = useSharedChat();
  // Hero shares one chat instance with the Intermission section (asking in
  // Hero seeds Intermission's history, so "continue below" has something to
  // show) — but that means the globally-latest turn isn't necessarily
  // Hero's own. Look up the turn Hero itself started instead of trusting
  // the shared "current turn" view, or a question asked from Intermission
  // first would incorrectly show up here and lock this composer too.
  const heroTurn = chat.history.find((t) => t.origin === "hero");
  const open = Boolean(heroTurn);
  const nameDisplay = useScramble(NAME_LINE, 550, 650);
  const roleDisplay = useScramble(ROLE_LINE, 750, 750);

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
            {/* Scrambling reveal is decorative and passes through gibberish
                mid-animation — hidden from assistive tech, which gets the
                real name/role immediately via aria-label instead. */}
            <span className="hero__label-group" aria-label={`${NAME_LINE}, ${ROLE_LINE}`}>
              <span className="hero__label" style={{ whiteSpace: "pre", minWidth: 1 }} aria-hidden="true">
                {nameDisplay || " "}
              </span>
              <span className="hero__label hero__label--muted" style={{ whiteSpace: "pre", minWidth: 1 }} aria-hidden="true">
                {roleDisplay || " "}
              </span>
            </span>
          </div>
          <h1 className="hero__title">
            <span style={{ display: "block", animation: `titleWipe 0.8s ${EASE} 1s both` }}>I build the</span>
            <span style={{ display: "block", animation: `titleWipe 0.8s ${EASE} 1.15s both` }}>things I needed</span>
            <span style={{ display: "block", animation: `titleWipe 0.8s ${EASE} 1.3s both` }}>to exist.</span>
          </h1>
          <p className="hero__subtitle" style={{ animation: `sceneRiseBlur 0.8s ${EASE} 1.7s both` }}>
            I build full-stack applications, AI tools, and the infrastructure behind them - usually to solve a
            problem I actually have.
          </p>
          <p className="hero__status" style={{ animation: `sceneRiseBlur 0.6s ${EASE} 1.85s both` }}>
            OPEN TO JUNIOR SOFTWARE ENGINEERING ROLES
          </p>

          <div className="hero__interact">
            {/* Input row and answer drawer share one bordered/shadowed shell
                (overflow:hidden clips both to the same rounded corners)
                instead of each carrying its own border — otherwise there's
                a visible seam (duplicate border lines + gap) exactly where
                they should read as one continuous box. */}
            <div className="hero-composer" style={{ animation: `composerPop 0.7s ${EASE} 2s both` }}>
              <ChatInput
                placeholder="Ask about the stack, the homelab, or whether I'd fit your team…"
                onSend={(question) => chat.ask(question, "hero")}
                disabled={open}
              />

              <div className={"hero-answer" + (open ? " hero-answer--open" : "")}>
                <div className="hero-answer__clip">
                  <div className="hero-answer__inner">
                    <span className="hero-answer__label">ANSWER</span>
                    {heroTurn?.isRetrieving && <RetrievalStatus note="searching indexed chunks · repos, cv, notes" />}
                    {heroTurn?.showSources && <SourceChips sources={heroTurn.sources} />}
                    {heroTurn?.isThinking && <ThinkingDots note="sources locked — writing an answer" />}
                    {heroTurn?.hasText && (
                      <p className="hero-answer__text" aria-live="polite">
                        {heroTurn.text}
                        {!heroTurn.done && <span className="caret" aria-hidden="true">▍</span>}
                      </p>
                    )}
                    <ChatError error={heroTurn?.error} />
                    {heroTurn?.done && (
                      <a className="hero-answer__jump" href="#assistant">
                        see exactly how it answered - continue below ↓
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {!open && (
              <div className="chip-row">
                {CHIPS.map((label, i) => (
                  <button
                    key={label}
                    className="chip"
                    onClick={() => chat.ask(label, "hero")}
                    style={{ animation: `chipPop 0.55s ${EASE} ${2.3 + i * 0.12}s both` }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

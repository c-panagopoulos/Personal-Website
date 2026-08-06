import { useSharedChat } from "../context/ChatContext.jsx";
import ChatInput from "./ChatInput.jsx";
import { RetrievalStatus, SourceChips, ThinkingDots } from "./RetrievalStatus.jsx";
import DotField from "./DotField.jsx";

const CHIPS = [
  "What's Hermes?",
  "Tell me about tapstudy",
  "Why Ollama instead of a hosted API?",
  "Are you open to opportunities?",
];

export default function Hero() {
  const chat = useSharedChat();

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
                  gradientFrom="rgba(211, 218, 217, 0.3)"
                  gradientTo="rgba(68, 68, 78, 0.4)"
                />
              </div>
              <div className="assistant-card__question">&gt; {chat.question}</div>
              {chat.isRetrieving && <RetrievalStatus note="searching indexed chunks · repos, cv, notes" />}
              {chat.showSources && <SourceChips sources={chat.sources} />}
              {chat.isThinking && <ThinkingDots note="sources locked — writing an answer" />}
              {chat.hasText && (
                <p className="assistant-card__answer">
                  {chat.text}
                  {!chat.done && <span className="caret">▍</span>}
                </p>
              )}
              {chat.error && <p className="chat-bubble__text--muted">{chat.error}</p>}
              {chat.done && (
                <a className="assistant-card__jump" href="#assistant">
                  see exactly how it answered — continue below ↓
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
    </div>
  );
}

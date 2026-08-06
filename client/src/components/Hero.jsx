import { useSharedChat } from "../context/ChatContext.jsx";
import ChatInput from "./ChatInput.jsx";
import { RetrievalStatus, SourceChips, ThinkingDots } from "./RetrievalStatus.jsx";

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
        <div className="hero__dotgrid" />
        <div className="hero__content">
          <div className="hero__byline">
            <img className="hero__avatar" src="/images/prof3.png" alt="Charalampos" />
            <span className="hero__label">CHARALAMPOS PANAGOPOULOS · FULL-STACK</span>
          </div>
          <h1 className="hero__title">
            I build the
            <br />
            things I needed
            <br />
            to exist.
          </h1>
          <p className="hero__subtitle">
            Ask the assistant below anything about the work that follows — it only answers from my repos and CV.
          </p>

          <div className="hero__interact">
            <ChatInput
              placeholder="Ask about the stack, the homelab, or whether I'd fit your team…"
              onSend={chat.ask}
            />

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
    </div>
  );
}

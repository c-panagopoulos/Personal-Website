import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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

const TABS = [
  { id: "chat", label: "Chat" },
  { id: "sources", label: "Sources" },
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

// Measures the active panel's real height (via ResizeObserver) so the
// wrapper below can animate to it instead of snapping — same technique as
// animate-ui's useAutoHeight, sized down to just what this needs.
function useAutoHeight(dep) {
  const innerRef = useRef(null);
  const [height, setHeight] = useState(null);

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return undefined;
    const measure = () => setHeight(el.getBoundingClientRect().height);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep]);

  return { innerRef, height };
}

// Sliding-pill tab bar + cross-fade/blur panel switch, ported from
// animate-ui's Tabs component (github.com/imskyleen/animate-ui) — not the
// full primitive, which is a generic hover/click/controlled abstraction
// built for arbitrary tab counts. This only ever needs two fixed tabs, so
// it's the same layoutId-pill and AnimatePresence-blur technique rewritten
// directly instead of ported wholesale.
function AssistantTabs({ activeTab, onChange, panels }) {
  const { innerRef, height } = useAutoHeight(activeTab);

  return (
    <div className="assistant-tabs">
      <div className="assistant-tabs__list" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className="assistant-tabs__tab"
            onClick={() => onChange(tab.id)}
          >
            {activeTab === tab.id && (
              <motion.span
                layoutId="assistant-tabs-pill"
                className="assistant-tabs__pill"
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              />
            )}
            <span className="assistant-tabs__label">{tab.label}</span>
          </button>
        ))}
      </div>
      <motion.div
        className="assistant-tabs__panels"
        animate={{ height: height ?? "auto" }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
      >
        <div ref={innerRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {panels[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default function AssistantSection() {
  const chat = useSharedChat();
  const [ref, visible] = useSceneTrigger({ threshold: 0.15 });
  const threadRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");

  useEffect(() => {
    if (window.innerWidth <= 900) setIsMobile(true);
  }, []);

  // Scroll only the bounded .chat-thread container itself, not
  // scrollIntoView — that walks up through every scrollable ancestor
  // including the page itself, which yanks the whole viewport down to this
  // section even when a question was asked from Hero's composer (Hero and
  // this section share one chat instance, so every history change fires
  // here regardless of which composer triggered it). Also re-runs when the
  // mobile Chat tab becomes active again — switching tabs remounts
  // .chat-thread, which would otherwise land scrolled to the top instead of
  // the latest message.
  useEffect(() => {
    if (isMobile && activeTab !== "chat") return;
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chat.history, isMobile, activeTab]);

  const sidebarContent = (
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
  );

  const mainContent = (
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
  );

  return (
    <div id="assistant" className="assistant-section" ref={ref}>
      <div className="assistant-section__topbar" style={anim(visible, "rowRise", 0.4, 0.15)}>
        <div className="assistant-breadcrumb">
          <span className="assistant-breadcrumb__cp">cp</span>
          <span className="assistant-breadcrumb__sep">/</span>
          <span className="assistant-breadcrumb__current">assistant</span>
          <span className="assistant-breadcrumb__sep">/</span>
          <span className="assistant-breadcrumb__status">retrieval-online</span>
        </div>
      </div>
      {isMobile ? (
        <AssistantTabs activeTab={activeTab} onChange={setActiveTab} panels={{ chat: mainContent, sources: sidebarContent }} />
      ) : (
        <div className="assistant-section__body">
          {sidebarContent}
          {mainContent}
        </div>
      )}
    </div>
  );
}

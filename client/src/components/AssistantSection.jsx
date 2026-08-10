import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSharedChat } from "../context/ChatContext.jsx";
import ChatInput from "./ChatInput.jsx";
import { RetrievalStatus, RetrievedChunks, SourceChips, ThinkingDots } from "./RetrievalStatus.jsx";
import ChatError from "./ChatError.jsx";
import DotField from "./DotField.jsx";
import { useSceneTrigger } from "../hooks/useSceneTrigger.js";
import { anim } from "../lib/anim.js";

const CHIPS = [
  "How does this assistant retrieve information?",
  "What breaks most often in the homelab?",
  "Why pgvector over a managed vector DB?",
  "What would you build next?",
];

function ChatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function SourcesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

const TABS = [
  { id: "chat", label: "Chat", Icon: ChatIcon },
  { id: "sources", label: "Sources", Icon: SourcesIcon },
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
            <p className="chat-bubble__text" aria-live="polite">
              {turn.text}
              {!turn.done && <span className="caret" aria-hidden="true">▍</span>}
            </p>
          </div>
        </div>
      )}
      {turn.error && (
        <div className="chat-row--assistant" style={anim(visible, "rise", 0.8)}>
          <div className="chat-bubble__avatar">cp</div>
          <div className="chat-bubble__content">
            <ChatError error={turn.error} className="chat-bubble__text--muted" />
          </div>
        </div>
      )}
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

// Small icon-only toggle instead of a full-width labeled tab bar — lives in
// the topbar (next to the breadcrumb, always rendered regardless of which
// panel is active) rather than its own row, since on mobile the nav plus
// this section's own headline already eat most of the viewport before any
// chat content shows. Same sliding-pill technique as before, just applied
// to two small squares instead of full-width labeled tabs. The sources
// badge is the only feedback that anything changed over there when a
// question resolves while you're still looking at the Chat panel.
function AssistantTabToggle({ activeTab, onChange, sourcesCount }) {
  const tabRefs = useRef({});

  // Standard ARIA tabs roving-tabindex pattern: arrow keys move both focus
  // and selection between the two tabs instead of requiring Tab+Enter.
  const handleKeyDown = (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const idx = TABS.findIndex((t) => t.id === activeTab);
    const dir = event.key === "ArrowRight" ? 1 : -1;
    const nextId = TABS[(idx + dir + TABS.length) % TABS.length].id;
    onChange(nextId);
    tabRefs.current[nextId]?.focus();
  };

  return (
    <div className="assistant-tab-toggle" role="tablist" aria-label="Assistant panels" onKeyDown={handleKeyDown}>
      {TABS.map((tab) => (
        <button
          key={tab.id}
          ref={(el) => (tabRefs.current[tab.id] = el)}
          id={`assistant-tab-${tab.id}`}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`assistant-panel-${tab.id}`}
          aria-label={tab.label}
          title={tab.label}
          tabIndex={activeTab === tab.id ? 0 : -1}
          className="assistant-tab-toggle__btn"
          onClick={() => onChange(tab.id)}
        >
          {activeTab === tab.id && (
            <motion.span
              layoutId="assistant-tabs-pill"
              className="assistant-tab-toggle__pill"
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            />
          )}
          <tab.Icon />
          {tab.id === "sources" && sourcesCount > 0 && (
            <span className="assistant-tab-toggle__badge">{sourcesCount}</span>
          )}
        </button>
      ))}
    </div>
  );
}

// Cross-fade/blur panel switch + auto-height, ported from animate-ui's Tabs
// component (github.com/imskyleen/animate-ui) — the trigger UI lives
// separately above (AssistantTabToggle), this is just the panel side.
function AssistantTabPanels({ activeTab, panels }) {
  const { innerRef, height } = useAutoHeight(activeTab);

  return (
    <div className="assistant-tabs">
      <motion.div
        className="assistant-tabs__panels"
        animate={{ height: height ?? "auto" }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
      >
        <div ref={innerRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              role="tabpanel"
              id={`assistant-panel-${activeTab}`}
              aria-labelledby={`assistant-tab-${activeTab}`}
              tabIndex={0}
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
        {isMobile && (
          <AssistantTabToggle activeTab={activeTab} onChange={setActiveTab} sourcesCount={chat.sources.length} />
        )}
      </div>
      {isMobile ? (
        <AssistantTabPanels activeTab={activeTab} panels={{ chat: mainContent, sources: sidebarContent }} />
      ) : (
        <div className="assistant-section__body">
          {sidebarContent}
          {mainContent}
        </div>
      )}
    </div>
  );
}

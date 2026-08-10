import { useEffect, useRef, useState } from "react";
import { SourceChips, ThinkingDots } from "./RetrievalStatus.jsx";
import DotField from "./DotField.jsx";
import { useSceneTrigger } from "../hooks/useSceneTrigger.js";
import { anim } from "../lib/anim.js";

const STACK_GROUPS = [
  { label: "Frontend", items: ["React", "Vite", "Bootstrap", "Tailwind"] },
  { label: "Backend", items: ["Express", "SSE"] },
  { label: "Data", items: ["Postgres", "pgvector"] },
  { label: "Infrastructure", items: ["Docker", "Linux", "Tailscale", "Git"] },
  { label: "AI", items: ["Ollama", "RAG"] },
];

// Every "why did you choose X" answer here is fixed, word for word, the
// same for every visitor — pulled straight from about-me.md's own
// tech-reasoning paragraphs (the same source the real RAG assistant would
// retrieve for these exact questions). Running a live retrieval + LLM call
// for a Q&A pair that never changes just burns tokens for no benefit, so
// this section answers locally instead of asking the assistant.
const STACK_ANSWERS = {
  React:
    "I use React and Vite on the frontend because these projects are React apps that need a fast dev loop. That's the reason I use them, not because they're trendy.",
  Vite: "Vite is what actually makes that dev loop fast, instant hot reload instead of waiting on a bundler every time I save. It's paired with React here for that reason, not because it's trendy.",
  Express:
    "I use Express on the backend because it stays out of the way on small, self-hosted APIs. There's no framework magic to fight when I'm the only one maintaining it.",
  SSE: "I use Server-Sent Events for chat streaming instead of something heavier like WebSockets. It's a one-way token stream from server to client, and a plain EventSource with no extra infrastructure is enough.",
  Postgres:
    "I use PostgreSQL because it's the one relational database I trust to just work, for TapStudy's session data, Hermes' chat history, and this site's own retrieval alike. It's mature and well-documented, and I've never had to fight it.",
  pgvector:
    "I use pgvector on top of Postgres because it means retrieval doesn't need a separate vector database. That saves me one whole service to run, back up, and secure.",
  Docker:
    "Docker is why something I build on my dev machine runs identically on a homelab server. I chose it so I could ship one docker save, ssh, docker load and skip a whole category of environment bugs.",
  Linux:
    "Linux is the operating system I chose for my homelab server. It's what self-hosting runs on, and it's the foundation underneath everything else I build there.",
  Tailscale:
    "I use Tailscale because it gets me remote access to everything without opening a single port to the public internet. Its ACL tags let me restrict which devices can reach which service, which matters since Nextcloud, holding my real files, lives on the same box as everything else.",
  Ollama:
    "I use Ollama for local inference because keeping a model on my own hardware means no per-request bill and nothing leaving the box for parts that don't need to scale. I still reach for a hosted API like Groq when a project genuinely needs speed a home server can't give it.",
  RAG: "RAG, retrieval-augmented generation, is the pattern I chose for anything that answers questions. I'd rather a system say that's not in what I've indexed than confidently make something up, and RAG grounds every answer in a real, citable chunk of text.",
  Bootstrap:
    "I've reached for Bootstrap on earlier projects when the goal was a working UI fast, without hand-rolling every component from scratch. It trades some visual uniqueness for speed, which is a fair trade when shipping something functional matters more than a custom look.",
  Tailwind:
    "I used Tailwind CSS on TapStudy because utility classes let me iterate on layout fast without context-switching to a separate stylesheet. This site itself uses hand-written CSS instead, a single-page portfolio doesn't need a utility framework's overhead.",
  Git: "I use Git because it's non-negotiable, every project here, from TapStudy to this site, lives in a repo with real commit history so I can see exactly what changed and roll it back the moment I break something.",
};

const STACK_SOURCES = [{ source: "about-me.md" }];

export default function StackSection() {
  const [ref, visible] = useSceneTrigger({ threshold: 0.15 });
  const [question, setQuestion] = useState(null);
  const [phase, setPhase] = useState("idle"); // idle | thinking | done
  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const ask = (name) => {
    setQuestion(name);
    setPhase("thinking");
    clearTimeout(timeoutRef.current);
    // Answer is already known instantly — this just keeps the reveal
    // feeling deliberate instead of an instant pop, matching how the real
    // assistant panels elsewhere on the site settle in.
    timeoutRef.current = setTimeout(() => setPhase("done"), 400);
  };

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
          No proficiency bars. Click anything below and I'll tell you why it's there.
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
                      className={"stack-tag" + (question === name ? " stack-tag--active" : "")}
                      onClick={() => ask(name)}
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
                pulseActive={phase === "thinking"}
                pulseColor="#9c8683"
              />
            </div>
            {question ? (
              <div className="stack-answer">
                <div className="assistant-card__question">&gt; Why did you choose {question}?</div>
                {phase === "thinking" && <ThinkingDots note="" />}
                {phase === "done" && (
                  <>
                    <SourceChips sources={STACK_SOURCES} />
                    <p className="assistant-card__answer" aria-live="polite">
                      {STACK_ANSWERS[question]}
                    </p>
                  </>
                )}
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

import { useRef, useState } from "react";
import { useSceneTrigger } from "../hooks/useSceneTrigger.js";
import { anim } from "../lib/anim.js";

const STEPS = [
  { num: "01", name: "Intake", title: "Is it really a deletion request?", kind: "model",
    text: "A model reads the request, in any language, and decides whether it actually asks for deletion. A rules check backs it up. If the answer is no, the audit stops here." },
  { num: "02", name: "Identity", title: "Who is this person, everywhere?", kind: "code",
    text: "Collects every identifier they have used: current and past emails, phones, hashed IDs. One primary account per person, so merged accounts aren't counted twice." },
  { num: "03", name: "Investigate", title: "What still exists, and where?", kind: "code + vision",
    text: "Reads SQL, replicas, JSON exports, six log formats, PDFs and screenshots, then works out what existed at audit time, not what happened after." },
  { num: "04", name: "Policy", title: "What must go, what must stay?", kind: "code",
    text: "Applies the deletion and retention rules: what has to be removed, and what has to be kept by law." },
  { num: "05", name: "Plan", title: "Ordered fixes, each one cited", kind: "code",
    text: "Turns findings into an ordered list of fixes. Every item points back to the evidence it came from." },
  { num: "06", name: "Verify", title: "Checked again before writing", kind: "code",
    text: "Re-checks every finding against the evidence before the result is written. What it can't link to the person, it refuses to guess." },
];

export default function AuditSteps() {
  const [ref, visible] = useSceneTrigger({ threshold: 0.2 });
  const [active, setActive] = useState(0);
  const tabRefs = useRef([]);
  const current = STEPS[active];

  // Roving focus between tabs: arrows move, Home/End jump to the ends.
  const onKeyDown = (e) => {
    const last = STEPS.length - 1;
    const next = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowDown: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      ArrowUp: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="audit-steps" ref={ref}>
      <div className="audit-steps__head">
        <h4 className="audit-steps__title" style={anim(visible, "titleWipe", 0.75, 0.5)}>
          How one request is audited
        </h4>
        <span className="audit-steps__hint" style={anim(visible, "sceneRiseBlur", 0.7, 0.9)}>
          Six steps. Tap one to see what it does.
        </span>
      </div>

      <div className="audit-steps__tabs" role="tablist" aria-label="Audit steps" onKeyDown={onKeyDown}>
        {STEPS.map((step, i) => (
          <button
            key={step.num}
            ref={(el) => (tabRefs.current[i] = el)}
            type="button"
            role="tab"
            id={`audit-step-${step.num}`}
            aria-selected={i === active}
            aria-controls="audit-step-panel"
            tabIndex={i === active ? 0 : -1}
            className={["audit-steps__tab", i === active && "audit-steps__tab--active"].filter(Boolean).join(" ")}
            style={anim(visible, "rowRise", 0.4, 1.25 + i * 0.08)}
            onClick={() => setActive(i)}
          >
            <span className="audit-steps__tab-num">{step.num}</span>
            <span className="audit-steps__tab-name">{step.name}</span>
          </button>
        ))}
      </div>

      <div
        className="audit-steps__panel"
        role="tabpanel"
        id="audit-step-panel"
        aria-labelledby={`audit-step-${current.num}`}
        style={anim(visible, "sceneRiseBlur", 0.6, 1.8)}
      >
        {/* Keyed on the step so switching tabs remounts it and replays the swap animation. */}
        <div className="audit-steps__panel-body" key={current.num}>
          <div className="audit-steps__panel-head">
            <span className="audit-steps__panel-title">{current.title}</span>
            <span className={["audit-steps__kind", current.kind !== "code" && "audit-steps__kind--model"].filter(Boolean).join(" ")}>
              // {current.kind}
            </span>
          </div>
          <p className="audit-steps__text">{current.text}</p>
        </div>
      </div>
    </div>
  );
}

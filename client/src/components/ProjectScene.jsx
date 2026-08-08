import Reveal from "./Reveal.jsx";
import ScrambleText from "./ScrambleText.jsx";
import { useSceneTrigger } from "../hooks/useSceneTrigger.js";
import { anim } from "../lib/anim.js";

function GithubMark() {
  return (
    <svg width="17" height="17" viewBox="0 0 512 512" style={{ flexShrink: 0 }}>
      <path
        fill="currentColor"
        d="M202.1 328.7c0 20.9-10.9 55.1-36.7 55.1s-36.7-34.2-36.7-55.1 10.9-55.1 36.7-55.1 36.7 34.2 36.7 55.1zM496 278.2c0 31.9-3.2 65.7-17.5 95-37.9 76.6-142.1 74.8-216.7 74.8-75.8 0-186.2 2.7-225.6-74.8-14.6-29-20.2-63.1-20.2-95 0-41.9 13.9-81.5 41.5-113.6-5.2-15.8-7.7-32.4-7.7-48.8 0-21.5 4.9-32.3 14.6-51.8 45.3 0 74.3 9 108.8 36 29-6.9 58.8-10 88.7-10 27 0 54.2 2.9 80.4 9.2 34-26.7 63-35.2 107.8-35.2 9.8 19.5 14.6 30.3 14.6 51.8 0 16.4-2.6 32.7-7.7 48.2 27.5 32.4 39 72.3 39 114.2zm-64.3 50.5c0-43.9-26.7-82.6-73.5-82.6-18.9 0-37 3.4-56 6-14.9 2.3-29.8 3.2-45.1 3.2-15.2 0-30.1-.9-45.1-3.2-18.7-2.6-37-6-56-6-46.8 0-73.5 38.7-73.5 82.6 0 87.8 80.4 101.3 150.4 101.3l48.2 0c70.3 0 150.6-13.4 150.6-101.3zm-82.6-55.1c-25.8 0-36.7 34.2-36.7 55.1s10.9 55.1 36.7 55.1 36.7-34.2 36.7-55.1-10.9-55.1-36.7-55.1z"
      />
    </svg>
  );
}

function StackGroup({ group, style }) {
  return (
    <div className="scene__stack-group" style={style}>
      <div className="scene__stack-label">{group.label}</div>
      <div className="scene__stack-value">
        {group.items.map((item, i) => (
          <span key={i}>
            {item}
            {i < group.items.length - 1 && <br />}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ProjectScene({
  id,
  sceneNumber,
  sceneName,
  browserLabel,
  browserTag,
  title,
  body,
  proof,
  how,
  stack,
  evidence,
  ctaLabel,
  ctaTag,
  ctaHref,
  githubHref,
  factsLayout = "column",
  showBrowserPreview = true,
  divider = false,
}) {
  const [ref, visible] = useSceneTrigger({ threshold: 0.15 });
  const sceneClass = ["scene", divider && "scene--divider"].filter(Boolean).join(" ");
  const gridClass = ["scene__grid", factsLayout === "inline" && "scene__grid--single"].filter(Boolean).join(" ");

  return (
    <div id={id} className={sceneClass} ref={ref}>
      {showBrowserPreview && (
        <Reveal className="scene__browser">
          <div className="scene__browser-frame">
            <div className="scene__browser-bar">
              <span className="scene__browser-dot" />
              <span className="scene__browser-dot" />
              <span className="scene__browser-dot" />
              <span className="scene__browser-title">{browserLabel}</span>
            </div>
            <div className="scene__browser-body">
              <span className="scene__browser-tag">{browserTag}</span>
            </div>
          </div>
        </Reveal>
      )}
      <div className={gridClass}>
        <div>
          <div className="scene__kicker">
            <span className="scene__kicker-num" style={anim(visible, "rowRise", 0.5, 0.1)}>
              SCENE {sceneNumber}
            </span>
            <span className="scene__kicker-rule" style={anim(visible, "ruleGrow", 0.5, 0.35)} />
            <span className="scene__kicker-name">
              <ScrambleText lines={[sceneName]} />
            </span>
          </div>
          <h3 className="scene__title" style={anim(visible, "titleWipe", 0.75, 0.5)}>
            {title}
          </h3>
          <p className="scene__body" style={anim(visible, "sceneRiseBlur", 0.7, 1)}>
            {body}
          </p>

          {proof?.length > 0 && (
            <ul className="scene__proof">
              {proof.map((item, i) => (
                <li className="scene__proof-item" key={item} style={anim(visible, "rowRise", 0.4, 1.25 + i * 0.08)}>
                  <span className="scene__proof-mark">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          )}

          {how && (
            <p className="scene__how" style={anim(visible, "sceneRiseBlur", 0.6, 1.65)}>
              {how}
            </p>
          )}

          {factsLayout === "inline" && stack?.length > 0 && (
            <div className="scene__stack scene__stack--inline scene__stack--grid">
              {stack.map((group, i) => (
                <StackGroup group={group} key={group.label} style={anim(visible, "rowRise", 0.45, 0.9 + i * 0.15)} />
              ))}
            </div>
          )}

          {ctaHref && (
            <div style={{ marginTop: 40, display: "flex", gap: 14 }}>
              <a
                className="btn"
                href={ctaHref}
                target={ctaHref.startsWith("http") ? "_blank" : undefined}
                rel={ctaHref.startsWith("http") ? "noreferrer" : undefined}
                style={anim(visible, "ctaPop", 0.5, 1.85)}
              >
                <span className="btn__label">{ctaLabel}</span>
                <span className="btn__tag">{ctaTag}</span>
              </a>
              {githubHref && (
                <a
                  className="btn btn--secondary"
                  href={githubHref}
                  target="_blank"
                  rel="noreferrer"
                  style={anim(visible, "ctaPop", 0.5, 1.95)}
                >
                  <GithubMark />
                  <span className="btn__label">GitHub</span>
                </a>
              )}
            </div>
          )}

          {factsLayout === "inline" && evidence && (
            <Reveal className="scene__evidence-wrap">{evidence}</Reveal>
          )}
        </div>
        {factsLayout === "column" && (evidence || stack?.length > 0) && (
          <div className="scene__side">
            {evidence && <Reveal>{evidence}</Reveal>}
            {stack?.length > 0 && (
              <div className="scene__stack scene__stack--grid">
                {stack.map((group, i) => (
                  <StackGroup group={group} key={group.label} style={anim(visible, "rowRise", 0.45, 0.9 + i * 0.15)} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

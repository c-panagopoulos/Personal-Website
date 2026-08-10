import Reveal from "./Reveal.jsx";
import ScrambleText from "./ScrambleText.jsx";
import Button from "./Button.jsx";
import GithubMark from "./GithubMark.jsx";
import { useSceneTrigger } from "../hooks/useSceneTrigger.js";
import { anim } from "../lib/anim.js";

function StackGroup({ group, style }) {
  return (
    <div className="scene__stack-group" style={style}>
      <div className="scene__stack-label">{group.label}</div>
      <div className="scene__stack-value">
        {group.items.map((item, i) => (
          <div key={i}>{item}</div>
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
                <li className="scene__proof-item" key={i} style={anim(visible, "rowRise", 0.4, 1.25 + i * 0.08)}>
                  <span className="scene__proof-mark">›</span>
                  <span>{item}</span>
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
            <div className="scene__cta-row" style={{ marginTop: 40 }}>
              <span style={anim(visible, "ctaPop", 0.5, 1.85)}>
                <Button
                  href={ctaHref}
                  target={ctaHref.startsWith("http") ? "_blank" : undefined}
                  rel={ctaHref.startsWith("http") ? "noreferrer" : undefined}
                >
                  <span className="btn__label">{ctaLabel}</span>
                </Button>
              </span>
              {githubHref && (
                <span style={anim(visible, "ctaPop", 0.5, 1.95)}>
                  <Button variant="secondary" href={githubHref} target="_blank" rel="noreferrer">
                    <GithubMark />
                    <span className="btn__label">GitHub</span>
                  </Button>
                </span>
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
              <div className="scene__stack-panel">
                <div className="scene__stack scene__stack--grid">
                  {stack.map((group, i) => (
                    <StackGroup group={group} key={group.label} style={anim(visible, "rowRise", 0.45, 0.9 + i * 0.15)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

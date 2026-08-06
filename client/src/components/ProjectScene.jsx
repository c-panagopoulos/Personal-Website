import Reveal from "./Reveal.jsx";
import ScrambleText from "./ScrambleText.jsx";

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
  ctaLabel,
  ctaTag,
  ctaHref,
  factsLayout = "column",
  showBrowserPreview = true,
  divider = false,
}) {
  const sceneClass = ["scene", divider && "scene--divider"].filter(Boolean).join(" ");
  const gridClass = ["scene__grid", factsLayout === "inline" && "scene__grid--single"].filter(Boolean).join(" ");

  return (
    <div id={id} className={sceneClass}>
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
        <Reveal>
          <div className="scene__kicker">
            <span className="scene__kicker-num">SCENE {sceneNumber}</span>
            <span className="scene__kicker-rule" />
            <span className="scene__kicker-name">{sceneName}</span>
          </div>
          <h3 className="scene__title">
            <ScrambleText lines={[title]} />
          </h3>
          <p className="scene__body">{body}</p>

          {proof?.length > 0 && (
            <ul className="scene__proof">
              {proof.map((item) => (
                <li className="scene__proof-item" key={item}>
                  <span className="scene__proof-mark">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          )}

          {how && <p className="scene__how">{how}</p>}

          {factsLayout === "inline" && stack?.length > 0 && (
            <div className="scene__stack scene__stack--inline">
              {stack.map((group) => (
                <div className="scene__stack-group" key={group.label}>
                  <span className="scene__stack-label">{group.label}</span>
                  <span className="scene__stack-value">{group.items.join(" · ")}</span>
                </div>
              ))}
            </div>
          )}

          {ctaHref && (
            <div style={{ marginTop: 32, display: "flex", gap: 14 }}>
              <a className="btn" href={ctaHref} target={ctaHref.startsWith("http") ? "_blank" : undefined} rel={ctaHref.startsWith("http") ? "noreferrer" : undefined}>
                <span className="btn__label">{ctaLabel}</span>
                <span className="btn__tag">{ctaTag}</span>
              </a>
            </div>
          )}
        </Reveal>
        {factsLayout === "column" && stack?.length > 0 && (
          <Reveal className="scene__stack">
            {stack.map((group) => (
              <div className="scene__stack-group" key={group.label}>
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
            ))}
          </Reveal>
        )}
      </div>
    </div>
  );
}

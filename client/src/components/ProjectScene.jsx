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
  ctaLabel,
  ctaTag,
  ctaHref,
  facts,
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
          {factsLayout === "inline" && (
            <div className="scene__facts--inline">
              {facts.map((fact) => (
                <span key={fact.label}>
                  <span className="fact__label">{fact.label} </span>
                  {fact.lines.join(" · ")}
                </span>
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
        {factsLayout === "column" && (
          <Reveal className="facts">
            {facts.map((fact) => (
              <div className="fact" key={fact.label}>
                <div className="fact__label">{fact.label}</div>
                <div className="fact__value">
                  {fact.lines.map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < fact.lines.length - 1 && <br />}
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

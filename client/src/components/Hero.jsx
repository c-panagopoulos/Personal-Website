import Button from "./Button.jsx";
import { handleAnchorClick } from "../lib/scroll.js";

const EASE = "cubic-bezier(0.2, 0.7, 0.2, 1)";

export default function Hero() {
  return (
    <div className="hero">
      <div className="hero__backdrop" />

      <div className="hero__left">
        <div className="hero__dotgrid" />

        <div className="hero__content">
          <div className="hero__byline">
            <img
              className="hero__avatar"
              src="/images/prof3.webp"
              alt=""
              style={{ animation: "avatarSpring 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.15s both" }}
            />
            <span className="hero__label" style={{ animation: `sceneRiseBlur 0.6s ${EASE} 0.25s both` }}>
              JUNIOR FULL-STACK WEB DEVELOPER · ATHENS
            </span>
          </div>
          <h1 className="hero__title" style={{ animation: `titleWipe 0.8s ${EASE} 0.35s both` }}>
            {"Charalampos "}
            <br />
            Panagopoulos
          </h1>
          <p className="hero__tagline" style={{ animation: `sceneRiseBlur 0.8s ${EASE} 0.5s both` }}>
            I build software that knows what it doesn’t know.
          </p>

          <div className="hero__footer">
            <p className="hero__subtitle" style={{ animation: `sceneRiseBlur 0.8s ${EASE} 0.6s both` }}>
              I got into programming through self-hosting. Now I build web apps with React, Node.js and
              PostgreSQL, and the homelab they run on.
            </p>

            <div className="hero__interact" style={{ animation: `composerPop 0.7s ${EASE} 0.8s both` }}>
              <Button href="#scene-01" onClick={handleAnchorClick}>
                <span className="btn__label">Projects</span>
              </Button>
              <Button variant="secondary" href="#assistant" onClick={handleAnchorClick}>
                <span className="btn__label">Ask the assistant</span>
              </Button>
              <Button variant="secondary" href="https://github.com/c-panagopoulos" target="_blank" rel="noreferrer">
                <span className="btn__label">GitHub</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

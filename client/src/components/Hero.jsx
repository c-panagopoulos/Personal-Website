import Button from "./Button.jsx";

const EASE = "cubic-bezier(0.2, 0.7, 0.2, 1)";

export default function Hero() {
  return (
    <div className="hero">
      <div className="hero__backdrop" />
      <div className="hero__curtain hero__curtain--left" />
      <div className="hero__curtain hero__curtain--right" />
      <div className="hero__flare" />

      <div className="hero__left">
        <div className="hero__dotgrid" />

        <div className="hero__content">
          <div className="hero__byline">
            <img
              className="hero__avatar"
              src="/images/prof3.webp"
              alt=""
              style={{ animation: "avatarSpring 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.5s both" }}
            />
            <span className="hero__label" style={{ animation: `sceneRiseBlur 0.6s ${EASE} 0.7s both` }}>
              JUNIOR FULL-STACK WEB DEVELOPER · ATHENS
            </span>
          </div>
          <h1 className="hero__title" style={{ animation: `titleWipe 0.8s ${EASE} 1s both` }}>
            Charalampos
            <br />
            Panagopoulos
          </h1>
          <p className="hero__subtitle" style={{ animation: `sceneRiseBlur 0.8s ${EASE} 1.4s both` }}>
            I got into programming through self-hosting. Now I build web apps with React, Node.js and
            PostgreSQL, and the homelab they run on.
          </p>

          <div className="hero__interact" style={{ animation: `composerPop 0.7s ${EASE} 1.7s both` }}>
            <Button href="#scene-01">
              <span className="btn__label">Projects</span>
            </Button>
            <Button variant="secondary" href="#assistant">
              <span className="btn__label">Ask the assistant</span>
            </Button>
            <Button variant="secondary" href="https://github.com/c-panagopoulos" target="_blank" rel="noreferrer">
              <span className="btn__label">GitHub</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

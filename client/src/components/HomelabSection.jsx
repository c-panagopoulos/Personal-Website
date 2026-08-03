import Reveal from "./Reveal.jsx";

export default function HomelabSection() {
  return (
    <div id="homelab">
      <div className="scene__browser-frame scene__browser-frame--wide">
        <div className="scene__browser-bar">
          <span className="scene__browser-dot" />
          <span className="scene__browser-dot" />
          <span className="scene__browser-dot" />
          <span className="scene__browser-title">n100 — docker ps</span>
        </div>
        <div className="scene__browser-body">
          <span className="scene__browser-tag">SCENE 03 — THE HOMELAB, 3AM</span>
        </div>
      </div>
      <Reveal style={{ padding: "30px 56px 0" }}>
        <span className="scene__browser-title" style={{ marginLeft: 0 }}>
          SCENE 03 · ONE MINI PC, EVERYTHING IN DOCKER, NO ONE TO CALL
        </span>
      </Reveal>

      <div className="section-lead">
        <Reveal className="section-lead__inner">
          <h3 className="section-lead__title">
            If it breaks at 3am,
            <br />I am the on-call.
          </h3>
          <p className="section-lead__body">
            An Intel N100 running my personal cloud: Nextcloud, n8n, Tailscale, no open ports. One automation
            plans my day from sleep and calendar data; another turns photos of handwritten notes into searchable
            cards. Running my own infrastructure taught me what production actually costs.
          </p>
          <div className="facts--row" style={{ marginTop: 30 }}>
            <div className="fact">
              <div className="fact__label">HOST</div>
              <div className="fact__value">Intel N100 · Linux</div>
            </div>
            <div className="fact">
              <div className="fact__label">ACCESS</div>
              <div className="fact__value">Tailscale mesh</div>
            </div>
            <div className="fact">
              <div className="fact__label">UPTIME</div>
              <div className="fact__value">148 days</div>
            </div>
          </div>
          <div style={{ marginTop: 30 }}>
            <a className="btn" href="https://github.com/c-panagopoulos" target="_blank" rel="noreferrer">
              <span className="btn__label">GitHub</span>
              <span className="btn__tag">HOMELAB / COMPOSE</span>
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

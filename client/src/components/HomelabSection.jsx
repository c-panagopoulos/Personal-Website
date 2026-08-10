import { useEffect, useState } from "react";
import Reveal from "./Reveal.jsx";
import Terminal from "./Terminal.jsx";
import Button from "./Button.jsx";
import GithubMark from "./GithubMark.jsx";
import { useSceneTrigger } from "../hooks/useSceneTrigger.js";
import { anim } from "../lib/anim.js";

const CONTAINERS = [
  { id: "307b9a57b4a7", image: "tapstudy:latest", status: "Up 38 seconds", name: "tapstudy" },
  { id: "2ca3cbda2b0b", image: "ghcr.io/mealie-recipes/mealie:latest", status: "Up 38 seconds (healthy)", name: "mealie" },
  { id: "5d49ccaea73f", image: "caddy:2", status: "Up 39 seconds", name: "caddy" },
  { id: "317e06d80585", image: "docker.n8n.io/n8nio/n8n:latest", status: "Up 38 seconds", name: "n8n" },
  { id: "ebdef7165854", image: "lscr.io/linuxserver/nextcloud:latest", status: "Up 38 seconds", name: "nextcloud" },
  { id: "60959c879f4e", image: "postgres:16", status: "Up 38 seconds", name: "n8n-postgres" },
  { id: "5b86c56a7b83", image: "postgres:15-alpine", status: "Up 38 seconds", name: "nextcloud-db" },
  { id: "d65597eae285", image: "redis:7-alpine", status: "Up 39 seconds", name: "nextcloud-redis" },
  { id: "8983d8dbc8c4", image: "vaultwarden/server:latest", status: "Up 38 seconds (starting)", name: "vaultwarden" },
];

function shortenImage(image) {
  return image.replace(/^[\w.-]+\.[a-z]{2,}\/[\w-]+\//, "");
}

function shortenStatus(status) {
  return status.replace(/ seconds.*$/, "s");
}

function formatDockerPsOutput(rows, { compact = false } = {}) {
  const projected = rows.map((r) => ({
    id: r.id,
    image: compact ? shortenImage(r.image) : r.image,
    status: compact ? shortenStatus(r.status) : r.status,
    name: r.name,
  }));
  const header = { id: "CONTAINER ID", image: "IMAGE", status: "STATUS", name: "NAMES" };
  const all = [header, ...projected];
  const colWidth = (key) => Math.max(...all.map((r) => r[key].length)) + 3;
  const imageWidth = colWidth("image");
  const statusWidth = colWidth("status");
  if (compact) {
    return all.map((r) => r.image.padEnd(imageWidth) + r.status.padEnd(statusWidth) + r.name);
  }
  const idWidth = colWidth("id");
  return all.map((r) => r.id.padEnd(idWidth) + r.image.padEnd(imageWidth) + r.status.padEnd(statusWidth) + r.name);
}

export default function HomelabSection() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (window.innerWidth < 640) setIsMobile(true);
  }, []);

  const [ref, visible] = useSceneTrigger({ threshold: 0.15 });
  const dockerPsOutput = formatDockerPsOutput(CONTAINERS, { compact: isMobile });

  return (
    <div id="homelab" className="homelab-section" ref={ref}>
      <div className="scene__browser homelab__terminal-wrap" style={anim(visible, "terminalRise", 0.7, 0.3)}>
        <Terminal
          username="xpanago@n10"
          commands={["docker ps"]}
          outputs={{ 0: dockerPsOutput }}
        />
      </div>
      <Reveal className="homelab__caption">
        <div className="scene__kicker" style={{ marginBottom: 0 }}>
          <span className="scene__browser-title" style={{ marginLeft: 0 }}>
            ONE MINI PC, EVERY SERVICE RUNNING IN DOCKER
          </span>
          <span className="scene__kicker-rule" />
          <span className="scene__kicker-name">HOMELAB</span>
        </div>
      </Reveal>

      <div className="section-lead">
        <div className="section-lead__inner">
          <h3 className="section-lead__title">
            <span style={{ display: "block", ...anim(visible, "titleWipe", 0.75, 1.8) }}>If it breaks at 3am,</span>
            <span style={{ display: "block", ...anim(visible, "titleWipe", 0.75, 1.95) }}>I am the on-call.</span>
          </h3>
          <p className="section-lead__body" style={anim(visible, "sceneRiseBlur", 0.7, 2.3)}>
            An Intel N100 running my personal cloud: Nextcloud, n8n, Tailscale, no open ports. One automation
            plans my day from sleep and calendar data; another turns photos of handwritten notes into searchable
            cards. There is no DevOps team here. If it breaks, I fix it.
          </p>

          <ul className="scene__proof">
            <li className="scene__proof-item" style={anim(visible, "rowRise", 0.4, 2.42)}>
              <span className="scene__proof-mark">›</span>
              <span>Daily routine is AI-drafted, but <b>calendar-safe by design</b></span>
            </li>
            <li className="scene__proof-item" style={anim(visible, "rowRise", 0.4, 2.5)}>
              <span className="scene__proof-mark">›</span>
              <span>Handwritten notes → Nextcloud Deck cards, <b>~9 minutes saved</b> per note (estimated)</span>
            </li>
          </ul>

          <p className="scene__how" style={anim(visible, "sceneRiseBlur", 0.6, 2.62)}>
            For the daily-routine automation, sleep score comes in over an NFC tag — a handful of predefined
            values, sidestepping a proprietary sleep-tracker API. The AI drafts the day's plan; the workflow
            validates the structure and only writes through events the model itself marks enabled.
          </p>

          <div style={{ marginTop: 40 }}>
            <span style={anim(visible, "ctaPop", 0.5, 2.8)}>
              <Button href="https://github.com/c-panagopoulos" target="_blank" rel="noreferrer">
                <GithubMark />
                <span className="btn__label">GitHub</span>
              </Button>
            </span>
          </div>
        </div>

        <div className="scene__side">
          <div className="scene__stack-panel">
            <div className="scene__stack scene__stack--grid">
              <div className="scene__stack-group" style={anim(visible, "rowRise", 0.45, 2.4)}>
                <div className="scene__stack-label">Engineering</div>
                <div className="scene__stack-value">
                  <div>Docker Compose, nine services</div>
                  <div>Tailscale mesh, zero open ports</div>
                  <div>n8n automations, daily use</div>
                </div>
              </div>
              <div className="scene__stack-group" style={anim(visible, "rowRise", 0.45, 2.5)}>
                <div className="scene__stack-label">Constraints</div>
                <div className="scene__stack-value">
                  <div>Single Intel N100</div>
                  <div>No open ports</div>
                  <div>Home network only</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

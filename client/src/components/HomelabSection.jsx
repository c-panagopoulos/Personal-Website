import { useEffect, useState } from "react";
import Reveal from "./Reveal.jsx";
import Terminal from "./Terminal.jsx";
import ScrambleText from "./ScrambleText.jsx";

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

// Strips a registry hostname + org segment (e.g. "ghcr.io/mealie-recipes/")
// so image names stay readable on narrow terminals; "vaultwarden/server:latest"
// has no such prefix and is left as-is.
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

  const dockerPsOutput = formatDockerPsOutput(CONTAINERS, { compact: isMobile });

  return (
    <div id="homelab" className="homelab-section">
      <div className="scene__browser homelab__terminal-wrap">
        <Terminal
          username="xpanago@n10"
          commands={["docker ps"]}
          outputs={{ 0: dockerPsOutput }}
        />
      </div>
      <Reveal style={{ padding: "30px 56px 0" }}>
        <span className="scene__browser-title" style={{ marginLeft: 0 }}>
          SCENE 03 · ONE MINI PC, EVERYTHING IN DOCKER, NO ONE TO CALL
        </span>
      </Reveal>

      <div className="section-lead">
        <Reveal className="section-lead__inner">
          <h3 className="section-lead__title">
            <ScrambleText lines={["If it breaks at 3am,", "I am the on-call."]} />
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
              <div className="fact__value">_ days</div>
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

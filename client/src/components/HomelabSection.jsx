import { useEffect, useState } from "react";
import Reveal from "./Reveal.jsx";
import Terminal from "./Terminal.jsx";
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
      <Reveal style={{ padding: "30px 56px 0" }}>
        <span className="scene__browser-title" style={{ marginLeft: 0 }}>
          SCENE 03 · ONE MINI PC, EVERYTHING IN DOCKER, NO ONE TO CALL
        </span>
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
            cards. Running my own infrastructure taught me what production actually costs.
          </p>
          <div className="scene__stack scene__stack--inline">
            <div className="scene__stack-group" style={anim(visible, "rowRise", 0.45, 2.6)}>
              <div className="scene__stack-label">ENGINEERING</div>
              <div className="scene__stack-value">
                Docker Compose, nine services
                <br />
                Tailscale mesh, zero open ports
                <br />
                n8n automations, daily use
              </div>
            </div>
            <div className="scene__stack-group" style={anim(visible, "rowRise", 0.45, 2.7)}>
              <div className="scene__stack-label">CONSTRAINTS</div>
              <div className="scene__stack-value">
                Single Intel N100
                <br />
                No open ports
                <br />
                Home network only
              </div>
            </div>
          </div>
          <div style={{ marginTop: 40 }}>
            <a
              className="btn"
              href="https://github.com/c-panagopoulos"
              target="_blank"
              rel="noreferrer"
              style={anim(visible, "ctaPop", 0.5, 2.9)}
            >
              <span className="btn__label">GitHub</span>
              <span className="btn__tag">HOMELAB / COMPOSE</span>
            </a>
          </div>
        </div>

        <div className="scene__side">
          <div className="evidence-panel">
            <div className="evidence-panel__section">
              <div className="evidence-panel__label" style={anim(visible, "rowRise", 0.4, 2.2)}>
                TOPOLOGY
              </div>
              <div className="evidence-tree">
                <span className="evidence-tree__root" style={anim(visible, "treeRise", 0.35, 2.35)}>
                  Tailscale mesh
                </span>
                <span style={anim(visible, "treeRise", 0.35, 2.43)}>
                  {"\n"} └─ n10 · Intel N100
                </span>
                {CONTAINERS.map((c, i) => (
                  <span key={c.id} style={anim(visible, "treeRise", 0.35, 2.51 + i * 0.06)}>
                    {"\n"}
                    {"     "}
                    {i < CONTAINERS.length - 1 ? "├─ " : "└─ "}
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

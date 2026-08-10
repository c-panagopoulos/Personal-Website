import "dotenv/config";
import express from "express";
import helmet from "helmet";
import path from "node:path";
import { fileURLToPath } from "node:url";
import chatRouter from "./routes/chat.js";
import { ensureSchema } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  helmet({
    // Google Fonts is a cross-origin subresource without CORP headers of
    // its own; the default 'require-corp' embedder policy blocks it.
    crossOriginEmbedderPolicy: false,
    // This app itself is only ever served over plain HTTP, whether that's
    // localhost, Tailscale, or (once deployed) behind a Cloudflare Tunnel
    // that terminates TLS at the edge. The default upgrade-insecure-requests
    // directive rewrites every asset request to https:// regardless, which
    // this origin can't answer, so the JS/CSS bundle fails to load entirely
    // (a blank page) instead of just not being upgraded.
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        upgradeInsecureRequests: null,
      },
    },
  })
);
app.use(express.json());
app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api", chatRouter);

const clientDist = path.join(__dirname, "..", "..", "client", "dist");
app.use(express.static(clientDist));
app.get("*", (req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

ensureSchema()
  .catch((err) => {
    console.error("Failed to ensure DB schema:", err.message);
  })
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  });

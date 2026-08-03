<!-- PLACEHOLDER CONTENT — replace with your real homelab notes, then re-run `npm run ingest`. -->

# Homelab

My homelab runs on a single Intel N100 mini PC — low power, always on, quiet enough to sit under a desk.

## What's running
- Nextcloud for personal file storage and sync
- n8n for automations: one workflow plans my day from sleep and calendar data each morning, another turns
  photos of handwritten notes into searchable cards
- A handful of Dockerized side projects, including TapStudy and this portfolio's own backend
- Tailscale mesh for remote access — no ports are exposed to the public internet

## Philosophy
Everything runs in Docker so the whole host can be rebuilt from a `docker-compose.yml` and a backup volume.
Running my own infrastructure — including the pager duty of being the only person who notices when something
goes down — taught me more about what "production-ready" actually means than any tutorial did.

## Uptime
The N100 host has been up for months at a time, restarted only for planned maintenance.

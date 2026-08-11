# Homelab

My homelab runs on a single Intel N100 mini PC — low power, always on, quiet enough to sit under a desk.

## What's running
Nine Docker containers, in total. Nextcloud handles personal file storage and sync, backed by its own
Postgres database and Redis cache. Caddy sits in front of everything as the reverse proxy, routing traffic
to each service. tapstudy and this portfolio's own backend are the two side projects I've built and run
there. n8n handles automations: one workflow plans my day from sleep and calendar data each morning,
another turns photos of handwritten notes into searchable cards. A Tailscale mesh handles remote access, so
no ports are exposed to the public internet.

Q: What is Vaultwarden and what do you use it for?
A: Vaultwarden is the self-hosted password manager running on my homelab, a lightweight open-source server
compatible with the Bitwarden apps. I run my own Vaultwarden instance instead of trusting a third-party
company with my passwords.

Q: What is Mealie and what do you use it for?
A: Mealie is the self-hosted recipe and meal-planning app running on my homelab. I use it to store recipes
and plan meals without relying on a third-party recipe site full of ads.

## Philosophy
Everything runs in Docker so the whole host can be rebuilt from a `docker-compose.yml` and a backup volume.
Running my own infrastructure — including the pager duty of being the only person who notices when something
goes down — taught me more about what "production-ready" actually means than any tutorial did.

## Uptime
The N100 host has been up for months at a time, restarted only for planned maintenance.

# About Charalampos Panagopoulos

I'm a full-stack developer based in Athens, Greece, currently looking for junior software engineering
roles — ideally ones that involve AI-assisted products, retrieval systems, or infrastructure work.

Before I wrote any production code, I spent years on customer support lines. That job left a mark on how I
debug: most of it is just listening carefully to what someone is actually describing before touching
anything, reproducing the real problem instead of guessing at it. That habit carried straight over into how
I build software.

What I build tends to start from something I actually needed. TapStudy exists because I wanted an honest,
low-friction record of how much I was actually studying alongside a full-time job — not another app to open
and start manually, just an NFC tag on my desk. Tap to start, tap to stop. Hermes is a support chatbot I
built for a fictional e-commerce brand that only ever
answers from what it can cite, with retrieval over PostgreSQL and pgvector and a real escalation path to a
human for anything it can't confidently answer. Both run self-hosted, on my own hardware, not on someone
else's cloud.

That hardware is a single Intel N100 mini PC running my own homelab: Nextcloud, n8n automations, and a
handful of Dockerized side projects, all reachable only over a Tailscale mesh with no ports open to the
public internet. Two of those automations do real work every day — one drafts my daily schedule from a
sleep score and my calendar, staying inside strict rules so it never overlaps anything I've already
committed to; the other turns photos of handwritten study notes into structured, searchable cards using
GPT-4o Vision. Running my own infrastructure is where I actually learned what "production" costs: backups,
monitoring, and being the only person who gets paged when something breaks at 3am.

Day to day I work across React and Vite on the frontend, Express and Server-Sent Events on the backend,
PostgreSQL and pgvector for storage and retrieval, and Docker for shipping all of it as something that can
move from my dev machine to a homelab server with one command. I run models locally with Ollama when it
makes sense to keep everything on my own hardware, and reach for a hosted API like Groq when a project
genuinely needs the extra speed or scale — I pick the tool the problem actually calls for rather than
defaulting to one or the other.

On the AI side specifically, I care a lot about not letting a model get away with things it shouldn't:
computing numbers in code and letting the model only phrase them, validating output before anything gets
written or shown, and being upfront about what a system can't answer instead of letting it guess. That
discipline shows up in TapStudy's AI insights, in Hermes' citation-only answers, and in this site's own
assistant, which is the same retrieval pattern pointed at my own CV and project notes.

I'm not chasing polish for its own sake. I'd rather ship something that solves a real problem for me first,
then make it good enough that a stranger can use it too.

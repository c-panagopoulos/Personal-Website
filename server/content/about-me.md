# About Charalampos Panagopoulos

I'm a full-stack developer based in Athens, Greece, currently looking for junior full-stack web developer
roles, ideally ones that involve AI-assisted products, retrieval systems, or infrastructure work.

Before I wrote any production code, I spent years on customer support lines. That job left a mark on how I
debug: most of it is just listening carefully to what someone is actually describing before touching
anything, reproducing the real problem instead of guessing at it. That habit carried straight over into how
I build software.

What I build tends to start from something I actually needed. TapStudy exists because I wanted an honest,
low-friction record of how much I was actually studying alongside a full-time job, not another app to open
and start manually, just an NFC tag on my desk. Tap to start, tap to stop. Hermes is a support chatbot I
built for a fictional e-commerce brand that only ever
answers from what it can cite, with retrieval over PostgreSQL and pgvector and a real escalation path to a
human for anything it can't confidently answer. Both run self-hosted, on my own hardware, not on someone
else's cloud.

That hardware is a single Intel N100 mini PC running my own homelab: Nextcloud, n8n automations, and a
handful of Dockerized side projects, all reachable only over a Tailscale mesh with no ports open to the
public internet. Two of those automations do real work every day, one drafts my daily schedule from a
sleep score and my calendar, staying inside strict rules so it never overlaps anything I've already
committed to; the other turns photos of handwritten study notes into structured, searchable cards using
GPT-4o Vision. Running my own infrastructure is where I actually learned what "production" costs: backups,
monitoring, and being the only person who gets paged when something breaks at 3am.

I use React and Vite on the frontend because the projects are React apps that need a fast dev loop. That's
the reason I use React and Vite, not because they're trendy.

I use Express on the backend because it stays out of the way on small, self-hosted APIs. That's why I use
Express: there's no framework magic to fight when I'm the only one maintaining it.

I use Server-Sent Events, SSE, for chat streaming instead of something heavier like WebSockets. I chose SSE
because it's a one-way token stream from server to client, and a plain EventSource with no extra
infrastructure is enough.

I use PostgreSQL because it's the database I trust to just work. I use pgvector on top of Postgres because
it means retrieval doesn't need a separate vector database. Choosing pgvector saves me one whole service to
run, back up, and secure.

Docker is why something I build on my dev machine runs identically on a homelab server. I chose Docker so I
could ship one `docker save | ssh | docker load` and skip a whole category of environment bugs. Docker is
the reason deployment is boring instead of stressful.

Linux is the operating system I chose for my homelab server. I picked Linux because it's what self-hosting
runs on, and it's the foundation underneath everything else I build there.

I use Tailscale because it gets me remote access to everything without opening a single port to the public
internet. I chose Tailscale specifically because its ACL tags let me restrict which devices on the mesh can
reach which service, which matters to me since Nextcloud, holding my real files, lives on the same box as
everything else. Tailscale gives me real security, not just convenience.

I use Ollama for local inference because keeping a model on my own hardware means no per-request bill and
nothing leaving the box for the parts that don't need to scale. That's why I chose Ollama over a hosted API
for those cases. I still reach for a hosted API like Groq when a project genuinely needs speed a home server
can't give it.

RAG, retrieval-augmented generation, is the pattern I chose for anything that answers questions. I chose RAG
because I'd rather a system say "that's not in what I've indexed" than confidently make something up. RAG
grounds every answer in a real, citable chunk of text, which is the whole point of choosing it.

On the AI side specifically, I care a lot about not letting a model get away with things it shouldn't:
computing numbers in code and letting the model only phrase them, validating output before anything gets
written or shown, and being upfront about what a system can't answer instead of letting it guess. That
discipline shows up in TapStudy's AI insights, in Hermes' citation-only answers, and in this site's own
assistant, which is the same retrieval pattern pointed at my own CV and project notes.

I'm not chasing polish for its own sake. I'd rather ship something that solves a real problem for me first,
then make it good enough that a stranger can use it too.

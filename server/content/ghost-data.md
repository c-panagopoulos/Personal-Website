# Ghost Data — Deletion-Audit Agent

Ghost Data Still Exists is a deletion-audit agent I designed in 24 hours, solo, for HackerRank Orchestrate in
October 2026. It checks whether a customer's personal data is really gone after a deletion request. A company
tells a customer their account has been deleted and its dashboards agree, but weeks later the data is still
in a read replica, a search index, a support attachment, an analytics export and a backup, and a sync job has
quietly recreated part of what was deleted. The agent investigates each request against the company's own
records, decides whether the deletion is really COMPLETE, INCOMPLETE, or not a deletion request at all, and
writes an ordered plan of findings, remediation and verification steps, citing the evidence behind every
claim.

GitHub: https://github.com/c-panagopoulos/deletion-audit-agent. There is no live demo, because running it
needs the organizers' dataset, which isn't public.

## Quick answers

Q: What is Ghost Data? A: Ghost Data is my hackathon project, a deletion-audit agent I built in 24 hours,
solo, for HackerRank Orchestrate in October 2026. It checks whether a customer's personal data is really
deleted across replicas, search indexes, backups and the sync jobs that quietly bring it back.

Q: What score did Ghost Data get in HackerRank Orchestrate? A: Its output for 518 deletion requests was
graded against hidden answers and scored 25.2 out of 30.

Q: Which LLMs does the Ghost Data deletion-audit agent use, and why? A: Groq's gpt-oss-120b for intake, deciding whether a request in
any language actually asks for deletion, and Gemini vision for reading PDFs and screenshots. Everything else,
identity, time rules, policy and ordering, is plain code, because the model proposes and the code decides.

Q: What was the hardest part of Ghost Data? A: Separating what the auditor could have known at audit time
from what can actually be cited as evidence. That change, together with one primary account per person, took
status accuracy on the 32 sample cases from 75% to 96.9%.

Q: What tech stack does Ghost Data use? A: Node.js 22.13 or newer with zero npm dependencies, the built-in
node:sqlite for SQL evidence, Groq gpt-oss-120b for intake and Gemini vision for PDFs and images. A full run
costs about $0.17 from an empty cache.

Q: Is there a live demo of Ghost Data? A: No, running it needs the organizers' dataset, which isn't public.
The code and 31 architecture decision records are on GitHub at
https://github.com/c-panagopoulos/deletion-audit-agent.

Q: Did you write Ghost Data yourself? A: I designed it and approved every decision, and Claude Code
implemented it under my direction. The decision records document each choice and the alternatives I
rejected.

## Result

The agent's output for 518 requests was graded against hidden answers and scored 25.2 out of 30. A full run
from an empty cache costs about $0.17 in API usage. On all 375 distinct requests of the full run, two
different LLM families (gpt-oss-120b and qwen3.8-27b) made the same intent decision every time.

## Design: the model proposes, the code decides

A deterministic workflow does everything that can be computed. LLMs are used only where the input is
genuinely unstructured, and every model answer is validated before it can affect the result. Only two
things use a model. First, intake: deciding whether a request actually asks for deletion, because requests
arrive in many languages and with negations like "do not close the account", and keyword rules failed on an
unseen language. That uses Groq's gpt-oss-120b, with a rule classifier as an independent cross-check and
fallback. Second, reading screenshots and PDFs, because some facts exist only inside an image, such as a
support attachment. That uses Gemini vision, and every extracted record is validated. Identity, time rules,
policy, ordering and citations are all plain code, so they are deterministic, reproducible and measurable
field by field.

If a model answer fails its schema, it gets one corrective retry, and after that a deterministic fallback
that is recorded in the trace. Invalid records are dropped with a reason. If the daily quota runs out, the
run stops cleanly with no output and the cache kept. Without API keys the agent still runs: intent falls
back to the rule classifier and visual evidence is reported as unread instead of guessed.

## How one request is audited

The pipeline has six steps. Intake decides whether it's really a deletion request, and if not, the audit
stops there. Identity collects every identifier the person has used: current and past emails, phones, hashed
IDs and the user id, with one primary account per person so merged accounts aren't counted twice.
Investigate reads the evidence and works out what still exists, and where, at audit time. Policy applies the
deletion and retention rules: what has to be removed and what has to be kept by law. Plan turns findings into
an ordered list of fixes, each pointing back to the evidence it came from. Verify re-checks every finding
against the evidence before the result is written.

The evidence comes in many formats: normalized SQL, JSON stored inside SQL replicas, snapshot bundles,
service exports, six log syntaxes joined by trace id, text handover notes, screenshots and PDFs. Every format
is reduced to one shape (file, time, system, resource, state, identifiers), and everything after that is
plain code.

## The hard part: known versus citable

Logs are often exported days after the events they contain. A log line written at 08:57 for a 09:00 audit is
knowledge the auditor could have had, but the file it lives in didn't exist yet at audit time, so it can't be
cited as evidence. Separating what the auditor could have known from what can actually be cited was the core
change. Together with one primary account per person and broader intake rules, it raised status accuracy on
the 32 labelled sample cases from 75% to 96.9%.

Other things the agent has to get right: replication drift, where a row deleted from the primary still sits
in a read or failover replica. Claims versus evidence, since workflow statuses and reported results are only
claims and only evidence decides a resource's state. Ghosts, where an active connector or a restorable backup
can recreate deleted data, so remediation disables flows and blocks restores before deleting dependent
records. And retention, since security audit logs and legal holds must stay, and account tombstones keep only
a stable internal id.

## Evaluation-driven development

I measured every change against labelled cases. The baseline, rule-based intake with no vision, reached 75%
status accuracy. Adding the time rules and one primary account per person took it to 96.9%. Switching to
LLM-first intake let it understand a non-English deletion request. Running vision on all files fixed the last
wrong status, because a PDF attachment held the deciding fact. These figures come from the cases I tuned on,
so they're optimistic by construction; the external measure is the 25.2 out of 30 on hidden answers.

I also measured and rejected some ideas with numbers: a timing shortcut that turned out to be an artifact of
how the data was generated, linking by elimination inside deletion batches (160 of 250 batches were
ambiguous), and an existence filter for vision records that would have thrown away real evidence.

## Engineering safeguards

It has zero npm dependencies and runs on Node.js 22.13 or newer, using the built-in node:sqlite and fetch.
SQL snapshots are untrusted, so they run in an in-memory SQLite with filesystem and extension statements
rejected. Request text and evidence are treated as data, so prompt-injection attempts inside the request,
inside log evidence and inside a PDF don't change the decision. Model answers are cached by model, settings,
prompt and input, and two builds of the output are byte-identical. A file-level verifier re-reads the output
from disk and checks the header, row count, duplicates, row order and JSON validity; seven deliberately
corrupted files are all rejected. Thinking tokens are counted in the cost report, and the cost from an empty
cache is reported next to the billed cost.

## Constraints and limitations

It was built in 24 hours, solo, on a Groq tier I chose with a 200k tokens per day limit. Some accounts and
fully anonymized analytics records have no identifier linking them to the person in the supplied evidence,
and the agent refuses to guess, which costs some recall. There's no automated unit-test suite yet; behaviour
is locked by the evaluation harness, byte-identical rebuilds and fault-injection checks.

## How I built it

I directed the design and approved every decision, and Claude Code implemented it under my direction. Each
choice, the alternatives I rejected, and the incidents along the way are recorded as 31 architecture decision
records in code/docs/decisions.md in the repo.

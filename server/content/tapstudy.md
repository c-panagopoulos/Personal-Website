<!-- PLACEHOLDER CONTENT — replace with your real tapstudy README/notes, then re-run `npm run ingest`. -->

# tapstudy

tapstudy is a study session tracker I built because I kept forgetting to log my own study time. It's
triggered by an NFC tag stuck to my desk: tap my phone once to start a session, tap again to stop it.

## Why it exists
Every other time-tracking app I tried required opening an app and pressing a button, which meant I never
actually did it. Removing the "open the app" step by using NFC made the friction low enough that I still use
it every morning, two years later.

## Stack
- React frontend, Express backend, PostgreSQL for session storage
- Deployed as a single Docker image on my own hardware
- Auth, rate limiting and error handling were built in from the first version, before there was any real
  usage to justify them — a deliberate choice, not scope creep

## Status
Actively used daily. It's the first thing I interact with most mornings.

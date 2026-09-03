# Haven KNUST

A confidential mental-health support platform built for KNUST students —
anonymous peer support threads with automatic risk triage, mood tracking,
counselor booking with a live video session room, direct messaging between
students and counselors, and a counselor-facing dashboard for triage,
moderation, and analytics.

Built as a real 3-tier application: a React frontend, a Node/Express backend
that owns all business logic and authentication, and a Postgres (Supabase)
database — not a frontend talking directly to a database with no server in
between.

## Project structure

```
frontend/   React + Vite single-page app (the UI)
backend/    Node + Express API — auth, business logic, risk triage; the only thing that talks to the database
database/   Postgres schema (database/schema.sql) for the Supabase project
```

The frontend never talks to the database directly — every read/write goes
through `backend/`. That is what makes role checks (student vs. counselor),
password authentication, and data validation actually enforceable, instead of
just being client-side UI state that anyone with dev tools open could bypass.

## Features

**Students**
- Real accounts (register with email/password, or enter as an anonymous
  guest) — passwords are hashed with bcrypt, sessions are signed JWTs
- Anonymous or identified peer support threads, with replies, "support"
  (like), and emoji reactions
- Every new post is run through a server-side risk-triage scan (keyword/rule
  based) that scores it LOW / MODERATE / HIGH / CRISIS and surfaces crisis
  resources immediately if needed
- Daily mood check-ins with a running streak
- Book a session with a real counselor (Telehealth or in-person), see all
  booked sessions under **My Sessions**, and join a live session room
- Direct-message a counselor
- Save personal safety-plan info and bookmark resource-library guides
- Read counselor-published articles and daily encouragement messages

**Counselors** (accounts are seeded/admin-provisioned only — never
self-registered)
- Triage queue of student threads sorted by risk score, filterable by risk
  level, with a one-click respond flow
- See and manage their own booked sessions (never another counselor's)
- Publish articles and daily goodwill/encouragement messages
- Direct-message inbox
- Moderation Hub: review posts flagged HIGH/CRISIS and clear them
- Analytics dashboard: live category breakdown and post-volume trend, computed
  from real data

## Tech stack

- **Frontend**: React 19, Vite, plain CSS (no framework)
- **Backend**: Node.js, Express, `jsonwebtoken` + `bcryptjs` for auth,
  `@supabase/supabase-js` as the Postgres client
- **Database**: Postgres via Supabase
- **AI**: Google Gemini integration exists in the codebase, proxied through
  the backend so the API key never reaches the browser — currently not
  enabled in the UI (see Known Limitations)

## First-time setup

1. **Database**: follow [`database/README.md`](./database/README.md) to
   create the schema in your Supabase project.
2. **Backend**:
   ```bash
   cd backend
   npm install
   cp .env.example .env   # fill in SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, JWT_SECRET
   npm run seed            # creates demo student + counselor accounts
   npm run dev              # http://localhost:4000
   ```
3. **Frontend** (in a second terminal):
   ```bash
   cd frontend
   npm install
   npm run dev               # http://localhost:5173
   ```

Open http://localhost:5173 — the frontend talks to the backend via
`VITE_API_URL` in `frontend/.env` (defaults to `http://localhost:4000/api`).

## Demo accounts (created by `npm run seed`)

| Role | Email | Password |
|---|---|---|
| Student | jordan.rivera@st.knust.edu.gh | password123 |
| Counselor | s.jenkins@knust.edu.gh | counselorpass |
| Counselor | m.peterson@knust.edu.gh | counselorpass |
| Counselor | a.rivera@knust.edu.gh | counselorpass |

Students can also register their own account from the login page, or enter
as an anonymous guest (still a real backend-issued account behind the
scenes, just created instantly with an `Anon#…` alias).

## Known limitations

Documented honestly rather than hidden, since these were deliberate scope
choices under a deadline, not oversights discovered later:

- **Database security is relaxed for the demo.** Row Level Security is off
  and the backend currently runs on the Supabase `anon` key rather than a
  `service_role` key. The architecture is designed for this to be locked
  down with about five minutes of Supabase dashboard work — see the
  "Security note" in [`database/README.md`](./database/README.md) for the
  exact steps.
- **The telehealth session room is a simulated UI**, not a real WebRTC/video
  integration — mic/camera/screen-share controls are visual only, and the
  video area is a placeholder. Booking, scheduling, and both sides seeing the
  same session are all real.
- **The AI companion (Gemini chat) is built and already secured
  server-side**, but it's currently not rendered in the UI — the component
  and backend route both exist (`frontend/src/components/FloatingAIAssistant.jsx`,
  `backend/src/routes/ai.js`) if it needs to be switched back on later.
- **Risk triage is keyword/rule-based**, not a trained ML model — it looks
  for crisis/high-risk/moderate-risk phrases in each post and scores
  accordingly. It runs identically on the backend for every post (not just
  client-side), so the score that gets stored and shown to counselors can't
  be spoofed by the browser.
- **Counselor accounts are seed/admin-provisioned only** — there's no
  self-service counselor sign-up flow, which is intentional (a student
  shouldn't be able to grant themselves counselor access).

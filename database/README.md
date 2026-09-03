# Database

This project uses **Supabase Postgres** as its database. This folder holds the
schema — it isn't a running service itself, it's the source of truth for what
gets applied to your Supabase project.

## Setup

1. Open your Supabase project → **SQL Editor**.
2. Paste the contents of [`schema.sql`](./schema.sql) and run it. It creates
   every table the app needs (`users`, `posts`, `replies`, `post_supports`,
   `post_reactions`, `mood_logs`, `appointments`, `direct_messages`,
   `articles`, `goodwill_messages`, `safety_plans`, `clinical_analytics`,
   `counselor_actions`, `feedbacks`, `bookmarks`).
3. From your Supabase project → **Settings → API**, copy your `Project URL`
   and a key into `backend/.env` — see the security note below for which key.
4. Seed a few demo accounts (a couple of counselors + one student) by running,
   from `backend/`:
   ```bash
   npm run seed
   ```

## Security note (read before deploying anywhere real)

Row Level Security is **off** on every table in `schema.sql`, and the backend
is currently configured to work with either the `anon` key or the
`service_role` key in `SUPABASE_SERVICE_ROLE_KEY`. This was a deliberate
simplification made under a hard demo deadline, not the intended end state —
the architecture (a backend that owns all writes, does its own auth/role
checks, and is the only thing touching the database) is designed to be
secured properly with a small amount of follow-up work:

1. In the Supabase SQL Editor, run for each table:
   ```sql
   alter table <table_name> enable row level security;
   ```
   With no policies added, this alone blocks all access via the public
   `anon`/`authenticated` keys — only the `service_role` key bypasses RLS.
2. Get your **`service_role`** secret key (Settings → API — not the `anon`
   key) and put it in `backend/.env` as `SUPABASE_SERVICE_ROLE_KEY`. The
   backend already only ever uses this one variable, so no code changes are
   needed — just swap the value.

Once both of those are done, the `anon` key becomes useless even if it
leaks, and the backend is the only path to the data — which is the real
security model this project is built around, just not fully switched on
for the submitted demo.

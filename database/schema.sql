-- Haven KNUST — Database Schema (Supabase / Postgres)
--
-- How to apply: paste this whole file into the Supabase SQL Editor for your
-- project (or run it via `psql` against your Supabase connection string) and
-- execute once. Safe to re-run — every statement is idempotent.
--
-- NOTE: Row Level Security is intentionally left OFF here so the app can run
-- end-to-end with just the anon key during development/demo. Before any real
-- deployment, re-enable RLS on every table below with policies that only
-- allow the backend's service_role key through — see database/README.md.

create extension if not exists pgcrypto;

-- Drop tables from the old prototype schema (mismatched columns) so the
-- fresh shape below can be created cleanly. Only placeholder/demo content
-- lived in these — nothing worth preserving.
drop table if exists bookmarks cascade;
drop table if exists feedbacks cascade;
drop table if exists counselor_actions cascade;
drop table if exists clinical_analytics cascade;
drop table if exists safety_plans cascade;
drop table if exists goodwill_messages cascade;
drop table if exists articles cascade;
drop table if exists direct_messages cascade;
drop table if exists appointments cascade;
drop table if exists mood_logs cascade;
drop table if exists post_reactions cascade;
drop table if exists post_supports cascade;
drop table if exists replies cascade;
drop table if exists posts cascade;
drop table if exists users cascade;

-- ============================================================
-- users — real accounts (bcrypt password hashes, JWT-based auth)
-- ============================================================
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  display_name text not null,
  role text not null default 'student' check (role in ('student', 'counselor')),
  is_guest boolean not null default false,
  license_id text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- posts — peer support threads
-- ============================================================
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references users(id) on delete set null,
  author_name text not null,
  is_anonymous boolean not null default false,
  title text not null,
  content text not null,
  tag text not null default 'General',
  risk_level text not null default 'LOW',
  risk_score int not null default 0,
  moderation_status text not null default 'active' check (moderation_status in ('active', 'cleared', 'flagged')),
  created_at timestamptz not null default now()
);
create index if not exists idx_posts_created_at on posts (created_at desc);

-- ============================================================
-- replies — thread replies (student or counselor)
-- ============================================================
create table if not exists replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  author_id uuid references users(id) on delete set null,
  author text not null,
  is_counselor boolean not null default false,
  text text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_replies_post_id on replies (post_id);

-- ============================================================
-- post_supports — "support" / like button
-- ============================================================
create table if not exists post_supports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);
create index if not exists idx_post_supports_post_id on post_supports (post_id);

-- ============================================================
-- post_reactions — empathy emoji reactions
-- ============================================================
create table if not exists post_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  reaction_type text not null,
  created_at timestamptz not null default now(),
  unique (post_id, user_id, reaction_type)
);
create index if not exists idx_post_reactions_post_id on post_reactions (post_id);

-- ============================================================
-- mood_logs — daily mood check-ins
-- ============================================================
create table if not exists mood_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  mood_score int not null check (mood_score between 1 and 5),
  mood_label text,
  note text,
  created_at timestamptz not null default now()
);
create index if not exists idx_mood_logs_user_id on mood_logs (user_id, created_at desc);

-- ============================================================
-- appointments — booked telehealth / in-person sessions
-- ============================================================
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references users(id) on delete cascade,
  student_alias text not null,
  counselor_id uuid references users(id) on delete set null,
  counselor_name text not null,
  appointment_date date not null,
  time_slot text not null,
  mode text not null default 'Telehealth Video',
  topic text,
  status text not null default 'Confirmed',
  meeting_url text,
  created_at timestamptz not null default now()
);
create index if not exists idx_appointments_student_id on appointments (student_id);
create index if not exists idx_appointments_counselor_id on appointments (counselor_id);

-- Migration for a database that already has an `appointments` table from
-- before counselor_id existed (safe/idempotent to re-run):
-- alter table appointments add column if not exists counselor_id uuid references users(id) on delete set null;
-- create index if not exists idx_appointments_counselor_id on appointments (counselor_id);

-- NOTE: direct_messages (student<->counselor inbox) has been removed — the
-- app no longer has a messaging feature, only booked sessions. If an old
-- install still has this table sitting around, it's unused and harmless;
-- drop it with `drop table if exists direct_messages cascade;` if desired.

-- ============================================================
-- articles — counselor-published psychoeducational articles
-- ============================================================
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references users(id) on delete set null,
  title text not null,
  category text not null,
  read_time text,
  author text not null,
  summary text,
  content text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- goodwill_messages — daily counselor encouragement cards
-- ============================================================
create table if not exists goodwill_messages (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references users(id) on delete set null,
  text text not null,
  author text not null,
  role text,
  color text,
  text_color text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- safety_plans — one live plan per user (upsert, not append-only)
-- ============================================================
create table if not exists safety_plans (
  user_id uuid primary key references users(id) on delete cascade,
  trusted_contact text,
  coping_strategy text,
  safe_place text,
  affirmation text,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- clinical_analytics — risk-triage event log (feeds the real analytics trend chart)
-- ============================================================
create table if not exists clinical_analytics (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  post_id uuid references posts(id) on delete set null,
  risk_level text,
  risk_score int,
  created_at timestamptz not null default now()
);
create index if not exists idx_clinical_analytics_created_at on clinical_analytics (created_at);

-- ============================================================
-- counselor_actions — audit log of counselor publish/moderation actions
-- ============================================================
create table if not exists counselor_actions (
  id uuid primary key default gen_random_uuid(),
  counselor_id uuid references users(id) on delete set null,
  action_type text not null,
  content_id text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- feedbacks — landing page testimonials
-- ============================================================
create table if not exists feedbacks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  rating int check (rating between 1 and 5),
  text text not null,
  author_name text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- bookmarks — saved resource library items (per user)
-- ============================================================
create table if not exists bookmarks (
  user_id uuid not null references users(id) on delete cascade,
  resource_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, resource_id)
);

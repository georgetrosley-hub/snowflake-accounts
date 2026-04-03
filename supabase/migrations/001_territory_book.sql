-- Run in Supabase SQL Editor (or supabase db push).
-- Stores the territory intelligence customer book as JSON.

create table if not exists public.territory_book (
  id text primary key default 'default',
  payload jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

comment on table public.territory_book is 'Snowflake AE territory map accounts JSON (synced from app).';

-- Service role (used by Next.js API route) bypasses RLS.
-- If you later read from the browser with the anon key, add policies instead of using service role on the client.

alter table public.territory_book enable row level security;

-- No anon policies: all access via service role from /api/territory only.
-- First successful save from the app POSTs the row (upsert).

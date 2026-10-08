-- YO privacy-minimized product analytics foundation.
-- Server-only writes using the service role. Do not expose raw events to clients.
create table if not exists public.growth_events (
  id uuid primary key default gen_random_uuid(),
  event_key uuid not null unique,
  event_name text not null check (event_name in (
    'invite_opened','room_join_attempted','room_joined',
    'voice_connected','voice_disconnected','room_created','invite_shared'
  )),
  anonymous_id uuid not null,
  room_id text,
  invite_id text,
  source text not null default 'unknown' check (source in (
    'x','threads','bluesky','line','discord','native','copy','unknown','instagram','tiktok','reddit'
  )),
  duration_seconds integer check (duration_seconds between 0 and 86400),
  occurred_at timestamptz not null default now()
);
create index if not exists growth_events_time_idx on public.growth_events (occurred_at desc);
create index if not exists growth_events_name_time_idx on public.growth_events (event_name, occurred_at desc);
create index if not exists growth_events_actor_time_idx on public.growth_events (anonymous_id, occurred_at desc);
alter table public.growth_events enable row level security;
revoke all on public.growth_events from anon, authenticated;
-- Restrict access to backend service role; no permissive RLS policies.
comment on table public.growth_events is 'Minimal analytics events; no voice, IP, email or SNS identity. Configure retention cleanup separately.';

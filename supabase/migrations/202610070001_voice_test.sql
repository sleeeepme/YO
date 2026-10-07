-- Limited invite-guest test. Only the trusted Next.js server may access these objects.
begin;
create table public.yo_voice_rooms (
 id text primary key, title text not null check(char_length(title) between 1 and 40),
 capacity integer not null check(capacity between 2 and 8), host_id uuid not null,
 invite_hash text not null, expires_at timestamptz not null, closed boolean not null default false,
 created_at timestamptz not null default now()
);
create table public.yo_voice_slots (
 room_id text not null references public.yo_voice_rooms(id) on delete cascade,
 guest_id uuid not null, lease_until timestamptz not null,
 primary key(room_id, guest_id)
);
create table public.yo_voice_limits (key text primary key, window_start timestamptz not null, hits integer not null);
alter table public.yo_voice_rooms enable row level security;
alter table public.yo_voice_slots enable row level security;
alter table public.yo_voice_limits enable row level security;
revoke all on public.yo_voice_rooms, public.yo_voice_slots, public.yo_voice_limits from anon, authenticated;
grant select, insert, update, delete on public.yo_voice_rooms, public.yo_voice_slots, public.yo_voice_limits to service_role;
create function public.yo_voice_rate(p_key text, p_limit integer) returns boolean
language plpgsql security invoker set search_path = '' as $$
declare n integer;
begin
 insert into public.yo_voice_limits as l (key, window_start, hits) values (p_key, now(), 1)
 on conflict (key) do update set window_start = case when l.window_start < now() - interval '1 minute' then now() else l.window_start end,
 hits = case when l.window_start < now() - interval '1 minute' then 1 else l.hits + 1 end returning hits into n;
 return n <= p_limit;
end $$;
create function public.yo_voice_reserve(p_room text, p_guest uuid, p_connected uuid[]) returns boolean
language plpgsql security invoker set search_path = '' as $$
declare r public.yo_voice_rooms; occupied integer;
begin
 -- Serialize all reservations for this room, including duplicate identities.
 select * into r from public.yo_voice_rooms where id = p_room for update;
 if not found or r.closed or r.expires_at <= now() then return false; end if;
 delete from public.yo_voice_slots where room_id = p_room and lease_until < now() and not (guest_id = any(p_connected));
 -- Connected identities count even if their original lease expired.
 select count(*) into occupied from (select guest_id from public.yo_voice_slots where room_id = p_room union select unnest(p_connected)) s;
 if not exists(select 1 from public.yo_voice_slots where room_id = p_room and guest_id = p_guest) and not (p_guest = any(p_connected)) and occupied >= r.capacity then return false; end if;
 insert into public.yo_voice_slots(room_id, guest_id, lease_until) values(p_room, p_guest, now() + interval '2 minutes')
 on conflict(room_id, guest_id) do update set lease_until = excluded.lease_until;
 return true;
end $$;
create function public.yo_voice_release(p_room text, p_guest uuid) returns void
language plpgsql security invoker set search_path = '' as $$
begin
 perform 1 from public.yo_voice_rooms where id = p_room for update;
 delete from public.yo_voice_slots where room_id = p_room and guest_id = p_guest;
end $$;
revoke execute on function public.yo_voice_rate(text,integer), public.yo_voice_reserve(text,uuid,uuid[]), public.yo_voice_release(text,uuid) from public, anon, authenticated;
grant execute on function public.yo_voice_rate(text,integer), public.yo_voice_reserve(text,uuid,uuid[]), public.yo_voice_release(text,uuid) to service_role;
commit;

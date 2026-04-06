create extension if not exists pgcrypto;

create table if not exists public.council_members (
  id text primary key,
  name text not null,
  image text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.vote_sessions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  is_open boolean not null default false,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('admin', 'council')),
  display_name text,
  member_id text references public.council_members (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.vote_sessions (id) on delete cascade,
  member_id text not null references public.council_members (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  decision text not null check (decision in ('APRUEBO', 'RECHAZO', 'ABSTENCION')),
  updated_at timestamptz not null default now(),
  unique (session_id, member_id),
  unique (session_id, user_id)
);

alter table public.council_members enable row level security;
alter table public.vote_sessions enable row level security;
alter table public.profiles enable row level security;
alter table public.votes enable row level security;

create or replace function public.current_role()
returns text
language sql
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

create policy "public read members"
on public.council_members
for select
using (true);

create policy "admin manage members"
on public.council_members
for all
using (public.current_role() = 'admin')
with check (public.current_role() = 'admin');

create policy "public read sessions"
on public.vote_sessions
for select
using (true);

create policy "admin manage sessions"
on public.vote_sessions
for all
using (public.current_role() = 'admin')
with check (public.current_role() = 'admin');

create policy "users read own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "public read votes"
on public.votes
for select
using (true);

create policy "admin manage votes"
on public.votes
for all
using (public.current_role() = 'admin')
with check (public.current_role() = 'admin');

create policy "council insert own vote"
on public.votes
for insert
with check (
  auth.uid() = user_id
  and public.current_role() = 'council'
  and member_id = (select member_id from public.profiles where id = auth.uid())
);

create policy "council update own vote"
on public.votes
for update
using (
  auth.uid() = user_id
  and public.current_role() = 'council'
  and member_id = (select member_id from public.profiles where id = auth.uid())
)
with check (
  auth.uid() = user_id
  and public.current_role() = 'council'
  and member_id = (select member_id from public.profiles where id = auth.uid())
);

insert into public.council_members (id, name, image)
values
  ('concejal-1', 'Concejal 1', 'https://placehold.co/320x320/0f172a/f8fafc?text=Concejal+1'),
  ('concejal-2', 'Concejal 2', 'https://placehold.co/320x320/0f172a/f8fafc?text=Concejal+2'),
  ('concejal-3', 'Concejal 3', 'https://placehold.co/320x320/0f172a/f8fafc?text=Concejal+3'),
  ('concejal-4', 'Concejal 4', 'https://placehold.co/320x320/0f172a/f8fafc?text=Concejal+4'),
  ('concejal-5', 'Concejal 5', 'https://placehold.co/320x320/0f172a/f8fafc?text=Concejal+5'),
  ('concejal-6', 'Concejal 6', 'https://placehold.co/320x320/0f172a/f8fafc?text=Concejal+6'),
  ('presidente', 'Presidente', 'https://placehold.co/320x320/0f172a/f8fafc?text=Presidente')
on conflict (id) do nothing;

-- Perfect Wedding — Supabase Schema

-- Chat messages (realtime guest chat)
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  author text not null,
  content text not null,
  created_at timestamptz default now() not null
);

-- Guestbook entries
create table if not exists guestbook_entries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  message text not null,
  created_at timestamptz default now() not null
);

-- Wedding info (flexible key-value + JSON)
create table if not exists wedding_info (
  id uuid default gen_random_uuid() primary key,
  key text unique not null,
  value jsonb not null,
  updated_at timestamptz default now() not null
);

-- Enable realtime for chat messages
alter publication supabase_realtime add table messages;

-- Row Level Security (open read for now, can be tightened later)
alter table messages enable row level security;
alter table guestbook_entries enable row level security;
alter table wedding_info enable row level security;

create policy "Anyone can read messages" on messages for select using (true);
create policy "Anyone can insert messages" on messages for insert with check (true);

create policy "Anyone can read guestbook" on guestbook_entries for select using (true);
create policy "Anyone can write guestbook" on guestbook_entries for insert with check (true);

create policy "Anyone can read wedding info" on wedding_info for select using (true);

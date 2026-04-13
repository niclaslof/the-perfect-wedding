-- The Perfect Wedding — Complete Supabase Schema
-- Run this in Supabase SQL Editor to set up all tables

-- ============================================
-- CORE TABLES
-- ============================================

create table if not exists weddings (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  date date,
  venue_name text,
  venue_address text,
  venue_lat numeric,
  venue_lng numeric,
  ceremony_time timestamptz,
  dinner_time timestamptz,
  party_time timestamptz,
  dress_code text,
  osa_deadline date,
  extra_info jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null
);

create table if not exists guests (
  id uuid default gen_random_uuid() primary key,
  wedding_id uuid references weddings(id) on delete cascade not null,
  name text not null,
  email text,
  phone text,
  invite_code text unique not null,
  role text not null default 'guest'
    check (role in ('admin', 'coordinator', 'guest')),
  coordinator_type text
    check (coordinator_type in ('toastmaster', 'dj', 'photographer', null)),
  plus_one_allowed boolean default false,
  plus_one_name text,
  invite_sent_at timestamptz,
  invite_sent_via text
    check (invite_sent_via in ('email', 'sms', null)),
  last_seen_at timestamptz,
  created_at timestamptz default now() not null
);

create table if not exists event_parts (
  id uuid default gen_random_uuid() primary key,
  wedding_id uuid references weddings(id) on delete cascade not null,
  name text not null,
  slug text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  location_override text,
  description text,
  sort_order integer default 0
);

create table if not exists guest_event_parts (
  guest_id uuid references guests(id) on delete cascade,
  event_part_id uuid references event_parts(id) on delete cascade,
  primary key (guest_id, event_part_id)
);

-- ============================================
-- RSVP / OSA
-- ============================================

create table if not exists rsvps (
  id uuid default gen_random_uuid() primary key,
  guest_id uuid references guests(id) on delete cascade unique not null,
  attending boolean,
  plus_one_attending boolean default false,
  plus_one_name text,
  message text,
  responded_at timestamptz,
  created_at timestamptz default now() not null
);

create table if not exists dietary_preferences (
  id uuid default gen_random_uuid() primary key,
  guest_id uuid references guests(id) on delete cascade not null,
  is_plus_one boolean default false,
  allergies text[] default '{}',
  dietary_type text default 'none'
    check (dietary_type in ('none', 'vegetarian', 'vegan', 'halal', 'kosher', 'other')),
  other_notes text,
  created_at timestamptz default now() not null,
  unique(guest_id, is_plus_one)
);

-- ============================================
-- SCHEDULE & SPEECHES
-- ============================================

create table if not exists schedule_items (
  id uuid default gen_random_uuid() primary key,
  event_part_id uuid references event_parts(id) on delete cascade not null,
  title text not null,
  description text,
  starts_at timestamptz,
  duration_minutes integer,
  item_type text default 'general'
    check (item_type in ('general', 'speech', 'activity', 'meal', 'break')),
  assigned_guest_id uuid references guests(id),
  sort_order integer default 0,
  is_public boolean default true
);

create table if not exists speech_requests (
  id uuid default gen_random_uuid() primary key,
  guest_id uuid references guests(id) on delete cascade not null,
  event_part_id uuid references event_parts(id) on delete cascade not null,
  preferred_time text,
  estimated_minutes integer default 5,
  topic text,
  status text default 'pending'
    check (status in ('pending', 'approved', 'denied', 'rescheduled')),
  admin_note text,
  schedule_item_id uuid references schedule_items(id),
  created_at timestamptz default now() not null
);

-- ============================================
-- CHAT
-- ============================================

create table if not exists chat_channels (
  id uuid default gen_random_uuid() primary key,
  wedding_id uuid references weddings(id) on delete cascade not null,
  channel_type text not null default 'group'
    check (channel_type in ('group', 'dm')),
  name text,
  created_at timestamptz default now() not null
);

create table if not exists chat_channel_members (
  channel_id uuid references chat_channels(id) on delete cascade,
  guest_id uuid references guests(id) on delete cascade,
  primary key (channel_id, guest_id)
);

create table if not exists chat_messages (
  id uuid default gen_random_uuid() primary key,
  channel_id uuid references chat_channels(id) on delete cascade not null,
  guest_id uuid references guests(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now() not null
);

-- ============================================
-- PHOTOS
-- ============================================

create table if not exists photos (
  id uuid default gen_random_uuid() primary key,
  wedding_id uuid references weddings(id) on delete cascade not null,
  guest_id uuid references guests(id) on delete cascade not null,
  storage_path text not null,
  caption text,
  created_at timestamptz default now() not null
);

-- ============================================
-- GUESTBOOK
-- ============================================

create table if not exists guestbook_entries (
  id uuid default gen_random_uuid() primary key,
  wedding_id uuid references weddings(id) on delete cascade not null,
  guest_id uuid references guests(id) on delete cascade,
  name text not null,
  message text not null,
  created_at timestamptz default now() not null
);

create table if not exists guestbook_replies (
  id uuid default gen_random_uuid() primary key,
  entry_id uuid references guestbook_entries(id) on delete cascade not null,
  guest_id uuid references guests(id) on delete cascade not null,
  message text not null,
  created_at timestamptz default now() not null
);

-- ============================================
-- NOTIFICATIONS
-- ============================================

create table if not exists notifications (
  id uuid default gen_random_uuid() primary key,
  wedding_id uuid references weddings(id) on delete cascade not null,
  target_guest_id uuid references guests(id) on delete cascade,
  title text not null,
  body text,
  notification_type text default 'info'
    check (notification_type in ('info', 'update', 'speech_approved', 'speech_denied', 'reminder')),
  read_at timestamptz,
  created_at timestamptz default now() not null
);

-- ============================================
-- REALTIME
-- ============================================

alter publication supabase_realtime add table chat_messages;
alter publication supabase_realtime add table notifications;

-- ============================================
-- ROW LEVEL SECURITY
-- Auth is handled via API routes with service role key.
-- These policies are permissive for reads, writes go through API.
-- ============================================

alter table weddings enable row level security;
alter table guests enable row level security;
alter table event_parts enable row level security;
alter table guest_event_parts enable row level security;
alter table rsvps enable row level security;
alter table dietary_preferences enable row level security;
alter table schedule_items enable row level security;
alter table speech_requests enable row level security;
alter table chat_channels enable row level security;
alter table chat_channel_members enable row level security;
alter table chat_messages enable row level security;
alter table photos enable row level security;
alter table guestbook_entries enable row level security;
alter table guestbook_replies enable row level security;
alter table notifications enable row level security;

-- Public read policies (sensitive data filtered in API routes)
create policy "Public read weddings" on weddings for select using (true);
create policy "Public read guests" on guests for select using (true);
create policy "Public read event_parts" on event_parts for select using (true);
create policy "Public read guest_event_parts" on guest_event_parts for select using (true);
create policy "Public read rsvps" on rsvps for select using (true);
create policy "Public read schedule_items" on schedule_items for select using (is_public = true);
create policy "Public read chat_messages" on chat_messages for select using (true);
create policy "Public read photos" on photos for select using (true);
create policy "Public read guestbook_entries" on guestbook_entries for select using (true);
create policy "Public read guestbook_replies" on guestbook_replies for select using (true);
create policy "Public read notifications" on notifications for select using (true);
create policy "Public read chat_channels" on chat_channels for select using (true);
create policy "Public read chat_channel_members" on chat_channel_members for select using (true);

-- Insert policies (for client-side Realtime inserts)
create policy "Authenticated insert chat_messages" on chat_messages for insert with check (true);
create policy "Authenticated insert guestbook_entries" on guestbook_entries for insert with check (true);

-- ============================================
-- INDEXES
-- ============================================

create index if not exists idx_guests_invite_code on guests(invite_code);
create index if not exists idx_guests_wedding_id on guests(wedding_id);
create index if not exists idx_rsvps_guest_id on rsvps(guest_id);
create index if not exists idx_chat_messages_channel on chat_messages(channel_id, created_at);
create index if not exists idx_notifications_target on notifications(target_guest_id, created_at);
create index if not exists idx_guestbook_wedding on guestbook_entries(wedding_id, created_at);
create index if not exists idx_photos_wedding on photos(wedding_id, created_at);

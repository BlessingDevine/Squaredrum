-- squaredrum.com: contact messages and newsletter sign-ups.
-- Run once in Supabase → SQL Editor (project "Musicsquare Radio").
-- The website's publishable key can only INSERT into these tables; nobody
-- can read them except you in the dashboard (Table Editor).

create table if not exists site_messages (
  message_id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 200),
  company text check (char_length(company) <= 200),
  topic text not null default 'General' check (char_length(topic) <= 60),
  message text not null check (char_length(message) between 1 and 5000),
  status text not null default 'new' check (status in ('new', 'replied', 'archived')),
  created_at timestamptz not null default now()
);

create table if not exists newsletter_signups (
  signup_id uuid primary key default gen_random_uuid(),
  email text not null unique check (char_length(email) between 3 and 200),
  source text not null default 'squaredrum.com' check (char_length(source) <= 60),
  created_at timestamptz not null default now()
);

alter table site_messages enable row level security;
alter table newsletter_signups enable row level security;

drop policy if exists "website can send messages" on site_messages;
create policy "website can send messages" on site_messages
  for insert to anon, authenticated with check (status = 'new');

drop policy if exists "website can add sign-ups" on newsletter_signups;
create policy "website can add sign-ups" on newsletter_signups
  for insert to anon, authenticated with check (true);

grant insert on site_messages, newsletter_signups to anon, authenticated;

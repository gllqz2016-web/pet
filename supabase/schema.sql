create extension if not exists pgcrypto;

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  phone text unique,
  name text not null default 'Sarah',
  avatar text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.pets (
  id text primary key,
  name text not null,
  age text not null default '',
  breed text not null default '',
  gender text not null default '',
  tags text[] not null default '{}',
  location text not null default '',
  description text not null default '',
  image text not null default '',
  type text not null check (type in ('cat', 'dog')),
  urgent boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  user_id uuid not null references public.app_users(id) on delete cascade,
  pet_id text not null references public.pets(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, pet_id)
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.app_users(id) on delete cascade,
  pet_id text not null references public.pets(id) on delete cascade,
  status text not null default '正在审核',
  date text not null default '刚刚',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists favorites_user_id_created_at_idx on public.favorites(user_id, created_at desc);
create index if not exists applications_user_id_created_at_idx on public.applications(user_id, created_at desc);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.app_users(id) on delete cascade,
  category text not null check (category in ('申请', '健康', '活动', '进度', '目击')),
  title text not null,
  body text not null,
  image text not null default '',
  action_label text not null default '查看详情',
  action_url text not null default '',
  status text not null default 'unread' check (status in ('unread', 'read', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.notification_preferences (
  user_id uuid primary key references public.app_users(id) on delete cascade,
  adoption_updates boolean not null default true,
  sighting_reports boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notifications_user_status_created_at_idx on public.notifications(user_id, status, created_at desc);

create table if not exists public.events (
  id text primary key,
  title text not null,
  category text not null,
  summary text not null default '',
  description text not null default '',
  image text not null default '',
  location text not null default '',
  starts_at timestamptz not null,
  capacity integer not null default 30,
  created_at timestamptz not null default now()
);

create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.app_users(id) on delete cascade,
  event_id text not null references public.events(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, event_id)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.app_users(id) on delete set null,
  title text not null,
  report_type text not null check (report_type in ('丢失', '目击', '随手拍', '已团聚')),
  species text not null default '',
  location text not null,
  happened_at timestamptz not null default now(),
  description text not null default '',
  image text not null default '',
  reward integer,
  status text not null default 'open' check (status in ('open', 'resolved', 'archived')),
  created_at timestamptz not null default now()
);

create index if not exists events_starts_at_idx on public.events(starts_at asc);
create index if not exists event_registrations_user_id_idx on public.event_registrations(user_id, created_at desc);
create index if not exists reports_created_at_idx on public.reports(created_at desc);

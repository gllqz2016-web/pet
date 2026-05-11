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

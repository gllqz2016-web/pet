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

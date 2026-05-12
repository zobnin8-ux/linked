create table if not exists audits (
  id uuid primary key default gen_random_uuid(),
  linkedin_url text not null,
  email text not null,
  target_role text,
  status text not null default 'pending',
  severity_score int,
  top_3_insights jsonb,
  full_report jsonb,
  raw_profile jsonb,
  error_message text,
  ip_address text,
  user_agent text,
  created_at timestamptz default now(),
  completed_at timestamptz
);

create index if not exists idx_audits_email on audits(email);
create index if not exists idx_audits_status on audits(status);
create index if not exists idx_audits_created on audits(created_at desc);
create index if not exists idx_audits_linkedin_url on audits(linkedin_url);

create table if not exists rate_limits (
  ip_address text not null,
  endpoint text not null,
  count int default 1,
  window_start timestamptz default now(),
  primary key (ip_address, endpoint, window_start)
);

create index if not exists idx_rate_limits_lookup on rate_limits (ip_address, endpoint, window_start desc);

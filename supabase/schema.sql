-- =============================================================================
-- AdverBright — Supabase schema for the contact form + admin lead inbox
-- Run once in Supabase → SQL Editor → New query → paste → Run.
--
-- Security model
--   • The website uses the public "anon" key (safe to expose — that's its purpose).
--   • anon can only INSERT the form columns. It can never read, update or delete.
--   • Only users listed in public.admin_users can read leads or change status/notes.
--   • A trigger rate-limits submissions and stamps server-side fields.
-- =============================================================================

-- ---------- Admins -----------------------------------------------------------
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
-- No policies on purpose: admin_users is managed only from the SQL editor.

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------- Leads ------------------------------------------------------------
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 1 and 120),
  email       text not null check (char_length(email) <= 200 and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]{2,}$'),
  company     text not null check (char_length(company) between 1 and 160),
  website     text check (website is null or (char_length(website) <= 300 and website ~* '^https?://')),
  service     text not null check (service in ('ai-ad-creatives','ugc-creator-ads','video-production','performance-creatives','brand-content','not-sure')),
  budget      text not null check (char_length(budget) between 1 and 40),
  message     text not null check (char_length(message) between 10 and 1000),
  consent     boolean not null check (consent),
  consent_at  timestamptz not null default now(),
  source_url  text check (char_length(source_url) <= 500),
  status      text not null default 'new' check (status in ('new','contacted','qualified','won','lost','spam')),
  notes       text check (char_length(notes) <= 2000),
  ip_hash     text,
  -- consultation form (also added to existing databases by migrations/002_consultation_form.sql)
  phone           text check (phone is null or (char_length(phone) between 7 and 20 and phone ~ '^\+?[0-9 ()\-.]+$')),
  revenue_current text check (revenue_current is null or revenue_current in ('pre-revenue','below-1l','1l-5l','5l-10l','10l-25l','25l-50l','50l-plus')),
  revenue_target  text check (revenue_target is null or revenue_target in ('1l-5l','5l-10l','10l-25l','25l-50l','50l-1cr','1cr-plus')),
  target_timeline text check (target_timeline is null or target_timeline in ('3m','6m','9m','12m','flexible')),
  challenges      text[] check (challenges is null or (cardinality(challenges) <= 8 and challenges <@ array['leads','conversion','scaling','awareness','profitable-ads','website','retention','not-sure']::text[])),
  challenge_other text check (challenge_other is null or char_length(challenge_other) <= 500),
  -- added to existing databases by migrations/003_budget_and_start.sql
  budget_fit      text check (budget_fit is null or budget_fit in ('30k-ok','20k-30k','below-20k','discuss')),
  start_ready     text check (start_ready is null or char_length(start_ready) <= 500)
);
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_ip_recent_idx  on public.leads (ip_hash, created_at desc);

alter table public.leads enable row level security;

-- Column-level privileges: the public can only write the form fields.
revoke all on public.leads from anon, authenticated;
grant insert (name, email, company, website, service, budget, message, consent, source_url,
              phone, revenue_current, revenue_target, target_timeline, challenges, challenge_other,
              budget_fit, start_ready) on public.leads to anon;
grant select on public.leads to authenticated;
grant update (status, notes) on public.leads to authenticated;

drop policy if exists "public can submit leads" on public.leads;
create policy "public can submit leads" on public.leads
  for insert to anon with check (consent = true);

drop policy if exists "admins can read leads" on public.leads;
create policy "admins can read leads" on public.leads
  for select to authenticated using (public.is_admin());

drop policy if exists "admins can update leads" on public.leads;
create policy "admins can update leads" on public.leads
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- Spam / abuse guard ----------------------------------------------
create or replace function public.leads_before_insert()
returns trigger
language plpgsql security definer
set search_path = public
as $$
declare
  ip text := split_part(coalesce((current_setting('request.headers', true)::json ->> 'x-forwarded-for'), ''), ',', 1);
begin
  new.ip_hash    := md5('leads:' || ip);          -- privacy: store a hash, never the raw IP
  new.created_at := now();
  new.consent_at := now();
  new.status     := 'new';
  new.notes      := null;

  if (select count(*) from public.leads where ip_hash = new.ip_hash and created_at > now() - interval '10 minutes') >= 5 then
    raise exception 'Too many submissions, please try again later.' using errcode = 'P0001';
  end if;
  if (select count(*) from public.leads where created_at > now() - interval '1 minute') >= 30 then
    raise exception 'Too many submissions, please try again later.' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

drop trigger if exists leads_before_insert on public.leads;
create trigger leads_before_insert
  before insert on public.leads
  for each row execute function public.leads_before_insert();

-- ---------- Make yourself an admin ------------------------------------------
-- 1. Supabase → Authentication → Users → "Add user" → create your login (email + password).
-- 2. Replace the email below and run this line:
-- insert into public.admin_users (user_id) select id from auth.users where email = 'you@yourdomain.com';

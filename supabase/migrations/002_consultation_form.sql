-- =============================================================================
-- 002 — Consultation form: phone, revenue, growth goal and challenges.
-- Run once in Supabase → SQL Editor → New query → paste → Run. Safe to run twice.
--
-- Until this runs, the website still works: it stores the answers as a readable summary in
-- `message` (and current revenue in `budget`). After it runs, they're also saved as proper columns.
-- Keep the allowed values in sync with content/site.mjs → contact.form.
-- =============================================================================

alter table public.leads
  add column if not exists phone text
    check (phone is null or (char_length(phone) between 7 and 20 and phone ~ '^\+?[0-9 ()\-.]+$')),
  add column if not exists revenue_current text
    check (revenue_current is null or revenue_current in ('pre-revenue','below-1l','1l-5l','5l-10l','10l-25l','25l-50l','50l-plus')),
  add column if not exists revenue_target text
    check (revenue_target is null or revenue_target in ('1l-5l','5l-10l','10l-25l','25l-50l','50l-1cr','1cr-plus')),
  add column if not exists target_timeline text
    check (target_timeline is null or target_timeline in ('3m','6m','9m','12m','flexible')),
  add column if not exists challenges text[]
    check (challenges is null or (cardinality(challenges) <= 8 and challenges <@ array['leads','conversion','scaling','awareness','profitable-ads','website','retention','not-sure']::text[])),
  add column if not exists challenge_other text
    check (challenge_other is null or char_length(challenge_other) <= 500);

-- The public (anon) key may write the new form fields too — still insert-only, never read.
grant insert (phone, revenue_current, revenue_target, target_timeline, challenges, challenge_other) on public.leads to anon;

-- Make PostgREST pick up the new columns immediately.
notify pgrst, 'reload schema';

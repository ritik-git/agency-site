-- =============================================================================
-- 003 — Consultation form: budget fit (step 2) and "ready to start within 2 weeks?" (step 4).
-- Run once in Supabase → SQL Editor → New query → paste → Run. Safe to run twice.
--
-- Until this runs, the website still works: both answers are kept in the `message` summary,
-- and every other answer is saved to its own column as before.
-- Keep the allowed values in sync with content/site.mjs → contact.form.budgetFit.
-- =============================================================================

alter table public.leads
  add column if not exists budget_fit text
    check (budget_fit is null or budget_fit in ('30k-ok','20k-30k','below-20k','discuss')),
  add column if not exists start_ready text
    check (start_ready is null or char_length(start_ready) <= 500);

grant insert (budget_fit, start_ready) on public.leads to anon;

notify pgrst, 'reload schema';

# Setup — GitHub Pages + Supabase (free)

About 15 minutes. You need a GitHub account and a Supabase account.

## 1. Create the database (Supabase)

1. Go to supabase.com → **New project**. Pick a region close to your visitors (e.g. Mumbai), set a database password, create.
2. Open **SQL Editor → New query**, paste the whole of `supabase/schema.sql`, click **Run**.
   It should finish with "Success. No rows returned".
3. **Authentication → Users → Add user → Create new user**: enter the email + password you'll use for the admin panel. Tick "Auto confirm user".
4. Back in **SQL Editor**, run (with your email):
   ```sql
   insert into public.admin_users (user_id) select id from auth.users where email = 'you@yourdomain.com';
   ```
5. **Authentication → Sign In / Providers → Email**: turn **off** "Allow new users to sign up".
   (Not strictly needed — non-admins see nothing — but it keeps the user list clean.)
6. **Project Settings → API** (or **Data API**): copy the **Project URL** and the **anon / public** key.
   Never use the `service_role` key in this project.

> **Already set up the database before the consultation form?** Run `supabase/migrations/002_consultation_form.sql`
> once in the SQL Editor. It adds phone, revenue, goal and challenge columns. (A fresh `schema.sql` already includes them.)
> The form keeps working without it — answers are saved as a summary in the lead's message — but the migration
> stores them as proper columns you can filter and export.

## 2. Publish the site (GitHub Pages)

1. Create a new **public** GitHub repository (e.g. `agency-site`) and push this folder to its `main` branch:
   ```bash
   git remote add origin https://github.com/<you>/agency-site.git
   git push -u origin main
   ```
2. Repository → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Repository → **Settings → Secrets and variables → Actions → Variables tab → New repository variable**, add:

   | Name | Value |
   |---|---|
   | `SUPABASE_URL` | your Project URL, e.g. `https://abcd1234.supabase.co` |
   | `SUPABASE_ANON_KEY` | your anon/public key |

4. **Actions** tab → "Deploy to GitHub Pages" → **Run workflow** (it also runs on every push to `main`).
5. Your site is live at `https://<you>.github.io/agency-site/`, and the lead inbox at `…/agency-site/admin/`.

## 3. Test it

1. Open the site, fill in the contact form, submit → you should see "Thanks, <name>."
2. Open `/admin/`, sign in with the user from step 1.3 → your test lead appears. Change its status, add a note, save.

If the form says "not connected", the two variables in step 2.3 are missing or the workflow hasn't re-run since you added them.

## 4. Before launch

- Edit `content/site.mjs` — all copy, contact details, socials, case studies, stats, testimonials live there.
  Every missing item is printed when you build (`node scripts/build.mjs`).
- Replace placeholder imagery in `renders/` (see README → Images).
- Review the privacy policy text in `src/pages.mjs` for your jurisdiction (India: DPDP Act 2023).
- Add repository variable `MODE` = `production`. This hides unfinished sections (trust logos, stats, testimonials), removes `noindex`, and enables the sitemap.
  Optionally add `STRICT` = `1` so a build with missing content fails instead of deploying.

## Custom domain (optional)

Settings → Pages → Custom domain → enter `www.yourdomain.com`, then add the DNS record GitHub shows you at your domain registrar.
Also set repository variable `SITE_URL` = `https://www.yourdomain.com` (used for canonical URLs, sitemap and social previews).

## Note on Supabase's free plan

Free projects are paused after a period of inactivity; you can restore a paused project from the Supabase dashboard. A site receiving regular inquiries normally stays active. Check Supabase's current free-plan terms.

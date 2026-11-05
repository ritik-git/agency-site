# AdverBright — agency website

Static, dependency-free site built from `AGENCY_WEBSITE_DESIGN_BLUEPRINT.md`.
Hosted on **GitHub Pages**; contact form and admin lead inbox use **Supabase**. Setup: see **SETUP.md**.

## Commands (Node ≥ 18, no `npm install` needed)

```bash
node scripts/build.mjs          # build → dist/  (MODE=production for launch builds)
node scripts/dev-server.mjs     # preview dist/ at http://localhost:8787 (+ offline Supabase mock)
```

To try the form and admin offline:
```bash
SUPABASE_URL=http://localhost:8787/mock SUPABASE_ANON_KEY=dev-anon-key node scripts/build.mjs
node scripts/dev-server.mjs     # admin login: admin@example.com / admin-pass
```

Build env vars: `MODE` (preview|production), `BASE_PATH` (e.g. `/agency-site/`), `SITE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `STRICT=1`.

## Where things live

```
content/site.mjs          ALL copy and business data — edit this, not the components
src/lib/core.mjs          templating (auto-escaping html``), images, icons, placeholders
src/components/           ui.mjs (Button, SectionHeader…), layout.mjs (header, menu, footer), sections.mjs
src/pages.mjs             home, case study, privacy, 404, admin
src/styles/               tokens.css (design tokens) → base → layout → components → sections → motion; admin.css
src/scripts/              vanilla ES modules: nav, reveal, hero, interactions, carousel, contact, supabase, admin
supabase/schema.sql       tables, RLS policies, rate limiting
static/                   fonts, responsive images (generated), icons
scripts/                  build, dev server, image pipeline, QA scripts
```

## Placeholders

- `null` in `content/site.mjs` = missing business data. Preview builds show a dashed lime `[PLACEHOLDER]` chip; production builds hide it.
- `isPlaceholder: true` list items (sample projects, logos, testimonials) are removed in production.
- Every build prints the list of content still needed.

## Images

The chrome-and-lime sculptures are procedurally rendered stand-ins (`scripts/render.py`), not client work.
To use real media, put a PNG/JPG in `renders/` with the same name (e.g. `project-alpha.png`, `service-ugc.png`, `hero-orb.png`), then run:
```bash
python3 scripts/images.py   # needs Pillow + numpy; writes AVIF/WebP sizes + manifest into static/img
```
For a founder photo: add `renders/founder.png`, add `export(Image.open(...), "founder", [480,800,1200])` to `images.py`, set `founder.photo = "founder"`.
Project hover videos: set `video: "assets/video/x.mp4"` on a project (muted MP4, ≤ 2.5 MB) and place the file under `static/`.

## Fonts

Inter Display (headings), Inter (body) — self-hosted WOFF subsets. The mono face is a stand-in (DejaVu Sans Mono) for JetBrains Mono, which wasn't available offline.
To switch, replace `static/fonts/mono-400.woff`; the family name in `tokens.css` stays the same.

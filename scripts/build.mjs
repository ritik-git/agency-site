#!/usr/bin/env node
/* Static build → dist/. Zero dependencies (Node ≥ 18).
   env: MODE=preview|production  BASE_PATH=/repo/  SITE_URL=https://…
        SUPABASE_URL  SUPABASE_ANON_KEY  STRICT=1 (fail production build on placeholders) */
import { rmSync, mkdirSync, cpSync, writeFileSync, readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const { ctx, url } = await import("../src/lib/core.mjs");
const P = await import("../src/pages.mjs");
const C = await import("../content/site.mjs");
const { real } = await import("../src/lib/core.mjs");
const { resolveLogos } = await import("../src/components/logo-marquee.mjs");

const t0 = Date.now();
rmSync(DIST, { recursive: true, force: true });
const out = (rel, content) => {
  const f = path.join(DIST, rel);
  mkdirSync(path.dirname(f), { recursive: true });
  writeFileSync(f, String(content));
};

/* ---- static assets ---- */
cpSync(path.join(ROOT, "static/fonts"), path.join(DIST, "assets/fonts"), { recursive: true });
cpSync(path.join(ROOT, "static/img"), path.join(DIST, "assets/img"), { recursive: true, filter: (s) => !s.endsWith("manifest.json") });
cpSync(path.join(ROOT, "static/icons"), path.join(DIST, "assets/icons"), { recursive: true });
if (existsSync(path.join(ROOT, "static/logos"))) cpSync(path.join(ROOT, "static/logos"), path.join(DIST, "assets/logos"), { recursive: true, filter: (s) => !s.endsWith(".md") });
cpSync(path.join(ROOT, "static/og-image.jpg"), path.join(DIST, "og-image.jpg"));
out("assets/icons/favicon.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#050505"/><rect x="4" y="4" width="24" height="24" fill="#C7FF2F"/><path d="M10.2 23.5 14.9 9.5h2.3l4.7 14h-2.6l-1.1-3.4h-4.7l-1.1 3.4zm4.3-5.6h3.1L16 13.1z" fill="#070707"/></svg>`);

/* ---- CSS: ordered concatenation + light minification ---- */
const minify = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s*\n\s*/g, "\n").replace(/\n+/g, "\n").trim();
const cssOrder = ["tokens", "base", "layout", "components", "sections", "motion"];
const siteCss = cssOrder.map((n) => readFileSync(path.join(ROOT, `src/styles/${n}.css`), "utf8")).join("\n");
out("assets/site.css", minify(siteCss));
out("assets/admin.css", minify(readFileSync(path.join(ROOT, "src/styles/admin.css"), "utf8")));

/* ---- JS: native ES modules, copied as-is ---- */
for (const f of readdirSync(path.join(ROOT, "src/scripts"))) cpSync(path.join(ROOT, "src/scripts", f), path.join(DIST, "assets/js", f));
out("assets/js/config.js",
  `// Generated at build time — public values only (the anon key is designed to be public; RLS protects data).\n` +
  `export const SUPABASE_URL = ${JSON.stringify(process.env.SUPABASE_URL || "")};\n` +
  `export const SUPABASE_ANON_KEY = ${JSON.stringify(process.env.SUPABASE_ANON_KEY || "")};\n` +
  `export const RESPONSE_TIME = ${JSON.stringify(C.site.responseTime)};\n`);

/* ---- pages ---- */
out("index.html", P.Home());
const projects = real(C.work.projects);
projects.forEach((p, i) => out(`work/${p.slug}/index.html`, P.CaseStudy(p, projects[(i + 1) % projects.length])));
out("privacy/index.html", P.Privacy());
out("404.html", P.NotFound());
out("admin/index.html", P.Admin());

/* ---- meta files ---- */
const origin = ctx.siteUrl || C.site.url;
const pages = ["", "privacy/", ...projects.map((p) => `work/${p.slug}/`)];
out("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `  <url><loc>${origin}${url(p)}</loc></url>`).join("\n")}\n</urlset>\n`);
out("robots.txt", ctx.mode === "production"
  ? `User-agent: *\nDisallow: ${url("admin/")}\nSitemap: ${origin}${url("sitemap.xml")}\n`
  : `User-agent: *\nDisallow: /\n`);
out("site.webmanifest", JSON.stringify({
  name: C.site.legalName, short_name: C.site.name, start_url: url(""), display: "browser",
  background_color: "#050505", theme_color: "#050505",
  icons: [192, 512].map((s) => ({ src: url(`assets/icons/icon-${s}.png`), sizes: `${s}x${s}`, type: "image/png" })),
}));
out(".nojekyll", "");

/* ---- content audit: the placeholder registry (§16.3) ---- */
const missing = [];
const need = (ok, what) => { if (!ok) missing.push(what); };
need(C.site.email, "site.email — contact email (footer, contact, privacy)");
need(C.site.location, "site.location — city, country");
need(C.site.socials.some((s) => s.href), "site.socials[].href — at least one social URL");
const logoFiles = resolveLogos(C.trust.logos);
const logoPh = logoFiles.filter((l) => l.isPlaceholder).map((l) => l.src);
need(logoFiles.length - logoPh.length >= 4, `trust.logos — ≥ 4 real client logos in static/logos (section is hidden until then; placeholders: ${logoPh.length})`);
need(real(C.work.projects).length >= 4, "work.projects — ≥ 4 real case studies (title, client, result, media)");
need(C.results.stats.filter((s) => s.value != null).length >= 3, "results.stats[].value — ≥ 3 real metrics (row is hidden until then)");
need(C.results.aside, "results.aside — how results are measured");
need(real(C.testimonials.items).length >= 1, "testimonials.items — ≥ 1 real quote (section is hidden until then)");
C.founder.people.forEach((p, i) => {
  const who = p.name || `founder ${i + 1}`;
  need(p.name && p.role, `founder.people[${i}] — name and role`);
  need(p.photo, `founder.people[${i}].photo — portrait for ${who}`);
  need(p.linkedin, `founder.people[${i}].linkedin — profile URL for ${who}`);
});
need(C.founder.quote, "founder.quote — one-sentence belief");
need(C.founder.bio.some(Boolean), "founder.bio — 2 short paragraphs");
need(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY, "SUPABASE_URL / SUPABASE_ANON_KEY — form + admin backend");

/* ---- content check (§20.4) ---- */
const FORBIDDEN = [/\[PLACEHOLDER/i, /placeholder-chip/, /\bXX\b/, /Brand 0\d/, /Project (Alpha|Beta|Gamma|Delta)/, /Client 0\d/, /Replace these with/i];
const problems = [];
const walk = (d) => readdirSync(d, { withFileTypes: true }).forEach((e) => {
  const f = path.join(d, e.name);
  if (e.isDirectory()) return walk(f);
  if (!f.endsWith(".html")) return;
  const text = readFileSync(f, "utf8");
  FORBIDDEN.forEach((re) => { const m = text.match(re); if (m) problems.push(`${path.relative(DIST, f)}: "${m[0]}"`); });
});
walk(DIST);
const uniq = [...new Set(problems)];
console.log(`built ${ctx.mode} → dist/ in ${Date.now() - t0} ms (base ${ctx.base})`);
if (!process.env.SUPABASE_URL) console.log("note: SUPABASE_URL not set — form and admin will show a setup message");
if (missing.length) {
  console.log(`content still needed (${missing.length}) — see content/site.mjs:`);
  missing.forEach((m) => console.log("  · " + m));
}
if (uniq.length) {
  console.log(`${ctx.mode === "production" ? "⚠" : "i"} ${uniq.length} placeholder markers remain (resolve before launch):`);
  uniq.slice(0, 12).forEach((p) => console.log("  - " + p));
}
if (ctx.mode === "production" && process.env.STRICT && (uniq.length || missing.length)) {
  console.log("STRICT: failing the production build until the content above is supplied.");
  process.exit(1);
}

/* Page compositions */
import { html, chars, raw, url, icon, lines, ph, real, isProd, picture, ctx } from "./lib/core.mjs";
import { Button, TextLink, Eyebrow, Section, Logo } from "./components/ui.mjs";
import { Document } from "./components/layout.mjs";
import * as S from "./components/sections.mjs";
import * as C from "../content/site.mjs";

const origin = () => ctx.siteUrl || C.site.url;

/* ---------------------------------------------------------------- HOME */
export function Home() {
  const sameAs = C.site.socials.map((s) => s.href).filter(Boolean);
  const ld = [
    {
      "@context": "https://schema.org", "@type": "Organization", name: C.site.legalName,
      url: origin() + url(""), logo: origin() + url("assets/icons/icon-512.png"), sameAs,
      ...(C.site.email ? { contactPoint: { "@type": "ContactPoint", email: C.site.email, contactType: "sales" } } : {}),
    },
    {
      "@context": "https://schema.org", "@type": "ProfessionalService", name: C.site.legalName,
      url: origin() + url(""), image: origin() + url("og-image.jpg"), description: C.site.seo.description,
      ...(C.site.location ? { areaServed: C.site.location } : {}),
      founder: C.founder.people.filter((p) => p.name).map((p) => ({ "@type": "Person", name: p.name, ...(p.role ? { jobTitle: p.role } : {}) })),
    },
  ];
  return Document({
    title: C.site.seo.title, description: C.site.seo.description, onHome: true, ld,
    body: html`${S.Hero()}${S.TrustStrip()}${S.Showcase()}${S.Services()}${S.Work()}${S.Results()}${S.Process()}${S.WhyUs()}${S.Founder()}${S.Testimonials()}${S.Contact()}`,
  });
}

/* ----------------------------------------------------------- CASE STUDY */
export function CaseStudy(p, next) {
  const meta = [
    ["Client", ph(p.client, "CLIENT")],
    ["Services", p.category],
    ["Platforms", p.platform],
    ["Year", ph(p.year, "YEAR")],
  ];
  const blocks = [["The brief", p.brief, "BRIEF"], ["The idea", p.idea, "IDEA"], ["The result", p.outcome, "RESULT"]];
  const path = `work/${p.slug}/`;
  const ld = [
    { "@context": "https://schema.org", "@type": "CreativeWork", name: p.title, genre: p.category, creator: { "@type": "Organization", name: C.site.legalName }, url: origin() + url(path) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: origin() + url("") },
      { "@type": "ListItem", position: 2, name: "Work", item: origin() + url("#work") },
      { "@type": "ListItem", position: 3, name: p.title, item: origin() + url(path) },
    ] },
  ];
  return Document({
    title: `${p.title} — Case study | ${C.site.name}`,
    description: `${p.title}: ${p.category} creative for ${p.platform}. How ${C.site.name} took it from brief to result.`,
    path, ld,
    body: html`
    <section class="cs-hero" aria-labelledby="cs-title">
      <div class="container">
        <nav class="breadcrumb" aria-label="Breadcrumb"><ol>
          <li><a href="${url("")}">Home</a></li><li><a href="${url("#work")}">Work</a></li><li aria-current="page">${p.title}</li>
        </ol></nav>
        ${Eyebrow({ index: "Case study", label: p.category })}
        <h1 class="display-2" id="cs-title" ${chars([p.title])} data-line-reveal data-immediate>${lines([p.title], 1)}</h1>
        <dl class="cs-meta" data-reveal>${meta.map(([k, v]) => html`<div><dt>${k}</dt><dd>${v}</dd></div>`)}</dl>
      </div>
    </section>
    <div class="container container--wide cs-media" data-reveal>
      ${picture(`${p.image}-wide`, { alt: p.alt, sizes: "(min-width:1600px) 1440px, 100vw", eager: true })}
    </div>
    <section class="section section--default" data-theme="dark" aria-label="Story">
      <div class="container cs-blocks">
        ${blocks.map(([label, text, key]) => html`<div class="cs-block" data-reveal>
          <h2 class="cs-block__label">${label}</h2>
          <p class="cs-block__text">${ph(text, key)}</p>
        </div>`)}
      </div>
    </section>
    <section class="section section--tight" data-theme="surface-1" aria-label="Formats">
      <div class="seam" aria-hidden="true"></div>
      <div class="container cs-gallery">
        <figure data-reveal>${picture(`${p.image}-story`, { alt: `${p.title} — 9:16 story format`, sizes: "(min-width:768px) 30vw, 100vw" })}<figcaption>9:16 · Story</figcaption></figure>
        <figure data-reveal>${picture(`${p.image}-portrait`, { alt: `${p.title} — 4:5 feed format`, sizes: "(min-width:768px) 45vw, 100vw" })}<figcaption>4:5 · Feed</figcaption></figure>
      </div>
      <div class="container">${S.StatsRow([{ value: null, suffix: "%", label: "Primary KPI" }, { value: null, suffix: "x", label: "Return on ad spend" }, { value: null, suffix: "+", label: "Creatives shipped" }])}</div>
    </section>
    <section class="section section--tight cs-next" data-theme="dark" aria-labelledby="next-title">
      <div class="seam" aria-hidden="true"></div>
      <div class="container container--wide">
        <p class="eyebrow" id="next-title"><span class="eyebrow__index">Next</span> / Case study</p>
        <div class="cs-next__card">${S.ProjectCard(next, 1, { headingLevel: 2 })}</div>
      </div>
    </section>
    ${S.Contact()}`,
  });
}

/* -------------------------------------------------------------- PRIVACY */
export function Privacy() {
  const owner = C.site.legalName;
  const sections = [
    ["What we collect", `When you use our contact form we collect your name, work email, company, website (optional), the service and budget you select, your message, and the time you gave consent. We do not use advertising cookies on this website.`],
    ["Why we collect it", `Only to reply to your inquiry, prepare a proposal, and keep a record of our correspondence.`],
    ["Where it is stored", `Form submissions are stored in a database hosted by Supabase. Access is restricted to authorised ${owner} staff.`],
    ["How long we keep it", `We keep inquiries for up to 24 months unless we start working together, in which case contract records are kept as required by law.`],
    ["Your rights", `You can ask us to access, correct or delete your data at any time by emailing us.`],
  ];
  return Document({
    title: `Privacy policy | ${C.site.name}`, description: `How ${owner} handles the information you share with us.`, path: "privacy/",
    body: html`<section class="section section--default legal" data-theme="dark" aria-labelledby="privacy-title">
      <div class="container legal__grid">
        <div class="split__sticky">
          ${Eyebrow({ index: "Legal", label: "Privacy" })}
          <h1 class="display-2" id="privacy-title" ${chars(["Privacy", "policy."])} data-line-reveal data-immediate>${lines(["Privacy", "policy."], 1)}</h1>
          <p class="legal__updated">Last updated ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
        <div class="legal__body">
          ${!isProd() ? html`<p class="legal__warn">${ph(null, "TEMPLATE TEXT — HAVE THIS REVIEWED FOR YOUR JURISDICTION (E.G. INDIA DPDP ACT 2023 / GDPR) BEFORE LAUNCH")}</p>` : ""}
          ${sections.map(([h, p]) => html`<h2>${h}</h2><p>${p}</p>`)}
          <h2>Contact</h2>
          <p>${C.site.email ? html`<a href="mailto:${C.site.email}">${C.site.email}</a>` : ph(null, "PRIVACY CONTACT EMAIL")}</p>
        </div>
      </div>
    </section>`,
  });
}

/* ------------------------------------------------------------------ 404 */
export function NotFound() {
  return Document({
    title: `Page not found | ${C.site.name}`, description: "This page doesn't exist.", path: "404.html", noindex: true,
    body: html`<section class="not-found" aria-labelledby="nf-title">
      <div class="container">
        <p class="eyebrow"><span class="eyebrow__index">404</span> / Not found</p>
        <h1 class="display-1" id="nf-title" ${chars(["This frame", "is empty."])} data-line-reveal data-immediate>${lines(["This frame", "is empty."], 1)}</h1>
        <p class="lead">The page you're looking for has moved or never existed. Here's where to go instead.</p>
        <div class="not-found__links">
          ${Button({ label: "Back home", href: url(""), size: "lg" })}
          ${TextLink({ label: "See the work", href: url("#work") })}
          ${TextLink({ label: "Speak to our team today", href: url("#contact") })}
        </div>
      </div>
      <div class="not-found__frames" aria-hidden="true"><span>9:16</span><span>1:1</span><span>16:9</span></div>
    </section>`,
  });
}

/* ---------------------------------------------------------------- ADMIN */
export function Admin() {
  const statusOpts = ["new", "contacted", "qualified", "won", "lost", "spam"];
  // Consultation-form option labels for the inbox (value → label), from content/site.mjs
  const F = C.contact.form;
  const toMap = (opts) => Object.fromEntries(opts.map((o) => [o.value, o.label]));
  const leadOptions = JSON.stringify({
    revenue_current: toMap(F.revenueCurrent.options), revenue_target: toMap(F.revenueTarget.options),
    target_timeline: toMap(F.timeline.options), challenges: toMap(F.challenges.options),
    budget_fit: toMap(F.budgetFit.options),
    service: { ...Object.fromEntries(C.services.items.map((x) => [x.slug, x.title])), "not-sure": "Not sure yet" },
  }).replace(/</g, "\\u003c");
  return Document({
    title: `Leads | ${C.site.name} admin`, description: "Admin", path: "admin/", noindex: true, chrome: false,
    styles: ["site.css", "admin.css"], scripts: ["admin.js"], bodyClass: "admin-body",
    body: html`
    <script type="application/json" id="lead-options">${raw(leadOptions)}</script>
    <div class="admin" data-admin>
      <header class="admin-bar">
        ${Logo({ name: C.site.name, suffix: "Admin", href: url("admin/") })}
        <div class="admin-bar__right" data-when="authed" hidden>
          <span class="admin-bar__user" data-user></span>
          <button class="btn btn--secondary btn--sm" type="button" data-signout><span class="btn__label">Sign out</span>${icon("logout", 16, "icon btn__icon")}</button>
        </div>
      </header>

      <section class="admin-login" data-when="guest" hidden aria-labelledby="login-title">
        <p class="eyebrow"><span class="eyebrow__index">Admin</span> / Sign in</p>
        <h1 class="display-2" id="login-title" ${chars(["Lead", "inbox."])}>${lines(["Lead", "inbox."], 1, { reveal: false })}</h1>
        <form class="admin-login__form" data-login novalidate>
          <div class="field"><label class="field__label" for="a-email">Email</label><input id="a-email" name="email" type="email" autocomplete="username" required></div>
          <div class="field"><label class="field__label" for="a-pass">Password</label><input id="a-pass" name="password" type="password" autocomplete="current-password" required></div>
          ${Button({ label: "Sign in", type: "submit", size: "lg", iconName: "arrow-right", cls: "btn--block" })}
          <p class="form-alert" role="alert" hidden data-login-alert></p>
        </form>
      </section>

      <section class="admin-config" data-when="unconfigured" hidden>
        <p class="eyebrow"><span class="eyebrow__index">Setup</span> / Supabase</p>
        <h1 class="h3">Connect your database</h1>
        <p class="lead">Supabase isn't configured yet. Follow <strong>SETUP.md</strong> in the repository, then set <code>SUPABASE_URL</code> and <code>SUPABASE_ANON_KEY</code> as GitHub repository variables and re-deploy.</p>
      </section>

      <section class="admin-main" data-when="authed" hidden aria-labelledby="leads-title">
        <div class="admin-head">
          <div>
            <p class="eyebrow"><span class="eyebrow__index">Leads</span> / Contact form</p>
            <h1 class="h3" id="leads-title">Inquiries</h1>
          </div>
          <ul class="admin-kpis" data-kpis></ul>
        </div>
        <div class="admin-toolbar">
          <label class="admin-search">${icon("search", 16)}<span class="visually-hidden">Search leads</span><input type="search" placeholder="Search name, email, phone, brand" data-search></label>
          <div class="select select--compact"><label class="visually-hidden" for="filter-status">Status</label><select id="filter-status" data-filter-status>
            <option value="">All statuses</option>${statusOpts.map((s) => html`<option value="${s}">${s[0].toUpperCase() + s.slice(1)}</option>`)}
          </select>${icon("chevron", 14, "icon select__chevron")}</div>
          <div class="select select--compact"><label class="visually-hidden" for="filter-revenue">Current revenue</label><select id="filter-revenue" data-filter-revenue>
            <option value="">Any revenue now</option>${F.revenueCurrent.options.map((o) => html`<option value="${o.value}">${o.label}</option>`)}
          </select>${icon("chevron", 14, "icon select__chevron")}</div>
          <div class="select select--compact"><label class="visually-hidden" for="filter-timeline">Timeline</label><select id="filter-timeline" data-filter-timeline>
            <option value="">Any timeline</option>${F.timeline.options.map((o) => html`<option value="${o.value}">${o.label}</option>`)}
          </select>${icon("chevron", 14, "icon select__chevron")}</div>
          <button class="btn btn--secondary btn--sm" type="button" data-refresh><span class="btn__label">Refresh</span>${icon("refresh", 16, "icon btn__icon")}</button>
          <button class="btn btn--primary btn--sm" type="button" data-export><span class="btn__label">Export CSV</span>${icon("download", 16, "icon btn__icon")}</button>
        </div>
        <p class="admin-status" role="status" data-status></p>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead><tr><th scope="col">Received</th><th scope="col">Name</th><th scope="col">Brand</th><th scope="col">Revenue now</th><th scope="col">Target</th><th scope="col">Timeline</th><th scope="col">Challenges</th><th scope="col">Status</th></tr></thead>
            <tbody data-rows></tbody>
          </table>
        </div>
      </section>

      <div class="drawer" hidden data-drawer role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <div class="drawer__scrim" data-close></div>
        <aside class="drawer__panel">
          <div class="drawer__head">
            <h2 class="h4" id="drawer-title" data-d-name></h2>
            <button class="square-btn" type="button" aria-label="Close" data-close>${icon("x", 20)}</button>
          </div>
          <div class="drawer__contact" data-d-contact></div>
          <div class="drawer__groups" data-d-groups></div>
          <div class="drawer__legacy" data-d-legacy hidden>
            <h3 class="drawer__label">Message</h3>
            <p class="drawer__message" data-d-message></p>
          </div>
          <div class="field">
            <label class="field__label" for="d-status">Status</label>
            <div class="select"><select id="d-status" data-d-status>${statusOpts.map((s) => html`<option value="${s}">${s[0].toUpperCase() + s.slice(1)}</option>`)}</select>${icon("chevron", 14, "icon select__chevron")}</div>
          </div>
          <div class="field">
            <label class="field__label" for="d-notes">Internal notes</label>
            <textarea id="d-notes" rows="4" maxlength="2000" data-d-notes></textarea>
          </div>
          <div class="drawer__actions">
            <button class="btn btn--primary btn--md" type="button" data-d-save><span class="btn__label">Save</span>${icon("check", 16, "icon btn__icon")}</button>
          </div>
          <p class="admin-status" role="status" data-d-status-msg></p>
        </aside>
      </div>
    </div>`,
  });
}

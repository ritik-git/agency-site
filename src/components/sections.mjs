/* Home page sections — blueprint §8.2–§8.11 */
import { html, chars, raw, url, icon, lines, ph, real, isProd, picture, imageSrc } from "../lib/core.mjs";
import { Button, TextLink, Eyebrow, Tag, FormatBadge, Section, SectionHeader } from "./ui.mjs";
import * as C from "../../content/site.mjs";

const pad = (n) => String(n).padStart(2, "0");

/* ---------------------------------------------------------------- HERO */
export function Hero() {
  const h = C.hero;
  // Fixed, collision-checked positions (percent of the square stage). Labels never move:
  // clickable targets on a spinning ring would be hard to hit.
  const labelPos = [
    { x: 50, y: 3, a: "c" },   // top
    { x: 92, y: 19, a: "r" },  // upper right — clear of the 1:1 frame label
    { x: 98, y: 73, a: "r" },  // lower right — outside the orb at every size
    { x: 58, y: 97, a: "c" },  // bottom
    { x: 15, y: 50, a: "r" },  // left — ends before the orb edge (18%)
  ];
  return html`<section id="home" class="hero" aria-labelledby="hero-title" data-hero>
    <div class="hero__bg" aria-hidden="true"></div>
    <div class="container hero__grid">
      <div class="hero__text">
        <p class="badge-dot" data-hero-fade>${h.eyebrow}</p>
        <h1 class="display-1" id="hero-title" ${chars(h.title)} data-line-reveal data-immediate>${lines(h.title, h.accentFrom)}</h1>
        <p class="lead hero__lead" data-hero-fade>${h.lead}</p>
        <div class="hero__ctas" data-hero-fade>
          ${Button({ label: "Start a project", href: "#contact", size: "lg" })}
          ${TextLink({ label: "See the work", href: "#work", iconName: "arrow-down-right" })}
        </div>
        <p class="hero__micro" data-hero-fade>${h.micro}</p>
      </div>
      <div class="hero__visual-wrap">
        <div class="hero-visual" data-hero-visual>
          <div class="hero-visual__stage" data-tilt>
            <div class="hero-visual__glow" aria-hidden="true"></div>
            <svg class="hero-orbits" viewBox="0 0 560 560" aria-hidden="true" focusable="false">
              <g class="orbit orbit--a"><ellipse pathLength="1" cx="280" cy="280" rx="262" ry="118" transform="rotate(-18 280 280)"/></g>
              <g class="orbit orbit--b"><ellipse pathLength="1" cx="280" cy="280" rx="236" ry="150" transform="rotate(24 280 280)"/></g>
            </svg>
            ${picture("hero-orb", {
              alt: "Chrome ribbon sculpture with lime light trails — a stand-in for our creative standard",
              sizes: "(min-width:1280px) 360px, (min-width:768px) 290px, 64vw",
              eager: true,
              cls: "hero-orb",
            })}
            <div class="format-frame format-frame--story" aria-hidden="true"><span>9:16</span></div>
            <div class="format-frame format-frame--square" aria-hidden="true"><span>1:1</span></div>
            <div class="format-frame format-frame--wide" aria-hidden="true"><span>16:9</span></div>
          </div>
          <nav class="orbit-labels" aria-label="Jump to a service">
            ${h.orbitLabels.map((label, i) => html`<a class="orbit-label orbit-label--${labelPos[i].a}" style="--x:${labelPos[i].x}%;--y:${labelPos[i].y}%" href="#service-${C.services.items[i].slug}" data-orbit-label>${label}</a>`)}
          </nav>
        </div>
      </div>
    </div>
    <div class="container hero__footer">
      <div class="seam seam--static" aria-hidden="true"></div>
      <p class="hero__tagline">${h.footerLine}</p>
      <a class="hero__scroll" href="#services">Scroll to explore ${icon("arrow-down", 14, "icon hero__scroll-icon")}</a>
    </div>
  </section>`;
}

/* --------------------------------------------------------- TRUST STRIP */
export function TrustStrip() {
  const logos = real(C.trust.logos);
  if (isProd() && logos.length < 4) return ""; // §7.3 — no fake logo boxes in production
  const run = html`<span class="marquee__item">${C.trust.marquee}</span><span class="marquee__sep" aria-hidden="true">✳</span>`;
  const group = (hidden) => html`<div class="marquee__group" ${hidden ? raw('aria-hidden="true"') : ""}>${Array(4).fill(run)}</div>`;
  return html`<section class="trust" aria-label="Clients">
    <div class="marquee" data-marquee><div class="marquee__track">${group(false)}${group(true)}</div></div>
    <ul class="logo-grid logo-grid--${logos.length}">
      ${logos.map((l) => html`<li class="logo-grid__cell">${
        l.src ? html`<img src="${url("assets/" + l.src)}" alt="${l.name}" width="120" height="28" loading="lazy">` : ph(null, "CLIENT LOGO")
      }</li>`)}
    </ul>
  </section>`;
}

/* ------------------------------------------------------------ SERVICES */
export function Services() {
  const s = C.services;
  return Section({
    id: "services", labelledBy: "services-title", cls: "services",
    children: html`<div class="container">
      ${SectionHeader({ id: "services-title", ...s, aside: html`<p class="lead">${s.aside}</p>` })}
      <ol class="service-list" data-service-list>
        ${s.items.map((item, i) => html`<li class="service-item" id="service-${item.slug}" data-reveal>
          <a class="service-row" href="?service=${item.slug}#contact" data-preview="${imageSrc(item.preview, 480)}">
            <span class="service-row__num">${pad(i + 1)}</span>
            <h3 class="service-row__title"><span>${item.title}</span></h3>
            <div class="service-row__body">
              <p>${item.description}</p>
              <ul class="tags" aria-label="Deliverables">${item.tags.map(Tag)}</ul>
            </div>
            <span class="icon-box" aria-hidden="true">${icon("arrow-up-right", 20)}</span>
            <span class="visually-hidden">— enquire about ${item.title}</span>
          </a>
        </li>`)}
      </ol>
    </div>
    <div class="service-preview" aria-hidden="true" data-service-preview><img alt="" width="240" height="427" decoding="async"><span class="service-preview__badge">9:16</span></div>`,
  });
}

/* ---------------------------------------------------------------- WORK */
const SHAPES = ["portrait", "landscape", "landscape", "portrait"];

export function ProjectCard(p, i, { headingLevel = 3 } = {}) {
  const shape = SHAPES[i % 4];
  const img = `${p.image}-${shape}`;
  const sizes = shape === "portrait"
    ? "(min-width:1280px) 560px, (min-width:768px) 50vw, 100vw"
    : "(min-width:1280px) 780px, (min-width:768px) 50vw, 100vw";
  const H = raw(`h${headingLevel}`);
  return html`<article class="project-card project-card--${shape}" data-reveal>
    <a class="project-card__link" href="${url(`work/${p.slug}/`)}">
      <div class="project-card__media">
        ${picture(img, { alt: p.alt, sizes })}
        ${p.video ? html`<video class="project-card__video" muted loop playsinline preload="none" aria-hidden="true" data-src="${p.video}"></video>` : ""}
      </div>
      <div class="project-card__overlay">
        ${FormatBadge(`${p.format} · ${p.platform}`)}
        <div class="project-card__info">
          <p class="project-card__cat">${p.category}</p>
          <${H} class="project-card__title">${p.title}</${H}>
          <p class="project-card__meta">
            <span>${ph(p.client, "CLIENT")}</span><span aria-hidden="true">·</span>
            <span>${p.platform}</span><span aria-hidden="true">·</span>
            <span>${ph(p.result, "RESULT")}</span>
          </p>
        </div>
        <span class="icon-box" aria-hidden="true">${icon("arrow-up-right", 20)}</span>
      </div>
    </a>
  </article>`;
}

export function Work() {
  const w = C.work;
  const projects = real(w.projects);
  return Section({
    id: "work", theme: "surface-1", labelledBy: "work-title", cls: "work",
    children: html`<div class="container container--wide">
      <div class="work__head">${SectionHeader({ id: "work-title", ...w, aside: html`<p class="lead">${w.aside}</p>` })}</div>
      ${projects.length
        ? html`<div class="project-grid">${projects.map((p, i) => ProjectCard(p, i))}</div>`
        : html`<div class="work__empty" data-reveal>
            <p class="h4">Case studies are being written up.</p>
            <p class="lead">Ask us for recent examples in your category — we'll share what we can.</p>
          </div>`}
      <div class="work__foot" data-reveal>${Button({ label: "Discuss a similar project", href: "#contact", variant: "secondary" })}</div>
    </div>`,
  });
}

/* ------------------------------------------------------------- RESULTS */
export function Stat(s) {
  const has = s.value != null;
  return html`<li class="stat" data-reveal>
    <p class="stat__value" ${has ? raw(`data-count="${s.value}"`) : ""}>${
      has ? html`${s.prefix || ""}<span class="stat__num">${s.value}</span><span class="stat__suffix">${s.suffix || ""}</span>` : ph(null, "METRIC")
    }</p>
    <p class="stat__label">${s.label}</p>
  </li>`;
}

export function StatsRow(stats) {
  const shown = isProd() ? stats.filter((s) => s.value != null) : stats;
  if (isProd() && shown.length < 3) return "";
  return html`<ul class="stats">${shown.map(Stat)}</ul>`;
}

export function Results() {
  const r = C.results;
  const aside = html`<p class="lead">${r.aside ?? r.statement}</p>${!r.aside && !isProd() ? html`<p class="note">${ph(null, "HOW RESULTS ARE MEASURED")}</p>` : ""}`;
  return Section({
    labelledBy: "results-title", cls: "results",
    children: html`<div class="container">
      ${SectionHeader({ id: "results-title", ...r, aside })}
      ${StatsRow(r.stats)}
    </div>`,
  });
}

/* ------------------------------------------------------------- PROCESS */
export function Process() {
  const p = C.process;
  return Section({
    id: "process", theme: "paper", labelledBy: "process-title", cls: "process", padding: "tight",
    children: html`<div class="container">
      ${SectionHeader({ id: "process-title", ...p, aside: html`<p class="lead">${p.aside}</p>` })}
      <div class="process__track" data-process>
        <div class="process__line" aria-hidden="true"><span class="process__fill" data-process-fill></span></div>
        <ol class="process-steps">
          ${p.steps.map((st, i) => html`<li class="process-step" data-step data-reveal>
            <span class="process-step__num">${pad(i + 1)}</span>
            <h3 class="process-step__title">${st.title}</h3>
            <p class="process-step__desc">${st.description}</p>
          </li>`)}
        </ol>
      </div>
    </div>`,
  });
}

/* ---------------------------------------------------------------- WHY */
export function WhyUs() {
  const w = C.why;
  return Section({
    id: "about", labelledBy: "why-title", cls: "why",
    children: html`<div class="container split">
      <div class="split__sticky">
        ${Eyebrow(w)}
        <h2 class="display-2" id="why-title" ${chars(w.title)} data-line-reveal>${lines(w.title, w.accentFrom)}</h2>
        <div class="why__cta" data-reveal>${TextLink({ label: "Start a project", href: "#contact" })}</div>
      </div>
      <ul class="why-list">
        ${w.items.map((it, i) => html`<li class="why-item" data-reveal>
          <span class="why-item__num">${pad(i + 1)}</span>
          <div><h3 class="why-item__title">${it.title}</h3><p class="why-item__desc">${it.description}</p></div>
        </li>`)}
      </ul>
    </div>`,
  });
}

/* ------------------------------------------------------------ FOUNDER */
export function Founder() {
  const f = C.founder;
  const bio = f.bio.filter(Boolean);
  return Section({
    theme: "surface-1", labelledBy: "founder-title", cls: "founder",
    children: html`<div class="container founder__grid">
      <figure class="founder__portrait" data-reveal>
        <div class="founder__frame">
          ${picture(f.photo || "founder-placeholder", {
            alt: f.photo ? `Portrait of ${f.name}` : "Placeholder silhouette — founder portrait to be supplied",
            sizes: "(min-width:1024px) 40vw, (min-width:768px) 60vw, 100vw",
          })}
          ${!f.photo && !isProd() ? html`<span class="founder__ph">${ph(null, "FOUNDER PHOTO")}</span>` : ""}
        </div>
        <figcaption class="founder__caption">${f.name} — ${f.role}, ${C.site.legalName}</figcaption>
      </figure>
      <div class="founder__text">
        ${Eyebrow(f)}
        <h2 class="display-2" id="founder-title" ${chars(f.title)} data-line-reveal>${lines(f.title, f.accentFrom)}</h2>
        ${f.quote || !isProd() ? html`<blockquote class="pull-quote" data-reveal><p>${f.quote ? `“${f.quote}”` : ph(null, "ONE-SENTENCE FOUNDER BELIEF")}</p></blockquote>` : ""}
        <p class="founder__name" data-reveal>${f.name}</p>
        <p class="founder__role" data-reveal>${f.role}</p>
        <div class="founder__bio" data-reveal>${bio.length ? bio.map((b) => html`<p>${b}</p>`) : html`<p>${ph(null, "FOUNDER BIO — 2 SHORT PARAGRAPHS")}</p>`}</div>
        <div class="founder__actions" data-reveal>
          ${Button({ label: `Work with ${f.firstName}`, href: "#contact" })}
          ${f.linkedin
            ? html`<a class="icon-btn" href="${f.linkedin}" target="_blank" rel="noopener" aria-label="${f.name} on LinkedIn">${icon("linkedin", 20)}</a>`
            : isProd() ? "" : html`<span class="icon-btn icon-btn--missing" title="LinkedIn URL missing">${icon("linkedin", 20)}</span>`}
        </div>
      </div>
    </div>`,
  });
}

/* ------------------------------------------------------- TESTIMONIALS */
export function Testimonials() {
  const t = C.testimonials;
  const items = real(t.items);
  if (!items.length) return ""; // §7.3 — founder flows straight into contact
  const multi = items.length > 1;
  return Section({
    theme: "lime", labelledBy: "testimonials-title", cls: "testimonials", padding: "tight",
    children: html`<div class="container">
      <div class="testimonials__head">
        <div>${Eyebrow(t)}<h2 class="display-2" id="testimonials-title" ${chars(t.title)} data-line-reveal>${lines(t.title, t.accentFrom)}</h2></div>
        ${multi ? html`<div class="carousel-controls" data-carousel-controls>
          <button class="square-btn" type="button" aria-label="Previous testimonial" data-prev>${icon("arrow-left", 20)}</button>
          <p class="carousel-count" aria-hidden="true"><span data-current>01</span> / ${pad(items.length)}</p>
          <button class="square-btn" type="button" aria-label="Next testimonial" data-next>${icon("arrow-right", 20)}</button>
        </div>` : ""}
      </div>
      <div class="testimonial-viewport" ${multi ? raw('role="region" aria-roledescription="carousel" aria-label="Client testimonials" tabindex="0" data-carousel') : ""}>
        <div class="testimonial-live" aria-live="polite">
          ${items.map((q, i) => html`<figure class="testimonial" ${multi ? raw(`role="group" aria-roledescription="slide" aria-label="${i + 1} of ${items.length}"`) : ""} ${i > 0 ? raw("hidden") : ""} data-slide>
            <span class="testimonial__mark" aria-hidden="true">“</span>
            <blockquote class="testimonial__quote"><p>${q.quote ?? ph(null, `CLIENT QUOTE ${pad(i + 1)}`)}</p></blockquote>
            <figcaption class="testimonial__by">
              <span class="testimonial__name">— ${ph(q.name, "CLIENT NAME")}</span>
              <span class="testimonial__role">${ph(q.role, "ROLE")}, ${ph(q.brand, "BRAND")}</span>
            </figcaption>
          </figure>`)}
        </div>
      </div>
    </div>`,
  });
}

/* ------------------------------------------------------------- CONTACT */
export function Contact() {
  const c = C.contact;
  const field = (id, label, input, { full = false, hint = "" } = {}) => html`<div class="field ${full ? "field--full" : ""}" data-field>
    <label class="field__label" for="${id}">${label}</label>
    ${input}
    ${hint}
    <p class="field__error" id="${id}-error" hidden>${icon("alert", 14)}<span></span></p>
  </div>`;
  const req = html`<span class="req" aria-hidden="true">*</span>`;
  const chevron = icon("chevron", 14, "icon select__chevron");
  return Section({
    id: "contact", theme: "surface-2", labelledBy: "contact-title", cls: "contact",
    children: html`<div class="container split">
      <div class="split__sticky">
        ${Eyebrow(c)}
        <h2 class="display-2" id="contact-title" ${chars(c.title)} data-line-reveal>${lines(c.title, c.accentFrom)}</h2>
        <ol class="next-steps" aria-label="What happens next" data-reveal>
          ${c.nextSteps.map((s, i) => html`<li><span class="next-steps__num">${pad(i + 1)}</span>${s}</li>`)}
        </ol>
        <p class="contact__alt" data-reveal>Prefer email? ${
          C.site.email ? TextLink({ label: C.site.email, href: `mailto:${C.site.email}`, iconName: "mail" }) : ph(null, "HELLO@YOURDOMAIN.COM")
        }</p>
      </div>
      <div class="contact__form-wrap" data-reveal>
        <form class="contact-form" novalidate data-contact-form>
          <div class="form-grid">
            ${field("f-name", html`Your name ${req}`, html`<input id="f-name" name="name" type="text" autocomplete="name" placeholder="Jane Doe" required maxlength="120" aria-describedby="f-name-error">`)}
            ${field("f-email", html`Work email ${req}`, html`<input id="f-email" name="email" type="email" autocomplete="email" placeholder="jane@brand.com" required maxlength="200" aria-describedby="f-email-error">`)}
            ${field("f-company", html`Brand / company ${req}`, html`<input id="f-company" name="company" type="text" autocomplete="organization" placeholder="Brand name" required maxlength="160" aria-describedby="f-company-error">`)}
            ${field("f-website", "Website (optional)", html`<input id="f-website" name="website" type="url" autocomplete="url" placeholder="https://" maxlength="300" aria-describedby="f-website-error">`)}
            ${field("f-service", html`What do you need? ${req}`, html`<div class="select"><select id="f-service" name="service" required aria-describedby="f-service-error">
              <option value="">Choose a service</option>
              ${C.services.items.map((s) => html`<option value="${s.slug}">${s.title}</option>`)}
              <option value="not-sure">Not sure yet</option>
            </select>${chevron}</div>`)}
            ${field("f-budget", html`Estimated budget ${req}`, html`<div class="select"><select id="f-budget" name="budget" required aria-describedby="f-budget-error">
              <option value="">Choose a range</option>
              ${c.budgets.map((b) => html`<option value="${C.site.currency}${b}">${C.site.currency}${b}</option>`)}
            </select>${chevron}</div>`)}
            ${field("f-message", html`Tell us about the project ${req}`, html`<textarea id="f-message" name="message" rows="5" required minlength="10" maxlength="1000" placeholder="Goals, timeline, links — anything helpful." aria-describedby="f-message-error f-message-count"></textarea>`, {
              full: true, hint: html`<p class="field__count" id="f-message-count"><span data-count-now>0</span> / 1000</p>`,
            })}
            <div class="field field--full field--check" data-field>
              <label class="check" for="f-consent">
                <input id="f-consent" name="consent" type="checkbox" required aria-describedby="f-consent-error">
                <span class="check__box" aria-hidden="true">${icon("check", 14)}</span>
                <span>I agree to the <a href="${url("privacy/")}">privacy policy</a>. ${req}</span>
              </label>
              <p class="field__error" id="f-consent-error" hidden>${icon("alert", 14)}<span></span></p>
            </div>
            <div class="hp" aria-hidden="true"><label for="f-fax">Leave empty</label><input id="f-fax" name="fax" type="text" tabindex="-1" autocomplete="off"></div>
          </div>
          <div class="contact-form__submit">
            ${Button({ label: "Send inquiry", type: "submit", size: "lg", attrs: raw("data-submit") })}
            <p class="contact-form__note">We'll never share your details.</p>
          </div>
          <p class="form-alert" role="alert" hidden data-form-alert></p>
          <noscript><p class="form-alert">This form needs JavaScript. ${C.site.email ? html`Email us at <a href="mailto:${C.site.email}">${C.site.email}</a>.` : ""}</p></noscript>
        </form>
        <div class="form-success" hidden data-form-success>
          <p class="form-success__icon">${icon("check", 24)}</p>
          <h3 class="form-success__title" tabindex="-1" data-success-title>Thanks.</h3>
          <p class="form-success__text">We'll reply within ${C.site.responseTime}. Keep an eye on your inbox.</p>
          ${TextLink({ label: "Back to top", href: "#top", iconName: "arrow-up" })}
        </div>
      </div>
    </div>`,
  });
}

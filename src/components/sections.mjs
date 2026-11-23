/* Home page sections — blueprint §8.2–§8.11 */
import { html, chars, raw, url, asset, icon, lines, ph, real, isProd, picture, imageSrc, photo, hasImage, staticFile } from "../lib/core.mjs";
import { Button, TextLink, Eyebrow, Tag, FormatBadge, Section, SectionHeader, ChoiceGroup } from "./ui.mjs";
import { LogoMarquee, resolveLogos } from "./logo-marquee.mjs";
import { CampaignShowcase } from "./showcase.mjs";
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
          ${Button({ label: "Speak to our team today", href: "#contact", size: "lg" })}
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
  const t = C.trust;
  const logos = real(resolveLogos(t.logos));
  if (isProd() && logos.length < 4) return ""; // §7.3 — no fake logo boxes in production
  return Section({
    labelledBy: "clients-title", cls: "clients",
    children: html`<div class="container">
      <header class="section-header section-header--aside">
        <div class="section-header__main">
          ${Eyebrow(t)}
          <h2 class="h3 clients__title" id="clients-title" data-line-reveal>${lines(t.title, t.accentFrom)}</h2>
        </div>
        <div class="section-header__aside" data-reveal><p class="lead">${t.lead}</p></div>
      </header>
    </div>
    <div data-reveal>${LogoMarquee({ logos, label: "Brands we have worked with", cls: "clients__marquee" })}</div>`,
  });
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
          <a class="service-row" href="#reel">
            <span class="service-row__num">${pad(i + 1)}</span>
            <h3 class="service-row__title"><span>${item.title}</span></h3>
            <div class="service-row__body">
              <p>${item.description}</p>
              <ul class="tags" aria-label="Deliverables">${item.tags.map(Tag)}</ul>
            </div>
            <span class="icon-box" aria-hidden="true">${icon("arrow-up-right", 20)}</span>
            <span class="visually-hidden">— see our ad creatives</span>
          </a>
        </li>`)}
      </ol>
    </div>`,
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

/* Ad reel: a scroll-snap strip of 9:16 poster cards. No <video> ships in the HTML — reel.js
   creates ONE shared player on hover/tap and unloads it again (see src/scripts/reel.js). */
export function Reel(r) {
  const items = (r?.items || []).filter((it) => staticFile(`video/${it.slug}.mp4`) && hasImage(it.slug));
  if (!items.length) return "";
  const sizes = "(min-width:1024px) 248px, (min-width:640px) 34vw, 64vw";
  return html`<div class="reel" id="reel" data-reel>
    <div class="reel__bar">
      <p class="eyebrow"><span class="eyebrow__index">${r.title}</span> / ${r.label}</p>
      <p class="reel__hint"><span class="reel__hint--fine">${r.hint}</span><span class="reel__hint--touch">${r.hintTouch}</span></p>
      <div class="reel__nav">
        <button class="icon-box" type="button" data-reel-prev aria-label="Previous creatives">${icon("arrow-left", 20)}</button>
        <button class="icon-box" type="button" data-reel-next aria-label="Next creatives">${icon("arrow-right", 20)}</button>
      </div>
    </div>
    <ul class="reel__track" data-reel-track aria-label="${r.title}">
      ${items.map((it, i) => html`<li class="reel-card" data-video="${asset(`video/${it.slug}.mp4`)}">
        ${picture(it.slug, { alt: "", sizes, imgCls: "reel-card__poster" })}
        <button class="reel-card__btn" type="button" aria-label="Play ad ${i + 1}: ${it.alt}">
          <span class="reel-card__tag">${it.tag}</span>
          <span class="reel-card__play" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg></span>
        </button>
      </li>`)}
    </ul>
  </div>`;
}

export function Work() {
  const w = C.work;
  const projects = real(w.projects);
  return Section({
    id: "work", theme: "surface-1", labelledBy: "work-title", cls: "work",
    children: html`<div class="container container--wide">
      <div class="work__head">${SectionHeader({ id: "work-title", ...w, aside: html`<p class="lead">${w.aside}</p>` })}</div>
      ${Reel(w.reel)}
      ${projects.length
        ? html`<div class="project-grid">${projects.map((p, i) => ProjectCard(p, i))}</div>`
        : w.reel?.items?.length ? "" : html`<div class="work__empty" data-reveal>
            <p class="h4">Case studies are being written up.</p>
            <p class="lead">Ask us for recent examples in your category — we'll share what we can.</p>
          </div>`}
      <div class="work__foot" data-reveal>${Button({ label: "Discuss a similar project", href: "#contact", variant: "secondary" })}</div>
    </div>`,
  });
}

/* ------------------------------------------------------------ SHOWCASE */
export const Showcase = () => CampaignShowcase(C.showcase);

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
  const aside = html`<p class="lead">${r.aside ?? r.statement}</p><p class="note">${TextLink({ label: "Why brands want to work with us", href: "#about", cls: "text-link--accent" })}</p>`;
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
        <div class="why__cta" data-reveal>${TextLink({ label: "Speak to our team today", href: "#contact" })}</div>
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
  const Person = (p, i) => html`<figure class="founder__person" data-reveal style="--d:${(i % 2) * 120}ms">
    <div class="founder__frame">
      ${p.photo
        ? photo(p.photo, { alt: p.name ? `Portrait of ${p.name}` : "Portrait of a team member", style: p.focus ? `object-position:${p.focus}` : "" })
        : picture("founder-placeholder", { alt: "Placeholder silhouette — founder portrait to be supplied", sizes: "(min-width:1024px) 22vw, 50vw" })}
    </div>
    <figcaption class="founder__caption">
      <span class="founder__name">${ph(p.name, "FOUNDER NAME")}</span>
      <span class="founder__role">${ph(p.role, "ROLE")}</span>
      ${p.linkedin
        ? html`<a class="founder__link" href="${p.linkedin}" target="_blank" rel="noopener" aria-label="${p.name} on LinkedIn">${icon("linkedin", 18)}</a>`
        : ""}
    </figcaption>
  </figure>`;
  return Section({
    theme: "surface-1", labelledBy: "founder-title", cls: "founder",
    children: html`<div class="container founder__grid">
      <div class="founder__text">
        ${Eyebrow(f)}
        <h2 class="display-2" id="founder-title" ${chars(f.title)} data-line-reveal>${lines(f.title, f.accentFrom)}</h2>
        ${f.quote || !isProd() ? html`<blockquote class="pull-quote" data-reveal><p>${f.quote ? `“${f.quote}”` : ph(null, "ONE-SENTENCE FOUNDER BELIEF")}</p></blockquote>` : ""}
        <div class="founder__bio" data-reveal>${bio.length ? bio.map((b) => html`<p>${b}</p>`) : html`<p>${ph(null, "FOUNDER BIO — 2 SHORT PARAGRAPHS")}</p>`}</div>
        <div class="founder__actions" data-reveal>${Button({ label: "Work with us", href: "#contact" })}</div>
      </div>
      <div class="founder__people">${f.people.map(Person)}</div>
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
/* Contact follows Testimonials; when Testimonials is hidden (no real quotes yet) it takes that number. */
const contactIndex = () => (real(C.testimonials.items).length ? C.contact.index : pad(Number(C.contact.index) - 1));

export function Contact() {
  const c = C.contact;
  const field = (id, label, input, { full = false, hint = "" } = {}) => html`<div class="field ${full ? "field--full" : ""}" data-field>
    <label class="field__label" for="${id}">${label}</label>
    ${input}
    ${hint}
    <p class="field__error" id="${id}-error" hidden>${icon("alert", 14)}<span></span></p>
  </div>`;
  const req = html`<span class="req" aria-hidden="true">*</span>`;
  const q = c.form;
  // Four steps. With JS the form becomes a stepper (one step at a time, see scripts/contact.js);
  // without JS every step shows in sequence and the submit button is always there.
  const steps = [
    { title: "About you", short: "About you" },
    { title: "Where you are today", short: "Today" },
    { title: "Where you want to be", short: "Goal" },
    { title: "What's in the way", short: "Challenges" },
  ];
  const Step = (n, body) => html`<section class="form-step" aria-labelledby="form-step-${n}" data-form-step="${steps[n - 1].title}">
    <h3 class="form-step__head" id="form-step-${n}" tabindex="-1"><span class="form-step__num" aria-hidden="true"><span class="form-step__digit">${pad(n)}</span>${icon("check", 14, "icon form-step__tick")}</span>${steps[n - 1].title}<span class="visually-hidden" data-step-status></span></h3>
    ${body}
  </section>`;
  const Stepper = html`<div class="stepper" data-stepper hidden>
    <ol class="stepper__list">
      ${steps.map((s, i) => html`<li class="stepper__item" data-stepper-item>
        <button class="stepper__btn" type="button" data-goto="${i}" disabled>
          <span class="stepper__bar" aria-hidden="true"><span class="stepper__fill"></span></span>
          <span class="stepper__meta"><span class="stepper__num">${pad(i + 1)}</span><span class="stepper__label">${s.short}</span></span>
          <span class="visually-hidden" data-stepper-sr></span>
        </button>
      </li>`)}
    </ol>
    <p class="stepper__caption" aria-live="polite" data-stepper-caption></p>
  </div>`;
  return Section({
    id: "contact", theme: "surface-2", labelledBy: "contact-title", cls: "contact",
    children: html`<div class="container split">
      <div class="split__sticky">
        ${Eyebrow({ ...c, index: contactIndex() })}
        <h2 class="display-2" id="contact-title" ${chars(c.title)} data-line-reveal>${lines(c.title, c.accentFrom)}</h2>
        <ol class="next-steps" aria-label="What happens next" data-reveal>
          ${c.nextSteps.map((s, i) => html`<li><span class="next-steps__num">${pad(i + 1)}</span>${s}</li>`)}
        </ol>
        ${C.site.email || !isProd() ? html`<p class="contact__alt" data-reveal>Prefer email? ${
          C.site.email ? TextLink({ label: C.site.email, href: `mailto:${C.site.email}`, iconName: "mail" }) : ph(null, "HELLO@YOURDOMAIN.COM")
        }</p>` : ""}
      </div>
      <div class="contact__form-wrap" data-reveal>
        <form class="contact-form" novalidate data-contact-form>
          <p class="form-intro">${q.intro}</p>
          ${Stepper}
          <input type="hidden" name="service" value="not-sure" data-service-field>

          ${Step(1, html`<div class="form-grid">
            ${field("f-name", html`Your name ${req}`, html`<input id="f-name" name="name" type="text" autocomplete="name" placeholder="Jane Doe" required maxlength="120" aria-describedby="f-name-error">`)}
            ${field("f-email", html`Email address ${req}`, html`<input id="f-email" name="email" type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" placeholder="jane@brand.com" required maxlength="200" aria-describedby="f-email-error">`)}
            ${field("f-phone", html`Phone number ${req}`, html`<input id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+91 98765 43210" required maxlength="20" aria-describedby="f-phone-error">`)}
            ${field("f-company", html`Brand name ${req}`, html`<input id="f-company" name="company" type="text" autocomplete="organization" placeholder="Your brand" required maxlength="160" aria-describedby="f-company-error">`)}
          </div>`)}

          ${Step(2, html`
            ${ChoiceGroup({ id: "q-revenue", name: "revenue_current", legend: q.revenueCurrent.question, options: q.revenueCurrent.options, required: true })}
            ${ChoiceGroup({ id: "q-budget", name: "budget_fit", legend: q.budgetFit.question, options: q.budgetFit.options, required: true })}`)}

          ${Step(3, html`
            ${ChoiceGroup({ id: "q-target", name: "revenue_target", legend: q.revenueTarget.question, options: q.revenueTarget.options, required: true })}
            ${ChoiceGroup({ id: "q-timeline", name: "target_timeline", legend: q.timeline.question, options: q.timeline.options, required: true, layout: "compact" })}`)}

          ${Step(4, html`${ChoiceGroup({
            id: "q-challenges", name: "challenges", type: "checkbox", legend: q.challenges.question, hint: q.challenges.hint,
            options: q.challenges.options, required: true, layout: "list", dropdown: q.challenges.dropdownPlaceholder,
            after: html`<div class="field choices__other" data-field>
              <label class="field__label" for="f-other">${q.challenges.otherLabel}</label>
              <textarea id="f-other" name="challenge_other" rows="2" maxlength="500" placeholder="${q.challenges.otherPlaceholder}" aria-describedby="f-other-error"></textarea>
              <p class="field__error" id="f-other-error" hidden>${icon("alert", 14)}<span></span></p>
            </div>`,
          })}
          <div class="field choices__other field--question" data-field>
            <label class="choices__legend" for="f-start">${q.startReady.question} ${req}</label>
            <textarea id="f-start" name="start_ready" rows="2" maxlength="500" required placeholder="${q.startReady.placeholder}" aria-describedby="f-start-error"></textarea>
            <p class="field__error" id="f-start-error" hidden>${icon("alert", 14)}<span></span></p>
          </div>
          <div class="field field--check" data-field>
            <label class="check" for="f-consent">
              <input id="f-consent" name="consent" type="checkbox" required aria-describedby="f-consent-error">
              <span class="check__box" aria-hidden="true">${icon("check", 14)}</span>
              <span>I agree to the <a href="${url("privacy/")}">privacy policy</a>. ${req}</span>
            </label>
            <p class="field__error" id="f-consent-error" hidden>${icon("alert", 14)}<span></span></p>
          </div>`)}

          <div class="hp" aria-hidden="true"><label for="f-fax">Leave empty</label><input id="f-fax" name="fax" type="text" tabindex="-1" autocomplete="off"></div>
          <div class="form-nav">
            <button class="form-nav__back" type="button" data-prev hidden>${icon("arrow-left", 16)}<span>Back</span></button>
            ${Button({ label: "Continue", type: "button", size: "lg", iconName: "arrow-right", cls: "form-nav__next", attrs: raw("data-next hidden") })}
            ${Button({ label: q.submit, type: "submit", size: "lg", cls: "form-nav__submit", attrs: raw("data-submit") })}
          </div>
          <p class="contact-form__note">${icon("lock", 14, "icon contact-form__lock")}<span>${q.reassurance}</span></p>
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

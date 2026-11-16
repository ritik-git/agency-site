/* Document shell, header, mobile menu, footer — blueprint §8.1, §8.12, §18.5 */
import { html, raw, url, asset, icon, ctx, ph, isProd, chars } from "../lib/core.mjs";
import { Button, Logo, TextLink } from "./ui.mjs";
import { ActionBar } from "./action-bar.mjs";
import { site, nav, services, footer as footerContent } from "../../content/site.mjs";

const navHref = (href, onHome) => (onHome ? href : url("") + href);

export function SiteHeader({ onHome }) {
  return html`<header class="site-header" data-header>
    <div class="container site-header__inner">
      ${Logo({ name: site.name, suffix: site.nameSuffix, href: navHref("#home", onHome) })}
      <nav class="primary-nav" aria-label="Primary">
        <ul class="primary-nav__list">
          ${nav.map((n) => html`<li><a class="nav-link" href="${navHref(n.href, onHome)}" data-nav-link>${n.label}</a></li>`)}
        </ul>
      </nav>
      ${Button({ label: "Start a project", href: navHref("#contact", onHome), size: "sm", cls: "site-header__cta" })}
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" data-menu-toggle>
        <span class="visually-hidden" data-menu-label>Open menu</span>
        <span class="menu-toggle__bar" aria-hidden="true"></span>
        <span class="menu-toggle__bar" aria-hidden="true"></span>
      </button>
    </div>
  </header>`;
}

function Socials() {
  const list = site.socials.filter((s) => s.href || !isProd());
  return list.map((s) =>
    s.href
      ? html`<li><a class="social-link" href="${s.href}" rel="noopener" target="_blank">${s.label}</a></li>`
      : html`<li><span class="social-link social-link--missing">${s.label} ${ph(null, "URL")}</span></li>`
  );
}

export function MobileMenu({ onHome }) {
  return html`<div class="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Site menu" hidden data-mobile-menu>
    <div class="container mobile-menu__inner">
      <nav aria-label="Mobile">
        <ol class="mobile-menu__list">
          ${nav.map((n, i) => html`<li class="mobile-menu__item" style="--i:${i}">
            <a class="mobile-menu__link" href="${navHref(n.href, onHome)}" data-menu-link>
              <span class="mobile-menu__index">${String(i + 1).padStart(2, "0")}</span>${n.label}
            </a></li>`)}
        </ol>
      </nav>
      <div class="mobile-menu__foot">
        ${Button({ label: "Start a project", href: navHref("#contact", onHome), size: "lg", cls: "btn--block", attrs: raw("data-menu-link") })}
        <p class="mobile-menu__meta">${site.email ? html`<a href="mailto:${site.email}">${site.email}</a>` : ph(null, "EMAIL")}</p>
        <ul class="mobile-menu__socials">${Socials()}</ul>
      </div>
    </div>
  </div>`;
}

export function SiteFooter({ onHome }) {
  return html`<footer class="site-footer" data-theme="dark">
    <div class="container">
      <div class="site-footer__cta" data-reveal>
        <p class="h3">${footerContent.cta}</p>
        ${Button({ label: "Start a project", href: navHref("#contact", onHome), size: "lg" })}
      </div>
      <div class="site-footer__cols">
        <div class="footer-col">
          <h2 class="footer-col__title">Navigate</h2>
          <ul>${nav.map((n) => html`<li><a href="${navHref(n.href, onHome)}">${n.label}</a></li>`)}</ul>
        </div>
        <div class="footer-col">
          <h2 class="footer-col__title">Services</h2>
          <ul>${services.items.map((s) => html`<li><a href="${navHref("#service-" + s.slug, onHome)}">${s.title}</a></li>`)}</ul>
        </div>
        <div class="footer-col">
          <h2 class="footer-col__title">Contact</h2>
          <ul>
            <li>${site.email ? html`<a href="mailto:${site.email}">${site.email}</a>` : ph(null, "EMAIL")}</li>
            ${site.phone ? html`<li><a href="tel:${site.phone.replace(/\s/g, "")}">${site.phone}</a></li>` : ""}
            <li>${ph(site.location, "CITY, COUNTRY")}</li>
          </ul>
        </div>
        <div class="footer-col">
          <h2 class="footer-col__title">Social</h2>
          <ul>${Socials()}</ul>
        </div>
      </div>
    </div>
    <div class="site-footer__wordmark" aria-hidden="true" ${chars([site.name])}><span class="accent">${site.name[0]}</span>${site.name.slice(1)}</div>
    <div class="container"><div class="site-footer__bar">
      <p>© ${ctx.year} ${site.legalName}</p>
      <a href="${url("privacy/")}">Privacy</a>
      ${TextLink({ label: "Back to top", href: "#top", iconName: "arrow-up" })}
    </div></div>
  </footer>`;
}

function jsonLd(data) {
  return raw(`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`);
}

export function Document({ title, description, path = "", onHome = false, noindex = false, ld = [], body, bodyClass = "", scripts = ["main.js"], styles = ["site.css"], chrome = true }) {
  const canonical = (ctx.siteUrl || site.url) + url(path);
  const ogImage = (ctx.siteUrl || site.url) + url("og-image.jpg");
  return html`<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${canonical}">
${noindex || !isProd() ? raw('<meta name="robots" content="noindex">') : ""}
<meta name="theme-color" content="#050505">
<meta name="color-scheme" content="dark">
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${asset("icons/favicon.svg")}" type="image/svg+xml">
<link rel="icon" href="${asset("icons/icon-32.png")}" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="${asset("icons/icon-180.png")}">
<link rel="manifest" href="${url("site.webmanifest")}">
<link rel="preload" href="${asset("fonts/inter-display-600.woff")}" as="font" type="font/woff" crossorigin>
<link rel="preload" href="${asset("fonts/inter-400.woff")}" as="font" type="font/woff" crossorigin>
${styles.map((s) => html`<link rel="stylesheet" href="${asset(s)}">`)}
<script>document.documentElement.classList.replace("no-js","js");</script>
${ld.map(jsonLd)}
</head>
<body class="${bodyClass}${chrome ? " has-action-bar" : ""}" id="top">
${chrome ? html`<a class="skip-link" href="#main">Skip to content</a>
${SiteHeader({ onHome })}` : ""}
<main id="main" tabindex="-1">
${body}
</main>
${chrome ? html`${SiteFooter({ onHome })}
${ActionBar({
  contactHref: onHome || String(body).includes('id="contact"') ? "#contact" : url("") + "#contact",
  whatsapp: site.whatsapp, lines: site.actionBar,
})}
${MobileMenu({ onHome })}` : ""}
${scripts.map((s) => html`<script type="module" src="${asset("js/" + s)}"></script>`)}
</body>
</html>`;
}

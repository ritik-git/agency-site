/* ActionBar — floating bottom conversion bar (Contact + WhatsApp), rendered on every public page.
   Behaviour (scripts/interactions.js → initActionBar): slides away while the contact form is on screen,
   while a form field has focus (mobile keyboards) and while the mobile menu is open. Works without JS. */
import { html, raw, icon } from "../lib/core.mjs";

/**
 * @param {object} o
 * @param {string} o.contactHref  link to the existing contact form (#contact, or the homepage's)
 * @param {string} [o.whatsapp]   phone number in any format, e.g. "+91 7000590736"; omitted → button hidden
 * @param {Array<{lead: string, accent: string, note?: string}>} [o.lines]  rotating headlines beside the
 *        buttons (accent words in lime, note = small line under it); one line → static
 * @param {string} [o.contactLabel]
 * @param {string} [o.whatsappLabel]
 */
export function ActionBar({ contactHref, whatsapp, lines = [], contactLabel = "Contact us", whatsappLabel = "WhatsApp" }) {
  const digits = whatsapp ? String(whatsapp).replace(/\D/g, "") : "";
  // All lines share one grid cell (the bar is sized to the longest, so it never jumps).
  // Only the first is exposed to assistive tech; the rest are visual variations.
  return html`<div class="action-bar" data-action-bar>
    <nav class="action-bar__inner" aria-label="Quick contact">
      ${lines.length ? html`<p class="action-bar__tagline">${lines.map((l, i) => html`<span class="action-bar__phrase${i === 0 ? " is-active" : ""}" ${i ? raw('aria-hidden="true"') : ""} data-phrase>
        <span class="action-bar__headline">${l.lead} <span class="accent">${l.accent}</span></span>
        ${l.note ? html`<span class="action-bar__note">${l.note}</span>` : ""}
      </span>`)}</p>` : ""}
      <div class="action-bar__actions">
      <a class="action-bar__btn action-bar__btn--contact" href="${contactHref}">
        ${icon("phone", 18, "icon action-bar__icon")}<span class="action-bar__label">${contactLabel}</span>
      </a>
      ${digits ? html`<a class="action-bar__btn action-bar__btn--wa" href="https://wa.me/${digits}" target="_blank" rel="noopener noreferrer">
        <span class="action-bar__wa-icon">${icon("whatsapp", 20, "icon action-bar__icon")}<span class="action-bar__dot" aria-hidden="true"></span></span>
        <span class="action-bar__label">${whatsappLabel}</span><span class="visually-hidden"> (opens in a new tab)</span>
      </a>` : ""}
      </div>
    </nav>
  </div>`;
}

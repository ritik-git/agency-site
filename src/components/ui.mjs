/* UI primitives — blueprint §12 */
import { html, raw, chars, icon, lines } from "../lib/core.mjs";

/** Button — `<a>` when it navigates, `<button>` when it acts. */
export function Button({ label, href, variant = "primary", size = "md", iconName = "arrow-up-right", type = "button", attrs = "", cls = "" }) {
  const c = `btn btn--${variant} btn--${size} ${cls}`.trim();
  const inner = html`<span class="btn__label">${label}</span>${iconName ? icon(iconName, 16, "icon btn__icon") : ""}`;
  return href
    ? html`<a class="${c}" href="${href}" ${attrs}>${inner}</a>`
    : html`<button class="${c}" type="${type}" ${attrs}>${inner}</button>`;
}

export function TextLink({ label, href, iconName = "arrow-up-right", cls = "", attrs = "" }) {
  return html`<a class="text-link ${cls}" href="${href}" ${attrs}><span class="text-link__label">${label}</span>${icon(iconName, 16)}</a>`;
}

export function Eyebrow({ index, label }) {
  return html`<p class="eyebrow"><span class="eyebrow__index">${index}</span> / ${label}</p>`;
}

export const Tag = (t) => html`<li class="tag">${t}</li>`;
export const FormatBadge = (text) => html`<span class="format-badge">${text}</span>`;

/** Section wrapper contract (§19.4) — theme, anchor offset, hairline seam. */
export function Section({ id, theme = "dark", labelledBy, cls = "", padding = "default", seam = true, children }) {
  return html`<section ${id ? html`id="${id}"` : ""} class="section section--${padding} ${cls}" data-theme="${theme}" ${
    labelledBy ? html`aria-labelledby="${labelledBy}"` : ""
  }>${seam ? html`<div class="seam" aria-hidden="true"></div>` : ""}${children}</section>`;
}

/** SectionHeader — eyebrow + display H2 with lime accent + optional aside (§12.8). */
export function SectionHeader({ id, index, label, title, accentFrom, aside, cls = "" }) {
  return html`<header class="section-header ${aside ? "section-header--aside" : ""} ${cls}">
    <div class="section-header__main">
      ${Eyebrow({ index, label })}
      <h2 class="display-2" id="${id}" ${chars(title)} data-line-reveal>${lines(title, accentFrom)}</h2>
    </div>
    ${aside ? html`<div class="section-header__aside" data-reveal>${aside}</div>` : ""}
  </header>`;
}

/**
 * ChoiceGroup — a question answered by tapping option cards (§ consultation form).
 * Native radios/checkboxes inside <label>s, so keyboard (Tab / arrow keys / Space), screen readers
 * and form submission all work without JS. Visuals hang off `input:checked + .choice__body`.
 * @param {object} o
 * @param {string} o.id        prefix for ids
 * @param {string} o.name      form field name
 * @param {string} o.legend    the question
 * @param {Array<{value: string, label: string, wide?: boolean}>} o.options
 * @param {"radio"|"checkbox"} [o.type]
 * @param {boolean} [o.required]
 * @param {string} [o.hint]
 * @param {"2"|"compact"|"list"} [o.layout]  "2": two columns; "compact": short labels, two per row on phones,
 *        three from 480px; "list": longer labels, one column on phones, two from 480px
 * @param {*} [o.after]        extra markup inside the fieldset, after the options (e.g. an "other" field)
 */
export function ChoiceGroup({ id, name, legend, options, type = "radio", required = false, hint = "", layout = "2", after = "", dropdown = "" }) {
  const mark = type === "checkbox" ? icon("check", 12, "icon choice__check") : "";
  const grid = html`<div class="choices__grid choices__grid--${dropdown ? "menu" : layout}">
      ${options.map((o) => html`<label class="choice${o.wide ? " choice--wide" : ""}">
        <input class="choice__input" type="${type}" name="${name}" value="${o.value}">
        <span class="choice__body"><span class="choice__mark choice__mark--${type}" aria-hidden="true">${mark}</span><span class="choice__text">${o.label}</span></span>
      </label>`)}
    </div>`;
  return html`<fieldset class="choices" id="${id}" data-choices="${name}" ${required ? raw("data-required") : ""} aria-describedby="${hint ? `${id}-hint ` : ""}${id}-error">
    <legend class="choices__legend">${legend}${required ? html` <span class="req" aria-hidden="true">*</span>` : ""}</legend>
    ${hint ? html`<p class="choices__hint" id="${id}-hint">${hint}</p>` : ""}
    ${dropdown
      ? html`<details class="choices__dropdown" data-dropdown>
        <summary class="choices__summary"><span class="choices__summary-text" data-dropdown-label data-placeholder="${dropdown}">${dropdown}</span>${icon("chevron", 18, "icon choices__caret")}</summary>
        ${grid}
      </details>`
      : grid}
    ${after}
    <p class="field__error choices__error" id="${id}-error" hidden>${icon("alert", 14)}<span></span></p>
  </fieldset>`;
}

export function Logo({ name, suffix, href }) {
  return html`<a class="logo" href="${href}" aria-label="${name} ${suffix} — home">
    <svg class="logo__mark" width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" focusable="false">
      <rect width="28" height="28" fill="var(--color-accent)"/>
      <path d="M8.2 21 12.9 7h2.3L20 21h-2.6l-1.1-3.4h-4.7L10.5 21zm4.3-5.6h3.1L14 10.6z" fill="var(--color-on-accent)"/>
    </svg>
    <span class="logo__word">${name}<span class="logo__suffix"> / ${suffix}</span></span>
  </a>`;
}

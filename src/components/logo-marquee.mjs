/* LogoMarquee: a reusable, CSS-only, seamlessly looping strip of logos.

   Build-time (Node) component. It reads each logo file once to get its intrinsic aspect
   ratio (explicit width/height attributes, so no layout shift) and to detect placeholder files
   (marked `data-logo-placeholder`), which are dropped from production builds.

   Usage:
     LogoMarquee({ logos: resolveLogos(list), label: "Clients", secondsPerLogo: 3.2 })
   logo: { name, src: "logos/brand.svg", scale?: number, tone?: "light" }  (src is relative to static/)

   Seamless loop: the track holds two identical groups and animates translateX(0 → -50%).
   Spacing is padding on each item (not flex `gap`), so the two halves are exactly equal in width.
   Each group repeats the list `repeat` times so one group is always wider than the viewport. */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { html, raw, url, ph, isProd, imageSize } from "../lib/core.mjs";

const STATIC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../static");
const PLACEHOLDER_MARK = "data-logo-placeholder";

/** Intrinsic size + placeholder flag for a file under static/. Supports SVG, PNG and WebP. */
function inspect(src) {
  const file = path.join(STATIC, src);
  if (!src || !existsSync(file)) return { missing: true };
  const placeholder = /\.svg$/i.test(src) && readFileSync(file, "utf8").includes(PLACEHOLDER_MARK);
  return { ...imageSize(file), placeholder }; // unknown formats: no intrinsic size; CSS still fixes the height
}

/** Attach file metadata; a missing or placeholder file marks the entry as a placeholder. */
export const resolveLogos = (list) =>
  list.map((l) => {
    const m = inspect(l.src);
    return { ...l, ...m, isPlaceholder: Boolean(l.isPlaceholder || m.missing || m.placeholder) };
  });

const H = 40; // nominal height for width/height attributes (CSS sets the rendered height)

function Item(l, hidden) {
  const ratio = l.w && l.h ? l.w / l.h : 3;
  const vars = [l.scale && l.scale !== 1 && `--logo-scale:${+l.scale}`, l.brightness && `--logo-brightness:${+l.brightness}`].filter(Boolean);
  const style = vars.length ? raw(`style="${vars.join(";")}"`) : "";
  const tone = l.tone === "light" || l.tone === "lift" ? raw(`data-tone="${l.tone}"`) : "";
  const body = l.missing
    ? ph(null, `${l.name} logo`)
    : html`<img class="logo-marquee__img" src="${url("assets/" + l.src)}" alt="${hidden ? "" : l.name}" width="${Math.round(H * ratio)}" height="${H}" loading="lazy" decoding="async" draggable="false">`;
  return html`<li class="logo-marquee__item" ${style} ${tone} ${hidden ? raw('aria-hidden="true"') : ""}>${body}</li>`;
}

/**
 * @param {object}   o
 * @param {Array}    o.logos           resolved logos (see resolveLogos)
 * @param {string}   o.label           accessible name for the list
 * @param {number}   [o.secondsPerLogo] speed: time for one logo to pass (lower = faster)
 * @param {number}   [o.repeat]        copies of the list inside one group (keeps groups wider than the viewport)
 * @param {string}   [o.cls]
 */
export function LogoMarquee({ logos, label = "Client logos", secondsPerLogo = 3.2, repeat = 2, cls = "" }) {
  const shown = isProd() ? logos.filter((l) => !l.isPlaceholder) : logos;
  if (!shown.length) return "";
  const perGroup = Array.from({ length: repeat }, () => shown).flat();
  const duration = (perGroup.length * secondsPerLogo).toFixed(1);
  // Group 1, copy 1: the only items assistive tech sees. Everything else is visual duplication,
  // marked aria-hidden (CSS also uses that marker to drop duplicates when motion is reduced).
  const group = (aria) => html`<ul class="logo-marquee__group" ${aria ? html`aria-label="${label}"` : raw('aria-hidden="true"')}>${
    perGroup.map((l, i) => Item(l, !aria || i >= shown.length))
  }</ul>`;
  return html`<div class="logo-marquee ${cls}" style="--marquee-duration:${duration}s" data-marquee>
    <div class="logo-marquee__track">${group(true)}${group(false)}</div>
  </div>`;
}

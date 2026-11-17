/* Tiny, dependency-free templating core.
   html`` auto-escapes interpolations; nest html`` results or arrays freely. */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

class Raw { constructor(s) { this.s = s; } toString() { return this.s; } }
export const raw = (s) => new Raw(String(s));

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function render(v) {
  if (v == null || v === false) return "";
  if (v instanceof Raw) return v.s;
  if (Array.isArray(v)) return v.map(render).join("");
  return esc(v);
}

export function html(strings, ...vals) {
  let out = "";
  strings.forEach((s, i) => { out += s + (i < vals.length ? render(vals[i]) : ""); });
  return new Raw(out);
}

/* ---- build context -------------------------------------------------- */
export const ctx = {
  mode: process.env.MODE === "production" ? "production" : "preview",
  base: (process.env.BASE_PATH || "/").replace(/\/?$/, "/"),
  siteUrl: (process.env.SITE_URL || "").replace(/\/$/, ""),
  year: new Date().getFullYear(),
};
export const isProd = () => ctx.mode === "production";

/** Root-relative URL that respects the GitHub Pages project base path. */
export const url = (p = "") => ctx.base + String(p).replace(/^\//, "");
export const asset = (p) => url("assets/" + p);

/* ---- placeholders --------------------------------------------------- */
/** Value or a visible [PLACEHOLDER] chip (preview builds only). */
export function ph(value, label) {
  if (value != null && value !== "") return value;
  if (isProd()) return "";
  return html`<span class="placeholder-chip">[${label}]</span>`;
}
export const real = (list) => (isProd() ? list.filter((x) => !x.isPlaceholder) : list);

/* ---- headline lines with lime accent ------------------------------- */
/** Width of the longest authored line in em (real Inter Display 600 advances, uppercase,
 *  display tracking) → CSS var so display type sizes itself to fit its container. */
const METRICS = JSON.parse(readFileSync(path.join(ROOT, "static/fonts/metrics.json"), "utf8")).display600;
const lineEm = (line, tracking = -0.05) =>
  [...String(line).toUpperCase()].reduce((w, ch) => w + (METRICS[ch] ?? 0.62) + tracking, 0);
export const chars = (title) => raw(`style="--em:${(Math.max(...title.map((l) => lineEm(l))) * 1.04 + 0.06).toFixed(3)}"`);

export function lines(title, accentFrom, { reveal = true } = {}) {
  return title.map((line, i) => html`<span class="line${i >= accentFrom ? " accent" : ""}">${
    reveal ? html`<span class="line__inner">${line}</span>` : line
  }</span> `);
}

/* ---- icons (Lucide-style 1.5 stroke) -------------------------------- */
const ICONS = {
  "arrow-up-right": '<path d="M7 17 17 7M8 7h9v9"/>',
  "arrow-down-right": '<path d="M7 7l10 10M17 8v9H8"/>',
  "arrow-down": '<path d="M12 5v14M6 13l6 6 6-6"/>',
  "arrow-up": '<path d="M12 19V5M6 11l6-6 6 6"/>',
  "arrow-left": '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  "arrow-right": '<path d="M5 12h14M13 6l6 6-6 6"/>',
  check: '<path d="M5 12.5 10 17 19 7"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  expand: '<path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/>',
  "zoom-in": '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.4-4.4M11 8v6M8 11h6"/>',
  "zoom-out": '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.4-4.4M8 11h6"/>',
  alert: '<path d="M12 3 2 20h20L12 3zM12 10v4M12 17.5v.01"/>',
  chevron: '<path d="M6 9l6 6 6-6"/>',
  mail: '<path d="M3 5h18v14H3zM3 6l9 7 9-7"/>',
  linkedin: '<path d="M4 9h3.5v11H4zM5.75 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM10 9h3.3v1.6c.5-.9 1.7-1.9 3.5-1.9 3.6 0 4.2 2.3 4.2 5.4V20h-3.5v-5.2c0-1.3 0-2.9-1.8-2.9s-2.1 1.4-2.1 2.8V20H10z" fill="currentColor" stroke="none"/>',
  instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="4"/><path d="M17.2 6.8v.01"/>',
  youtube: '<path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8z"/><path d="M10 15l5-3-5-3z" fill="currentColor" stroke="none"/>',
  logout: '<path d="M9 4H5v16h4M16 8l4 4-4 4M20 12H9"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10"/><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3M12 14.5v2"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z"/>',
  whatsapp: '<path d="M12 3.5a8.5 8.5 0 0 0-7.4 12.7L3.5 20.5l4.4-1.1A8.5 8.5 0 1 0 12 3.5z" stroke-linejoin="round"/><path d="M9.3 7.6c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.2 5 4.4 2.5 1 3 .8 3.5.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.3.1-1.4l-.5-.3-1.9-.9c-.3-.1-.5-.2-.7.1l-.8 1.1c-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.2-1.3-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.4.1-.6l.4-.5.3-.5c.1-.2 0-.3 0-.5l-.9-2.3z" fill="currentColor" stroke="none"/>',
};
export function icon(name, size = 16, cls = "icon") {
  return raw(
    `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`
  );
}
export const iconSprite = ICONS;

/* ---- responsive images ---------------------------------------------- */
const manifest = JSON.parse(readFileSync(path.join(ROOT, "static/img/manifest.json"), "utf8"));

/**
 * <picture> with AVIF + WebP sources. Explicit width/height prevent CLS.
 * @param {string} name   manifest key, e.g. "project-alpha-portrait"
 */
export function picture(name, { alt = "", sizes = "100vw", eager = false, cls = "", imgCls = "" } = {}) {
  const m = manifest[name];
  if (!m) throw new Error(`image not in manifest: ${name}`);
  const set = (ext) => m.widths.map((w) => `${asset(`img/${name}-${w}.${ext}`)} ${w}w`).join(", ");
  const largest = m.widths[m.widths.length - 1];
  const h = Math.round((m.h * largest) / m.w);
  const fallback = m.widths.find((w) => w >= 800) || largest;
  return html`<picture class="${cls}">
    <source type="image/avif" srcset="${set("avif")}" sizes="${sizes}">
    <source type="image/webp" srcset="${set("webp")}" sizes="${sizes}">
    <img class="${imgCls}" src="${asset(`img/${name}-${fallback}.webp`)}" width="${largest}" height="${h}" alt="${alt}" ${raw(
      eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'
    )}>
  </picture>`;
}
export const hasImage = (name) => Boolean(manifest[name]);
export const imageMeta = (name) => manifest[name] || null;
export const staticFile = (rel) => existsSync(path.join(ROOT, "static", rel));
export const imageSrc = (name, w) => asset(`img/${name}-${w}.webp`);

/** Intrinsic { w, h } of an SVG, PNG, JPEG or WebP file (from its header), or {} if unknown. */
export function imageSize(file) {
  const buf = readFileSync(file);
  if (/\.svg$/i.test(file)) {
    const text = buf.toString("utf8");
    const vb = text.match(/viewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
    if (vb) return { w: +vb[1], h: +vb[2] };
    const w = +(text.match(/<svg[^>]*\swidth\s*=\s*["']([\d.]+)/i) || [])[1];
    const h = +(text.match(/<svg[^>]*\sheight\s*=\s*["']([\d.]+)/i) || [])[1];
    return w && h ? { w, h } : {};
  }
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) { // JPEG: walk segments to the first SOFn
    for (let i = 2; i + 9 < buf.length; ) {
      if (buf[i] !== 0xff) { i++; continue; }
      const m = buf[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5) };
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  if (buf.length > 30 && buf.toString("ascii", 8, 12) === "WEBP") {
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8X") return { w: buf.readUIntLE(24, 3) + 1, h: buf.readUIntLE(27, 3) + 1 };
    if (chunk === "VP8 ") return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
    if (chunk === "VP8L") { const b = buf.readUInt32LE(21); return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 }; }
  }
  return {};
}

/** Single-file <img> for a photo under static/img (no responsive variants), with intrinsic size. */
export function photo(rel, { alt = "", cls = "", style = "" } = {}) {
  const { w, h } = imageSize(path.join(ROOT, "static/img", rel));
  return html`<img class="${cls}" src="${asset("img/" + rel)}" ${w ? raw(`width="${w}" height="${h}"`) : ""} alt="${alt}" ${style ? html`style="${style}"` : ""} loading="lazy" decoding="async">`;
}

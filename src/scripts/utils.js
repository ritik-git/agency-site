// Shared helpers — tiny, dependency-free.
const rmq = window.matchMedia("(prefers-reduced-motion: reduce)");
export const reducedMotion = () => rmq.matches;
export const finePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/** Run `cb(el)` once when `el` crosses `threshold` of the viewport. */
export function once(els, cb, { threshold = 0, rootMargin = "0px 0px -15% 0px" } = {}) {
  const list = [].concat(els).filter(Boolean);
  if (!("IntersectionObserver" in window)) return list.forEach(cb);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { io.unobserve(e.target); cb(e.target); }
    });
  }, { threshold, rootMargin });
  list.forEach((el) => io.observe(el));
}

/** Focus trap for dialogs; returns a release function. */
export function trapFocus(container) {
  const sel = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
  const onKey = (e) => {
    if (e.key !== "Tab") return;
    const f = $$(sel, container).filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  document.addEventListener("keydown", onKey);
  return () => document.removeEventListener("keydown", onKey);
}

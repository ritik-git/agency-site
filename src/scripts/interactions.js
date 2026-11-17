// Project video hover (M10), count-up (M11),
// process progress (C8/M12), marquee visibility pause (M8).
import { $, $$, once, reducedMotion, finePointer } from "./utils.js";

/* ---- Work: muted video on hover/focus (only if a project has one) ---- */
export function initProjectVideos() {
  const saveData = navigator.connection?.saveData;
  $$(".project-card").forEach((card) => {
    const v = $("video[data-src]", card);
    if (!v || saveData || !finePointer() || reducedMotion()) return;
    const play = () => { if (!v.src) v.src = v.dataset.src; v.play().then(() => card.classList.add("is-playing")).catch(() => {}); };
    const stop = () => { v.pause(); card.classList.remove("is-playing"); };
    card.addEventListener("pointerenter", play);
    card.addEventListener("pointerleave", stop);
    card.addEventListener("focusin", play);
    card.addEventListener("focusout", stop);
  });
}

/* ---- Stats: count-up once at 50% visibility -------------------------- */
export function initCountUp() {
  const els = $$("[data-count]");
  if (!els.length || reducedMotion()) return;
  els.forEach((el) => {
    const num = $(".stat__num", el);
    const target = parseFloat(el.dataset.count);
    const decimals = (el.dataset.count.split(".")[1] || "").length;
    num.textContent = (0).toFixed(decimals);
    once(el, () => {
      const t0 = performance.now(), D = 1200;
      const tick = (t) => {
        const k = Math.min(1, (t - t0) / D);
        const e = 1 - Math.pow(1 - k, 3);
        num.textContent = (target * e).toFixed(decimals);
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5, rootMargin: "0px" });
  });
}

/* ---- Process: scroll-linked progress line ---------------------------- */
export function initProcess() {
  const track = $("[data-process]");
  if (!track) return;
  const fill = $("[data-process-fill]", track);
  const steps = $$("[data-step]", track);
  const setP = (p) => {
    fill.style.setProperty("--p", p.toFixed(4));
    const horizontal = window.innerWidth >= 1024;
    const tr = track.getBoundingClientRect();
    steps.forEach((s) => {
      const r = s.getBoundingClientRect();
      const frac = horizontal ? (r.left - tr.left) / tr.width : (r.top - tr.top) / tr.height;
      s.classList.toggle("is-active", p > frac + 0.01 || p >= 0.999);
    });
  };
  if (reducedMotion()) return setP(1);
  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = window.innerHeight;
    const r = track.getBoundingClientRect();
    let p;
    if (window.innerWidth >= 1024) p = (vh * 0.7 - r.top) / (vh * 0.4); // top edge travels 70% → 30% of viewport
    else p = (vh * 0.6 - r.top) / r.height;                           // vertical timeline follows the reader
    setP(Math.max(0, Math.min(1, p)));
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) window.addEventListener("scroll", onScroll, { passive: true });
      else window.removeEventListener("scroll", onScroll);
      update();
    }).observe(track);
  } else setP(1);
  window.addEventListener("resize", onScroll, { passive: true });
}

/* ---- Action bar: get out of the way of the contact form and keyboards --- */
export function initActionBar() {
  const bar = $("[data-action-bar]");
  if (!bar) return;
  const reasons = new Set();
  const set = (why, on) => { on ? reasons.add(why) : reasons.delete(why); bar.classList.toggle("is-hidden", reasons.size > 0); };

  // The form itself is the destination of "Contact us" — and the bar would cover its submit button.
  const form = $("[data-contact-form]")?.closest(".contact__form-wrap") || $("[data-contact-form]");
  if (form && "IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => set("form", e.isIntersecting), { rootMargin: "0px 0px -15% 0px" }).observe(form);
  }
  // On-screen keyboards push fixed elements up over the field being typed in.
  const isField = (el) => el && el.matches && el.matches("input, textarea, select") && !bar.contains(el);
  document.addEventListener("focusin", (e) => set("typing", isField(e.target)));
  document.addEventListener("focusout", () => setTimeout(() => set("typing", isField(document.activeElement)), 0));

  // Rotating headline: a new conversational line every few seconds. Paused while hovered,
  // while the bar is hidden and while the tab is in the background. Off for reduced motion.
  const phrases = $$("[data-phrase]", bar);
  if (phrases.length < 2 || reducedMotion()) return;
  let i = 0, hovered = false;
  bar.addEventListener("pointerenter", () => (hovered = true));
  bar.addEventListener("pointerleave", () => (hovered = false));
  setInterval(() => {
    if (hovered || document.hidden || reasons.size) return;
    const cur = phrases[i];
    i = (i + 1) % phrases.length;
    cur.classList.remove("is-active");
    cur.classList.add("is-leaving");
    phrases[i].classList.add("is-active");
    setTimeout(() => cur.classList.remove("is-leaving"), 650);
  }, 4200);
}

/* ---- Marquee: pause when off-screen ---------------------------------- */
export function initMarquee() {
  const list = $$("[data-marquee]");
  if (!list.length || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((entries) => entries.forEach((e) => e.target.classList.toggle("is-paused", !e.isIntersecting)));
  list.forEach((m) => io.observe(m));
}

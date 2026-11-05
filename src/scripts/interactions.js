// Services cursor preview (C4/M9), project video hover (M10), count-up (M11),
// process progress (C8/M12), marquee visibility pause (M8).
import { $, $$, once, reducedMotion, finePointer } from "./utils.js";

/* ---- Services: cursor-following 9:16 preview ------------------------- */
export function initServicePreview() {
  const list = $("[data-service-list]");
  const box = $("[data-service-preview]");
  if (!list || !box) return;
  const img = $("img", box);
  const enabled = () => finePointer() && !reducedMotion() && window.innerWidth >= 1100;
  let tx = 0, ty = 0, x = 0, y = 0, raf = 0, active = false;
  const H = 427;
  const loop = () => {
    x += (tx - x) * 0.15;
    y += (ty - y) * 0.15;
    box.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    raf = active || Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(loop) : 0;
  };
  const place = (e, snap) => {
    // keep the preview inside the viewport
    tx = Math.min(e.clientX + 24, window.innerWidth - 240 - 16);
    ty = Math.max(16, Math.min(e.clientY - H / 2, window.innerHeight - H - 16));
    if (snap) { x = tx; y = ty; }
    if (!raf) raf = requestAnimationFrame(loop);
  };
  let px = 0, py = 0;
  const show = (row, e, snap) => {
    const src = row.dataset.preview;
    if (img.getAttribute("src") !== src) img.src = src; // lazy: loaded only on hover intent
    active = true;
    place(e, snap);
    box.classList.add("is-visible");
  };
  const hide = () => { active = false; box.classList.remove("is-visible"); };
  $$(".service-row", list).forEach((row) => {
    row.addEventListener("pointerenter", (e) => { if (enabled() && e.pointerType === "mouse") show(row, e, !active); });
  });
  list.addEventListener("pointermove", (e) => { px = e.clientX; py = e.clientY; if (active) place(e); });
  list.addEventListener("pointerleave", hide);
  // While wheel-scrolling, the list moves under a still pointer: re-check which row is beneath it
  window.addEventListener("scroll", () => {
    if (!active) return;
    const row = document.elementFromPoint(px, py)?.closest(".service-row");
    row && list.contains(row) ? show(row, { clientX: px, clientY: py }) : hide();
  }, { passive: true });
}

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

/* ---- Marquee: pause when off-screen ---------------------------------- */
export function initMarquee() {
  const m = $("[data-marquee]");
  if (!m || !("IntersectionObserver" in window)) return;
  new IntersectionObserver(([e]) => m.classList.toggle("is-paused", !e.isIntersecting)).observe(m);
}

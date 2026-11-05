// Testimonials carousel (M13): buttons, arrow keys, swipe. No autoplay (WCAG 2.2.2).
import { $, $$, reducedMotion } from "./utils.js";

export function initCarousel() {
  const region = $("[data-carousel]");
  if (!region) return;
  const section = region.closest("section");
  const slides = $$("[data-slide]", region);
  const current = $("[data-current]", section);
  let i = 0;
  let busy = false;

  function go(next, dir) {
    if (busy || next === i) return;
    next = (next + slides.length) % slides.length;
    const from = slides[i], to = slides[next];
    const swap = () => {
      from.hidden = true;
      from.classList.remove("is-leaving");
      to.hidden = false;
      to.classList.remove("from-left");
      if (dir < 0) to.classList.add("from-left");
      to.classList.add("is-entering");
      to.addEventListener("animationend", () => to.classList.remove("is-entering", "from-left"), { once: true });
      i = next;
      current.textContent = String(i + 1).padStart(2, "0");
      busy = false;
    };
    busy = true;
    if (reducedMotion()) return swap();
    from.classList.add("is-leaving");
    from.addEventListener("animationend", swap, { once: true });
  }

  $("[data-prev]", section).addEventListener("click", () => go(i - 1, -1));
  $("[data-next]", section).addEventListener("click", () => go(i + 1, 1));
  region.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1, -1); }
    if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1, 1); }
  });
  let sx = null, sy = null;
  region.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") { sx = e.clientX; sy = e.clientY; } });
  region.addEventListener("pointerup", (e) => {
    if (sx == null) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(i + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    sx = sy = null;
  });
}

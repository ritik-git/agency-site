// Scroll reveals (M5, M6, M7) — fire once, transform/opacity only.
import { $$, once } from "./utils.js";

export function initReveals() {
  // Line-mask headings: index each line for the stagger
  $$("[data-line-reveal]").forEach((h) => $$(".line__inner", h).forEach((l, i) => l.style.setProperty("--li", i)));
  const immediate = $$("[data-line-reveal][data-immediate]");
  const fire = () => immediate.forEach((h) => h.classList.add("is-in"));
  // Wait for the display font (max 300 ms) so lines don't reflow mid-animation
  Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 300))]).then(() => requestAnimationFrame(fire));
  once($$("[data-line-reveal]:not([data-immediate])"), (el) => el.classList.add("is-in"), { rootMargin: "0px 0px -20% 0px" });

  // Generic reveals; siblings revealed together get a short stagger (max 6)
  const groups = new Map();
  $$("[data-reveal]").forEach((el) => {
    const p = el.parentElement;
    const i = groups.get(p) ?? 0;
    groups.set(p, i + 1);
    el.style.setProperty("--d", `${Math.min(i, 5) * 60}ms`);
  });
  once($$("[data-reveal]"), (el) => el.classList.add("is-in"));

  // Section seams draw in
  once($$(".section"), (el) => el.classList.add("is-seen"), { rootMargin: "0px 0px -15% 0px" });
}

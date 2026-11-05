// Hero: entrance (M1/M2), pointer tilt (M4), orbit pause off-screen (M3, §14.4).
import { $, reducedMotion, finePointer } from "./utils.js";

export function initHero() {
  const hero = $("[data-hero]");
  if (!hero) return;

  const go = () => hero.classList.add("is-loaded");
  Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 300))]).then(() => requestAnimationFrame(go));

  // Only one looping animation at a time: pause the orbit when < 40% of the hero is visible or the tab is hidden
  let visible = true;
  const sync = () => hero.classList.toggle("is-paused", !visible || document.hidden);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => { visible = e.intersectionRatio >= 0.4; sync(); }, { threshold: [0, 0.4, 1] }).observe(hero);
  }
  document.addEventListener("visibilitychange", sync);

  // Pointer tilt — ±6°, lerp 0.08, rAF only while moving
  const stage = $("[data-tilt]", hero);
  const area = $("[data-hero-visual]", hero);
  if (!stage || reducedMotion() || !finePointer()) return;
  const MAX = 6;
  let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
  const loop = () => {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    stage.style.transform = `rotateX(${cy.toFixed(3)}deg) rotateY(${cx.toFixed(3)}deg)`;
    raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.01 ? requestAnimationFrame(loop) : 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
  hero.addEventListener("pointermove", (e) => {
    const r = area.getBoundingClientRect();
    const nx = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2);
    const ny = (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2);
    tx = Math.max(-1, Math.min(1, nx)) * MAX;
    ty = Math.max(-1, Math.min(1, -ny)) * MAX;
    kick();
  });
  hero.addEventListener("pointerleave", () => { tx = 0; ty = 0; kick(); });
}

// Header: scrolled border, hide-on-scroll (M15), active section, mobile menu (M16).
import { $, $$, reducedMotion } from "./utils.js";

export function initHeader() {
  const header = $("[data-header]");
  if (!header) return;
  const hero = $("[data-hero]");
  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 24);
    const threshold = (hero ? hero.offsetHeight : 0) + 120;
    const menuOpen = document.documentElement.classList.contains("menu-open");
    const focusInside = header.contains(document.activeElement);
    if (!reducedMotion() && !menuOpen && !focusInside && y > threshold && y > lastY + 4) header.classList.add("is-hidden");
    else if (y < lastY - 4 || y <= threshold) header.classList.remove("is-hidden");
    lastY = y;
    ticking = false;
  };
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  header.addEventListener("focusin", () => header.classList.remove("is-hidden"));
  update();

  // Active section indicator (only for in-page anchors)
  const links = $$("[data-nav-link]").filter((a) => a.getAttribute("href").startsWith("#"));
  const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const sections = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  if (sections.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.removeAttribute("aria-current"));
        byId.get(e.target.id)?.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-50% 0px -50% 0px" });
    sections.forEach((s) => io.observe(s));
  }
}

export function initMobileMenu() {
  const toggle = $("[data-menu-toggle]");
  const menu = $("[data-mobile-menu]");
  if (!toggle || !menu) return;
  const label = $("[data-menu-label]", toggle);
  const root = document.documentElement;
  const focusables = () => [toggle, ...$$("a[href], button", menu)].filter((el) => el.offsetParent !== null || el === toggle);
  let open = false;

  const onKey = (e) => {
    if (e.key === "Escape") { close(); toggle.focus(); return; }
    if (e.key !== "Tab") return;
    // Explicit cycle: toggle → menu links → CTA → toggle (toggle sits in the header, outside the menu in DOM order)
    e.preventDefault();
    const f = focusables();
    const i = f.indexOf(document.activeElement);
    f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
  };

  function openMenu() {
    open = true;
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add("is-open"));
    root.classList.add("menu-open");
    document.body.classList.add("is-locked");
    toggle.setAttribute("aria-expanded", "true");
    label.textContent = "Close menu";
    document.addEventListener("keydown", onKey);
    $("a", menu)?.focus({ preventScroll: true });
  }
  function close() {
    if (!open) return;
    open = false;
    menu.classList.remove("is-open");
    root.classList.remove("menu-open");
    document.body.classList.remove("is-locked");
    toggle.setAttribute("aria-expanded", "false");
    label.textContent = "Open menu";
    document.removeEventListener("keydown", onKey);
    setTimeout(() => { if (!open) menu.hidden = true; }, reducedMotion() ? 0 : 220);
  }
  toggle.addEventListener("click", () => (open ? close() : openMenu()));
  $$("[data-menu-link]", menu).forEach((a) => a.addEventListener("click", close));
  // Close if the viewport grows into the desktop layout while open
  window.matchMedia("(min-width: 1024px)").addEventListener("change", (e) => e.matches && close());
}

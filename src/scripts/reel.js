// Ad reel (Work section): poster-first cards, ONE shared <video>.
//
// Loading strategy
//  - The HTML ships only posters (<picture>, lazy, 9:16 box → no layout shift). No <video> tags, so
//    nothing video-related is requested on page load.
//  - A single <video preload="none"> is created on first interaction and moved into whichever card is
//    active, so at most one video decodes/plays at a time.
//  - Desktop hover (fine pointer, no reduced-motion, no Save-Data): muted preview after a short intent delay.
//  - Touch screens: the first card plays muted on its own while mostly in view (tap for sound).
//  - Click / tap / Enter: plays inline with sound and native controls.
//  - Leaving the card (hover preview), scrolling it out of view, hiding the tab or the clip ending all
//    unload the video (pause + drop src + load()) so its buffer and decoder are released.
import { $, $$, reducedMotion, finePointer } from "./utils.js";

export function initReel() {
  const root = $("[data-reel]");
  if (!root) return;
  const track = $("[data-reel-track]", root);
  const cards = $$(".reel-card", root);

  // Poster fade-in + failure state (the card's own background is the skeleton).
  cards.forEach((card) => {
    const img = $(".reel-card__poster", card);
    if (!img) return;
    const ok = () => img.classList.add("is-loaded");
    const fail = () => { img.classList.add("is-loaded"); card.classList.add("is-broken"); };
    if (img.complete) (img.naturalWidth ? ok() : fail());
    else { img.addEventListener("load", ok, { once: true }); img.addEventListener("error", fail, { once: true }); }
  });

  let video = null;
  let active = null;   // card currently holding the video
  let mode = null;     // "preview" | "watch"

  function getVideo() {
    if (video) return video;
    video = document.createElement("video");
    video.preload = "none";
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.disablePictureInPicture = true;
    video.addEventListener("playing", () => active?.classList.remove("is-loading"));
    video.addEventListener("ended", () => { if (mode === "watch") unmount(true); });
    video.addEventListener("error", () => { if (active) unmount(); });
    return video;
  }

  function unmount(restoreFocus = false) {
    if (!active) return;
    const card = active;
    video.pause();
    video.removeAttribute("src");
    video.load(); // releases the network request and decoder
    video.remove();
    card.classList.remove("is-playing", "is-previewing", "is-watching", "is-loading");
    active = mode = null;
    if (restoreFocus) $(".reel-card__btn", card)?.focus({ preventScroll: true });
  }

  function mount(card, nextMode) {
    if (nextMode === "preview" && active === card) return; // never downgrade a card being watched
    const v = getVideo();
    if (active !== card) {
      unmount();
      active = card;
      const poster = $(".reel-card__poster", card);
      v.poster = poster?.currentSrc || poster?.src || "";
      v.src = card.dataset.video;
      card.prepend(v);
      card.classList.add("is-loading", "is-playing");
    }
    mode = nextMode;
    const watch = nextMode === "watch";
    v.muted = !watch;
    v.defaultMuted = !watch; // iOS Safari only autoplays inline when the muted attribute is present
    if (watch) v.removeAttribute("muted"); else v.setAttribute("muted", "");
    v.loop = !watch;
    v.controls = watch;
    card.classList.toggle("is-previewing", !watch);
    card.classList.toggle("is-watching", watch);
    const p = v.play();
    if (p) p.catch(() => {
      // Autoplay with sound refused (rare after a click) → retry muted with controls so the user can unmute.
      if (watch && active === card && !v.muted) { v.muted = true; v.play().catch(() => unmount()); }
      else if (active === card) unmount();
    });
  }

  // Desktop hover preview (skipped for touch, reduced motion and Save-Data).
  const canPreview = finePointer() && !reducedMotion() && !navigator.connection?.saveData;
  let timer = 0;
  if (canPreview) {
    cards.forEach((card) => {
      card.addEventListener("pointerenter", () => {
        clearTimeout(timer);
        if (active === card) return;
        timer = setTimeout(() => mount(card, "preview"), 140);
      });
      card.addEventListener("pointerleave", () => {
        clearTimeout(timer);
        if (active === card && mode === "preview") unmount();
      });
    });
  }

  // Click / tap / keyboard → watch with sound.
  root.addEventListener("click", (e) => {
    const btn = e.target.closest(".reel-card__btn");
    if (!btn) return;
    clearTimeout(timer);
    mount(btn.closest(".reel-card"), "watch");
  });
  root.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && active) { e.preventDefault(); unmount(true); }
  });

  // Unload when the active card scrolls out of view (vertical page scroll or the horizontal strip).
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.target === active && en.intersectionRatio < 0.3) unmount(); });
    }, { threshold: [0, 0.3] });
    cards.forEach((c) => io.observe(c));
  }
  document.addEventListener("visibilitychange", () => { if (document.hidden) unmount(); });

  // Touch screens (no hover): the FIRST ad plays muted on its own while it is mostly in view, so the
  // strip feels alive on phones. Tap any card for sound. Off for reduced motion and Save-Data.
  if (!canPreview && !reducedMotion() && !navigator.connection?.saveData && "IntersectionObserver" in window && cards[0]) {
    const first = cards[0];
    new IntersectionObserver(([en]) => {
      if (en.intersectionRatio >= 0.6 && !active && !document.hidden) mount(first, "preview");
    }, { threshold: [0, 0.6] }).observe(first);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden || active) return;
      const r = first.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0 && r.left < innerWidth && r.right > 0) mount(first, "preview");
    });
  }

  // Prev / next for mouse users (touch users swipe; the strip is native overflow scrolling).
  const prev = $("[data-reel-prev]", root), next = $("[data-reel-next]", root);
  const step = (dir) => track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: reducedMotion() ? "auto" : "smooth" });
  prev?.addEventListener("click", () => step(-1));
  next?.addEventListener("click", () => step(1));
  let raf = 0;
  const sync = () => {
    raf = 0;
    const max = track.scrollWidth - track.clientWidth - 2;
    if (prev) prev.disabled = track.scrollLeft <= 2;
    if (next) next.disabled = track.scrollLeft >= max;
  };
  track.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(sync); }, { passive: true });
  window.addEventListener("resize", () => { if (!raf) raf = requestAnimationFrame(sync); }, { passive: true });
  sync();
}

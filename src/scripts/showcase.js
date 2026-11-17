// Campaign Showcase: centred-slide carousel (auto-advances every 5s, with pause rules) + full-screen screenshot viewer.
//
// Carousel: slides sit in a flex track that is moved with translate3d (GPU, no layout work per frame).
//   Navigation: arrows, pagination segments, ←/→ when focused, mouse drag, touch swipe.
//   The viewport uses `touch-action: pan-y`, so vertical page scrolling is never captured; a drag only
//   starts once the gesture is clearly horizontal.
// Viewer: native <dialog> (focus containment, Esc, inert page). Shows the already-loaded carousel image
//   instantly, then swaps in the full-resolution original — originals are fetched ONLY here, once each.
import { $, $$, reducedMotion } from "./utils.js";

const pad = (n) => String(n).padStart(2, "0");

export function initShowcase() {
  const root = $("[data-showcase]");
  if (!root) return;
  const viewport = $("[data-showcase-viewport]", root);
  const track = $("[data-showcase-track]", root);
  const slides = $$(".showcase__slide", track);
  const dots = $$("[data-showcase-dot]", root);
  const prevBtn = $("[data-showcase-prev]", root);
  const nextBtn = $("[data-showcase-next]", root);
  const current = $("[data-showcase-current]", root);
  const n = slides.length;
  if (!n) return;

  // Screenshot fade-in once decoded; a failed image shows a quiet fallback instead of a broken icon.
  slides.forEach((s) => {
    const img = $(".showcase__img", s);
    if (!img) return;
    const ok = () => img.classList.add("is-loaded");
    const fail = () => { img.classList.add("is-loaded"); img.closest(".showcase__frame")?.classList.add("is-broken"); };
    if (img.complete) (img.naturalWidth ? ok() : fail());
    else { img.addEventListener("load", ok, { once: true }); img.addEventListener("error", fail, { once: true }); }
  });

  root.classList.add("is-ready"); // switches CSS from the no-JS scroll strip to the transform carousel
  let i = 0;
  let centers = [];

  const measure = () => { centers = slides.map((s) => s.offsetLeft + s.offsetWidth / 2); };
  const position = (dx = 0) => {
    const x = viewport.clientWidth / 2 - centers[i] + dx;
    track.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
  };

  function go(next, { focus = false, auto = false } = {}) {
    i = Math.max(0, Math.min(n - 1, next));
    if (!auto) autoplay?.reset(); // any manual move restarts the full interval
    slides.forEach((s, k) => {
      const on = k === i;
      s.classList.toggle("is-active", on);
      s.classList.toggle("is-near", Math.abs(k - i) === 1);
      const link = $("[data-open-viewer]", s);
      if (link) link.tabIndex = on ? 0 : -1; // Tab lands on the featured screenshot only
    });
    dots.forEach((d, k) => {
      d.classList.toggle("is-active", k === i);
      d.classList.toggle("is-past", k < i);
      if (k === i) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
    });
    if (current) current.textContent = pad(i + 1);
    if (prevBtn) prevBtn.disabled = i === 0;
    if (nextBtn) nextBtn.disabled = i === n - 1;
    position();
    if (focus) $("[data-open-viewer]", slides[i])?.focus({ preventScroll: true });
  }

  // ---- Autoplay -------------------------------------------------------------------------------
  // Advances every DELAY ms and loops back to the first slide. Holds (pauses, keeping the remaining
  // time) while: hovered with a mouse, keyboard focus is inside, being dragged, scrolled out of view,
  // the tab is hidden, or the viewer is open. The pause button stops it outright. Visitors who ask for
  // reduced motion start with it stopped (the button can start it).
  const DELAY = 5000;
  const toggle = $("[data-showcase-toggle]", root);
  let autoplay = null;
  {
    const holds = new Set();
    let stopped = reducedMotion();
    let tId = 0, startedAt = 0, remaining = DELAY;
    root.style.setProperty("--autoplay-ms", `${DELAY}ms`);
    const sync = () => {
      root.classList.toggle("is-autoplay", !stopped);
      root.classList.toggle("is-paused", stopped || holds.size > 0);
      if (toggle) {
        toggle.setAttribute("aria-pressed", String(stopped));
        toggle.setAttribute("aria-label", stopped ? "Play slideshow" : "Pause slideshow");
      }
    };
    const restartFill = () => { // restart the timer bar on the active segment
      root.classList.remove("is-autoplay");
      void root.offsetWidth;
      root.classList.toggle("is-autoplay", !stopped);
    };
    const run = () => {
      clearTimeout(tId); tId = 0;
      if (stopped || holds.size) return;
      startedAt = performance.now();
      tId = setTimeout(() => {
        remaining = DELAY;
        go(i === n - 1 ? 0 : i + 1, { auto: true });
        restartFill();
        run();
      }, remaining);
    };
    const hold = (why) => {
      if (holds.has(why)) return;
      if (tId) { clearTimeout(tId); tId = 0; remaining = Math.max(300, remaining - (performance.now() - startedAt)); }
      holds.add(why); sync();
    };
    const release = (why) => { if (holds.delete(why)) { sync(); run(); } };
    autoplay = {
      hold, release,
      reset() { remaining = DELAY; restartFill(); run(); },
      setStopped(v) { stopped = v; remaining = DELAY; sync(); restartFill(); run(); },
      get stopped() { return stopped; },
    };

    toggle?.addEventListener("click", () => autoplay.setStopped(!stopped));
    root.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") hold("hover"); });
    root.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") release("hover"); });
    root.addEventListener("focusin", (e) => { if (e.target.matches(":focus-visible")) hold("focus"); });
    root.addEventListener("focusout", (e) => { if (!root.contains(e.relatedTarget)) release("focus"); });
    document.addEventListener("visibilitychange", () => (document.hidden ? hold("hidden") : release("hidden")));
    if ("IntersectionObserver" in window) {
      hold("offscreen"); // assume off-screen until the observer confirms otherwise
      new IntersectionObserver(([en]) => (en.isIntersecting ? release("offscreen") : hold("offscreen")), { threshold: 0.4 }).observe(viewport);
    }
    sync();
  }

  // Re-measure on size changes without animating the jump.
  const relayout = () => {
    root.classList.add("is-resizing");
    measure(); position();
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("is-resizing")));
  };
  if ("ResizeObserver" in window) new ResizeObserver(relayout).observe(viewport);
  else window.addEventListener("resize", relayout, { passive: true });
  measure();
  root.classList.add("is-resizing");
  go(0);
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("is-resizing")));

  prevBtn?.addEventListener("click", () => go(i - 1));
  nextBtn?.addEventListener("click", () => go(i + 1));
  dots.forEach((d) => d.addEventListener("click", () => go(+d.dataset.showcaseDot)));
  root.addEventListener("keydown", (e) => {
    if (e.target.closest("[data-viewer]")) return;
    if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1, { focus: e.target !== root }); }
    if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1, { focus: e.target !== root }); }
  });

  // Drag / swipe. Horizontal intent only; vertical gestures stay native page scrolling.
  let sx = 0, sy = 0, dx = 0, t0 = 0, pid = null, dragging = false, suppressClick = false;
  viewport.addEventListener("dragstart", (e) => e.preventDefault());
  viewport.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    pid = e.pointerId; sx = e.clientX; sy = e.clientY; dx = 0; t0 = performance.now(); dragging = false;
    autoplay.hold("drag");
  });
  viewport.addEventListener("pointermove", (e) => {
    if (e.pointerId !== pid) return;
    const mx = e.clientX - sx, my = e.clientY - sy;
    if (!dragging) {
      if (Math.abs(my) > 10 && Math.abs(my) > Math.abs(mx)) { pid = null; return; } // vertical → let the page scroll
      if (Math.abs(mx) < 8) return;
      dragging = true;
      try { viewport.setPointerCapture(pid); } catch { /* pointer already released */ }
      root.classList.add("is-dragging");
    }
    const edge = (i === 0 && mx > 0) || (i === n - 1 && mx < 0);
    dx = edge ? mx * 0.3 : mx; // resistance past the first/last slide
    position(dx);
  });
  const end = (e) => {
    if (e.pointerId !== pid) return;
    pid = null;
    if (!dragging) return;
    dragging = false;
    root.classList.remove("is-dragging");
    suppressClick = true;
    setTimeout(() => { suppressClick = false; }, 0);
    const fast = Math.abs(dx) / Math.max(1, performance.now() - t0) > 0.5;
    const far = Math.abs(dx) > viewport.clientWidth * 0.12;
    if ((fast || far) && Math.abs(dx) > 24) go(i + (dx < 0 ? 1 : -1)); else position();
  };
  viewport.addEventListener("pointerup", end);
  viewport.addEventListener("pointercancel", end);
  // Release the drag hold wherever the pointer is let go (it may leave the carousel mid-gesture).
  const releaseDrag = () => autoplay.release("drag");
  window.addEventListener("pointerup", releaseDrag);
  window.addEventListener("pointercancel", releaseDrag);

  // Clicking a side slide brings it to the centre; clicking the featured one opens the viewer.
  track.addEventListener("click", (e) => {
    const link = e.target.closest("[data-open-viewer]");
    if (!link) return;
    e.preventDefault();
    if (suppressClick) return;
    const k = +link.closest(".showcase__slide").dataset.slideIndex;
    if (k !== i) go(k); else viewer.open(k);
  });

  const viewer = initViewer(slides, (k) => go(k));
  // Hold autoplay while the full-screen viewer is open.
  const dlg = $("[data-viewer]");
  const open = viewer.open;
  viewer.open = (k) => { autoplay.hold("viewer"); open(k); };
  dlg?.addEventListener("close", () => autoplay.release("viewer"));
}

function initViewer(slides, onChange) {
  const dlg = $("[data-viewer]");
  const noop = { open: (k) => { location.href = slides[k].dataset.original; } };
  if (!dlg || typeof dlg.showModal !== "function") return noop;
  const img = $("[data-viewer-img]", dlg);
  const canvas = $("[data-viewer-canvas]", dlg);
  const title = $("[data-viewer-title]", dlg);
  const sub = $("[data-viewer-sub]", dlg);
  const count = $("[data-viewer-count]", dlg);
  const zoomBtn = $("[data-viewer-zoom]", dlg);
  const prev = $("[data-viewer-prev]", dlg);
  const next = $("[data-viewer-next]", dlg);
  const n = slides.length;
  let k = 0, lastFocus = null, token = 0;

  function setZoom(on, at) {
    const was = canvas.classList.contains("is-zoomed");
    if (on === was) return;
    // Keep the clicked point under the cursor when zooming in.
    const r = img.getBoundingClientRect();
    const fx = at ? (at.clientX - r.left) / r.width : 0.5;
    const fy = at ? (at.clientY - r.top) / r.height : 0.5;
    canvas.classList.toggle("is-zoomed", on);
    zoomBtn.setAttribute("aria-pressed", String(on));
    zoomBtn.setAttribute("aria-label", on ? "Zoom out" : "Zoom in");
    if (on) {
      canvas.scrollLeft = img.offsetWidth * fx - canvas.clientWidth / 2;
      canvas.scrollTop = img.offsetHeight * fy - canvas.clientHeight / 2;
    }
  }

  function show(idx) {
    k = Math.max(0, Math.min(n - 1, idx));
    const s = slides[k];
    const thumb = $("img", s);
    setZoom(false);
    img.width = +s.dataset.ow; img.height = +s.dataset.oh;
    img.alt = thumb?.alt || "";
    img.src = thumb?.currentSrc || thumb?.src || ""; // instant: already decoded in the carousel
    canvas.classList.add("is-loading");
    const t = ++token;
    const hi = new Image();
    hi.decoding = "async";
    hi.src = s.dataset.original;
    (hi.decode ? hi.decode() : Promise.resolve()).then(() => {
      if (t !== token) return;
      img.src = hi.src;
      canvas.classList.remove("is-loading");
    }).catch(() => { if (t === token) canvas.classList.remove("is-loading"); }); // keep the thumbnail on failure
    title.textContent = s.dataset.title || "";
    sub.textContent = s.dataset.sub || "";
    count.textContent = `${pad(k + 1)} / ${pad(n)}`;
    prev.disabled = k === 0;
    next.disabled = k === n - 1;
    onChange(k);
  }

  function open(idx) {
    lastFocus = document.activeElement;
    show(idx);
    dlg.showModal();
    document.body.classList.add("is-locked");
    $("[data-viewer-close]", dlg).focus();
  }
  function close() { if (dlg.open) dlg.close(); }

  dlg.addEventListener("close", () => {
    document.body.classList.remove("is-locked");
    setZoom(false);
    token++;
    img.removeAttribute("src");
    // Return focus to the featured slide (it may have changed while browsing in the viewer).
    const target = $("[data-open-viewer]", slides[k]) || lastFocus;
    target?.focus({ preventScroll: true });
  });

  $("[data-viewer-close]", dlg).addEventListener("click", close);
  prev.addEventListener("click", () => show(k - 1));
  next.addEventListener("click", () => show(k + 1));
  zoomBtn.addEventListener("click", () => setZoom(!canvas.classList.contains("is-zoomed")));
  dlg.addEventListener("keydown", (e) => {
    if (canvas.classList.contains("is-zoomed")) return; // arrows pan the zoomed image
    if (e.key === "ArrowLeft") { e.preventDefault(); show(k - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); show(k + 1); }
  });

  // Click the image to zoom; click the empty backdrop to close. Swipe to change screenshot.
  let sx = 0, sy = 0, moved = false;
  canvas.addEventListener("pointerdown", (e) => { sx = e.clientX; sy = e.clientY; moved = false; });
  canvas.addEventListener("pointermove", (e) => { if (Math.abs(e.clientX - sx) + Math.abs(e.clientY - sy) > 8) moved = true; });
  canvas.addEventListener("pointerup", (e) => {
    if (canvas.classList.contains("is-zoomed") || e.pointerType === "mouse") return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) show(k + (dx < 0 ? 1 : -1));
  });
  canvas.addEventListener("click", (e) => {
    if (moved) return;
    if (e.target === img) setZoom(!canvas.classList.contains("is-zoomed"), e);
    else close();
  });
  dlg.addEventListener("click", (e) => { if (e.target === dlg) close(); });

  return { open };
}

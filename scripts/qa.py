"""Browser QA: screenshots, console errors, horizontal overflow, hero collision check.
usage: python3 scripts/qa.py <out_dir> [widths...]   (dev server must be running on :8787)"""
import sys, json, os
from playwright.sync_api import sync_playwright

BASE = os.environ.get("QA_BASE", "http://localhost:8787")
OUT = sys.argv[1]
WIDTHS = [int(w) for w in sys.argv[2:]] or [320, 375, 414, 768, 1024, 1280, 1440, 1920, 2560]
PAGES = ["/", "/work/project-alpha/", "/privacy/", "/does-not-exist", "/admin/"]
os.makedirs(OUT, exist_ok=True)

CHECK = """() => {
  const doc = document.documentElement;
  const over = doc.scrollWidth - doc.clientWidth;
  const wide = [...document.querySelectorAll('body *')].filter(e => {
    const r = e.getBoundingClientRect(); if (!r.width) return false;
    const st = getComputedStyle(e);
    if (e.closest('svg') || e.closest('.logo-marquee,.site-footer__wordmark, .admin-table-wrap, .hp, .visually-hidden, .skip-link, .service-preview, .hero__bg, .hero-visual__glow')) return false;
    return r.right > doc.clientWidth + 1 || r.left < -1;
  }).slice(0, 5).map(e => e.className || e.tagName);
  // hero collisions: orbit labels vs format frames vs each other vs orb circle
  const boxes = [...document.querySelectorAll('.orbit-label, .format-frame, .format-frame span')].filter(e => e.offsetParent).map(e => ({n: e.className || 'frame-label:' + e.textContent, r: e.getBoundingClientRect(), el: e}));
  const hits = [];
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    const a = boxes[i], b = boxes[j];
    if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
    if (a.r.left < b.r.right && b.r.left < a.r.right && a.r.top < b.r.bottom && b.r.top < a.r.bottom) hits.push(a.n + ' x ' + b.n);
  }
  const orb = document.querySelector('.hero-orb');
  if (orb && orb.offsetParent) {
    const o = orb.getBoundingClientRect(), cx = o.left + o.width/2, cy = o.top + o.height/2, R = o.width/2;
    document.querySelectorAll('.orbit-label').forEach(l => { if (!l.offsetParent) return; const r = l.getBoundingClientRect();
      const nx = Math.max(r.left, Math.min(cx, r.right)), ny = Math.max(r.top, Math.min(cy, r.bottom));
      if (Math.hypot(nx - cx, ny - cy) < R) hits.push('orb x ' + l.textContent); });
  }
  return { over, wide, hits, h: doc.scrollHeight };
}"""

report = {}
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
    for w in WIDTHS:
        ctx = b.new_context(viewport={"width": w, "height": 900 if w >= 768 else 800}, device_scale_factor=1, reduced_motion="no-preference")
        page = ctx.new_page()
        errors = []
        page.on("console", lambda m: m.type in ("error", "warning") and errors.append(m.text))
        page.on("pageerror", lambda e: errors.append(str(e)))
        for path in PAGES:
            page.goto(BASE + path, wait_until="networkidle")
            page.wait_for_timeout(600)
            # scroll through to trigger reveals
            h = page.evaluate("document.documentElement.scrollHeight")
            y = 0
            while y < h:
                page.evaluate(f"window.scrollTo(0,{y})"); page.wait_for_timeout(60); y += 500
            page.evaluate("window.scrollTo(0,0)"); page.wait_for_timeout(500)
            res = page.evaluate(CHECK)
            name = (path.strip("/").replace("/", "_") or "home")
            page.screenshot(path=f"{OUT}/{name}-{w}.png", full_page=True)
            report[f"{name}@{w}"] = {**res, "errors": list(dict.fromkeys(errors))}
            errors.clear()
        ctx.close()
    b.close()
print(json.dumps({k: v for k, v in report.items() if v["over"] > 0 or v["wide"] or v["hits"] or v["errors"]}, indent=1) or "{}")
print("checked", len(report), "page/width combos")

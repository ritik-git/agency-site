"""Assert every display heading renders exactly its authored number of lines."""
from playwright.sync_api import sync_playwright
PAGES = ["/", "/work/project-alpha/", "/privacy/", "/nope", "/admin/"]
JS = """() => [...document.querySelectorAll('.display-1, .display-2')].filter(h => h.offsetParent).map(h => {
  const lines = [...h.querySelectorAll(':scope > .line')];
  const rendered = lines.reduce((n, l) => n + new Set([...l.querySelector(".line__inner, *") ? l.querySelector(".line__inner").getClientRects() : l.getClientRects()].map(x => Math.round(x.top))).size, 0);
  return { id: h.id, authored: lines.length, rendered, fs: Math.round(parseFloat(getComputedStyle(h).fontSize)) };
})"""
bad = []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
    for w in (320, 375, 414, 768, 1024, 1280, 1440, 1920, 2560):
        pg = b.new_page(viewport={"width": w, "height": 900})
        for path in PAGES:
            pg.goto("http://localhost:8787" + path, wait_until="networkidle")
            if path == "/admin/": pg.evaluate("document.querySelectorAll('[data-when]').forEach(e=>e.hidden=false)")
            for r in pg.evaluate(JS):
                if r["rendered"] != r["authored"]: bad.append((w, path, r))
        pg.close()
    b.close()
print("\n".join(map(str, bad)) or "all headings render their authored lines at every width")

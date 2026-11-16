"""End-to-end interaction checks against the dev server + Supabase mock."""
import sys, os
from playwright.sync_api import sync_playwright

B = "http://localhost:8787"
OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
results = []
def check(name, ok, extra=""):
    results.append(("PASS" if ok else "FAIL", name, extra))

with sync_playwright() as p:
    br = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
    errors = []

    # ---------- mobile: menu ----------
    ctx = br.new_context(viewport={"width": 390, "height": 844}, has_touch=True, is_mobile=True)
    pg = ctx.new_page(); pg.on("pageerror", lambda e: errors.append(str(e)))
    pg.goto(B + "/", wait_until="networkidle")
    pg.keyboard.press("Tab")
    check("skip link is first focus", pg.evaluate("document.activeElement.className") == "skip-link")
    pg.click("[data-menu-toggle]"); pg.wait_for_timeout(450)
    check("menu opens + aria-expanded", pg.get_attribute("[data-menu-toggle]", "aria-expanded") == "true" and pg.is_visible("[data-mobile-menu]"))
    check("body scroll locked", pg.evaluate("document.body.classList.contains('is-locked')"))
    pg.screenshot(path=f"{OUT}/menu-open-390.png")
    for _ in range(12): pg.keyboard.press("Tab")
    check("focus trapped in menu", pg.evaluate("!!document.activeElement.closest('[data-mobile-menu],[data-menu-toggle]')"))
    pg.keyboard.press("Escape"); pg.wait_for_timeout(300)
    check("Esc closes menu, focus to toggle", pg.get_attribute("[data-menu-toggle]", "aria-expanded") == "false" and pg.evaluate("document.activeElement.matches('[data-menu-toggle]')"))
    pg.click("[data-menu-toggle]"); pg.wait_for_timeout(300)
    pg.click(".mobile-menu__link[href='#work']"); pg.wait_for_timeout(1200)
    check("menu link navigates + closes", pg.is_hidden("[data-mobile-menu]") and abs(pg.evaluate("document.getElementById('work').getBoundingClientRect().top") - 80) < 20)
    ctx.close()

    # ---------- desktop ----------
    ctx = br.new_context(viewport={"width": 1440, "height": 900}, accept_downloads=True)
    pg = ctx.new_page(); pg.on("pageerror", lambda e: errors.append(str(e)))
    pg.on("console", lambda m: m.type == "error" and errors.append(m.text))
    pg.goto(B + "/", wait_until="networkidle"); pg.wait_for_timeout(800)

    # hero orbit label → service
    pg.click(".orbit-label >> text=Video"); pg.wait_for_timeout(1800)
    check("orbit label jumps to service", abs(pg.evaluate("document.getElementById('service-video-production').getBoundingClientRect().top")) < 140)
    # service preview appears on hover
    pg.hover("#service-ugc-creator-ads .service-row"); pg.wait_for_timeout(500)
    check("service preview shows on hover", pg.evaluate("document.querySelector('[data-service-preview]').classList.contains('is-visible')"))
    pg.screenshot(path=f"{OUT}/service-hover-1440.png")
    # header hides on scroll down, shows on scroll up
    pg.mouse.move(5, 500)
    pg.evaluate("window.scrollTo(0, 3000)"); pg.wait_for_timeout(200); pg.evaluate("window.scrollTo(0, 3400)"); pg.wait_for_timeout(400)
    hidden = pg.evaluate("document.querySelector('[data-header]').classList.contains('is-hidden')")
    pg.evaluate("window.scrollTo(0, 3200)"); pg.wait_for_timeout(400)
    check("header hides down / shows up", hidden and not pg.evaluate("document.querySelector('[data-header]').classList.contains('is-hidden')"))
    # active nav
    pg.evaluate("document.getElementById('process').scrollIntoView()"); pg.wait_for_timeout(600)
    check("active nav = Process", pg.evaluate("document.querySelector('[aria-current=true]')?.textContent") == "Process")
    pg.evaluate("window.scrollBy(0, 200)"); pg.wait_for_timeout(400)
    check("process line progresses", float(pg.evaluate("getComputedStyle(document.querySelector('[data-process-fill]')).getPropertyValue('--p') || 0")) > 0.3)
    # service row → contact preselect
    pg.evaluate("window.scrollTo(0,0)"); pg.wait_for_timeout(300)
    pg.click("#service-brand-content .service-row"); pg.wait_for_timeout(1400)
    check("service row pre-tags form", pg.input_value("[data-service-field]") == "brand-content" and "service=brand-content" in pg.url)
    # carousel
    pg.evaluate("document.querySelector('.testimonials').scrollIntoView()"); pg.wait_for_timeout(400)
    pg.click("[data-next]"); pg.wait_for_timeout(700)
    c1 = pg.text_content("[data-current]")
    pg.focus("[data-carousel]"); pg.keyboard.press("ArrowLeft"); pg.wait_for_timeout(700)
    check("carousel next/prev + keyboard", c1 == "02" and pg.text_content("[data-current]") == "01" and pg.evaluate("document.querySelectorAll('[data-slide]:not([hidden])').length") == 1)
    # form validation
    pg.evaluate("document.getElementById('contact').scrollIntoView()")
    F = "[data-contact-form] "
    visible_step = "[...document.querySelectorAll('[data-form-step]')].findIndex(s => getComputedStyle(s).display !== 'none')"
    check("stepper shows one step", pg.evaluate("[...document.querySelectorAll('[data-form-step]')].filter(s => getComputedStyle(s).display !== 'none').length") == 1)
    pg.click(F + "[data-next]"); pg.wait_for_timeout(300)
    check("empty Continue flags step 1 + focuses first", pg.evaluate("document.querySelectorAll('.field.is-invalid').length") == 4
          and pg.evaluate("document.activeElement.id") == "f-name" and pg.evaluate(visible_step) == 0)
    pg.screenshot(path=f"{OUT}/form-errors-1440.png", full_page=False)
    pg.fill("#f-name", "Priya Sharma"); pg.fill("#f-email", "not-an-email"); pg.locator("#f-email").blur()
    check("invalid email flagged on blur", "is-invalid" in pg.get_attribute("[data-field]:has(#f-email)", "class"))
    pg.fill("#f-phone", "12345"); pg.locator("#f-phone").blur()
    check("invalid phone flagged on blur", "is-invalid" in pg.get_attribute("[data-field]:has(#f-phone)", "class"))
    pg.fill("#f-email", "priya@brand.in"); pg.fill("#f-phone", "+91 98765 43210"); pg.fill("#f-company", "Brandly")
    pg.press("#f-company", "Enter"); pg.wait_for_timeout(400)
    check("Enter continues to step 2", pg.evaluate(visible_step) == 1)
    pg.click("#q-revenue .choice >> text=₹5L – ₹10L"); pg.wait_for_timeout(800)
    check("single choice auto-advances", pg.evaluate(visible_step) == 2)
    pg.click("#q-target .choice >> text=₹25L – ₹50L"); pg.click("#q-timeline .choice >> text=6 months"); pg.wait_for_timeout(800)
    check("step 3 auto-advances once both answered", pg.evaluate(visible_step) == 3)
    pg.click(F + "[data-prev]"); pg.wait_for_timeout(300)
    check("Back returns to step 3", pg.evaluate(visible_step) == 2)
    pg.click(".stepper__item >> nth=3"); pg.wait_for_timeout(300)
    pg.click("#q-challenges .choice >> text=Scaling revenue"); pg.click("#q-challenges .choice >> text=Running profitable ads")
    check("single + multi select", pg.evaluate("document.querySelectorAll('input[name=revenue_current]:checked').length") == 1
          and pg.evaluate("document.querySelectorAll('input[name=challenges]:checked').length") == 2)
    pg.fill("#f-other", "We need 30 UGC ads for a skincare launch in December.")
    check("all steps ticked", pg.evaluate("document.querySelectorAll('[data-form-step].is-complete').length") == 4)
    pg.check("#f-consent", force=True)
    pg.wait_for_timeout(2600)
    pg.click("[data-submit]"); pg.wait_for_timeout(900)
    check("submit → success panel + focus", pg.is_visible("[data-form-success]") and pg.text_content("[data-success-title]") == "Thanks, Priya." and pg.evaluate("document.activeElement.matches('[data-success-title]')"))
    pg.screenshot(path=f"{OUT}/form-success-1440.png")
    # case study link
    pg.goto(B + "/", wait_until="networkidle")
    pg.click(".project-card__link >> nth=1"); pg.wait_for_load_state("networkidle")
    check("project card → case study", pg.url.endswith("/work/project-beta/") and "Project Beta" in pg.title())
    pg.screenshot(path=f"{OUT}/case-study-1440.png", full_page=True)

    # ---------- admin ----------
    pg.goto(B + "/admin/", wait_until="networkidle"); pg.wait_for_timeout(300)
    check("admin shows login", pg.is_visible("[data-login]"))
    pg.fill("#a-email", "admin@example.com"); pg.fill("#a-pass", "wrong"); pg.click("[data-login] button[type=submit]"); pg.wait_for_timeout(500)
    check("wrong password rejected", "incorrect" in (pg.text_content("[data-login-alert]") or ""))
    pg.fill("#a-pass", "admin-pass"); pg.click("[data-login] button[type=submit]"); pg.wait_for_timeout(800)
    rows = pg.evaluate("document.querySelectorAll('[data-rows] tr .admin-row-btn').length")
    check("login → leads table shows the submission", rows >= 1 and "Priya Sharma" in pg.text_content("[data-rows]"))
    pg.screenshot(path=f"{OUT}/admin-1440.png")
    pg.click(".admin-row-btn >> text=Priya Sharma"); pg.wait_for_timeout(400)
    check("drawer opens with message + answers", pg.is_visible("[data-drawer]") and "skincare" in pg.text_content("[data-d-message]")
          and "₹25L – ₹50L" in pg.text_content("[data-d-meta]") and "+91 98765 43210" in pg.text_content("[data-d-meta]"))
    pg.select_option("[data-d-status]", "contacted"); pg.fill("[data-d-notes]", "Call booked Fri"); pg.click("[data-d-save]"); pg.wait_for_timeout(500)
    check("status saved", pg.text_content("[data-d-status-msg]") == "Saved.")
    pg.screenshot(path=f"{OUT}/admin-drawer-1440.png")
    pg.keyboard.press("Escape"); pg.wait_for_timeout(200)
    check("Esc closes drawer", pg.is_hidden("[data-drawer]") and "contacted" in pg.text_content("[data-rows]"))
    pg.fill("[data-search]", "zzz"); pg.wait_for_timeout(100)
    check("search filters", "No leads match" in pg.text_content("[data-rows]"))
    pg.fill("[data-search]", "")
    with pg.expect_download() as d: pg.click("[data-export]")
    csv = open(d.value.path(), encoding="utf-8-sig").read()
    check("CSV export", csv.startswith("created_at,name") and "Priya Sharma" in csv)
    pg.reload(wait_until="networkidle"); pg.wait_for_timeout(500)
    check("session persists on reload", pg.is_visible(".admin-main"))
    pg.click("[data-signout]"); pg.wait_for_timeout(300)
    check("sign out", pg.is_visible("[data-login]"))
    ctx.close()

    # ---------- reduced motion + no JS ----------
    ctx = br.new_context(viewport={"width": 1280, "height": 900}, reduced_motion="reduce")
    pg = ctx.new_page(); pg.goto(B + "/", wait_until="networkidle"); pg.wait_for_timeout(400)
    check("reduced motion: orbit not animating", pg.evaluate("getComputedStyle(document.querySelector('.orbit--a')).animationIterationCount") == "1")
    check("reduced motion: hero visible", pg.evaluate("getComputedStyle(document.querySelector('.hero__lead')).opacity") == "1")
    ctx.close()
    ctx = br.new_context(viewport={"width": 1280, "height": 900}, java_script_enabled=False)
    pg = ctx.new_page(); pg.goto(B + "/", wait_until="networkidle")
    check("no-JS: content visible", pg.evaluate("getComputedStyle(document.querySelector('.service-item')).opacity") == "1" and pg.evaluate("getComputedStyle(document.querySelector('#services-title .line__inner')).transform") == "none")
    ctx.close()
    br.close()

for r in results: print(*r)
print("page errors:", errors or "none")
print(f"{sum(r[0]=='PASS' for r in results)}/{len(results)} passed")

// Consultation form: field + option-card validation, step completion ticks, service pre-tag,
// Supabase submission (with fallback for databases that haven't run migration 002 yet), states.
import { $, $$, reducedMotion } from "./utils.js";
import { insertLead, isConfigured } from "./supabase.js";

const MESSAGES = {
  name: "Please tell us your name.",
  email: "Please enter a valid email address, e.g. jane@brand.com.",
  phone: "Please enter a valid phone number (10–15 digits), e.g. +91 98765 43210.",
  company: "Please add your brand name.",
  consent: "Please accept the privacy policy so we can get in touch.",
  revenue_current: "Please pick your current monthly revenue — a rough range is fine.",
  budget_fit: "Please pick the option that fits your budget.",
  revenue_target: "Please pick a target — a rough idea is fine.",
  target_timeline: "Please choose a timeline (“Flexible” works too).",
  start_ready: "Please let us know — a quick yes, no or maybe is fine.",
  challenges: "Please pick at least one challenge, or describe it in your own words below.",
};
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?\d{10,15}$/;
const phoneDigits = (v) => v.replace(/[\s\-().]/g, "");

/* ---- text fields ------------------------------------------------------ */
function validateInput(input) {
  const v = input.type === "checkbox" ? input.checked : input.value.trim();
  switch (input.name) {
    case "email": return EMAIL.test(v);
    case "phone": return PHONE.test(phoneDigits(v));
    case "consent": return v === true;
    default: return input.required ? Boolean(v) : true;
  }
}

function setInputState(input, ok) {
  const field = input.closest("[data-field]");
  const err = $(".field__error", field);
  field.classList.toggle("is-invalid", !ok);
  field.classList.toggle("is-valid", ok && input.type !== "checkbox" && input.required && Boolean(input.value.trim()));
  input.setAttribute("aria-invalid", String(!ok));
  err.hidden = ok;
  if (!ok) $("span", err).textContent = MESSAGES[input.name];
}

/* ---- option-card groups ---------------------------------------------- */
const checkedIn = (group) => $$("input:checked", group);

export function initContactForm() {
  const form = $("[data-contact-form]");
  if (!form) return;
  const inputs = $$("input[required]:not([type=radio]):not([type=checkbox]), textarea[required], input[name=consent]", form);
  const groups = $$("[data-choices]", form);
  const other = $("#f-other", form);
  const steps = $$("[data-form-step]", form);
  const alertBox = $("[data-form-alert]", form);
  const submit = $("[data-submit]", form);
  const serviceField = $("[data-service-field]", form);
  const loadedAt = Date.now();

  const groupOk = (g) =>
    !g.hasAttribute("data-required") || checkedIn(g).length > 0 || (g.dataset.choices === "challenges" && Boolean(other?.value.trim()));
  const setGroupState = (g, ok) => {
    g.classList.toggle("is-invalid", !ok);
    $$("input", g).forEach((i) => (i.type === "radio" || i.type === "checkbox") && i.setAttribute("aria-invalid", String(!ok)));
    const err = $(".choices__error", g);
    err.hidden = ok;
    if (!ok) $("span", err).textContent = MESSAGES[g.dataset.choices];
  };

  // Step ticks: a step is complete when everything required inside it is valid.
  const stepComplete = (step) =>
    $$("input[required]:not([type=radio]):not([type=checkbox]), textarea[required]", step).every(validateInput) &&
    $$("[data-choices]", step).every((g) => groupOk(g) && (checkedIn(g).length > 0 || g.dataset.choices === "challenges"));
  const updateSteps = () => {
    steps.forEach((s) => {
      const done = stepComplete(s);
      s.classList.toggle("is-complete", done);
      const st = $("[data-step-status]", s);
      if (st) st.textContent = done ? " — complete" : "";
    });
    if (stepperOn) paintStepper();
  };

  // Validate everything inside `root` (a step, or the whole form); returns the first invalid control.
  const validateScope = (root) => {
    let firstBad = null;
    $$("input[required]:not([type=radio]):not([type=checkbox]), textarea[required], [data-choices], input[name=consent]", root).forEach((node) => {
      if (node.matches("[data-choices]")) {
        const ok = groupOk(node); setGroupState(node, ok);
        if (!ok && !firstBad) firstBad = $("input", node);
      } else {
        const ok = validateInput(node); setInputState(node, ok);
        if (!ok && !firstBad) firstBad = node;
      }
    });
    return firstBad;
  };
  const focusBad = (el) => {
    const dd = el.closest("[data-dropdown]");
    if (dd) { dd.open = true; el = $("summary", dd); }
    el.closest("[data-field], [data-choices]").scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "center" });
    el.focus({ preventScroll: true });
  };

  /* ---- Stepper: one step at a time (progressive enhancement) ------------ */
  const stepper = $("[data-stepper]", form);
  const items = $$("[data-stepper-item]", form);
  const caption = $("[data-stepper-caption]", form);
  const prevBtn = $("[data-prev]", form);
  const nextBtn = $("[data-next]", form);
  const stepperOn = Boolean(stepper && prevBtn && nextBtn && steps.length > 1);
  const last = steps.length - 1;
  let current = 0, furthest = 0, autoTimer = 0;

  function paintStepper() {
    items.forEach((it, k) => {
      const done = k !== current && k <= furthest && stepComplete(steps[k]);
      it.classList.toggle("is-current", k === current);
      it.classList.toggle("is-done", done);
      const btn = $("button", it);
      btn.disabled = k > furthest || k === current;
      if (k === current) btn.setAttribute("aria-current", "step"); else btn.removeAttribute("aria-current");
      $("[data-stepper-sr]", it).textContent = `: ${steps[k].dataset.formStep}${done ? " (done)" : k === current ? " (current step)" : ""}`;
    });
  }
  function show(i, { focus = true } = {}) {
    clearTimeout(autoTimer);
    const dir = i >= current ? 1 : -1;
    steps[current].classList.remove("is-current", "is-entering");
    current = i;
    furthest = Math.max(furthest, i);
    const s = steps[i];
    s.classList.add("is-current");
    s.style.setProperty("--dir", dir);
    if (focus && !reducedMotion()) { void s.offsetWidth; s.classList.add("is-entering"); }
    caption.textContent = `Step ${i + 1} of ${steps.length} — ${s.dataset.formStep}`;
    prevBtn.hidden = i === 0;
    nextBtn.hidden = i === last;
    submit.hidden = i !== last;
    paintStepper();
    if (focus) {
      // Keep the top of the form in view (long steps on phones), then move focus to the new step's heading.
      const top = stepper.getBoundingClientRect().top;
      if (top < 0 || top > innerHeight * 0.45) stepper.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
      $(".form-step__head", s).focus({ preventScroll: true });
    }
  }
  // Move forward only through valid steps; backwards is always allowed.
  function goTo(target) {
    for (let k = current; k < target; k++) {
      if (k !== current) show(k, { focus: false });
      const bad = validateScope(steps[k]);
      if (bad) { if (k !== current) show(k); focusBad(bad); return; }
    }
    show(target);
  }
  if (stepperOn) {
    form.classList.add("is-stepper");
    stepper.hidden = false;
    show(0, { focus: false });
    nextBtn.addEventListener("click", () => goTo(current + 1));
    prevBtn.addEventListener("click", () => show(current - 1));
    items.forEach((it, k) => $("button", it).addEventListener("click", () => (k < current ? show(k) : goTo(k))));
    // Single-choice steps advance by themselves once complete — answering is just tapping.
    form.addEventListener("change", (e) => {
      if (e.target.type !== "radio" || current === last || !steps[current].contains(e.target)) return;
      clearTimeout(autoTimer);
      if (stepComplete(steps[current])) autoTimer = setTimeout(() => { if (stepComplete(steps[current])) goTo(current + 1); }, 450);
    });
  }

  // Service pre-tag from ?service= and from the service rows (hidden field; no question to answer)
  const isService = (slug) => slug && (slug === "not-sure" || document.getElementById(`service-${slug}`));
  const preset = new URLSearchParams(location.search).get("service");
  if (serviceField && isService(preset)) serviceField.value = preset;
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="?service="]');
    if (!a) return;
    e.preventDefault();
    const slug = new URL(a.href).searchParams.get("service");
    if (serviceField && isService(slug)) serviceField.value = slug;
    if (stepperOn && current !== 0) show(0, { focus: false });
    history.replaceState(null, "", `?service=${slug}#contact`);
    $("#contact").scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
    setTimeout(() => $("#f-name", form).focus({ preventScroll: true }), reducedMotion() ? 0 : 700);
  });

  // Live validation: text fields validate on blur, then live once flagged; groups re-check on change.
  inputs.forEach((input) => {
    input.addEventListener("blur", () => { if (input.value || input.closest(".is-invalid")) setInputState(input, validateInput(input)); });
    input.addEventListener(input.type === "checkbox" ? "change" : "input", () => {
      if (input.closest(".is-invalid") || input.type === "checkbox") setInputState(input, validateInput(input));
      updateSteps();
    });
  });
  // Dropdown groups: the trigger shows what's picked
  $$("[data-dropdown]", form).forEach((dd) => {
    const lab = $("[data-dropdown-label]", dd);
    const paint = () => {
      const picked = $$("input:checked", dd).map((i) => $(".choice__text", i.closest(".choice")).textContent.trim());
      lab.textContent = picked.length ? picked.join(", ") : lab.dataset.placeholder;
      dd.classList.toggle("has-value", picked.length > 0);
    };
    dd.addEventListener("change", paint);
    document.addEventListener("click", (e) => { if (dd.open && !dd.contains(e.target)) dd.open = false; });
    dd.addEventListener("keydown", (e) => { if (e.key === "Escape" && dd.open) { dd.open = false; $("summary", dd).focus(); } });
    paint();
  });
  groups.forEach((g) => g.addEventListener("change", () => { if (g.classList.contains("is-invalid")) setGroupState(g, groupOk(g)); updateSteps(); }));
  other?.addEventListener("input", () => {
    const g = other.closest("[data-choices]");
    if (g.classList.contains("is-invalid")) setGroupState(g, groupOk(g));
    updateSteps();
  });
  updateSteps();

  const showAlert = (text, info = false) => {
    alertBox.textContent = text;
    alertBox.classList.toggle("form-alert--info", info);
    alertBox.hidden = false;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (submit.getAttribute("aria-busy") === "true") return; // double-submit guard
    alertBox.hidden = true;
    // Enter on an earlier step means "continue", not "send".
    if (stepperOn && current !== last) return goTo(current + 1);

    // Final check of every step; jump to the first problem (switching step if needed).
    let firstBad = null;
    steps.forEach((s) => { const bad = validateScope(s); if (bad && !firstBad) firstBad = bad; });
    if (firstBad) {
      const at = steps.findIndex((s) => s.contains(firstBad));
      if (stepperOn && at !== current) show(at);
      focusBad(firstBad);
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    const done = () => success(form, data.name);
    // Bots: honeypot filled or submitted implausibly fast → fake success, send nothing
    if (data.fax || Date.now() - loadedAt < 2500) return done();

    if (!isConfigured()) {
      showAlert("The form isn't connected to the database yet (Supabase not configured). Your details were not sent.", true);
      return;
    }

    // Map answers → payload. Labels come from the cards themselves, so the summary matches what the visitor saw.
    const label = (input) => input ? $(".choice__text", input.closest(".choice")).textContent.trim() : "";
    const pick = (name) => $(`input[name="${name}"]:checked`, form);
    const cur = pick("revenue_current"), fit = pick("budget_fit"), tgt = pick("revenue_target"), when = pick("target_timeline");
    const challenges = $$('input[name="challenges"]:checked', form);
    const otherText = (data.challenge_other || "").trim();
    const startText = (data.start_ready || "").trim();
    const phone = data.phone.trim();
    const summary = [
      `Phone: ${phone}`,
      `Current monthly revenue: ${label(cur)}`,
      `Budget (fees from ₹30,000/month): ${label(fit)}`,
      `Target monthly revenue: ${label(tgt)} (timeline: ${label(when)})`,
      `Challenges: ${challenges.map(label).join("; ") || "—"}`,
      otherText && `Something else: ${otherText}`,
      startText && `Ready to start within 2 weeks: ${startText}`,
    ].filter(Boolean).join("\n").slice(0, 1000);

    // Columns every version of the database has (supabase/schema.sql)…
    const base = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      company: data.company.trim(),
      website: null,
      service: data.service || "not-sure",
      budget: label(cur).slice(0, 40),
      message: summary,
      consent: true,
      source_url: location.href.split("#")[0].slice(0, 500),
    };
    // …plus structured answers (supabase/migrations/002_consultation_form.sql).
    const full = {
      ...base,
      phone,
      revenue_current: cur.value,
      revenue_target: tgt.value,
      target_timeline: when.value,
      challenges: challenges.map((c) => c.value),
      challenge_other: otherText || null,
    };
    // …plus budget fit and start timing (supabase/migrations/003_budget_and_start.sql).
    const latest = { ...full, budget_fit: fit.value, start_ready: startText || null };

    submit.setAttribute("aria-busy", "true");
    submit.disabled = true;
    const btnLabel = $(".btn__label", submit);
    const original = btnLabel.textContent;
    btnLabel.innerHTML = 'Sending<span class="dots" aria-hidden="true"></span>';
    try {
      // Database missing newer columns → retry with fewer; the summary in `message` always has every answer.
      const missingColumn = (err) => ["PGRST204", "42501", "42703"].includes(err.body?.code);
      for (const [i, row] of [latest, full, base].entries()) {
        try { await insertLead(row); break; } catch (err) { if (i === 2 || !missingColumn(err)) throw err; }
      }
      done();
    } catch (err) {
      const rate = err.status === 429 || /too many/i.test(err.message);
      showAlert(rate
        ? "You've sent a few requests already — we'll be in touch soon. If it's urgent, please email us."
        : "Something went wrong and your details weren't sent. Please try again in a moment, or email us directly.");
      submit.disabled = false;
      submit.removeAttribute("aria-busy");
      btnLabel.textContent = original;
    }
  });
}

function success(form, name) {
  const panel = $("[data-form-success]");
  const title = $("[data-success-title]", panel);
  const first = (name || "").trim().split(/\s+/)[0];
  title.textContent = first ? `Thanks, ${first}.` : "Thanks.";
  form.hidden = true;
  panel.hidden = false;
  title.focus();
}

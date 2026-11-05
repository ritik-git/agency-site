// Contact form: validation (§12.7), service pre-select, Supabase submission, states (M17).
import { $, $$, reducedMotion } from "./utils.js";
import { insertLead, isConfigured } from "./supabase.js";

const MESSAGES = {
  name: "Please tell us your name.",
  email: "Please enter a valid work email, e.g. jane@brand.com.",
  company: "Please add your brand or company name.",
  website: "Please enter a full web address, e.g. https://brand.com.",
  service: "Please choose a service — or “Not sure yet”.",
  budget: "Please choose a budget range.",
  message: "Please add a few words about the project (at least 10 characters).",
  consent: "Please accept the privacy policy so we can reply.",
};
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(input) {
  const v = input.type === "checkbox" ? input.checked : input.value.trim();
  switch (input.name) {
    case "email": return EMAIL.test(v);
    case "website": return !v || /^https?:\/\/[^\s.]+\.[^\s]{2,}$/i.test(v);
    case "message": return v.length >= 10;
    case "consent": return v === true;
    default: return input.required ? Boolean(v) : true;
  }
}

function setState(input, ok, { showValid = true } = {}) {
  const field = input.closest("[data-field]");
  const err = $(".field__error", field);
  field.classList.toggle("is-invalid", !ok);
  field.classList.toggle("is-valid", ok && showValid && input.type !== "checkbox" && Boolean(input.value.trim()));
  input.setAttribute("aria-invalid", String(!ok));
  err.hidden = ok;
  if (!ok) $("span", err).textContent = MESSAGES[input.name];
}

export function initContactForm() {
  const form = $("[data-contact-form]");
  if (!form) return;
  const inputs = $$("input:not([name=fax]), select, textarea", form);
  const alertBox = $("[data-form-alert]", form);
  const submit = $("[data-submit]", form);
  const select = $("#f-service", form);
  const loadedAt = Date.now();

  // Pre-select a service from ?service= (deep links + service rows)
  const preset = new URLSearchParams(location.search).get("service");
  if (preset && $(`option[value="${CSS.escape(preset)}"]`, select)) select.value = preset;
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="?service="]');
    if (!a) return;
    e.preventDefault();
    const slug = new URL(a.href).searchParams.get("service");
    if ($(`option[value="${CSS.escape(slug)}"]`, select)) select.value = slug;
    history.replaceState(null, "", `?service=${slug}#contact`);
    $("#contact").scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
    setTimeout(() => $("#f-name", form).focus({ preventScroll: true }), reducedMotion() ? 0 : 700);
  });

  // Character counter
  const msg = $("#f-message", form);
  const counter = $("[data-count-now]", form);
  msg.addEventListener("input", () => { counter.textContent = msg.value.length; });

  // Normalise website on blur ("brand.com" → "https://brand.com")
  const site = $("#f-website", form);
  site.addEventListener("blur", () => { const v = site.value.trim(); if (v && !/^https?:\/\//i.test(v)) site.value = "https://" + v; });

  inputs.forEach((input) => {
    input.addEventListener("blur", () => { if (input.value || input.closest(".is-invalid")) setState(input, validate(input)); });
    input.addEventListener(input.type === "checkbox" || input.tagName === "SELECT" ? "change" : "input", () => {
      if (input.closest(".is-invalid") || input.type === "checkbox" || input.tagName === "SELECT") setState(input, validate(input));
    });
  });

  const showAlert = (text, info = false) => {
    alertBox.textContent = text;
    alertBox.classList.toggle("form-alert--info", info);
    alertBox.hidden = false;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    alertBox.hidden = true;
    let firstBad = null;
    inputs.forEach((input) => { const ok = validate(input); setState(input, ok); if (!ok && !firstBad) firstBad = input; });
    if (firstBad) { firstBad.focus(); return; }
    if (submit.getAttribute("aria-busy") === "true") return; // double-submit guard

    const data = Object.fromEntries(new FormData(form));
    const done = () => success(form, data.name);
    // Bots: honeypot filled or submitted implausibly fast → fake success, send nothing
    if (data.fax || Date.now() - loadedAt < 2500) return done();

    if (!isConfigured()) {
      showAlert("The form isn't connected to the database yet (Supabase not configured). Your message was not sent.", true);
      return;
    }

    submit.setAttribute("aria-busy", "true");
    submit.disabled = true;
    const label = $(".btn__label", submit);
    const original = label.textContent;
    label.innerHTML = 'Sending<span class="dots" aria-hidden="true"></span>';
    try {
      await insertLead({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        company: data.company.trim(),
        website: data.website.trim() || null,
        service: data.service,
        budget: data.budget,
        message: data.message.trim(),
        consent: true,
        source_url: location.href.split("#")[0].slice(0, 500),
      });
      done();
    } catch (err) {
      const rate = err.status === 429 || /too many/i.test(err.message);
      showAlert(rate
        ? "You've sent a few messages already — we'll be in touch soon. If it's urgent, please email us."
        : "Something went wrong and your message wasn't sent. Please try again in a moment, or email us directly.");
      submit.disabled = false;
      submit.removeAttribute("aria-busy");
      label.textContent = original;
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

// Admin lead inbox. All lead data is untrusted user input → rendered with textContent only.
import { $, $$, trapFocus } from "./utils.js";
import { isConfigured, signIn, signOut, getSession, listLeads, updateLead, isAdmin } from "./supabase.js";

const STATUSES = ["new", "contacted", "qualified", "won", "lost", "spam"];
// Consultation-form labels (value → label), embedded by the page from content/site.mjs
const OPTS = (() => { try { return JSON.parse($("#lead-options")?.textContent || "{}"); } catch { return {}; } })();
const lbl = (field, v) => (v == null || v === "" ? "" : OPTS[field]?.[v] || v);
const challengeLabels = (l) => (Array.isArray(l.challenges) ? l.challenges.map((c) => lbl("challenges", c)) : []);
const challengeList = (l) => challengeLabels(l).join("; ");
const isConsultation = (l) => Boolean(l.revenue_current || l.revenue_target || l.target_timeline || l.phone);
const phoneDigits = (p) => (p || "").replace(/[^\d+]/g, "");
// wa.me needs the full international number without "+"; a bare 10-digit number is assumed Indian (+91).
const waNumber = (p) => { const d = (p || "").replace(/\D/g, ""); return d.length === 10 ? "91" + d : d; };
const root = $("[data-admin]");
let leads = [];
let openId = null;
let releaseTrap = null;
let lastFocus = null;

const show = (state) => $$("[data-when]", root).forEach((n) => { n.hidden = n.dataset.when !== state; });
const fmt = new Intl.DateTimeFormat(undefined, { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const fmtDate = (iso) => (iso ? fmt.format(new Date(iso)) : "");
const el = (tag, props = {}, ...kids) => {
  const n = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => (k === "class" ? (n.className = v) : k === "dataset" ? Object.assign(n.dataset, v) : (n[k] = v)));
  kids.flat().forEach((k) => k != null && n.append(k));
  return n;
};
const status = (text) => { $("[data-status]").textContent = text; };

/* ---- boot ------------------------------------------------------------ */
async function boot() {
  if (!isConfigured()) return show("unconfigured");
  const s = await getSession();
  if (!s) return show("guest");
  await enter(s);
}

async function enter(session) {
  try {
    if (!(await isAdmin())) {
      await signOut();
      show("guest");
      loginAlert("This account doesn't have admin access. Ask the site owner to add you in supabase/schema.sql → admin_users.");
      return;
    }
  } catch (err) {
    show("guest");
    return loginAlert(err.message);
  }
  $("[data-user]").textContent = session.email || "";
  show("authed");
  await load();
}

function loginAlert(text) {
  const a = $("[data-login-alert]");
  a.textContent = text;
  a.hidden = !text;
}

/* ---- login / logout -------------------------------------------------- */
$("[data-login]").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.currentTarget;
  const btn = $("button[type=submit]", f);
  loginAlert("");
  if (!f.email.value || !f.password.value) return loginAlert("Enter your email and password.");
  btn.disabled = true;
  try {
    const s = await signIn(f.email.value.trim(), f.password.value);
    f.reset();
    await enter(s);
  } catch (err) {
    loginAlert(err.status === 400 ? "Email or password is incorrect." : err.message);
  } finally {
    btn.disabled = false;
  }
});
$("[data-signout]").addEventListener("click", async () => { await signOut(); leads = []; renderRows(); show("guest"); $("#a-email").focus(); });

/* ---- data ------------------------------------------------------------- */
async function load() {
  status("Loading leads…");
  try {
    leads = (await listLeads()) || [];
    status(`Updated ${fmt.format(new Date())}`);
  } catch (err) {
    if (err.status === 401) { show("guest"); return loginAlert(err.message); }
    status(`Couldn't load leads: ${err.message}`);
  }
  renderKpis();
  renderRows();
}

function filtered() {
  const q = $("[data-search]").value.trim().toLowerCase();
  const st = $("[data-filter-status]").value;
  const qDigits = q.replace(/\D/g, ""); // phone search ignores spaces, dashes and "+"
  const rev = $("[data-filter-revenue]").value;
  const tl = $("[data-filter-timeline]").value;
  return leads.filter((l) =>
    (!st || l.status === st) && (!rev || l.revenue_current === rev) && (!tl || l.target_timeline === tl) &&
    (!q || [l.name, l.email, l.company, l.message, l.website, l.phone, l.challenge_other, challengeList(l)].some((v) => (v || "").toLowerCase().includes(q))
      || (qDigits.length >= 4 && (l.phone || "").replace(/\D/g, "").includes(qDigits))));
}

function renderKpis() {
  const week = Date.now() - 7 * 864e5;
  const items = [
    ["Total", leads.length],
    ["New", leads.filter((l) => l.status === "new").length],
    ["Last 7 days", leads.filter((l) => new Date(l.created_at) > week).length],
    ["Won", leads.filter((l) => l.status === "won").length],
  ];
  $("[data-kpis]").replaceChildren(...items.map(([k, v]) => el("li", { class: "admin-kpi" }, el("span", { class: "admin-kpi__value", textContent: v }), el("span", { class: "admin-kpi__label", textContent: k }))));
}

function badge(s) { return el("span", { class: `status status--${s}`, textContent: s }); }
const chip = (text, cls = "") => el("span", { class: `admin-chip ${cls}`.trim(), textContent: text });
function challengeCell(l) {
  const list = challengeLabels(l);
  const kids = list.slice(0, 2).map((c) => chip(c));
  if (list.length > 2) kids.push(chip(`+${list.length - 2}`, "admin-chip--more"));
  if (l.challenge_other) kids.push(chip("Other", "admin-chip--more"));
  return kids.length ? el("div", { class: "admin-chips" }, kids) : "—";
}

function renderRows() {
  const rows = filtered();
  const body = $("[data-rows]");
  if (!rows.length) {
    body.replaceChildren(el("tr", {}, el("td", { colSpan: 8, class: "admin-empty", textContent: leads.length ? "No leads match these filters." : "No leads yet. New inquiries from the contact form will appear here." })));
    return;
  }
  body.replaceChildren(...rows.map((l) => {
    const open = el("button", { type: "button", class: "admin-row-btn", textContent: l.name || "(no name)" });
    open.addEventListener("click", () => openDrawer(l.id, open));
    return el("tr", { class: l.status === "new" ? "is-new" : "" },
      el("td", { class: "admin-td-date", textContent: fmtDate(l.created_at) }),
      el("td", { class: "admin-td-name" }, open, el("span", { class: "admin-sub", textContent: l.email }), l.phone ? el("span", { class: "admin-sub", textContent: l.phone }) : null),
      el("td", { textContent: l.company || "" }),
      el("td", { class: "admin-td-strong", textContent: lbl("revenue_current", l.revenue_current) || l.budget || "—" }),
      el("td", { class: "admin-td-strong", textContent: lbl("revenue_target", l.revenue_target) || "—" }),
      el("td", { textContent: lbl("target_timeline", l.target_timeline) || "—" }),
      el("td", {}, challengeCell(l)),
      el("td", {}, badge(l.status)));
  }));
}

/* ---- drawer ------------------------------------------------------------ */
const drawer = $("[data-drawer]");
function openDrawer(id, trigger) {
  const l = leads.find((x) => x.id === id);
  if (!l) return;
  openId = id;
  lastFocus = trigger;
  $("[data-d-name]").textContent = l.name;

  // Quick actions: email / WhatsApp / call
  const subject = encodeURIComponent(`Your consultation request — ${l.company || "AdverBright"}`);
  const action = (label, href, ext) => el("a", { class: "drawer__action", href, textContent: label, ...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {}) });
  $("[data-d-contact]").replaceChildren(
    action("Email", `mailto:${l.email}?subject=${subject}`),
    ...(l.phone ? [action("WhatsApp", `https://wa.me/${waNumber(l.phone)}`, true), action("Call", `tel:${phoneDigits(l.phone)}`)] : []),
  );

  // Answers, grouped like the form's four steps
  const dl = (rows) => el("dl", { class: "drawer__meta" }, rows.filter(Boolean).flatMap(([k, v]) => [el("dt", { textContent: k }), el("dd", {}, v || "—")]));
  const group = (num, title, body) => el("section", { class: "drawer__group" },
    el("h3", { class: "drawer__group-title" }, el("span", { class: "drawer__group-num", textContent: num }), title), body);
  const website = l.website && /^https?:\/\//i.test(l.website) ? el("a", { href: l.website, target: "_blank", rel: "noopener noreferrer", textContent: l.website }) : l.website;
  const groups = [
    group("01", "About", dl([
      ["Email", el("a", { href: `mailto:${l.email}`, textContent: l.email })],
      ["Phone", l.phone ? el("a", { href: `tel:${phoneDigits(l.phone)}`, textContent: l.phone }) : "—"],
      ["Brand", l.company],
      l.website ? ["Website", website] : null,
    ])),
  ];
  if (isConsultation(l)) {
    const ch = challengeLabels(l);
    groups.push(
      group("02", "Today", dl([["Revenue now", lbl("revenue_current", l.revenue_current)], l.budget_fit ? ["Budget fit", lbl("budget_fit", l.budget_fit)] : null])),
      group("03", "Goal", dl([["Target", lbl("revenue_target", l.revenue_target)], ["Timeline", lbl("target_timeline", l.target_timeline)]])),
      group("04", "Challenges", el("div", {},
        ch.length ? el("div", { class: "admin-chips admin-chips--wrap" }, ch.map((c) => chip(c))) : el("p", { class: "drawer__muted", textContent: "None selected" }),
        l.challenge_other ? el("blockquote", { class: "drawer__other" }, el("span", { class: "drawer__other-label", textContent: "Something else" }), el("p", { textContent: l.challenge_other })) : null,
        l.start_ready ? el("blockquote", { class: "drawer__other" }, el("span", { class: "drawer__other-label", textContent: "Ready to start within 2 weeks?" }), el("p", { textContent: l.start_ready })) : null)),
    );
  } else {
    groups.push(group("02", "Project", dl([["Budget", l.budget]])));
  }
  groups.push(dl([
    ["Received", fmtDate(l.created_at)],
    l.service && l.service !== "not-sure" ? ["Came from", lbl("service", l.service)] : null,
    ["Consent", l.consent ? "Yes" : "No"],
  ]));
  $("[data-d-groups]").replaceChildren(...groups);

  // Older leads (from the previous contact form) only have a free-text message.
  $("[data-d-legacy]").hidden = isConsultation(l) || !l.message;
  $("[data-d-message]").textContent = l.message || "";
  $("[data-d-status]").value = STATUSES.includes(l.status) ? l.status : "new";
  $("[data-d-notes]").value = l.notes || "";
  $("[data-d-status-msg]").textContent = "";
  drawer.hidden = false;
  document.body.classList.add("is-locked");
  releaseTrap = trapFocus(drawer);
  $(".square-btn", drawer).focus();
}
function closeDrawer() {
  drawer.hidden = true;
  document.body.classList.remove("is-locked");
  releaseTrap?.();
  openId = null;
  lastFocus?.focus();
}
$$("[data-close]", drawer).forEach((b) => b.addEventListener("click", closeDrawer));
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !drawer.hidden) closeDrawer(); });

$("[data-d-save]").addEventListener("click", async (e) => {
  const btn = e.currentTarget;
  const msg = $("[data-d-status-msg]");
  btn.disabled = true;
  msg.textContent = "Saving…";
  try {
    const patch = { status: $("[data-d-status]").value, notes: $("[data-d-notes]").value.trim() || null };
    const [updated] = await updateLead(openId, patch);
    const i = leads.findIndex((x) => x.id === openId);
    leads[i] = { ...leads[i], ...(updated || patch) };
    msg.textContent = "Saved.";
    renderKpis();
    renderRows();
  } catch (err) {
    msg.textContent = `Couldn't save: ${err.message}`;
  } finally {
    btn.disabled = false;
  }
});

/* ---- toolbar ----------------------------------------------------------- */
["[data-search]", "[data-filter-status]", "[data-filter-revenue]", "[data-filter-timeline]"].forEach((s) => $(s).addEventListener("input", renderRows));
$("[data-refresh]").addEventListener("click", load);
$("[data-export]").addEventListener("click", () => {
  const cols = ["created_at", "name", "email", "phone", "company", "website", "service", "budget",
    "revenue_current", "revenue_target", "target_timeline", "challenges", "challenge_other", "budget_fit", "start_ready", "status", "message", "notes"];
  const value = (l, c) =>
    c === "challenges" ? challengeList(l)
    : ["revenue_current", "revenue_target", "target_timeline", "budget_fit"].includes(c) ? lbl(c, l[c])
    : l[c];
  // Prefix cells starting with = + - @ to prevent CSV formula injection in Excel/Sheets
  const cell = (v) => { let s = v == null ? "" : String(v); if (/^[=+\-@]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };
  const csv = [cols.join(","), ...filtered().map((l) => cols.map((c) => cell(value(l, c))).join(","))].join("\r\n");
  const a = el("a", { href: URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" })), download: `leads-${new Date().toISOString().slice(0, 10)}.csv` });
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});

boot();

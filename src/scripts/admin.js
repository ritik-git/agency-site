// Admin lead inbox. All lead data is untrusted user input → rendered with textContent only.
import { $, $$, trapFocus } from "./utils.js";
import { isConfigured, signIn, signOut, getSession, listLeads, updateLead, isAdmin } from "./supabase.js";

const SERVICES = Object.fromEntries($$("[data-filter-service] option").filter((o) => o.value).map((o) => [o.value, o.textContent]));
const STATUSES = ["new", "contacted", "qualified", "won", "lost", "spam"];
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
  const sv = $("[data-filter-service]").value;
  return leads.filter((l) =>
    (!st || l.status === st) && (!sv || l.service === sv) &&
    (!q || [l.name, l.email, l.company, l.message, l.website].some((v) => (v || "").toLowerCase().includes(q))));
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

function renderRows() {
  const rows = filtered();
  const body = $("[data-rows]");
  if (!rows.length) {
    body.replaceChildren(el("tr", {}, el("td", { colSpan: 6, class: "admin-empty", textContent: leads.length ? "No leads match these filters." : "No leads yet. New inquiries from the contact form will appear here." })));
    return;
  }
  body.replaceChildren(...rows.map((l) => {
    const open = el("button", { type: "button", class: "admin-row-btn", textContent: l.name || "(no name)" });
    open.addEventListener("click", () => openDrawer(l.id, open));
    return el("tr", { class: l.status === "new" ? "is-new" : "" },
      el("td", { class: "admin-td-date", textContent: fmtDate(l.created_at) }),
      el("td", {}, open, el("span", { class: "admin-sub", textContent: l.email })),
      el("td", { textContent: l.company || "" }),
      el("td", { textContent: SERVICES[l.service] || l.service || "" }),
      el("td", { textContent: l.budget || "" }),
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
  const website = l.website && /^https?:\/\//i.test(l.website) ? el("a", { href: l.website, target: "_blank", rel: "noopener noreferrer", textContent: l.website }) : (l.website || "—");
  const rows = [
    ["Email", el("a", { href: `mailto:${l.email}`, textContent: l.email })],
    ["Brand", l.company || "—"],
    ["Website", website],
    ["Service", SERVICES[l.service] || l.service || "—"],
    ["Budget", l.budget || "—"],
    ["Received", fmtDate(l.created_at)],
    ["Consent", l.consent ? "Yes" : "No"],
  ];
  $("[data-d-meta]").replaceChildren(...rows.flatMap(([k, v]) => [el("dt", { textContent: k }), el("dd", {}, v)]));
  $("[data-d-message]").textContent = l.message || "";
  $("[data-d-status]").value = STATUSES.includes(l.status) ? l.status : "new";
  $("[data-d-notes]").value = l.notes || "";
  $("[data-d-reply]").href = `mailto:${encodeURIComponent(l.email)}?subject=${encodeURIComponent(`Re: your project inquiry — ${l.company || ""}`.trim())}`;
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
["[data-search]", "[data-filter-status]", "[data-filter-service]"].forEach((s) => $(s).addEventListener("input", renderRows));
$("[data-refresh]").addEventListener("click", load);
$("[data-export]").addEventListener("click", () => {
  const cols = ["created_at", "name", "email", "company", "website", "service", "budget", "status", "message", "notes"];
  // Prefix cells starting with = + - @ to prevent CSV formula injection in Excel/Sheets
  const cell = (v) => { let s = v == null ? "" : String(v); if (/^[=+\-@]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };
  const csv = [cols.join(","), ...filtered().map((l) => cols.map((c) => cell(l[c])).join(","))].join("\r\n");
  const a = el("a", { href: URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" })), download: `leads-${new Date().toISOString().slice(0, 10)}.csv` });
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});

boot();

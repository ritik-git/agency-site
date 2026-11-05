// Minimal Supabase REST client (PostgREST + GoTrue) — no SDK needed.
// The anon key is public by design; Row Level Security in supabase/schema.sql protects the data.
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

const BASE = SUPABASE_URL.replace(/\/$/, "");
const SESSION_KEY = "ab-admin-session";
export const isConfigured = () => Boolean(BASE && SUPABASE_ANON_KEY);

class ApiError extends Error {
  constructor(status, body) {
    super(body?.message || body?.msg || body?.error_description || body?.error || `Request failed (${status})`);
    this.status = status;
    this.body = body;
  }
}

async function request(path, { method = "GET", body, token, headers = {} } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token || SUPABASE_ANON_KEY}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = { message: text }; }
  if (!res.ok) throw new ApiError(res.status, data);
  return data;
}

/* ---- Public: contact form ------------------------------------------- */
export function insertLead(lead) {
  return request("/rest/v1/leads", { method: "POST", body: lead, headers: { Prefer: "return=minimal" } });
}

/* ---- Admin auth ------------------------------------------------------ */
const store = {
  get() { try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; } },
  set(s) { try { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch {} },
  clear() { try { localStorage.removeItem(SESSION_KEY); } catch {} },
};

function saveSession(d) {
  const s = {
    access_token: d.access_token,
    refresh_token: d.refresh_token,
    expires_at: d.expires_at || Math.floor(Date.now() / 1000) + (d.expires_in || 3600),
    email: d.user?.email,
  };
  store.set(s);
  return s;
}

export async function signIn(email, password) {
  return saveSession(await request("/auth/v1/token?grant_type=password", { method: "POST", body: { email, password } }));
}

export async function getSession() {
  const s = store.get();
  if (!s) return null;
  if (s.expires_at - 60 > Date.now() / 1000) return s;
  try {
    return saveSession(await request("/auth/v1/token?grant_type=refresh_token", { method: "POST", body: { refresh_token: s.refresh_token } }));
  } catch {
    store.clear();
    return null;
  }
}

export async function signOut() {
  const s = store.get();
  store.clear();
  if (s) await request("/auth/v1/logout", { method: "POST", token: s.access_token }).catch(() => {});
}

async function authed(path, opts = {}) {
  const s = await getSession();
  if (!s) throw new ApiError(401, { message: "Session expired — please sign in again." });
  return request(path, { ...opts, token: s.access_token });
}

export const isAdmin = () => authed("/rest/v1/rpc/is_admin", { method: "POST", body: {} });

/* ---- Admin data ------------------------------------------------------- */
export const listLeads = () => authed("/rest/v1/leads?select=*&order=created_at.desc&limit=2000");
export const updateLead = (id, patch) =>
  authed(`/rest/v1/leads?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", body: patch, headers: { Prefer: "return=representation" } });

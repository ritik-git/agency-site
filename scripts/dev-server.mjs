#!/usr/bin/env node
/* Local preview server for dist/ + an in-memory mock of the few Supabase endpoints
   the site uses, so the contact form and admin panel can be exercised offline.
   It mimics the RLS rules in supabase/schema.sql (anon: insert only; admin: read/update).
   Not used in production — GitHub Pages serves dist/ and the browser talks to real Supabase.

   usage: node scripts/dev-server.mjs [port]   (build with SUPABASE_URL=http://localhost:<port>/mock) */
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
const PORT = Number(process.argv[2] || process.env.PORT || 8787);
const ADMIN = { email: process.env.MOCK_ADMIN_EMAIL || "admin@example.com", password: process.env.MOCK_ADMIN_PASSWORD || "admin-pass" };
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".mp4": "video/mp4",".woff": "font/woff", ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain", ".webmanifest": "application/manifest+json" };

const leads = [];
const tokens = new Map(); // access_token → email
const SERVICES = ["ai-ad-creatives", "ugc-creator-ads", "video-production", "performance-creatives", "brand-content", "not-sure"];
const recent = new Map(); // ip → timestamps (mirrors the DB rate-limit trigger)

const send = (res, code, body, headers = {}) => {
  res.writeHead(code, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*", "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS", ...headers });
  res.end(body == null ? "" : JSON.stringify(body));
};
const readBody = (req) => new Promise((r) => { let d = ""; req.on("data", (c) => (d += c)); req.on("end", () => { try { r(JSON.parse(d || "{}")); } catch { r({}); } }); });
const bearer = (req) => (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
const isAdmin = (req) => tokens.has(bearer(req));

async function mock(req, res, p, q) {
  if (req.method === "OPTIONS") return send(res, 204, null);
  if (req.headers.apikey !== "dev-anon-key") return send(res, 401, { message: "Invalid API key" });

  if (p === "/auth/v1/token") {
    const b = await readBody(req);
    if (q.get("grant_type") === "password") {
      if (b.email !== ADMIN.email || b.password !== ADMIN.password) return send(res, 400, { error: "invalid_grant", error_description: "Invalid login credentials" });
    } else if (q.get("grant_type") === "refresh_token") {
      if (!b.refresh_token) return send(res, 400, { error: "invalid_grant" });
    }
    const t = crypto.randomBytes(16).toString("hex");
    tokens.set(t, ADMIN.email);
    return send(res, 200, { access_token: t, refresh_token: crypto.randomBytes(16).toString("hex"), expires_in: 3600, user: { email: ADMIN.email } });
  }
  if (p === "/auth/v1/logout") { tokens.delete(bearer(req)); return send(res, 204, null); }
  if (p === "/rest/v1/rpc/is_admin") return send(res, 200, isAdmin(req));

  if (p === "/rest/v1/leads") {
    if (req.method === "POST") {
      const b = await readBody(req);
      // CHECK constraints from schema.sql
      const bad = !b.name || b.name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(b.email || "") || !b.company ||
        !SERVICES.includes(b.service) || !b.budget || !b.message || b.message.length < 10 || b.message.length > 1000 || b.consent !== true;
      if (bad) return send(res, 400, { code: "23514", message: "new row violates check constraint" });
      const ip = req.socket.remoteAddress;
      const ts = (recent.get(ip) || []).filter((t) => Date.now() - t < 10 * 60e3);
      if (ts.length >= 5) return send(res, 400, { code: "P0001", message: "Too many submissions, please try again later." });
      recent.set(ip, [...ts, Date.now()]);
      // Mirrors schema.sql + migrations/002 (unknown columns → PostgREST's PGRST204, like the real API)
      const allowed = ["name", "email", "company", "website", "service", "budget", "message", "consent", "source_url",
        "phone", "revenue_current", "revenue_target", "target_timeline", "challenges", "challenge_other", "budget_fit", "start_ready"];
      const unknown = Object.keys(b).find((k) => !allowed.includes(k));
      if (unknown) return send(res, 400, { code: "PGRST204", message: `Could not find the '${unknown}' column of 'leads' in the schema cache` });
      if (b.phone != null && !/^\+?[0-9 ()\-.]{7,20}$/.test(b.phone)) return send(res, 400, { code: "23514", message: "new row violates check constraint" });
      if (b.challenges != null && (!Array.isArray(b.challenges) || b.challenges.length > 8)) return send(res, 400, { code: "23514", message: "new row violates check constraint" });
      const row = Object.fromEntries(allowed.map((k) => [k, b[k] ?? null]));
      leads.unshift({ id: crypto.randomUUID(), created_at: new Date().toISOString(), status: "new", notes: null, consent_at: new Date().toISOString(), ...row });
      return send(res, 201, null);
    }
    if (req.method === "GET") return send(res, 200, isAdmin(req) ? leads : []); // RLS: anon sees nothing
    if (req.method === "PATCH") {
      if (!isAdmin(req)) return send(res, 200, []);
      const id = (q.get("id") || "").replace(/^eq\./, "");
      const b = await readBody(req);
      const l = leads.find((x) => x.id === id);
      if (!l) return send(res, 200, []);
      if ("status" in b) l.status = b.status;
      if ("notes" in b) l.notes = b.notes;
      return send(res, 200, [l]);
    }
  }
  if (p === "/__seed" && req.method === "POST") {
    const b = await readBody(req);
    (b.leads || []).forEach((l) => leads.push({ id: crypto.randomUUID(), status: "new", notes: null, consent: true, ...l }));
    return send(res, 200, { count: leads.length });
  }
  send(res, 404, { message: "not found" });
}

http.createServer(async (req, res) => {
  const u = new URL(req.url, `http://localhost:${PORT}`);
  if (u.pathname.startsWith("/mock/")) return mock(req, res, u.pathname.slice(5), u.searchParams);
  let file = path.join(ROOT, decodeURIComponent(u.pathname));
  if (!file.startsWith(ROOT)) return send(res, 403, null);
  try {
    if ((await stat(file)).isDirectory()) file = path.join(file, "index.html");
    const data = await readFile(file);
    const type = TYPES[path.extname(file)] || "application/octet-stream";
    // Byte ranges, like GitHub Pages: lets <video> start streaming and seek before the whole file arrives.
    const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || "");
    if (m && (m[1] || m[2])) {
      const start = m[1] ? +m[1] : Math.max(0, data.length - +m[2]);
      const end = m[1] && m[2] ? Math.min(+m[2], data.length - 1) : data.length - 1;
      if (start > end) { res.writeHead(416, { "Content-Range": `bytes */${data.length}` }); return res.end(); }
      res.writeHead(206, { "Content-Type": type, "Accept-Ranges": "bytes", "Content-Range": `bytes ${start}-${end}/${data.length}`, "Content-Length": end - start + 1 });
      return res.end(data.subarray(start, end + 1));
    }
    res.writeHead(200, { "Content-Type": type, "Accept-Ranges": "bytes", "Content-Length": data.length });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": TYPES[".html"] });
    res.end(await readFile(path.join(ROOT, "404.html")).catch(() => "Not found"));
  }
}).listen(PORT, () => console.log(`dev server http://localhost:${PORT}  (mock admin: ${ADMIN.email} / ${ADMIN.password})`));

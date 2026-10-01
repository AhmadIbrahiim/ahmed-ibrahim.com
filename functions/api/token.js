// Cloudflare Pages Function: POST /api/token
//
// Mints a short-lived LiveKit token that joins a brand-new room and asks LiveKit to dispatch
// the voice agent (agent/src/agent.py, AGENT_NAME). Anything the client sends about rooms,
// identity or dispatch is ignored: this endpoint is public and every call costs money.
//
// Secrets (Pages project, never in git): LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET.
// Optional: TURNSTILE_SECRET. When set, the request must carry a valid `turnstile` token.

const AGENT_NAME = "ahmed-site";
const TOKEN_TTL_SECONDS = 300; // join window; the agent ends the call itself after 3 minutes

// Soft per-visitor limit: this many tokens per IP per window. It lives in the colo's cache, so a
// determined attacker can get around it; the hard limits are Turnstile (TURNSTILE_SECRET) and a
// Cloudflare rate-limiting rule on /api/token.
const MAX_TOKENS = 5;
const WINDOW_SECONDS = 600;

const ALLOWED_ORIGINS = new Set([
  "https://www.ahmed-ibrahim.com",
  "https://ahmed-ibrahim.com",
  "https://ahmed-ibrahim.pages.dev"
]);

function originAllowed(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  // Preview deploys (<hash>.ahmed-ibrahim.pages.dev) and local dev.
  return (
    /^https:\/\/[a-z0-9-]+\.ahmed-ibrahim\.pages\.dev$/.test(origin) ||
    /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
  );
}

const b64url = bytes =>
  btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const json = (body, status, extra = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store", ...extra }
  });

async function signJwt(payload, secret) {
  const enc = new TextEncoder();
  const head = b64url(enc.encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const body = b64url(enc.encode(JSON.stringify(payload)));
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(`${head}.${body}`));
  return `${head}.${body}.${b64url(sig)}`;
}

async function overLimit(request) {
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const key = new Request(`https://rate.invalid/${encodeURIComponent(ip)}`);
  const seen = await caches.default.match(key);
  const count = seen ? parseInt(await seen.text(), 10) || 0 : 0;
  if (count >= MAX_TOKENS) return true;
  await caches.default.put(
    key,
    new Response(String(count + 1), { headers: { "cache-control": `max-age=${WINDOW_SECONDS}` } })
  );
  return false;
}

async function turnstileOk(env, token, ip) {
  if (!env.TURNSTILE_SECRET) return true;
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token, remoteip: ip || "" })
  });
  return (await res.json()).success === true;
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get("origin");
  if (!originAllowed(origin)) return json({ error: "forbidden" }, 403);

  if (await overLimit(request)) return json({ error: "too many requests" }, 429, { "retry-after": String(WINDOW_SECONDS) });

  const { LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = env;
  if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    return json({ error: "not configured" }, 500);
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    // An empty body is fine; only the optional Turnstile token is read from it.
  }
  if (!(await turnstileOk(env, body.turnstile, request.headers.get("cf-connecting-ip")))) {
    return json({ error: "verification failed" }, 403);
  }

  const id = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);
  const token = await signJwt(
    {
      iss: LIVEKIT_API_KEY,
      sub: `visitor-${id.slice(0, 8)}`,
      name: "Visitor",
      nbf: now,
      exp: now + TOKEN_TTL_SECONDS,
      video: {
        room: `ahmed-${id}`,
        roomJoin: true,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true
      },
      // Dispatch only applies when a room is first created, hence the fresh room per visit.
      roomConfig: { agents: [{ agentName: AGENT_NAME }] }
    },
    LIVEKIT_API_SECRET
  );

  return json({ server_url: LIVEKIT_URL, participant_token: token }, 201, {
    "access-control-allow-origin": origin,
    vary: "origin"
  });
}

export function onRequest() {
  return json({ error: "method not allowed" }, 405, { allow: "POST" });
}

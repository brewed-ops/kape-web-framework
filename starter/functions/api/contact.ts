/*
  Cloudflare Pages Function: POST /api/contact
  Used by the Contact and Optin features. No dependencies, no logging of personal data.

  Order of checks (cheapest first, nothing is read until the size is known):
    1. method        POST only                       -> 405
    2. origin        Origin header = site origin     -> 403
    3. size          Content-Length <= 10 KB         -> 411 / 413 (checked BEFORE reading the body)
    4. content type  form-urlencoded or JSON         -> 415
    5. body          read with a hard byte cap, parse
    6. honeypot      `company_website` filled        -> pretend success, do nothing
    7. validate      name / email / message          -> 422
    8. Turnstile     token verified with TURNSTILE_SECRET -> 400
    9. forward       JSON to CONTACT_WEBHOOK_URL with a timeout -> 502 on failure

  Environment (set in the Cloudflare Pages dashboard, never in the repo):
    TURNSTILE_SECRET     required
    CONTACT_WEBHOOK_URL  required
    ALLOWED_ORIGIN       optional, e.g. https://example.com (defaults to the origin of the request URL)
*/

interface Env {
  TURNSTILE_SECRET?: string;
  CONTACT_WEBHOOK_URL?: string;
  ALLOWED_ORIGIN?: string;
}

interface Ctx {
  request: Request;
  env: Env;
}

const MAX_BODY_BYTES = 10 * 1024;
const TIMEOUT_MS = 5000;
const THANK_YOU = '/thank-you/'; // keep in sync with site.forms.thankYou in src/config/site.ts
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

const BASE_HEADERS: Record<string, string> = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
};

// Generic messages only. Never echo input back, never reveal which check failed beyond the status code.
const MESSAGES: Record<number, string> = {
  400: 'We could not verify your request. Please try again.',
  403: 'This request is not allowed.',
  405: 'Method not allowed.',
  411: 'This request is not allowed.',
  413: 'This request is too large.',
  415: 'This request is not allowed.',
  422: 'Please check your details and try again.',
  500: 'Something went wrong on our side. Please try again later.',
  502: 'Something went wrong on our side. Please try again later.',
};

function wantsHtml(request: Request): boolean {
  return (request.headers.get('Accept') ?? '').includes('text/html');
}

function fail(status: number, html: boolean, extra: Record<string, string> = {}): Response {
  const message = MESSAGES[status] ?? MESSAGES[500];
  if (html) {
    const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Error</title></head><body><main><h1>${message}</h1><p><a href="/">Back to the site</a></p></main></body></html>`;
    return new Response(page, { status, headers: { ...BASE_HEADERS, ...extra, 'Content-Type': 'text/html; charset=utf-8' } });
  }
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status,
    headers: { ...BASE_HEADERS, ...extra, 'Content-Type': 'application/json' },
  });
}

function success(html: boolean): Response {
  if (html) return new Response(null, { status: 303, headers: { ...BASE_HEADERS, Location: THANK_YOU } });
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...BASE_HEADERS, 'Content-Type': 'application/json' } });
}

/** Reads the body but stops (and returns null) the moment it exceeds the cap. */
async function readCapped(request: Request, cap: number): Promise<string | null> {
  if (!request.body) return '';
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > cap) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const all = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    all.set(c, offset);
    offset += c.byteLength;
  }
  return new TextDecoder().decode(all);
}

/** Drops control characters (and line/paragraph separators). Newlines and tabs survive only if `multiline`. */
function clean(value: unknown, multiline: boolean): string {
  if (typeof value !== 'string') return '';
  const stripped = multiline
    ? value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u2028\u2029]/g, '')
    : value.replace(/[\u0000-\u001F\u007F\u2028\u2029]/g, ' ');
  return stripped.trim();
}

function parseFields(raw: string, contentType: string): Record<string, unknown> | null {
  if (contentType.includes('application/json')) {
    try {
      const data: unknown = JSON.parse(raw);
      return data && typeof data === 'object' && !Array.isArray(data) ? (data as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  }
  const out: Record<string, unknown> = {};
  for (const [k, v] of new URLSearchParams(raw)) {
    if (!(k in out)) out[k] = v; // first value wins
  }
  return out;
}

async function verifyTurnstile(secret: string, token: string, ip: string | null): Promise<boolean> {
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

export const onRequest = async ({ request, env }: Ctx): Promise<Response> => {
  const html = wantsHtml(request);

  // 1. method
  if (request.method !== 'POST') return fail(405, html, { Allow: 'POST' });

  // 2. origin must equal the site origin
  const expected = env.ALLOWED_ORIGIN?.replace(/\/$/, '') ?? new URL(request.url).origin;
  // Some privacy setups strip Origin on same-origin posts; the browser-set Sec-Fetch-Site still proves it.
  const origin = request.headers.get('Origin');
  const sameSite = origin === null && request.headers.get('Sec-Fetch-Site') === 'same-origin';
  if (origin !== expected && !sameSite) return fail(403, html);

  // 3. size cap, checked before the body is read
  const lengthHeader = request.headers.get('Content-Length');
  if (lengthHeader === null) return fail(411, html);
  const length = Number(lengthHeader);
  if (!Number.isInteger(length) || length < 0) return fail(411, html);
  if (length > MAX_BODY_BYTES) return fail(413, html);

  // 4. content type
  const contentType = (request.headers.get('Content-Type') ?? '').toLowerCase();
  if (!contentType.includes('application/x-www-form-urlencoded') && !contentType.includes('application/json')) return fail(415, html);

  // 5. body (hard cap even if Content-Length lied)
  const raw = await readCapped(request, MAX_BODY_BYTES);
  if (raw === null) return fail(413, html);
  const fields = parseFields(raw, contentType);
  if (!fields) return fail(422, html);

  // 6. honeypot: real visitors never see this field. Pretend it worked.
  if (clean(fields.company_website, false) !== '') return success(html);

  // 7. validate
  const form = clean(fields.form, false) === 'optin' ? 'optin' : 'contact';
  const name = clean(fields.name, false);
  const email = clean(fields.email, false).toLowerCase();
  const message = clean(fields.message, true);
  if (name.length < 1 || name.length > 100) return fail(422, html);
  if (email.length > 254 || !EMAIL_RE.test(email)) return fail(422, html);
  if (form === 'contact' && (message.length < 1 || message.length > 2000)) return fail(422, html);
  if (message.length > 2000) return fail(422, html);

  // 8. Turnstile
  const secret = env.TURNSTILE_SECRET;
  if (!secret) return fail(500, html);
  const token = clean(fields['cf-turnstile-response'], false);
  if (token === '' || token.length > 2048) return fail(400, html);
  const human = await verifyTurnstile(secret, token, request.headers.get('CF-Connecting-IP'));
  if (!human) return fail(400, html);

  // 9. forward to the webhook
  const webhook = env.CONTACT_WEBHOOK_URL;
  if (!webhook) return fail(500, html);
  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ form, name, email, message, receivedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return fail(502, html);
  } catch {
    return fail(502, html);
  }

  return success(html);
};

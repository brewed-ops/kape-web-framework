// Tests for the parts of the starter a script can prove: the contact form handler, the four copies of the
// security headers, and the thank-you address. Run: npm test
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
// Node runs the TypeScript file directly (type stripping, on by default in the Node version this starter requires).
import { onRequest } from '../functions/api/contact.ts';

const read = (p) => readFileSync(fileURLToPath(new URL(`../${p}`, import.meta.url)), 'utf8');

// ---------- the same security headers in all four host files ----------

const HEADERS = ['Strict-Transport-Security', 'Content-Security-Policy', 'X-Content-Type-Options', 'Referrer-Policy',
  'Permissions-Policy', 'Cross-Origin-Opener-Policy', 'X-Frame-Options'];
const esc = (s) => s.replace(/[-]/g, '\\-');
const pick = {
  'public/_headers': (t, h) => new RegExp(`^\\s*${esc(h)}:\\s*(.+)$`, 'm').exec(t)?.[1],
  'vercel.json': (t, h) => JSON.parse(t).headers[0].headers.find((x) => x.key === h)?.value,
  'netlify.toml': (t, h) => new RegExp(`^\\s*${esc(h)}\\s*=\\s*"(.+)"\\s*$`, 'm').exec(t)?.[1],
  'deploy/nginx/site.conf': (t, h) => new RegExp(`^\\s*add_header ${esc(h)} "(.+)" always;`, 'm').exec(t)?.[1],
};

for (const h of HEADERS) {
  test(`${h} is identical in all four host files`, () => {
    const values = Object.entries(pick).map(([file, get]) => [file, get(read(file), h)?.trim()]);
    for (const [file, v] of values) assert.ok(v, `${h} not found in ${file}`);
    for (const [file, v] of values) assert.equal(v, values[0][1], `${file} differs from ${values[0][0]}`);
  });
}

test('the thank-you address in the form handler matches the site config', () => {
  const inHandler = /const THANK_YOU = '([^']+)'/.exec(read('functions/api/contact.ts'))?.[1];
  const inConfig = /thankYou:\s*'([^']+)'/.exec(read('src/config/site.ts'))?.[1];
  assert.ok(inHandler && inConfig);
  assert.equal(inHandler, inConfig);
});

// ---------- the contact form handler ----------

const SITE = 'https://site.test';
const ENV = { TURNSTILE_SECRET: 'real-secret', CONTACT_WEBHOOK_URL: 'https://hook.test/in' };
const GOOD = { name: 'Ana Reyes', email: 'ana@site.test', message: 'Hello there', 'cf-turnstile-response': 'token' };

let calls; // every outgoing request the handler makes
let turnstile; // what the fake Cloudflare answers
let webhookStatus;
const realFetch = globalThis.fetch;
beforeEach(() => {
  calls = [];
  turnstile = { success: true, hostname: 'site.test' };
  webhookStatus = 200;
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), body: init?.body });
    if (String(url).includes('siteverify')) return new Response(JSON.stringify(turnstile));
    return new Response(null, { status: webhookStatus });
  };
});
afterEach(() => { globalThis.fetch = realFetch; });

const post = (fields, { headers = {}, env = ENV, method = 'POST' } = {}) => {
  const body = new URLSearchParams(fields).toString();
  const request = new Request(`${SITE}/api/contact`, {
    method,
    headers: { Origin: SITE, 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': String(body.length), ...headers },
    body: method === 'POST' ? body : undefined,
  });
  for (const [k, v] of Object.entries(headers)) if (v === null) request.headers.delete(k);
  return onRequest({ request, env });
};
const forwarded = () => calls.filter((c) => c.url === ENV.CONTACT_WEBHOOK_URL);

test('a good submission is forwarded once, with only the expected fields', async () => {
  const res = await post(GOOD);
  assert.equal(res.status, 200);
  assert.equal(forwarded().length, 1);
  const sent = JSON.parse(forwarded()[0].body);
  assert.deepEqual(Object.keys(sent).sort(), ['email', 'form', 'message', 'name', 'receivedAt']);
  assert.equal(sent.email, 'ana@site.test');
});

test('a browser form post is sent to the thank-you page', async () => {
  const res = await post(GOOD, { headers: { Accept: 'text/html' } });
  assert.equal(res.status, 303);
  assert.equal(res.headers.get('Location'), '/thank-you/');
});

const rejects = [
  ['GET is refused', GOOD, { method: 'GET' }, 405],
  ['another site as Origin is refused', GOOD, { headers: { Origin: 'https://evil.test' } }, 403],
  ['no Origin and no same-origin proof is refused', GOOD, { headers: { Origin: null } }, 403],
  ['a missing Content-Length is refused', GOOD, { headers: { 'Content-Length': null } }, 411],
  ['a body over 10 KB is refused before it is read', GOOD, { headers: { 'Content-Length': '20000' } }, 413],
  ['an unexpected content type is refused', GOOD, { headers: { 'Content-Type': 'text/plain' } }, 415],
  ['a bad email is refused', { ...GOOD, email: 'not-an-email' }, {}, 422],
  ['an empty name is refused', { ...GOOD, name: '' }, {}, 422],
  ['a message over 2000 characters is refused', { ...GOOD, message: 'x'.repeat(2001) }, {}, 422],
  ['a missing Turnstile token is refused', { ...GOOD, 'cf-turnstile-response': '' }, {}, 400],
  ['a missing Turnstile secret is a server error, not a pass', GOOD, { env: { CONTACT_WEBHOOK_URL: ENV.CONTACT_WEBHOOK_URL } }, 500],
];
for (const [name, fields, opts, status] of rejects) {
  test(`${name} (${status}) and nothing is forwarded`, async () => {
    const res = await post(fields, opts);
    assert.equal(res.status, status);
    assert.equal(forwarded().length, 0);
  });
}

test('a token Cloudflare rejects is refused and nothing is forwarded', async () => {
  turnstile = { success: false };
  assert.equal((await post(GOOD)).status, 400);
  assert.equal(forwarded().length, 0);
});

test('a valid token solved on another website is refused', async () => {
  turnstile = { success: true, hostname: 'evil.test' };
  assert.equal((await post(GOOD)).status, 400);
  assert.equal(forwarded().length, 0);
});

test("Cloudflare's test secret still works for local and preview builds", async () => {
  turnstile = { success: true, hostname: 'example.com' };
  const res = await post(GOOD, { env: { ...ENV, TURNSTILE_SECRET: '1x0000000000000000000000000000000AA' } });
  assert.equal(res.status, 200);
});

test('a filled honeypot looks like success but sends nothing anywhere', async () => {
  const res = await post({ ...GOOD, company_website: 'https://spam.test' });
  assert.equal(res.status, 200);
  assert.equal(calls.length, 0);
});

test('a failing webhook is reported as an error, not as sent', async () => {
  webhookStatus = 500;
  assert.equal((await post(GOOD)).status, 502);
});

test('an error reply never echoes what the visitor typed', async () => {
  const res = await post({ ...GOOD, email: 'leak-me@nowhere' });
  assert.ok(!(await res.text()).includes('leak-me'));
});

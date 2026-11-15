// Proves the live-site checks fail when they should. Run: npm test
// Each test starts a tiny local server that misbehaves in one way and asserts the script's exit code.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = (name) => fileURLToPath(new URL(name, import.meta.url));

const GOOD_HEADERS = {
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'content-security-policy': "default-src 'self'; frame-ancestors 'none'; object-src 'none'",
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'cross-origin-opener-policy': 'same-origin',
  'x-frame-options': 'DENY',
};

/** Runs a check script against a server built from `handler`; resolves { code, out }. */
async function run(name, handler) {
  const server = createServer(handler);
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const url = `http://127.0.0.1:${server.address().port}`;
  try {
    return await new Promise((resolve) => {
      const p = spawn(process.execPath, [script(name), url]);
      let out = '';
      p.stdout.on('data', (d) => (out += d));
      p.stderr.on('data', (d) => (out += d));
      p.on('close', (code) => resolve({ code, out }));
    });
  } finally {
    server.close();
  }
}

const home = (status, headers = {}) => (req, res) => {
  if (req.url !== '/') return res.writeHead(404).end();
  res.writeHead(status, headers).end('<html></html>');
};

test('check-headers passes a 200 page with every header', async () => {
  const { code, out } = await run('check-headers.mjs', home(200, GOOD_HEADERS));
  assert.equal(code, 0, out);
});

test('check-headers fails a 200 page with no security headers', async () => {
  const { code } = await run('check-headers.mjs', home(200));
  assert.equal(code, 1);
});

test('check-headers refuses to grade an error page, even with perfect headers', async () => {
  const { code, out } = await run('check-headers.mjs', home(500, GOOD_HEADERS));
  assert.equal(code, 1);
  assert.match(out, /HTTP 500/);
});

test('check-headers refuses to grade a redirect and does not follow it', async () => {
  const { code, out } = await run('check-headers.mjs', home(301, { ...GOOD_HEADERS, location: 'https://www.example.com/' }));
  assert.equal(code, 1);
  assert.match(out, /HTTP 301/);
});

test('check-headers fails when /.env is served', async () => {
  const { code } = await run('check-headers.mjs', (req, res) => res.writeHead(200, GOOD_HEADERS).end('x'));
  assert.equal(code, 1);
});

const form = (after) => {
  let posts = 0;
  return (req, res) => {
    if (req.method !== 'POST') return res.writeHead(405).end();
    posts++;
    res.writeHead(after && posts > after ? 429 : 400).end();
  };
};

test('check-ratelimit passes when the sixth post is limited', async () => {
  const { code, out } = await run('check-ratelimit.mjs', form(5));
  assert.equal(code, 0, out);
});

test('check-ratelimit fails when nothing is ever limited', async () => {
  const { code } = await run('check-ratelimit.mjs', form(0));
  assert.equal(code, 1);
});

test('check-ratelimit reports a missing form handler instead of passing', async () => {
  const { code } = await run('check-ratelimit.mjs', (req, res) => res.writeHead(404).end());
  assert.equal(code, 2);
});

test('check-ratelimit sends a form-shaped body with no Turnstile token', async () => {
  let body = '';
  await run('check-ratelimit.mjs', (req, res) => {
    req.on('data', (d) => (body += d));
    req.on('end', () => res.writeHead(429).end());
  });
  const sent = new URLSearchParams(body);
  assert.ok(sent.get('name') && sent.get('email') && sent.get('message'));
  assert.equal(sent.get('cf-turnstile-response'), null);
});

// check-ratelimit.mjs <url> - proves the per-IP rate-limit rule on /api/contact is live. Exits 1 if it is not.
// Usage: npm run check:ratelimit -- https://example.com
// Sends 15 submissions shaped like the real form (name, email, message) but with no Turnstile token, so the
// function rejects each one (400) and nothing is ever forwarded to the webhook.
// It proves a rule limits repeated posts from one address. It does not prove every other firewall rule is right.
// Zero dependencies (Node fetch).
const input = process.argv[2];
if (!input) {
  console.error('Usage: npm run check:ratelimit -- <https://your-site.com>');
  process.exit(2);
}
const origin = new URL(input).origin;
const TRIES = 15;
const seen = [];
// Sets process.exitCode instead of calling process.exit(): on Windows that crashes Node while fetch sockets are still closing.
let code = 1;

for (let i = 1; i <= TRIES; i++) {
  let r;
  try {
    r = await fetch(`${origin}/api/contact`, {
      method: 'POST',
      redirect: 'manual',
      signal: AbortSignal.timeout(15000),
      headers: { Origin: origin, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ form: 'contact', name: 'Rate limit check', email: 'ratelimit-check@example.com', message: 'Automated rate-limit check. Safe to ignore.' }).toString(),
    });
    await r.arrayBuffer();
  } catch (e) {
    console.error(`Could not reach ${origin}: ${e?.cause?.code ?? e?.message ?? e}`);
    code = 2;
    break;
  }
  seen.push(r.status);
  // Cloudflare answers 429 for a block rule, or marks a challenge with cf-mitigated.
  if (r.status === 429 || r.headers.get('cf-mitigated')) {
    console.log(`check-ratelimit: PASS - request ${i} of ${TRIES} was limited (HTTP ${r.status}).`);
    code = 0;
    break;
  }
  if (r.status === 404 || r.status === 405) {
    console.error(`check-ratelimit: no form handler at ${origin}/api/contact (HTTP ${r.status}). If the form posts to a form service, that service does the limiting; nothing to check here.`);
    code = 2;
    break;
  }
}

if (code === 1) {
  console.error(`check-ratelimit: FAIL - ${TRIES} requests in a row, none limited (statuses: ${[...new Set(seen)].join(', ')}).`);
  console.error('Add the rate-limiting rule for /api/contact (docs/LAUNCH.md), wait a minute, run again.');
}
process.exitCode = code;

// check-headers.mjs <url> - grades a LIVE site's security headers. Exits 1 below grade A.
// Usage: npm run check:headers -- https://example.com
// Zero dependencies (Node fetch).
const input = process.argv[2];
if (!input) {
  console.error('Usage: npm run check:headers -- <https://your-site.com>');
  process.exit(2);
}
const base = new URL(input);
const origin = base.origin;

const get = async (path, init = {}) => {
  try {
    return await fetch(new URL(path, origin), { redirect: 'manual', signal: AbortSignal.timeout(15000), ...init });
  } catch (e) {
    return { error: String(e?.cause?.code ?? e?.message ?? e) };
  }
};

const home = await get('/');
if (home.error) {
  console.error(`Could not reach ${origin}: ${home.error}`);
  process.exit(2);
}
const h = (name) => home.headers.get(name) ?? '';
const rows = [];
const add = (name, points, ok, note) => rows.push({ name, points, ok, note });

const hsts = h('strict-transport-security');
const maxAge = Number(/max-age=(\d+)/i.exec(hsts)?.[1] ?? 0);
add('Strict-Transport-Security', 15, maxAge >= 31536000, hsts ? (maxAge >= 31536000 ? `max-age=${maxAge}` : `max-age too short (${maxAge}), want >= 31536000`) : 'missing');

const csp = h('content-security-policy');
const cspBad = [];
if (csp) {
  if (!/default-src\s+'self'/.test(csp)) cspBad.push("default-src 'self' missing");
  if (!/frame-ancestors\s+'none'/.test(csp)) cspBad.push("frame-ancestors 'none' missing");
  if (!/object-src\s+'none'/.test(csp)) cspBad.push("object-src 'none' missing");
  if (/'unsafe-inline'|'unsafe-eval'/.test(csp)) cspBad.push('unsafe-inline/unsafe-eval present');
  if (/(^|[\s;])\*([\s;]|$)/.test(csp)) cspBad.push('wildcard source present');
}
add('Content-Security-Policy', 25, !!csp && cspBad.length === 0, csp ? (cspBad.join('; ') || 'strict policy') : 'missing');

add('X-Content-Type-Options', 8, h('x-content-type-options').toLowerCase() === 'nosniff', h('x-content-type-options') || 'missing');
const ref = h('referrer-policy').toLowerCase();
add('Referrer-Policy', 8, ['strict-origin-when-cross-origin', 'strict-origin', 'no-referrer', 'same-origin'].includes(ref), ref || 'missing');
const pp = h('permissions-policy').toLowerCase();
const ppMissing = ['camera', 'microphone', 'geolocation', 'payment', 'usb'].filter((f) => !new RegExp(`${f}=\\(\\)`).test(pp));
add('Permissions-Policy', 8, !!pp && ppMissing.length === 0, pp ? (ppMissing.length ? `not disabled: ${ppMissing.join(', ')}` : 'sensitive features off') : 'missing');
add('Cross-Origin-Opener-Policy', 6, h('cross-origin-opener-policy').toLowerCase() === 'same-origin', h('cross-origin-opener-policy') || 'missing');
add('X-Frame-Options', 5, ['deny', 'sameorigin'].includes(h('x-frame-options').toLowerCase()), h('x-frame-options') || 'missing');
add('No X-Powered-By', 3, !h('x-powered-by'), h('x-powered-by') || 'absent');
const server = h('server');
add('Server header has no version', 3, !/\d+\.\d+/.test(server), server || 'absent');

// HTTP -> HTTPS redirect
if (base.protocol === 'https:') {
  const plain = await get(`http://${base.host}/`);
  const loc = plain.headers?.get('location') ?? '';
  const ok = !plain.error && plain.status >= 300 && plain.status < 400 && loc.startsWith('https://');
  add('HTTP redirects to HTTPS', 5, ok, plain.error ? `http:// unreachable (${plain.error})` : ok ? `${plain.status} -> ${loc}` : `status ${plain.status}`);
}

// Sensitive paths must 404
for (const p of ['/.env', '/.git/config', '/backup.zip']) {
  const r = await get(p);
  add(`${p} returns 404`, 5, !r.error && r.status === 404, r.error ? r.error : `status ${r.status}`);
}

// Cache headers on a hashed asset
const html = home.status === 200 ? await home.text() : '';
const asset = /["'](\/_astro\/[^"']+\.(?:css|js|woff2))["']/.exec(html)?.[1];
if (asset) {
  const r = await get(asset);
  const cc = r.headers?.get('cache-control') ?? '';
  add('Hashed assets cached immutable', 2, /immutable/.test(cc) && /max-age=31536000/.test(cc), cc || 'missing');
}

const total = rows.reduce((n, r) => n + r.points, 0);
const score = rows.reduce((n, r) => n + (r.ok ? r.points : 0), 0);
const pct = Math.round((score / total) * 100);
const grade = pct === 100 ? 'A+' : pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 65 ? 'C' : pct >= 50 ? 'D' : 'F';

const w = Math.max(...rows.map((r) => r.name.length));
console.log(`\ncheck-headers: ${origin} (HTTP ${home.status})\n`);
for (const r of rows) console.log(`  ${r.ok ? 'PASS' : 'FAIL'}  ${r.name.padEnd(w)}  ${String(r.ok ? r.points : 0).padStart(2)}/${String(r.points).padEnd(2)}  ${r.note}`);
console.log(`\nScore ${score}/${total} (${pct}%)  Grade: ${grade}\n`);
if (grade !== 'A+' && grade !== 'A') {
  console.log('Below A. Fix the FAIL rows, redeploy, run again.\n');
  process.exit(1);
}

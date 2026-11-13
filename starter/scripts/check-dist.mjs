// check-dist.mjs - run before every deploy: `npm run build && npm run check:dist`.
// Scans dist/ and exits 1 if anything that must never ship is in it:
// source maps, dotfiles/.env, backup or archive files, the dev-only /wireframe route, secret patterns.
// Zero dependencies.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const BAD_EXT = new Set(['.map', '.zip', '.bak', '.sql', '.env', '.log', '.tar', '.gz', '.old', '.swp', '.7z', '.rar']);
const BINARY_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.ico', '.woff', '.woff2', '.ttf', '.otf', '.pdf', '.mp4', '.webm', '.mp3']);

const SECRETS = [
  ['Stripe secret/test key', /sk_(?:live|test)_[A-Za-z0-9]{8,}/],
  ['Stripe publishable live key', /pk_live_[A-Za-z0-9]{8,}/],
  ['Anthropic key', /sk-ant-[A-Za-z0-9_-]{8,}/],
  ['OpenAI-style key', /\bsk-[A-Za-z0-9_-]{20,}/],
  ['AWS access key id', /AKIA[0-9A-Z]{16}/],
  ['GitHub token', /\bgh[pousr]_[A-Za-z0-9]{20,}/],
  ['GitHub fine-grained token', /github_pat_[A-Za-z0-9_]{20,}/],
  ['Slack token', /xox[bp]-[A-Za-z0-9-]{10,}/],
  ['JWT-like token', /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/],
  ['Private key block', /-----BEGIN (?:[A-Z]+ )?PRIVATE KEY-----/],
];

const results = [];
const add = (check, ok, detail = '') => results.push({ check, ok, detail });

if (!existsSync(DIST)) {
  console.error('dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}
const rel = (p) => relative(DIST, p).split(sep).join('/');
const files = walk(DIST);
const dirs = new Set();
for (const f of files) {
  const parts = rel(f).split('/');
  for (let i = 1; i < parts.length; i++) dirs.add(parts.slice(0, i).join('/'));
}

const maps = files.filter((f) => extname(f) === '.map');
add('No source maps (*.map)', maps.length === 0, maps.map(rel).join(', '));

// Dotfiles are forbidden, except the RFC 9116 folder /.well-known/.
const dotted = files.filter((f) => rel(f).split('/').some((seg) => seg.startsWith('.') && seg !== '.well-known'));
add('No dotfiles or .env*', dotted.length === 0, dotted.map(rel).join(', '));

const archives = files.filter((f) => BAD_EXT.has(extname(f).toLowerCase()) && extname(f) !== '.map');
add('No zip/bak/sql/log/archive files', archives.length === 0, archives.map(rel).join(', '));

const wire = files.filter((f) => /(^|\/)wireframe(\/|\.|$)/.test(rel(f)));
add('No /wireframe route (dev only)', wire.length === 0 && !dirs.has('wireframe'), wire.map(rel).join(', '));

const hits = [];
let scanned = 0;
for (const f of files) {
  if (BINARY_EXT.has(extname(f).toLowerCase())) continue;
  scanned++;
  const text = readFileSync(f, 'utf8');
  for (const [name, re] of SECRETS) {
    if (re.test(text)) hits.push(`${name} in ${rel(f)}`);
  }
}
add(`No secret patterns (${scanned} text files scanned)`, hits.length === 0, hits.join('; '));

const html = files.filter((f) => extname(f) === '.html').map((f) => [rel(f), readFileSync(f, 'utf8')]);

// The contact form posts to /api/contact, a Cloudflare Pages Function. On Vercel or Netlify that path 404s and the
// form is dead, while every other check stays green. Those hosts set VERCEL / NETLIFY during their builds.
const otherHost = process.env.VERCEL ? 'Vercel' : process.env.NETLIFY ? 'Netlify' : '';
const pagesForm = html.filter(([, t]) => /action="\/api\/contact"/.test(t)).map(([p]) => p);
add(
  'Contact form has a working endpoint on this host',
  !(otherHost && pagesForm.length),
  `${otherHost} cannot run functions/api/contact.ts; set site.forms.action in src/config/site.ts to your form service URL (${pagesForm.join(', ')})`,
);

// --launch: demo content and unconfirmed facts must not reach visitors. Not run in CI, because the starter's own
// demo pages would fail it; run it before the first deploy of a real site (npm run check:launch).
if (process.argv.includes('--launch')) {
  // The last one is Cloudflare's Turnstile test key: it always passes, so a form launched with it has no bot check.
  const PLACEHOLDERS = /\[CONFIRM|TODO\(owner\)|Larkfield|\.example\b|1x00000000000000000000AA/;
  const left = html.filter(([, t]) => PLACEHOLDERS.test(t)).map(([p, t]) => `${p} (${t.match(PLACEHOLDERS)[0]})`);
  add('No demo content or [CONFIRM] left (launch)', left.length === 0, left.slice(0, 8).join(', ') + (left.length > 8 ? ` +${left.length - 8} more` : ''));
}

const width = Math.max(...results.map((r) => r.check.length));
console.log(`\ncheck-dist: ${files.length} files in dist/\n`);
for (const r of results) {
  console.log(`  ${r.ok ? 'PASS' : 'FAIL'}  ${r.check.padEnd(width)}${r.ok ? '' : '  <- ' + r.detail}`);
}
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${failed === 0 ? 'PASS: dist is clean' : `FAIL: ${failed} check(s) failed. Do not deploy.`}\n`);
process.exit(failed === 0 ? 0 : 1);

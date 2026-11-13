# Security

Sources: two security prompts, "Security Checklist Prompt" (87 items) and "Security Audit Prompt" (41 items,
PASS / FAIL / PARTIAL / N/A per item). The starter carries both:
- `docs/SECURITY-CHECKLIST.md` - all 87 + the 10 Website and domain checks = **97**, with scope columns and the file
  that handles each item.
- `docs/SECURITY-AUDIT-PROMPT.md` - the full audit prompt; paste it into a fresh Claude session at the repo root.

## Scope decides what applies
| Site has | Applies (approx) | Must also run |
|---|---|---|
| Static pages only | ~33: headers, secrets, dotfiles, sourcemaps, deps, legal pages, domain/DNS, monitoring | check:dist, check:headers |
| + Forms | + ~20: server-side validation, honeypot, Turnstile, rate limits, CORS, no PII in logs, sub-processors | the audit prompt sections 1, 4, 6, 7 |
| + Logins | + RBAC, accounts, RLS, sessions, audit log (35+) | full audit prompt; it is probably a web app, not a website |
| + Payments | + money items, refund policy, paid files out of public/ | full audit prompt, two-account test |
| + AI features | + prompt injection, tool limits, spend caps, output as untrusted | full audit prompt |

## Baseline the starter ships (verify, do not assume)
- Same header policy in `public/_headers` (Cloudflare Pages), `vercel.json`, `netlify.toml`, `deploy/nginx/site.conf`:
  HSTS (no preload), CSP (self + Turnstile only, frame-ancestors none), nosniff, Referrer-Policy, Permissions-Policy,
  COOP, X-Frame-Options DENY, immutable cache for `/_astro/*`.
- `build.inlineStylesheets: 'never'` + no inline scripts so the CSP holds. Adding an analytics or embed script means
  adding its host to the CSP in all four files.
- `vite.build.sourcemap: false`; `scripts/check-dist.mjs` fails on maps, dotfiles, archives and secret patterns.
- `functions/api/contact.ts`: POST only, Origin check, 10KB cap before reading, honeypot, Turnstile verified
  server-side, explicit validation, generic errors, no PII logged, forwards to `CONTACT_WEBHOOK_URL`.
- `public/.well-known/security.txt`, legal pages with per-document dates in `site.ts`.
- CI: astro check, build, check:dist, npm audit (high), gitleaks, Lighthouse; Dependabot weekly.

## Launch-only items (no code can do them)
Registrar lock + 2FA on registrar, DNS, hosting, GitHub and email; CAA record; DNSSEC; SPF/DKIM/DMARC for the domain
the form replies come from; uptime + certificate monitoring; offsite backup of the repo and any CMS content, with
one restore actually tested.

## Report format
For each in-scope item: verdict + proving file (or the launch note). Findings use the audit prompt's FINDING block
(severity, CWE, location, vulnerable code, fix, effort). Rate the site CRITICAL / NEEDS WORK / ACCEPTABLE / STRONG.

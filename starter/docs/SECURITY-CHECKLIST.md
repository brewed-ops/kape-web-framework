# Security checklist

Every item from the checklist, scoped three ways, with the file in this starter that handles it.
Run it before launch and again after you add a form, an account system, or payments.

How to read the table:

- **Static site**: how the item applies to a plain static build (what this starter ships).
- **+Forms**: how it applies once the contact or opt-in form is live (`functions/api/contact.ts`).
- **+Accounts/payments**: how it applies if you add logins, a database, uploads or money. The starter ships none of that, so these cells say what you must add. Do not bolt accounts onto this starter without re-running this whole list.
- **Handled** means the starter already does it. **Applies** means you have to do or verify it. **N/A** means the feature does not exist in a static site. **Required** means it becomes mandatory.
- **Verdict** is blank on purpose. The auditor (or you) writes PASS, FAIL, PARTIAL or N/A after checking the real, deployed site. The full audit prompt for an AI or human auditor is in `SECURITY-AUDIT-PROMPT.md`.

Quick commands: `npm run build && npm run check:dist` (nothing sensitive in `dist/`) and `npm run check:headers -- https://your-domain` (live header grade, needs A or better).

## Access control

| Item | What it means | Static site | +Forms | +Accounts/payments | How this starter handles it | Verdict |
|---|---|---|---|---|---|---|
| CORS | Restrict which sites' JavaScript can read your API. It does not block direct requests, curl ignores it. Never use `*`. | N/A (no API) | Applies | Required | `functions/api/contact.ts` sends no `Access-Control-Allow-Origin` at all and requires the `Origin` header to equal the site origin. CSP `connect-src 'self'` stops other origins being called from the pages. | |
| SameSite cookies | Stops another site making requests as your logged-in user. This is your CSRF protection. | N/A (no cookies) | N/A (no cookies; the Origin check is the CSRF guard) | Required (`SameSite=Lax` or `Strict`, `HttpOnly`, `Secure`) | No cookies are set anywhere. `functions/api/contact.ts` rejects any POST whose Origin is not the site. CSP `form-action 'self'`. | |
| RLS (row level security) | The database itself refuses rows that are not the user's. Postgres only. On MySQL or SQLite, enforce it in every query. | N/A (no database) | N/A (submissions go to a webhook, not a database) | Required | No database exists in the starter. | |
| Scoped queries | The user ID goes inside the SQL statement, not in a check above it. | N/A | N/A | Required | No queries exist. | |
| Server-side gates | Hiding a button is not security. The endpoint must refuse too. | N/A | Applies | Required | `functions/api/contact.ts` re-validates every field, the origin, the size and the Turnstile token on the server. The form's `required` and `maxlength` attributes are UX only. | |
| Static files ignore your auth | Your public folder is served before your code runs. Paid downloads cannot live there. | Applies: everything in `public/` and `dist/` is world-readable | Applies | Required (private files behind signed URLs, never in `public/`) | Nothing private lives in `public/`. `scripts/check-dist.mjs` fails the build on dotfiles, archives, `.env` and secret patterns inside `dist/`. | |
| 404 instead of 403 | With sequential IDs, a 403 confirms the record exists. | Applies (dotfiles and backups should look absent) | Applies | Required for any ID lookup | `deploy/nginx/site.conf` returns 404 for dotfiles and backup extensions. `scripts/check-headers.mjs` probes `/.env`, `/.git/config` and `/backup.zip` and fails unless each is 404. | |

## Roles and permissions (RBAC)

| Item | What it means | Static site | +Forms | +Accounts/payments | How this starter handles it | Verdict |
|---|---|---|---|---|---|---|
| RBAC | Define roles server-side and check them in every endpoint. Not a UI state. | N/A (no users) | N/A | Required | No roles exist. The only endpoint is the public contact form. | |
| Never read the role from the client | localStorage and unverified tokens are user-editable. Read it from the database. This is the most common takeover. | N/A | N/A | Required | Nothing reads a role. | |
| Block mass assignment | Save only the fields you named, or someone sends `{"role":"admin"}` and promotes themselves. | N/A | Applies | Required | `functions/api/contact.ts` picks `form`, `name`, `email`, `message`, the honeypot and the Turnstile token by name. Unknown fields are ignored and never forwarded. | |
| Rank roles, do not compare them | `role === 'editor'` locks your admin out. | N/A | N/A | Required | No roles exist. | |
| Default deny | New routes refuse until you open them. | N/A | Applies: the one function allows POST only (405 otherwise) | Required | `functions/api/contact.ts` answers 405 to every other method. Only `functions/api/contact.ts` exists as dynamic code. | |
| Re-check the role per request | Otherwise revoking access waits for logout. | N/A | N/A | Required | No sessions exist. | |
| Least privilege for staff | A moderator does not need your email list. | N/A | Applies: who can read the webhook destination (inbox, CRM)? | Required | Process item. Limit who can open the destination that receives form submissions. | |
| Separate role from plan | Staff and paid are different questions. | N/A | N/A | Required | No plans or roles exist. | |
| Log privileged actions | Who granted what, when. | N/A | N/A | Required | No privileged actions exist. Deploy history in your host and git history are the change log for the site itself. | |

## Accounts

| Item | What it means | Static site | +Forms | +Accounts/payments | How this starter handles it | Verdict |
|---|---|---|---|---|---|---|
| Password hashing | argon2id, scrypt or bcrypt. Never MD5 or SHA1. | N/A | N/A | Required | No passwords are stored. | |
| Minimum 8 characters | And check against a breached-password list if you can. | N/A | N/A | Required | No password fields exist. | |
| HttpOnly cookies | Session in a cookie JavaScript cannot read, not localStorage. | N/A | N/A | Required | No sessions. The starter writes nothing to localStorage or cookies. | |
| Session expiry | Sessions end, and a fresh one is issued at login. | N/A | N/A | Required | No sessions. | |
| Email verification | Checked where sessions are validated, not just at login. | N/A | N/A | Required | No accounts. | |
| No account enumeration | Signup and forgot-password answer the same for real and fake addresses. | N/A | Applies: the form answers the same whether or not an email is known | Required | `functions/api/contact.ts` never looks anything up, so it cannot reveal whether an address exists. | |
| Kill sessions on password reset | Every device. | N/A | N/A | Required | No sessions. | |
| Timing-safe comparison | Compare tokens with a constant-time function, not `===`. | N/A | N/A | Required | No secrets are compared in code. Turnstile verification happens at Cloudflare. | |
| MFA option | TOTP is enough. | N/A | N/A | Required for admin users | No admin area exists. Turn on MFA for your host, DNS and git accounts. | |
| Account deletion | A real one the user can run themselves. | N/A | Applies: a person can ask to have their message deleted | Required (self-serve) | `src/content/legal.ts` privacy section "Your rights" explains how to ask. Deleting means removing it from the webhook destination. | |

## Abuse and cost

| Item | What it means | Static site | +Forms | +Accounts/payments | How this starter handles it | Verdict |
|---|---|---|---|---|---|---|
| Rate limiting | Per IP and per user on login, signup, uploads and anything that sends email. | N/A (the host/CDN absorbs traffic) | Applies | Required | PARTIAL by design. Turnstile, the honeypot and the 10 KB cap are in `functions/api/contact.ts`. A per-IP limit is not in code: add a Cloudflare WAF rate-limiting rule on `/api/contact` (steps in `LAUNCH.md`). | |
| Persist the counters | In-memory limits reset on every deploy and break across servers. | N/A | Applies | Required | The starter keeps no in-memory counters. Use the edge rate-limit rule above, which is persistent. | |
| Brute-force alerts | Know when someone starts guessing. | N/A | Applies: a burst of form posts | Required | Not in code. Turn on Cloudflare notifications and an uptime monitor (`LAUNCH.md`). | |
| Spend caps | Daily ceiling on paid API calls, per user and global. One script can run up your bill. | N/A | Applies if the webhook triggers paid actions (SMS, email, AI) | Required | The starter makes no paid calls itself. Put a daily cap on whatever sits behind `CONTACT_WEBHOOK_URL`. | |
| Storage caps | Lifetime, not just daily. | N/A (no uploads) | N/A | Required if uploads exist | No uploads. Request bodies are capped at 10 KB. | |
| Honeypot field | Hidden input bots fill in. Weak alone, free to add. | N/A | Handled | Handled | `src/features/contact/Contact.astro` and `src/features/optin/Optin.astro` include `company_website`; `functions/api/contact.ts` silently succeeds and discards. | |
| Disposable email blocking | Refuse temp-mail. These lists get it wrong sometimes, so never block a paying customer. | N/A | Optional | Optional | Not included on purpose (false positives). Add a block-list check in `functions/api/contact.ts` only if spam proves it necessary. | |

## Input and files

| Item | What it means | Static site | +Forms | +Accounts/payments | How this starter handles it | Verdict |
|---|---|---|---|---|---|---|
| Validate server-side | Price, plan, role, quantity, ID. Browser values are claims, not facts. | N/A | Handled | Required | `functions/api/contact.ts`: explicit length limits, email regex, control characters stripped, types checked. | |
| Parameterized queries | Never build SQL from strings. | N/A | N/A | Required | No SQL anywhere. | |
| Command injection | Never put user input in a shell command. Pass arguments as an array. | N/A | N/A | Required if you shell out | No child processes are spawned from user input. `scripts/new-feature.mjs` only accepts `^[a-z][a-z0-9-]*$`. | |
| Magic-byte file checks | Validate by signature, not extension. | N/A (no uploads) | N/A | Required if uploads exist | No uploads exist. | |
| Magic bytes alone are not enough | Also cap size, re-encode images, and never serve uploads with an executable type. | N/A | N/A | Required if uploads exist | No uploads exist. | |
| Check limits before reading the file | A quota check after buffering already cost you the memory. | N/A | Handled | Required | `functions/api/contact.ts` checks `Content-Length` before reading, then reads through a capped reader that aborts at 10 KB even if the header lied. | |
| Never build a path from user input | Look the ID up in a fixed list. This is directory traversal. | N/A | N/A | Required | The function touches no file system. | |
| Sanitize HTML with DOMPurify | Do not write your own. Frameworks escape text already, so the risk is raw-HTML injection. | Applies: never pass visitor-supplied text to `set:html` | Applies | Required | Astro escapes all text. `set:html` is used only for constant icon paths (`Icon.astro`) and escaped JSON-LD (`JsonLd.astro` replaces `<` with `<`). The function never echoes input. | |
| No open redirects | Allowlist post-login destinations, or your domain fronts a phishing link. | N/A | Applies | Required | The only redirect (`303` to `/thank-you/`) is a constant in `functions/api/contact.ts`, never taken from the request. | |
| SSRF protection | Allowlist the host, block private IPs and 169.254.169.254, re-check on every redirect. | N/A | Applies | Required | The two outbound calls use fixed targets: the Turnstile verify URL and `CONTACT_WEBHOOK_URL` from the server environment. No visitor-supplied URL is ever fetched. | |

## AI features

| Item | What it means | Static site | +Forms | +Accounts/payments | How this starter handles it | Verdict |
|---|---|---|---|---|---|---|
| Prompt injection | Scraped pages, user messages and uploads can contain instructions. Label them as data, never as commands. | N/A (no AI feature) | Applies if the webhook feeds form text to an AI | Required if AI exists | No AI in the starter. If your automation sends form text to a model, treat it as data. | |
| Limit what the model can do | Read-only tools first, no delete, cap writes per turn and per day. | N/A | Applies if as above | Required if AI exists | No AI in the starter. | |
| No user data in the system prompt | Unless it is required, and never another user's. | N/A | Applies if as above | Required if AI exists | No AI in the starter. | |
| Treat model output as untrusted | Do not run it, render it as HTML, or put it in a query. | N/A | Applies if as above | Required if AI exists | No AI in the starter. | |

## Browser and headers

| Item | What it means | Static site | +Forms | +Accounts/payments | How this starter handles it | Verdict |
|---|---|---|---|---|---|---|
| HTTPS everywhere | No mixed content. The certificate is free. | Applies | Applies | Required | CSP `upgrade-insecure-requests`; HSTS; HTTP to HTTPS redirect in `deploy/nginx/site.conf`; managed hosts redirect automatically. Verify with `npm run check:headers`. | |
| CSP | Controls which scripts may run, blocking most injected code. Use nonces if you have inline scripts. | Handled | Handled | Required | Strict policy in `public/_headers`, `vercel.json`, `netlify.toml`, `deploy/nginx/site.conf`. The build emits no inline scripts or `style=` attributes (`astro.config.mjs`: `inlineStylesheets: 'never'`, `assetsInlineLimit: 0`), so no nonces or `unsafe-inline` are needed. JSON-LD is a data block, not executed script. | |
| HSTS | Forces HTTPS. Preload is hard to undo. | Handled | Handled | Required | `max-age=63072000; includeSubDomains`, deliberately without `preload` (note in each header file). | |
| frame-ancestors none | Stops clickjacking. Replaces X-Frame-Options. | Handled | Handled | Required | CSP `frame-ancestors 'none'` plus legacy `X-Frame-Options: DENY`. | |
| nosniff | Stops the browser guessing a file is a script. | Handled | Handled | Required | `X-Content-Type-Options: nosniff` in all four header configs and in the function responses. | |
| Cache-Control | `private` behind a login, `no-store` for sensitive data, so a CDN never replays it to someone else. | Handled | Handled | Required | `/_astro/*` is `immutable` for one year; HTML revalidates; `functions/api/contact.ts` responses are `no-store`. Add `private`/`no-store` to every logged-in response if you build accounts. | |
| No stack traces in production | They hand over your framework, paths and queries. | N/A | Handled | Required | `functions/api/contact.ts` returns generic messages from a fixed table and has no logging or `catch` that echoes errors. `404.astro` is a plain page. | |
| Remove X-Powered-By | Smallest item here, and free. | Handled (managed hosts send none) | Handled | Required | `server_tokens off` in `deploy/nginx/site.conf`; `scripts/check-headers.mjs` fails if `X-Powered-By` or a versioned `Server` header appears. | |

## Secrets

| Item | What it means | Static site | +Forms | +Accounts/payments | How this starter handles it | Verdict |
|---|---|---|---|---|---|---|
| Env vars only | And check your git history, not just current files. | Applies | Applies | Required | `.env.example` lists names only; `.gitignore` covers `.env`, `.env.*`. CI runs gitleaks over full history (`.github/workflows/ci.yml`, `fetch-depth: 0`). | |
| No secret in frontend code | `NEXT_PUBLIC_` and `VITE_` variables ship to the browser. Search your build output. | Applies | Applies | Required | The only browser-side variable is `PUBLIC_TURNSTILE_SITE_KEY`, which is public by design (`src/lib/env.ts`). Server secrets are read only in `functions/api/contact.ts`. `npm run check:dist` greps `dist/` for key patterns. | |
| Block dotfiles and backups | `/.env`, `/.git` and stray `.zip` files must 404. Scanners check these within minutes of launch. | Applies | Applies | Required | `deploy/nginx/site.conf` blocks them; `scripts/check-dist.mjs` refuses to ship them; `scripts/check-headers.mjs` probes the live site. Only `dist/` is uploaded, never the repo root. | |
| Sourcemaps off in production | Or your source is one click away in DevTools. | Handled | Handled | Required | `astro.config.mjs`: `vite.build.sourcemap: false`; `check-dist` fails on any `*.map`. | |
| Least privilege | Narrowest permissions on your database user and API keys. Not admin. | Applies | Applies | Required | CI workflow has `permissions: contents: read`. The Turnstile secret and the webhook URL are single-purpose. Give the webhook a scoped token if the destination offers one. | |
| Encrypt third-party tokens at rest | The tokens your users hand you for their own accounts are theirs, not yours. | N/A | N/A | Required | The starter stores no tokens. | |
| Do not roll your own crypto | Use the platform library. | Handled | Handled | Required | No crypto in the code. | |
| Rotate any leaked secret | Once it is in a repo or a screenshot, it is burned. | Applies | Applies | Required | Process item: if gitleaks or `check:dist` fires, rotate first, then clean history. Steps in `LAUNCH.md`. | |

## Infrastructure

| Item | What it means | Static site | +Forms | +Accounts/payments | How this starter handles it | Verdict |
|---|---|---|---|---|---|---|
| Remove test and default accounts | The seeded admin with the obvious password. | Applies: remove demo content and dummy keys | Applies | Required | `src/lib/env.ts` warns when the Turnstile test key is used in a production build. Search for `TODO(owner)` and `[CONFIRM` before launch (`LAUNCH.md`). | |
| No public debug endpoints | API docs, database panels, health checks that dump config. | Applies | Applies | Required | The dev-only `/wireframe` route is injected only for `astro dev` and `check-dist` fails if it is in `dist/`. The Astro dev toolbar is off. | |
| Firewall your origin | Behind Cloudflare, block direct hits to the server IP or your WAF is skipped. | N/A on Pages, Vercel, Netlify | Applies if self-hosting | Required if self-hosting | Self-hosted Nginx only: allow ports 80/443 from Cloudflare ranges (`deploy/nginx/site.conf` comments, `LAUNCH.md`). | |
| Memory cap on the process | One heavy request should not take the server down. | N/A (no process) | Applies | Required | `client_max_body_size 16k` in Nginx; the function caps bodies at 10 KB. Platform limits cover the rest. | |
| Update dependencies | `npm audit`, commit your lockfile, turn on Dependabot. Most breaches come through a package. | Applies | Applies | Required | Exact versions in `package.json`, `package-lock.json` committed, `npm ci` and `npm audit --audit-level=high` in CI, `.github/dependabot.yml` weekly. | |
| Automated offsite backups | Nightly, encrypted, with retention. | Applies: source in git is the backup | Applies: back up wherever submissions land | Required | The site is rebuilt from git. Make sure the repo has an offsite remote and that the form destination (CRM, inbox, sheet) has its own backup. | |
| Actually test a restore | A backup you never restored is a guess. | Applies | Applies | Required | Process item in `LAUNCH.md`: deploy the repo to a fresh project once and confirm it matches. | |
| Audit log | Who changed what, when. You need it exactly once. | Applies (git history, host deploy log) | Applies | Required | Git history and the host's deploy log. No in-app audit log because there is no admin. | |
| Do not log personal data | Logs get copied and shared. No passwords, tokens or full request bodies. | Applies | Handled | Required | `functions/api/contact.ts` has no logging statements at all. | |
| Alerting | Learn about the 500s before your users tell you. | Applies | Applies | Required | Not in code. Set an uptime monitor and Cloudflare notifications (`LAUNCH.md`). | |
| Security contact | Somewhere for a researcher to report a hole instead of posting it. | Handled | Handled | Required | `public/.well-known/security.txt` (RFC 9116). Replace the placeholder mailbox and renew the `Expires` line yearly. | |

## The legal pages

These pages are templates, not legal advice. Every business-specific fact is marked `[CONFIRM: ...]`. Resolve each marker and have a qualified person review them for your jurisdiction.

| Item | What it means | Static site | +Forms | +Accounts/payments | How this starter handles it | Verdict |
|---|---|---|---|---|---|---|
| Terms of service | What the service is, what users may not do, when you can suspend an account, and your liability limits. A disclaimer does not override consumer law. | Applies | Applies | Required | `src/pages/terms.astro` with words in `src/content/legal.ts`. | |
| Privacy policy | What you collect, why, how long, and how to get it deleted. Legally required almost everywhere once you handle personal data. | Applies (server logs) | Required | Required | `src/pages/privacy.astro`: what is collected, why, legal basis, retention, rights, transfers, children, contact. | |
| Sub-processor list | Every company that touches user data. Email sender, storage, AI provider, analytics. One new API call adds one company. | Applies | Required | Required | Table in `src/pages/privacy.astro`, rows in `src/content/legal.ts`. Add a row for every tool you connect. | |
| Cookie disclosure | A session cookie needs disclosing, not consent. Analytics and ad cookies need consent. | Applies | Applies | Required | `src/pages/cookies.astro`. The starter sets no cookies and loads no analytics. Add each one you introduce, and gate analytics behind consent. | |
| Refund policy | Say plainly whether refunds exist. A blanket "no refunds" does not remove statutory rights. | N/A | Applies if you take bookings or deposits | Required | "Refunds" section in `src/content/legal.ts` (terms) with a `[CONFIRM]` marker. | |
| Data processing terms | Required if your users put their own customers' data in your app. | N/A | N/A | Required | Not in the starter (no app). Add a DPA if you build one. | |
| Export and deletion | The right to get data out, and to be forgotten. | Applies | Applies | Required (self-serve) | "Your rights" section in the privacy page. In practice: delete the person's entry from the form destination. | |
| Date each document separately | And only when that document actually changes. | Applies | Applies | Required | `legal.privacyUpdated`, `termsUpdated`, `cookiesUpdated` in `src/config/site.ts`, rendered by `src/components/ui/LegalDoc.astro`. | |

## Money

| Item | What it means | Static site | +Forms | +Accounts/payments | How this starter handles it | Verdict |
|---|---|---|---|---|---|---|
| One path to access | Exactly one place in your code grants a paid plan. | N/A | N/A | Required | No payments. If you take money, use a hosted checkout (payment link) and have a single webhook handler grant access. | |
| Recompute totals server-side | The amount in the request is something the user typed. | N/A | N/A | Required | No payments. | |
| Verify webhook signatures | Anyone can POST to your payment webhook and claim an order was paid. | N/A | N/A | Required | No payment webhook. `functions/api/contact.ts` is the only endpoint and is guarded by Origin and Turnstile instead. | |
| Idempotency keys | A double-click must not charge or grant twice. | N/A | N/A | Required | No payments. | |
| Test with two accounts | Log in as A, copy an ID, try to open it as B. This one manual test finds more real holes than any scanner. | N/A | Applies in spirit: post to `/api/contact` with no Origin and with a wrong Origin, expect 403 both times | Required | Manual test. For forms: `curl -i -X POST https://your-domain/api/contact -d name=a` (no Origin) must not reach the webhook. | |

# Launch checklist

Tick each line. Do not launch with an unticked line in "Before launch".

## Before launch

### Content and facts
- [ ] Search the repo for `TODO(owner)` and `[CONFIRM` and `Larkfield` and `.example`. Every hit is resolved or deleted.
- [ ] `src/config/site.ts`: final name, URL (https, no trailing slash), phone, email, address, hours, socials.
- [ ] Legal pages read by a qualified person for your jurisdiction. These are templates, not legal advice.
- [ ] Legal dates: each of `privacyUpdated`, `termsUpdated`, `cookiesUpdated` is the date that document last really changed.
- [ ] Favicon (`public/favicon.svg`) and share image (`public/og-default.png`, 1200 x 630) are the client's.
- [ ] Every image has meaningful alt text. Placeholder SVGs in `public/images/` are replaced.

### Domain, DNS, HTTPS
- [ ] Domain points at the host. DNS records checked (A/CNAME, MX if email, SPF/DKIM/DMARC for the sending domain).
- [ ] HTTPS certificate active; HTTP redirects to HTTPS; `www` redirects to the one canonical host.
- [ ] `npm run check:headers -- https://your-domain` prints grade **A or A+**.
- [ ] Second opinion on the headers from a scanner this project did not write: run the domain through MDN HTTP Observatory (https://developer.mozilla.org/en-US/observatory) and note the grade in `docs/HANDOFF.md`. `check:headers` is this starter grading itself.
- [ ] `/.env`, `/.git/config`, `/backup.zip` return 404 (the header check probes these).

### Build and quality
- [ ] `npm run build` passes with the real `PUBLIC_TURNSTILE_SITE_KEY` (not the `1x000...` test key).
- [ ] `npm run check:dist` prints PASS.
- [ ] CI is green on the commit you deploy (`astro check`, tests, build, check:dist, audit, gitleaks, Lighthouse on every page).
- [ ] Lighthouse on the live URL: performance 90+, accessibility, best practices and SEO 100.
- [ ] 404 page works (open a made-up URL).
- [ ] Keyboard test, every page: Tab from the top to the footer. The skip link appears first, every focus ring is visible, nothing traps the focus, the mobile menu opens and closes, and the form can be filled and sent without a mouse.
- [ ] Screen-reader test, home and contact pages (NVDA on Windows or VoiceOver on Mac, both free): headings read in order, every image and icon button has a name, form fields announce their label and their error. Lighthouse 100 only covers what a machine can see.

### Forms, end to end
- [ ] Turnstile secret and site key are the real ones; `CONTACT_WEBHOOK_URL` is set in the host dashboard.
- [ ] Submit the contact form on the live site: you land on `/thank-you/` and the message arrives at the destination.
- [ ] Submit the opt-in form (funnel) the same way.
- [ ] Failure test: `curl -i -X POST https://your-domain/api/contact -d name=a` returns 403 (no Origin) and nothing reaches the destination.
- [ ] Add a Cloudflare WAF rate-limiting rule for `/api/contact` (for example 5 requests per minute per IP). The function has Turnstile and a size cap but no per-IP counter.
- [ ] `npm run check:ratelimit -- https://your-domain` prints **PASS** (it sends 15 empty submissions and expects the rule to block one; nothing reaches the destination).
- [ ] The destination of the webhook has its own backup and limited access.

### Security housekeeping
- [ ] `public/.well-known/security.txt`: real mailbox, `Expires` set within a year (calendar reminder to renew).
- [ ] Secrets: only in the host dashboard. `git log -p -- .env` shows nothing. If any secret ever hit git, rotate it now.
- [ ] Self-hosting Nginx behind Cloudflare: firewall allows ports 80/443 only from Cloudflare ranges.
- [ ] Two-factor authentication on the host, DNS, registrar and git accounts.
- [ ] Uptime monitor on the home page and on `/contact/`; Cloudflare notifications on.
- [ ] Backups: git remote is offsite; form destination is backed up. Restore test: deploy the repo to a fresh project once and compare.
- [ ] `docs/SECURITY-CHECKLIST.md` verdict column filled from the live site. Run `docs/SECURITY-AUDIT-PROMPT.md` and fix every FAIL.

### Analytics, consent, search
- [ ] Analytics: none by default. If you add any, load it only after consent, add it to `/cookies/` and the sub-processor table in `/privacy/`, and update those pages' dates.
- [ ] Google Search Console: add the property, verify the domain, submit `https://your-domain/sitemap-index.xml`.
- [ ] Bing Webmaster Tools: import from Search Console.
- [ ] Share preview: paste the URL into a link-preview checker (or send it to yourself in a chat) and confirm title, description and image.
- [ ] Run `/seo audit https://your-domain` and fix what it flags (see `docs/SEO.md`).

### Handoff
- [ ] Owner has a copy of the repo and knows `docs/HANDOFF.md`.
- [ ] Content backup: the `src/content/` and `src/config/` folders are saved somewhere the owner controls.

## Launch day

- [ ] Deploy from a clean, committed, pushed state (`git status` shows nothing).
- [ ] Hard-refresh the live site (cache cleared) and click through every page.
- [ ] Re-run `npm run check:headers -- https://your-domain` against production.
- [ ] Send one real form submission and confirm it lands.
- [ ] Announce.

## Day 1 to 7

- [ ] Day 1: Search Console shows the sitemap as "Success" and no coverage errors. Check the host's logs for 404 and 5xx spikes.
- [ ] Day 2: Read the first real submissions. Confirm replies go out and nothing is stuck in spam.
- [ ] Day 3: Re-run Lighthouse on mobile; confirm Core Web Vitals look fine in Search Console as data appears.
- [ ] Day 5: Check that important pages are indexed (`site:your-domain` in a search engine). Fix anything missing.
- [ ] Day 7: Run `/seo audit https://your-domain` again. Review the form spam rate and tune the rate-limit rule. Check `npm audit` and merge the first Dependabot PRs.

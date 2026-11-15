---
name: kape-web
description: KAPE Web Framework - build a client WEBSITE (portfolio, landing page, funnel, or multi-page business site; not a web app) through five gated phases - brief (scratch or inspiration, stack recommendation), foundation (site type, schema, 1 feature 1 file, grey wireframe, security baseline), design and build per section (Stageshow for real interfaces, no AI slop, Ponytail review), prove (97-point security list, claude-seo audit, Lighthouse), ship and hand off. Starts every site from the KAPE starter (Astro + Tailwind v4 + TS, headers for Cloudflare/Vercel/Netlify/Nginx, check:dist, check:headers). Use when the user says "KAPE Web", "kape web", "KAPE Web Framework", "build a website/landing page/funnel/portfolio site for <client>", "new website from this inspo", or pastes a website screenshot and asks for a site like it. Not for web apps with logins or user data, and not for funnels built inside a CRM's own page builder.
---

# KAPE Web Framework

Websites, not apps. Five phases, each ending at a gate. Every step has an owner:
**YOU** = the user (or their client) decides, **AI** = you do it, **AUTO** = a script or CI proves it.
Never skip a gate; never let the AI decide a YOU step.

**Framework folder (`<home>`):** read the `HOME` file next to this SKILL.md; `install.mjs` writes the absolute path of
the downloaded KAPE Web Framework folder there. If `HOME` is missing or the path no longer exists, ask once:
"Where did you download the KAPE Web Framework folder?", check that `<that path>/starter/package.json` exists, and
write the path to `HOME`. Inside it: `starter/` (copied for every site) and `skill/` (this skill's source). The
method, explained for people, is at https://brewedops.cloud/webframework/.

**Talk to a beginner.** Many users have never used a terminal. Run every command yourself, say in one plain line
what it does before running it, and paste the result in plain words. Never ask them to type into a terminal.

**Before the first site on a computer**, check the tools and install what is missing (say what each one is):
Node.js 22 LTS at or above the `engines` version in `<home>/starter/package.json` (compare with `node -v`; older
Node fails at `npm install`), git (`git --version`), and the three below. GitHub CLI (`gh`) is optional.

Built on two repos, installed as Claude Code plugins:
- **claude-seo** (`AgriciDaniel/claude-seo`): `/seo audit <url>`, `/seo page`, `/seo schema`, `/seo technical`, `/seo geo`, `/seo local`, `/seo sitemap`. First run on a machine: `/seo setup`, check with `/seo doctor`.
- **Ponytail** (`DietrichGebert/ponytail`): always-on minimal-code ruleset + `/ponytail-review` (current change), `/ponytail-audit` (whole repo), `/ponytail-debt` (`shortcut:` ledger).
If either is missing: `claude plugin marketplace add <repo>` then `claude plugin install claude-seo@agricidaniel-claude-seo` / `ponytail@ponytail`; a plugin loads in the NEXT Claude Code session, so tell the user to restart Claude Code once after installing.
And one skill: **Stageshow** (`benjitaylor/skills`, MIT) for real product interfaces. If `~/.claude/skills/stageshow/SKILL.md`
is missing: `npx skills add benjitaylor/skills --skill stageshow`.

## Phase 1 - Before the build (pre-foundation)

1. **YOU - scratch or inspiration.** Ask exactly this if not already said:
   "From scratch, or from an inspiration? If inspiration, paste the screenshot or link, or describe it."
   - Inspiration: read the image/page (screenshot -> Read; URL -> defuddle, or Playwright for JS sites). Write down
     what to KEEP (layout moves, type scale, density, one signature interaction), what to DROP (their brand, copy,
     stock photos, anything on the slop list). Never copy their logo, copy or exact layout; take the decisions.
   - Scratch: ask the 4 facts below and move on.
2. **Facts (one message, all at once):** business + what the site must make visitors do; site type (portfolio /
   landing / funnel / website - recommend one if unsure, `references/site-types.md`); pages; brand assets (logo,
   colors, fonts) or "none yet"; forms? logins? payments? (drives the security scope). Unknown facts become
   `[CONFIRM: ...]`, never invented.
3. **AI - recommend the stack** from `references/stack-matrix.md`. Give the pick + one-line reason per layer + the
   monthly running cost + what would change the pick. Default for a business website: the KAPE starter.
4. **YOU - approve the brief.** Write `BRIEF.md` in the new site folder (goal, audience, site type, pages, keep/drop
   from the inspiration, stack, security scope, open `[CONFIRM]`s). Stop until approved.

## Phase 2 - Lay the foundation

1. **Scaffold** (AI): ask where the user keeps projects (suggest a `Sites` folder in their home folder), then copy
   `<home>/starter/` to `<that folder>/<site-slug>/` without `node_modules/` or `dist/`. Never inside another git
   repo (`git -C <parent> rev-parse` must fail). Then `git init`, first commit, `npm install`, and copy
   `.env.example` to `.env` (Cloudflare's test Turnstile key; the build stops without it, and `.env` stays untracked). If `gh` is installed
   and signed in, offer `gh repo create <slug> --private --source . --push`.
2. **Site type + facts** (AI): set `siteType` and business facts in `src/config/site.ts`; section order lives in
   `src/config/sections.ts`. Every word goes in `src/content/<feature>.ts`; components only render.
   **1 feature = 1 folder = 1 file** (`src/features/<name>/<Name>.astro`); add one with `npm run new:feature -- <name>`.
3. **Schema** (AI): map pages to schema types (`references/seo.md`) - Organization or LocalBusiness + WebSite on
   home, Service/FAQPage/BreadcrumbList where they apply, via `src/lib/schema.ts`.
4. **Security baseline** (AUTO): headers already ship for 4 hosts. Run `npm run build && npm run check:dist`. Mark
   the scope (static / +forms / +logins / +payments / +AI) at the top of `docs/SECURITY-CHECKLIST.md`.
5. **Grey wireframe first** (AI): `npm run dev`, open `/wireframe` (dev-only route, never in the build). Real
   sections at real sizes, labelled. Screenshot it at 1440 and 390 for the client.
6. **YOU - approve the wireframe.** Moving blocks is free here; after design it costs a day.

## Phase 3 - Design and build (repeat per section)

**The design is the user's call, not yours.** They are the web developer: the look, the layout and the taste are
theirs. Say this once at the start of the phase, then ask what they already have in mind (brand, references, fonts,
a layout) and build that. The design rules and the slop list are reminders that keep the result from looking
AI-made; Stageshow is a guide for the interface parts. Neither one chooses the design, and a rule never beats a
choice the user has stated.

Before the first section: a design brief in one paragraph (direction, type, spacing, one motif), then tokens in
`src/styles/tokens.css` - the ONLY place hex values live. One accent. Rules: `references/design-rules.md`.

Per section, in order:
1. **AI - design.** Where the section shows a product, screen or process, build it with the **stageshow** skill
   (real interface, real logos via Simple Icons/BrandMark, never a sketch). Everything else: type, space, one image.
2. **AI - build** the one section from tokens. Spacing on the 4px scale; fluid type with clamp(); animate only
   transform/opacity; `min-h-[100dvh]`; reduced-motion respected.
3. **AUTO - check:** `npx astro check && npm run build && npm run check:dist`. Screenshot 1440 + 390 with headless
   Playwright (first time: `npx playwright install chromium`), then LOOK at both; no horizontal overflow at 390.
4. **AI - review:** `/ponytail-review`; fix every must-fix; re-run until clean.
5. **YOU - approve the section**, then the next one.

## Phase 4 - Prove it

1. **AUTO - security verdicts:** every in-scope item in `docs/SECURITY-CHECKLIST.md` gets PASS / N/A with the file
   that proves it. Forms, logins, payments or AI in scope -> also run `docs/SECURITY-AUDIT-PROMPT.md` (every item
   PASS / FAIL / PARTIAL / N/A, FINDING format, ranked fixes). Detail: `references/security.md`.
2. **AI - SEO:** `/seo audit <preview-url>`; fix, re-run. Titles 50-60 chars, descriptions 140-160, one h1, canonical,
   sitemap, schema valid, OG image.
3. **AUTO - Lighthouse:** perf >= 0.9, a11y / best practices / SEO = 1.0 (`lighthouserc.json`, CI runs it).
4. **AUTO - launch content:** `npm run build && npm run check:launch` must PASS: no demo content (Larkfield,
   `.example` URLs), no `[CONFIRM]`, no `TODO(owner)` left in any page, legal pages included.
5. **Forms (if in scope) - YOU + AUTO:** the form must deliver for real before launch.
   - Host: the starter's form handler (`functions/api/contact.ts`) runs only on **Cloudflare Pages**. On Vercel,
     Netlify or Nginx, set `site.forms.action` in `src/config/site.ts` to a form service URL (Formspree, Basin, a
     CRM webhook) or the form 404s; `check:dist` fails the Vercel/Netlify build when this is missed.
   - In the Cloudflare dashboard set `TURNSTILE_SECRET`, `CONTACT_WEBHOOK_URL` (where submissions go: an email
     service, n8n/Zapier/Make, or a CRM) and `PUBLIC_TURNSTILE_SITE_KEY`. Unset = every submission errors.
   - Add the per-IP rate-limit rule in `docs/LAUNCH.md` (Cloudflare WAF). Not optional for a public form.
   - **AUTO:** `npm run check:ratelimit -- https://<domain>` must PASS; it proves the rule is live, not just planned.
   - Send one real submission on the preview and confirm it arrived where the client reads it.
6. **Analytics (only if the client wants it):** prefer cookieless (Cloudflare Web Analytics or Plausible) so no
   consent banner is needed; add its host to `script-src`/`connect-src` in ALL FOUR header files and to the privacy
   page. Cookie-based analytics (GA4, Meta Pixel) need a consent gate that loads them only after "Accept".

## Phase 5 - Ship and hand off

1. **YOU - say "deploy"** for this change. Then follow `references/deploy.md` in order: preflight, rollback ready
   before upload, deploy, prove live. A push to a branch that auto-deploys IS a deploy and needs the same go.
2. **AUTO - prove live:** `npm run check:headers -- https://<domain>` must grade A or better; `/.env`, `/.git/config`
   return 404; send the real form once; `/seo audit https://<domain>` on the live site; submit the sitemap in
   Search Console. Run through `docs/LAUNCH.md` (DNS, CAA, SPF/DKIM/DMARC, registrar lock, 2FA, monitoring).
3. **AI - hand it over:** update `docs/HANDOFF.md` for this client (where words, facts, colors, sections live),
   confirm the ownership list (domain, repo, hosting, analytics, Search Console in the client's name), and add a
   dated line to the changelog at the bottom of `docs/HANDOFF.md`.

## Rules that do not bend
- Websites only. Logins, dashboards, user data -> stop: that is a web app (auth, database, sessions), not this skill.
- Never invent business facts, prices, credentials or reviews: `[CONFIRM: ...]`.
- No secret in `PUBLIC_` vars or anywhere in `dist/`; `check:dist` failing blocks every deploy.
- Check every screenshot against the slop list in `references/design-rules.md` before showing anyone, and tell the
  user about each hit. Fix it by default; keep it if they chose it on purpose. The design is their call.
- When a site-specific fix proves universal, fold it into `starter/` (and this skill) the same session.

## Files
- `references/stack-matrix.md` - which stack for which site, with costs.
- `references/site-types.md` - the 4 site types: sections, wireframe standards, conversion rules.
- `references/design-rules.md` - whose call the design is, look, spacing, type, motion, the slop list, Stageshow usage.
- `references/security.md` - scope table, the 97-point list, when to run the full audit prompt.
- `references/seo.md` - schema map, on-page rules, claude-seo commands by phase.
- `references/deploy.md` - the deploy gate: preflight, rollback, deploy order, prove live.

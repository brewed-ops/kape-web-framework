# KAPE Web Framework

A way to build client websites with Claude Code that come out structured, secure and findable, instead of looking
like every other AI website. You make the calls; the AI builds one section at a time; scripts check every piece.

For **websites**: portfolios, landing pages, funnels and small business sites. Not for web apps with logins or a
database.

## What is in this folder

| Part | What it is |
|---|---|
| `skill/kape-web/` | The Claude Code skill. It runs the whole method in five steps and stops for your approval at each one. |
| `starter/` | The website every new site is copied from: Astro + Tailwind + TypeScript, security headers for four hosts, SEO markup, legal pages, a protected contact form, and the build checks. |
| [brewedops.cloud/webframework](https://brewedops.cloud/webframework/) | The framework page: the whole method, step by step, with what each stage looks like. |
| `install.mjs` | Installs the skill into Claude Code. |

## What you need

- [Claude Code](https://claude.com/claude-code), with a Claude subscription or an API account.
- [Node.js](https://nodejs.org) LTS, version 22 or newer. The installer tells you if yours is too old.
- [git](https://git-scm.com/downloads).
- Optional: a free [GitHub](https://github.com) account, and a free [Cloudflare](https://dash.cloudflare.com/sign-up) account to host the sites.

## Install (about 5 minutes)

1. Download the kit ([zip](https://github.com/brewed-ops/kape-web-framework/archive/refs/heads/main.zip), or the
   green **Code** button > **Download ZIP**), unzip it, and put it somewhere you keep projects. On Windows, unzipping
   can leave a folder inside a folder with the same name: use the inner one, the one with `install.mjs` in it.
   Do not move it after installing: the skill remembers where it is. If you move it, run the installer again.
2. Open Claude Code **inside that folder** and type:

   > Run node install.mjs, then install whatever else the kape-web skill needs: claude-seo, Ponytail and Stageshow.

   Claude runs the installer and adds the three helpers it is built on:
   - [claude-seo](https://github.com/AgriciDaniel/claude-seo) - SEO audits the way Google and AI search see a site.
   - [Ponytail](https://github.com/DietrichGebert/ponytail) - keeps the code small and reviews every change.
   - [Stageshow](https://github.com/benjitaylor/skills) - builds real-looking product screens for the design.
3. Restart Claude Code once (new skills and plugins load on start), then type `/seo setup` once.

Prefer a terminal? `node install.mjs` does step 2's first part; the helper commands are on the framework page and
in `skill/kape-web/SKILL.md`.

## Build your first site

In Claude Code, from any folder, type:

> kape web - new site

It asks whether you start from scratch or from an inspiration (paste a screenshot), recommends the stack, then
walks through foundation, wireframe, design, checks and launch. It never deploys until you say "deploy".

## The checks every site passes

Run inside a site folder (the skill runs them for you):

| Command | Proves |
|---|---|
| `npm run build && npm run check:dist` | No secrets, source maps or dotfiles in the build; the form works on this host |
| `npm run check:launch` | No demo content, `[CONFIRM]` placeholders or test keys left before go-live |
| `npm run check:headers -- https://your-domain` | The home page answers 200 and every security header is live, grade A or better |
| `npm run check:ratelimit -- https://your-domain` | The contact form's rate-limit rule is really on (Cloudflare Pages form only) |

## Good to know

- **Contact form hosting:** the starter's form handler runs on **Cloudflare Pages** (free). On Vercel, Netlify or
  your own server, point `site.forms.action` in `src/config/site.ts` at a form service instead; `check:dist` stops
  the build if you forget.
- **Never invented facts:** anything the AI does not know (prices, addresses, reviews, legal details) is written as
  `[CONFIRM: ...]`, and `check:launch` blocks the launch until every one is filled in.
- **Security list:** `starter/docs/SECURITY-CHECKLIST.md` has 97 checks with the file that handles each one.
  It is a checklist, not 97 automated tests: the scripts above prove what a script can, the starter's code handles
  others, and the rest you set in the host dashboard or review by hand. Each row says which.

## Updating

Download the new version, replace this folder, and run `node install.mjs` again. Sites you already built are not
touched; they are separate copies.

## Credits and licenses

Made by [BrewedOps](https://brewedops.cloud). Licensed under the MIT license (see `LICENSE`). Third-party parts and
their licenses are listed in `NOTICE.md`.

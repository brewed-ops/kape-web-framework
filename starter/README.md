# Starter site

Scaffold for static client websites (portfolio, landing page, funnel, multi-page site). Needs Node 22 (see `.nvmrc`).
Astro 7, Tailwind v4, TypeScript, security headers and SEO schema built in. Demo brand: Larkfield Dental.

```
npm install
cp .env.example .env     # dummy Turnstile key, fine for local work
npm run dev              # http://localhost:4321  (and /wireframe, dev only)
npm run build && npm run check:dist
npm run check:launch     # before go-live: fails while demo content or [CONFIRM] is left
```

Switch the layout with `siteType` in `src/config/site.ts`. Words are in `src/content/`, facts in `src/config/site.ts`, colors in `src/styles/tokens.css`.

Read next: `docs/HANDOFF.md` (changing things), `docs/LAUNCH.md` (going live), `CLAUDE.md` (rules).

The contact form handler (`functions/api/contact.ts`) runs on Cloudflare Pages. On Vercel, Netlify or Nginx, set `site.forms.action` in `src/config/site.ts` to a form service URL; `check:dist` fails a Vercel or Netlify build that still points at `/api/contact`.

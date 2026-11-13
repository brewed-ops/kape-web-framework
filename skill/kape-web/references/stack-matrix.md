# Stack matrix - pick by what the site must do, not by habit

Ask: does any page need data per visitor (logins, carts, dashboards)? If no, it is a website: ship static.

| Site needs | Pick | Why | Host | Monthly |
|---|---|---|---|---|
| Business site, landing page, portfolio, funnel (default) | **KAPE starter**: Astro 7 + Tailwind v4 + TS, static | Zero JS by default, nothing to hack server-side, best Core Web Vitals, one file per section | Cloudflare Pages | $0 |
| Above + a contact / opt-in form | Starter + `functions/api/contact.ts` (Pages Function, Cloudflare Pages only; elsewhere point `site.forms.action` at a form service) + Turnstile | Server-side validation and bot check with no database | Cloudflare Pages | $0 |
| Owner edits content weekly without a dev | Starter + Keystatic (git-based CMS) or Decap | Content stays in the repo, no CMS server to patch | Cloudflare Pages / Vercel | $0 |
| Blog with 50+ posts | Starter + Astro content collections (Markdown/MDX) | Typed frontmatter, RSS, sitemap for free | Cloudflare Pages | $0 |
| One-page funnel that lives inside GHL | The CRM's own funnel builder, not this stack | The client's CRM, forms and automations already live there | GHL | in their plan |
| One-page microsite, no build step wanted | Plain HTML + CSS + the starter's headers file | Fewest moving parts | Cloudflare Pages | $0 |
| Store (under ~50 products) | Shopify (theme) or Astro + Snipcart/Stripe Checkout | Payments and PCI handled by the platform | Shopify / Pages | from $5-39 |
| Member area, logins, user data, dashboards | Not a website: a web app (React + Vite or Next.js + Supabase) | Needs auth, RLS, sessions | Vercel / VPS | varies |
| Must self-host (client policy) | Starter built to `dist/`, Nginx with `deploy/nginx/site.conf` | Same headers, client's server | Any VPS | VPS cost |

Always: TypeScript strict, Geist (or the brand's font) self-hosted, one icon set per site (Lucide by default;
never mix two), a private GitHub repo under your account, transferred to the client at handoff if they want it.

Say what would change the pick: "If you later want member logins, we move that part to an app; the marketing
site stays as is."

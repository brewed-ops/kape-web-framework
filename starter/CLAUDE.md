# Starter site: rules for whoever edits this next

Static client website (Astro 7, Tailwind v4, TypeScript strict). Not a web app. Zero client JS by default.

## Where things live
- **Words** live in `src/content/<feature>.ts`. Never type copy in a component.
- **Business facts** (name, URL, phone, address, hours, socials, nav, legal dates) live in `src/config/site.ts`. Never repeat them elsewhere.
- **Colors, fonts, sizes, spacing, radius, motion** live in `src/styles/tokens.css`, the only file with hex values. Use the Tailwind utilities that map to tokens (`bg-ground`, `text-muted`, `border-line`, `bg-accent`). No hardcoded hex.
- **Section order** per site type lives in `src/config/sections.ts`. `siteType` is set in `site.ts`.
- 1 feature = 1 folder = 1 component: `src/features/<name>/<Name>.astro`. Components render only. Root element carries `data-feature="<name>"` and an `id`. New feature: `npm run new:feature <name>`.
- API or server logic never goes in components. The only dynamic code is `functions/api/contact.ts`.

## Rules
- Tailwind v4: every plain element rule (`body`, `a`, `button`, `input`, `h1`) goes inside `@layer base`. An unlayered rule beats every utility.
- `min-h-[100dvh]`, never `h-screen`. Animate `transform` and `opacity` only. Honor `prefers-reduced-motion`.
- Every page passes `title` and `description` to `Base.astro`. One `h1` per page. Every image has real alt text. Every input has a label.
- No inline `<script>` and no inline `style=` or `<style>`: the CSP (`style-src 'self'`, `script-src 'self' https://challenges.cloudflare.com`) blocks them. The one exception is JSON-LD (`type="application/ld+json"`), which is data. Use classes.
- Do not add dependencies without flagging them. Icons are inline Lucide SVG in `components/ui/Icon.astro`.
- Security headers are identical in `public/_headers`, `vercel.json`, `netlify.toml`, `deploy/nginx/site.conf`. Change all four together.
- Placeholder facts carry a `// TODO(owner):` comment. Legal text carries `[CONFIRM: ...]`. Never invent prices, names or claims.

## Banned (anti-slop)
Eyebrow or kicker labels above headings. Purple or blue gradients. Neon glows or shadows on the accent. Gradient text. Colored left-border accent cards. A centered hero (pill, headline, subtext, CTA stack): the hero is left aligned. Uniform three-card icon grids. Emoji. Circular spinners. Filler copy ("Lorem ipsum", "Scroll to explore", "John Doe").

## Before every commit and deploy
1. `npx astro check` and `npm run build`
2. `npm run check:dist` must print PASS
3. Run `/ponytail-review` before committing
4. After deploying: `npm run check:headers -- <url>` (grade A or better) and `/seo audit <url>`
5. Never push or deploy without the owner's go. See `docs/LAUNCH.md`.

Docs: `docs/HANDOFF.md` (how to change things), `docs/LAUNCH.md`, `docs/SEO.md`, `docs/SECURITY-CHECKLIST.md`, `docs/SECURITY-AUDIT-PROMPT.md`.

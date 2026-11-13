# Handoff: how to change this website

For the business owner and the next developer. Short, numbered, plain English.
The golden rule: **words live in `src/content/`, facts live in `src/config/site.ts`, colors and fonts live in `src/styles/tokens.css`.** Never type them anywhere else.

## 1. Change the words on a page

1. Open the file in `src/content/` named after the section (`hero.ts` for the top banner, `faq.ts` for the questions, and so on).
2. Edit the text between the quote marks. Keep the quote marks and commas.
3. Lines starting with `// TODO(owner):` mark invented demo facts. Replace them with the truth and delete the comment.
4. Save, then check the page (see "Run it on your computer").

Page titles and descriptions for About, Services and Contact are in `src/content/pages.ts`. Legal text is in `src/content/legal.ts` (look for `[CONFIRM: ...]`).

## 2. Change business facts

Open `src/config/site.ts`. It holds the business name, web address, phone, email, address, opening hours, social links, menu links, default search-engine text, and the date of each legal page. Change a fact once and it updates everywhere, including the search-engine data.

## 3. Change colors and fonts

Open `src/styles/tokens.css`. It is the only file with color codes. Change `--accent` for the highlight color, `--ink-0` for the page background, `--paper` for the text color. Fonts are `--font-sans` and `--font-mono`. If you change the colors, also update the three hex values in `public/favicon.svg` and run `npm run make:og` to redraw the share image.

## 4. Reorder, add or remove sections

1. Open `src/config/sections.ts`.
2. Find your site type (`portfolio`, `landing`, `funnel` or `website`). The list is the order of sections on the home page, top to bottom.
3. Move a name to reorder, delete a name to remove a section, add a name to add one.
4. To invent a new section: `npm run new:feature team`. It creates the component and its content file and prints the line to add to `sections.ts`.

## 5. Add a page

1. Copy `src/pages/contact.astro` to `src/pages/your-page.astro`.
2. Change the imports, the title, the description and the `crumbs` (breadcrumb) lines.
3. Add the link to `nav` in `src/config/site.ts`.
4. The sitemap picks it up automatically on the next build.

## 6. Swap images

1. Put the new file in `public/images/` (JPG, WebP or SVG; keep photos under 300 KB).
2. Open the matching `src/content/` file (`work.ts`, `about.ts`) and change `src`.
3. Change the `alt` text next to it to describe the picture for someone who cannot see it. Every image needs one.
4. The share image for social links is `public/og-default.png` (1200 x 630). Replace the file, keep the name.

## 7. Switch the site type

1. Open `src/config/site.ts` and change `export const siteType = 'website'` to `'portfolio'`, `'landing'` or `'funnel'`.
2. Nothing else needs editing. Menu, sections, header and footer follow.
3. The About, Services and Contact pages still build for every type, but only the `website` type links to them and lets search engines index them.

## 8. Run it on your computer

1. Install Node 22 (`.nvmrc` says which).
2. `npm install`
3. Copy `.env.example` to `.env`.
4. `npm run dev` and open http://localhost:4321
5. Open http://localhost:4321/wireframe to see the page as grey labeled boxes. That view exists only on your computer.

## 9. Forms (contact and opt-in)

The forms post to `functions/api/contact.ts`, which runs on **Cloudflare Pages**. Set these in the Cloudflare dashboard (never in the repo): `TURNSTILE_SECRET`, `CONTACT_WEBHOOK_URL`. Set `PUBLIC_TURNSTILE_SITE_KEY` as a build variable. The webhook can be any URL that accepts JSON: an automation tool, a CRM inbound webhook, your own endpoint. On Vercel, Netlify or Nginx the function does not run: point `site.forms.action` in `src/config/site.ts` at your own handler.

## 10. Deploy

1. `npm run build`
2. `npm run check:dist` (must say PASS)
3. Upload `dist/` to the host. The header files (`public/_headers` for Cloudflare Pages, `vercel.json`, `netlify.toml`, `deploy/nginx/site.conf`) apply the security rules.
4. After it is live: `npm run check:headers -- https://your-domain` (needs grade A or better).
5. Work through `docs/LAUNCH.md`.

## When something looks wrong

- Build says `PUBLIC_TURNSTILE_SITE_KEY is missing`: copy `.env.example` to `.env`, or set the variable in the host's build settings.
- A page shows a name that is not yours: search the repo for `Larkfield`.
- Before every commit, run `/ponytail-review` if you use Claude. After every deploy, run `/seo audit <url>`.

## Changelog

One dated line per change that went live, newest first.

| Date | What changed | Deployed by |
|---|---|---|
| [CONFIRM: launch date] | First launch | [CONFIRM: name] |

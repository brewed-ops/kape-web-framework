# SEO

The starter ships the technical SEO baseline. Words, links and real-world signals are yours.

## What every page already has

- `<title>`, meta description, canonical (from `site.url`), robots meta, Open Graph and Twitter tags: `src/components/seo/Seo.astro`, fed by each page.
- One `<h1>` per page, landmarks, `lang`, descriptive link text.
- `sitemap-index.xml` (built by `@astrojs/sitemap`; excludes `/thank-you/`, and the inner pages unless `siteType` is `website`) and `robots.txt` (`src/pages/robots.txt.ts`).
- JSON-LD from `src/lib/schema.ts`, rendered safely by `src/components/seo/JsonLd.astro`.

## Schema each page emits

| Page | Schema |
|---|---|
| Home `/` | `LocalBusiness` (or the subtype in `site.businessType`) when `site.address` is set, otherwise `Organization`; plus `WebSite`. Plus `FAQPage` when the FAQ section is in the list (landing, funnel). |
| `/about/` | `WebPage`, `Person` (the principal from `content/about.ts`), `BreadcrumbList` |
| `/services/` | `WebPage`, one `Service` per item in `content/services.ts`, `BreadcrumbList` |
| `/contact/` | `WebPage`, `BreadcrumbList` |
| `/privacy/` `/terms/` `/cookies/` | `WebPage`, `BreadcrumbList` |
| `/thank-you/`, `/404` | none; `noindex` |

`offer()` and `service()` builders exist in `schema.ts` for pricing and per-service pages you add. Only mark up what is visible on the page.

## Title and description rules

- **Title**: 50 to 60 characters including the `| Site name` suffix that `Base.astro` adds. Main topic first, place or qualifier second, brand last. Unique on every page.
- **Description**: 140 to 160 characters. Say what the page offers and what to do next. Unique on every page. No quote marks, no keyword lists.
- Home title and description live in `site.seo` (`src/config/site.ts`). Inner pages use `src/content/pages.ts`.
- Check lengths before launch; the `/seo page` command reports them.

## claude-seo commands

Run these in Claude Code with the claude-seo plugin installed. Replace the URL with the live site.

| Command | What it does | When to run |
|---|---|---|
| `/seo audit <url>` | Full-site audit: technical, content, schema, links, performance | After every deploy, and weekly for the first month |
| `/seo page <url>` | One page in depth: title, description, headings, copy, internal links | After editing a page's words |
| `/seo schema <url>` | Validates the JSON-LD and suggests missing types | After changing `site.ts` or adding a page type |
| `/seo technical <url>` | Crawlability, canonicals, redirects, headers, Core Web Vitals | Before launch and after any hosting change |
| `/seo geo <url>` | Visibility for AI answer engines (clear entities, citable facts, schema) | After launch, and after rewriting key pages |
| `/seo sitemap <url>` | Checks the sitemap against what is actually reachable and indexable | Before submitting to Search Console, and after adding pages |

## Search Console steps

1. Add the property for the domain and verify it with the DNS TXT record.
2. Submit `https://your-domain/sitemap-index.xml`.
3. Use URL Inspection on the home page and request indexing.
4. After a week: Pages report (no unexpected "Excluded"), Core Web Vitals report, Enhancements (FAQ, breadcrumbs) show valid.

## Things that quietly hurt rankings

- Leaving `Larkfield` demo copy or `.example` URLs in production. Search for them.
- Changing `siteType` away from `website` without meaning to hide the inner pages from search engines (they become `noindex`).
- Two pages with the same title or description.
- Images without alt text, or text baked into images.
- A canonical host different from the one people link to (`www` vs bare domain). Pick one and redirect the other.

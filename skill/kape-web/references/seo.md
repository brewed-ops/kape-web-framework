# SEO

## Schema map (src/lib/schema.ts builders, rendered by components/seo/JsonLd.astro)
| Page | Schema |
|---|---|
| Home | Organization (or LocalBusiness when site.ts has an address) + WebSite |
| Services / service page | Service (+ Offer when a price is public) |
| FAQ feature | FAQPage (only real Q&As shown on the page) |
| Inner pages | BreadcrumbList + WebPage |
| Portfolio / about | Person (owner) |
| Blog post | Article / BlogPosting with author and dates |
Validate with `/seo schema <url>` and Google's Rich Results Test. Never mark up content that is not visible.

## On-page rules
Title 50-60 chars (primary phrase first, brand last); description 140-160; one h1; headings in order; canonical on
every page; descriptive URLs; alt text that describes; internal links between services and the contact page; OG
image 1200x630 per key page; `lang` set; sitemap via @astrojs/sitemap; robots.txt points to it; thank-you and
wireframe routes noindex.

## claude-seo by phase
| When | Command | Why |
|---|---|---|
| Brief (inspiration or competitor) | `/seo page <url>`, `/seo sxo <url>` | What ranks, what the page type should be |
| Foundation | `/seo plan` | Keyword-to-page map before the sitemap is final |
| Before launch (preview URL) | `/seo audit <url>`, `/seo technical <url>`, `/seo schema <url>` | Fix before Google sees it |
| Local business | `/seo local <url>`, `/seo maps` | NAP consistency, Business Profile |
| AI search | `/seo geo <url>` | How AI answers cite the site |
| After launch | `/seo audit https://<domain>`, `/seo sitemap https://<domain>` | Live proof; then submit sitemap in Search Console |
| Monthly | `/seo drift <url>` | Catch regressions after edits |
First run per machine: `/seo setup` (Python env + headless browser), `/seo doctor` to check.

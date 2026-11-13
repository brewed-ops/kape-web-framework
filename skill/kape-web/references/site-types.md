# Site types - set `siteType` in src/config/site.ts

| Type | Job | Home sections (src/config/sections.ts) | Extra pages |
|---|---|---|---|
| `portfolio` | Prove skill, get an enquiry | header, hero, work, about, proof, contact, footer | case studies optional |
| `landing` | One offer, one action | header, hero, logos, services, process, proof, pricing, faq, cta, footer | privacy, terms, cookies |
| `funnel` | Capture a lead, then a next step | minimal header, hero (opt-in), proof, process, faq, optin, minimal footer | thank-you (noindex) |
| `website` | Explain the business, rank locally, route to contact | header, hero, logos, services, stats, proof, cta, footer | about, services, contact |

## Wireframe standards (before any color)
- Grey boxes at the real section heights, labelled with the feature name (`/wireframe`, dev only).
- Hero is LEFT-aligned for landing/funnel/website (centered reads as a SaaS homepage, not a business). Portfolio
  may center if the work grid carries the page.
- One primary action per screen. The same action repeats at hero, mid-page and end.
- Proof (reviews, logos, numbers) sits before the price or the ask.
- Mobile first: check 390 wide; tap targets 44px; no section taller than ~1.5 screens on a phone without a break.
- Every page: one h1, a skip link, header, footer with legal links, contact reachable in one tap.

## Conversion rules by type
- Funnel: no main nav (exits), opt-in above the fold and again at the end, thank-you page sets the next step
  (book, watch, download). Form fields: name + email, nothing more unless the CRM needs it.
- Landing: price or "from" price visible if the business allows it; FAQ answers the 5 objections heard on calls.
- Website: NAP (name, address, phone) identical in footer, schema and Google Business Profile.
- Portfolio: 3-6 strongest pieces, each with the problem, the move, the result.

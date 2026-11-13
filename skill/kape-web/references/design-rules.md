# Design rules

## Look
- The client's brand first. No brand yet: propose one palette (ground, ink, ONE accent) + one type family, show it on
  the hero before building more. KAPE's own sites: Black #000412, Ice White #E8EEF2, Aurora Green #2BF08A.
- Tokens only (`src/styles/tokens.css`). A color used twice gets a token. Change a token at root, never per use.
- Type: Geist / Satoshi / Cabinet Grotesk for display; Inter and Roboto never on a hero. Hero headline 5-10 words,
  2-3 lines, no orphan. Body 16-18px, line-height 1.6, max 70ch.
- Space: 4px scale; section padding clamp(88px, ..., 160px); one container width; one gutter (16px on phones).
  Related things closer than unrelated things; never equal spacing everywhere.
- Depth on dark = lighter surfaces + 1px hairlines, not shadows. On light = one soft shadow token.

## Real interfaces (Stageshow)
Any section that shows a product, a dashboard, a process or "how it works" gets a Stageshow demo (still or 10-16s
loop) instead of an icon grid: read the stageshow skill, copy the closest gold example, real logos via Simple Icons
(CC0) or the kit's BrandMark, `compact` design for phones, `poster` for reduced motion. Film with
`node ~/.claude/skills/stageshow/scripts/film.mjs <url> --gate`.

## The ban list (any hit = fix before showing)
- Eyebrow / kicker labels (tiny uppercase tracked text above a heading)
- Purple-to-blue or any purple gradient; gradient text; neon glows; oversaturated accents beside it
- Colored left-border accent cards
- Centered hero stack (pill + headline + subtext + two buttons) on landing/funnel/website
- Uniform 3 or 4 icon-card grids; identical cards with identical icons
- Emoji as icons, anywhere; sparkle/wand icons for AI; a letter in a colored square as a logo
- Circular spinners (use skeleton shimmer)
- Filler copy: "Scroll to explore", "Unlock", "Elevate", "Seamless", "Lorem ipsum", "John Doe"
- Stock photos of handshakes / people pointing at laptops
- Serif fonts on dashboards; mixed icon sets; text under 12px

## Motion
- Spring ease `cubic-bezier(0.34, 1.36, 0.64, 1)` for UI response, calm ease for reveals. Transform/opacity only.
- Scroll reveals are gated behind a class JS adds (content visible without JS). One reveal style per page.
- `prefers-reduced-motion`: no movement, content shown.

## Check
Screenshot 1440 and 390 with Playwright. No horizontal overflow at 390. Read the screenshots against this list.

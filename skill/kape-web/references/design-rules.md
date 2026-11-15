# Design rules

## Whose call this is
The design belongs to the web developer and their client. The look, the layout and the taste are their choice.
Everything in this file is a reminder, there so the result does not come out looking AI-made:
- If the developer has decided something (a font, a color, a layout, even an item on the slop list), build it their
  way. Never overrule a stated choice with a rule from this file.
- Where they have not decided, use these as the default and say which default you used.
- Stageshow is a guide for the interface parts of a design (screens, dashboards, flows). It does not pick the look.

## Look
- The client's brand first. No brand yet: propose one palette (ground, ink, ONE accent) + one type family, show it on
  the hero before building more. KAPE's own pages: warm ink #12100E, paper #F6F2EA, one amber #F0A726, film grain.
- Tokens only (`src/styles/tokens.css`). A color used twice gets a token. Change a token at root, never per use.
- Type: Geist / Satoshi / Cabinet Grotesk for display; Inter and Roboto never on a hero. Hero headline 5-10 words,
  2-3 lines, no orphan. Body 16-18px, line-height 1.6, max 70ch.
- Space: 4px scale; section padding clamp(88px, ..., 160px); one container width; one gutter (16px on phones).
  Related things closer than unrelated things; never equal spacing everywhere.
- Depth on dark = lighter surfaces + 1px hairlines, not shadows. On light = one soft shadow token.
- Every section and every card in a grid has a visual anchor that matches its content: a real logo, a line icon
  from the site's one icon set (a different, fitting icon per card), a number, or a real interface. Text-only
  cards read as unfinished; owners notice before anything else.
- Use the width: content in the container, a demo beside its text rather than under it, no dead strip on desktop.

## Performance (part of the design, not after it)
- Images ship at 2-3x their displayed size, never the source file (a 5000px logo shown at 30px is a failed audit).
- A WebGL / canvas background runs only on a real GPU: check the renderer name (`WEBGL_debug_renderer_info`;
  SwiftShader / llvmpipe / software = skip, keep a static ground) and load the library after that check. On a
  machine without a GPU it blocks the page for seconds and sinks the Lighthouse score.

## Real interfaces (Stageshow)
For a section that shows a product, a dashboard, a process or "how it works", reach for a Stageshow demo (still or 10-16s
loop) before an icon grid, unless the developer wants it another way: read the stageshow skill, copy the closest gold example, real logos via Simple Icons
(CC0) or the kit's BrandMark, `compact` design for phones, `poster` for reduced motion. Film with
`node ~/.claude/skills/stageshow/scripts/film.mjs <url> --gate`.

## The slop list (tell the developer about every hit; they decide)
These are the things that make a page look AI-made. Fix them by default. If the developer chose one on purpose,
keep it and move on.
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

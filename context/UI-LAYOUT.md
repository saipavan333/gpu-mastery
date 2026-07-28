# UI / Layout / Motion (read for: nav, footer, byline, animation, page chrome)

## Nav + footer + byline — single source: `assets/gm-site.js` + `gm-site.css`
`injectByline()` in `gm-site.js` runs on every page and appends, if not already
present:
- nav: a `.gm-credit` byline span into `nav .inner`
- footer (any `<div class="footer">…</div>`): a `.gm-foot-links` row (Curriculum
  · Labs · Glossary · Review · Interview · Exam · Cheat sheets · Concept map ·
  Search) and a `.gm-foot-credit` line
Styling for all of the above lives in `gm-site.css`. **To change the footer
links, credit line, or nav byline anywhere on the site, edit `gm-site.js`
(markup/logic) and `gm-site.css` (style) — never a per-page `<div class="footer">`.**
Each page's own `.footer` div only holds page-specific summary text; the
cross-links are injected, not hand-written.

Also injected by `gm-site.js`: favicon, a11y (skip link + `#gm-main`), diagram
`aria-label`s, KaTeX render pass, per-lesson prerequisites/misconceptions boxes
(from `gm-lessonmeta-data.js`), and the home "Resume where you left off" card.

## Animated hero — `assets/gm-hero.js` (home page only)
The home hero is a live `<canvas id="hero-canvas" class="hero-art">`, not a static
image. `gm-hero.js` (loaded by `app.js` only when `#hero-canvas` exists) draws a
compute grid with an activation wavefront sweeping across it continuously — the
course's core metaphor, animated. Canvas 2D, no deps, DPR-crisp, pauses on hidden
tab. Honors `prefers-reduced-motion`: draws ONE static mid-sweep frame and never
loops. The old `assets/hero-grid.svg` remains as the `<noscript>` fallback. This is
a *continuous* animation on purpose — the earlier entrance-fade was a one-shot
effect users kept reporting as "no animation" because it was too easy to miss.
Verified in Node with a canvas shim: the wave's centroid strictly advances across
the sweep, the loop re-schedules, and reduced-motion schedules zero frames.

## Motion — single source: `assets/gm-motion.js` (no separate CSS file)
One script drives ALL entrance + scroll-reveal animation site-wide, including
the home page hero (as of this session — previously the hero used a separate,
page-specific `.reveal`/`.d1-d4` CSS animation in `style.css`; that was removed
so there is exactly one motion system to reason about).
- Injects its own critical `<style>` synchronously (no async-stylesheet race).
- Honors `prefers-reduced-motion` (bails out entirely if set; `style.css` also
  has a blanket `* { animation:none!important; transition:none!important; }`
  fallback under that media query).
- Elements already on screen at load are queued into `onLoad[]` and flipped to
  `.gm-in` inside a **double `requestAnimationFrame`**, not the same tick as
  `.gm-reveal`. This matters: a class that sets the *end* state added in the
  same synchronous tick as the class that sets the *start* state never
  produces a visible CSS transition (no frame is painted in between for the
  browser to transition from) — it just snaps to the end state, which reads as
  "no animation at all." This was the real root cause of the animation
  complaints; fixed by forcing a genuine paint between the two states.
- Below-the-fold elements are handled by an `IntersectionObserver` as before,
  staggered by vertical position.
- The hero (`.hero .eyebrow`, `h1`, `.subhead`, `.cta-row`, `.small`,
  `.hero-art`, `.stats`) is now in the same selector list as every other
  revealed element — no bespoke hero code path.

**Gotcha:** `style.css` is loaded via a synchronous `<link>` in every page's
`<head>` — it is NOT part of the async injection chain, so changes there apply
immediately, but the service worker's stale-while-revalidate caching can still
serve an old cached copy on a returning visit. Bump `CACHE` in `sw.js` after
any edit here (see DEPLOY.md).

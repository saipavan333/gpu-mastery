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

## Animated hero — `assets/gm-hero.js` (home page only, "The Dispatch Lattice")
The home hero is a live `<canvas id="hero-canvas" class="hero-art">`, not a static
image. Built with the wondersmith method around one signature technique: a **WebGL
fragment shader** ("The Dispatch Lattice") computing a compute fabric the visitor
DISPATCHES with the cursor — energy blooms from the pointer and activation
wavefronts ripple through the grid (course thesis: every pixel is a thread). It
idles with ambient waves (attract mode) and visibly reacts to the pointer (the
visitor is load-bearing).

**Bulletproof fallback chain (because this ships without a browser to eyeball):**
WebGL + shader compile OK → the shader; WebGL/compile fails → a verified canvas-2D
lattice (same metaphor, CPU-drawn); JS off → the static `assets/hero-grid.svg` in
`<noscript>`; `prefers-reduced-motion` → one composed still frame, no loop. The
code detects `COMPILE_STATUS`/`LINK_STATUS` and any context error and degrades, so
a shader that fails on some GPU never shows a black box — it shows the 2D lattice.
If WebGL already bound the canvas, the 2D path swaps in a fresh cloned canvas
(can't get a `2d` context from a canvas that vended `webgl`).

Loaded by `app.js` only when `#hero-canvas` exists. Verified in Node (can't run
WebGL in the sandbox — native `gl` build is blocked): GLSL syntax-validated with
`@shaderfrog/glsl-parser`; a DOM+fake-GL shim proves the WebGL/2D/none selection,
that the 2D wave centroid strictly advances, and that reduced-motion schedules zero
frames. The shader was additionally **rendered live in a `visualize` widget (real
WebGL) and chosen by the user from three interactive previews** — the visual
verification channel when the Chrome extension isn't connected. **Final in-page
confirmation still needs a real browser** — if it ever looks wrong, first rule out
OS-level "reduce motion" (it intentionally disables the animation) and a stale
service-worker cache (bump `sw.js` CACHE, hard-refresh).

Shader composition (elevated, user-approved): a dim **parallax depth layer**
(denser far grid that drifts toward the cursor) behind the **main lattice**
(warped cells, ambient diagonal waves, per-cell shimmer), a **cursor bloom + ripple
rings** gated on `u_active`, and **two crossing wavefront highlight lines** that
keep it alive at rest. Colors are the site's blue→teal→violet ramp; a vignette
frames it. `u_time` is pre-warmed (starts at 40s) so frame 0 is already full.

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

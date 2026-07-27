# GPU Mastery — Session Handoff / Context (READ THIS FIRST)

**Purpose of this file:** a new session should read *only this file* (plus
`TRACKS-PROGRESS.md` for history) and be fully oriented — **do not re-explore the
tree or re-read every asset.** The whole site is driven from one bootstrap, so the
map below is enough to work confidently and cheaply.

## What this is
A 100% static, offline-capable course site (pure HTML/CSS/JS, no framework, no build
step) teaching GPUs/CUDA from zero to job-ready. 84 lessons + 254 verified diagrams +
interactive labs + a full study/assessment platform. Hosted on GitHub Pages at
`https://saipavan333.github.io/gpu-mastery/`. Works from `file://` too.
Creator byline (verbatim, every page): **Built by U E Sai Pavan Vamshi Krishna**.

## Architecture — single source of truth (critical)
Every page ends with `<script src="assets/app.js"></script>`. `app.js`:
1. computes `window.GM = {assetBase, rootBase}` from its own src (path-aware), then
2. **bootstraps the whole shared layer** by injecting these in order:
   `gm-site.css`, `gm-site.js`, `gm-motion.css`, `gm-motion.js`, `gm-search.js`,
   `gm-glossary.*`, `gm-assistant.*`, `gm-readaloud.js`, `gm-highlight.js`,
   `gm-run.js`, KaTeX (only if `\(`/`\[`/`$$` present), and registers `sw.js`.
**So: a global change = ONE edit to `app.js` or `gm-site.js`, never per-page.**

`gm-site.js` is the injector: favicon, a11y (skip link + `#gm-main`), the creator
byline (nav + footer), the **footer study strip**, diagram aria-labels, KaTeX render,
per-lesson **prerequisites + misconceptions** (from `gm-lessonmeta-data.js`), and the
home **"Resume where you left off"** card.

## File map
**Pages (root):** index, curriculum, labs, setup, glossary, search, review,
interview, exam, cheatsheet, concept-map, lab-roofline/occupancy/coalescing/floatbits.
**Lessons:** `module-1..5/lesson-*.html` (43 core), `track-a..d/lesson-*.html`
(A=ML 11, B=HPC 10, C=Graphics 11, D=Portable 9), plus `track-d/lab-webgpu.html`.
**assets/** platform modules (all namespaced, single-source):
- `app.js` bootstrap + quizzes/progress/diagrams/copy + last-lesson recording
- `gm-site.js` / `gm-site.css` injector (see above)
- `gm-motion.js` (+`gm-motion.css`) — page entrance + scroll-reveal animation.
  **Injects its own critical CSS synchronously** to avoid an async-stylesheet race.
- `gm-search.js`/`.css` + `search-data.js` (index) — ranked search (`/`, ⌘/Ctrl-K)
- `gm-glossary.js`/`.css` + `gm-glossary-data.js` (54 terms) — page + tooltips
- `gm-review.js`/`.css` + `review-data.js` (222 cards) — Leitner spaced repetition
- `gm-assistant.js`/`.css` + `assistant-config.js` — AI assistant (offline retrieval
  always on; AI answers via owner Cloudflare Worker — see ASSISTANT-SETUP.md)
- `gm-readaloud.js` — Web Speech read-aloud (lessons)
- `gm-highlight.js` — offline syntax highlighter for `<pre><code>`
- `gm-run.js` — Pyodide runnable Python + auto-grader (Module-2 lessons only)
- `gm-interview-data.js` (52 Q), `gm-exam.js`/`.css` + `exam-data.js` (168 MCQ)
- `gm-lessonmeta-data.js` (prereqs+misconceptions, 49 lessons)
- `style.css` (design system, loaded in every `<head>`), `katex/` (vendored),
  `img/` (favicons, `og.png`, PWA icons), `diagrams*.js` (9 packs, 254 diagrams)
**tools/** (Node/Python generators + QA — none ship to the browser):
- `qa.js` — living regression suite. **Run before every push.**
- `build-index.js` → `search-data.js`; `build-review.js` → `review-data.js`;
  `build-exam.js` → `exam-data.js`; `build-interview.js.py` → interview data;
  `build-lessonmeta.py` → lessonmeta; `build-seo.js` → per-page meta + sitemap/robots;
  `add-equations.js` → KaTeX panels on 8 math lessons.
**worker/assistant-proxy.js** — Cloudflare Worker for AI answers (owner deploys).
**Root generated (committed on purpose — static host needs them):** `search-data.js`,
`review-data.js`, `exam-data.js`, `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, `sw.js`.

## Commands
```
node tools/qa.js                              # MUST be "QA: ALL CLEAN ✓" before any push
node tools/build-index.js && node tools/build-seo.js   # after ANY page content change
node tools/build-review.js / build-exam.js / build-lessonmeta.py   # after lesson quiz/term edits
```
Bash paths differ from Windows paths — the repo mounts at
`/sessions/<id>/mnt/Tutorials/gpu-mastery`.

## Deploy
`git push origin main` — **run from the user's machine; the sandbox has NO GitHub
credentials** (push always fails here). Commit locally, then hand the push command to
the user. **Bump `CACHE` in `sw.js`** on any asset change or the service worker serves
stale files (looks like "my fix didn't deploy"; also hard-refresh / DevTools → Update
on reload).

## State
All playbook §3 required features are **built and QA-clean**. **Pending by choice:**
§11 access-control/subscriptions (deferred — "build product, defer selling"); §12
analytics (optional, not built). Full history in `TRACKS-PROGRESS.md`.

## Gotchas (hard-won — don't relearn these)
- **Single source:** never hand-edit N pages; edit `app.js`/`gm-site.js`.
- **Motion:** `gm-motion.js` injects its own CSS + a self-completing keyframe so the
  entrance can't get stuck; honors `prefers-reduced-motion` (if the OS has "reduce
  motion" ON, the site intentionally won't animate).
- **Service worker cache is aggressive** — bump `sw.js` CACHE after asset edits.
- **KaTeX math:** use `\(…\)` inline and `\[…\]`/`$$…$$` display — **never a bare `$`
  in prose** (currency collides). `qa.js` scans `$$` parity per text node.
- **American English only** (qa.js scans British spellings).
- **Assistant:** offline retrieval always works; "AI answers" need a Worker URL pasted
  into `assets/assistant-config.js` (`window.GM_ASSIST_PROXY`). See ASSISTANT-SETUP.md.
- **jsdom hangs the sandbox** and **headless Chromium is blocked** — verify with
  `node --check`, hand-rolled DOM shims, `cairosvg` for SVG, and real `node`/`python3`
  logic tests (see how tools/ and prior commits did it). No full-page screenshots.

## New-session opening prompt (paste this to save tokens)
> Read `gpu-mastery/HANDOFF.md` and `gpu-mastery/TRACKS-PROGRESS.md`, then do: <task>.
> Don't re-explore the tree — architecture is single-source via `assets/app.js`. Run
> `node tools/qa.js` before handing me a push command.

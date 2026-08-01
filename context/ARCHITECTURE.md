# Architecture (read for: structural changes, new pages, "how does X wire up")

A 100% static, offline-capable course site (HTML/CSS/JS, no framework, no build
step). 84 lessons + 254 diagrams + labs + study platform. GitHub Pages at
`https://saipavan333.github.io/gpu-mastery/`; also works from `file://`.
Byline every page: **Built by U E Sai Pavan Vamshi Krishna**.

## Single source of truth
Every page ends `<script src="assets/app.js"></script>`. `app.js`:
1. computes `window.GM = {assetBase, rootBase}` from its own src (path-aware)
2. injects, in order: `gm-site.css`, `gm-site.js`, `gm-motion.js` (motion has no
   separate CSS file anymore — see UI-LAYOUT.md), `gm-search.js`, `gm-glossary.*`,
   `gm-assistant.*`, `gm-readaloud.js`, `gm-highlight.js`, `gm-run.js`, KaTeX
   (only if `\(`/`\[`/`$$` present), and registers `sw.js`.

**A global change = ONE edit to `app.js` or `gm-site.js` — never per-page.**

## File map
- **Pages (root):** index, curriculum, labs, setup, glossary, search, review,
  interview, exam, cheatsheet, concept-map, lab-roofline/occupancy/coalescing/floatbits.
- **Lessons:** `module-0..5/lesson-*.html` (49 core: **Module 0** = 6 conceptual
  intro lessons — what a GPU is, CPU vs GPU, evolution, landscape — with *inline
  SVG* diagrams, not the `diagrams*.js` registry; Modules 1–5 = 43), plus
  `track-a..d/lesson-*.html` (A=ML 11, B=HPC 10, C=Graphics 11, D=Portable 9) and
  `track-d/lab-webgpu.html`. Total 90 lessons.
  Note: `tools/build-index.js` has a **hardcoded module-dir list** — add any new
  `module-N` there or its lessons won't be indexed (search + concept map miss them).
- **assets/** — see the topic file that owns each module: UI-LAYOUT.md (site
  chrome + motion), STUDY-TOOLS.md (review/interview/exam/glossary/cheatsheet/
  concept-map/search), ASSISTANT.md (AI assistant). Shared: `style.css` (design
  system, every `<head>`), `katex/` (vendored), `img/`, `diagrams*.js` (9 packs).
- **tools/** — generators + QA, see DEPLOY.md.
- **worker/assistant-proxy.js** — Cloudflare Worker, see ASSISTANT.md.
- **Root generated (committed on purpose):** `search-data.js`, `review-data.js`,
  `exam-data.js`, `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, `sw.js`.

## Index of topic files
`UI-LAYOUT.md` · `STUDY-TOOLS.md` · `ASSISTANT.md` · `DEPLOY.md` — each is
self-contained; read only the one(s) your task touches.

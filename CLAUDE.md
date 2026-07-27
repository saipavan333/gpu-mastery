# GPU Mastery — course-level agent context

**Read `HANDOFF.md` in this folder first** — it is the single orientation file
(architecture, file map, commands, state, gotchas). Do **not** re-explore the tree;
this course is driven single-source from `assets/app.js` + `assets/gm-site.js`.

Essentials:
- Static offline course site (no framework/build). Global changes = edit `app.js` /
  `gm-site.js`, never per-page.
- Before any push: `node tools/qa.js` must print `QA: ALL CLEAN ✓`.
- After page content changes: `node tools/build-index.js && node tools/build-seo.js`.
- Deploy = `git push origin main` **from the user's machine** (sandbox has no git
  creds). Bump `CACHE` in `sw.js` after asset edits so clients refresh.
- Locale: American English. Math: `\(…\)` / `\[…\]`, never a bare `$` in prose.
- Full status: `TRACKS-PROGRESS.md`. AI assistant setup: `ASSISTANT-SETUP.md`.

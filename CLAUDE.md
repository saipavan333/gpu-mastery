# GPU Mastery — course-level agent context

**Read `HANDOFF.md` in this folder first.** It's a one-page index into
`context/*.md` — topic files (architecture, UI/motion, study tools, assistant,
deploy) so a session reads only the slice its task needs, not everything. Do
**not** re-explore the tree; this course is driven single-source from
`assets/app.js` + `assets/gm-site.js`.

Essentials (details live in the matching `context/*.md`):
- Static offline course site (no framework/build). Global changes = edit `app.js` /
  `gm-site.js`, never per-page.
- Before any push: `node tools/qa.js` must print `QA: ALL CLEAN ✓`.
- After page content changes: `node tools/build-index.js && node tools/build-seo.js`.
- Deploy = `git push origin main` **from the user's machine** (sandbox has no git
  creds — but `git status`/`log` against `origin/main` DO work here, so check
  before assuming a live bug is undeployed code). Bump `CACHE` in `sw.js` after
  asset edits so clients refresh.
- Locale: American English. Math: `\(…\)` / `\[…\]`, never a bare `$` in prose.
- Full status: `TRACKS-PROGRESS.md`. AI assistant setup: `ASSISTANT-SETUP.md`.

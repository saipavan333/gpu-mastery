# Deploy / commands / state (read for: shipping a change, "is this pending?")

## Commands
```
node tools/qa.js                                       # MUST print "QA: ALL CLEAN ✓" before any push
node tools/build-index.js && node tools/build-seo.js    # after ANY page content change
node tools/build-review.js / build-exam.js / build-lessonmeta.py   # after quiz/term/question edits
```
Bash paths differ from Windows paths — repo mounts at
`/sessions/<id>/mnt/Tutorials/gpu-mastery`.

## Push
`git push origin main` from the **user's own machine** — the sandbox has no
GitHub credentials and every push attempt from here fails. Commit locally in
the sandbox, hand over the exact push command. Note: `git status`/`git log`
against `origin/main` DO work from the sandbox (read-only), so an agent can
confirm whether a prior commit actually made it to GitHub Pages before
assuming a live bug is a deploy gap versus a real code bug.

**Bump `CACHE` in `sw.js`** on any asset change (JS/CSS) — the service worker's
stale-while-revalidate strategy will otherwise serve a returning visitor's
browser an old cached copy even after a successful deploy. Currently at `v3`.

## State
All Course Build Playbook §3 required features are built and QA-clean.
Deferred by choice: §11 access-control/subscriptions ("build product, defer
selling"), §12 analytics (optional). Full build history: `TRACKS-PROGRESS.md`.

## Standing rules
- American English only (`qa.js` scans for British spellings).
- KaTeX math: `\(…\)` inline, `\[…\]`/`$$…$$` display — never a bare `$` in
  prose (currency collides with math delimiters).
- No headless-Chromium/jsdom in this sandbox — verify with `node --check`,
  hand-rolled DOM shims, and real `node`/`python3` logic tests instead of
  screenshots.

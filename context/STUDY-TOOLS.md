# Study tools (read for: review, interview, exam, glossary, cheatsheet, concept map, search)

All live and cross-linked from both `index.html` ("Study it & get hired"
section) and `labs.html` ("Remember it & get hired" section) — keep both in
sync if you add/rename a tool.

- **Search** — `gm-search.js`/`.css` + generated `search-data.js` (built by
  `tools/build-index.js`). Ranked full-text search, opens with `/` or ⌘/Ctrl-K.
- **Glossary** — `gm-glossary.js`/`.css` + `gm-glossary-data.js` (54 terms).
  Standalone page (`glossary.html`) plus inline hover tooltips on every lesson.
- **Review Deck** — `gm-review.js`/`.css` + generated `review-data.js` (built
  by `tools/build-review.js`, 222 cards). Leitner spaced-repetition scheduler.
- **Interview Prep** — `gm-interview-data.js` (52 Q, built by
  `tools/build-interview.js.py`). `interview.html`.
- **Job-Readiness Exam** — `gm-exam.js`/`.css` + generated `exam-data.js`
  (built by `tools/build-exam.js`, 168 MCQ). Timed, scored, per-question review.
- **Cheat Sheets** — `cheatsheet.html`, static content, printable (`@media
  print` rules inline in the page).
- **Concept Map** — `concept-map.html`, reads `search-data.js` client-side to
  build the interactive core-path + tracks dependency tree.

Regenerate the relevant data file after editing lesson quizzes/terms/questions:
`node tools/build-index.js|build-review.js|build-exam.js|build-lessonmeta.py`
(see DEPLOY.md for the full command list and when to run each).

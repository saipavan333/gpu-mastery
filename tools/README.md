# GPU Mastery — QA toolkit
`node tools/qa.js` — living regression suite (playbook §7.1). Run before every push and after any global change.
Checks: broken internal links (case-sensitive), per-text-node literal-`$` / KaTeX-collision scan, American-English locale, inline-script syntax, closing-tag/div-balance, platform-asset presence.
Standard for "done": ALL CLEAN.

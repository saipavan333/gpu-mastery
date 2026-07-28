# GPU Mastery — Session Handoff (index)

Context is split by topic in `context/` so a session only reads what its task
needs, instead of one large file every time:

| File | Read it for |
|---|---|
| `context/ARCHITECTURE.md` | file map, bootstrap order, "how does X wire up", new pages |
| `context/UI-LAYOUT.md` | nav, footer, byline, animation/motion, page chrome |
| `context/STUDY-TOOLS.md` | review, interview, exam, glossary, cheatsheet, concept map, search |
| `context/LABS.md` | interactive labs, calculators, WebGPU pages, track visualizers |
| `context/ASSISTANT.md` | the "Ask AI" assistant, going online, Worker setup |
| `context/DEPLOY.md` | commands, QA, push process, service worker cache, current state |

`ARCHITECTURE.md` is the closest thing to a default — read it first if the
task doesn't obviously map to one topic. `TRACKS-PROGRESS.md` has full build
history if you need it. This site is single-source (see ARCHITECTURE.md):
never hand-edit N pages for a shared change.

## New-session opening prompt (paste this)
> Read `gpu-mastery/HANDOFF.md`, then only the `context/*.md` file(s) it points
> to for this task: `<task>`. Don't re-explore the tree. Run `node tools/qa.js`
> before handing me a push command.

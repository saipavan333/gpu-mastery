# AI Course Assistant (read for: anything about "Ask AI", assistant answers, going online)

Three-layer design, only layer 1 is active by default:
1. **Offline retrieval** (`gm-assistant.js`/`.css`) — always on, free, private.
   Searches the course's own text client-side, no network call.
2. **Generative "AI answers"** — via a Cloudflare Worker holding a Gemini
   free-tier API key server-side, so students never need their own key. The
   owner (Pavan) deploys `worker/assistant-proxy.js` once; full steps are in
   `ASSISTANT-SETUP.md` at the repo root. Not something the sandbox can do
   (requires external account/dashboard actions).
3. **Optional student-own-key path** — deferred, not built.

To flip on layer 2: deploy the Worker, then paste its URL into
`assets/assistant-config.js` → `window.GM_ASSIST_PROXY`. Until that's set, the
status line correctly reads "Answers drawn from the course lessons" (offline
mode) rather than implying AI is live — that wording was fixed this project to
drop confusing "grounded in course" jargon.

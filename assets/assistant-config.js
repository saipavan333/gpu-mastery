/* Course Assistant — owner configuration.
   Paste your Cloudflare Worker URL between the quotes to turn on AI-written
   answers for every student (no key needed on their side). Leave it empty to
   keep the assistant in free offline mode (retrieval over the course, with links).
   Full setup: see ASSISTANT-SETUP.md */
window.GM_ASSIST_PROXY = "https://gd-assistant-proxy.uekpavanharish.workers.dev";  /* live: Cloudflare Worker -> Gemini (owner key server-side) */

/* GPU Mastery — AI Course Assistant.
   Answers questions grounded ONLY in this course, with lesson links.
   Default: fully offline, free, private retrieval over the course index
   (reuses window.GM_INDEX from search + window.GM_GLOSSARY + GMSearch.rank).
   Optional: the course owner sets a Cloudflare Worker URL in assistant-config.js
   to turn on AI-written answers for everyone (no student key needed).
   Self-contained, namespaced .gma. No dependencies. */
(function () {
  "use strict";
  if (window.__gmaLoaded) return; window.__gmaLoaded = true;
  if (typeof document === "undefined") return;

  var GM = window.GM || { assetBase: "assets/", rootBase: "" };
  function A() { return GM.assetBase; }
  function R() { return (window.GM && window.GM.rootBase) || ""; }

  function esc(s) { var d = document.createElement("div"); d.textContent = (s == null ? "" : String(s)); return d.innerHTML; }
  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  function clip(s, n) { s = (s || "").trim(); return s.length > n ? s.slice(0, n).replace(/\s+\S*$/, "") + "…" : s; }
  function reduceMotion() { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }

  /* ---------- data ---------- */
  var DATA_READY = false;
  function loadScript(src, cb) { var s = document.createElement("script"); s.src = src; s.onload = cb; s.onerror = cb; document.head.appendChild(s); }
  function ensureData(then) {
    var need = [];
    if (window.GM_ASSIST_PROXY === undefined) need.push(A() + "assistant-config.js");
    if (!window.GM_INDEX) need.push(A() + "search-data.js");
    if (!window.GM_GLOSSARY) need.push(A() + "gm-glossary-data.js");
    var i = 0;
    (function next() {
      if (i >= need.length) { if (window.GM_ASSIST_PROXY === undefined) window.GM_ASSIST_PROXY = ""; DATA_READY = true; then(); return; }
      loadScript(need[i++], next);
    })();
  }
  function proxyUrl() { return (window.GM_ASSIST_PROXY || "").trim(); }

  /* ---------- retrieval (reuses GMSearch over GM_INDEX) ---------- */
  function toks(q) {
    if (window.GMSearch && window.GMSearch.tok) return window.GMSearch.tok(q);
    return (q || "").toLowerCase().split(/[^a-z0-9+]+/).filter(Boolean).map(function (t) { return t.replace(/s$/, ""); });
  }
  function retrieve(q) {
    if (!window.GMSearch || !window.GM_INDEX) return [];
    return window.GMSearch.rank(window.GM_INDEX, q).slice(0, 5);
  }
  function glossHits(q) {
    var qw = {}; toks(q).forEach(function (w) { qw[w] = 1; });
    var res = [];
    (window.GM_GLOSSARY || []).forEach(function (g) {
      var tw = g.t.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean).map(function (w) { return w.replace(/s$/, ""); });
      if (tw.length && tw.every(function (w) { return qw[w]; })) res.push(g);
    });
    res.sort(function (a, b) { return b.t.length - a.t.length; });   // most specific term first
    var kept = [];
    res.forEach(function (g) { var lg = " " + g.t.toLowerCase() + " ";
      if (!kept.some(function (k) { return (" " + k.t.toLowerCase() + " ").indexOf(lg) >= 0; })) kept.push(g); });
    return kept.slice(0, 3);
  }
  function bestSnippet(qt, e) {
    if (e.summary) return e.summary;
    var x = e.text || "", pos = -1;
    for (var i = 0; i < qt.length; i++) { var p = x.indexOf(qt[i]); if (p >= 0) { pos = p; break; } }
    return pos >= 0 ? x.slice(Math.max(0, pos - 40), pos + 130) : "";
  }
  function srcItem(e, detail) {
    return '<li><a class="gma-lnk" href="' + R() + esc(e.url) + '"><span class="gma-badge">' + esc(e.group) +
      (e.num ? " · " + esc(e.num) : "") + '</span><span class="gma-lt">' + esc(e.title) + "</span></a>" +
      (detail ? '<span class="gma-detail">' + esc(clip(detail, 150)) + "</span>" : "") + "</li>";
  }
  function retrievalAnswer(q) {
    var qt = toks(q), hits = retrieve(q), defs = glossHits(q), parts = [], answered = false;
    defs.forEach(function (g) { parts.push('<p class="gma-def"><b>' + esc(g.t) + "</b> — " + esc(g.d) + "</p>"); answered = true; });
    if (hits.length && hits[0].summary) { parts.push('<p class="gma-sum">' + esc(hits[0].summary) + "</p>"); answered = true; }
    if (hits.length) {
      parts.push('<div class="gma-srcwrap"><div class="gma-srch-h">Read more in these lessons</div><ul class="gma-src">' +
        hits.map(function (e) { return srcItem(e, (defs.length || answered) ? "" : bestSnippet(qt, e)); }).join("") + "</ul></div>");
    }
    if (!answered && !hits.length) {
      parts.push('<p>I couldn’t find that in this course’s lessons. Try different words, or <a href="#" class="gma-srch">search every lesson</a>.</p>');
    } else if (!proxyUrl()) {
      parts.push('<p class="gma-hint">Offline mode — answered straight from the lessons. (The course owner can switch on AI-written answers.)</p>');
    }
    return { html: parts.join(""), hits: hits };
  }

  /* ---------- AI mode (owner Cloudflare Worker) ---------- */
  function buildContext(q) {
    var hits = retrieve(q), gs = glossHits(q), c = [];
    gs.forEach(function (g) { c.push("Glossary — " + g.t + ": " + g.d); });
    hits.forEach(function (e) {
      c.push('Lesson "' + e.title + '" (' + e.group + (e.num ? ", " + e.num : "") + "): " +
        (e.summary || "") + " Topics: " + (e.heads || []).join("; "));
    });
    return { ctx: c.join("\n\n"), hits: hits };
  }
  function askViaProxy(q, history, cb) {
    var rq = q;   // short follow-up ("why?", "an example?") — retrieve using the previous question too
    if (history && history.length) {
      var lastU = ""; for (var i = history.length - 1; i >= 0; i--) { if (history[i].role === "user") { lastU = history[i].text; break; } }
      if (lastU && q.split(/\s+/).length <= 4) rq = lastU + " " + q;
    }
    var built = buildContext(rq);
    fetch(proxyUrl(), { method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ question: q, context: built.ctx, history: history || [] }) })
      .then(function (r) { return r.json(); })
      .then(function (j) { if (j && j.error) { cb(null, j.error, built.hits); return; } cb((j && j.answer) || "", null, built.hits); })
      .catch(function (e) { cb(null, (e && e.message) || "Network error", built.hits); });
  }
  function mdToHtml(t) {
    t = esc(t).replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>").replace(/`([^`]+)`/g, "<code>$1</code>");
    var lines = t.split(/\n/), out = [], inl = false;
    lines.forEach(function (ln) {
      if (/^\s*[-*]\s+/.test(ln)) { if (!inl) { out.push("<ul>"); inl = true; } out.push("<li>" + ln.replace(/^\s*[-*]\s+/, "") + "</li>"); }
      else { if (inl) { out.push("</ul>"); inl = false; } if (ln.trim()) out.push("<p>" + ln + "</p>"); }
    });
    if (inl) out.push("</ul>"); return out.join("");
  }
  function sourcesHtml(hits) {
    if (!hits || !hits.length) return "";
    return '<div class="gma-srcwrap"><div class="gma-srch-h">Sources</div><ul class="gma-src">' +
      hits.map(function (e) { return srcItem(e, ""); }).join("") + "</ul></div>";
  }

  /* answer cache — repeat first-turn questions return instantly, no quota spent */
  var ACACHE = "gm_ans_cache_v1", TTL = 7 * 864e5;
  function normQ(q) { return (q || "").toLowerCase().replace(/\s+/g, " ").trim(); }
  function cacheGet(q) { try { var c = JSON.parse(localStorage.getItem(ACACHE)) || {}, e = c[normQ(q)]; if (e && Date.now() - e.ts < TTL) return e; } catch (_) {} return null; }
  function cachePut(q, a, hits) { try { var c = JSON.parse(localStorage.getItem(ACACHE)) || {}; c[normQ(q)] = { a: a, h: hits || [], ts: Date.now() }; var ks = Object.keys(c); while (ks.length > 60) delete c[ks.shift()]; localStorage.setItem(ACACHE, JSON.stringify(c)); } catch (_) {} }

  /* ---------- UI ---------- */
  var EXAMPLES = ["What is memory coalescing?", "Explain occupancy", "What is the roofline model?",
    "Warp vs wavefront?", "What causes shared-memory bank conflicts?"];

  function boot() {
    var fab = el("button", "gma-fab", '<span class="gma-spark" aria-hidden="true">✦</span><span class="gma-fablbl">Ask&nbsp;AI</span>');
    fab.setAttribute("aria-label", "Ask the course assistant");
    fab.setAttribute("aria-haspopup", "dialog");
    fab.setAttribute("aria-expanded", "false");
    document.body.appendChild(fab);

    var panel, msgs, input, open = false, built = false, busy = false, lastFocus = null, convo = [];

    function autoresize() { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 120) + "px"; }
    function updateMode() { var m = panel.querySelector(".gma-mode"); if (!m) return;
      m.innerHTML = proxyUrl() ? '<span class="gma-dot on"></span> AI answers · from the course lessons'
                              : '<span class="gma-dot"></span> Answers drawn from the course lessons'; }
    function addBubble(who, html) {
      var b = el("div", "gma-msg gma-" + who, html); msgs.appendChild(b); msgs.scrollTop = msgs.scrollHeight;
      [].forEach.call(b.querySelectorAll(".gma-srch"), function (a) { a.onclick = function (e) { e.preventDefault(); toggle(false); if (window.GMSearch && window.GMSearch.open) window.GMSearch.open(); }; });
      return b;
    }
    function welcome() {
      msgs.innerHTML = ""; convo = [];
      addBubble("bot", "<p>Hi! I’m your course assistant. Ask anything about GPUs, CUDA, or the labs and I’ll answer from the lessons, with links. Try:</p><div class=\"gma-chips\">" +
        EXAMPLES.map(function (q) { return '<button class="gma-chip" type="button">' + esc(q) + "</button>"; }).join("") + "</div>");
      [].forEach.call(msgs.querySelectorAll(".gma-chip"), function (b) { b.onclick = function () { input.value = b.textContent; submit(); }; });
    }
    function setBusy(b) { var s = panel.querySelector(".gma-send"); if (s) s.disabled = b; busy = b; }
    function submit() {
      if (busy) return; var q = (input.value || "").trim(); if (!q) return;
      addBubble("user", esc(q).replace(/\n/g, "<br>")); input.value = ""; autoresize();
      var firstTurn = !convo.length, aiMode = !!proxyUrl();
      if (aiMode && firstTurn) { var hit = cacheGet(q);
        if (hit) { addBubble("bot", mdToHtml(hit.a) + sourcesHtml(hit.h)); convo.push({ role: "user", text: q }); convo.push({ role: "model", text: hit.a }); return; } }
      var typing = addBubble("bot", '<span class="gma-typing" aria-label="Thinking"><i></i><i></i><i></i></span>');
      setBusy(true);
      function done(txt, err, hits) {
        setBusy(false); typing.remove();
        if (err || !txt) { var r = retrievalAnswer(q); addBubble("bot", '<p class="gma-err">Couldn’t get an AI answer' + (err ? " (" + esc(err) + ")" : "") + ". Here’s what the course says:</p>" + r.html); }
        else { addBubble("bot", mdToHtml(txt) + sourcesHtml(hits)); if (firstTurn) cachePut(q, txt, hits); convo.push({ role: "user", text: q }); convo.push({ role: "model", text: txt }); if (convo.length > 12) convo = convo.slice(-12); }
      }
      if (proxyUrl()) { askViaProxy(q, convo.slice(-6), done); }
      else { var delay = reduceMotion() ? 0 : 240; setTimeout(function () { setBusy(false); typing.remove(); addBubble("bot", retrievalAnswer(q).html); }, delay); }
    }
    function buildPanel() {
      panel = el("div", "gma-panel");
      panel.setAttribute("role", "dialog"); panel.setAttribute("aria-modal", "true"); panel.setAttribute("aria-label", "Course assistant");
      panel.innerHTML = '<div class="gma-head"><span class="gma-title"><span class="gma-spark">✦</span> Course Assistant</span>' +
        '<button class="gma-close" aria-label="Close assistant">×</button></div>' +
        '<div class="gma-msgs" role="log" aria-live="polite"></div>' +
        '<form class="gma-inrow"><textarea class="gma-in" rows="1" placeholder="Ask anything about this course…" aria-label="Your question"></textarea>' +
        '<button class="gma-send" type="submit" aria-label="Send question">➤</button></form>' +
        '<div class="gma-foot"><span class="gma-mode"></span></div>';
      document.body.appendChild(panel);
      msgs = panel.querySelector(".gma-msgs"); input = panel.querySelector(".gma-in");
      panel.querySelector(".gma-close").onclick = function () { toggle(false); };
      panel.querySelector(".gma-inrow").addEventListener("submit", function (e) { e.preventDefault(); submit(); });
      input.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } });
      input.addEventListener("input", autoresize);
      welcome(); updateMode(); built = true;
    }
    function toggle(v) {
      open = (v == null) ? !open : v;
      if (open) { if (!built) buildPanel(); lastFocus = document.activeElement; panel.classList.add("show"); fab.setAttribute("aria-expanded", "true"); setTimeout(function () { input && input.focus(); }, 30); }
      else { if (panel) panel.classList.remove("show"); fab.setAttribute("aria-expanded", "false"); if (lastFocus && lastFocus.focus) lastFocus.focus(); }
    }
    fab.onclick = function () {
      if (!DATA_READY) { fab.classList.add("gma-loading"); ensureData(function () { fab.classList.remove("gma-loading"); toggle(true); }); }
      else toggle();
    };
    document.addEventListener("keydown", function (e) { if (open && e.key === "Escape") { e.preventDefault(); toggle(false); } });
  }

  /* expose retrieval for tests */
  window.GMAssist = { retrieve: retrieve, glossHits: glossHits, buildContext: buildContext, retrievalAnswer: retrievalAnswer };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();

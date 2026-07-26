/* GPU Mastery — job-readiness exam engine.
   Samples MCQs from window.GM_EXAM, shuffles questions + options, times and
   scores the attempt, and shows a per-question review. Pure logic is exposed on
   window.GMExam for tests; DOM UI runs only on the exam page. localStorage for
   best score. No dependencies; works offline. */
(function () {
  "use strict";

  var PASS = 0.70;                 // pass threshold
  var STORE = "gm_exam_best_v1";

  function shuffle(arr, rnd) {
    var a = arr.slice(), r = rnd || Math.random;
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  // remap a card's options into a shuffled order, tracking the new correct index
  function shuffleOptions(card, rnd) {
    var idx = card.opts.map(function (_, i) { return i; });
    var order = shuffle(idx, rnd);
    var opts = order.map(function (i) { return card.opts[i]; });
    var c = order.indexOf(card.c);
    return { id: card.id, q: card.q, opts: opts, c: c, expl: card.expl, url: card.url, title: card.title, group: card.group };
  }
  function inScope(group, scope) {
    if (!scope || scope === "All") return true;
    if (scope === "Core") return group === "Core";
    return group.indexOf(scope) >= 0;    // "Track A" matches "Track A · ML/AI Infra"
  }
  function buildExam(pool, scope, n, rnd) {
    var filtered = pool.filter(function (c) { return inScope(c.group, scope); });
    var picked = shuffle(filtered, rnd).slice(0, Math.min(n, filtered.length));
    return picked.map(function (c) { return shuffleOptions(c, rnd); });
  }
  function score(answers, exam) {
    var n = 0; for (var i = 0; i < exam.length; i++) if (answers[i] === exam[i].c) n++;
    return { correct: n, total: exam.length, pct: exam.length ? n / exam.length : 0, pass: exam.length ? (n / exam.length) >= PASS : false };
  }
  window.GMExam = { shuffle: shuffle, shuffleOptions: shuffleOptions, buildExam: buildExam, score: score, inScope: inScope, PASS: PASS };

  /* ---------------------------------------------------------------- DOM UI */
  if (typeof document === "undefined") return;
  var body = document.body;
  if (!body || body.getAttribute("data-lesson") !== "exam") return;
  var root = document.getElementById("ex-app");
  if (!root) return;
  var POOL = (window.GM_EXAM || []).slice();

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function bestGet() { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; } }
  function bestSet(o) { try { localStorage.setItem(STORE, JSON.stringify(o)); } catch (e) {} }

  var SCOPES = [["All", "Everything"], ["Core", "Core (Modules 1–5)"], ["Track A", "Track A · ML/AI"],
    ["Track B", "Track B · HPC"], ["Track C", "Track C · Graphics"], ["Track D", "Track D · Portable"]];
  var scope = "All", length = 25, timed = false;
  var exam = [], answers = [], flags = {}, pos = 0, tRemain = 0, tElapsed = 0, timer = null;

  function poolCount(sc) { return POOL.filter(function (c) { return inScope(c.group, sc); }).length; }

  function config() {
    stopTimer();
    var best = bestGet();
    var bkey = scope + ":" + length;
    var avail = poolCount(scope);
    var lenOpts = [10, 25, 50].filter(function (n) { return n <= Math.max(10, avail); });
    if (lenOpts.indexOf(length) < 0) length = lenOpts[Math.min(1, lenOpts.length - 1)] || avail;
    root.innerHTML =
      '<div class="ex-config card">' +
        '<h2>Set up your exam</h2>' +
        '<p class="dim">Multiple-choice questions drawn from every lesson, shuffled fresh each attempt. Pass mark is ' + Math.round(PASS * 100) + '%.</p>' +
        '<div class="ex-field"><label>Scope</label><div class="ex-chips" id="ex-scope"></div></div>' +
        '<div class="ex-field"><label>Questions</label><div class="ex-chips" id="ex-len"></div>' +
          '<span class="ex-avail small dim">' + avail + ' available in this scope</span></div>' +
        '<div class="ex-field"><label class="ex-check"><input type="checkbox" id="ex-timed"' + (timed ? " checked" : "") + '> Timed (1 min per question, auto-submit at 0)</label></div>' +
        (best[bkey] != null ? '<p class="ex-best small">Best here: <b>' + Math.round(best[bkey] * 100) + '%</b></p>' : "") +
        '<button id="ex-start" class="btn btn-primary">Start exam</button>' +
      '</div>';
    var sc = document.getElementById("ex-scope");
    sc.innerHTML = SCOPES.map(function (s) {
      var dis = poolCount(s[0]) === 0;
      return '<button class="ex-chip' + (scope === s[0] ? " on" : "") + '" data-s="' + s[0] + '"' + (dis ? " disabled" : "") + '>' + esc(s[1]) + "</button>";
    }).join("");
    [].forEach.call(sc.querySelectorAll(".ex-chip"), function (b) { b.onclick = function () { scope = b.getAttribute("data-s"); config(); }; });
    var ln = document.getElementById("ex-len");
    ln.innerHTML = lenOpts.map(function (n) { return '<button class="ex-chip' + (length === n ? " on" : "") + '" data-n="' + n + '">' + n + "</button>"; }).join("");
    [].forEach.call(ln.querySelectorAll(".ex-chip"), function (b) { b.onclick = function () { length = +b.getAttribute("data-n"); config(); }; });
    document.getElementById("ex-timed").onchange = function (e) { timed = e.target.checked; };
    document.getElementById("ex-start").onclick = start;
  }

  function start() {
    exam = buildExam(POOL, scope, length);
    if (!exam.length) return;
    answers = exam.map(function () { return -1; }); flags = {}; pos = 0;
    tElapsed = 0; tRemain = timed ? exam.length * 60 : 0;
    startTimer();
    question();
  }
  function startTimer() {
    stopTimer();
    timer = setInterval(function () {
      tElapsed++; if (timed) { tRemain--; if (tRemain <= 0) { stopTimer(); return finish(); } }
      var t = document.getElementById("ex-timer"); if (t) t.textContent = fmt(timed ? tRemain : tElapsed);
    }, 1000);
  }
  function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }
  function fmt(s) { s = Math.max(0, s | 0); var m = Math.floor(s / 60); var r = s % 60; return m + ":" + (r < 10 ? "0" : "") + r; }

  function question() {
    var q = exam[pos];
    var answered = answers.filter(function (a) { return a >= 0; }).length;
    root.innerHTML =
      '<div class="ex-bar-wrap"><div class="ex-bar" style="width:' + Math.round((pos) / exam.length * 100) + '%"></div></div>' +
      '<div class="ex-top"><span class="small dim">Question ' + (pos + 1) + ' of ' + exam.length + ' · ' + answered + ' answered</span>' +
        '<span class="ex-timer" id="ex-timer">' + fmt(timed ? tRemain : tElapsed) + (timed ? " left" : "") + '</span></div>' +
      '<div class="ex-card card"><div class="ex-qmeta"><span class="ex-group">' + esc(q.group) + '</span>' +
        '<button class="ex-flag' + (flags[pos] ? " on" : "") + '" id="ex-flag" aria-pressed="' + (!!flags[pos]) + '">' + (flags[pos] ? "⚑ Flagged" : "⚐ Flag") + '</button></div>' +
        '<div class="ex-q">' + esc(q.q) + '</div>' +
        '<div class="ex-opts" role="radiogroup" aria-label="Answers">' +
          q.opts.map(function (o, i) {
            return '<button class="ex-opt' + (answers[pos] === i ? " sel" : "") + '" role="radio" aria-checked="' + (answers[pos] === i) + '" data-i="' + i + '">' +
              '<span class="ex-key">' + String.fromCharCode(65 + i) + '</span>' + esc(o) + "</button>";
          }).join("") +
        '</div></div>' +
      '<div class="ex-nav">' +
        '<button class="btn btn-ghost" id="ex-prev"' + (pos === 0 ? " disabled" : "") + '>← Previous</button>' +
        (pos < exam.length - 1 ? '<button class="btn btn-primary" id="ex-next">Next →</button>'
                               : '<button class="btn btn-primary" id="ex-submit">Submit exam</button>') +
        '<button class="btn btn-ghost ex-end" id="ex-quit">Quit</button>' +
      '</div>';
    [].forEach.call(root.querySelectorAll(".ex-opt"), function (b) {
      b.onclick = function () { answers[pos] = +b.getAttribute("data-i"); question(); };
    });
    document.getElementById("ex-flag").onclick = function () { flags[pos] = !flags[pos]; question(); };
    var prev = document.getElementById("ex-prev"); if (prev) prev.onclick = function () { if (pos > 0) { pos--; question(); } };
    var next = document.getElementById("ex-next"); if (next) next.onclick = function () { if (pos < exam.length - 1) { pos++; question(); } };
    var sub = document.getElementById("ex-submit"); if (sub) sub.onclick = confirmSubmit;
    document.getElementById("ex-quit").onclick = function () { if (confirm("Quit this exam? Your progress will be lost.")) { stopTimer(); config(); } };
  }
  function confirmSubmit() {
    var un = answers.filter(function (a) { return a < 0; }).length;
    if (un && !confirm(un + " question" + (un === 1 ? "" : "s") + " unanswered. Submit anyway?")) return;
    finish();
  }
  function finish() {
    stopTimer();
    var r = score(answers, exam);
    var best = bestGet(), bkey = scope + ":" + length;
    if (best[bkey] == null || r.pct > best[bkey]) { best[bkey] = r.pct; bestSet(best); }
    root.innerHTML =
      '<div class="ex-result card ' + (r.pass ? "pass" : "fail") + '">' +
        '<div class="ex-score">' + Math.round(r.pct * 100) + '%</div>' +
        '<div class="ex-verdict">' + (r.pass ? "Pass ✓" : "Keep going") + '</div>' +
        '<p class="dim">' + r.correct + ' of ' + r.total + ' correct · ' + fmt(tElapsed) + ' taken · pass mark ' + Math.round(PASS * 100) + '%</p>' +
        '<div class="ex-actions"><button class="btn btn-primary" id="ex-retry">New exam</button>' +
        '<button class="btn btn-ghost" id="ex-review">Review answers</button></div>' +
      '</div><div id="ex-reviewlist"></div>';
    document.getElementById("ex-retry").onclick = config;
    document.getElementById("ex-review").onclick = review;
  }
  function review() {
    var host = document.getElementById("ex-reviewlist");
    host.innerHTML = exam.map(function (q, i) {
      var your = answers[i], ok = your === q.c;
      return '<div class="ex-rev ' + (ok ? "ok" : "no") + '"><div class="ex-rev-q">' + (i + 1) + '. ' + esc(q.q) + '</div>' +
        '<div class="ex-rev-a">' + (your < 0 ? '<span class="ex-skip">Not answered</span>'
          : (ok ? '<span class="ex-good">✓ ' + esc(q.opts[your]) + '</span>'
                : '<span class="ex-bad">✗ Your answer: ' + esc(q.opts[your]) + '</span><span class="ex-good">✓ ' + esc(q.opts[q.c]) + '</span>')) +
        '</div>' + (q.expl ? '<div class="ex-rev-x">' + esc(q.expl) + '</div>' : "") +
        '<a class="ex-rev-l small" href="' + esc(q.url) + '">' + esc(q.title) + ' →</a></div>';
    }).join("");
    host.scrollIntoView ? host.scrollIntoView({ block: "start", behavior: prefersReduced ? "auto" : "smooth" }) : 0;
    document.getElementById("ex-review").disabled = true;
  }

  config();
})();

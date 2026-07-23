/* GPU Mastery — spaced-repetition review (Leitner boxes, localStorage).
   Pure scheduling logic is exposed on window.GMReview for testing; DOM UI runs
   only on the review page. No dependencies. Works offline / from file://. */
(function () {
  "use strict";

  var DAY = 86400000;
  var STORE = "gm_review_v1";
  var NEW_PER_SESSION = 20;   // cap on brand-new cards introduced per session
  var MAX_BOX = 5;

  // interval (in days) a card waits after being promoted INTO a given box
  function intervalDays(box) { return Math.pow(2, Math.max(0, box - 1)); } // 1,2,4,8,16

  // grade a card. st = existing {b,d,s,c} or undefined (new). g = 'again'|'good'|'easy'
  function grade(st, g, nowMs) {
    var now = nowMs || Date.now();
    var box = st ? (st.b || 0) : 0;
    var s = st ? (st.s || 0) : 0;
    var c = st ? (st.c || 0) : 0;
    if (g === "again") { box = 1; }
    else if (g === "easy") { box = MAX_BOX; c += 1; }
    else { box = Math.min(box + 1, MAX_BOX); c += 1; } // 'good'
    var due = g === "again" ? now : now + intervalDays(box) * DAY;
    return { b: box, d: due, s: s + 1, c: c };
  }

  function isNew(state, id) { return !state[id]; }
  function isDue(state, id, nowMs) {
    var st = state[id];
    return !!st && st.d <= (nowMs || Date.now());
  }

  function deckFilter(cards, deck) {
    if (!deck || deck === "all") return cards;
    return cards.filter(function (c) { return c.tag === deck; });
  }

  // Build the ordered queue of card ids for a session.
  function buildQueue(cards, state, deck, nowMs, newLimit) {
    var now = nowMs || Date.now();
    var lim = newLimit == null ? NEW_PER_SESSION : newLimit;
    var pool = deckFilter(cards, deck);
    var due = pool.filter(function (c) { return isDue(state, c.id, now); })
                  .sort(function (a, b) { return state[a.id].d - state[b.id].d; });
    var fresh = pool.filter(function (c) { return isNew(state, c.id); }).slice(0, lim);
    return due.concat(fresh).map(function (c) { return c.id; });
  }

  function stats(cards, state, deck, nowMs) {
    var now = nowMs || Date.now();
    var pool = deckFilter(cards, deck);
    var o = { total: pool.length, fresh: 0, learning: 0, due: 0, mastered: 0 };
    pool.forEach(function (c) {
      var st = state[c.id];
      if (!st) { o.fresh++; return; }
      if (st.b >= MAX_BOX) o.mastered++;
      else o.learning++;
      if (st.d <= now) o.due++;
    });
    return o;
  }

  window.GMReview = {
    intervalDays: intervalDays, grade: grade, buildQueue: buildQueue,
    stats: stats, isDue: isDue, isNew: isNew, DAY: DAY, MAX_BOX: MAX_BOX
  };

  // ---------------------------------------------------------------- DOM UI
  if (typeof document === "undefined") return;
  var body = document.body;
  if (!body || body.getAttribute("data-lesson") !== "review") return;

  var root = document.getElementById("rv-app");
  if (!root) return;
  var cards = (window.GM_REVIEW || []).slice();

  // ---- persistence (degrades to in-memory if storage is blocked) ----
  var mem = null;
  function load() {
    if (mem) return mem;
    try { mem = JSON.parse(localStorage.getItem(STORE) || "{}"); }
    catch (e) { mem = {}; }
    return mem;
  }
  function save() {
    try { localStorage.setItem(STORE, JSON.stringify(mem)); } catch (e) {}
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var state = load();
  var byId = {}; cards.forEach(function (c) { byId[c.id] = c; });
  var deck = "all";

  // ---------- dashboard ----------
  function dashboard() {
    var s = stats(cards, state, deck);
    root.innerHTML =
      '<div class="rv-decks" role="tablist" aria-label="Deck">' +
        deckBtn("all", "All cards", cards.length) +
        deckBtn("term", "Terms", cards.filter(function (c) { return c.tag === "term"; }).length) +
        deckBtn("quiz", "Quiz Q&amp;A", cards.filter(function (c) { return c.tag === "quiz"; }).length) +
      '</div>' +
      '<div class="rv-stats">' +
        stat(s.due, "Due now", "due") +
        stat(s.fresh, "New", "new") +
        stat(s.learning, "Learning", "learning") +
        stat(s.mastered, "Mastered", "mastered") +
      '</div>' +
      '<div class="rv-actions">' +
        '<button id="rv-start" class="btn btn-primary">' + startLabel(s) + '</button>' +
        '<button id="rv-reset" class="btn btn-ghost">Reset progress</button>' +
      '</div>' +
      '<p class="rv-hint dim small">Grade honestly: <b>Again</b> if you blanked, <b>Good</b> if you recalled it, <b>Easy</b> if it was instant. ' +
      'Keyboard: <kbd>Space</kbd> flip · <kbd>1</kbd>/<kbd>2</kbd>/<kbd>3</kbd> grade.</p>';

    Array.prototype.forEach.call(root.querySelectorAll(".rv-deck"), function (b) {
      b.addEventListener("click", function () { deck = b.getAttribute("data-deck"); dashboard(); });
    });
    document.getElementById("rv-start").addEventListener("click", startSession);
    document.getElementById("rv-reset").addEventListener("click", function () {
      if (confirm("Reset all review progress in this browser? This cannot be undone.")) {
        mem = {}; state = mem; save(); dashboard();
      }
    });
  }
  function deckBtn(id, label, n) {
    return '<button class="rv-deck' + (deck === id ? " on" : "") + '" data-deck="' + id + '" role="tab" aria-selected="' + (deck === id) + '">' +
      label + ' <span class="rv-n">' + n + '</span></button>';
  }
  function stat(n, label, kind) {
    return '<div class="rv-stat rv-' + kind + '"><div class="rv-stat-n" data-kind="' + kind + '">' + n + '</div><div class="rv-stat-l">' + label + '</div></div>';
  }
  function startLabel(s) {
    var n = s.due + Math.min(s.fresh, NEW_PER_SESSION);
    if (n === 0) return "Nothing due — review anyway";
    return "Start review (" + n + " card" + (n === 1 ? "" : "s") + ")";
  }

  // ---------- session ----------
  var queue = [], pos = 0, reviewed = 0, gradedAgain = 0, flipped = false;

  function startSession() {
    queue = buildQueue(cards, state, deck, Date.now(), NEW_PER_SESSION);
    if (queue.length === 0) {
      // nothing due and no new — allow a free review over the whole deck
      queue = deckFilter(cards, deck).map(function (c) { return c.id; });
    }
    pos = 0; reviewed = 0; gradedAgain = 0;
    if (queue.length === 0) { dashboard(); return; }
    showCard();
  }

  function showCard() {
    if (pos >= queue.length) return finish();
    var card = byId[queue[pos]];
    if (!card) { pos++; return showCard(); }
    flipped = false;
    var total = queue.length;
    var done = reviewed;
    var pct = total ? Math.round((done / total) * 100) : 0;
    root.innerHTML =
      '<div class="rv-progress"><div class="rv-bar" style="width:' + pct + '%"></div></div>' +
      '<div class="rv-meta small dim"><span>' + (done + 1) + ' / ' + total + '</span>' +
        '<span class="rv-tag rv-tag-' + card.tag + '">' + (card.tag === "term" ? "Term" : "Quiz") + '</span></div>' +
      '<div class="rv-card' + (prefersReduced ? " rv-noanim" : "") + '" id="rv-card" tabindex="0" role="group" aria-label="Flashcard">' +
        '<div class="rv-face rv-front"><div class="rv-q" aria-live="polite">' + esc(card.front) + '</div>' +
          '<button class="btn btn-ghost rv-flip" id="rv-flip">Show answer</button></div>' +
        '<div class="rv-face rv-back" id="rv-back" hidden>' +
          '<div class="rv-a" aria-live="polite">' + esc(card.back) + '</div>' +
          (card.url && card.tag === "quiz" ? '<a class="rv-src small" href="' + esc(card.url) + '">' + esc(card.title || "Open lesson") + ' →</a>' : "") +
          (card.tag === "term" && card.url ? '<a class="rv-src small" href="' + esc(card.url) + '">Where this is taught →</a>' : "") +
          '<div class="rv-grades" role="group" aria-label="Grade your recall">' +
            '<button class="rv-grade rv-again" data-g="again"><b>Again</b><span>1</span></button>' +
            '<button class="rv-grade rv-good" data-g="good"><b>Good</b><span>2</span></button>' +
            '<button class="rv-grade rv-easy" data-g="easy"><b>Easy</b><span>3</span></button>' +
          '</div></div>' +
      '</div>' +
      '<div class="rv-actions"><button class="btn btn-ghost small" id="rv-end">End session</button></div>';

    document.getElementById("rv-flip").addEventListener("click", flip);
    document.getElementById("rv-end").addEventListener("click", finish);
    Array.prototype.forEach.call(root.querySelectorAll(".rv-grade"), function (b) {
      b.addEventListener("click", function () { gradeCard(b.getAttribute("data-g")); });
    });
    var cardEl = document.getElementById("rv-card");
    if (cardEl) cardEl.focus();
  }

  function flip() {
    if (flipped) return;
    flipped = true;
    var back = document.getElementById("rv-back");
    var frontBtn = document.getElementById("rv-flip");
    if (back) { back.hidden = false; back.classList.add("rv-in"); }
    if (frontBtn) frontBtn.style.display = "none";
    var first = root.querySelector(".rv-good");
    if (first) first.focus();
  }

  function gradeCard(g) {
    if (!flipped) return;
    var id = queue[pos];
    state[id] = grade(state[id], g, Date.now());
    save();
    reviewed++;
    if (g === "again") { queue.push(id); gradedAgain++; } // requeue this session
    pos++;
    showCard();
  }

  function finish() {
    var seen = reviewed;
    root.innerHTML =
      '<div class="rv-done card">' +
        '<h2>Session complete</h2>' +
        '<p class="lead">You reviewed <b>' + seen + '</b> card' + (seen === 1 ? "" : "s") +
          (gradedAgain ? ' · <b>' + gradedAgain + '</b> marked <i>Again</i> for another pass' : "") + '.</p>' +
        '<p class="dim small">Cards you knew won\'t return for days; cards you missed come back soon. Come back tomorrow to keep the schedule.</p>' +
        '<div class="rv-actions"><button id="rv-again" class="btn btn-primary">Review more</button>' +
        '<a class="btn btn-ghost" href="curriculum.html">Back to curriculum</a></div>' +
      '</div>';
    document.getElementById("rv-again").addEventListener("click", dashboard);
  }

  // keyboard
  document.addEventListener("keydown", function (e) {
    if (body.getAttribute("data-lesson") !== "review") return;
    if (!document.getElementById("rv-card")) return;
    var tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (!flipped && (e.key === " " || e.key === "Enter")) { e.preventDefault(); flip(); return; }
    if (flipped) {
      if (e.key === "1") { e.preventDefault(); gradeCard("again"); }
      else if (e.key === "2") { e.preventDefault(); gradeCard("good"); }
      else if (e.key === "3") { e.preventDefault(); gradeCard("easy"); }
    }
    if (e.key === "Escape") finish();
  });

  dashboard();
})();

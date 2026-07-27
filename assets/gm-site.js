/* GPU Mastery — platform injector: byline, favicon, a11y, KaTeX. Single source, path-aware. */
(function () {
  var GM = window.GM || { assetBase: "assets/", rootBase: "" };
  var asset = GM.assetBase, root = GM.rootBase;
  var CREATOR = "U E Sai Pavan Vamshi Krishna";

  function ensureFavicon() {
    if (document.querySelector('link[rel="icon"]')) return;
    var links = [
      { rel: "icon", type: "image/svg+xml", href: asset + "img/favicon.svg" },
      { rel: "icon", type: "image/png", href: asset + "img/favicon-32.png", sizes: "32x32" },
      { rel: "apple-touch-icon", href: asset + "img/favicon-180.png", sizes: "180x180" },
      { rel: "shortcut icon", href: asset + "img/favicon.ico" }
    ];
    links.forEach(function (x) {
      var l = document.createElement("link"); l.rel = x.rel;
      if (x.type) l.type = x.type; l.href = x.href; if (x.sizes) l.setAttribute("sizes", x.sizes);
      document.head.appendChild(l);
    });
  }

  function ensureA11y() {
    if (!document.getElementById("gm-skip")) {
      var a = document.createElement("a"); a.id = "gm-skip"; a.className = "gm-skip";
      a.href = "#gm-main"; a.textContent = "Skip to content";
      document.body.insertBefore(a, document.body.firstChild);
    }
    var wrap = document.querySelector(".wrap");
    if (wrap && !wrap.id) { wrap.id = "gm-main"; wrap.setAttribute("role", "main"); wrap.setAttribute("tabindex", "-1"); }
  }

  function injectByline() {
    var placed = false;
    var nav = document.querySelector("nav .inner");
    if (nav && !nav.querySelector(".gm-credit")) {
      var c = document.createElement("span"); c.className = "gm-credit";
      c.setAttribute("aria-label", "Built by " + CREATOR);
      c.innerHTML = '<span class="by">Built by</span> <span class="nm">' + CREATOR + "</span>";
      nav.appendChild(c); placed = true;
    } else if (nav) placed = true;
    var foot = document.querySelector(".footer");
    if (foot && !foot.querySelector(".gm-foot-links")) {
      var row = document.createElement("div"); row.className = "gm-foot-links";
      row.innerHTML = '<a href="' + root + 'curriculum.html">Curriculum</a> · <a href="' + root + 'labs.html">Labs</a> · ' +
        '<a href="' + root + 'glossary.html">Glossary</a> · <a href="' + root + 'review.html">Review</a> · ' +
        '<a href="' + root + 'interview.html">Interview</a> · <a href="' + root + 'exam.html">Exam</a> · ' +
        '<a href="' + root + 'cheatsheet.html">Cheat sheets</a> · <a href="' + root + 'concept-map.html">Concept map</a> · ' +
        '<a href="#" class="gm-open-search">Search</a>';
      foot.appendChild(row);
      var so = row.querySelector(".gm-open-search");
      if (so) so.addEventListener("click", function (e) { e.preventDefault(); if (window.GMSearch) window.GMSearch.open(); });
    }
    if (foot && foot.textContent.indexOf("Sai Pavan") === -1) {
      var f = document.createElement("div"); f.className = "gm-foot-credit"; f.textContent = "Built by " + CREATOR;
      foot.appendChild(f);
    }
    return placed;
  }
  function retryByline(n) { if (!injectByline() && n > 0) setTimeout(function () { retryByline(n - 1); }, 120); }

  function labelDiagrams() {
    var svgs = document.querySelectorAll(".diagram svg");
    for (var i = 0; i < svgs.length; i++) {
      var svg = svgs[i]; if (svg.getAttribute("aria-hidden")) continue;
      if (!svg.getAttribute("role")) svg.setAttribute("role", "img");
      var box = svg.closest ? svg.closest(".diagram") : null;
      var cap = box && box.querySelector(".cap");
      if (cap && !svg.getAttribute("aria-label")) svg.setAttribute("aria-label", cap.textContent.trim());
    }
  }

  function renderMath() {
    if (!window.renderMathInElement) return false;
    try {
      window.renderMathInElement(document.body, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true }
        ],
        ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "option"],
        ignoredClasses: ["gm-nomath"],
        throwOnError: false
      });
    } catch (e) {}
    return true;
  }
  function waitKatex(n) { if (renderMath()) return; if (n > 0) setTimeout(function () { waitKatex(n - 1); }, 100); }

  function hasMath(){ try { return /\$\$|\\\(|\\\[/.test(document.body.innerHTML); } catch(e){ return false; } }

  function esc(s){ return String(s == null ? "" : s).replace(/[&<>]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;"}[c]; }); }
  function loadScript(src, cb){ var s = document.createElement("script"); s.src = src; s.onload = cb; s.onerror = cb; document.head.appendChild(s); }
  function pageKeys(){ var p = location.pathname.split("/").filter(Boolean); return [p.slice(-2).join("/"), p.slice(-1)[0] || ""]; }
  function injectLessonMeta(){
    if (!window.GM_LESSONMETA) return;
    var keys = pageKeys(), meta = null;
    for (var i = 0; i < keys.length; i++) if (window.GM_LESSONMETA[keys[i]]) { meta = window.GM_LESSONMETA[keys[i]]; break; }
    if (!meta) return;
    var main = document.getElementById("gm-main") || document.querySelector(".wrap");
    if (!main) return;
    if (meta.p && !main.querySelector(".gm-prereq")) {
      var h1 = main.querySelector("h1");
      var box = document.createElement("div"); box.className = "gm-prereq";
      box.innerHTML = '<span class="gm-prereq-l">Prerequisites</span> <span>' + esc(meta.p) + "</span>";
      if (h1 && h1.parentNode) h1.parentNode.insertBefore(box, h1.nextSibling);
      else main.insertBefore(box, main.firstChild);
    }
    if (meta.m && meta.m.length && !main.querySelector(".gm-misc")) {
      var mis = document.createElement("div"); mis.className = "gm-misc";
      mis.innerHTML = '<div class="gm-misc-h"><span class="gm-misc-x" aria-hidden="true">!</span> Common misconceptions</div>' +
        meta.m.map(function (x) { return '<div class="gm-misc-i"><b>&ldquo;' + esc(x.w) + '&rdquo;</b> <span>' + esc(x.r) + "</span></div>"; }).join("");
      var kp = main.querySelector(".keypoints");
      if (kp && kp.parentNode) {
        var anchor = kp;                     // hoist above a "Key ideas/points" heading if present
        var prev = kp.previousElementSibling;
        if (prev && /^H[1-4]$/.test(prev.tagName || "") && /key/i.test(prev.textContent || "") && prev.parentNode) anchor = prev;
        (anchor.parentNode || kp.parentNode).insertBefore(mis, anchor.parentNode ? anchor : kp);
      } else {
        var f = main.querySelector(".footer");
        if (f && f.parentNode) f.parentNode.insertBefore(mis, f); else main.appendChild(mis);
      }
    }
  }
  function bootMeta(){
    if (!/lesson-\d/.test(location.pathname)) return;       // only lesson pages carry this data
    if (window.GM_LESSONMETA) { injectLessonMeta(); return; }
    loadScript(asset + "gm-lessonmeta-data.js", injectLessonMeta);
  }

  function injectResume(){
    if (document.body.getAttribute("data-lesson") !== "home") return;
    var last; try { last = JSON.parse(localStorage.getItem("gpum:lastLesson")); } catch (e) {}
    if (!last || !last.rel) return;
    var main = document.getElementById("gm-main") || document.querySelector(".wrap");
    if (!main || main.querySelector(".gm-resume")) return;
    var a = document.createElement("a"); a.className = "gm-resume"; a.href = root + last.rel;
    a.innerHTML = '<span class="gm-resume-l">↻ Resume where you left off</span>' +
      '<span class="gm-resume-t">' + esc(last.title || "Continue the course") + " →</span>";
    var h1 = main.querySelector("h1");
    if (h1 && h1.parentNode) h1.parentNode.insertBefore(a, h1.nextSibling);
    else main.insertBefore(a, main.firstChild);
  }

  function boot() { ensureFavicon(); ensureA11y(); retryByline(25); labelDiagrams(); bootMeta(); injectResume(); if (hasMath()) waitKatex(40); }
  if (document.readyState !== "loading") boot();
  else document.addEventListener("DOMContentLoaded", boot);
})();

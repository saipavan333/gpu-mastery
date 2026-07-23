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
  function boot() { ensureFavicon(); ensureA11y(); retryByline(25); labelDiagrams(); if (hasMath()) waitKatex(40); }
  if (document.readyState !== "loading") boot();
  else document.addEventListener("DOMContentLoaded", boot);
})();

/* GPU Mastery — shared behavior: quizzes, progress, diagrams, copy. No dependencies. */
(function () {
  /* --- platform bootstrap: path-aware load of the shared layer (KaTeX + injector) --- */
  var ME = document.currentScript;
  var rel = (ME && ME.getAttribute("src")) || "assets/app.js";
  var assetBase = rel.replace(/app\.js.*$/, "");
  var rootBase = assetBase.replace(/assets\/$/, "");
  window.GM = { assetBase: assetBase, rootBase: rootBase };
  (function () {
    function css(h) { var l = document.createElement("link"); l.rel = "stylesheet"; l.href = h; document.head.appendChild(l); }
    function js(s, cb) { var x = document.createElement("script"); x.src = s; if (cb) x.onload = cb; document.head.appendChild(x); }
    css(assetBase + "gm-site.css");
    js(assetBase + "gm-site.js");
    css(assetBase + "gm-motion.css");
    js(assetBase + "gm-motion.js");
    js(assetBase + "gm-search.js");
    css(assetBase + "gm-glossary.css");
    js(assetBase + "gm-glossary.js");
    css(assetBase + "gm-assistant.css");
    js(assetBase + "gm-assistant.js");
    if (/\$\$|\\\(|\\\[/.test(document.documentElement.innerHTML)) {   // KaTeX only where math exists (§5.7)
      css(assetBase + "katex/katex.min.css");
      js(assetBase + "katex/katex.min.js", function () { js(assetBase + "katex/contrib/auto-render.min.js"); });
    }
    // PWA: register the service worker (offline / installable). Skips file:// safely.
    if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register(rootBase + "sw.js").catch(function () {});
      });
    }
  })();

  var store = {
    get: function (k, d) { try { var v = localStorage.getItem("gpum:" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("gpum:" + k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---- diagrams: <div class="diagram" data-diagram="key" data-caption="..."> ---- */
  function injectDiagrams() {
    if (!window.DIAGRAMS) return;
    var els = document.querySelectorAll("[data-diagram]");
    for (var i = 0; i < els.length; i++) {
      var el = els[i], key = el.getAttribute("data-diagram");
      if (window.DIAGRAMS[key]) {
        el.innerHTML = window.DIAGRAMS[key] +
          (el.getAttribute("data-caption") ? '<div class="cap">' + el.getAttribute("data-caption") + "</div>" : "");
      }
    }
  }

  /* ---- quizzes: .quiz with buttons.opt[data-c="1"] and .expl ---- */
  function wireQuizzes() {
    var quizzes = document.querySelectorAll(".quiz");
    for (var i = 0; i < quizzes.length; i++) (function (qz) {
      var opts = qz.querySelectorAll("button.opt");
      var expl = qz.querySelector(".expl");
      for (var j = 0; j < opts.length; j++) (function (btn) {
        btn.addEventListener("click", function () {
          for (var k = 0; k < opts.length; k++) {
            opts[k].disabled = true;
            if (opts[k].getAttribute("data-c") === "1") opts[k].classList.add("correct");
          }
          if (btn.getAttribute("data-c") !== "1") btn.classList.add("wrong");
          if (expl) expl.classList.add("show");
        });
      })(opts[j]);
    })(quizzes[i]);
  }

  /* ---- lesson completion: button#donebtn on pages with body[data-lesson] ---- */
  function wireDone() {
    var id = document.body.getAttribute("data-lesson");
    var btn = document.getElementById("donebtn");
    if (!id || !btn) return;
    function paint() {
      var done = !!store.get("done:" + id, false);
      btn.classList.toggle("done", done);
      btn.textContent = done ? "✓ Completed — click to undo" : "Mark lesson complete";
    }
    btn.addEventListener("click", function () {
      store.set("done:" + id, !store.get("done:" + id, false)); paint();
    });
    paint();
  }

  /* ---- module progress: .lesson-list li[data-lesson] + .progressbar>div ---- */
  function paintProgress() {
    var items = document.querySelectorAll(".lesson-list li[data-lesson]");
    var done = 0;
    for (var i = 0; i < items.length; i++) {
      var d = !!store.get("done:" + items[i].getAttribute("data-lesson"), false);
      items[i].classList.toggle("done", d);
      if (d) done++;
    }
    var bars = document.querySelectorAll(".progressbar > div");
    if (items.length && bars.length) {
      for (var b = 0; b < bars.length; b++) bars[b].style.width = Math.round(100 * done / items.length) + "%";
    }
    var lbl = document.getElementById("proglabel");
    if (lbl && items.length) lbl.textContent = done + " / " + items.length + " lessons complete";
  }

  /* ---- copy buttons: .copybtn[data-copy-target="#id"] ---- */
  function wireCopy() {
    var btns = document.querySelectorAll(".copybtn[data-copy-target]");
    for (var i = 0; i < btns.length; i++) (function (btn) {
      btn.addEventListener("click", function () {
        var t = document.querySelector(btn.getAttribute("data-copy-target"));
        if (!t) return;
        var txt = t.innerText || t.textContent;
        function ok() { var old = btn.textContent; btn.textContent = "Copied ✓"; setTimeout(function () { btn.textContent = old; }, 1600); }
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(ok, ok);
        else { var ta = document.createElement("textarea"); ta.value = txt; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (e) {} document.body.removeChild(ta); ok(); }
      });
    })(btns[i]);
  }

  document.addEventListener("DOMContentLoaded", function () {
    injectDiagrams(); wireQuizzes(); wireDone(); paintProgress(); wireCopy();
  });
})();

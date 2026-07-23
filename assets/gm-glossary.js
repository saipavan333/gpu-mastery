/* GPU Mastery — glossary tooltips. Marks the first occurrence of each term in lesson prose. */
(function () {
  var GM = window.GM || { assetBase: "assets/", rootBase: "" };
  function withData(cb) {
    if (window.GM_GLOSSARY) return cb(window.GM_GLOSSARY);
    var s = document.createElement("script"); s.src = GM.assetBase + "gm-glossary-data.js";
    s.onload = function () { cb(window.GM_GLOSSARY || []); }; s.onerror = function () { cb([]); };
    document.head.appendChild(s);
  }
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  function reEsc(s){ return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }

  function markup(G) {
    // only on lesson/lab content pages (skip the glossary page itself and thin hubs)
    var body = document.body, dl = body.getAttribute("data-lesson") || "";
    if (dl === "glossary" || dl === "search" || dl === "home") return;
    var main = document.getElementById("gm-main") || document.querySelector(".wrap"); if (!main) return;

    // term -> {def, url}; register aliases; sort by length desc so multiword wins
    var map = [], seen = {};
    G.forEach(function (e) {
      var forms = [e.t].concat(e.a || []);
      forms.forEach(function (f) { map.push({ form: f, term: e.t, def: e.d, url: e.s }); });
    });
    map.sort(function (a, b) { return b.form.length - a.form.length; });
    var used = {}, root = GM.rootBase;

    var walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode, tag = p && p.tagName ? p.tagName.toLowerCase() : "";
        if (/^(code|pre|a|h1|h2|h3|button|summary|kbd|script|style)$/.test(tag)) return NodeFilter.FILTER_REJECT;
        if (p && p.closest && p.closest(".gm-term, .keypoints, .quiz .opt, nav, .footer, .lesson-top, .diagram")) return NodeFilter.FILTER_REJECT;
        if (!/[A-Za-z]{3,}/.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = []; for (var t; (t = walker.nextNode());) nodes.push(t);

    nodes.forEach(function (node) {
      for (var i = 0; i < map.length; i++) {
        var m = map[i]; if (used[m.term]) continue;
        var re = new RegExp("\\b" + reEsc(m.form) + "\\b", "i");
        var mm = node.nodeValue.match(re); if (!mm) continue;
        var idx = mm.index, len = mm[0].length;
        var span = document.createElement("span");
        span.className = "gm-term"; span.tabIndex = 0; span.setAttribute("role", "link");
        span.setAttribute("aria-label", m.term + ": " + m.def);
        span.textContent = node.nodeValue.substr(idx, len);
        var tip = document.createElement("span"); tip.className = "gm-tip"; tip.setAttribute("role", "tooltip");
        tip.innerHTML = "<b>" + esc(m.term) + "</b> " + esc(m.def) + (m.url ? ' <a href="' + root + m.url + '">→ lesson</a>' : "");
        span.appendChild(tip);
        var after = node.splitText(idx); after.nodeValue = after.nodeValue.substr(len);
        node.parentNode.insertBefore(span, after);
        used[m.term] = 1;
        break; // one term per node pass; continue to next node
      }
    });
  }
  function boot() { withData(function (G) { if (G && G.length) try { markup(G); } catch (e) {} }); }
  if (document.readyState !== "loading") boot(); else document.addEventListener("DOMContentLoaded", boot);
})();

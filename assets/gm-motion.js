/* GPU Mastery — coherent motion layer (single source, playbook §4).
   A calm opacity-only page-entrance + gentle scroll-reveal of content sections.
   Content is FULLY VISIBLE if JS is off or motion is reduced — the hidden-then-
   revealed state is only ADDED here, and only when motion is allowed.
   No particle backgrounds; one consistent easing/timing everywhere. */
(function () {
  "use strict";
  if (typeof document === "undefined") return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;   // leave everything visible and static

  var root = document.documentElement;

  function run() {
    root.classList.add("gm-anim");                 // arms the CSS hidden states (JS-on + motion-allowed only)
    // page entrance: fade the whole page in (opacity-only, so nothing shifts)
    requestAnimationFrame(function () { document.body.classList.add("gm-entered"); });

    var main = document.getElementById("gm-main") || document.querySelector(".wrap") || document.body;
    if (!main || !("IntersectionObserver" in window)) { root.classList.remove("gm-anim"); return; }

    var sel = "h2, .card, .trackcard, .step, .cm-node, .diagram, .quiz, .keypoints, details, table, .cs-card, .iv-card, .lab, .callout, .lesson-nav, .gm-prereq, .gm-misc";
    var nodes = [].slice.call(main.querySelectorAll(sel));
    var vh = window.innerHeight || 800, group = 0, gy = -1;
    nodes.forEach(function (el) {
      // don't hide anything already above the fold on load — reveal it immediately, no flash
      var top = el.getBoundingClientRect().top;
      el.classList.add("gm-reveal");
      if (top < vh * 0.9) { el.classList.add("gm-in"); return; }
      // gentle stagger for items that share a horizontal band
      var y = Math.round(top / 40);
      if (y !== gy) { group = 0; gy = y; } else { group++; }
      el.style.transitionDelay = Math.min(group * 45, 180) + "ms";
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("gm-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    nodes.forEach(function (el) { if (!el.classList.contains("gm-in")) io.observe(el); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();

/* GPU Mastery — coherent motion layer (single source, playbook §4).
   A calm page-entrance + gentle scroll-reveal of content sections.
   Content is FULLY VISIBLE if JS is off or motion is reduced — the hidden-then-
   revealed state is only ADDED here, and only when motion is allowed.
   Critical CSS is injected SYNCHRONOUSLY from this file so class toggles always
   have their styles (no async-stylesheet race), and the entrance uses a
   self-completing keyframe so it can never get stuck hidden. */
(function () {
  "use strict";
  if (typeof document === "undefined") return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;   // accessibility: leave everything visible and static

  var E = "cubic-bezier(.22,.61,.36,1)";
  var css =
    "@keyframes gmPageIn{from{opacity:0}to{opacity:1}}" +
    "html.gm-anim body{animation:gmPageIn .5s " + E + " both}" +
    "html.gm-anim .gm-reveal{opacity:0;transform:translateY(18px);will-change:opacity,transform}" +
    "html.gm-anim .gm-reveal.gm-in{opacity:1;transform:none;transition:opacity .6s " + E + ",transform .6s " + E + "}";
  var st = document.createElement("style"); st.id = "gm-motion-style"; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);

  var root = document.documentElement;

  function run() {
    root.classList.add("gm-anim");   // arms the injected states; entrance keyframe fires immediately

    var main = document.getElementById("gm-main") || document.querySelector(".wrap") || document.body;
    if (!main || !("IntersectionObserver" in window)) return;   // entrance still runs; no reveal hiding

    var sel = "h2, .card, .trackcard, .step, .cm-node, .diagram, .quiz, .keypoints, details, table, .cs-card, .iv-card, .lab, .callout, .lesson-nav, .gm-prereq, .gm-misc, .labcard, .gl-item, .hero .eyebrow, .hero h1, .hero .subhead, .hero .cta-row, .hero .small, .hero-art, .stats";
    var nodes = [].slice.call(main.querySelectorAll(sel));
    var vh = window.innerHeight || 800, group = 0, gy = -1, onLoad = [];
    nodes.forEach(function (el) {
      var top = el.getBoundingClientRect().top;
      el.classList.add("gm-reveal");
      if (top < vh * 0.92) { onLoad.push(el); return; }   // already on screen: animate in on next paint (see below)
      var y = Math.round(top / 40);
      if (y !== gy) { group = 0; gy = y; } else { group++; }
      el.style.transitionDelay = Math.min(group * 45, 180) + "ms";
    });

    // Elements already on screen at load still need to VISIBLY transition, not just
    // snap to their end state. A class added in the same tick as gm-reveal never gets
    // a painted "before" frame, so the browser skips the transition entirely. Force one
    // real frame first (double rAF), stagger like the scroll case, THEN flip to gm-in.
    if (onLoad.length) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          var g = 0, gy2 = -1;
          onLoad.forEach(function (el) {
            var y = Math.round(el.getBoundingClientRect().top / 40);
            if (y !== gy2) { g = 0; gy2 = y; } else { g++; }
            el.style.transitionDelay = Math.min(g * 45, 180) + "ms";
            el.classList.add("gm-in");
          });
        });
      });
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("gm-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    nodes.forEach(function (el) { if (!el.classList.contains("gm-in")) io.observe(el); });

    // safety net: if anything is still hidden shortly after load, reveal it (never trap content)
    setTimeout(function () {
      nodes.forEach(function (el) { if (!el.classList.contains("gm-in")) el.classList.add("gm-in"); });
    }, 2600);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();

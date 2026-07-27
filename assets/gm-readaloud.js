/* GPU Mastery — read-aloud (Web Speech API). Reads a lesson's prose with a
   selectable voice and speed, highlighting the current block. Free, offline-capable
   (uses the OS voices), a11y-friendly, reduced-motion aware. Namespaced .gm-ra. */
(function () {
  "use strict";
  if (typeof document === "undefined") return;
  if (window.__gmRaLoaded) return; window.__gmRaLoaded = true;

  function boot() {
    if (!/lesson-\d/.test(location.pathname)) return;          // lessons only
    var synth = window.speechSynthesis;
    var main = document.getElementById("gm-main") || document.querySelector(".wrap");
    if (!synth || !("SpeechSynthesisUtterance" in window) || !main) return;   // graceful: no control if unsupported

    // collect readable blocks in document order (skip code, diagrams, quizzes, tooltips, footer)
    var SKIP = "pre, code, .diagram, .quiz, .gm-tip, .gm-eq, .footer, .gm-foot-links, script, style, .gm-ra";
    var blocks = [].slice.call(main.querySelectorAll("h1, h2, h3, p, li")).filter(function (el) {
      if (el.closest && el.closest(SKIP)) return false;
      return (el.textContent || "").trim().length > 1;
    });
    if (blocks.length < 2) return;

    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var bar = document.createElement("div");
    bar.className = "gm-ra"; bar.setAttribute("role", "group"); bar.setAttribute("aria-label", "Read this lesson aloud");
    bar.innerHTML =
      '<button class="gm-ra-btn gm-ra-play" aria-pressed="false">▶ <span>Read aloud</span></button>' +
      '<button class="gm-ra-btn gm-ra-stop" hidden aria-label="Stop reading">■</button>' +
      '<select class="gm-ra-voice" aria-label="Voice"></select>' +
      '<label class="gm-ra-rate-l">Speed <input type="range" class="gm-ra-rate" min="0.7" max="1.4" step="0.1" value="1" aria-label="Reading speed"></label>';
    var anchor = main.querySelector("h1");
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(bar, anchor.nextSibling);
    else main.insertBefore(bar, main.firstChild);

    var playBtn = bar.querySelector(".gm-ra-play"), stopBtn = bar.querySelector(".gm-ra-stop"),
        voiceSel = bar.querySelector(".gm-ra-voice"), rateInp = bar.querySelector(".gm-ra-rate");
    var voices = [], i = 0, playing = false, paused = false, current = null;

    function loadVoices() {
      voices = (synth.getVoices() || []).filter(function (v) { return /^en(-|_|$)/i.test(v.lang); });
      if (!voices.length) voices = synth.getVoices() || [];
      voiceSel.innerHTML = voices.map(function (v, k) {
        return '<option value="' + k + '"' + (v.default ? " selected" : "") + ">" + v.name.replace(/</g, "") + "</option>";
      }).join("");
    }
    loadVoices();
    if (typeof synth.onvoiceschanged !== "undefined") synth.onvoiceschanged = loadVoices;

    function clearHi() { if (current) { current.classList.remove("gm-ra-on"); current = null; } }
    function speakFrom(idx) {
      if (idx >= blocks.length) { finish(); return; }
      i = idx;
      var u = new SpeechSynthesisUtterance(blocks[i].textContent.trim());
      var v = voices[voiceSel.value | 0]; if (v) u.voice = v;
      u.rate = parseFloat(rateInp.value) || 1; u.lang = (v && v.lang) || "en-US";
      u.onstart = function () {
        clearHi(); current = blocks[i]; current.classList.add("gm-ra-on");
        if (current.scrollIntoView) current.scrollIntoView({ block: "center", behavior: reduced ? "auto" : "smooth" });
      };
      u.onend = function () { if (playing) speakFrom(i + 1); };
      u.onerror = function () { if (playing) speakFrom(i + 1); };
      synth.speak(u);
    }
    function start() { playing = true; paused = false; setUI(); synth.cancel(); speakFrom(0); }
    function finish() { playing = false; paused = false; clearHi(); setUI(); try { synth.cancel(); } catch (e) {} }
    function setUI() {
      playBtn.setAttribute("aria-pressed", playing && !paused ? "true" : "false");
      playBtn.innerHTML = !playing ? "▶ <span>Read aloud</span>" : (paused ? "▶ <span>Resume</span>" : "❚❚ <span>Pause</span>");
      stopBtn.hidden = !playing;
    }
    playBtn.addEventListener("click", function () {
      if (!playing) { start(); }
      else if (!paused) { synth.pause(); paused = true; setUI(); }
      else { synth.resume(); paused = false; setUI(); }
    });
    stopBtn.addEventListener("click", finish);
    rateInp.addEventListener("change", function () { if (playing && !paused) { var at = i; playing = true; synth.cancel(); speakFrom(at); } });
    window.addEventListener("beforeunload", function () { try { synth.cancel(); } catch (e) {} });
    setUI();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();

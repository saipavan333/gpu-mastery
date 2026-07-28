/* GPU Mastery — animated hero (home page only, loaded by app.js when #hero-canvas exists).
   A grid of compute cells with a wavefront of activation sweeping across it — grid ->
   blocks -> warps, the parallel machine, alive. Canvas 2D, no dependencies, works offline.
   Honors prefers-reduced-motion (draws ONE static frame, no loop). Pauses on hidden tab.
   The static assets/hero-grid.svg remains the no-JS fallback (inside <noscript>). */
(function () {
  "use strict";
  var canvas = document.getElementById("hero-canvas");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var COLS = 18, ROWS = 13;                 // compute grid (~aspect of the 513x373 art)
  var STOPS = [[91, 155, 255], [55, 224, 200], [180, 140, 255]];  // --acc, --acc2, --violet
  var maxDiag = (COLS - 1) + (ROWS - 1);
  var BAND = 6;                             // width of the active wavefront (diagonal units)
  var PERIOD = 4200;                        // ms per full sweep
  var ASPECT = 373 / 513;                   // keep the original art's proportions

  function lerp(a, b, t) { return a + (b - a) * t; }
  function colorAt(t) {                      // t in [0,1] along the diagonal -> blue->teal->violet
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    var seg = t < 0.5 ? 0 : 1, lt = t < 0.5 ? t / 0.5 : (t - 0.5) / 0.5;
    var a = STOPS[seg], b = STOPS[seg + 1];
    return [Math.round(lerp(a[0], b[0], lt)), Math.round(lerp(a[1], b[1], lt)), Math.round(lerp(a[2], b[2], lt))];
  }

  var dpr = 1, W = 0, H = 0, cell = 0, gap = 0, padX = 0, padY = 0;
  function resize() {
    dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    var rect = canvas.getBoundingClientRect();
    var cssW = rect.width || 500, cssH = cssW * ASPECT;
    canvas.style.height = cssH + "px";
    W = Math.round(cssW * dpr); H = Math.round(cssH * dpr);
    canvas.width = W; canvas.height = H;
    var availW = W * 0.92, availH = H * 0.88;
    gap = Math.max(2, availW * 0.014);
    cell = Math.min((availW - gap * (COLS - 1)) / COLS, (availH - gap * (ROWS - 1)) / ROWS);
    var gridW = cell * COLS + gap * (COLS - 1), gridH = cell * ROWS + gap * (ROWS - 1);
    padX = (W - gridW) / 2; padY = (H - gridH) / 2;
  }

  function roundRectPath(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function draw(now) {
    ctx.clearRect(0, 0, W, H);
    var phase = (now % PERIOD) / PERIOD;
    var wavePos = -BAND + phase * (maxDiag + 2 * BAND);   // sweeps fully off one corner to the other
    var rr = Math.max(2, cell * 0.2);

    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        var x = padX + c * (cell + gap), y = padY + r * (cell + gap);
        var d = (c + r) - wavePos;                        // signed distance to the wavefront
        var ad = d < 0 ? -d : d;
        var lit = ad < BAND ? (1 - ad / BAND) : 0;        // activation 0..1 at the crest
        if (d < 0 && d > -BAND * 2) lit = Math.max(lit, (1 - (-d) / (BAND * 2)) * 0.4);  // afterglow trail
        var col = colorAt((c + r) / maxDiag);

        if (lit > 0.02) {
          ctx.save();
          ctx.shadowColor = "rgba(" + col[0] + "," + col[1] + "," + col[2] + "," + (0.55 * lit).toFixed(3) + ")";
          ctx.shadowBlur = cell * lit;
          ctx.fillStyle = "rgba(" + col[0] + "," + col[1] + "," + col[2] + "," + (0.16 + 0.7 * lit).toFixed(3) + ")";
          roundRectPath(x, y, cell, cell, rr); ctx.fill();
          ctx.restore();
        } else {
          ctx.fillStyle = "rgba(150,170,200,0.05)";
          roundRectPath(x, y, cell, cell, rr); ctx.fill();
          ctx.lineWidth = dpr;
          ctx.strokeStyle = "rgba(130,150,180,0.10)";
          ctx.stroke();
        }
      }
    }
    if (running) raf = requestAnimationFrame(draw);
  }

  var raf = null, running = false;
  function start() { if (running) return; running = true; raf = requestAnimationFrame(draw); }
  function stop() { running = false; if (raf) cancelAnimationFrame(raf); }

  resize();
  if (reduce) { draw(PERIOD * 0.42); return; }   // accessibility: one static, pleasant mid-sweep frame

  start();
  window.addEventListener("resize", function () { resize(); if (!running) draw(performance.now()); });
  document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else start(); });
})();

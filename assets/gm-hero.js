/* GPU Mastery — animated hero: "The Dispatch Lattice" (home page only).
   Built with the wondersmith method. Signature technique: a single WebGL fragment
   shader computing a living compute fabric — a lattice of processing cells that the
   visitor DISPATCHES with the cursor: energy blooms from the pointer and activation
   wavefronts ripple outward through the grid. The course's thesis, rendered by the
   very machine it teaches: every pixel is a thread.

   Robustness (this ships without a browser to eyeball it):
     WebGL + shader compile OK  -> the Dispatch Lattice (awe path)
     WebGL/compile fails        -> a verified canvas-2D lattice (still good)
     JS off                     -> the static <noscript> SVG (in the HTML)
     prefers-reduced-motion     -> one composed, fully-lit still frame, no loop
   Loaded by app.js only when #hero-canvas exists. No dependencies, offline. */
(function () {
  "use strict";
  var canvas = document.getElementById("hero-canvas");
  if (!canvas || !canvas.getContext) return;

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ASPECT = 373 / 513;

  /* shared pointer state (device pixels, y-down from top-left of the canvas) */
  var pointer = { x: 0, y: 0, active: 0, targetActive: 0, has: false };
  function setPointer(clientX, clientY) {
    var r = canvas.getBoundingClientRect();
    pointer.x = (clientX - r.left) * (canvas.width / r.width);
    pointer.y = (clientY - r.top) * (canvas.height / r.height);
    pointer.targetActive = 1; pointer.has = true;
  }
  canvas.addEventListener("pointermove", function (e) { setPointer(e.clientX, e.clientY); });
  canvas.addEventListener("pointerleave", function () { pointer.targetActive = 0; });
  canvas.addEventListener("pointerdown", function (e) { setPointer(e.clientX, e.clientY); pointer.targetActive = 1; });

  var dpr = 1, W = 0, H = 0;
  function sizeCanvas() {
    dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    var rect = canvas.getBoundingClientRect();
    var cssW = rect.width || 500, cssH = cssW * ASPECT;
    canvas.style.height = cssH + "px";
    W = Math.round(cssW * dpr); H = Math.round(cssH * dpr);
    canvas.width = W; canvas.height = H;
    // default the cursor to a lively spot so the attract state is never dead-center-empty
    if (!pointer.has) { pointer.x = W * 0.62; pointer.y = H * 0.42; }
  }

  /* ---------- the GLSL (WebGL1 / GLSL ES 1.00, kept simple + branch-free) ---------- */
  var VERT = "attribute vec2 a_pos; void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }";
  var FRAG = [
    "precision highp float;",
    "uniform vec2 u_res; uniform float u_time; uniform vec2 u_mouse; uniform float u_active;",
    "float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }",
    "void main(){",
    "  vec2 res = u_res; vec2 frag = gl_FragCoord.xy;",
    "  vec2 p = (frag - 0.5*res)/res.y;",
    "  vec2 m = (vec2(u_mouse.x, res.y - u_mouse.y) - 0.5*res)/res.y;",
    "  float t = u_time;",
    "  vec2 dp = p + 0.02*vec2(sin(t*0.30 + p.y*3.0), cos(t*0.25 + p.x*3.0));",
    "  float scale = 15.0;",
    "  vec2 g = dp*scale; vec2 id = floor(g); vec2 f = fract(g) - 0.5;",
    "  float cellDist = length(f);",
    "  float cellDot = smoothstep(0.45, 0.08, cellDist);",
    "  float w1 = sin((dp.x+dp.y)*2.4 - t*1.3);",
    "  float w2 = sin((dp.x-dp.y)*1.8 + t*0.9);",
    "  float ambient = clamp(0.5 + 0.25*w1 + 0.25*w2, 0.0, 1.0);",
    "  float seed = hash(id);",
    "  float shimmer = 0.5 + 0.5*sin(t*1.2 + seed*6.2831);",
    "  float dm = length(p - m);",
    "  float bloom = smoothstep(0.55, 0.0, dm);",
    "  float ripple = 0.5 + 0.5*sin(dm*22.0 - t*5.0);",
    "  float dispatch = bloom * mix(0.6, 1.0, ripple) * u_active;",
    "  float act = clamp(max(ambient*0.55 + shimmer*0.25, dispatch), 0.0, 1.0);",
    "  vec3 cB = vec3(0.357,0.608,1.0); vec3 cT = vec3(0.216,0.878,0.784); vec3 cV = vec3(0.706,0.549,1.0);",
    "  vec3 energy = mix(cB, cT, smoothstep(0.15,0.6,act));",
    "  energy = mix(energy, cV, smoothstep(0.6,0.95,act));",
    "  vec3 col = vec3(0.043,0.055,0.078);",
    "  float bright = cellDot*(0.12 + 1.25*act);",
    "  float halo = smoothstep(0.9, 0.0, cellDist)*act*0.25;",
    "  col += energy*(bright + halo);",
    "  col += cV*bloom*u_active*0.35*(0.6 + 0.4*ripple);",
    "  float vig = smoothstep(1.15, 0.20, length(p));",
    "  col *= mix(0.68, 1.0, vig);",
    "  gl_FragColor = vec4(col, 1.0);",
    "}"
  ].join("\n");

  function compile(gl, type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      throw new Error("shader compile: " + gl.getShaderInfoLog(s));
    }
    return s;
  }

  function tryWebGL() {
    var gl;
    try { gl = canvas.getContext("webgl", { antialias: true, alpha: false }) || canvas.getContext("experimental-webgl"); }
    catch (e) { gl = null; }
    if (!gl) return false;
    try {
      var prog = gl.createProgram();
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error("link: " + gl.getProgramInfoLog(prog));
      gl.useProgram(prog);

      var buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW); // one big triangle
      var loc = gl.getAttribLocation(prog, "a_pos");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      var uRes = gl.getUniformLocation(prog, "u_res"),
          uTime = gl.getUniformLocation(prog, "u_time"),
          uMouse = gl.getUniformLocation(prog, "u_mouse"),
          uActive = gl.getUniformLocation(prog, "u_active");

      function frame(now) {
        pointer.active += (pointer.targetActive - pointer.active) * 0.06;   // smooth dispatch presence
        gl.viewport(0, 0, W, H);
        gl.uniform2f(uRes, W, H);
        gl.uniform1f(uTime, 40 + now / 1000);                                // pre-warmed clock
        gl.uniform2f(uMouse, pointer.x, pointer.y);
        gl.uniform1f(uActive, pointer.active);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        if (running) raf = requestAnimationFrame(frame);
      }
      renderStart = function () { sizeCanvas(); frame(performance.now()); };
      renderLoop = frame;
      return true;
    } catch (e) {
      if (window.console && console.warn) console.warn("hero: WebGL path failed, using canvas-2D fallback —", e.message);
      return false;
    }
  }

  /* ---------- verified canvas-2D fallback: the same lattice, drawn on the CPU ---------- */
  function runCanvas2D() {
    // if a WebGL context was already bound to #hero-canvas we can't get '2d' from it; use a fresh clone
    var c = canvas;
    try { if (!c.getContext("2d")) throw 0; } catch (e) {
      var clone = c.cloneNode(false); c.parentNode.replaceChild(clone, c); canvas = clone;
    }
    var ctx = canvas.getContext("2d");
    var COLS = 18, ROWS = 13, maxDiag = (COLS - 1) + (ROWS - 1), BAND = 6, PERIOD = 4200;
    var STOPS = [[91, 155, 255], [55, 224, 200], [180, 140, 255]];
    function lerp(a, b, t) { return a + (b - a) * t; }
    function colorAt(t) { t = t < 0 ? 0 : t > 1 ? 1 : t; var s = t < 0.5 ? 0 : 1, lt = t < 0.5 ? t / 0.5 : (t - 0.5) / 0.5, a = STOPS[s], b = STOPS[s + 1]; return [Math.round(lerp(a[0], b[0], lt)), Math.round(lerp(a[1], b[1], lt)), Math.round(lerp(a[2], b[2], lt))]; }
    var cell = 0, gap = 0, padX = 0, padY = 0;
    function layout() {
      var availW = W * 0.92, availH = H * 0.88;
      gap = Math.max(2, availW * 0.014);
      cell = Math.min((availW - gap * (COLS - 1)) / COLS, (availH - gap * (ROWS - 1)) / ROWS);
      padX = (W - (cell * COLS + gap * (COLS - 1))) / 2; padY = (H - (cell * ROWS + gap * (ROWS - 1))) / 2;
    }
    function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
    function draw(now) {
      pointer.active += (pointer.targetActive - pointer.active) * 0.06;
      ctx.clearRect(0, 0, W, H);
      var phase = (now % PERIOD) / PERIOD, wavePos = -BAND + phase * (maxDiag + 2 * BAND), radius = Math.max(2, cell * 0.2);
      for (var r = 0; r < ROWS; r++) for (var c2 = 0; c2 < COLS; c2++) {
        var x = padX + c2 * (cell + gap), y = padY + r * (cell + gap);
        var d = (c2 + r) - wavePos, ad = d < 0 ? -d : d;
        var lit = ad < BAND ? (1 - ad / BAND) : 0;
        if (d < 0 && d > -BAND * 2) lit = Math.max(lit, (1 - (-d) / (BAND * 2)) * 0.4);
        // cursor dispatch: cells near the pointer light up
        var cx = x + cell / 2, cy = y + cell / 2, pd = Math.hypot(cx - pointer.x, cy - pointer.y);
        var bloom = Math.max(0, 1 - pd / (Math.min(W, H) * 0.5)) * pointer.active;
        lit = Math.max(lit, bloom);
        var col = colorAt((c2 + r) / maxDiag);
        if (lit > 0.02) {
          ctx.save();
          ctx.shadowColor = "rgba(" + col[0] + "," + col[1] + "," + col[2] + "," + (0.55 * lit).toFixed(3) + ")";
          ctx.shadowBlur = cell * lit;
          ctx.fillStyle = "rgba(" + col[0] + "," + col[1] + "," + col[2] + "," + (0.16 + 0.7 * lit).toFixed(3) + ")";
          rr(x, y, cell, cell, radius); ctx.fill(); ctx.restore();
        } else {
          ctx.fillStyle = "rgba(150,170,200,0.05)"; rr(x, y, cell, cell, radius); ctx.fill();
          ctx.lineWidth = dpr; ctx.strokeStyle = "rgba(130,150,180,0.10)"; ctx.stroke();
        }
      }
      if (running) raf = requestAnimationFrame(draw);
    }
    renderStart = function () { sizeCanvas(); layout(); draw(performance.now()); };
    renderLoop = draw;
    onResize = function () { layout(); };
  }

  /* ---------- lifecycle ---------- */
  var raf = null, running = false, renderStart = null, renderLoop = null, onResize = null;
  function start() { if (running) return; running = true; raf = requestAnimationFrame(renderLoop); }
  function stop() { running = false; if (raf) cancelAnimationFrame(raf); }

  sizeCanvas();
  if (!tryWebGL()) runCanvas2D();

  if (reduce) {                         // accessibility: one composed, fully-lit still, no loop
    pointer.active = 1; if (renderStart) renderStart();
    return;
  }
  running = true; if (renderStart) renderStart();   // renderStart draws frame 0, then the loop self-schedules

  window.addEventListener("resize", function () { sizeCanvas(); if (onResize) onResize(); if (!running) { if (renderStart) renderStart(); } });
  document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else start(); });
})();

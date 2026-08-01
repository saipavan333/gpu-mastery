/* GPU Mastery — course-wide ambient backdrop (every page, single-source via app.js).
   The "Dispatch Lattice" as a calm, dim, FIXED full-viewport WebGL layer behind all
   content — the whole course sitting on the machine it teaches. Tuned far dimmer than
   the home hero and covered by a readability scrim (stronger behind the centered
   reading column, lighter in the gutters) so body text stays crisp.

   Craft / performance (this runs on 100+ content pages):
     - WebGL ONLY. If WebGL or the shader is unavailable, we change NOTHING and the
       page keeps its normal CSS gradient background — zero regression.
     - Low-res backing buffer (BACKDROP renders blurry-soft; it is behind a scrim),
       ~30fps throttle, low-power context, and it pauses on a hidden tab.
     - Ambient only — NO pointer interaction (the interactive dispatch stays on the
       home hero); a backdrop must never compete with reading.
     - prefers-reduced-motion -> one static frame, no loop.

   Two knobs if you want it more/less present:
     LATTICE_DIM (below)         — global brightness of the lattice (0.4 subtle .. 1.0 bold)
     the #gm-backdrop-scrim CSS  — how much the scrim mutes it behind text */
(function () {
  "use strict";
  if (typeof document === "undefined" || !document.body) return;
  if (document.getElementById("gm-backdrop")) return;      // once per page
  if (window.matchMedia && window.matchMedia("(max-width: 520px)").matches) {
    // Small phones: skip the extra GPU context entirely; keep the light CSS gradient.
    // (A full-screen shader is not worth the battery on a hand-held reading device.)
    return;
  }

  var LATTICE_DIM = 0.62;   // <- global lattice brightness knob

  var canvas = document.createElement("canvas");
  var gl = null;
  try {
    gl = canvas.getContext("webgl", { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: "low-power" })
      || canvas.getContext("experimental-webgl");
  } catch (e) { gl = null; }
  if (!gl) return;   // no WebGL -> leave the page's normal background untouched

  var VERT = "attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }";
  var FRAG = [
    "precision highp float;",
    "uniform vec2 u_res; uniform float u_time; uniform float u_dim;",
    "float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }",
    "void main(){",
    "  vec2 res = u_res; vec2 frag = gl_FragCoord.xy;",
    "  vec2 uv = (frag - 0.5*res)/res.y;",
    "  float t = u_time;",
    "  vec3 cB = vec3(0.357,0.608,1.0); vec3 cT = vec3(0.216,0.878,0.784); vec3 cV = vec3(0.706,0.549,1.0);",
    "  vec3 col = vec3(0.043,0.055,0.078);",                 // matches --bg so the layer is seamless
    "  /* far depth layer */",
    "  vec2 pf = uv*1.35 + 0.015*vec2(sin(t*0.20 + uv.y*4.0), cos(t*0.18 + uv.x*4.0));",
    "  vec2 ff = fract(pf*24.0) - 0.5; vec2 idf = floor(pf*24.0);",
    "  float farDot = smoothstep(0.34, 0.04, length(ff));",
    "  float farAct = clamp(0.45 + 0.35*sin((pf.x+pf.y)*3.0 - t*0.9), 0.0, 1.0);",
    "  col += mix(cB, cT, 0.4)*farDot*farAct*0.045;",
    "  /* main lattice (ambient only — no cursor) */",
    "  vec2 warp = 0.03*vec2(sin(t*0.30 + uv.y*3.0), cos(t*0.24 + uv.x*3.0));",
    "  vec2 p = uv + warp;",
    "  vec2 g = p*13.0; vec2 id = floor(g); vec2 f = fract(g) - 0.5;",
    "  float cellDist = length(f);",
    "  float cellDot = smoothstep(0.42, 0.06, cellDist);",
    "  float a1 = sin((p.x+p.y)*2.2 - t*1.2);",
    "  float a2 = sin((p.x*1.3-p.y)*1.7 + t*0.8);",
    "  float ambient = clamp(0.45 + 0.28*a1 + 0.22*a2, 0.0, 1.0);",
    "  float seed = hash(id);",
    "  float shimmer = 0.5 + 0.5*sin(t*1.1 + seed*6.2831);",
    "  float act = clamp(ambient*0.5 + shimmer*0.28, 0.0, 1.0);",
    "  vec3 energy = mix(cB, cT, smoothstep(0.15,0.6,act));",
    "  energy = mix(energy, cV, smoothstep(0.6,0.96,act));",
    "  vec3 lattice = energy*(cellDot*(0.10 + 0.85*act) + smoothstep(0.95,0.0,cellDist)*act*0.16);",
    "  float wf1 = smoothstep(0.055, 0.0, abs(fract((p.x+p.y)*0.5 - t*0.15)-0.5)-0.46);",
    "  lattice += cT*wf1*0.09;",
    "  col += lattice*u_dim;",
    "  gl_FragColor = vec4(col, 1.0);",
    "}"
  ].join("\n");

  function compile(type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  var uRes, uTime, uDim;
  try {
    var prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error("link");
    gl.useProgram(prog);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var la = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(la);
    gl.vertexAttribPointer(la, 2, gl.FLOAT, false, 0, 0);
    uRes = gl.getUniformLocation(prog, "u_res");
    uTime = gl.getUniformLocation(prog, "u_time");
    uDim = gl.getUniformLocation(prog, "u_dim");
  } catch (e) { return; }   // shader failed -> leave the page background untouched

  var SCALE = 0.62;         // render resolution factor (soft is fine behind a scrim)
  var W = 2, H = 2;
  function size() {
    var cw = window.innerWidth || document.documentElement.clientWidth || 1000;
    var ch = window.innerHeight || document.documentElement.clientHeight || 700;
    canvas.style.width = cw + "px"; canvas.style.height = ch + "px";
    W = Math.max(2, Math.round(cw * SCALE)); H = Math.max(2, Math.round(ch * SCALE));
    canvas.width = W; canvas.height = H;
  }
  size();

  function render(t) { gl.viewport(0, 0, W, H); gl.uniform2f(uRes, W, H); gl.uniform1f(uTime, t); gl.uniform1f(uDim, LATTICE_DIM); gl.drawArrays(gl.TRIANGLES, 0, 3); }
  render(40);   // one composed frame before we attach (no flash)

  // Success — now (and only now) commit the DOM + style so a failure never regresses the bg.
  canvas.id = "gm-backdrop";
  canvas.setAttribute("aria-hidden", "true");   // purely decorative ambient layer — hide from assistive tech
  canvas.setAttribute("role", "presentation");
  var scrim = document.createElement("div"); scrim.id = "gm-backdrop-scrim";
  var st = document.createElement("style"); st.id = "gm-backdrop-style";
  st.textContent =
    "html{background:#0a0d13}" +
    "body{background:transparent !important}" +
    "#gm-backdrop{position:fixed;inset:0;z-index:-2;pointer-events:none;display:block}" +
    "#gm-backdrop-scrim{position:fixed;inset:0;z-index:-1;pointer-events:none;background:" +
      "linear-gradient(90deg,rgba(10,13,19,0.50) 0%,rgba(10,13,19,0.80) 26%,rgba(10,13,19,0.84) 50%,rgba(10,13,19,0.80) 74%,rgba(10,13,19,0.50) 100%)," +
      "linear-gradient(180deg,rgba(10,13,19,0.30),rgba(10,13,19,0) 22%,rgba(10,13,19,0) 82%,rgba(10,13,19,0.45))}";
  document.head.appendChild(st);
  document.body.insertBefore(scrim, document.body.firstChild);
  document.body.insertBefore(canvas, document.body.firstChild);

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;   // static composed frame already drawn; no loop

  var raf = 0, run = true, last = 0;
  function loop(now) {
    if (now - last >= 32) { last = now; render(40 + now / 1000); }   // ~30fps
    if (run) raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);

  var rt = 0;
  window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(size, 150); });
  document.addEventListener("visibilitychange", function () {
    run = !document.hidden;
    if (run) { last = 0; raf = requestAnimationFrame(loop); }
    else if (raf) cancelAnimationFrame(raf);
  });
})();

/* GPU Mastery — Module 2 diagram pack. Registers SVGs on window.DIAGRAMS. */
(function () {
  const C = { card:"#161b26", tx:"#e8edf5", dim:"#aab4c4", box:"#222a38",
    boxS:"#3b4760", acc:"#27406e", accS:"#5b9bff", accT:"#8fb6ff",
    good:"#173d31", goodS:"#36c98a", goodT:"#5fd6a4", warnFill:"#3a3320",
    warn:"#f5b850", bad:"#3d1f24", badS:"#ff6b6b", line:"#8a97aa", dim2:"#7e8aa0" };
  const F = "font-family:Inter,system-ui,sans-serif";
  const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const box=(x,y,w,h,o={})=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r??8}" style="fill:${o.fill||C.box};stroke:${o.stroke||C.boxS};stroke-width:${o.sw||1.6}"/>`;
  const t=(x,y,s,o={})=>`<text x="${x}" y="${y}" text-anchor="${o.a||"middle"}" style="fill:${o.fill||C.tx};font-size:${o.size||12}px;font-weight:${o.bold?700:400};${F}">${esc(s)}</text>`;
  const ln=(x1,y1,x2,y2,o={})=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${o.stroke||C.line};stroke-width:${o.sw||1.7}${o.dash?";stroke-dasharray:5 4":""}"/>`;
  const tri=(x,y,o={})=>`<polygon points="${x-7},${y-4} ${x},${y} ${x-7},${y+4}" style="fill:${o.stroke||C.line}"/>`;
  const triD=(x,y,o={})=>`<polygon points="${x-4},${y-7} ${x},${y} ${x+4},${y-7}" style="fill:${o.stroke||C.line}"/>`;
  const dot=(x,y,r,fill)=>`<circle cx="${x}" cy="${y}" r="${r}" style="fill:${fill}"/>`;
  const circ=(x,y,r,o={})=>`<circle cx="${x}" cy="${y}" r="${r}" style="fill:none;stroke:${o.stroke||C.boxS};stroke-width:${o.sw||1.8}"/>`;
  const arrowR=(x1,y,x2,o={})=>ln(x1,y,x2,y,o)+tri(x2,y,o);
  const svg=(h,body,label)=>`<svg viewBox="0 0 640 ${h}" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="640" height="${h}" rx="10" style="fill:${C.card}"/>${body}</svg>`;
  const D = {};

  /* 2.1a — interpreter vs compiler */
  D["m2l1-pipeline"] = (() => {
    let b = t(320,22,"Two ways code becomes action",{bold:true,size:13});
    b += t(24,52,"Python — an interpreter reads your text and acts on it, line by line",{a:"start",size:10.5,fill:C.accT});
    b += box(24,62,180,54) + t(114,84,"your_code.py",{size:11.5,bold:true}) + t(114,102,"plain text you wrote",{size:10,fill:C.dim});
    b += arrowR(204,89,228);
    b += box(228,62,196,54,{fill:C.acc,stroke:C.accS}) + t(326,84,"python (interpreter)",{size:11.5,bold:true,fill:C.accT}) + t(326,102,"reads → checks → executes",{size:10,fill:C.dim});
    b += arrowR(424,89,448);
    b += box(448,62,168,54) + t(532,84,"output, files, plots",{size:11.5,bold:true}) + t(532,102,"happens immediately",{size:10,fill:C.dim});
    b += t(24,152,"C (Module 3) — a compiler translates the whole file FIRST",{a:"start",size:10.5,fill:C.dim});
    b += box(24,162,180,44) + t(114,188,"code.c",{size:11,fill:C.dim});
    b += arrowR(204,184,228);
    b += box(228,162,196,44) + t(326,188,"gcc (compiler) → binary",{size:11,fill:C.dim});
    b += arrowR(424,184,448);
    b += box(448,162,168,44) + t(532,188,"CPU runs the binary",{size:11,fill:C.dim});
    b += t(320,238,"Interpreter = live translator (flexible, slower). Compiler = translate the whole book once (fast, strict).",{size:10.5,fill:C.dim});
    b += t(320,256,"Python's flexibility costs ~100 ns per tiny step — Lesson 2.5 turns that cost into a story with a happy ending.",{size:10.5,fill:C.dim});
    return svg(270,b,"python interpreter pipeline versus C compiler pipeline");
  })();

  /* 2.1b — names point at objects */
  D["m2l1-names"] = (() => {
    let b = t(320,22,"Variables are name tags, not boxes",{bold:true,size:13});
    b += t(60,56,"x = 5",{a:"start",size:11,fill:C.accT});
    b += box(40,68,60,30) + t(70,88,"x",{size:12,bold:true});
    b += arrowR(100,83,158);
    b += box(158,66,110,34) + t(213,88,"int 5",{size:12});
    b += t(60,134,"x = x + 1",{a:"start",size:11,fill:C.accT});
    b += box(40,146,60,30) + t(70,166,"x",{size:12,bold:true});
    b += arrowR(100,161,158);
    b += box(158,144,110,34,{fill:C.good,stroke:C.goodS}) + t(213,166,"int 6",{size:12,fill:C.goodT});
    b += box(158,196,110,30,{fill:C.card}) + t(213,215,"int 5 — no tags",{size:10,fill:C.dim2});
    b += t(158,246,"(cleaned up automatically)",{a:"start",size:10,fill:C.dim2});
    b += t(380,56,"y = x  →  two tags, ONE object",{a:"start",size:11,fill:C.goodT});
    b += box(360,72,50,28) + t(385,90,"x",{size:12,bold:true});
    b += box(360,110,50,28) + t(385,128,"y",{size:12,bold:true});
    b += box(470,72,140,66,{fill:C.good,stroke:C.goodS}) + t(540,110,"int 6",{size:13,fill:C.goodT});
    b += arrowR(410,86,470) + arrowR(410,124,470);
    b += t(380,176,"ints/strings are immutable —",{a:"start",size:10.5,fill:C.dim});
    b += t(380,194,"sharing is invisible, harmless.",{a:"start",size:10.5,fill:C.dim});
    b += t(380,216,"Lists (2.4): SAME picture, but",{a:"start",size:10.5,fill:C.warn});
    b += t(380,234,"the shared object can change…",{a:"start",size:10.5,fill:C.warn});
    b += t(320,278,"= never copies anything; it points a name at an object. This one picture explains half of Python.",{size:10.5,fill:C.dim});
    return svg(292,b,"python names as tags pointing at objects, reassignment moves the tag");
  })();

  /* 2.1c — int vs float */
  D["m2l1-numbers"] = (() => {
    let b = t(320,22,"Python's two number types — you already know both",{bold:true,size:13});
    b += box(30,50,285,126,{stroke:C.goodS});
    b += t(50,76,"int — a mathematician's integer",{a:"start",size:11.5,bold:true,fill:C.goodT});
    b += t(50,100,"grows without limit:",{a:"start",size:10.5});
    b += t(50,118,"2**1000 → a 302-digit number, fine",{a:"start",size:10.5,fill:C.accT});
    b += t(50,142,"M1 L1: no fixed width → no overflow,",{a:"start",size:10.5,fill:C.dim});
    b += t(50,160,"no wraparound, no UB. (Slower, though.)",{a:"start",size:10.5,fill:C.dim});
    b += box(325,50,285,126,{stroke:C.warn});
    b += t(345,76,"float — IEEE-754 fp64 (M1 L8!)",{a:"start",size:11.5,bold:true,fill:C.warn});
    b += t(345,100,"0.1 + 0.2 → 0.30000000000000004",{a:"start",size:10.5,fill:C.accT});
    b += t(345,118,"~15.9 digits, max ~1.8e308",{a:"start",size:10.5});
    b += t(345,142,"everything from M1 L8 applies:",{a:"start",size:10.5,fill:C.dim});
    b += t(345,160,"no ==, absorption, ulps, the lot.",{a:"start",size:10.5,fill:C.dim});
    b += t(320,204,"/ always returns float (7/2 = 3.5) · // floor-divides (7//2 = 3, and −7//2 = −4 — M1 L2's Python rule)",{size:10.5,fill:C.dim});
    b += t(320,222,"NumPy (2.5) will reintroduce fixed-width int8/int32/float32 — and M1's overflow rules come back with them.",{size:10.5,fill:C.dim});
    return svg(236,b,"python int is arbitrary precision, python float is ieee 754 double");
  })();

  /* 2.2a — if/elif/else flow */
  D["m2l2-flow"] = (() => {
    let b = t(320,22,"if / elif / else — exactly one branch runs",{bold:true,size:13});
    b += box(40,48,130,34) + t(105,69,"temp = reading",{size:10.5});
    b += ln(105,82,105,102) + triD(105,102);
    b += `<polygon points="105,110 190,140 105,170 20,140" style="fill:${C.acc};stroke:${C.accS};stroke-width:1.6"/>`;
    b += t(105,144,"temp > 100 ?",{size:10.5,fill:C.accT});
    b += ln(190,140,256,140) + tri(256,140) + t(222,130,"True",{size:9.5,fill:C.goodT});
    b += box(256,122,150,36,{fill:C.bad,stroke:C.badS}) + t(331,144,"alert: overheat!",{size:10.5,fill:C.badS});
    b += ln(105,170,105,196) + triD(105,196) + t(88,188,"False",{size:9.5,fill:C.dim});
    b += `<polygon points="105,204 190,234 105,264 20,234" style="fill:${C.acc};stroke:${C.accS};stroke-width:1.6"/>`;
    b += t(105,238,"temp > 85 ?",{size:10.5,fill:C.accT});
    b += ln(190,234,256,234) + tri(256,234) + t(222,224,"True",{size:9.5,fill:C.goodT});
    b += box(256,216,150,36,{fill:C.warnFill,stroke:C.warn}) + t(331,238,"log: running warm",{size:10.5,fill:C.warn});
    b += ln(105,264,105,290) + triD(105,290) + t(88,282,"False",{size:9.5,fill:C.dim});
    b += box(40,294,130,34,{fill:C.good,stroke:C.goodS}) + t(105,315,"else: all good",{size:10.5,fill:C.goodT});
    b += box(440,110,176,140,{fill:C.card,stroke:C.boxS});
    b += t(456,134,"elif = else-if:",{a:"start",size:10.5,fill:C.accT});
    b += t(456,154,"checked top to bottom,",{a:"start",size:10.5});
    b += t(456,172,"FIRST True wins,",{a:"start",size:10.5});
    b += t(456,190,"the rest are skipped.",{a:"start",size:10.5});
    b += t(456,216,"Order your conditions",{a:"start",size:10.5,fill:C.dim});
    b += t(456,234,"most-specific first.",{a:"start",size:10.5,fill:C.dim});
    return svg(344,b,"flowchart of if elif else with one branch taken");
  })();

  /* 2.2b — range is half-open */
  D["m2l2-range"] = (() => {
    let b = t(320,22,"range(start, stop, step) — stop is NEVER produced",{bold:true,size:13});
    b += t(320,56,"range(0, 10, 2)  →  0  2  4  6  8      (the half-open [0, 10) from M1 L2)",{size:11,fill:C.accT});
    b += ln(40,120,600,120) + tri(610,120);
    for (let i=0;i<=10;i++){
      const x=40+i*56;
      b += ln(x,112,x,128,{sw:1.2});
      b += t(x,148,String(i),{size:10.5,fill:C.dim});
    }
    for (const v of [0,2,4,6,8]) b += dot(40+v*56,120,5.5,C.goodS);
    b += circ(600,120,8,{stroke:C.badS,sw:2}) + t(600,98,"excluded",{size:10,fill:C.badS});
    b += t(320,182,"how many values? ceil((stop−start)/step) = (stop−start+step−1)//step — M1's ceiling division, again",{size:10.5,fill:C.goodT});
    b += t(320,202,"range(5) = range(0,5,1) → 0..4      backwards: range(10, 0, -2) → 10 8 6 4 2 (0 excluded again)",{size:10.5,fill:C.dim});
    return svg(216,b,"number line showing range 0 10 2 producing 0 2 4 6 8 with 10 excluded");
  })();

  /* 2.2c — nested loops walk a grid */
  D["m2l2-nested"] = (() => {
    let b = t(320,22,"Nested loops walk a grid — inner loop spins fastest",{bold:true,size:13});
    for (let c=0;c<4;c++) b += t(84+c*60,56,"c"+c,{size:10,fill:C.dim});
    let n=0;
    for (let r=0;r<3;r++){
      b += t(48,95+r*60,"r"+r,{size:10,fill:C.dim,a:"end"});
      for (let c=0;c<4;c++){
        b += box(60+c*60,68+r*60,48,48,{fill:r===1&&c===2?C.acc:C.box,stroke:r===1&&c===2?C.accS:C.boxS});
        b += t(84+c*60,98+r*60,String(n++),{size:13,bold:true,fill:r===1&&c===2?C.accT:C.tx});
        if (c<3){ b += ln(108+c*60,92+r*60,114+c*60,92+r*60,{stroke:C.accS,sw:1.4}) + tri(119+c*60,92+r*60,{stroke:C.accS}); }
      }
    }
    b += box(340,68,280,168,{fill:C.card,stroke:C.boxS});
    b += t(356,92,"for r in range(3):",{a:"start",size:11,fill:C.goodT});
    b += t(356,112,"    for c in range(4):",{a:"start",size:11,fill:C.goodT});
    b += t(356,132,"        i = r*4 + c",{a:"start",size:11,fill:C.goodT});
    b += t(356,152,"        visit(grid[r][c])",{a:"start",size:11,fill:C.goodT});
    b += t(356,182,"cell 6 = (r1, c2) = 1·4+2",{a:"start",size:10.5,fill:C.accT});
    b += t(356,202,"consecutive i = consecutive",{a:"start",size:10.5,fill:C.dim});
    b += t(356,220,"memory: the fast order (M4)",{a:"start",size:10.5,fill:C.dim});
    b += t(320,268,"Visit order 0,1,2,…,11 is exactly i = r·width + c — M1 L2's linearization, now executed by loops.",{size:10.5,fill:C.dim});
    return svg(282,b,"nested for loops visiting a 3 by 4 grid in row major order");
  })();

  /* 2.3a — call stack */
  D["m2l3-stack"] = (() => {
    let b = t(320,22,"Every call gets its own frame — the call stack",{bold:true,size:13});
    b += box(30,52,280,140,{fill:C.card,stroke:C.boxS});
    b += t(46,78,"def square(x):",{a:"start",size:11,fill:C.accT});
    b += t(46,96,"    return x * x",{a:"start",size:11,fill:C.accT});
    b += t(46,118,"def area(r):",{a:"start",size:11,fill:C.goodT});
    b += t(46,136,"    return 3.14159 * square(r)",{a:"start",size:11,fill:C.goodT});
    b += t(46,162,"print(area(2.0))",{a:"start",size:11});
    b += t(480,66,"grows ↑ on call, shrinks on return",{size:10,fill:C.dim2});
    b += box(360,80,250,44,{fill:C.good,stroke:C.goodS}) + t(485,100,"square   x = 2.0",{size:11,fill:C.goodT,bold:true}) + t(485,116,"← running now",{size:9.5,fill:C.goodT});
    b += box(360,132,250,44,{fill:C.acc,stroke:C.accS}) + t(485,152,"area   r = 2.0",{size:11,fill:C.accT}) + t(485,168,"paused at square(r)",{size:9.5,fill:C.dim});
    b += box(360,184,250,44) + t(485,204,"module (main)",{size:11}) + t(485,220,"paused at print(...)",{size:9.5,fill:C.dim});
    b += t(320,256,"square returns 4.0 → its frame pops → area resumes, computes 12.57, pops → print runs.",{size:10.5,fill:C.dim});
    b += t(320,274,"x exists ONLY in square's frame — that isolation is why local names never collide.",{size:10.5,fill:C.dim});
    return svg(288,b,"call stack frames for main area and square");
  })();

  /* 2.3b — scope lookup */
  D["m2l3-scope"] = (() => {
    let b = t(320,22,"Name lookup: Local → Global → Builtins",{bold:true,size:13});
    b += box(30,44,580,190,{fill:C.card,stroke:C.boxS});
    b += t(50,68,"Builtins — len, print, range, sum…",{a:"start",size:10.5,fill:C.dim});
    b += box(60,84,520,136,{stroke:C.line});
    b += t(80,108,"Global (your file) — factor = 10,  def scale(): …",{a:"start",size:10.5});
    b += box(90,124,460,82,{fill:C.acc,stroke:C.accS});
    b += t(110,148,"Local (inside scale) — x = 5",{a:"start",size:10.5,fill:C.accT});
    b += t(110,172,"print(x, factor, len('hi'))",{a:"start",size:11,fill:C.goodT});
    b += t(110,192,"x → local ✓     factor → global     len → builtins",{a:"start",size:10,fill:C.dim});
    b += t(320,258,"READING outer names is automatic. ASSIGNING creates a new LOCAL — factor = 20 inside scale()",{size:10.5,fill:C.dim});
    b += t(320,276,"makes a private factor and leaves the global untouched (unless you declare global — usually: don't).",{size:10.5,fill:C.dim});
    return svg(290,b,"nested scopes local inside global inside builtins with lookup");
  })();

  /* 2.3c — pure vs stateful */
  D["m2l3-pure"] = (() => {
    let b = t(320,22,"Pure functions parallelize; hidden state does not",{bold:true,size:13});
    b += box(30,50,285,158,{stroke:C.goodS});
    b += t(50,74,"PURE",{a:"start",size:11.5,bold:true,fill:C.goodT});
    b += t(50,98,"def scale(v, k):",{a:"start",size:11,fill:C.accT});
    b += t(50,116,"    return v * k",{a:"start",size:11,fill:C.accT});
    b += t(50,144,"same input → same output",{a:"start",size:10.5});
    b += t(50,162,"reads nothing, changes nothing outside",{a:"start",size:10.5});
    b += t(50,186,"10,000 GPU threads at once? Safe.",{a:"start",size:10.5,fill:C.goodT});
    b += box(325,50,285,158,{stroke:C.badS});
    b += t(345,74,"HIDDEN STATE",{a:"start",size:11.5,bold:true,fill:C.badS});
    b += t(345,98,"total = 0",{a:"start",size:11,fill:C.accT});
    b += t(345,116,"def add(x):",{a:"start",size:11,fill:C.accT});
    b += t(345,134,"    global total; total += x",{a:"start",size:11,fill:C.accT});
    b += t(345,162,"answer depends on call ORDER",{a:"start",size:10.5});
    b += t(345,186,"parallel → data race (M5 shows it live)",{a:"start",size:10.5,fill:C.badS});
    b += t(320,238,"M1 L2 promised purity would matter. Design pure by default; add state only where you must, on purpose.",{size:10.5,fill:C.dim});
    return svg(252,b,"pure function versus function mutating a global");
  })();

  /* 2.4a — list anatomy + slice */
  D["m2l4-list"] = (() => {
    let b = t(320,22,"A list: one name, numbered slots, half-open slices",{bold:true,size:13});
    b += box(40,70,70,32) + t(75,90,"nums",{size:11.5,bold:true});
    b += arrowR(110,86,148);
    b += box(148,60,78,52,{fill:C.card2||C.box,stroke:C.boxS}) + t(187,82,"list",{size:10.5,fill:C.dim}) + t(187,100,"len 6",{size:10.5,fill:C.dim});
    const vals=[10,20,30,40,50,60];
    for (let i=0;i<6;i++){
      const hot=(i>=1&&i<=3);
      b += t(261+i*62,52,String(i),{size:10,fill:C.accT});
      b += box(232+i*62,60,58,52,hot?{fill:C.acc,stroke:C.accS}:{}) + t(261+i*62,92,String(vals[i]),{size:12,fill:hot?C.accT:C.tx});
      b += t(261+i*62,130,String(i-6),{size:10,fill:C.dim2});
    }
    b += t(40,178,"nums[1:4] →",{a:"start",size:11,fill:C.accT});
    for (let i=0;i<3;i++) b += box(150+i*62,158,58,36,{fill:C.good,stroke:C.goodS}) + t(179+i*62,181,String(vals[i+1]),{size:11.5,fill:C.goodT});
    b += t(348,181,"a NEW list — slots 1,2,3 copied out (stop 4 excluded)",{a:"start",size:10.5,fill:C.dim});
    b += t(320,232,"0-based, half-open — M1 L2's intervals. nums[-1]=60 · nums[::2]=[10,30,50] · nums[::-1]=reversed copy",{size:10.5,fill:C.dim});
    return svg(246,b,"list object with indexed slots and a slice producing a new list");
  })();

  /* 2.4b — alias vs copy */
  D["m2l4-alias"] = (() => {
    let b = t(320,22,"b = a aliases; list(a) copies",{bold:true,size:13});
    b += t(40,56,"a = [1, 2, 3]",{a:"start",size:11,fill:C.accT}) ;
    b += t(40,74,"b = a",{a:"start",size:11,fill:C.accT});
    b += box(40,90,50,28) + t(65,108,"a",{size:12,bold:true});
    b += box(40,128,50,28) + t(65,146,"b",{size:12,bold:true});
    b += arrowR(90,104,150) + arrowR(90,142,150);
    b += box(150,90,150,66,{fill:C.warnFill,stroke:C.warn}) + t(225,120,"[1, 2, 3]",{size:12,fill:C.warn}) + t(225,140,"ONE object",{size:9.5,fill:C.warn});
    b += t(40,186,"b.append(4)",{a:"start",size:11,fill:C.warn});
    b += t(40,206,"print(a) → [1, 2, 3, 4]  ⚡",{a:"start",size:11,fill:C.badS});
    b += t(380,56,"c = list(a)   (or a.copy())",{a:"start",size:11,fill:C.goodT});
    b += box(380,90,50,28) + t(405,108,"c",{size:12,bold:true});
    b += arrowR(430,104,470);
    b += box(470,86,140,46,{fill:C.good,stroke:C.goodS}) + t(540,108,"[1, 2, 3]",{size:12,fill:C.goodT}) + t(540,124,"a NEW object",{size:9.5,fill:C.goodT});
    b += t(380,166,"c.append(9) touches only c ✓",{a:"start",size:10.5,fill:C.goodT});
    b += t(380,194,"but nested lists share INNER",{a:"start",size:10.5,fill:C.dim});
    b += t(380,212,"objects → copy.deepcopy then",{a:"start",size:10.5,fill:C.dim});
    b += t(320,252,"Same tag picture as 2.1 — it only becomes dangerous because lists can CHANGE. is / id() reveal sharing.",{size:10.5,fill:C.dim});
    return svg(266,b,"aliasing two names one list versus copying to a new list");
  })();

  /* 2.4c — shared row trap */
  D["m2l4-sharedrow"] = (() => {
    let b = t(320,22,"The shared-row trap: [[0]*3] * 2",{bold:true,size:13});
    b += t(40,56,"grid = [[0]*3] * 2",{a:"start",size:11,fill:C.badS});
    b += box(40,72,150,84,{fill:C.card,stroke:C.boxS}) + t(115,92,"outer list",{size:10,fill:C.dim});
    b += box(52,100,110,22,{r:5}) + t(107,115,"grid[0] ─→",{size:10});
    b += box(52,128,110,22,{r:5}) + t(107,143,"grid[1] ─→",{size:10});
    b += ln(162,111,230,111) + tri(230,111) + ln(162,139,230,125,{}) + `<polygon points="230,125 222.4,128.4 223.6,120.6" style="fill:${C.line}"/>`;
    b += box(230,96,160,44,{fill:C.warnFill,stroke:C.warn}) + t(310,114,"[0, 0, 0]",{size:12,fill:C.warn}) + t(310,131,"ONE row object",{size:9.5,fill:C.warn});
    b += t(40,188,"grid[0][0] = 9",{a:"start",size:11,fill:C.accT});
    b += t(40,210,"grid → [[9,0,0], [9,0,0]]   both rows changed!",{a:"start",size:11,fill:C.badS});
    b += t(420,56,"the fix:",{a:"start",size:10.5,fill:C.goodT});
    b += t(420,76,"[[0]*3 for _ in range(2)]",{a:"start",size:11,fill:C.goodT});
    b += box(420,92,180,32,{fill:C.good,stroke:C.goodS}) + t(510,112,"[0, 0, 0]",{size:11,fill:C.goodT});
    b += box(420,132,180,32,{fill:C.good,stroke:C.goodS}) + t(510,152,"[0, 0, 0]",{size:11,fill:C.goodT});
    b += t(420,186,"the comprehension runs [0]*3",{a:"start",size:10,fill:C.dim});
    b += t(420,204,"fresh on every iteration",{a:"start",size:10,fill:C.dim});
    b += t(320,244,"* copies the TAG, not the object (2.1's picture, weaponized). Same trap: def f(x, acc=[]) shares one",{size:10.5,fill:C.dim});
    b += t(320,262,"default list across every call. For real matrices: the fix above, or NumPy (next lesson).",{size:10.5,fill:C.dim});
    return svg(276,b,"list multiplication sharing one row object versus comprehension making fresh rows");
  })();

  /* 2.5a — interpreter overhead vs vectorized */
  D["m2l5-overhead"] = (() => {
    let b = t(320,22,"Why NumPy is ~100× faster than a Python loop",{bold:true,size:13});
    b += t(170,52,"for x in data: out.append(x*2)",{size:10.5,fill:C.accT});
    b += box(30,62,280,92);
    b += t(46,84,"per element, the interpreter:",{a:"start",size:10});
    b += t(46,104,"fetch PyObject → check its type →",{a:"start",size:10.5});
    b += t(46,122,"find __mul__ → box a new object",{a:"start",size:10.5});
    b += t(46,142,"~60–100 ns of overhead EACH",{a:"start",size:10.5,fill:C.warn});
    b += t(170,178,"10⁷ elements → ~1 second",{size:11,fill:C.warn,bold:true});
    b += t(470,52,"out = data * 2",{size:10.5,fill:C.goodT});
    b += box(330,62,280,92,{stroke:C.goodS});
    b += t(346,84,"ONE dispatch, then a compiled",{a:"start",size:10.5});
    b += t(346,104,"C loop over a contiguous float64",{a:"start",size:10.5});
    b += t(346,122,"buffer — SIMD lanes (M1 L5 §4)",{a:"start",size:10.5});
    b += t(346,142,"~1 ns per element",{a:"start",size:10.5,fill:C.goodT});
    b += t(470,178,"10⁷ elements → ~10 ms",{size:11,fill:C.goodT,bold:true});
    b += t(320,214,"Same arithmetic, ~100× gap — all interpreter overhead. The GPU (M5) stacks another 10–100× on top.",{size:10.5,fill:C.dim});
    b += t(320,232,"Rule: Python loops over ELEMENTS are a smell; expressions over ARRAYS are the way.",{size:10.5,fill:C.dim});
    return svg(246,b,"per element interpreter overhead versus one vectorized numpy dispatch");
  })();

  /* 2.5b — broadcasting */
  D["m2l5-broadcast"] = (() => {
    let b = t(320,22,"Broadcasting: size-1 axes stretch to fit",{bold:true,size:13});
    b += t(88,52,"(3,1)",{size:10.5,fill:C.accT});
    const colv=[0,10,20];
    for (let r=0;r<3;r++) b += box(60,62+r*46,56,40,{fill:C.acc,stroke:C.accS}) + t(88,87+r*46,String(colv[r]),{size:12,fill:C.accT});
    b += t(146,130,"+",{size:18,bold:true});
    b += t(310,52,"(1,4)",{size:10.5,fill:C.goodT});
    for (let c=0;c<4;c++) b += box(190+c*60,62,56,32,{fill:C.good,stroke:C.goodS}) + t(218+c*60,83,String(c),{size:12,fill:C.goodT});
    b += t(160,206,"=",{size:16,bold:true});
    b += t(310,128,"result (3,4)",{size:10.5,fill:C.dim});
    for (let r=0;r<3;r++) for (let c=0;c<4;c++){
      b += box(190+c*60,138+r*44,56,38,{r:6}) + t(218+c*60,162+r*44,String(colv[r]+c),{size:11.5});
    }
    b += box(470,138,150,132,{fill:C.card,stroke:C.boxS});
    b += t(486,162,"THE RULE",{a:"start",size:10.5,bold:true,fill:C.accT});
    b += t(486,184,"align shapes at the",{a:"start",size:10.5});
    b += t(486,202,"RIGHT; each axis:",{a:"start",size:10.5});
    b += t(486,222,"equal → ok",{a:"start",size:10.5,fill:C.goodT});
    b += t(486,240,"one is 1 → stretch",{a:"start",size:10.5,fill:C.goodT});
    b += t(486,258,"else → error",{a:"start",size:10.5,fill:C.badS});
    b += t(320,296,"Powers x − x.mean(axis=0), per-channel scaling, every normalization. Danger: (N,)+(N,1) → (N,N)!",{size:10.5,fill:C.dim});
    return svg(310,b,"column vector plus row vector broadcasting to a 3 by 4 grid");
  })();

  /* 2.5c — views and strides */
  D["m2l5-view"] = (() => {
    let b = t(320,22,"Slices are VIEWS: same bytes, new window (M1 L6 strides, live)",{bold:true,size:13});
    for (let i=0;i<12;i++){
      const inV = (i>=2&&i<8), inW = (i%3===0);
      b += t(61+i*46,58,String(i),{size:9.5,fill:C.dim2});
      b += box(40+i*46,66,42,40,{fill:inV?C.acc:C.box,stroke:inW?C.goodS:(inV?C.accS:C.boxS),sw:inW?2.2:1.6});
      b += t(61+i*46,91,"a"+i,{size:10,fill:inV?C.accT:C.tx});
    }
    b += t(40,140,"v = a[2:8]   → offset 2, stride 1  (blue fill)",{a:"start",size:10.5,fill:C.accT});
    b += t(40,162,"w = a[::3]   → offset 0, stride 3  (green outline: a0, a3, a6, a9)",{a:"start",size:10.5,fill:C.goodT});
    b += t(40,192,"v[0] = 99  →  a[2] is now 99. No copy was ever made.",{a:"start",size:11,fill:C.warn});
    b += t(320,226,"A view = (same buffer, offset, shape, strides) — a.T and reshape are free for the same reason (M1 L6 §6).",{size:10.5,fill:C.dim});
    b += t(320,244,"Need independence? .copy(). Detect: v.base is a → it's a view.",{size:10.5,fill:C.dim});
    return svg(258,b,"one buffer with two views selected by offset and stride");
  })();

  /* 2.5d — axis reductions */
  D["m2l5-axis"] = (() => {
    let b = t(320,22,"axis = the dimension that disappears",{bold:true,size:13});
    const M=[[1,2,3,4],[5,6,7,8],[9,10,11,12]];
    for (let r=0;r<3;r++) for (let c=0;c<4;c++){
      b += box(60+c*58,64+r*48,54,42,{r:6}) + t(87+c*58,90+r*48,String(M[r][c]),{size:11.5});
    }
    for (let r=0;r<3;r++){ b += ln(292,85+r*48,318,85+r*48,{stroke:C.goodS,sw:1.8}) + tri(322,85+r*48,{stroke:C.goodS}); }
    const rows=[10,26,42];
    for (let r=0;r<3;r++) b += box(326,64+r*48,54,42,{fill:C.good,stroke:C.goodS,r:6}) + t(353,90+r*48,String(rows[r]),{size:11.5,fill:C.goodT});
    b += t(410,80,"a.sum(axis=1) → shape (3,)",{a:"start",size:10.5,fill:C.goodT});
    b += t(410,100,"each ROW collapses rightward",{a:"start",size:10.5,fill:C.dim});
    for (let c=0;c<4;c++){ b += ln(87+c*58,208,87+c*58,230,{stroke:C.accS,sw:1.8}) + triD(87+c*58,234,{stroke:C.accS}); }
    const cols=[15,18,21,24];
    for (let c=0;c<4;c++) b += box(60+c*58,238,54,38,{fill:C.acc,stroke:C.accS,r:6}) + t(87+c*58,262,String(cols[c]),{size:11.5,fill:C.accT});
    b += t(410,252,"a.sum(axis=0) → shape (4,)",{a:"start",size:10.5,fill:C.accT});
    b += t(410,272,"each COLUMN collapses down",{a:"start",size:10.5,fill:C.dim});
    b += t(320,304,"Name the axis you want GONE. Works for sum, mean, max, argmax, std (M1 L7's σ, per column, one call).",{size:10.5,fill:C.dim});
    return svg(318,b,"summing a 3 by 4 array along axis 0 and axis 1");
  })();

  /* 2.6a — traceback anatomy */
  D["m2l6-traceback"] = (() => {
    let b = t(320,22,"Read a traceback BOTTOM-UP",{bold:true,size:13});
    b += box(30,44,390,200,{fill:"#10141d",stroke:C.boxS});
    b += t(46,70,"Traceback (most recent call last):",{a:"start",size:10.5,fill:C.dim});
    b += t(46,94,'  File "pipeline.py", line 42, in <module>',{a:"start",size:10.5});
    b += t(46,112,"    stats = summarize(data)",{a:"start",size:10.5,fill:C.dim});
    b += t(46,136,'  File "stats.py", line 7, in summarize',{a:"start",size:10.5});
    b += t(46,154,"    return total / len(values)",{a:"start",size:10.5,fill:C.dim});
    b += t(46,186,"ZeroDivisionError: division by zero",{a:"start",size:11.5,bold:true,fill:C.badS});
    b += t(46,216,"(so values was EMPTY — why?)",{a:"start",size:10,fill:C.dim2});
    b += t(440,70,"③ the call chain,",{a:"start",size:10.5,fill:C.dim});
    b += t(440,88,"outermost first",{a:"start",size:10.5,fill:C.dim});
    b += t(440,136,"② deepest frame =",{a:"start",size:10.5,fill:C.accT});
    b += t(440,154,"where it blew up",{a:"start",size:10.5,fill:C.accT});
    b += t(440,186,"① START HERE:",{a:"start",size:10.5,bold:true,fill:C.badS});
    b += t(440,204,"type + message",{a:"start",size:10.5,fill:C.badS});
    b += t(320,272,"The bottom line names the crime; frames above are the route. Fix at the deepest frame that is YOURS —",{size:10.5,fill:C.dim});
    b += t(320,290,"and remember the traceback points at the symptom; the empty list was created somewhere upstream.",{size:10.5,fill:C.dim});
    return svg(304,b,"annotated python traceback read from the bottom");
  })();

  /* 2.6b — try/except flow */
  D["m2l6-except"] = (() => {
    let b = t(320,22,"try / except / else / finally",{bold:true,size:13});
    b += box(40,52,170,38,{fill:C.acc,stroke:C.accS}) + t(125,76,"try: risky()",{size:11,fill:C.accT});
    b += ln(125,90,125,114) + triD(125,114);
    b += box(65,118,120,34) + t(125,139,"raised?",{size:10.5});
    b += ln(185,135,246,135) + tri(246,135) + t(215,126,"yes",{size:9.5,fill:C.badS});
    b += box(246,117,190,38,{fill:C.bad,stroke:C.badS}) + t(341,136,"except ValueError as e:",{size:10.5,fill:C.badS}) + t(341,150,"handle it",{size:9,fill:C.dim});
    b += ln(125,152,125,178) + triD(125,178) + t(107,170,"no",{size:9.5,fill:C.goodT});
    b += box(40,182,170,36,{fill:C.good,stroke:C.goodS}) + t(125,204,"else: ran clean",{size:10.5,fill:C.goodT});
    b += ln(341,155,341,238) ;
    b += ln(125,218,125,238);
    b += triD(125,242) + triD(341,242);
    b += box(40,246,396,38,{fill:C.warnFill,stroke:C.warn}) + t(238,270,"finally: ALWAYS runs (close files, release GPUs)",{size:10.5,fill:C.warn});
    b += box(460,120,160,130,{fill:C.card,stroke:C.boxS});
    b += t(476,144,"wrong type?",{a:"start",size:10.5,fill:C.dim});
    b += t(476,164,"the exception keeps",{a:"start",size:10.5});
    b += t(476,182,"climbing the call",{a:"start",size:10.5});
    b += t(476,200,"stack (2.3!) until",{a:"start",size:10.5});
    b += t(476,218,"caught — or the",{a:"start",size:10.5});
    b += t(476,236,"program dies.",{a:"start",size:10.5});
    return svg(298,b,"flow of try except else finally with propagation note");
  })();

  /* 2.6c — tolerance bands */
  D["m2l6-tolerance"] = (() => {
    let b = t(320,22,"Float tests: |a−b| ≤ atol + rtol·|b|   (M1 L8, now enforced by pytest)",{bold:true,size:13});
    b += t(170,60,"expected b = 1.0",{size:10.5,fill:C.accT});
    b += box(150,72,40,18,{fill:C.acc,stroke:C.accS,r:4});
    b += ln(60,81,150,81) + ln(190,81,300,81);
    b += t(170,112,"band ≈ ±(1e-8 + 1e-5·1)",{size:10,fill:C.dim});
    b += t(470,60,"expected b = 1000.0",{size:10.5,fill:C.goodT});
    b += box(400,72,140,18,{fill:C.good,stroke:C.goodS,r:4});
    b += ln(340,81,400,81) + ln(540,81,600,81);
    b += t(470,112,"band ≈ ±(1e-8 + 1e-5·1000) — 1000× wider",{size:10,fill:C.dim});
    b += t(320,152,"rtol scales with magnitude — float error is RELATIVE (ulps grow with the exponent)",{size:10.5,fill:C.accT});
    b += t(320,172,"atol is the floor near zero — where rtol·|b| → 0 and nothing would ever pass",{size:10.5,fill:C.goodT});
    b += t(320,204,"np.allclose / pytest.approx defaults suit fp64. fp32 needs looser; fp16 (ε≈1e-3) FAR looser.",{size:10.5,fill:C.warn});
    b += t(320,222,"Budget the error (ops × ulp — M1 L8 §6), then set the tolerance. Never loosen-until-green.",{size:10.5,fill:C.dim});
    return svg(236,b,"absolute and relative tolerance bands at two magnitudes");
  })();

  /* 2.7a — import resolution */
  D["m2l7-import"] = (() => {
    let b = t(320,22,"Where  import numpy  actually looks",{bold:true,size:13});
    const steps=[["sys.modules","already imported?"],["script's folder","YOUR files first!"],["sys.path / venv","activated env"],["site-packages","pip installs here"]];
    for (let i=0;i<4;i++){
      const x=24+i*158;
      b += box(x,52,140,54,i===1?{fill:C.warnFill,stroke:C.warn}:{});
      b += t(x+70,74,steps[i][0],{size:10.5,bold:true,fill:i===1?C.warn:C.tx});
      b += t(x+70,92,steps[i][1],{size:9.5,fill:C.dim});
      if(i<3) b += arrowR(x+140,79,x+158);
    }
    b += box(24,132,420,56,{fill:C.bad,stroke:C.badS});
    b += t(40,154,"trap: your own file named numpy.py wins at step 2 —",{a:"start",size:10.5,fill:C.badS});
    b += t(40,174,"the real NumPy never loads, errors look insane. Rename it.",{a:"start",size:10.5,fill:C.badS});
    b += t(464,150,"diagnose:",{a:"start",size:10,fill:C.dim});
    b += t(464,168,"import numpy",{a:"start",size:10,fill:C.accT});
    b += t(464,186,"print(numpy.__file__)",{a:"start",size:10,fill:C.accT});
    b += t(320,222,"Applies to random.py, test.py, email.py, code.py… never name a file after anything you import.",{size:10.5,fill:C.dim});
    return svg(236,b,"import search order with shadowing trap");
  })();

  /* 2.7b — venv isolation */
  D["m2l7-venv"] = (() => {
    let b = t(320,22,"venv: one Python per project, no fights",{bold:true,size:13});
    b += box(30,52,270,168,{stroke:C.warn});
    b += t(50,76,"System Python (shared)",{a:"start",size:11,bold:true,fill:C.warn});
    b += t(50,102,"one global site-packages:",{a:"start",size:10.5});
    b += t(50,124,"project A pins numpy 1.26",{a:"start",size:10.5,fill:C.accT});
    b += t(50,144,"project B needs numpy 2.5",{a:"start",size:10.5,fill:C.goodT});
    b += t(50,172,"last install wins →",{a:"start",size:10.5,fill:C.badS});
    b += t(50,192,"one project silently breaks",{a:"start",size:10.5,fill:C.badS});
    b += box(330,52,280,76,{stroke:C.goodS});
    b += t(350,76,"repo-a/.venv",{a:"start",size:11,bold:true,fill:C.goodT});
    b += t(350,98,"own site-packages: numpy 1.26 ✓",{a:"start",size:10.5});
    b += t(350,116,"pinned in requirements.txt",{a:"start",size:10,fill:C.dim});
    b += box(330,144,280,76,{stroke:C.goodS});
    b += t(350,168,"repo-b/.venv",{a:"start",size:11,bold:true,fill:C.goodT});
    b += t(350,190,"own site-packages: numpy 2.5 ✓",{a:"start",size:10.5});
    b += t(350,208,"same ritual, zero conflict",{a:"start",size:10,fill:C.dim});
    b += t(320,250,"python -m venv .venv → activate → pip install → pip freeze > requirements.txt — the deployable-repo ritual.",{size:10.5,fill:C.dim});
    return svg(264,b,"system python conflicts versus per project virtual environments");
  })();

  /* 2.7c — files are bytes */
  D["m2l7-bytes"] = (() => {
    let b = t(320,22,"Every file is bytes; text and images are DECODINGS",{bold:true,size:13});
    b += box(24,52,186,58) + t(117,72,"photo.png on disk",{size:11,bold:true}) + t(117,92,"89 50 4E 47 0D 0A 1A 0A …",{size:9.5,fill:C.accT});
    b += arrowR(210,81,234);
    b += box(234,52,186,58) + t(327,72,"open('f','rb').read()",{size:10.5,bold:true}) + t(327,92,"a bytes object (raw)",{size:9.5,fill:C.dim});
    b += arrowR(420,81,444);
    b += box(444,52,172,58,{fill:C.acc,stroke:C.accS}) + t(530,72,"PIL / np.frombuffer",{size:10.5,bold:true,fill:C.accT}) + t(530,92,"numbers: (H, W, 3)",{size:9.5,fill:C.accT});
    b += t(320,146,"text files: bytes ──.decode('utf-8')──▶ str.  Wrong codec → mojibake ('Ã©' for 'é'), often with NO error.",{size:10.5,fill:C.dim});
    b += t(320,166,"Always say encoding='utf-8' explicitly when opening text.",{size:10.5,fill:C.dim});
    b += t(320,198,"89 50 4E 47 = \\x89 P N G — magic numbers identify formats. Your M1 L1 hex literacy, paying again.",{size:10.5,fill:C.goodT});
    return svg(212,b,"file bytes decoded into text or arrays");
  })();

  /* 2.8a — image anatomy */
  D["m2l8-image"] = (() => {
    let b = t(320,22,"An image IS an array: shape (H, W, 3), y-down",{bold:true,size:13});
    b += arrowR(50,44,300) + t(310,48,"x = col",{a:"start",size:10,fill:C.dim});
    b += ln(50,44,50,254) + triD(50,254) + t(38,268,"y = row",{a:"start",size:10,fill:C.dim});
    for (let r=0;r<5;r++) for (let c=0;c<7;c++){
      const hot=(r===2&&c===4);
      b += box(58+c*34,52+r*38,30,32,hot?{fill:C.acc,stroke:C.accS,r:4}:{r:4});
    }
    b += ln(226,144,340,144,{dash:true,sw:1.2});
    b += box(340,78,276,120,{fill:C.card,stroke:C.boxS});
    b += t(356,102,"img[2, 4]  → one pixel",{a:"start",size:11,fill:C.accT});
    b += t(356,124,"[R, G, B] = [200, 120, 50]",{a:"start",size:11,fill:C.goodT});
    b += t(356,146,"dtype uint8: 0..255 each (M1 L1)",{a:"start",size:10.5});
    b += t(356,168,"img[y, x] — ROW comes first!",{a:"start",size:10.5,fill:C.warn});
    b += t(356,186,"(matrix indexing, not (x,y))",{a:"start",size:9.5,fill:C.dim});
    b += t(340,224,"shape (1080, 1920, 3) uint8 ≈ 6.2 MB",{a:"start",size:10.5,fill:C.dim});
    b += t(340,244,"img[0, 0] = TOP-left corner (M1 L4: screens are y-down)",{a:"start",size:10.5,fill:C.dim});
    b += t(320,290,"Every filter in this project is plain array math over this block. M1 was setup; this is payoff.",{size:10.5,fill:C.dim});
    return svg(304,b,"image as height width 3 array with y down origin and one pixel inspected");
  })();

  /* 2.8b — grayscale dot product */
  D["m2l8-gray"] = (() => {
    let b = t(320,22,"Grayscale = one dot product per pixel (M1 L5)",{bold:true,size:13});
    b += t(115,56,"one pixel [R, G, B]",{size:10,fill:C.dim});
    b += box(40,66,150,44) + t(115,93,"[200, 120, 50]",{size:12});
    b += t(213,96,"·",{size:20,bold:true});
    b += t(332,56,"luma weights",{size:10,fill:C.dim});
    b += box(238,66,190,44,{fill:C.acc,stroke:C.accS}) + t(333,93,"[0.299, 0.587, 0.114]",{size:11.5,fill:C.accT});
    b += t(446,93,"=",{size:16,bold:true});
    b += t(542,56,"gray value",{size:10,fill:C.dim});
    b += box(464,66,152,44,{fill:C.good,stroke:C.goodS}) + t(540,86,"59.8 + 70.4 + 5.7",{size:10.5,fill:C.goodT}) + t(540,102,"≈ 136",{size:11.5,bold:true,fill:C.goodT});
    b += t(320,148,"gray = img @ np.array([0.299, 0.587, 0.114])      # (H,W,3) @ (3,) → (H,W)",{size:11,fill:C.accT});
    b += t(320,178,"One line = 2 million dot products. Weights favor green because human eyes do; 1/3,1/3,1/3 looks wrong.",{size:10.5,fill:C.dim});
    return svg(192,b,"rgb pixel dotted with luma weights giving gray value");
  })();

  /* 2.8c — box blur neighborhood */
  D["m2l8-blur"] = (() => {
    let b = t(320,22,"Box blur: every pixel becomes its neighborhood's mean",{bold:true,size:13});
    for (let r=0;r<5;r++) for (let c=0;c<7;c++){
      const inWin=(r>=1&&r<=3&&c>=2&&c<=4), ctr=(r===2&&c===3);
      b += box(40+c*38,50+r*40,34,34,ctr?{fill:C.acc,stroke:C.accS,r:4}:(inWin?{fill:C.card2||"#1b2231",stroke:C.accS,r:4,sw:1.2}:{r:4}));
    }
    b += box(114,88,110,118,{fill:"none",stroke:C.warn,sw:2.2,r:6});
    b += t(169,262,"3×3 window",{size:10,fill:C.warn});
    b += arrowR(310,146,350,{stroke:C.goodS,sw:2});
    b += box(354,120,262,88,{fill:C.card,stroke:C.boxS});
    b += t(370,144,"new[y,x] = patch.mean()",{a:"start",size:11,fill:C.goodT});
    b += t(370,166,"fast version: add 9 shifted",{a:"start",size:10.5,fill:C.dim});
    b += t(370,184,"slices (views!), divide by 9",{a:"start",size:10.5,fill:C.dim});
    b += t(354,232,"edge pixels lack a full neighborhood:",{a:"start",size:10.5,fill:C.warn});
    b += t(354,252,"crop the border or pad first — decide.",{a:"start",size:10.5,fill:C.warn});
    b += t(320,292,"Blur = local averaging (M1 L7: means smooth noise). Sharper cousins of this window run all of vision.",{size:10.5,fill:C.dim});
    return svg(306,b,"3 by 3 neighborhood averaging into the center pixel");
  })();

  /* 2.8d — reshape pooling */
  D["m2l8-pool"] = (() => {
    let b = t(320,22,"Downscale 2×: reshape into 2×2 blocks, then mean them away",{bold:true,size:13});
    const tint=[C.acc,C.good,C.warnFill];
    const tintS=[C.accS,C.goodS,C.warn];
    let v=0;
    for (let r=0;r<4;r++) for (let c=0;c<6;c++){
      const bi=Math.floor(c/2), fill=tint[bi], stroke=tintS[bi];
      b += box(40+c*40,48+r*40,36,34,{fill:fill,stroke:stroke,r:4,sw:1});
      b += t(58+c*40,70+r*40,String(r*6+c),{size:10.5});
    }
    b += arrowR(292,128,336,{stroke:C.line,sw:2});
    const means=[["3.5","5.5","7.5"],["15.5","17.5","19.5"]];
    for (let r=0;r<2;r++) for (let c=0;c<3;c++){
      b += box(344+c*52,84+r*52,48,44,{fill:tint[c],stroke:tintS[c],r:5,sw:1.2});
      b += t(368+c*52,111+r*52,means[r][c],{size:11,bold:true});
    }
    b += t(344,60,"(2, 3) result",{a:"start",size:10,fill:C.dim});
    b += t(320,236,"a.reshape(2, 2, 3, 2).mean(axis=(1, 3))      # (4,6) → (2,3), e.g. mean(0,1,6,7) = 3.5",{size:11,fill:C.accT});
    b += t(320,264,"The reshape is FREE (a view — strides again); the mean deletes the two little axes (2.5's axis rule).",{size:10.5,fill:C.dim});
    b += t(320,282,"GPUs pool images exactly this way. You now know why it's fast: no data moved until the mean.",{size:10.5,fill:C.dim});
    return svg(296,b,"4 by 6 grid pooled into 2 by 3 by averaging 2 by 2 blocks");
  })();

  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, D);
})();

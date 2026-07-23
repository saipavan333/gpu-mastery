/* GPU Mastery — Module 4 diagram pack. Registers SVGs on window.DIAGRAMS. */
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
  const arrowR=(x1,y,x2,o={})=>ln(x1,y,x2,y,o)+tri(x2,y,o);
  const dot=(x,y,r,fill)=>`<circle cx="${x}" cy="${y}" r="${r}" style="fill:${fill}"/>`;
  const svg=(h,body,label)=>`<svg viewBox="0 0 640 ${h}" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="640" height="${h}" rx="10" style="fill:${C.card}"/>${body}</svg>`;
  const D = {};

  /* 4.1a — the classic pipeline fill */
  D["m4l1-pipeline"] = (() => {
    let b = t(320,22,"Pipelining: five stages, one instruction COMPLETES per cycle",{bold:true,size:13});
    const stages="FDXMW", fills=[C.acc,C.box,C.good,C.warnFill,"#1b2231"], strokes=[C.accS,C.boxS,C.goodS,C.warn,C.boxS];
    for (let c=1;c<=8;c++) b += t(150+(c-1)*60+28,48,"cyc "+c,{size:9,fill:C.dim2});
    for (let i=0;i<4;i++){
      b += t(140,80+i*42,"I"+(i+1),{a:"end",size:11,fill:C.accT});
      for (let c=1;c<=8;c++){
        const s = c-1-i;
        if (s>=0 && s<5){
          b += box(150+(c-1)*60,56+i*42,56,36,{fill:fills[s],stroke:strokes[s],r:5,sw:1.2});
          b += t(150+(c-1)*60+28,79+i*42,stages[s],{size:12,bold:true});
        }
      }
    }
    b += t(320,242,"F fetch · D decode · X execute · M memory · W write-back — an assembly line for instructions.",{size:10.5,fill:C.dim});
    b += t(320,262,"Latency per instruction: still 5 cycles. THROUGHPUT after fill: 1 per cycle — the road filled up.",{size:10.5,fill:C.dim});
    return svg(276,b,"five stage pipeline with four instructions overlapping");
  })();

  /* 4.1b — branch misprediction flush */
  D["m4l1-branch"] = (() => {
    let b = t(320,22,"Branches: the pipeline GUESSES — wrong guesses flush the line",{bold:true,size:13});
    b += t(130,52,"if (x[i] > t)  — resolves at X, cycle 3",{a:"start",size:10.5,fill:C.accT});
    const cell=(x,y,s,f,st)=>box(x,y,52,30,{fill:f,stroke:st,r:5,sw:1.2})+t(x+26,y+20,s,{size:10.5,bold:true});
    b += cell(130,60,"F",C.acc,C.accS)+cell(190,60,"D",C.box,C.boxS)+cell(250,60,"X ?",C.good,C.goodS);
    b += t(130,116,"speculated path (guessed):",{a:"start",size:10,fill:C.badS});
    b += cell(190,124,"F",C.bad,C.badS)+cell(250,124,"D",C.bad,C.badS)+t(330,144,"→ WRONG: flushed",{a:"start",size:10.5,fill:C.badS});
    b += cell(250,162,"F",C.bad,C.badS)+t(330,182,"→ flushed too",{a:"start",size:10.5,fill:C.badS});
    b += t(130,224,"correct path restarts:",{a:"start",size:10,fill:C.goodT});
    b += cell(310,232,"F",C.good,C.goodS)+cell(370,232,"D",C.box,C.boxS)+t(440,252,"… ~15–20 cycles LOST",{a:"start",size:10.5,fill:C.warn});
    b += t(320,296,"Predictors learn patterns and are right 95–99% on regular code — random-data branches are their nightmare",{size:10.5,fill:C.dim});
    b += t(320,314,"(the sorted-vs-shuffled experiment in this lesson measures the difference on YOUR machine).",{size:10.5,fill:C.dim});
    return svg(328,b,"branch misprediction flushing speculated instructions");
  })();

  /* 4.1c — dependency chains vs ILP */
  D["m4l1-ilp"] = (() => {
    let b = t(320,22,"Superscalar: 4+ instructions per cycle — IF they're independent",{bold:true,size:13});
    b += t(160,52,"dependent chain (serial by data)",{size:10.5,fill:C.badS});
    b += box(90,62,150,30,{stroke:C.badS}) + t(165,82,"a = x * y",{size:10.5});
    b += ln(165,92,165,110) + triD(165,114);
    b += box(90,118,150,30,{stroke:C.badS}) + t(165,138,"b = a * z",{size:10.5});
    b += ln(165,148,165,166) + triD(165,170);
    b += box(90,174,150,30,{stroke:C.badS}) + t(165,194,"c = b * w",{size:10.5});
    b += t(165,228,"3 × latency(4cyc) = 12 cycles",{size:10.5,fill:C.badS});
    b += t(165,246,"IPC ≈ 0.25 — the core WAITS",{size:10,fill:C.dim});
    b += t(475,52,"independent ops (ILP)",{size:10.5,fill:C.goodT});
    for (let i=0;i<4;i++){
      b += box(360+ (i%2)*120, 62+Math.floor(i/2)*40, 110,30,{stroke:C.goodS});
      b += t(415+(i%2)*120, 82+Math.floor(i/2)*40, ["a = x0*y0","b = x1*y1","c = x2*y2","d = x3*y3"][i],{size:10});
    }
    b += t(475,168,"all issue together → ~1 cycle each",{size:10.5,fill:C.goodT});
    b += t(475,186,"IPC ≈ 4 — the pipes stay full",{size:10,fill:C.dim});
    b += t(475,216,"3.9's mystery: naive matmul IPC 0.4",{size:10.5,fill:C.warn});
    b += t(475,234,"= memory stalls + one serial",{size:10,fill:C.dim});
    b += t(475,250,"accumulator chain. Now you know.",{size:10,fill:C.dim});
    b += t(320,290,"Compilers unroll loops into independent partials to feed the width — when semantics allow (M1 L8 blocks float sums!).",{size:10,fill:C.dim});
    return svg(304,b,"dependent multiply chain versus four independent multiplies issuing together");
  })();

  /* 4.2a — the memory hierarchy ladder */
  D["m4l2-pyramid"] = (() => {
    let b = t(320,22,"The memory hierarchy: every level trades size for speed",{bold:true,size:13});
    const rows=[["registers","~2 KB","0–1 cyc","the ALU's hands",180,C.good,C.goodS],
                ["L1 cache","48 KB","~4 cyc","per-core, line = 64 B",255,C.acc,C.accS],
                ["L2 cache","1.25 MB","~14 cyc","per-core",325,C.acc,C.accS],
                ["L3 cache","~36 MB","~45 cyc","shared, all cores",395,C.warnFill,C.warn],
                ["DRAM","32 GB","~250 cyc / 80 ns","the M1 L3 wall",465,C.bad,C.badS],
                ["NVMe SSD","2 TB","~100 µs","1000× DRAM",530,"#1b2231",C.boxS]];
    for (let i=0;i<6;i++){
      const [name,size,lat,note,w,f,s] = rows[i];
      const x = 30, y = 44+i*46;
      b += box(x,y,w,38,{fill:f,stroke:s,sw:1.4});
      b += t(x+12,y+17,name,{a:"start",size:11,bold:true});
      b += t(x+12,y+32,size,{a:"start",size:9.5,fill:C.dim});
      b += t(x+w+14,y+17,lat,{a:"start",size:10.5,fill:C.accT});
      b += t(x+w+14,y+32,note,{a:"start",size:9.5,fill:C.dim2});
    }
    b += t(320,338,"Each step down: ~10× bigger, ~3–10× slower. One DRAM trip = ~1000 multiplies (M1 L3's ladder, with street addresses).",{size:10.5,fill:C.dim});
    return svg(352,b,"memory hierarchy from registers to ssd with sizes and latencies");
  })();

  /* 4.2b — cache lines and stride */
  D["m4l2-cacheline"] = (() => {
    let b = t(320,22,"The unit of truth is the LINE: ask for 4 bytes, receive 64",{bold:true,size:13});
    b += t(40,52,"one 64-byte cache line = 16 floats:",{a:"start",size:10.5,fill:C.dim});
    for (let i=0;i<16;i++) b += box(40+i*35,60,31,26,{r:4,fill:i===3?C.acc:C.box,stroke:i===3?C.accS:C.boxS,sw:1});
    b += ln(145,110,145,92,{stroke:C.accS}) + `<polygon points="145,88 141,95 149,95" style="fill:${C.accS}"/>`;
    b += t(155,108,"you read x[3] (4 B) → the WHOLE line rides the bus",{a:"start",size:10,fill:C.accT});
    b += t(40,142,"stride-1 walk: every byte of every line is used — 100% efficiency",{a:"start",size:10.5,fill:C.goodT});
    for (let i=0;i<16;i++) b += box(40+i*35,150,31,22,{r:4,fill:C.good,stroke:C.goodS,sw:1});
    b += t(40,200,"stride-16 walk (column of a 16-wide matrix): 1 float used per line → 16× the traffic",{a:"start",size:10.5,fill:C.badS});
    for (let i=0;i<16;i++) b += box(40+i*35,208,31,22,{r:4,fill:i===0?C.bad:C.box,stroke:i===0?C.badS:C.boxS,sw:1});
    b += t(320,262,"This one picture is M2 L5's axis-0 slowdown, 3.9's ijk-vs-ikj gap, AND the stride experiment this lesson runs in C.",{size:10.5,fill:C.dim});
    b += t(320,280,"Rule since M1 L6: make the fastest-moving index the stride-1 index — now you know the hardware reason.",{size:10.5,fill:C.dim});
    return svg(294,b,"cache line of sixteen floats fully used by stride one and wasted by stride sixteen");
  })();

  /* 4.2c — locality and working sets */
  D["m4l2-locality"] = (() => {
    let b = t(320,22,"Caches bet on two habits — and 3.9's blocking engineered both",{bold:true,size:13});
    b += box(30,50,285,120,{stroke:C.accS});
    b += t(50,74,"TEMPORAL locality",{a:"start",size:11,bold:true,fill:C.accT});
    b += t(50,96,"touch it again SOON → still cached",{a:"start",size:10.5});
    b += t(50,116,"blocked matmul: each tile value",{a:"start",size:10.5,fill:C.dim});
    b += t(50,134,"reused K/T times before eviction",{a:"start",size:10.5,fill:C.dim});
    b += t(50,156,"(the T=64 knee: 3·T²·4 ≈ L1 — 3.9 Ex.1)",{a:"start",size:9.5,fill:C.goodT});
    b += box(325,50,285,120,{stroke:C.goodS});
    b += t(345,74,"SPATIAL locality",{a:"start",size:11,bold:true,fill:C.goodT});
    b += t(345,96,"touch the NEIGHBOR → same line, free",{a:"start",size:10.5});
    b += t(345,116,"stride-1 walks, struct fields used",{a:"start",size:10.5,fill:C.dim});
    b += t(345,134,"together (3.6 padding, M1 L5 SoA)",{a:"start",size:10.5,fill:C.dim});
    b += t(345,156,"(prefetchers extend it: they chase patterns)",{a:"start",size:9.5,fill:C.accT});
    b += t(320,200,"Working set ≤ cache level ⇒ that level's speed. Bigger ⇒ the next level's. That staircase IS your T-sweep table.",{size:10.5,fill:C.dim});
    b += t(320,218,"GPUs keep the idea, move the mechanism: YOU manage the fast level by hand (shared memory — 4.5, 5.5).",{size:10.5,fill:C.goodT});
    return svg(232,b,"temporal and spatial locality panels tied to blocking");
  })();

  /* 4.3a — latency vs throughput */
  D["m4l3-latencythroughput"] = (() => {
    let b = t(320,22,"Two ways to move people — two philosophies of processor",{bold:true,size:13});
    b += box(30,52,285,120,{stroke:C.accS});
    b += t(172,76,"CPU = sports car",{size:11.5,bold:true,fill:C.accT});
    b += t(172,98,"2 seats · arrives in 30 min",{size:10.5});
    b += t(172,118,"latency per trip: SUPERB",{size:10.5,fill:C.goodT});
    b += t(172,138,"throughput: 4 people/hour",{size:10.5,fill:C.warn});
    b += t(172,158,"(pipelines, predictors, big caches)",{size:9.5,fill:C.dim});
    b += box(325,52,285,120,{stroke:C.goodS});
    b += t(467,76,"GPU = fleet of buses",{size:11.5,bold:true,fill:C.goodT});
    b += t(467,98,"50 seats · arrives in 60 min",{size:10.5});
    b += t(467,118,"latency per trip: MEH",{size:10.5,fill:C.warn});
    b += t(467,138,"throughput: 50+ people/hour",{size:10.5,fill:C.goodT});
    b += t(467,158,"(thousands of lanes, tiny caches)",{size:9.5,fill:C.dim});
    b += t(320,200,"Neither is 'faster' — they answer different questions. One click's response: CPU. Two million pixels: buses.",{size:10.5,fill:C.dim});
    b += t(320,218,"Everything in 4.4 is the bus company's engineering: keep every seat full, hide every wait behind other passengers.",{size:10.5,fill:C.dim});
    return svg(232,b,"cpu as fast sports car versus gpu as high throughput bus fleet");
  })();

  /* 4.3b — Amdahl's law */
  D["m4l3-amdahl"] = (() => {
    let b = t(320,22,"Amdahl's law: the serial fraction is the ceiling",{bold:true,size:13});
    const groups=[["p = 50% parallel",[["8",1.78],["64",1.96],["∞",2.0]],C.badS],
                  ["p = 90%",[["8",4.71],["64",8.77],["∞",10.0]],C.warn],
                  ["p = 99%",[["8",7.48],["64",39.3],["∞",100.0]],C.goodS]];
    let y = 48;
    for (const [label, bars, col] of groups){
      b += t(30,y+12,label,{a:"start",size:10.5,fill:col});
      y += 20;
      for (const [n, v] of bars){
        const w = Math.max(14, v * 4.4);
        b += box(96,y,w,16,{r:4,fill:C.box,stroke:col,sw:1.3});
        b += t(88,y+12,"N="+n,{a:"end",size:9,fill:C.dim2});
        b += t(100+w+6,y+12,v.toFixed(v<10?2:1)+"×",{a:"start",size:9.5,fill:C.dim});
        y += 22;
      }
      y += 8;
    }
    b += t(320,y+8,"speedup = 1 / ((1−p) + p/N).  At p=50%, INFINITE processors buy you 2×.",{size:10.5,fill:C.accT});
    b += t(320,y+28,"3.9's 5.6× on 8 threads: p ≈ 95% parallel PLUS a bandwidth roof Amdahl doesn't model (4.5 adds it).",{size:10.5,fill:C.dim});
    b += t(320,y+46,"GPU corollary: with N ≈ 10,000, ANY serial 1% dominates — which is why kernels obsess over full parallelism.",{size:10.5,fill:C.dim});
    return svg(y+60,b,"amdahl speedup bars for three parallel fractions");
  })();

  /* 4.3c — SIMD / SIMT / MIMD */
  D["m4l3-taxonomy"] = (() => {
    let b = t(320,22,"Three ways to be parallel (you have met all three)",{bold:true,size:13});
    b += box(24,50,190,180,{stroke:C.accS});
    b += t(119,72,"SIMD (CPU vectors)",{size:10.5,bold:true,fill:C.accT});
    b += box(64,84,110,24,{r:5,fill:C.acc,stroke:C.accS}) + t(119,100,"1 instruction",{size:9.5});
    for (let i=0;i<8;i++){ b += ln(119,108,44+i*22+9,126,{sw:1}); b += box(44+i*22,128,18,20,{r:3,fill:C.good,stroke:C.goodS,sw:1}); }
    b += t(119,168,"8–16 lanes, ONE thread",{size:9.5,fill:C.dim});
    b += t(119,186,"NumPy's engine (M2 L5),",{size:9.5,fill:C.dim});
    b += t(119,204,"BLAS microkernels (3.9 §3)",{size:9.5,fill:C.dim});
    b += box(226,50,190,180,{stroke:C.goodS});
    b += t(321,72,"SIMT (GPU warps)",{size:10.5,bold:true,fill:C.goodT});
    b += box(266,84,110,24,{r:5,fill:C.acc,stroke:C.accS}) + t(321,100,"1 instruction",{size:9.5});
    for (let i=0;i<8;i++){ b += ln(321,108,246+i*22+9,126,{sw:1}); b += box(246+i*22,128,18,20,{r:3,fill:C.good,stroke:C.goodS,sw:1}); }
    b += t(321,164,"…×32 threads (a warp), each",{size:9.5,fill:C.dim});
    b += t(321,180,"with OWN registers + a mask",{size:9.5,fill:C.dim});
    b += t(321,198,"bit → threads can diverge",{size:9.5,fill:C.warn});
    b += t(321,216,"(at a cost — 4.4)",{size:9.5,fill:C.warn});
    b += box(428,50,190,180,{stroke:C.warn});
    b += t(523,72,"MIMD (multicore)",{size:10.5,bold:true,fill:C.warn});
    for (let i=0;i<4;i++){
      b += box(444+ (i%2)*86, 88+Math.floor(i/2)*54, 74,44,{r:5});
      b += t(481+(i%2)*86, 106+Math.floor(i/2)*54, "core "+i,{size:9});
      b += t(481+(i%2)*86, 122+Math.floor(i/2)*54, "own PC",{size:8.5,fill:C.dim2});
    }
    b += t(523,216,"OpenMP threads (3.9), processes",{size:9,fill:C.dim});
    b += t(320,262,"A modern GPU is ALL THREE at once: MIMD across SMs · SIMT across each warp · and tensor cores are SIMD-on-tiles.",{size:10.5,fill:C.dim});
    return svg(276,b,"simd simt and mimd panels");
  })();

  /* 4.4a — the die and one SM */
  D["m4l4-die"] = (() => {
    let b = t(320,22,"A GPU is ~100+ small cores (SMs) around a big L2 and HBM",{bold:true,size:13});
    b += box(30,46,270,240,{stroke:C.boxS});
    b += t(165,64,"one die (H100: 132 SMs)",{size:10,fill:C.dim});
    for (let r=0;r<9;r++) for (let c=0;c<11;c++){
      const hot = (r===4 && c===5);
      b += box(48+c*22,74+r*18,18,14,{r:2,fill:hot?C.warnFill:C.acc,stroke:hot?C.warn:C.accS,sw:hot?1.6:0.7});
    }
    b += box(48,244,238,16,{r:4,fill:C.good,stroke:C.goodS,sw:1.2}) + t(167,256,"L2 cache (50–60 MB)",{size:9,fill:C.goodT});
    b += box(6,90,18,140,{r:4,fill:C.warnFill,stroke:C.warn,sw:1}) ;
    b += box(306,90,18,140,{r:4,fill:C.warnFill,stroke:C.warn,sw:1});
    b += t(165,278,"HBM stacks flank the die (the yellow slabs)",{size:9,fill:C.dim2});
    b += ln(180,156,352,120,{dash:true,sw:1.2});
    b += box(352,60,262,206,{stroke:C.warn});
    b += t(483,82,"inside ONE SM",{size:10.5,bold:true,fill:C.warn});
    b += t(368,106,"4 warp schedulers (4 warps/cycle)",{a:"start",size:10});
    b += t(368,126,"128 FP32 cores · 4 tensor cores",{a:"start",size:10});
    b += t(368,146,"65,536 registers (256 KB!)",{a:"start",size:10,fill:C.accT});
    b += t(368,166,"228 KB shared memory / L1",{a:"start",size:10,fill:C.goodT});
    b += t(368,192,"up to 64 resident warps =",{a:"start",size:10,fill:C.dim});
    b += t(368,210,"2048 threads LIVING here at once",{a:"start",size:10,fill:C.dim});
    b += t(368,236,"An SM ≈ a simple multicore CPU;",{a:"start",size:9.5,fill:C.dim2});
    b += t(368,252,"the GPU ≈ 132 of them on a bus line",{a:"start",size:9.5,fill:C.dim2});
    b += t(320,306,"Registers outweigh cache — the opposite of a CPU. Reason on the next diagram: state for THOUSANDS of parked threads.",{size:10.5,fill:C.dim});
    return svg(320,b,"gpu die of many sms with one sm expanded");
  })();

  /* 4.4b — resident warps and the scheduler */
  D["m4l4-warps"] = (() => {
    let b = t(320,22,"Warps live IN the SM; switching costs nothing",{bold:true,size:13});
    b += box(30,48,380,232,{stroke:C.boxS});
    b += t(220,68,"one SM — resident warps and their state",{size:10,fill:C.dim});
    const st=[["warp 0","READY",C.good,C.goodS],["warp 1","stalled: waiting on HBM load",C.card,C.boxS],
              ["warp 2","ISSUED this cycle ◄",C.acc,C.accS],["warp 3","stalled: waiting on HBM load",C.card,C.boxS],
              ["warp 4","READY",C.good,C.goodS],["warp 5","stalled: tensor op in flight",C.card,C.boxS],
              ["warp 6","READY",C.good,C.goodS],["warp 7","… up to 64 resident",C.card,C.boxS]];
    for (let i=0;i<8;i++){
      b += box(46,76+i*25,120,20,{r:4,fill:st[i][2],stroke:st[i][3],sw:1.2});
      b += t(106,90+i*25,st[i][0],{size:9.5});
      b += t(176,90+i*25,st[i][1],{a:"start",size:9,fill:st[i][2]===C.card?C.dim2:C.tx});
    }
    b += box(430,84,184,120,{stroke:C.accS});
    b += t(522,108,"scheduler, each cycle:",{size:10,fill:C.accT});
    b += t(446,132,"pick ANY ready warp,",{a:"start",size:10});
    b += t(446,150,"issue its next instruction.",{a:"start",size:10});
    b += t(446,174,"No state moves — every",{a:"start",size:10,fill:C.goodT});
    b += t(446,192,"warp's registers STAY put.",{a:"start",size:10,fill:C.goodT});
    b += t(430,232,"CPU context switch: ~µs (save state).",{a:"start",size:9.5,fill:C.dim});
    b += t(430,250,"GPU warp switch: 0 cycles — the trick,",{a:"start",size:9.5,fill:C.dim});
    b += t(430,268,"paid for by the huge register file.",{a:"start",size:9.5,fill:C.dim});
    b += t(320,304,"'Occupancy' = resident warps ÷ 64. It's not about using cores — it's about having enough warps to hide stalls:",{size:10.5,fill:C.dim});
    return svg(318,b,"sm with resident warps in ready stalled issued states and a scheduler");
  })();

  /* 4.4c — latency hiding, THE diagram */
  D["m4l4-hiding"] = (() => {
    let b = t(320,22,"Latency hiding: the wait doesn't shrink — it gets COVERED",{bold:true,size:13});
    b += t(30,52,"1 warp:",{a:"start",size:10.5,fill:C.badS});
    b += box(90,44,26,18,{r:3,fill:C.acc,stroke:C.accS,sw:1});
    for (let i=0;i<16;i++) b += box(120+i*29,44,25,18,{r:3,fill:C.card,stroke:C.boxS,sw:0.7});
    b += box(120+16*29,44,26,18,{r:3,fill:C.acc,stroke:C.accS,sw:1});
    b += t(350,80,"issue … ~400 idle cycles waiting for HBM … issue",{size:9.5,fill:C.dim2});
    b += t(30,116,"12 warps:",{a:"start",size:10.5,fill:C.goodT});
    const cols=[C.acc,C.good,C.warnFill,"#2a1f45"];
    for (let i=0;i<18;i++){
      b += box(90+i*29,108,25,18,{r:3,fill:cols[i%4],stroke:C.boxS,sw:0.7});
      if (i<12) b += t(102+i*29,121,"w"+(i%12),{size:7.5,fill:C.dim});
    }
    b += t(350,144,"every cycle, SOME warp is ready — the memory waits still happen, hidden behind other warps' work",{size:9.5,fill:C.dim2});
    b += t(320,176,"How many warps to cover a stall?  warps ≈ latency ÷ issue-gap ≈ 400 ÷ 30 ≈ 12–16 per scheduler (M1 L2 arithmetic!).",{size:10.5,fill:C.accT});
    b += t(320,200,"CPUs hide latency with CACHES + prediction (per-thread). GPUs hide it with OTHER THREADS' arithmetic.",{size:10.5,fill:C.goodT});
    b += t(320,218,"This single sentence explains: why 10,000 threads is normal, why occupancy matters, why tiny caches are fine.",{size:10.5,fill:C.dim});
    return svg(232,b,"one warp idles during memory latency while many warps interleave to fill every cycle");
  })();

  /* 4.5a — GPU memory ladder */
  D["m4l5-gpumem"] = (() => {
    let b = t(320,22,"The GPU memory system (B200-class numbers; H100 in parentheses)",{bold:true,size:13});
    const rows=[["registers","255 per thread","~0 cyc","~40 TB/s effective",170,C.good,C.goodS],
                ["shared mem / L1","228 KB per SM","~30 cyc","~20 TB/s aggregate",250,C.good,C.goodS],
                ["L2 cache","126 MB (50)","~200 cyc","~10 TB/s",330,C.acc,C.accS],
                ["HBM3e","192 GB (80)","~500 cyc","8.0 TB/s (3.35)",420,C.warnFill,C.warn],
                ["NVLink 5 to peers","per GPU","~µs","1.8 TB/s (0.9)",490,C.bad,C.badS],
                ["PCIe gen5 to host","system RAM","~µs","64 GB/s",520,"#1b2231",C.boxS]];
    for (let i=0;i<6;i++){
      const [name,size,lat,bw,w,f,s]=rows[i];
      const y=44+i*44;
      b += box(30,y,w,36,{fill:f,stroke:s,sw:1.4});
      b += t(42,y+15,name,{a:"start",size:10.5,bold:true});
      b += t(42,y+29,size,{a:"start",size:9,fill:C.dim});
      b += t(w+44,y+15,lat,{a:"start",size:10,fill:C.accT});
      b += t(w+44,y+29,bw,{a:"start",size:10,fill:C.goodT});
    }
    b += t(320,326,"Bandwidth falls ~2–100× per step. The 8 TB/s ÷ 64 GB/s = 125× PCIe cliff is 4.6's whole story.",{size:10,fill:C.dim});
    return svg(340,b,"gpu memory levels with sizes latencies and bandwidths");
  })();

  /* 4.5b — coalescing into sectors */
  D["m4l5-coalesce"] = (() => {
    let b = t(320,22,"Coalescing: a warp's 32 loads become 4 transactions — or 32",{bold:true,size:13});
    b += t(40,52,"consecutive: thread i reads x[base + i]  (stride 1)",{a:"start",size:10.5,fill:C.goodT});
    for (let i=0;i<8;i++){ b += ln(70+i*40,62,70+i*40,84,{stroke:C.goodS,sw:1.2}); b += triD(70+i*40,88,{stroke:C.goodS}); }
    b += t(410,74,"… ×32 threads",{a:"start",size:9.5,fill:C.dim2});
    for (let i=0;i<4;i++){ b += box(50+i*90,92,84,26,{r:5,fill:C.good,stroke:C.goodS}); b += t(92+i*90,109,"32 B sector",{size:9.5,fill:C.goodT}); }
    b += t(410,109,"= 4 transactions, 128 B moved, all used ✓",{a:"start",size:10,fill:C.goodT});
    b += t(40,152,"strided: thread i reads x[base + i*32]  (a column walk)",{a:"start",size:10.5,fill:C.badS});
    for (let i=0;i<8;i++){ b += ln(70+i*40,162,70+i*40,184,{stroke:C.badS,sw:1.2,dash:true}); b += triD(70+i*40,188,{stroke:C.badS}); }
    for (let i=0;i<8;i++){ b += box(50+i*72,192,64,26,{r:5,fill:C.bad,stroke:C.badS,sw:1.2}); b += t(82+i*72,209,"32 B",{size:9.5,fill:C.badS}); }
    b += t(320,240,"…32 separate sectors: 1024 B moved for 128 B used — 8× the traffic, up to 32× on older granularity.",{size:10.5,fill:C.badS});
    b += t(320,268,"Same physics as 4.2's cache line (the line became a 32 B sector; the loop became a warp). Fix: same as always —",{size:10.5,fill:C.dim});
    b += t(320,286,"consecutive threads ↔ consecutive addresses. M1 L2's linearization is how you ARRANGE that. (5.7 measures it.)",{size:10.5,fill:C.dim});
    return svg(300,b,"consecutive warp accesses coalescing into four sectors versus strided into thirty two");
  })();

  /* 4.5c — shared memory banks */
  D["m4l5-banks"] = (() => {
    let b = t(320,22,"Shared memory: 32 banks, one word per bank per cycle",{bold:true,size:13});
    b += t(40,50,"conflict-free: thread i → bank i (any permutation works too)",{a:"start",size:10.5,fill:C.goodT});
    for (let i=0;i<8;i++){
      b += box(50+i*52,58,44,22,{r:4,fill:C.good,stroke:C.goodS,sw:1}); b += t(72+i*52,73,"b"+i,{size:9});
      b += ln(72+i*52,92,72+i*52,82,{stroke:C.goodS,sw:1.1});
    }
    b += t(475,73,"… ×32: 1 cycle total",{a:"start",size:9.5,fill:C.dim2});
    b += t(40,130,"8-way conflict: threads 0..7 all hit bank 0 (tile column, stride 32 floats)",{a:"start",size:10.5,fill:C.badS});
    b += box(50,138,44,22,{r:4,fill:C.bad,stroke:C.badS,sw:1.2}) + t(72,153,"b0",{size:9,fill:C.badS});
    for (let i=0;i<8;i++) b += ln(60+i*18,172,70,162,{stroke:C.badS,sw:1,dash:true});
    b += t(200,153,"→ SERIALIZED: 8 cycles for what took 1",{a:"start",size:10,fill:C.badS});
    b += t(40,204,"the fix you met in M1 L2: pad the tile — float tile[32][33] — the phantom column shifts",{a:"start",size:10.5,fill:C.accT});
    b += t(40,222,"each row by one bank, so columns land on DIFFERENT banks. One wasted column buys 8×.",{a:"start",size:10.5,fill:C.accT});
    b += t(320,254,"Banks are why shared memory can feed 32 threads/cycle at all — and the +1 pad is the oldest trick in CUDA (5.5).",{size:10.5,fill:C.dim});
    return svg(268,b,"shared memory banks conflict free versus eight way conflict and padding fix");
  })();

  /* 4.6a — host-device topology */
  D["m4l6-topology"] = (() => {
    let b = t(320,22,"The topology: two fast islands, one narrow bridge",{bold:true,size:13});
    b += box(30,60,150,70,{stroke:C.accS}) + t(105,88,"CPU",{size:12,bold:true,fill:C.accT}) + t(105,108,"a few fast cores",{size:9,fill:C.dim});
    b += box(30,160,150,50,{stroke:C.boxS}) + t(105,182,"DRAM 64 GB",{size:10.5}) + t(105,198,"~100 GB/s",{size:9.5,fill:C.accT});
    b += ln(105,130,105,160,{sw:6,stroke:C.accS});
    b += box(430,60,180,70,{stroke:C.goodS}) + t(520,88,"GPU",{size:12,bold:true,fill:C.goodT}) + t(520,108,"132 SMs, 10k+ threads",{size:9,fill:C.dim});
    b += box(430,160,180,50,{stroke:C.warn}) + t(520,182,"HBM3e 192 GB",{size:10.5,fill:C.warn}) + t(520,198,"8,000 GB/s",{size:9.5,fill:C.warn});
    b += ln(520,130,520,160,{sw:16,stroke:C.goodS});
    b += ln(180,95,430,95,{sw:2,stroke:C.badS});
    b += t(305,84,"PCIe gen5 x16: 64 GB/s each way",{size:10,fill:C.badS});
    b += t(305,112,"the 125× cliff",{size:10.5,bold:true,fill:C.badS});
    b += box(430,236,180,44,{stroke:"#b48cff"}) + t(520,254,"peer GPU (NVLink 5)",{size:10,fill:"#cdb4ff"}) + t(520,270,"1,800 GB/s",{size:9.5,fill:"#cdb4ff"});
    b += ln(520,210,520,236,{sw:10,stroke:"#b48cff"});
    b += t(230,254,"line thickness ∝ bandwidth (roughly).",{a:"start",size:9.5,fill:C.dim2});
    b += t(30,254,"Moral: data that lives on the",{a:"start",size:10,fill:C.dim});
    b += t(30,272,"GPU should STAY there.",{a:"start",size:10,fill:C.dim});
    b += t(320,308,"Every cudaMemcpy crosses the red bridge — 4.6 prices the trip. (Rubin era: PCIe6 ×2; NVLink keeps scaling.)",{size:10,fill:C.dim});
    return svg(322,b,"cpu and gpu islands with narrow pcie bridge and wide hbm and nvlink");
  })();

  /* 4.6b — transfer economics / break-even */
  D["m4l6-breakeven"] = (() => {
    let b = t(320,22,"Ship it only if you'll REUSE it: transfer vs compute time",{bold:true,size:13});
    const rows=[["saxpy, 100M floats","transfer 1200 MB → 19 ms","compute 0.2B FLOP → 0.004 ms",480,10,"NEVER ship for this — 4750× waste",C.badS],
                ["matmul 4096³","transfer 200 MB → 3.1 ms","compute 137 GFLOP → 2.7 ms",120,110,"break-even zone — batch or keep resident",C.warn],
                ["matmul 16384³","transfer 3.2 GB → 50 ms","compute 8.8 TFLOP → 176 ms",90,300,"compute dominates — worth the trip",C.goodS]];
    let y=52;
    for (const [name,tr,co,tw,cw,verdict,col] of rows){
      b += t(30,y+12,name,{a:"start",size:10.5,bold:true,fill:col});
      b += box(30,y+20,tw,16,{r:3,fill:C.bad,stroke:C.badS,sw:1}) ;
      b += box(30+tw+4,y+20,cw,16,{r:3,fill:C.good,stroke:C.goodS,sw:1});
      b += t(30,y+52,tr,{a:"start",size:9.5,fill:C.badS});
      b += t(330,y+52,co,{a:"start",size:9.5,fill:C.goodT});
      b += t(30,y+70,verdict,{a:"start",size:9.5,fill:col});
      y += 86;
    }
    b += t(320,y+10,"Rule of thumb at 50 TFLOP/s over 64 GB/s: shipped bytes must earn ~800 FLOPs EACH (M1 L3 §4's balance, PCIe edition).",{size:10,fill:C.accT});
    b += t(320,y+28,"Bars: red = PCIe transfer, green = GPU compute (widths to scale per row's total).",{size:9.5,fill:C.dim2});
    return svg(y+42,b,"transfer versus compute bars for saxpy and two matmul sizes");
  })();

  /* 4.6c — overlap with streams */
  D["m4l6-overlap"] = (() => {
    let b = t(320,22,"Overlap: chunk the work, run copy and compute simultaneously",{bold:true,size:13});
    b += t(30,52,"serial:",{a:"start",size:10,fill:C.dim});
    b += box(90,42,150,20,{r:4,fill:C.bad,stroke:C.badS,sw:1}) + t(165,56,"copy in",{size:9});
    b += box(244,42,150,20,{r:4,fill:C.good,stroke:C.goodS,sw:1}) + t(319,56,"compute",{size:9});
    b += box(398,42,150,20,{r:4,fill:C.warnFill,stroke:C.warn,sw:1}) + t(473,56,"copy out",{size:9});
    b += t(558,56,"= 3T",{a:"start",size:10,fill:C.dim});
    b += t(30,84,"pipelined (4 chunks, 3 streams):",{a:"start",size:10,fill:C.dim});
    const cw=86;
    for (let i=0;i<4;i++) b += box(90+i*cw,92,cw-4,18,{r:3,fill:C.bad,stroke:C.badS,sw:1}) + t(90+i*cw+cw/2-2,105,"in"+i,{size:8.5});
    for (let i=0;i<4;i++) b += box(90+cw+i*cw,114,cw-4,18,{r:3,fill:C.good,stroke:C.goodS,sw:1}) + t(90+cw+i*cw+cw/2-2,127,"k"+i,{size:8.5});
    for (let i=0;i<4;i++) b += box(90+2*cw+i*cw,136,cw-4,18,{r:3,fill:C.warnFill,stroke:C.warn,sw:1}) + t(90+2*cw+i*cw+cw/2-2,149,"out"+i,{size:8.5});
    b += t(30,127,"stream A/B/C:",{a:"start",size:8.5,fill:C.dim2});
    b += t(320,186,"total ≈ T + 2·(T/4): the copies hide behind compute — the 4.4 latency-hiding idea, at PCIe scale (5.9 builds it).",{size:10.5,fill:C.dim});
    b += t(320,204,"Requires: pinned host memory (DMA needs unmovable pages) and independent chunks (purity — M2 L3, still paying).",{size:10.5,fill:C.dim});
    return svg(218,b,"serial copy compute copy versus pipelined chunks across three streams");
  })();

  /* 4.7a — the roofline */
  D["m4l7-roofline"] = (() => {
    let b = t(320,22,"The roofline: one chart that locates every kernel (RTX 5090 fp32)",{bold:true,size:13});
    const px = ai => 60 + Math.log2(ai/0.25) * 46;
    const py = gf => 300 - Math.log10(gf/100) * 80.1;
    b += ln(60,300,620,300,{stroke:C.boxS}) + ln(60,300,60,50,{stroke:C.boxS});
    for (const [ai,lbl] of [[0.25,"0.25"],[1,"1"],[4,"4"],[16,"16"],[64,"64"],[256,"256"],[1024,"1024"]])
      b += t(px(ai),316,lbl,{size:9,fill:C.dim2});
    b += t(340,332,"arithmetic intensity (FLOP per byte, log)",{size:9.5,fill:C.dim});
    for (const [gf,lbl] of [[100,"100"],[1000,"1k"],[10000,"10k"],[100000,"100k"]])
      b += t(52,py(gf)+3,lbl,{a:"end",size:9,fill:C.dim2});
    b += t(30,40,"GFLOP/s",{a:"start",size:9.5,fill:C.dim});
    const ridgeAI = 104800/1792;   /* 58.5 */
    b += ln(px(0.25), py(0.25*1792), px(ridgeAI), py(104800), {stroke:C.accS,sw:2.2});
    b += ln(px(ridgeAI), py(104800), 620, py(104800), {stroke:C.goodS,sw:2.2});
    b += ln(px(ridgeAI), py(104800), px(ridgeAI), 300, {stroke:C.warn,dash:true,sw:1.2});
    b += t(px(ridgeAI), 292, "ridge ≈ 58",{size:9,fill:C.warn});
    b += t(150,120,"memory roof:",{size:9.5,fill:C.accT});
    b += t(150,134,"GFLOP/s = AI × 1792",{size:9.5,fill:C.accT});
    b += t(500,py(104800)-10,"compute roof: 104.8 TF",{size:9.5,fill:C.goodT});
    b += dot(px(0.25),py(448),4.5,C.badS) + t(px(0.25)+8,py(448)-6,"saxpy (AI 0.17→0.25)",{a:"start",size:9,fill:C.badS});
    b += dot(px(1),py(1792),4.5,C.warn) + t(px(1)+8,py(1792)+2,"stencil ~1",{a:"start",size:9,fill:C.warn});
    b += dot(px(8),py(8*1792),4.5,C.warn) + t(px(8)+8,py(8*1792)+4,"fused attention block",{a:"start",size:9,fill:C.warn});
    b += dot(px(170),py(104800),4.5,C.goodT) + t(px(170)+6,py(104800)+16,"big matmul (AI~170)",{a:"start",size:9,fill:C.goodT});
    b += t(320,354,"Left of ridge: only MORE REUSE helps (fuse, tile, batch). Right: only more FLOP/s (tensor cores, precision).",{size:10.5,fill:C.dim});
    b += t(320,372,"You computed AI by hand since M1 L3 §4 — this chart is that arithmetic, drawn once per machine.",{size:10.5,fill:C.dim});
    return svg(386,b,"roofline chart with memory slope compute roof ridge and example kernels");
  })();

  /* 4.7b — spec sheet, annotated */
  D["m4l7-specsheet"] = (() => {
    let b = t(320,22,"Reading a spec sheet without being marketed to",{bold:true,size:13});
    const rows=[["FP32","104.8 TF","67 TF","graphics/HPC baseline — NOT the AI number",C.accT],
                ["FP16 Tensor","1676 TF*","989 TF*","*sparsity! DENSE is half — always halve the asterisk",C.badS],
                ["Memory","32 GB GDDR7","80 GB HBM3","does the MODEL fit? 14B params fp16 = 28 GB…",C.warn],
                ["Bandwidth","1.79 TB/s","3.35 TB/s","inference ceiling: tok/s ≈ BW ÷ model bytes",C.goodT],
                ["Balance","~58 FLOP/B","~20 FLOP/B","peak ÷ BW = roofline ridge vs your AI",C.accT],
                ["TDP / price","575 W / $2k","700 W / $30k+","perf-per-watt and per-$ decide fleets, not peaks",C.dim]];
    b += t(200,52,"RTX 5090",{size:10,bold:true,fill:C.dim}) + t(320,52,"H100 SXM",{size:10,bold:true,fill:C.dim});
    for (let i=0;i<6;i++){
      const y=60+i*44;
      b += box(30,y,110,36,{r:5}) + t(85,y+22,rows[i][0],{size:10,bold:true});
      b += box(146,y,108,36,{r:5,fill:C.card}) + t(200,y+22,rows[i][1],{size:9.5});
      b += box(260,y,120,36,{r:5,fill:C.card}) + t(320,y+22,rows[i][2],{size:9.5});
      b += t(392,y+22,rows[i][3],{a:"start",size:9,fill:rows[i][4]});
    }
    b += t(320,344,"Datacenter 2026: B200 192 GB @ 8 TB/s, NVLink 1.8 TB/s; B300 288 GB; Rubin (HBM4, 13 TB/s) landing H2 — the",{size:9.5,fill:C.dim});
    b += t(320,360,"numbers move yearly; the READING METHOD (which row gates which workload) is what this lesson installs.",{size:9.5,fill:C.dim});
    return svg(374,b,"annotated gpu spec sheet comparing rtx 5090 and h100");
  })();

  /* 4.7c — the honesty ladder: peak vs achieved */
  D["m4l7-ladder"] = (() => {
    let b = t(320,22,"From brochure to reality: the utilization ladder",{bold:true,size:13});
    const rows=[["marketing peak (sparse)","100%",260,C.bad,C.badS],
                ["dense tensor peak","50%",130,C.warnFill,C.warn],
                ["excellent kernel / MFU 40–60%","~25%",65,C.acc,C.accS],
                ["typical tuned kernel","10–25%",36,C.acc,C.accS],
                ["your first kernel (5.2)","1–5%",10,C.good,C.goodS]];
    for (let i=0;i<5;i++){
      const y=48+i*42;
      b += t(226,y+18,rows[i][0],{a:"end",size:10});
      b += box(240,y,rows[i][2],28,{r:5,fill:rows[i][3],stroke:rows[i][4],sw:1.4});
      b += t(240+rows[i][2]+12,y+18,rows[i][1]+" of the brochure",{a:"start",size:9.5,fill:C.dim});
    }
    b += t(320,276,"MFU (model FLOPs utilization) is the industry's honest metric — frontier training runs brag about 40–60%.",{size:10.5,fill:C.dim});
    b += t(320,294,"Your 3.9 audit hit 20% of CPU peak — same ladder, same honesty. 5.11 climbs the GPU one, rung by rung.",{size:10.5,fill:C.goodT});
    return svg(308,b,"ladder from marketing peak down to first kernel utilization");
  })();

  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, D);
})();

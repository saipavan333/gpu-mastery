/* GPU Mastery — Track B diagram pack. Registers SVGs on window.DIAGRAMS. */
(function () {
  const C = { card:"#161b26", tx:"#e8edf5", dim:"#aab4c4", box:"#222a38",
    boxS:"#3b4760", acc:"#27406e", accS:"#5b9bff", accT:"#8fb6ff",
    good:"#173d31", goodS:"#36c98a", goodT:"#5fd6a4", warnFill:"#3a3320",
    warn:"#f5b850", bad:"#3d1f24", badS:"#ff6b6b", line:"#8a97aa", dim2:"#7e8aa0" };
  const F = "font-family:Inter,system-ui,sans-serif";
  const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const box=(x,y,w,h,o={})=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" style="fill:${o.fill||C.box};stroke:${o.stroke||C.boxS};stroke-width:1.4"/>`;
  const t=(x,y,s,o={})=>`<text x="${x}" y="${y}" text-anchor="${o.a||"middle"}" style="fill:${o.fill||C.tx};font-size:${o.size||12}px;font-weight:${o.bold?700:400};${F}">${esc(s)}</text>`;
  const ln=(x1,y1,x2,y2,o={})=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${o.stroke||C.line};stroke-width:${o.sw||1.7}${o.dash?";stroke-dasharray:5 4":""}"/>`;
  const tri=(x,y,o={})=>`<polygon points="${x-7},${y-4} ${x},${y} ${x-7},${y+4}" style="fill:${o.stroke||C.line}"/>`;
  const triL=(x,y,o={})=>`<polygon points="${x+7},${y-4} ${x},${y} ${x+7},${y+4}" style="fill:${o.stroke||C.line}"/>`;
  const triU=(x,y,o={})=>`<polygon points="${x-4},${y+7} ${x},${y} ${x+4},${y+7}" style="fill:${o.stroke||C.line}"/>`;
  const triD=(x,y,o={})=>`<polygon points="${x-4},${y-7} ${x},${y} ${x+4},${y-7}" style="fill:${o.stroke||C.line}"/>`;
  const arrowR=(x1,y,x2,o={})=>ln(x1,y,x2,y,o)+tri(x2,y,o);
  const svg=(h,body,label)=>`<svg viewBox="0 0 640 ${h}" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="640" height="${h}" rx="10" style="fill:${C.card}"/>${body}</svg>`;
  const D = {};

  /* ---------------- B1 ---------------- */
  D["b1-fd"] = (() => {
    let b = t(320,22,"Finite differences: derivatives from neighbors, orders measured",{bold:true,size:13});
    b += ln(60,80,580,80,{sw:1.2});
    for (const [x,l] of [[200,"x−h"],[320,"x"],[440,"x+h"]]) { b += `<circle cx="${x}" cy="80" r="5" style="fill:${C.accS}"/>` + t(x,102,l,{size:10,fill:C.accT}); }
    b += t(320,128,"forward  (f(x+h)−f(x))/h            O(h)   — err ×10 per decade (measured)",{size:10.5});
    b += t(320,148,"central  (f(x+h)−f(x−h))/2h        O(h²) — err ×100 per decade (measured)",{size:10.5,fill:C.goodT});
    b += t(320,168,"second   (f(x+h)−2f(x)+f(x−h))/h²  O(h²) — the Laplacian's atom (B3!)",{size:10.5,fill:C.warn});
    b += t(320,192,"Taylor cancels odd terms in symmetric stencils — symmetry buys an order for free.",{size:10.5,fill:C.dim});
    return svg(206,b,"finite difference stencils and orders");
  })();

  D["b1-vshape"] = (() => {
    let b = t(320,22,"Two error regimes: truncation falls, cancellation rises — trust the dip",{bold:true,size:13});
    b += ln(80,180,80,44,{sw:1.2}) + ln(80,180,600,180,{sw:1.2});
    b += t(46,110,"log err",{size:9.5,fill:C.dim}) + t(340,196,"log h  (smaller h →)",{size:9.5,fill:C.dim});
    b += ln(560,60,300,150,{stroke:C.goodS,sw:2}) + t(510,52,"truncation O(h²)",{size:9.5,fill:C.goodT});
    b += ln(300,150,120,70,{stroke:C.badS,sw:2}) + t(160,58,"cancellation (M1 L8)",{size:9.5,fill:C.badS});
    b += `<circle cx="300" cy="150" r="6" style="fill:${C.warn}"/>` + t(300,170,"the dip: h* ≈ 1e-5 (fp64 central)",{size:9.5,fill:C.warn});
    b += t(320,214,"Same V as A1 — and in B it also sets SIMULATION step sizes: smaller h is not always better.",{size:10.5,fill:C.dim});
    return svg(228,b,"error V-shape truncation vs cancellation");
  })();

  D["b1-euler"] = (() => {
    let b = t(320,22,"Integrators: order buys accuracy; stability is a separate contract",{bold:true,size:13});
    b += box(30,44,280,96) + t(170,64,"global error (measured, y'=−y)",{size:10,bold:true});
    b += t(170,84,"Euler: halve h → err ÷2   (O(h))",{size:9.5});
    b += t(170,102,"RK4:   halve h → err ÷16.4 (O(h⁴))",{size:9.5,fill:C.goodT});
    b += t(170,122,"1.9e-2 vs 3.3e-7 at h=0.1 — 5 digits apart",{size:9,fill:C.dim});
    b += box(330,44,280,96,{fill:C.warnFill,stroke:C.warn}) + t(470,64,"stability wall (y'=−50y)",{size:10,bold:true,fill:C.warn});
    b += t(470,84,"h=0.035 → decays to 1e-25 ✓",{size:9.5,fill:C.goodT});
    b += t(470,102,"h=0.045 → EXPLODES to 2e+19 ✗",{size:9.5,fill:C.badS});
    b += t(470,122,"wall at h=2/λ exactly — |1−λh|>1 amplifies",{size:9,fill:C.dim});
    b += t(320,162,"Accuracy and stability are DIFFERENT failures: RK4 at unstable h explodes beautifully too (stiffness → implicit methods).",{size:10,fill:C.dim});
    return svg(176,b,"euler vs rk4 accuracy and stability");
  })();

  /* ---------------- B2 ---------------- */
  D["b2-libs"] = (() => {
    let b = t(320,22,"The library-first ladder: hand-rolling is the LAST resort (5.11's law)",{bold:true,size:13});
    const r=(y,s1,s2,o={})=>box(60,y,400,26,o)+t(260,y+17,s1,{size:9.5,fill:o.tf||C.tx})+t(530,y+17,s2,{size:9,fill:C.dim});
    b += r(44,"cuBLAS / cuSOLVER / cuFFT — dense, factorizations, transforms","vendor-tuned, use first",{fill:C.good,stroke:C.goodS,tf:C.goodT});
    b += r(76,"cuSPARSE — SpMV/SpMM on CSR/COO","format choice = yours");
    b += r(108,"Thrust / CUB — sort, scan, reduce building blocks (B9)","5.8's ladder, productized");
    b += r(140,"your Triton/CUDA — fused/special patterns only","A-track's admission test",{fill:C.warnFill,stroke:C.warn,tf:C.warn});
    b += t(320,186,"Science codes are decades-lived: every hand kernel is a maintenance liability someone inherits (A3's scenario).",{size:10,fill:C.dim});
    return svg(200,b,"gpu library ladder");
  })();

  D["b2-colmajor"] = (() => {
    let b = t(320,22,"cuBLAS is column-major: the transpose identity, not a transpose copy",{bold:true,size:13});
    b += box(40,50,160,70) + t(120,72,"your C row-major",{size:10,bold:true}) + t(120,92,"A(m,k)·B(k,n)=C(m,n)",{size:9.5,fill:C.dim});
    b += arrowR(200,85,250);
    b += box(254,50,190,70,{fill:C.acc,stroke:C.accS}) + t(349,72,"cuBLAS sees memory",{size:10,bold:true,fill:C.accT}) + t(349,92,"as COLUMN-major views",{size:9.5,fill:C.dim});
    b += arrowR(444,85,494);
    b += box(498,50,120,70,{fill:C.good,stroke:C.goodS}) + t(558,72,"call gemm(B,A)",{size:10,bold:true,fill:C.goodT}) + t(558,92,"Cᵀ=BᵀAᵀ — free!",{size:9.5,fill:C.dim});
    b += t(320,146,"Same bytes, reinterpreted: swap operand ORDER, get your row-major C back. Zero copies (5.11's gotcha, solved).",{size:10.5,fill:C.dim});
    b += t(320,166,"Fixture: one 3×2·2×4 case checked by hand — layout bugs are silent and shape-legal (M2 L5's literacy).",{size:10.5,fill:C.accT});
    return svg(180,b,"column major transpose identity");
  })();

  D["b2-sparse"] = (() => {
    let b = t(320,22,"CSR anatomy + the honest crossover: sparsity must EARN its overhead",{bold:true,size:13});
    b += t(150,44,"dense row: [0 7 0 0 3 0]",{size:10,fill:C.dim});
    b += box(40,54,200,24) + t(140,70,"values   [7, 3]",{size:9.5});
    b += box(40,84,200,24) + t(140,100,"col_idx  [1, 4]",{size:9.5});
    b += box(40,114,200,24) + t(140,130,"row_ptr  [0, 2, …]",{size:9.5});
    b += box(300,54,310,84,{fill:C.warnFill,stroke:C.warn});
    b += t(455,74,"SpMV bytes ≈ 8·nnz  vs dense 4·N²",{size:10,fill:C.warn});
    b += t(455,94,"traffic-even at 50% density — but gathers",{size:9.5,fill:C.dim});
    b += t(455,112,"pay 5.7's scatter tax → real win needs ≲10–20%",{size:9.5,fill:C.dim});
    b += t(320,162,"Below ~10% density sparse wins (PDE matrices: ~5 nnz/row). At 30%? Measure — density is a regime, not a virtue.",{size:10,fill:C.dim});
    return svg(176,b,"csr format and sparse crossover");
  })();

  /* ---------------- B3 ---------------- */
  D["b3-stencil"] = (() => {
    let b = t(320,22,"The 5-point stencil: every grid point averages its neighbors",{bold:true,size:13});
    const cx=160, cy=110, s=34;
    for (let i=-2;i<=2;i++) for (let j=-2;j<=2;j++) {
      const hot = (i===0&&j===0), nb = (Math.abs(i)+Math.abs(j)===1);
      b += box(cx+i*s-14, cy+j*s-14, 28, 28, {fill: hot?C.warnFill:(nb?C.good:C.box), stroke: hot?C.warn:(nb?C.goodS:C.boxS)});
    }
    b += t(cx,cy+4,"u",{size:10,bold:true,fill:C.warn});
    b += t(430,64,"u'ᵢⱼ = (uᵢ₊₁ⱼ + uᵢ₋₁ⱼ + uᵢⱼ₊₁ + uᵢⱼ₋₁ − 4uᵢⱼ)",{size:10.5});
    b += t(430,84,"× α·dt/h²  +  uᵢⱼ      (heat equation step)",{size:10.5,fill:C.dim});
    b += t(430,116,"= B1's second-derivative stencil, twice",{size:10,fill:C.goodT});
    b += t(430,136,"AI ≈ 0.4 FLOP/B — bandwidth citizen (4.7);",{size:10,fill:C.dim});
    b += t(430,154,"5.5's tiling+halo is the standard remedy",{size:10,fill:C.dim});
    b += t(320,208,"Read 5 points, write 1, per cell per step — the memory ledger rules stencils, and B10's capstone lives here.",{size:10.5,fill:C.dim});
    return svg(222,b,"five point stencil heat equation");
  })();

  D["b3-halo"] = (() => {
    let b = t(320,22,"Halo exchange: each subdomain owns its cells, BORROWS one ring",{bold:true,size:13});
    b += box(80,50,180,110,{fill:C.acc,stroke:C.accS}) + t(170,105,"rank 0's cells",{size:10.5,fill:C.accT});
    b += box(380,50,180,110,{fill:C.good,stroke:C.goodS}) + t(470,105,"rank 1's cells",{size:10.5,fill:C.goodT});
    b += box(262,50,24,110,{fill:C.warnFill,stroke:C.warn}) + box(354,50,24,110,{fill:C.warnFill,stroke:C.warn});
    b += t(320,40,"halos",{size:9.5,fill:C.warn});
    b += ln(286,90,354,90,{sw:1.6}) + tri(354,90,{}) ; b += ln(354,120,286,120,{sw:1.6}) + triL(286,120,{});
    b += t(320,182,"Per step: exchange the ring (O(N) bytes), compute the interior (O(N²)) — surface/volume is why this scales (4.7).",{size:10,fill:C.dim});
    b += t(320,202,"Overlap: post async recv/send, compute INTERIOR, then edges — 5.9's ring at cluster scale (B5 does it over MPI).",{size:10,fill:C.accT});
    return svg(216,b,"halo exchange between subdomains");
  })();

  D["b3-jacobi"] = (() => {
    let b = t(320,22,"Iterate to steady state: residual falls, and the fixture is physics",{bold:true,size:13});
    b += ln(80,170,80,44,{sw:1.2}) + ln(80,170,600,170,{sw:1.2});
    b += t(44,105,"log‖r‖",{size:9.5,fill:C.dim}) + t(340,188,"iterations",{size:9.5,fill:C.dim});
    b += ln(90,60,560,150,{stroke:C.goodS,sw:2});
    b += t(480,120,"Jacobi: slow but parallel-friendly",{size:9.5,fill:C.goodT});
    b += t(320,208,"Solver fixtures: residual monotone ↓ · analytic solutions match · conserved quantities conserve (energy/mass) —",{size:10,fill:C.dim});
    b += t(320,226,"physics IS the oracle (M2 L6's constitution, science edition).",{size:10,fill:C.accT});
    return svg(240,b,"jacobi residual convergence");
  })();

  /* ---------------- B4 ---------------- */
  D["b4-sqrtn"] = (() => {
    let b = t(320,22,"Monte Carlo converges at 1/√N — measured slope −0.494",{bold:true,size:13});
    b += ln(80,170,80,44,{sw:1.2}) + ln(80,170,600,170,{sw:1.2});
    b += t(44,105,"log err",{size:9.5,fill:C.dim}) + t(340,188,"log N",{size:9.5,fill:C.dim});
    b += ln(100,60,560,150,{stroke:C.accS,sw:2});
    b += t(300,80,"RMS over 30 trials: slope −0.494 ≈ −½ ✓",{size:9.5,fill:C.accT});
    b += t(320,208,"×100 the samples → ÷10 the error: brutal but UNCONDITIONAL (dimension-free — why MC owns high-dimensional integrals).",{size:10,fill:C.dim});
    b += t(320,226,"A single run's slope read −0.80: convergence RATES are statistics too — measure with trials (M1 L7, recursively).",{size:10,fill:C.warn});
    return svg(240,b,"monte carlo one over sqrt n convergence");
  })();

  D["b4-streams"] = (() => {
    let b = t(320,22,"Parallel RNG: streams must be INDEPENDENT by construction, not folklore",{bold:true,size:13});
    b += box(40,46,270,54,{fill:C.bad,stroke:C.badS}) + t(175,66,"rng(seed) on every rank",{size:10,bold:true,fill:C.badS}) + t(175,86,"corr = 1.0 (measured): N ranks, 1 sample",{size:9,fill:C.dim});
    b += box(330,46,280,54,{fill:C.good,stroke:C.goodS}) + t(470,66,"SeedSequence(seed).spawn(N)",{size:10,bold:true,fill:C.goodT}) + t(470,86,"corr ≈ −0.02 ✓ · or counter RNG (Philox)",{size:9,fill:C.dim});
    b += t(320,126,"cuRAND's device API = counter-based (Philox): stream = f(seed, subsequence, offset) — reproducible AND independent,",{size:10,fill:C.dim});
    b += t(320,144,"regardless of thread count: the 5.8 determinism story, solved at the SOURCE for randomness.",{size:10,fill:C.accT});
    return svg(158,b,"parallel rng stream independence");
  })();

  D["b4-variance"] = (() => {
    let b = t(320,22,"Variance reduction: same 1/√N slope, smaller constant — measured 62×",{bold:true,size:13});
    b += box(40,46,180,80) + t(130,66,"plain",{size:10,bold:true}) + t(130,86,"var(e^U) = 0.242",{size:9.5}) + t(130,106,"N samples",{size:9,fill:C.dim});
    b += box(230,46,190,80,{fill:C.good,stroke:C.goodS}) + t(325,66,"antithetic",{size:10,bold:true,fill:C.goodT}) + t(325,86,"½(f(U)+f(1−U)): var 0.0039",{size:9.5}) + t(325,106,"62× less variance (measured)",{size:9,fill:C.dim});
    b += box(430,46,180,80,{fill:C.acc,stroke:C.accS}) + t(520,66,"stratified / QMC",{size:10,bold:true,fill:C.accT}) + t(520,86,"spread samples evenly",{size:9.5}) + t(520,106,"Sobol: ~1/N on smooth f",{size:9,fill:C.dim});
    b += t(320,150,"62× variance = 62× fewer samples for the same error — algebra beats hardware again (works because e^U is monotone:",{size:10,fill:C.dim});
    b += t(320,168,"f(U) and f(1−U) anti-correlate). Know WHY it worked or it silently won't (quiz territory).",{size:10,fill:C.dim});
    return svg(182,b,"variance reduction menu");
  })();

  /* ---------------- B5 ---------------- */
  D["b5-ranks"] = (() => {
    let b = t(320,22,"MPI: N processes, private memories, explicit messages — 5.3's worlds, multiplied",{bold:true,size:13});
    for (let i=0;i<4;i++) {
      b += box(40+i*150,50,130,64,{fill:i===0?C.acc:C.box,stroke:i===0?C.accS:C.boxS});
      b += t(105+i*150,70,"rank "+i,{size:10.5,bold:true,fill:i===0?C.accT:C.tx});
      b += t(105+i*150,88,"own memory,",{size:9,fill:C.dim}) + t(105+i*150,102,"own GPU",{size:9,fill:C.dim});
    }
    b += ln(170,82,190,82,{sw:1.4}) + tri(190,82,{}) + ln(320,82,340,82,{sw:1.4}) + tri(340,82,{}) + ln(470,82,490,82,{sw:1.4}) + tri(490,82,{});
    b += t(320,138,"MPI_Send/Recv are cudaMemcpy across machines: explicit, message-shaped, YOURS to schedule.",{size:10.5,fill:C.dim});
    b += t(320,158,"srun -n4 launches 4 copies of the SAME program — rank ID branches the work (SPMD: 5.2's identity, process-scale).",{size:10,fill:C.accT});
    return svg(172,b,"mpi rank model");
  })();

  D["b5-aware"] = (() => {
    let b = t(320,22,"CUDA-aware MPI: hand it device pointers; GPUDirect skips the host",{bold:true,size:13});
    b += t(150,46,"staged (old world): 4 hops",{size:10,fill:C.badS});
    b += box(40,56,90,30) + t(85,76,"GPU 0",{size:9.5});
    b += box(150,56,90,30) + t(195,76,"host 0",{size:9.5});
    b += box(40,96,90,30) + t(85,116,"GPU 1",{size:9.5});
    b += box(150,96,90,30) + t(195,116,"host 1",{size:9.5});
    b += arrowR(130,71,146);                                   // GPU0 → host0
    b += ln(195,86,195,96,{sw:1.4}) + triD(195,96,{});          // host0 ↓ host1
    b += ln(146,111,134,111,{sw:1.4}) + triL(134,111,{});       // host1 → GPU1
    b += t(460,46,"GPUDirect RDMA: GPU → NIC → GPU",{size:10,fill:C.goodT});
    b += box(360,66,90,40,{fill:C.good,stroke:C.goodS}) + t(405,90,"GPU 0",{size:9.5,fill:C.goodT});
    b += box(510,66,90,40,{fill:C.good,stroke:C.goodS}) + t(555,90,"GPU 1",{size:9.5,fill:C.goodT});
    b += arrowR(450,86,506);
    b += t(320,152,"MPI_Send(d_ptr, …) just WORKS on CUDA-aware builds — the library stages or RDMAs as topology allows (4.6's",{size:10,fill:C.dim});
    b += t(320,170,"staging tax, deleted by the fabric). Verify the build supports it, or enjoy silent segfault archaeology (gotcha).",{size:10,fill:C.dim});
    return svg(184,b,"cuda aware mpi and gpudirect");
  })();

  D["b5-scaling"] = (() => {
    let b = t(320,22,"Weak vs strong scaling: two questions, two curves, one honest label",{bold:true,size:13});
    b += ln(80,160,80,44,{sw:1.2}) + ln(80,160,300,160,{sw:1.2});
    b += t(190,44,"STRONG: fixed problem",{size:9.5,fill:C.badS});
    b += ln(90,60,160,90,{stroke:C.badS,sw:2}) + ln(160,90,290,140,{stroke:C.badS,sw:2,dash:true});
    b += t(190,178,"ranks → (shards shrink, comm wins — Amdahl)",{size:8.5,fill:C.dim});
    b += ln(360,160,360,44,{sw:1.2}) + ln(360,160,580,160,{sw:1.2});
    b += t(470,44,"WEAK: problem grows with ranks",{size:9.5,fill:C.goodT});
    b += ln(370,60,570,74,{stroke:C.goodS,sw:2});
    b += t(470,178,"ranks → (efficiency ~flat if surface/volume holds)",{size:8.5,fill:C.dim});
    b += t(320,208,"B10's report shows BOTH, labeled — an unlabeled scaling graph is 5.9 P6's unlabeled benchmark, cluster edition.",{size:10.5,fill:C.dim});
    return svg(222,b,"weak versus strong scaling");
  })();

  /* ---------------- B6 ---------------- */
  D["b6-directives"] = (() => {
    let b = t(320,22,"Directives: annotate loops, the compiler writes 5.3's plumbing",{bold:true,size:13});
    b += box(40,46,280,110,{fill:C.acc,stroke:C.accS});
    b += t(180,66,"#pragma acc data copyin(a) copy(u)",{size:9.5,fill:C.accT});
    b += t(180,86,"#pragma acc parallel loop collapse(2)",{size:9.5,fill:C.accT});
    b += t(180,106,"for (i…) for (j…)",{size:9.5});
    b += t(180,126,"    u[i][j] = stencil(…);",{size:9.5});
    b += t(180,146,"— the loop is the kernel; data clauses = 5.3",{size:8.5,fill:C.dim});
    b += arrowR(320,100,368);
    b += box(372,46,238,110,{fill:C.good,stroke:C.goodS});
    b += t(491,70,"compiler emits:",{size:9.5,fill:C.goodT});
    b += t(491,92,"cudaMalloc + H2D (data region)",{size:9,fill:C.dim});
    b += t(491,110,"a kernel from the loop nest",{size:9,fill:C.dim});
    b += t(491,128,"D2H + free at region end",{size:9,fill:C.dim});
    b += t(320,180,"OpenACC (NVIDIA-centric) and OpenMP target offload (portable ambition) — same shape: WHAT parallel, WHERE data lives.",{size:10,fill:C.dim});
    return svg(194,b,"directive model openacc openmp");
  })();

  D["b6-map"] = (() => {
    let b = t(320,22,"Data clauses ARE 3.5's ownership table — get them wrong, pay 4.6 per loop",{bold:true,size:13});
    const r=(y,c,m,o={})=>box(40,y,220,24,o)+t(150,y+16,c,{size:9.5,fill:o.tf||C.tx})+t(450,y+16,m,{size:9.5,a:"middle",fill:C.dim});
    b += r(44,"copyin(a)","H2D once at region entry; read-only on device");
    b += r(74,"copy(u)","H2D at entry + D2H at exit — the round-trippers");
    b += r(104,"create(tmp)","device-only scratch: NEVER crosses (cheapest!)",{fill:C.good,stroke:C.goodS,tf:C.goodT});
    b += r(134,"present(a)","'already there — TRUST me' (and crash if not)",{fill:C.warnFill,stroke:C.warn,tf:C.warn});
    b += t(320,180,"The classic disaster: a data region MISSING → compiler copies everything EVERY loop iteration — 100× slowdowns that",{size:10,fill:C.dim});
    b += t(320,198,"profile as pure H2D/D2H (5.10's timeline finds it in one look; the fix is one pragma line).",{size:10,fill:C.dim});
    return svg(212,b,"openacc data clauses ownership");
  })();

  D["b6-ninety"] = (() => {
    let b = t(320,22,"The 90/10 honest curve: directives get most of it for a fraction of the code",{bold:true,size:13});
    b += ln(80,170,80,44,{sw:1.2}) + ln(80,170,600,170,{sw:1.2});
    b += t(40,105,"perf",{size:9.5,fill:C.dim}) + t(340,188,"effort (lines touched, expertise)",{size:9.5,fill:C.dim});
    b += ln(90,150,220,80,{stroke:C.goodS,sw:2.4}) ; b += t(180,64,"directives: ~80–90% quickly",{size:9.5,fill:C.goodT});
    b += ln(220,80,560,58,{stroke:C.accS,sw:2,dash:true}) ; b += t(470,44,"CUDA/Triton: the last 10–20%, paid in craft",{size:9.5,fill:C.accT});
    b += t(320,208,"For a 300k-line Fortran/C code, 'rewrite in CUDA' is fiction; directives are how real science moves — then profile,",{size:10,fill:C.dim});
    b += t(320,226,"and hand-tune ONLY the kernel the profile indicts (5.10's Amdahl discipline, applied to porting).",{size:10,fill:C.dim});
    return svg(240,b,"directives effort performance curve");
  })();

  /* ---------------- B7 ---------------- */
  D["b7-slurm"] = (() => {
    let b = t(320,22,"A job's life: sbatch → queue → allocation → srun ranks → files out",{bold:true,size:13});
    const st=(x,s1,s2,o={})=>box(x,50,112,52,o)+t(x+56,70,s1,{size:10,bold:true,fill:o.tf||C.tx})+t(x+56,88,s2,{size:8.5,fill:C.dim});
    b += st(20,"sbatch job.sh","asks: nodes, GPUs,");
    b += t(76,110,"time, partition",{size:8.5,fill:C.dim});
    b += arrowR(132,76,148);
    b += st(152,"queue","priority + backfill",{fill:C.warnFill,stroke:C.warn,tf:C.warn});
    b += arrowR(264,76,280);
    b += st(284,"allocation","your nodes, exclusive-ish",{fill:C.good,stroke:C.goodS,tf:C.goodT});
    b += arrowR(396,76,412);
    b += st(416,"srun -n R app","R ranks placed (B5)",{fill:C.acc,stroke:C.accS,tf:C.accT});
    b += ln(528,76,544,76,{sw:1.4}) + tri(544,76,{});
    b += box(548,50,72,52) + t(584,70,"results",{size:10}) + t(584,88,"to SCRATCH",{size:8.5,fill:C.dim});
    b += t(320,132,"#SBATCH --gres=gpu:4 --nodes=2 --time=04:00:00 — ask precisely: overask waits longer (backfill favors modest jobs),",{size:10,fill:C.dim});
    b += t(320,150,"underask gets killed at the wall. Checkpoint or lose the run (b7-checkpoint).",{size:10,fill:C.dim});
    return svg(164,b,"slurm job lifecycle");
  })();

  D["b7-modules"] = (() => {
    let b = t(320,22,"Two reproducibility tools: modules (the site's stack) vs Apptainer (yours)",{bold:true,size:13});
    b += box(40,46,270,96) + t(175,66,"module load gcc/13 cuda/13.2 openmpi/5",{size:9,fill:C.accT});
    b += t(175,86,"site-curated, MPI matched to the fabric,",{size:9,fill:C.dim});
    b += t(175,104,"changes under you at site upgrades",{size:9,fill:C.dim});
    b += t(175,124,"— fast start, weak portability",{size:9,fill:C.warn});
    b += box(330,46,280,96,{fill:C.good,stroke:C.goodS}) + t(470,66,"Apptainer container (.sif)",{size:10,bold:true,fill:C.goodT});
    b += t(470,86,"YOUR stack, byte-frozen, runs anywhere-ish;",{size:9,fill:C.dim});
    b += t(470,104,"host MPI/driver still injected at run (A10's",{size:9,fill:C.dim});
    b += t(470,122,"container law — the fabric stays the site's)",{size:9,fill:C.dim});
    b += t(320,166,"B8's reproducibility wants containers + recorded modules BOTH: the paper's methods section is an environment spec.",{size:10,fill:C.dim});
    return svg(180,b,"modules versus apptainer");
  })();

  D["b7-checkpoint"] = (() => {
    let b = t(320,22,"Checkpointing: preemption and walls are FEATURES you design for",{bold:true,size:13});
    b += ln(60,80,600,80,{sw:1.6});
    for (const x of [140, 260, 380, 500]) { b += ln(x,70,x,90,{stroke:C.goodS,sw:2.4}); b += t(x,64,"ckpt",{size:8.5,fill:C.goodT}); }
    b += ln(440,80,440,102,{stroke:C.badS,sw:2}) ; b += t(440,116,"KILLED (wall/preempt)",{size:9,fill:C.badS});
    b += ln(500,132,384,132,{sw:1.4,dash:true}) + triL(384,132,{}) ; b += t(444,148,"restart from ckpt 3 — lose minutes, not days",{size:9.5,fill:C.dim});
    b += t(320,178,"Interval arithmetic: overhead = write_time/interval; risk = interval/2 lost on kill — pick interval ≈ √(2·write·MTBF)",{size:10,fill:C.dim});
    b += t(320,196,"(Young's formula — an OPTIMIZATION, not paranoia). Cheap preemptible queues become free compute if restart is solid.",{size:10,fill:C.accT});
    return svg(210,b,"checkpoint restart timeline");
  })();

  /* ---------------- B8 ---------------- */
  D["b8-kahan"] = (() => {
    let b = t(320,22,"Compensated summation: carry the rounding error, add it back",{bold:true,size:13});
    b += box(40,46,280,110,{fill:C.acc,stroke:C.accS});
    b += t(180,68,"y = x[i] − c        // corrected input",{size:9.5,fill:C.accT});
    b += t(180,88,"t = s + y           // big + small",{size:9.5,fill:C.accT});
    b += t(180,108,"c = (t − s) − y   // what got LOST",{size:9.5,fill:C.warn});
    b += t(180,128,"s = t                // (algebraically c=0 —",{size:9.5,fill:C.accT});
    b += t(180,146,"     in floats it's the exact residue!)",{size:8.5,fill:C.dim});
    b += box(340,46,270,110,{fill:C.good,stroke:C.goodS});
    b += t(475,70,"measured, 1e7 fp32 uniforms:",{size:9.5,fill:C.goodT});
    b += t(475,92,"naive      5.2e-5   (O(n·eps))",{size:9.5});
    b += t(475,112,"pairwise  9.1e-8   (O(log n·eps))",{size:9.5});
    b += t(475,132,"Kahan     9.1e-9   (O(eps)-ish)",{size:9.5,fill:C.goodT});
    b += t(320,178,"4 flops instead of 1 buys ~4 decimal digits — and (t−s)−y only works because floats are DETERMINISTIC little",{size:10,fill:C.dim});
    b += t(320,196,"machines (M1 L8): the 'error' is computable. Compilers must not 'optimize' it away (gotcha: -ffast-math deletes Kahan!).",{size:10,fill:C.warn});
    return svg(210,b,"kahan compensated summation");
  })();

  D["b8-ulp"] = (() => {
    let b = t(320,22,"Error growth laws: the summation ladder (all measured)",{bold:true,size:13});
    const r=(y,s1,s2,o={})=>box(60,y,300,26,o)+t(210,y+17,s1,{size:9.5,fill:o.tf||C.tx})+t(480,y+17,s2,{size:9.5,a:"middle",fill:C.dim});
    b += r(44,"sequential naive: err ~ O(n·eps)","5.2e-5 at n=1e7 fp32",{fill:C.bad,stroke:C.badS,tf:C.badS});
    b += r(76,"pairwise tree: err ~ O(log n · eps)","9.1e-8 — numpy's default!");
    b += r(108,"Kahan compensated: err ~ O(eps)","9.1e-9 — 4× the adds",{fill:C.good,stroke:C.goodS,tf:C.goodT});
    b += r(140,"fp64 accumulator: eps 2e-16","the cheap sledgehammer",{fill:C.acc,stroke:C.accS,tf:C.accT});
    b += t(320,186,"Your 5.8 GPU tree reduction is pairwise BY CONSTRUCTION — parallelism accidentally bought accuracy (5.11 P3's bound).",{size:10,fill:C.dim});
    return svg(200,b,"summation error growth ladder");
  })();

  D["b8-repro"] = (() => {
    let b = t(320,22,"The reproducibility ladder: pick a rung ON PURPOSE, write it down",{bold:true,size:13});
    const r=(y,s1,s2,o={})=>box(50,y,330,26,o)+t(215,y+17,s1,{size:9.5,fill:o.tf||C.tx})+t(495,y+17,s2,{size:9,a:"middle",fill:C.dim});
    b += r(44,"bitwise, same config (fixed order, seeds, flags)","replay/debug runs",{fill:C.good,stroke:C.goodS,tf:C.goodT});
    b += r(76,"bitwise across rank counts","costly: fixed reduction trees",{fill:C.warnFill,stroke:C.warn,tf:C.warn});
    b += r(108,"statistical: within σ-budget, documented","most science lives here",{fill:C.acc,stroke:C.accS,tf:C.accT});
    b += r(140,"'it looked similar' — not a rung","retracted papers live here",{fill:C.bad,stroke:C.badS,tf:C.badS});
    b += t(320,186,"Different rank counts = different reduction orders = different bits (5.8/A7 §2) — LEGITIMATE, if the budget says so",{size:10,fill:C.dim});
    b += t(320,204,"in writing. The methods section is a numerics contract (B10 ships one).",{size:10,fill:C.accT});
    return svg(218,b,"reproducibility ladder");
  })();

  /* ---------------- B9 ---------------- */
  D["b9-thrust"] = (() => {
    let b = t(320,22,"Thrust → CUB → raw: the abstraction ladder for building blocks",{bold:true,size:13});
    const r=(y,s1,s2,o={})=>box(60,y,330,26,o)+t(225,y+17,s1,{size:9.5,fill:o.tf||C.tx})+t(505,y+17,s2,{size:9,a:"middle",fill:C.dim});
    b += r(44,"thrust::sort / reduce / scan (one-liners)","STL for GPUs — start here",{fill:C.good,stroke:C.goodS,tf:C.goodT});
    b += r(76,"CUB device/block primitives","5.8's ladder, vendor-tuned",{fill:C.acc,stroke:C.accS,tf:C.accT});
    b += r(108,"your kernels calling cub::BlockReduce","compose inside YOUR kernel");
    b += r(140,"raw warp shuffles (5.8)","when you must own everything",{fill:C.warnFill,stroke:C.warn,tf:C.warn});
    b += t(320,186,"scan (prefix sum) is the primitive you could NOT build in 5.8's model (P1e's obstruction) — CUB ships decoupled-",{size:10,fill:C.dim});
    b += t(320,204,"lookback; stream compaction, sorting, histograms all reduce to it. Know what it IS, buy the implementation.",{size:10,fill:C.dim});
    return svg(218,b,"thrust cub abstraction ladder");
  })();

  D["b9-fft"] = (() => {
    let b = t(320,22,"cuFFT: plans are expensive, executions are cheap — 5.3's alloc-once law",{bold:true,size:13});
    b += box(40,46,180,60,{fill:C.warnFill,stroke:C.warn}) + t(130,68,"cufftPlanMany(…)",{size:10,bold:true,fill:C.warn}) + t(130,88,"ONCE: picks algorithms,",{size:8.5,fill:C.dim});
    b += t(130,100,"allocates workspace",{size:8.5,fill:C.dim});
    b += arrowR(220,76,266);
    b += box(270,46,180,60,{fill:C.good,stroke:C.goodS}) + t(360,68,"cufftExec…(plan)",{size:10,bold:true,fill:C.goodT}) + t(360,88,"thousands of times,",{size:8.5,fill:C.dim});
    b += t(360,100,"on YOUR stream (5.9)",{size:8.5,fill:C.dim});
    b += box(470,46,150,60,{fill:C.acc,stroke:C.accS}) + t(545,68,"batch dim",{size:10,bold:true,fill:C.accT}) + t(545,88,"1000 small FFTs =",{size:8.5,fill:C.dim});
    b += t(545,100,"ONE call (5.2's floor)",{size:8.5,fill:C.dim});
    b += t(320,130,"O(N log N) beats O(N²) measured: 0.1 ms FFT vs 60 ms naive DFT at n=8192 (600×) — M1's logs, cashing out.",{size:10.5,fill:C.dim});
    b += t(320,150,"Layout matters: batched/strided plans read M2 L5's strides — plan FOR your layout, don't transpose around it.",{size:10.5,fill:C.dim});
    return svg(164,b,"cufft plan execute batch");
  })();

  D["b9-parseval"] = (() => {
    let b = t(320,22,"Fixtures for transforms: mathematics supplies the oracle",{bold:true,size:13});
    const r=(y,s1,s2,o={})=>box(50,y,330,26,o)+t(215,y+17,s1,{size:9.5,fill:o.tf||C.tx})+t(500,y+17,s2,{size:9,a:"middle",fill:C.dim});
    b += r(44,"Parseval: Σ|x|² == Σ|X|²/N (verified ✓)","energy conservation");
    b += r(76,"round-trip: ifft(fft(x)) ≈ x within budget","the plumbing test",{fill:C.good,stroke:C.goodS,tf:C.goodT});
    b += r(108,"known pairs: delta→flat, sine→two spikes","analytic ground truth",{fill:C.acc,stroke:C.accS,tf:C.accT});
    b += r(140,"linearity: fft(ax+by) == a·fft(x)+b·fft(y)","catches scaling bugs");
    b += t(320,184,"Every numerical library gets fixture-wrapped before first use (M2 L6): you're not testing cuFFT — you're testing",{size:10,fill:C.dim});
    b += t(320,202,"YOUR strides, scaling conventions (1/N where?), and dtype plumbing around it. That's where the bugs are.",{size:10,fill:C.dim});
    return svg(216,b,"fft fixture suite parseval");
  })();

  /* ---------------- B10 ---------------- */
  D["b10-heat"] = (() => {
    let b = t(320,22,"Capstone: 2D heat equation — physics with a known answer",{bold:true,size:13});
    b += box(200,44,240,120,{fill:C.acc,stroke:C.accS});
    for (let i=0;i<5;i++) for (let j=0;j<3;j++) b += box(216+i*44, 58+j*32, 36, 24, {fill:C.box,stroke:C.boxS});
    b += t(320,180,"u(t+dt) = u + α·dt/h²·(4-neighbor sum − 4u)   — b3-stencil, iterated",{size:10.5});
    b += t(320,200,"fixtures the PHYSICS gives you: total heat conserved (insulated) · Gaussian spreads with known σ(t) —",{size:10,fill:C.dim});
    b += t(320,218,"analytic solution! · steady state matches Laplace · CFL stability wall dt ≤ h²/4α (b1-euler's wall, in 2D)",{size:10,fill:C.dim});
    return svg(232,b,"heat equation capstone");
  })();

  D["b10-ladder"] = (() => {
    let b = t(320,22,"The capstone ladder: serial oracle → one GPU → many nodes",{bold:true,size:13});
    const r=(y,s1,s2,o={})=>box(50,y,360,26,o)+t(230,y+17,s1,{size:9.5,fill:o.tf||C.tx})+t(520,y+17,s2,{size:9,a:"middle",fill:C.dim});
    b += r(44,"r0 NumPy/C serial — the oracle + fixtures","hours of compute, gold");
    b += r(76,"r1 single GPU: tiled stencil kernel (5.5/B3)","~50–100× (bandwidth-bound)",{fill:C.good,stroke:C.goodS,tf:C.goodT});
    b += r(108,"r2 overlapped halos: interior ∥ exchange (5.9/B5)","hides comm under compute",{fill:C.acc,stroke:C.accS,tf:C.accT});
    b += r(140,"r3 multi-node MPI: weak-scaling study (B5/B7)","efficiency table, labeled",{fill:C.acc,stroke:C.accS,tf:C.accT});
    b += r(172,"r4 the report: repro pack + numerics contract (B8)","the actual deliverable",{fill:C.warnFill,stroke:C.warn,tf:C.warn});
    b += t(320,218,"Same shape as 5.11 and A11: rungs, predictions-first, fixtures — the third climb of the same mountain, on purpose.",{size:10,fill:C.dim});
    return svg(232,b,"capstone ladder serial to cluster");
  })();

  D["b10-report"] = (() => {
    let b = t(320,22,"The scaling report: what reviewers (and bosses) actually check",{bold:true,size:13});
    const r=(y,s1,o={})=>box(60,y,520,24,o)+t(320,y+16,s1,{size:9.5,fill:o.tf||C.tx});
    b += r(44,"machine + environment spec: modules, container hash, flags (B7/B8)");
    b += r(74,"correctness evidence: analytic fixtures + conservation ledgers, per scale",{fill:C.good,stroke:C.goodS,tf:C.goodT});
    b += r(104,"weak AND strong curves, labeled, with the comm/compute two-lane model overlaid (A7)",{fill:C.acc,stroke:C.accS,tf:C.accT});
    b += r(134,"efficiency table + WHERE the lost % went (measured, not shrugged — 4.7's gap law)",{fill:C.warnFill,stroke:C.warn,tf:C.warn});
    b += r(164,"numerics contract: reproducibility rung + budgets (b8-repro)");
    b += t(320,208,"'94% weak-scaling efficiency at 64 GPUs, losses attributed: 4% halo latency, 2% imbalance' — one sentence, five lessons.",{size:10,fill:C.dim});
    return svg(222,b,"scaling report anatomy");
  })();

  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, D);
})();

/* GPU Mastery — Track A diagram pack. Registers SVGs on window.DIAGRAMS. */
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
  const triD=(x,y,o={})=>`<polygon points="${x-4},${y-7} ${x},${y} ${x+4},${y-7}" style="fill:${o.stroke||C.line}"/>`;
  const triL=(x,y,o={})=>`<polygon points="${x+7},${y-4} ${x},${y} ${x+7},${y+4}" style="fill:${o.stroke||C.line}"/>`;
  const triU=(x,y,o={})=>`<polygon points="${x-4},${y+7} ${x},${y} ${x+4},${y+7}" style="fill:${o.stroke||C.line}"/>`;
  const arrowR=(x1,y,x2,o={})=>ln(x1,y,x2,y,o)+tri(x2,y,o);
  const svg=(h,body,label)=>`<svg viewBox="0 0 640 ${h}" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="640" height="${h}" rx="10" style="fill:${C.card}"/>${body}</svg>`;
  const D = {};

  /* ---------------- A1 ---------------- */
  D["a1-graph"] = (() => {
    let b = t(320,22,"A computation graph: forward computes values, backward walks it in reverse",{bold:true,size:13});
    const n=(x,y,s,o={})=>box(x,y,86,32,o)+t(x+43,y+21,s,{size:11,fill:o.tf||C.tx});
    b += n(30,52,"x") + n(30,104,"w") + n(170,78,"z = w·x",{fill:C.acc,stroke:C.accS,tf:C.accT});
    b += n(310,78,"a = relu(z)",{fill:C.acc,stroke:C.accS,tf:C.accT}) + n(450,78,"L = (a−y)²",{fill:C.warnFill,stroke:C.warn,tf:C.warn});
    b += ln(116,68,170,90,{sw:1.3}) + ln(116,120,170,102,{sw:1.3});
    b += arrowR(256,94,306) + arrowR(396,94,446);
    b += t(320,140,"FORWARD →  each node stores what backward will need (z's sign, a−y)",{size:10.5,fill:C.goodT});
    b += ln(446,162,396,162,{stroke:C.badS,sw:1.7}) + triL(396,162,{stroke:C.badS});
    b += ln(306,162,256,162,{stroke:C.badS,sw:1.7}) + triL(256,162,{stroke:C.badS});
    b += t(320,186,"← BACKWARD  dL/da = 2(a−y) · da/dz = 1[z>0] · dz/dw = x  — multiply along the path",{size:10.5,fill:C.badS});
    b += t(320,208,"Backprop = the chain rule + memoization: each edge's local derivative, multiplied path-wise, summed over paths.",{size:10.5,fill:C.dim});
    return svg(222,b,"computation graph forward and backward passes");
  })();

  D["a1-chain"] = (() => {
    let b = t(320,22,"The chain rule is bookkeeping: local slopes multiply along the pipe",{bold:true,size:13});
    const st=(x,l1,l2)=>box(x,50,130,46)+t(x+65,70,l1,{size:11,bold:true})+t(x+65,88,l2,{size:9.5,fill:C.dim});
    b += st(30,"u = 3x","du/dx = 3") ; b += arrowR(160,73,196);
    b += st(200,"v = u²","dv/du = 2u"); b += arrowR(330,73,366);
    b += st(370,"y = sin v","dy/dv = cos v");
    b += box(520,50,96,46,{fill:C.good,stroke:C.goodS}) + t(568,70,"dy/dx",{size:11,bold:true,fill:C.goodT}) + t(568,88,"= 3·2u·cos v",{size:9.5,fill:C.goodT});
    b += ln(500,73,520,73,{sw:1.3});
    b += t(320,124,"A 1% nudge in x becomes 3% in u, ×2u% in v, ×cos v in y — slopes are exchange rates; chains multiply them.",{size:10.5,fill:C.dim});
    b += t(320,144,"Backward pass = computing the product right-to-left, reusing each stage's stored value (M1 Σ discipline).",{size:10.5,fill:C.accT});
    return svg(158,b,"chain rule as multiplying local slopes");
  })();

  D["a1-fdcheck"] = (() => {
    let b = t(320,22,"Trust ladder for YOUR gradient: analytic vs finite-difference (M1 L7's ritual)",{bold:true,size:13});
    b += box(30,46,180,60) + t(120,68,"analytic dL/dw",{size:11,bold:true}) + t(120,86,"your backprop code",{size:9.5,fill:C.dim});
    b += box(230,46,200,60) + t(330,68,"numeric ≈ (L(w+h)−L(w−h))/2h",{size:10,bold:true}) + t(330,86,"central diff, h ≈ 1e-5 (fp64!)",{size:9.5,fill:C.dim});
    b += box(450,46,166,60,{fill:C.good,stroke:C.goodS}) + t(533,68,"rel-err < 1e-6 ?",{size:11,bold:true,fill:C.goodT}) + t(533,86,"then backward is right",{size:9.5,fill:C.dim});
    b += ln(210,76,230,76,{sw:1.3}) + ln(430,76,450,76,{sw:1.3});
    b += t(320,132,"h too big → truncation error grows (O(h²)); h too small → fp cancellation eats digits (M1 L8).",{size:10.5,fill:C.warn});
    b += t(320,152,"The dip between the two error regimes is where you check. torch.autograd.gradcheck automates exactly this.",{size:10.5,fill:C.dim});
    return svg(166,b,"finite difference gradient check");
  })();

  /* ---------------- A2 ---------------- */
  D["a2-tensor"] = (() => {
    let b = t(320,22,"A torch.Tensor IS M2 L5's model: storage + strides + dtype + device",{bold:true,size:13});
    b += box(30,46,150,110,{fill:C.acc,stroke:C.accS}) + t(105,66,"Tensor header",{size:11,bold:true,fill:C.accT});
    b += t(105,86,"shape (2, 3)",{size:10}) + t(105,104,"strides (3, 1)",{size:10}) + t(105,122,"dtype float32",{size:10}) + t(105,140,"device cuda:0",{size:10});
    b += arrowR(180,100,230);
    b += box(234,72,270,56) + t(369,92,"Storage: one flat buffer",{size:11,bold:true});
    for (let i=0;i<6;i++) b += box(244+i*42,100,38,20,{fill:C.good,stroke:C.goodS}) + t(263+i*42,114,String(i),{size:9.5,fill:C.goodT});
    b += t(369,146,"on cuda:0 = a cudaMalloc'd region (5.3's world)",{size:9.5,fill:C.dim});
    b += box(520,72,96,56,{fill:C.warnFill,stroke:C.warn}) + t(568,94,".t() / [::2]",{size:10.5,bold:true,fill:C.warn}) + t(568,112,"new header,",{size:9.5,fill:C.dim}) + t(568,124,"SAME storage",{size:9.5,fill:C.dim});
    b += ln(520,100,504,100,{sw:1.3,dash:true});
    b += t(320,178,"Views = new strides on old bytes (M2 L5 verbatim). .contiguous() materializes — and kernels often demand it.",{size:10.5,fill:C.dim});
    return svg(192,b,"pytorch tensor as header plus storage");
  })();

  D["a2-autograd"] = (() => {
    let b = t(320,22,"Autograd: forward RECORDS a tape; .backward() REPLAYS it reversed",{bold:true,size:13});
    b += t(320,44,"y = (w*x).relu().sum()   — three ops, three tape nodes",{size:10.5,fill:C.dim});
    const n=(x,s)=>box(x,58,130,36)+t(x+65,80,s,{size:10.5});
    b += n(40,"MulBackward") + arrowR(170,76,206) + n(210,"ReluBackward") + arrowR(340,76,376) + n(380,"SumBackward");
    b += box(530,58,86,36,{fill:C.warnFill,stroke:C.warn}) + t(573,80,"loss.grad_fn",{size:9.5,fill:C.warn});
    b += ln(510,76,530,76,{sw:1.3});
    b += t(320,120,".backward(): walk grad_fn chain right→left, each node multiplies by its local Jacobian (a1-graph, automated)",{size:10.5,fill:C.badS});
    b += t(320,142,"requires_grad=True opts a leaf in · .detach() cuts the tape · no_grad() stops recording (inference mode).",{size:10.5,fill:C.dim});
    b += t(320,162,"Grads ACCUMULATE into .grad (+=, by design, for shared params) — hence optimizer.zero_grad() every step.",{size:10.5,fill:C.accT});
    return svg(176,b,"autograd tape recording and reversal");
  })();

  D["a2-dispatch"] = (() => {
    let b = t(320,22,"The dispatcher: one torch.matmul, many kernels — routed by (device, dtype, layout)",{bold:true,size:13});
    b += box(30,50,140,40,{fill:C.acc,stroke:C.accS}) + t(100,75,"torch.matmul(a,b)",{size:10.5,fill:C.accT});
    b += arrowR(170,70,216);
    b += box(220,50,150,40) + t(295,68,"dispatcher",{size:11,bold:true}) + t(295,83,"keys: device·dtype·grad",{size:8.5,fill:C.dim});
    b += ln(370,70,410,58,{sw:1.3}) + ln(370,70,410,104,{sw:1.3}) + ln(370,70,410,150,{sw:1.3});
    b += box(414,42,200,32,{fill:C.good,stroke:C.goodS}) + t(514,62,"CUDA fp16 → cuBLAS/TC path",{size:9.5,fill:C.goodT});
    b += box(414,88,200,32,{fill:C.good,stroke:C.goodS}) + t(514,108,"CUDA fp32 → cuBLAS sgemm",{size:9.5,fill:C.goodT});
    b += box(414,134,200,32) + t(514,154,"CPU → MKL/oneDNN",{size:9.5});
    b += t(210,120,"autograd is a dispatch LAYER too:",{size:9.5,fill:C.dim,a:"start"});
    b += t(210,136,"grad-tracking wraps the kernel call",{size:9.5,fill:C.dim,a:"start"});
    b += t(320,192,"Why you care: 'my op is slow' debugging = finding WHICH kernel dispatched (profiler shows the real name, 5.10).",{size:10.5,fill:C.dim});
    return svg(206,b,"pytorch dispatcher routing to kernels");
  })();

  /* ---------------- A3 ---------------- */
  D["a3-bind"] = (() => {
    let b = t(320,22,"A custom op's journey: Python → binding → your 5.x CUDA → autograd",{bold:true,size:13});
    const n=(x,s1,s2,o={})=>box(x,50,138,50,o)+t(x+69,70,s1,{size:10.5,bold:true,fill:o.tf||C.tx})+t(x+69,88,s2,{size:9,fill:C.dim});
    b += n(30,"my_op(x)","python call");
    b += arrowR(168,75,200);
    b += n(204,"C++ binding","TORCH_LIBRARY / pybind");
    b += arrowR(342,75,374);
    b += n(378,"your kernel<<<>>>","5.2–5.8, unchanged",{fill:C.good,stroke:C.goodS,tf:C.goodT});
    b += box(546,50,70,50,{fill:C.warnFill,stroke:C.warn}) + t(581,70,"stream",{size:10,fill:C.warn}) + t(581,88,"passed IN",{size:9,fill:C.dim});
    b += ln(516,75,546,75,{sw:1.3,dash:true});
    b += t(320,126,"The binding's real jobs: check shapes/dtypes/contiguity (3.3's contracts), get the current stream (5.9's law),",{size:10.5,fill:C.dim});
    b += t(320,146,"and register a backward so autograd can tape it (a2). The kernel itself is Module 5 — nothing new down there.",{size:10.5,fill:C.accT});
    return svg(160,b,"custom op binding flow");
  })();

  D["a3-gradcheck"] = (() => {
    let b = t(320,22,"The op fixture pyramid (M2 L6's constitution, torch edition)",{bold:true,size:13});
    b += box(180,44,280,30,{fill:C.warnFill,stroke:C.warn}) + t(320,63,"gradcheck (fp64): backward == numeric Jacobian",{size:9.5,fill:C.warn});
    b += box(140,82,360,30,{fill:C.good,stroke:C.goodS}) + t(320,101,"forward vs torch reference (budget: rtol per dtype — M1 L8)",{size:9.5,fill:C.goodT});
    b += box(100,120,440,30) + t(320,139,"shape/edge cases: empty, 1-elem, non-contiguous input, odd sizes (5.2's kit)",{size:9.5});
    b += box(60,158,520,30,{fill:C.acc,stroke:C.accS}) + t(320,177,"plumbing: device/dtype guards reject bad calls LOUDLY (3.3 asserts — the binding's contract)",{size:9.5,fill:C.accT});
    b += t(320,210,"Run bottom-up. gradcheck in fp64 because fp32 finite differences drown in noise (a1-fdcheck's dip).",{size:10.5,fill:C.dim});
    return svg(224,b,"custom op test pyramid");
  })();

  D["a3-contig"] = (() => {
    let b = t(320,22,"The contiguity trap: your kernel assumes dense rows; views lie about that",{bold:true,size:13});
    b += t(160,46,"x = torch.randn(4, 8)[:, ::2]   — a stride trick, not a copy",{size:10,fill:C.dim});
    for (let i=0;i<8;i++) b += box(36+i*44,58,40,24,{fill: i%2? C.box : C.good, stroke: i%2? C.boxS : C.goodS}) + t(56+i*44,74,String(i),{size:9.5,fill:i%2?C.dim:C.goodT});
    b += t(160,102,"logical row = every OTHER element (stride 2)",{size:9.5,fill:C.dim});
    b += box(408,52,208,56,{fill:C.bad,stroke:C.badS}) + t(512,72,"kernel indexes i = row*W + col",{size:10,fill:C.badS}) + t(512,90,"→ reads the SKIPPED bytes too",{size:9.5,fill:C.dim});
    b += t(320,132,"Fix menu: x.contiguous() (copy — honest cost), or accept strides as kernel args (cuBLAS's lda — 4.2 P3),",{size:10.5,fill:C.dim});
    b += t(320,152,"or TORCH_CHECK(x.is_contiguous()) and refuse (3.3's contract). Choosing SILENTLY WRONG is not on the menu.",{size:10.5,fill:C.warn});
    return svg(166,b,"contiguity trap for custom kernels");
  })();

  /* ---------------- A4 ---------------- */
  D["a4-model"] = (() => {
    let b = t(320,22,"Triton's unit is the PROGRAM (one tile), not the thread (one element)",{bold:true,size:13});
    b += t(160,44,"CUDA (5.2): you write ONE THREAD",{size:10.5,fill:C.accT});
    b += box(40,54,240,54,{fill:C.acc,stroke:C.accS});
    b += t(160,74,"i = blockIdx*bdim + threadIdx",{size:9.5}) + t(160,92,"if (i<n) y[i] = a*x[i]+y[i]",{size:9.5});
    b += t(480,44,"Triton: you write ONE TILE",{size:10.5,fill:C.goodT});
    b += box(360,54,240,54,{fill:C.good,stroke:C.goodS});
    b += t(480,74,"offs = pid*BLOCK + arange(0,BLOCK)",{size:9.5}) + t(480,92,"tl.store(y+offs, a*tl.load(x+offs)…)",{size:9.5});
    b += t(320,130,"The compiler chooses threads/warps/vectorization INSIDE your tile (5.6's dial, auto-tuned).",{size:10.5,fill:C.dim});
    b += t(320,150,"Mapping: program_id ↔ blockIdx · BLOCK_SIZE ↔ tile (5.5) · mask ↔ the guard (5.2) · num_warps ↔ occupancy knob.",{size:10.5,fill:C.dim});
    return svg(164,b,"triton program model vs cuda thread model");
  })();

  D["a4-mask"] = (() => {
    let b = t(320,22,"The mask IS 5.2's guard, vectorized",{bold:true,size:13});
    b += t(320,44,"n = 10, BLOCK = 4 → program 2 covers offs = 8,9,10,11",{size:10.5,fill:C.dim});
    const cells=[8,9,10,11];
    for (let i=0;i<4;i++){ const ok = cells[i]<10;
      b += box(180+i*72,56,64,30,{fill: ok?C.good:C.bad, stroke: ok?C.goodS:C.badS}) + t(212+i*72,76,String(cells[i]),{size:10.5,fill:ok?C.goodT:C.badS}); }
    b += t(320,108,"mask = offs < n  →  [T, T, F, F]",{size:10.5,bold:true});
    b += t(320,128,"tl.load(ptr+offs, mask, other=0.0): lanes F read NOTHING (no OOB — 5.4's sanitizer stays quiet)",{size:10.5,fill:C.dim});
    b += t(320,148,"tl.store(..., mask): lanes F write nothing. Same tail, same law, one line — and it also zero-fills 5.5-style edges.",{size:10.5,fill:C.dim});
    return svg(162,b,"triton mask as vectorized guard");
  })();

  D["a4-autotune"] = (() => {
    let b = t(320,22,"@triton.autotune: 5.6's knob-turning ritual, mechanized per (shape, GPU)",{bold:true,size:13});
    b += box(30,46,160,46) + t(110,64,"configs list",{size:10.5,bold:true}) + t(110,82,"BLOCK, num_warps, stages",{size:9,fill:C.dim});
    b += arrowR(190,69,226);
    b += box(230,46,160,46,{fill:C.acc,stroke:C.accS}) + t(310,64,"benchmark each",{size:10.5,bold:true,fill:C.accT}) + t(310,82,"on first call (key=shape)",{size:9,fill:C.dim});
    b += arrowR(390,69,426);
    b += box(430,46,186,46,{fill:C.good,stroke:C.goodS}) + t(523,64,"cache winner",{size:10.5,bold:true,fill:C.goodT}) + t(523,82,"reused for that key",{size:9,fill:C.dim});
    b += t(320,116,"Why it exists: the best tile/warp config differs per GPU and per shape (5.6 Ex.2 taught you why by hand).",{size:10.5,fill:C.dim});
    b += t(320,136,"First call per key is SLOW (it IS the benchmark) — warm up before timing, or you time the tuner (M1 L7).",{size:10.5,fill:C.warn});
    return svg(150,b,"triton autotune loop");
  })();

  /* ---------------- A5 ---------------- */
  D["a5-unfused"] = (() => {
    let b = t(320,22,"Unfused softmax: 5 HBM round-trips for 1 read's worth of math",{bold:true,size:13});
    const row=(y,s,col)=>box(40,y,430,26)+t(255,y+17,s,{size:9.5,fill:col||C.tx})+t(540,y+17,"read+write N",{size:9,fill:C.badS});
    b += row(44,"m = max(x)                      pass 1");
    b += row(76,"e = exp(x − m)                pass 2");
    b += row(108,"s = sum(e)                      pass 3");
    b += row(140,"y = e / s                         pass 4  (+ the loss reads it again: 5)");
    b += t(320,190,"AI ≈ 0.2 FLOP/B — deep in 4.7's memory cellar. The FLOPs are free; the TRIPS are the bill (4.6).",{size:10.5,fill:C.warn});
    b += t(320,210,"Fusion = one kernel holds the row in registers/smem, does all passes, writes once. Traffic ÷ ~4.",{size:10.5,fill:C.goodT});
    return svg(224,b,"unfused softmax memory traffic");
  })();

  D["a5-online"] = (() => {
    let b = t(320,22,"Online softmax: running (max, sum) lets ONE pass replace two",{bold:true,size:13});
    b += t(320,44,"stream chunks; keep m (running max) and s (running Σe^{x−m}); on new max, RESCALE s by e^{m_old−m_new}",{size:10,fill:C.dim});
    const st=(x,l1,l2,o={})=>box(x,58,180,52,o)+t(x+90,78,l1,{size:10,bold:true,fill:o.tf||C.tx})+t(x+90,96,l2,{size:9,fill:C.dim});
    b += st(24,"chunk arrives","new_m = max(m, max(chunk))");
    b += arrowR(204,84,236);
    b += st(240,"rescale history","s *= exp(m − new_m)",{fill:C.warnFill,stroke:C.warn,tf:C.warn});
    b += arrowR(420,84,452);
    b += st(456,"accumulate","s += Σ exp(chunk − new_m)",{fill:C.good,stroke:C.goodS,tf:C.goodT});
    b += ln(546,110,120,130,{sw:1.2,dash:true}) ; b += t(320,144,"↻ next chunk",{size:9.5,fill:C.dim});
    b += t(320,166,"Max-subtraction is M1 L8's overflow shield; the rescale makes it STREAMABLE — FlashAttention's core trick.",{size:10.5,fill:C.accT});
    return svg(180,b,"online softmax running max and sum");
  })();

  D["a5-flash"] = (() => {
    let b = t(320,22,"FlashAttention = 5.5's tiling on attention: O(N²) HBM traffic → O(N)",{bold:true,size:13});
    b += t(150,44,"naive: materialize S = QKᵀ (N×N!)",{size:10,fill:C.badS});
    b += box(40,52,90,90,{fill:C.bad,stroke:C.badS}) + t(85,100,"N² scores",{size:9.5,fill:C.badS}) + t(85,116,"to HBM & back",{size:8.5,fill:C.dim});
    b += t(430,44,"flash: tile K/V through SRAM, online-softmax the scores, never store S",{size:10,fill:C.goodT});
    b += box(300,52,64,90,{fill:C.acc,stroke:C.accS}) + t(332,100,"Q tile",{size:9.5,fill:C.accT});
    for (let i=0;i<3;i++) b += box(380+i*74,52,64,40,{fill:C.good,stroke:C.goodS}) + t(412+i*74,77,"K/V "+(i+1),{size:9.5,fill:C.goodT});
    b += arrowR(364,72,376) + arrowR(444,72,454) + arrowR(518,72,528);
    b += box(380,102,212,40,{fill:C.warnFill,stroke:C.warn}) + t(486,120,"running (m, s, O) rescale",{size:9.5,fill:C.warn}) + t(486,134,"a5-online, per tile pair",{size:8,fill:C.dim});
    b += t(320,166,"Same FLOPs. Traffic: N² → N·(reads of Q,K,V,O). Memory-bound → compute-bound: the roofline MOVE (4.7),",{size:10.5,fill:C.dim});
    b += t(320,186,"bought with 5.5's exact tools: tiles in SRAM + an algebraic identity that makes tiling LEGAL for softmax.",{size:10.5,fill:C.accT});
    return svg(200,b,"flashattention tiling structure");
  })();

  /* ---------------- A6 ---------------- */
  D["a6-formats"] = (() => {
    let b = t(320,22,"The precision menu: where the bits go (M1 L8's table, grown up)",{bold:true,size:13});
    const fmt=(y,name,s,e,m,note,col)=>{ b += t(80,y+15,name,{size:10.5,bold:true,a:"start",fill:col||C.tx});
      let x=170; b += box(x,y,16,20,{fill:C.bad,stroke:C.badS}); x+=16;
      b += box(x,y,e*9,20,{fill:C.acc,stroke:C.accS}) + t(x+e*4.5,y+14,String(e),{size:9,fill:C.accT}); x+=e*9;
      b += box(x,y,m*4.5,20,{fill:C.good,stroke:C.goodS}) + t(x+m*2.25,y+14,String(m),{size:9,fill:C.goodT}); x+=m*4.5;
      b += t(x+12,y+14,note,{size:9,a:"start",fill:C.dim}); };
    fmt(44,"fp32",1,8,23,"the reference");
    fmt(72,"tf32",1,8,10,"fp32 range, 10-bit mantissa — Ampere+ TC default");
    fmt(100,"bf16",1,8,7,"fp32 RANGE, chopped precision — training's friend");
    fmt(128,"fp16",1,5,10,"more precision, TINY range → needs loss scaling",C.warn);
    fmt(156,"fp8 e4m3",1,4,3,"Hopper+: weights/activations");
    fmt(184,"fp8 e5m2",1,5,2,"Hopper+: gradients (range > precision)");
    b += t(320,222,"sign | exponent = RANGE | mantissa = PRECISION. Every format is a budget decision (M1 L8) — and",{size:10.5,fill:C.dim});
    b += t(320,240,"the accumulate-in-fp32 law (5.11) holds for ALL of them: narrow storage, wide sums.",{size:10.5,fill:C.accT});
    return svg(254,b,"floating point format bit layouts");
  })();

  D["a6-scale"] = (() => {
    let b = t(320,22,"Loss scaling: shifting gradients into fp16's tiny window",{bold:true,size:13});
    b += box(40,46,250,30,{fill:C.bad,stroke:C.badS}) + t(165,65,"grads below 2⁻²⁴ ≈ 6e-8 flush to 0 in fp16",{size:9.5,fill:C.badS});
    b += t(320,90,"×S (e.g. 2¹⁶) before backward → grads live in representable range → ÷S before the optimizer step",{size:10.5});
    b += box(40,106,170,40,{fill:C.acc,stroke:C.accS}) + t(125,124,"loss × S",{size:10.5,fill:C.accT}) + t(125,138,"backward in fp16",{size:8.5,fill:C.dim});
    b += arrowR(210,126,246);
    b += box(250,106,170,40) + t(335,124,"unscale ÷ S",{size:10.5}) + t(335,138,"check for inf/nan",{size:8.5,fill:C.dim});
    b += arrowR(420,126,456);
    b += box(460,106,156,40,{fill:C.good,stroke:C.goodS}) + t(538,124,"step (fp32 master)",{size:10,fill:C.goodT}) + t(538,138,"or skip + shrink S",{size:8.5,fill:C.dim});
    b += t(320,170,"DYNAMIC scaling: grow S until overflow appears, then back off — the autotuner of numerics (torch.amp does this).",{size:10.5,fill:C.dim});
    b += t(320,190,"bf16 mostly retires this machinery (same range as fp32) — which is WHY training moved to bf16.",{size:10.5,fill:C.goodT});
    return svg(204,b,"loss scaling loop");
  })();

  D["a6-tc"] = (() => {
    let b = t(320,22,"A Tensor Core consumes TILES (e.g. 16×16), not scalars — shapes must feed it",{bold:true,size:13});
    b += box(60,50,90,90,{fill:C.acc,stroke:C.accS}) + t(105,98,"A 16×16",{size:10,fill:C.accT});
    b += t(170,98,"×",{size:14,bold:true});
    b += box(190,50,90,90,{fill:C.acc,stroke:C.accS}) + t(235,98,"B 16×16",{size:10,fill:C.accT});
    b += t(300,98,"+",{size:14,bold:true});
    b += box(320,50,90,90) + t(365,98,"C fp32",{size:10});
    b += arrowR(410,95,450);
    b += box(454,50,150,90,{fill:C.good,stroke:C.goodS}) + t(529,88,"ONE instruction",{size:10.5,bold:true,fill:C.goodT}) + t(529,106,"~a full warp's worth",{size:9,fill:C.dim}) + t(529,120,"of FMAs per cycle",{size:9,fill:C.dim});
    b += t(320,166,"Why dims 'multiple of 8/16' matter: ragged shapes fall off the TC path to plain CUDA cores (4–8× slower) —",{size:10.5,fill:C.warn});
    b += t(320,186,"padding 1000→1024 can be a net WIN (5.7 P2's pitch logic). Inputs fp16/bf16, accumulate fp32 (5.11's law).",{size:10.5,fill:C.dim});
    return svg(200,b,"tensor core tile consumption");
  })();

  /* ---------------- A7 ---------------- */
  D["a7-ring"] = (() => {
    let b = t(320,22,"Ring allreduce: each GPU sends 2(n−1)/n of the data — near-optimal",{bold:true,size:13});
    const cx=[120,320,520], names=["GPU 0","GPU 1","GPU 2"];
    for (let i=0;i<3;i++) b += box(cx[i]-55,56,110,44,{fill:C.acc,stroke:C.accS}) + t(cx[i],74,names[i],{size:10.5,bold:true,fill:C.accT}) + t(cx[i],90,"grad shard "+i,{size:9,fill:C.dim});
    b += arrowR(178,78,262) + arrowR(378,78,462);
    b += ln(575,100,575,122,{sw:1.4}) ; b += ln(575,122,65,122,{sw:1.4}) ; b += ln(65,122,65,104,{sw:1.4}); b += triU(65,104,{});
    b += t(320,142,"Phase 1 reduce-scatter: n−1 hops, each GPU ends OWNING one fully-summed shard (5.8's privatize-merge, on wires)",{size:9.5,fill:C.dim});
    b += t(320,160,"Phase 2 all-gather: n−1 hops circulate the finished shards. Total bytes/GPU = 2(n−1)/n × size ≈ 2× — derive it in A7.",{size:9.5,fill:C.dim});
    b += t(320,182,"Bandwidth-optimal but latency = 2(n−1) hops → trees win for SMALL messages (4.6's toll-vs-width, cluster edition).",{size:10.5,fill:C.accT});
    return svg(196,b,"ring allreduce phases");
  })();

  D["a7-overlap"] = (() => {
    let b = t(320,22,"DDP's trick: allreduce buckets DURING backward (5.9's pipeline law, model edition)",{bold:true,size:13});
    b += t(80,50,"compute",{size:10,a:"start",fill:C.accT});
    b += box(150,40,130,20,{fill:C.acc,stroke:C.accS}) + t(215,54,"bwd layer N",{size:9,fill:C.accT});
    b += box(284,40,130,20,{fill:C.acc,stroke:C.accS}) + t(349,54,"bwd layer N−1",{size:9,fill:C.accT});
    b += box(418,40,130,20,{fill:C.acc,stroke:C.accS}) + t(483,54,"bwd …",{size:9,fill:C.accT});
    b += t(80,86,"network",{size:10,a:"start",fill:C.goodT});
    b += box(284,76,130,20,{fill:C.good,stroke:C.goodS}) + t(349,90,"allreduce bkt N",{size:9,fill:C.goodT});
    b += box(418,76,130,20,{fill:C.good,stroke:C.goodS}) + t(483,90,"allreduce bkt N−1",{size:9,fill:C.goodT});
    b += ln(284,60,284,76,{dash:true,sw:1.2}) + ln(418,60,418,76,{dash:true,sw:1.2});
    b += t(320,120,"Gradients for layer N exist BEFORE the rest of backward finishes → ship them now, overlap comm under compute.",{size:10.5,fill:C.dim});
    b += t(320,140,"Verdict = max-lane (5.9): when comm/step > compute/step, more GPUs stop helping — compute both lanes FIRST.",{size:10.5,fill:C.accT});
    return svg(154,b,"ddp backward allreduce overlap");
  })();

  D["a7-fsdp"] = (() => {
    let b = t(320,22,"FSDP: memory ÷ n, bought with extra gathers (traffic-for-memory, 4.6)",{bold:true,size:13});
    b += t(320,42,"each GPU permanently holds only its SHARD of params/grads/optimizer state",{size:10,fill:C.dim});
    const st=(x,s1,s2,o={})=>box(x,54,140,52,o)+t(x+70,74,s1,{size:10,bold:true,fill:o.tf||C.tx})+t(x+70,92,s2,{size:8.5,fill:C.dim});
    b += st(30,"all-gather layer i","full weights, briefly",{fill:C.good,stroke:C.goodS,tf:C.goodT});
    b += arrowR(170,80,196);
    b += st(200,"compute fwd/bwd","layer i only");
    b += arrowR(340,80,366);
    b += st(370,"FREE the gather","back to shards",{fill:C.warnFill,stroke:C.warn,tf:C.warn});
    b += arrowR(510,80,536);
    b += box(540,54,76,52,{fill:C.acc,stroke:C.accS}) + t(578,74,"reduce-",{size:10,fill:C.accT}) + t(578,90,"scatter grads",{size:8.5,fill:C.accT});
    b += t(320,130,"DDP: memory ×1 per GPU, comm 2× grads. FSDP: memory ÷n, comm ≈ 3× (gather fwd + gather bwd + scatter).",{size:10.5,fill:C.dim});
    b += t(320,150,"Choose by which resource is binding (4.7's question): fits-in-memory → DDP simplicity; doesn't → FSDP is the price.",{size:10.5,fill:C.accT});
    return svg(164,b,"fsdp shard gather compute release cycle");
  })();

  /* ---------------- A8 ---------------- */
  D["a8-kv"] = (() => {
    let b = t(320,22,"KV-cache arithmetic: the tensor that eats your GPU (do this math in every interview)",{bold:true,size:13});
    b += box(40,44,560,26,{fill:C.acc,stroke:C.accS}) + t(320,61,"bytes = 2 (K&V) × layers × kv_heads × head_dim × seq_len × dtype_bytes × batch",{size:10,fill:C.accT});
    b += t(320,92,"7B-class model (32 layers, 8 kv-heads × 128 dim, fp16), seq 8192, batch 16:",{size:10.5});
    b += t(320,112,"2 × 32 × 8 × 128 × 8192 × 2 × 16  ≈  17 GB  — more than the weights' 14 GB!",{size:11,bold:true,fill:C.warn});
    b += t(320,140,"Per TOKEN decoded, the model also RE-READS all weights (~14 GB) → decode is memory-bound (4.7 verdict:",{size:10.5,fill:C.dim});
    b += t(320,158,"tokens/s ≈ bandwidth ÷ bytes-per-token). Batching amortizes the weight reads — the whole serving game in one line.",{size:10.5,fill:C.dim});
    return svg(172,b,"kv cache size arithmetic");
  })();

  D["a8-paged"] = (() => {
    let b = t(320,22,"Paged KV (vLLM): 3.5's fragmentation problem, solved with an OS page table",{bold:true,size:13});
    b += t(160,44,"naive: one contiguous slab per request",{size:10,fill:C.badS});
    b += box(40,52,110,24,{fill:C.bad,stroke:C.badS}) + t(95,68,"req A (max_len!)",{size:8.5,fill:C.badS});
    b += box(40,80,150,24,{fill:C.bad,stroke:C.badS}) + t(115,96,"req B reserved-but-unused",{size:8.5,fill:C.badS});
    b += t(160,122,"→ 60–80% of cache WASTED on reservations",{size:9.5,fill:C.dim});
    b += t(470,44,"paged: fixed blocks + per-request block table",{size:10,fill:C.goodT});
    for (let i=0;i<8;i++) b += box(350+ (i%4)*62, 52+Math.floor(i/4)*28, 56,24,{fill: [0,2,5].includes(i)?C.good:(i===7?C.warnFill:C.box), stroke:[0,2,5].includes(i)?C.goodS:(i===7?C.warn:C.boxS)}) + t(378+(i%4)*62, 68+Math.floor(i/4)*28, [0,2,5].includes(i)?"A":(i===7?"B":"free"),{size:8.5,fill:[0,2,5].includes(i)?C.goodT:(i===7?C.warn:C.dim)});
    b += t(470,122,"allocate blocks as tokens ARRIVE; sharing enables prefix reuse",{size:9.5,fill:C.dim});
    b += t(320,148,"Attention kernels index through the block table (5.7's gather, made systematic). Waste → <10%; batch size ×2–4.",{size:10.5,fill:C.accT});
    return svg(162,b,"paged kv cache block table");
  })();

  D["a8-batch"] = (() => {
    let b = t(320,22,"Continuous batching: requests join/leave the batch PER TOKEN, not per request",{bold:true,size:13});
    b += t(70,48,"static:",{size:10,a:"start",fill:C.badS});
    b += box(130,38,200,20,{fill:C.acc,stroke:C.accS}) + t(230,52,"batch of 4 runs together",{size:9,fill:C.accT});
    b += box(334,38,170,20,{fill:C.bad,stroke:C.badS}) + t(419,52,"3 done, 1 long → 3 slots IDLE",{size:8.5,fill:C.badS});
    b += t(70,88,"continuous:",{size:10,a:"start",fill:C.goodT});
    b += box(130,78,110,20,{fill:C.good,stroke:C.goodS}) + t(185,92,"step: A B C D",{size:9,fill:C.goodT});
    b += box(244,78,110,20,{fill:C.good,stroke:C.goodS}) + t(299,92,"B done → E joins",{size:9,fill:C.goodT});
    b += box(358,78,110,20,{fill:C.good,stroke:C.goodS}) + t(413,92,"step: A E C D",{size:9,fill:C.goodT});
    b += box(472,78,110,20,{fill:C.good,stroke:C.goodS}) + t(527,92,"…full every step",{size:9,fill:C.goodT});
    b += t(320,120,"The scheduler refills the batch every iteration → the max-lane (weight-read amortization, a8-kv) stays fed.",{size:10.5,fill:C.dim});
    b += t(320,140,"This is 5.9's ring at request granularity — and why serving throughput ≈ 2–4× over static batching.",{size:10.5,fill:C.accT});
    return svg(154,b,"continuous batching timeline");
  })();

  D["a8-phases"] = (() => {
    let b = t(320,22,"Prefill vs decode: the SAME model, opposite roofline verdicts (4.7)",{bold:true,size:13});
    b += box(40,46,270,96,{fill:C.good,stroke:C.goodS}) + t(175,66,"PREFILL (read the prompt)",{size:10.5,bold:true,fill:C.goodT});
    b += t(175,86,"processes ALL prompt tokens at once",{size:9.5}) + t(175,104,"big matmuls → COMPUTE-bound",{size:9.5}) + t(175,122,"TFLOPs matter; batch matmul shapes",{size:9,fill:C.dim});
    b += box(330,46,270,96,{fill:C.warnFill,stroke:C.warn}) + t(465,66,"DECODE (generate tokens)",{size:10.5,bold:true,fill:C.warn});
    b += t(465,86,"ONE token/step re-reads all weights",{size:9.5}) + t(465,104,"matrix·vector → MEMORY-bound",{size:9.5}) + t(465,122,"bandwidth matters; batch amortizes",{size:9,fill:C.dim});
    b += t(320,166,"One serving fleet, two regimes → disaggregated serving (prefill nodes ≠ decode nodes) exists BECAUSE of this split.",{size:10.5,fill:C.dim});
    b += t(320,186,"Your 5.10 skill transfers whole: profile each phase separately or the blended numbers lie (5.9 P6's regimes).",{size:10.5,fill:C.accT});
    return svg(200,b,"prefill versus decode roofline regimes");
  })();

  /* ---------------- A9 ---------------- */
  D["a9-stack"] = (() => {
    let b = t(320,22,"torch.compile's stack: capture → lower → generate (3.1's pipeline, for graphs)",{bold:true,size:13});
    const st=(x,s1,s2,o={})=>box(x,46,136,52,o)+t(x+68,66,s1,{size:10.5,bold:true,fill:o.tf||C.tx})+t(x+68,84,s2,{size:8.5,fill:C.dim});
    b += st(30,"Dynamo","captures Python → FX graph");
    b += arrowR(166,72,192);
    b += st(196,"AOTAutograd","traces fwd+bwd graphs");
    b += arrowR(332,72,358);
    b += st(362,"Inductor","fuses, tiles, schedules",{fill:C.acc,stroke:C.accS,tf:C.accT});
    b += arrowR(498,72,524);
    b += box(528,46,88,52,{fill:C.good,stroke:C.goodS}) + t(572,66,"Triton",{size:10.5,bold:true,fill:C.goodT}) + t(572,84,"(A4!) + C++",{size:8.5,fill:C.dim});
    b += t(320,122,"It emits the A4/A5 kernels you now write by hand — compile is your skills, automated and searched.",{size:10.5,fill:C.dim});
    b += t(320,142,"TORCH_LOGS=output_code shows the generated Triton: READ it (3.6's Godbolt reflex, final form).",{size:10.5,fill:C.accT});
    return svg(156,b,"torch compile stack dynamo to triton");
  })();

  D["a9-breaks"] = (() => {
    let b = t(320,22,"Graph breaks: where capture gives up (each break = a fusion wall)",{bold:true,size:13});
    b += box(40,44,170,26,{fill:C.good,stroke:C.goodS}) + t(125,61,"captured graph A",{size:9.5,fill:C.goodT});
    b += box(250,44,140,26,{fill:C.bad,stroke:C.badS}) + t(320,61,"BREAK: .item()",{size:9.5,fill:C.badS});
    b += box(430,44,170,26,{fill:C.good,stroke:C.goodS}) + t(515,61,"captured graph B",{size:9.5,fill:C.goodT});
    b += ln(210,57,250,57,{sw:1.3}) + ln(390,57,430,57,{sw:1.3});
    b += t(320,92,"break causes: .item()/.cpu() (5.3 quiz 2's sync, AGAIN) · data-dependent if/for · prints · unsupported calls",{size:10,fill:C.dim});
    b += t(320,112,"cost: graphs A and B can't fuse across the break; dynamo re-checks guards at every boundary",{size:10,fill:C.dim});
    b += t(320,134,"audit: torch._dynamo.explain(fn)(args) lists every break with its reason — the 5.10 loop's first command here.",{size:10.5,fill:C.accT});
    return svg(148,b,"graph break anatomy");
  })();

  D["a9-when"] = (() => {
    let b = t(320,22,"When compile pays: the decision table (4.7 thinking, applied)",{bold:true,size:13});
    const row=(y,s,verdict,good)=>{ b += box(40,y,380,26)+t(230,y+17,s,{size:9.5});
      b += box(430,y,170,26,{fill:good?C.good:C.bad,stroke:good?C.goodS:C.badS})+t(515,y+17,verdict,{size:9.5,fill:good?C.goodT:C.badS}); };
    row(44,"many small elementwise ops (norms, activations, optimizers)","big win: fusion ÷ trips",true);
    row(76,"one giant matmul dominating (already cuBLAS/TC)","~nothing to fuse",false);
    row(108,"dynamic shapes every call (ragged batches)","recompiles eat the win",false);
    row(140,"steady shapes, long training run","compile once, win for days",true);
    b += t(320,186,"Amortization law: compile cost is paid per (code, shape, guard-set); wins are paid per STEP. Long runs amortize;",{size:10.5,fill:C.dim});
    b += t(320,204,"notebooks and shape-churn don't. Measure with the 5.9 timer AFTER warmup — the first calls are the compiler.",{size:10.5,fill:C.dim});
    return svg(218,b,"when torch compile wins table");
  })();

  /* ---------------- A10 ---------------- */
  D["a10-container"] = (() => {
    let b = t(320,22,"CUDA in containers: the driver stays OUTSIDE (5.1's split, containerized)",{bold:true,size:13});
    b += box(40,44,560,40,{fill:C.acc,stroke:C.accS}) + t(320,62,"HOST: NVIDIA kernel driver + nvidia-smi  (one per machine — the thing you DON'T ship)",{size:9.5,fill:C.accT});
    b += box(70,100,240,72) + t(190,118,"container A",{size:10,bold:true}) + t(190,136,"CUDA runtime 12.x + torch 2.11",{size:9}) + t(190,152,"its OWN toolkit version",{size:8.5,fill:C.dim});
    b += box(340,100,240,72) + t(460,118,"container B",{size:10,bold:true}) + t(460,136,"CUDA runtime 13.x + vLLM",{size:9}) + t(460,152,"coexists happily",{size:8.5,fill:C.dim});
    b += ln(190,100,190,84,{sw:1.3,dash:true}) + ln(460,100,460,84,{sw:1.3,dash:true});
    b += t(320,196,"nvidia-container-toolkit mounts the driver in; constraint: container CUDA ≤ what the host driver supports",{size:10.5,fill:C.dim});
    b += t(320,216,"(5.1's driver≥toolkit law — now a FLEET invariant your CI must check before any rollout).",{size:10.5,fill:C.warn});
    return svg(230,b,"cuda container driver boundary");
  })();

  D["a10-serving"] = (() => {
    let b = t(320,22,"A request's path — every hop is a place p99 goes to die (5.9, productized)",{bold:true,size:13});
    const st=(x,s1,s2,o={})=>box(x,46,112,50,o)+t(x+56,66,s1,{size:9.5,bold:true,fill:o.tf||C.tx})+t(x+56,84,s2,{size:8,fill:C.dim});
    b += st(20,"HTTP/gRPC","deserialize");
    b += arrowR(132,71,148);
    b += st(152,"queue + batcher","continuous (a8)",{fill:C.acc,stroke:C.accS,tf:C.accT});
    b += arrowR(264,71,280);
    b += st(284,"GPU worker","5.9 pipeline",{fill:C.good,stroke:C.goodS,tf:C.goodT});
    b += arrowR(396,71,412);
    b += st(416,"detokenize","stream out");
    b += arrowR(528,71,544);
    b += box(548,46,72,50,{fill:C.warnFill,stroke:C.warn}) + t(584,66,"metrics",{size:9.5,fill:C.warn}) + t(584,84,"per stage!",{size:8,fill:C.dim});
    b += t(320,120,"SLO math: p99(total) is NOT Σp99(stages) — tails compose by convolution; measure end-to-end AND per-stage.",{size:10.5,fill:C.dim});
    b += t(320,140,"The watchdog-restart pattern (5.4 quiz 1) lives at the worker: sticky error → kill, respawn, quarantine.",{size:10.5,fill:C.accT});
    return svg(154,b,"inference serving request path");
  })();

  D["a10-metrics"] = (() => {
    let b = t(320,22,"GPU 'utilization' lies: util% ≠ doing useful work (5.10's regimes, dashboard edition)",{bold:true,size:13});
    const row=(y,name,val,note,col)=>{ b += t(120,y+16,name,{size:10,bold:true,a:"start"});
      b += box(260,y,val*1.9,22,{fill:col||C.acc,stroke:C.boxS}) ; b += t(270+val*1.9,y+15,val+"% — "+note,{size:9,a:"start",fill:C.dim}); };
    row(44,"nvidia-smi util","98","ANY kernel counts, even 1 warp",C.bad);
    row(76,"SM occupancy","61","warps resident vs max (5.6)");
    row(108,"SOL memory","83","% of bandwidth ceiling (honest)",C.good);
    row(140,"SOL compute","12","% of FLOP ceiling");
    b += t(320,186,"util% = 'was the GPU busy this sample' — a single tiny kernel pegging it at 98% while delivering 3% of SOL",{size:10.5,fill:C.dim});
    b += t(320,204,"is the classic fleet illusion. Dashboards get SOL-class metrics (DCGM) or they get lies.",{size:10.5,fill:C.warn});
    return svg(218,b,"gpu utilization metrics compared");
  })();

  /* ---------------- A11 ---------------- */
  D["a11-fused"] = (() => {
    let b = t(320,22,"The capstone's win: bias+GELU fused into the epilogue — trips deleted",{bold:true,size:13});
    b += t(160,44,"unfused: 3 kernels, 3 round-trips of the (M,N) output",{size:9.5,fill:C.badS});
    b += box(40,52,110,28,{fill:C.acc,stroke:C.accS}) + t(95,70,"matmul → HBM",{size:9,fill:C.accT});
    b += box(40,86,110,28) + t(95,104,"+bias → HBM",{size:9});
    b += box(40,120,110,28) + t(95,138,"GELU → HBM",{size:9});
    b += t(460,44,"fused: apply bias+GELU while C's tile is still in registers",{size:9.5,fill:C.goodT});
    b += box(350,60,240,64,{fill:C.good,stroke:C.goodS}) + t(470,84,"matmul tile → acc → gelu(acc+bias)",{size:9.5,fill:C.goodT}) + t(470,104,"→ ONE write to HBM",{size:9.5,fill:C.goodT});
    b += t(320,168,"Traffic: 6 output passes → 2. Predicted ≈3× for memory-bound epilogues — predict, measure, reconcile (M1 L7).",{size:10.5,fill:C.dim});
    b += t(320,188,"This is why custom kernels still exist in a cuBLAS world (5.11 quiz 1's answer, now BUILT).",{size:10.5,fill:C.accT});
    return svg(202,b,"fused epilogue traffic comparison");
  })();

  D["a11-ladder"] = (() => {
    let b = t(320,22,"Capstone ladder: from torch baseline to served fused op (every rung audited)",{bold:true,size:13});
    const rung=(y,s1,s2,o={})=>box(60,y,400,28,o)+t(260,y+18,s1,{size:9.5,fill:o.tf||C.tx})+t(520,y+18,s2,{size:9,a:"middle",fill:C.dim});
    b += rung(44,"r0  torch eager: matmul + bias + gelu (the oracle)","baseline + fixtures");
    b += rung(78,"r1  torch.compile the block (A9)","the bar to beat!",{fill:C.acc,stroke:C.accS,tf:C.accT});
    b += rung(112,"r2  Triton fused epilogue kernel (A4+A5)","beat r1 or explain why not",{fill:C.good,stroke:C.goodS,tf:C.goodT});
    b += rung(146,"r3  autotuned + shape-robust + gradcheck'd (A3)","production-shaped",{fill:C.good,stroke:C.goodS,tf:C.goodT});
    b += rung(180,"r4  served: endpoint + SOL dashboards (A10)","p50/p99 + rollback plan",{fill:C.warnFill,stroke:C.warn,tf:C.warn});
    b += t(320,230,"Honest bar: r2 must beat r1 (compile), not just eager — beating a strawman is the field's favorite self-deception.",{size:10.5,fill:C.warn});
    return svg(244,b,"capstone ladder rungs");
  })();

  D["a11-ship"] = (() => {
    let b = t(320,22,"The A11 trust stack (5.11's pyramid, ML edition) — claims stand on the layer below",{bold:true,size:13});
    b += box(200,44,240,28,{fill:C.warnFill,stroke:C.warn}) + t(320,62,"p50/p99 under load (A10)",{size:9.5,fill:C.warn});
    b += box(160,78,320,28,{fill:C.good,stroke:C.goodS}) + t(320,96,"GpuTimer medians vs r1, regime-labeled (5.9/5.10)",{size:9.5,fill:C.goodT});
    b += box(120,112,400,28) + t(320,130,"ncu traffic delta proves the MECHANISM (bytes ÷3, 5.10)",{size:9.5});
    b += box(80,146,480,28,{fill:C.acc,stroke:C.accS}) + t(320,164,"gradcheck fp64 + forward budget vs eager oracle, all shapes (A3, M1 L8 policy)",{size:9.5,fill:C.accT});
    b += box(40,180,560,28) + t(320,198,"plumbing: dtype/device/contiguity contracts reject bad inputs loudly (3.3 → A3)",{size:9.5});
    b += t(320,232,"A speed claim without its mechanism row is a coincidence; without its fixture rows it's a liability (5.11's law).",{size:10.5,fill:C.dim});
    return svg(246,b,"a11 trust stack pyramid");
  })();

  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, D);
})();

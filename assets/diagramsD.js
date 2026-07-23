/* GPU Mastery — Track D (Vendor-Neutral / Portable GPU) diagram pack.
   Registers SVGs on window.DIAGRAMS. Palette C, font F, helpers copied
   verbatim from diagrams5.js / diagramsB.js — DO NOT diverge. */
(function () {
  const C = { card:"#161b26", tx:"#e8edf5", dim:"#aab4c4", box:"#222a38",
    boxS:"#3b4760", acc:"#27406e", accS:"#5b9bff", accT:"#8fb6ff",
    good:"#173d31", goodS:"#36c98a", goodT:"#5fd6a4", warnFill:"#3a3320",
    warn:"#f5b850", bad:"#3d1f24", badS:"#ff6b6b", line:"#8a97aa", dim2:"#7e8aa0" };
  const F = "font-family:Inter,system-ui,sans-serif";
  const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const box=(x,y,w,h,o={})=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r??7}" style="fill:${o.fill||C.box};stroke:${o.stroke||C.boxS};stroke-width:${o.sw||1.4}"/>`;
  const t=(x,y,s,o={})=>`<text x="${x}" y="${y}" text-anchor="${o.a||"middle"}" style="fill:${o.fill||C.tx};font-size:${o.size||12}px;font-weight:${o.bold?700:400};${F}">${esc(s)}</text>`;
  const ln=(x1,y1,x2,y2,o={})=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${o.stroke||C.line};stroke-width:${o.sw||1.7}${o.dash?";stroke-dasharray:5 4":""}"/>`;
  const tri=(x,y,o={})=>`<polygon points="${x-7},${y-4} ${x},${y} ${x-7},${y+4}" style="fill:${o.stroke||C.line}"/>`;
  const triL=(x,y,o={})=>`<polygon points="${x+7},${y-4} ${x},${y} ${x+7},${y+4}" style="fill:${o.stroke||C.line}"/>`;
  const triU=(x,y,o={})=>`<polygon points="${x-4},${y+7} ${x},${y} ${x+4},${y+7}" style="fill:${o.stroke||C.line}"/>`;
  const triD=(x,y,o={})=>`<polygon points="${x-4},${y-7} ${x},${y} ${x+4},${y-7}" style="fill:${o.stroke||C.line}"/>`;
  const arrowR=(x1,y,x2,o={})=>ln(x1,y,x2,y,o)+tri(x2,y,o);
  const svg=(h,body,label)=>`<svg viewBox="0 0 640 ${h}" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="640" height="${h}" rx="10" style="fill:${C.card}"/>${body}</svg>`;
  const D = {};

  /* ---------------- D1 — portability landscape & translation table ---------------- */

  /* d1-landscape — why portability, four forces + the 2026 machine reality */
  D["d1-landscape"] = (() => {
    let b = t(320,22,"Why portability now — four forces, and one uncomfortable ranking",{bold:true,size:13});
    const forces = [
      ["Supply","one vendor can't","meet AI demand"],
      ["Price","$/FLOP varies 3×","across vendors"],
      ["Browsers","WebGPU = a GPU","in ~5B devices"],
      ["Nat'l labs","top systems are","NOT all NVIDIA"]];
    for (let i=0;i<4;i++){
      const x=30+i*152;
      b += box(x,42,138,64,{fill:C.acc,stroke:C.accS});
      b += t(x+69,63,forces[i][0],{size:11.5,bold:true,fill:C.accT});
      b += t(x+69,81,forces[i][1],{size:9.5,fill:C.dim});
      b += t(x+69,96,forces[i][2],{size:9.5,fill:C.dim});
    }
    b += box(30,120,580,50,{fill:C.warnFill,stroke:C.warn});
    b += t(320,140,"TOP500 (June 2026): #1 LineShine (CN) · #2 El Capitan = AMD MI300A · #3 Frontier = AMD · #4 Aurora = Intel GPU Max",{size:10,fill:C.warn});
    b += t(320,158,"El Capitan and Aurora — the fastest US machines — run zero NVIDIA GPUs. Betting one vendor is a strategy risk.",{size:10,fill:C.dim});
    b += t(320,188,"What you learned is CUDA's SYNTAX, not CUDA's IDEAS. This track proves the ideas were never NVIDIA's.",{size:10.5,fill:C.goodT});
    return svg(204,b,"four forces driving GPU portability and the 2026 top500 machines");
  })();

  /* d1-translation — THE grand translation table: the track's spine */
  D["d1-translation"] = (() => {
    let b = t(320,22,"The translation table — same idea, four vocabularies (the track's spine)",{bold:true,size:13});
    const cols = [20,168,300,420,520];
    const head = ["idea","NVIDIA / CUDA","AMD / HIP","Intel / SYCL","WebGPU / WGSL"];
    b += box(14,36,612,24,{fill:C.acc,stroke:C.accS,r:5});
    for (let i=0;i<5;i++) b += t(cols[i],53,head[i],{a:"start",size:10.5,bold:true,fill:C.accT});
    const rows = [
      ["SIMD group","warp = 32","wavefront = 64","sub_group","subgroup"],
      ["core","SM","CU","Xe-core","—"],
      ["scratch","__shared__","LDS","local","var<workgroup>"],
      ["block","block","block","work-group","workgroup"],
      ["barrier","__syncthreads","__syncthreads","group_barrier","workgroupBarrier"],
      ["lane id","threadIdx.x","threadIdx.x","local_id","local_invocation"],
      ["kernel","__global__","__global__","SYCL lambda","@compute"]];
    let y=72;
    for (const r of rows){
      const wf = r[2].includes("64");
      for (let i=0;i<5;i++) b += t(cols[i],y,r[i],{a:"start",size:9.8,fill:i===0?C.tx:(wf&&i===2?C.warn:C.dim)});
      if (wf) b += t(600,y,"⚠",{size:11,fill:C.warn});
      b += ln(14,y+6,626,y+6,{stroke:C.boxS,sw:0.8});
      y += 24;
    }
    b += t(320,y+14,"Memorize the rows, not the syntax. wavefront 64 (highlighted) is the one that silently breaks blind ports — D2.",{size:10,fill:C.warn});
    return svg(y+30,b,"grand translation table across CUDA HIP SYCL and WGSL");
  })();

  /* d1-taxonomy — four families of portable code + the 90/10 rule */
  D["d1-taxonomy"] = (() => {
    let b = t(320,22,"Four families of portable code — pick your abstraction level",{bold:true,size:13});
    const rows = [
      ["single-source C++","SYCL · Kokkos · RAJA","one .cpp, compiler retargets","D3, D6"],
      ["dialect (rename)","HIP","CUDA with sed — near-1:1","D2"],
      ["IR / compiler","Triton · MLIR","one IR → PTX or AMDGCN","D7"],
      ["portable API","WebGPU · OpenCL","runtime picks the driver","D4, D5"]];
    let y=44;
    for (const r of rows){
      b += box(20,y,600,34,{fill:C.box});
      b += t(34,y+22,r[0],{a:"start",size:11,bold:true,fill:C.accT});
      b += t(196,y+22,r[1],{a:"start",size:10,fill:C.tx});
      b += t(360,y+22,r[2],{a:"start",size:9.8,fill:C.dim});
      b += t(600,y+22,r[3],{a:"end",size:9.5,fill:C.goodT});
      y += 42;
    }
    b += box(20,y,600,42,{fill:C.warnFill,stroke:C.warn});
    b += t(320,y+18,"The 90/10 rule: portability gets you ~90% of peak for ~10% of the effort.",{size:10.5,bold:true,fill:C.warn});
    b += t(320,y+34,"The last 10% of performance is where the portability tax lives — the track's honest through-line.",{size:10,fill:C.dim});
    return svg(y+58,b,"four families of portable GPU programming and the ninety ten rule");
  })();

  /* ---------------- D2 — ROCm / HIP ---------------- */

  /* d2-hipify — the diff is renames */
  D["d2-hipify"] = (() => {
    let b = t(320,22,"hipify: the CUDA→HIP diff is mostly find-and-replace",{bold:true,size:13});
    b += box(24,40,280,196,{fill:"#10141d",stroke:C.accS});
    b += t(38,60,"CUDA",{a:"start",size:10.5,bold:true,fill:C.accT});
    const cuda=["cudaMalloc(&d,n);","cudaMemcpy(d,h,n,H2D);","saxpy<<<g,b>>>(...);","__global__ void saxpy(","  int i=blockIdx.x*","    blockDim.x+threadIdx.x;","cudaDeviceSynchronize();"];
    let y=82; for (const l of cuda){ b += t(38,y,l,{a:"start",size:9.3,fill:C.dim}); y+=21; }
    b += box(336,40,280,196,{fill:"#10141d",stroke:C.goodS});
    b += t(350,60,"HIP",{a:"start",size:10.5,bold:true,fill:C.goodT});
    const hip=["hipMalloc(&d,n);","hipMemcpy(d,h,n,H2D);","saxpy<<<g,b>>>(...);","__global__ void saxpy(","  int i=blockIdx.x*","    blockDim.x+threadIdx.x;","hipDeviceSynchronize();"];
    y=82; for (const l of hip){ const same=l.includes("saxpy&")||l.includes("__global__")||l.includes("blockIdx")||l.includes("blockDim"); b += t(350,y,l,{a:"start",size:9.3,fill:same?C.dim2:C.goodT}); y+=21; }
    b += t(320,254,"'cuda'→'hip' on the runtime calls; the kernel BODY (index math, launch syntax) is byte-identical.",{size:10,fill:C.dim});
    b += t(320,272,"That near-empty diff IS the lesson: the ideas ported for free. The 10% that doesn't is wavefront width →",{size:10,fill:C.warn});
    return svg(288,b,"hipify translating cuda calls to hip with identical kernel body");
  })();

  /* d2-wavefront — warp 32 vs wavefront 64: the hardcoded-32 reduction bug */
  D["d2-wavefront"] = (() => {
    let b = t(320,22,"wavefront 64 breaks the hardcoded-32 reduction — the classic blind-port bug",{bold:true,size:13});
    b += box(20,40,600,46,{fill:"#10141d",stroke:C.boxS});
    b += t(34,60,"for (int o = 16; o > 0; o >>= 1)   // 16 = warpSize/2, HARDCODED for NVIDIA",{a:"start",size:9.8,fill:C.tx});
    b += t(34,78,"    v += __shfl_down(v, o);        // sums lanes 0..31 only",{a:"start",size:9.8,fill:C.dim});
    b += box(24,98,290,96,{fill:C.good,stroke:C.goodS});
    b += t(169,116,"NVIDIA · warp = 32",{size:10.5,bold:true,fill:C.goodT});
    b += t(169,136,"log₂(32) = 5 shuffle steps",{size:10,fill:C.dim});
    b += t(169,156,"offset 16→8→4→2→1 covers",{size:9.8,fill:C.dim});
    b += t(169,174,"all 32 lanes ✓ correct sum",{size:9.8,fill:C.goodT});
    b += box(326,98,290,96,{fill:C.bad,stroke:C.badS});
    b += t(471,116,"AMD · wavefront = 64",{size:10.5,bold:true,fill:C.badS});
    b += t(471,136,"needs offset 32 first (6 steps)",{size:10,fill:C.dim});
    b += t(471,156,"starting at 16 → lanes 32..63",{size:9.8,fill:C.dim});
    b += t(471,174,"NEVER summed: WRONG, silently",{size:9.8,fill:C.badS});
    b += t(320,214,"Fix: use warpSize / __AMDGCN_WAVEFRONT_SIZE__, never the literal 32. Same bug hides in shared-mem tree",{size:10,fill:C.warn});
    b += t(320,231,"sizes, occupancy assumptions, and any '% 32'. Blind ports COMPILE and RUN — they just return garbage.",{size:10,fill:C.dim});
    return svg(248,b,"warp 32 versus wavefront 64 reduction tree bug");
  })();

  /* d2-stack — ROCm stack mirrors the CUDA stack */
  D["d2-stack"] = (() => {
    let b = t(320,22,"The ROCm stack is the CUDA stack with the labels swapped",{bold:true,size:13});
    const pairs = [
      ["cuBLAS / cuFFT","rocBLAS / rocFFT","drop-in BLAS/FFT"],
      ["CUDA runtime","HIP runtime","same API shape"],
      ["__shared__","LDS (Local Data Share)","5.5, renamed"],
      ["Nsight / ncu","rocprofv3 / rocprof","5.10's counters"],
      ["nvcc → SASS","hipcc → AMDGCN","per-arch codegen"]];
    let y=42;
    for (const p of pairs){
      b += box(30,y,220,30,{fill:C.acc,stroke:C.accS});
      b += t(140,y+20,p[0],{size:10,fill:C.accT});
      b += arrowR(258,y+15,300);
      b += box(304,y,220,30,{fill:C.good,stroke:C.goodS});
      b += t(414,y+20,p[1],{size:10,fill:C.goodT});
      b += t(534,y+20,p[2],{a:"start",size:8.8,fill:C.dim});
      y += 38;
    }
    b += t(320,y+14,"MI300A/MI355X pair HBM3E with the CPU on one package — bandwidth that redraws 4.7's roofline (D8).",{size:10,fill:C.dim});
    return svg(y+30,b,"rocm software stack mapped to the cuda stack");
  })();

  /* ---------------- D3 — SYCL / oneAPI ---------------- */

  /* d3-single-source — one file, host+device, queue+buffer+accessor vs USM */
  D["d3-single-source"] = (() => {
    let b = t(320,22,"SYCL single-source: host and device in one standard C++ file",{bold:true,size:13});
    b += box(24,40,392,206,{fill:"#10141d",stroke:C.boxS});
    const code=[["queue q;","",C.accT],["buffer<float> A{data, N};","host memory, wrapped",C.tx],["q.submit([&](handler& h){","one command group",C.goodT],["  accessor a{A, h, read_write};","declares INTENT on A",C.warn],["  h.parallel_for(N, [=](id<1> i){","nd-range = grid/block",C.goodT],["    a[i] = a[i]*2.0f;","the kernel body",C.tx],["  });","",C.tx],["}); // RAII: buffer copies back","on scope exit",C.dim]];
    let y=62; for (const [l,,c] of code){ b += t(38,y,l,{a:"start",size:9.6,fill:c}); y+=23; }
    b += box(430,40,186,206,{fill:C.warnFill,stroke:C.warn});
    b += t(523,60,"two memory models",{size:10,bold:true,fill:C.warn});
    b += t(523,82,"buffer + accessor:",{size:9.5,fill:C.tx});
    b += t(523,98,"runtime OWNS the data,",{size:9,fill:C.dim});
    b += t(523,113,"infers copies + deps",{size:9,fill:C.dim});
    b += t(523,138,"USM (malloc_shared):",{size:9.5,fill:C.tx});
    b += t(523,154,"pointers like CUDA,",{size:9,fill:C.dim});
    b += t(523,169,"YOU own the sync",{size:9,fill:C.dim});
    b += t(523,196,"accessors = 5.3",{size:9,fill:C.goodT});
    b += t(523,211,"ownership, as TYPES",{size:9,fill:C.goodT});
    return svg(258,b,"sycl single source queue buffer accessor and usm");
  })();

  /* d3-dag — accessors → dependency DAG the runtime infers */
  D["d3-dag"] = (() => {
    let b = t(320,22,"Accessors declare intent; the runtime infers the graph (5.9, not declared)",{bold:true,size:13});
    const K=(x,l,c)=>box(x,64,120,40,{fill:c.f,stroke:c.s})+t(x+60,88,l,{size:10.5,bold:true,fill:c.t});
    b += K(40,"K1: write A",{f:C.acc,s:C.accS,t:C.accT});
    b += K(260,"K2: read A→B",{f:C.acc,s:C.accS,t:C.accT});
    b += K(480,"K3: read B",{f:C.acc,s:C.accS,t:C.accT});
    b += arrowR(162,84,258,{stroke:C.goodS,sw:2});
    b += arrowR(382,84,478,{stroke:C.goodS,sw:2});
    b += t(210,54,"RAW on A",{size:9,fill:C.goodT});
    b += t(430,54,"RAW on B",{size:9,fill:C.goodT});
    b += t(320,132,"You wrote three parallel_for calls and ZERO synchronization. The accessor read/write tags let the",{size:10,fill:C.dim});
    b += t(320,150,"scheduler build this dependency DAG and serialize exactly what must serialize — the rest overlaps.",{size:10,fill:C.dim});
    b += t(320,174,"CUDA: you declare streams + events by hand (5.9). SYCL: you declare DATA intent; the DAG is derived.",{size:10.5,fill:C.warn});
    return svg(192,b,"sycl accessor dependency dag inferred by the runtime");
  })();

  /* d3-ndrange — nd_range maps to grid/block; local accessor = shared */
  D["d3-ndrange"] = (() => {
    let b = t(320,22,"nd_range is grid/block wearing standard-C++ clothes",{bold:true,size:13});
    const rows=[["nd_range<1>{global, local}","<<<grid, block>>>"],["nd_item.get_global_id()","blockIdx*blockDim+threadIdx"],["nd_item.get_local_id()","threadIdx"],["local_accessor (per-group)","__shared__ (5.5)"],["group_barrier(g)","__syncthreads()"],["sub_group (SIMD)","warp / wavefront"]];
    let y=44;
    for (const r of rows){
      b += box(24,y,320,28,{fill:C.good,stroke:C.goodS});
      b += t(38,y+19,r[0],{a:"start",size:10,fill:C.goodT});
      b += t(360,y+19,"≡",{size:12,fill:C.dim});
      b += box(378,y,238,28,{fill:C.acc,stroke:C.accS});
      b += t(392,y+19,r[1],{a:"start",size:10,fill:C.accT});
      y += 34;
    }
    b += t(320,y+14,"Nothing new to learn — only new names for 5.2/5.5's hardware. Run it on the CPU backend to prove it.",{size:10,fill:C.dim});
    return svg(y+30,b,"sycl nd range mapped to cuda grid block shared barrier");
  })();

  /* ---------------- D4 — OpenCL today ---------------- */

  /* d4-anatomy — the boilerplate ceremony, kernel-as-string */
  D["d4-anatomy"] = (() => {
    let b = t(320,22,"OpenCL's honest cost: the setup ceremony (kernel compiled at RUNTIME)",{bold:true,size:13});
    const steps=["clGetPlatformIDs","clGetDeviceIDs","clCreateContext","clCreateCommandQueue","clCreateProgramWithSource","clBuildProgram  ← compiles the kernel STRING now","clCreateKernel + clSetKernelArg","clEnqueueNDRangeKernel"];
    let y=44;
    for (let i=0;i<steps.length;i++){
      const build=steps[i].includes("Build");
      b += box(60,y,520,24,{fill:build?C.warnFill:C.box,stroke:build?C.warn:C.boxS});
      b += t(74,y+17,(i+1)+". "+steps[i],{a:"start",size:9.8,fill:build?C.warn:C.tx});
      if (i<steps.length-1) b += triU(320,y+30,{stroke:C.line});
      y += 32;
    }
    b += t(320,y+12,"The kernel is a STRING built at runtime (3.1's compiler pipeline, live) — portable to anything with a driver,",{size:10,fill:C.dim});
    b += t(320,y+29,"at the price of eight setup calls CUDA hides. SPIR-V ingestion (mandatory in OpenCL 3.1) lets you ship IR instead.",{size:10,fill:C.dim});
    return svg(y+44,b,"opencl host boilerplate pipeline with runtime kernel build");
  })();

  /* d4-history — why it lost, where it wins */
  D["d4-history"] = (() => {
    let b = t(320,22,"OpenCL: lost the desktop war on ECOSYSTEM, still wins on BREADTH",{bold:true,size:13});
    b += box(24,42,290,150,{fill:C.bad,stroke:C.badS});
    b += t(169,62,"why it lost to CUDA",{size:10.5,bold:true,fill:C.badS});
    for (const [i,l] of ["no libraries (cuBLAS had no peer)","no profilers / no nvcc ergonomics","vendors shipped it late & buggy","tuning code stayed vendor-specific anyway"].entries())
      b += t(38,86+i*24,"• "+l,{a:"start",size:9.5,fill:C.dim});
    b += box(326,42,290,150,{fill:C.good,stroke:C.goodS});
    b += t(471,62,"where it still wins",{size:10.5,bold:true,fill:C.goodT});
    for (const [i,l] of ["mobile & embedded GPUs / DSPs","FPGAs (Intel, AMD toolchains)","the widest device reach, period","SPIR-V now core (3.1) — SYCL targets it"].entries())
      b += t(340,86+i*24,"• "+l,{a:"start",size:9.5,fill:C.dim});
    b += t(320,214,"The engineering-history moral: the better ECOSYSTEM beats the better spec. Ergonomics was never OpenCL's problem.",{size:10,fill:C.warn});
    return svg(230,b,"opencl why it lost to cuda and where it still wins");
  })();

  /* ---------------- D5 — WebGPU / WGSL ---------------- */

  /* d5-pipeline — adapter/device/queue → bind groups → compute pipeline */
  D["d5-pipeline"] = (() => {
    let b = t(320,22,"WebGPU: the universal GPU lab — every browser is now a compute device",{bold:true,size:13});
    const flow=[["adapter","the physical GPU"],["device","+ queue (5.9)"],["buffers","GPU memory"],["bind group","descriptors → shader"],["pipeline","compiled WGSL"],["dispatch","workgroups (5.2)"]];
    let x=20;
    for (let i=0;i<flow.length;i++){
      b += box(x,60,88,50,{fill:C.acc,stroke:C.accS});
      b += t(x+44,82,flow[i][0],{size:10,bold:true,fill:C.accT});
      b += t(x+44,99,flow[i][1],{size:8,fill:C.dim});
      if (i<flow.length-1) b += arrowR(x+88,85,x+100);
      x += 102;
    }
    b += box(20,132,600,44,{fill:C.warnFill,stroke:C.warn});
    b += t(320,150,"In all major browsers (Chrome/Edge, Firefox 141+, Safari 26). Engines: Dawn (C++) & wgpu (Rust) —",{size:10,fill:C.warn});
    b += t(320,167,"both run standalone too, so the SAME WGSL is your no-hardware, no-install lab. This site hosts one: lab-webgpu.html.",{size:9.8,fill:C.dim});
    return svg(190,b,"webgpu pipeline from adapter to dispatch");
  })();

  /* d5-wgsl — WGSL compute kernel anatomy */
  D["d5-wgsl"] = (() => {
    let b = t(320,22,"A WGSL compute kernel is a CUDA kernel with decorators",{bold:true,size:13});
    b += box(24,40,380,192,{fill:"#10141d",stroke:C.boxS});
    const code=[["@group(0) @binding(0)","bind-group slot",C.warn],["var<storage,read_write> x: array<f32>;","the buffer",C.tx],["","",C.tx],["@compute @workgroup_size(256)","= blockDim (5.2)",C.goodT],["fn main(@builtin(global_invocation_id)","= global index",C.accT],["         gid: vec3<u32>) {","",C.tx],["  x[gid.x] = x[gid.x] * 2.0;","the body",C.tx],["}","",C.tx]];
    let y=62; for (const [l,,c] of code){ b += t(38,y,l,{a:"start",size:9.3,fill:c}); y+=21; }
    b += box(418,40,198,192,{fill:C.box});
    b += t(517,60,"map to what you know",{size:9.8,bold:true,fill:C.accT});
    const map=[["@workgroup_size","blockDim"],["global_invocation_id","global thread idx"],["var<workgroup>","__shared__"],["workgroupBarrier()","__syncthreads()"],["subgroup ops","warp shuffle*"]];
    y=80; for (const m of map){ b += t(432,y,m[0],{a:"start",size:9,fill:C.goodT}); b += t(432,y+13,"→ "+m[1],{a:"start",size:9,fill:C.dim}); y+=29; }
    b += t(517,226,"*subgroups: Chrome 134+ only",{size:8.5,fill:C.warn});
    return svg(244,b,"wgsl compute kernel anatomy mapped to cuda concepts");
  })();

  /* d5-limits — the baseline vs extensions honesty */
  D["d5-limits"] = (() => {
    let b = t(320,22,"WebGPU's portability tax: the baseline is small; the good stuff is optional",{bold:true,size:13});
    const rows=[["workgroup shared memory","baseline","yes — var<workgroup>",true],["workgroupBarrier","baseline","yes",true],["subgroups (warp ops)","extension","Chrome 134 (Feb 2025)",false],["timestamp-query (5.10)","extension","Chrome 121+, quantized 100µs",false],["fp16 / f16","extension","widely but not everywhere",false],["64-bit atomics","limited","check adapter.limits",false]];
    let y=42;
    for (const r of rows){
      b += box(24,y,600,27,{fill:r[3]?C.good:C.warnFill,stroke:r[3]?C.goodS:C.warn});
      b += t(38,y+18,r[0],{a:"start",size:9.8,fill:C.tx});
      b += t(300,y+18,r[1],{a:"start",size:9.5,fill:r[3]?C.goodT:C.warn});
      b += t(410,y+18,r[2],{a:"start",size:9.3,fill:C.dim});
      y += 33;
    }
    b += t(320,y+13,"Portable-by-default means coding to the BASELINE and feature-detecting the rest (adapter.features.has(...)).",{size:10,fill:C.dim});
    return svg(y+28,b,"webgpu baseline features versus optional extensions");
  })();

  /* ---------------- D6 — Kokkos / RAJA ---------------- */

  /* d6-view — View: compile-time layout switch = AoS/SoA automated */
  D["d6-view"] = (() => {
    let b = t(320,22,"Kokkos View: same code, layout chosen at COMPILE time per backend",{bold:true,size:13});
    b += box(230,40,180,30,{fill:C.acc,stroke:C.accS});
    b += t(320,60,"View<float**> A(N,M)",{size:10.5,bold:true,fill:C.accT});
    b += ln(320,70,150,96,{sw:1.2}) + ln(320,70,490,96,{sw:1.2});
    b += box(40,96,240,96,{fill:C.good,stroke:C.goodS});
    b += t(160,116,"GPU build → LayoutLeft",{size:10.5,bold:true,fill:C.goodT});
    b += t(160,138,"column-major: A(i,j) at i + j·N",{size:9.3,fill:C.dim});
    b += t(160,156,"adjacent threads (i,i+1) → adjacent",{size:9.3,fill:C.dim});
    b += t(160,174,"addresses = COALESCED (5.7) ✓",{size:9.3,fill:C.goodT});
    b += box(360,96,240,96,{fill:C.warnFill,stroke:C.warn});
    b += t(480,116,"CPU build → LayoutRight",{size:10.5,bold:true,fill:C.warn});
    b += t(480,138,"row-major: A(i,j) at i·M + j",{size:9.3,fill:C.dim});
    b += t(480,156,"each core walks a row → cache",{size:9.3,fill:C.dim});
    b += t(480,174,"lines stay hot (4.5) ✓",{size:9.3,fill:C.dim});
    b += t(320,214,"The AoS/SoA decision (M2 L7, 5.7) that you made BY HAND is now a template parameter the compiler flips per",{size:10,fill:C.dim});
    b += t(320,231,"machine. One source file is coalesced on the GPU AND cache-friendly on the CPU — the Kokkos bet in one picture.",{size:10,fill:C.goodT});
    return svg(248,b,"kokkos view layoutleft versus layoutright per backend");
  })();

  /* d6-spaces — execution & memory spaces as template params */
  D["d6-spaces"] = (() => {
    let b = t(320,22,"Spaces as types: where code runs and where data lives, chosen at compile time",{bold:true,size:13});
    b += box(30,44,270,150,{fill:C.box,stroke:C.accS});
    b += t(165,64,"ExecutionSpace",{size:11,bold:true,fill:C.accT});
    for (const [i,l] of ["Cuda / HIP / SYCL (a GPU)","OpenMP (CPU threads)","Serial (one core, for debug)","= 5.3's 'two worlds', as a type"].entries())
      b += t(44,88+i*24,"• "+l,{a:"start",size:9.5,fill:i===3?C.goodT:C.dim});
    b += box(340,44,270,150,{fill:C.box,stroke:C.goodS});
    b += t(475,64,"MemorySpace",{size:11,bold:true,fill:C.goodT});
    for (const [i,l] of ["CudaSpace (device HBM)","HostSpace (system RAM)","SharedSpace (unified/USM)","mismatch → compile error, not a"].entries())
      b += t(354,88+i*24,"• "+l,{a:"start",size:9.5,fill:C.dim});
    b += t(475,184,"3am segfault (3.5 → typed)",{size:9.5,fill:C.goodT});
    b += t(320,214,"TeamPolicy(league, team) = grid of blocks; TeamThreadRange / ThreadVectorRange = 5.5/5.6's hierarchy, portably.",{size:10,fill:C.dim});
    return svg(230,b,"kokkos execution spaces and memory spaces as template parameters");
  })();

  /* d6-dispatch — one parallel_for → four backends */
  D["d6-dispatch"] = (() => {
    let b = t(320,22,"One parallel_for, four backends — chosen by a compile flag",{bold:true,size:13});
    b += box(240,42,160,34,{fill:C.acc,stroke:C.accS});
    b += t(320,64,"parallel_for(N, f)",{size:10.5,bold:true,fill:C.accT});
    const backs=[["CUDA","→ .cubin"],["HIP","→ AMDGCN"],["SYCL","→ SPIR-V"],["OpenMP","→ CPU"]];
    for (let i=0;i<4;i++){
      const x=40+i*150;
      b += ln(320,76,x+65,104,{sw:1.1,dash:true});
      b += box(x,104,130,44,{fill:C.good,stroke:C.goodS});
      b += t(x+65,126,backs[i][0],{size:10.5,bold:true,fill:C.goodT});
      b += t(x+65,142,backs[i][1],{size:9,fill:C.dim});
    }
    b += t(320,174,"-DKokkos_ENABLE_CUDA / _HIP / _SYCL / _OPENMP. The SAME source compiles to every machine in B7's cluster —",{size:10,fill:C.dim});
    b += t(320,191,"that's why labs (LLNL, Sandia) bet decades of code on it. Kokkos 5.1 · used by ~300 HPC projects.",{size:10,fill:C.goodT});
    return svg(206,b,"one kokkos parallel_for dispatched to four backends");
  })();

  /* ---------------- D7 — Triton & MLIR ---------------- */

  /* d7-lowering — the MLIR lowering flow, branching to two ISAs */
  D["d7-lowering"] = (() => {
    let b = t(320,22,"Compilers eat the problem: one Python kernel → two vendor ISAs",{bold:true,size:13});
    const chain=[["@triton.jit Python","you write this once",C.accT],["Triton-IR (TTIR)","block-level MLIR",C.tx],["Triton-GPU-IR (TTGIR)","layouts, warps, tiles",C.tx],["LLVM-IR","gpu → nvvm / rocdl",C.tx]];
    let y=44;
    for (let i=0;i<chain.length;i++){
      b += box(190,y,260,32,{fill:C.box,stroke:C.boxS});
      b += t(320,y+15,chain[i][0],{size:10,bold:true,fill:chain[i][2]});
      b += t(320,y+27,chain[i][1],{size:8.3,fill:C.dim});
      if (i<chain.length-1) b += triU(320,y+38,{stroke:C.line});
      y += 42;
    }
    b += ln(320,y,150,y+16,{sw:1.4}) + ln(320,y,490,y+16,{sw:1.4});
    b += box(50,y+16,200,40,{fill:C.good,stroke:C.goodS});
    b += t(150,y+34,"NVIDIA: → PTX",{size:10,bold:true,fill:C.goodT});
    b += t(150,y+49,"(nvvm)",{size:8.5,fill:C.dim});
    b += box(390,y+16,200,40,{fill:C.good,stroke:C.goodS});
    b += t(490,y+34,"AMD: → AMDGCN / hsaco",{size:10,bold:true,fill:C.goodT});
    b += t(490,y+49,"(rocdl, ROCm 6.2+)",{size:8.5,fill:C.dim});
    b += t(320,y+74,"Same source, both cards. The IR is the portability layer — no hand-porting, no #ifdef forest.",{size:10,fill:C.dim});
    return svg(y+90,b,"triton mlir lowering from python to ptx and amdgcn");
  })();

  /* d7-autotune — machines turn the dial; the honest limit */
  D["d7-autotune"] = (() => {
    let b = t(320,22,"Why the compiler wins: it re-tunes per backend; you can't, at scale",{bold:true,size:13});
    b += box(30,44,280,92,{fill:C.good,stroke:C.goodS});
    b += t(170,64,"@triton.autotune",{size:10.5,bold:true,fill:C.goodT});
    b += t(170,84,"searches BLOCK_SIZE, num_warps,",{size:9.3,fill:C.dim});
    b += t(170,100,"num_stages PER GPU (5.6's dial,",{size:9.3,fill:C.dim});
    b += t(170,116,"turned by a machine not a human)",{size:9.3,fill:C.dim});
    b += box(330,44,280,92,{fill:C.warnFill,stroke:C.warn});
    b += t(470,64,"the honest limit",{size:10.5,bold:true,fill:C.warn});
    b += t(470,84,"absolute-peak tensor-core kernels",{size:9.3,fill:C.dim});
    b += t(470,100,"still beat Triton — vendor lib(cuBLAS,",{size:9.3,fill:C.dim});
    b += t(470,116,"rocBLAS) owns the last few %",{size:9.3,fill:C.dim});
    b += t(320,158,"So the map is: Triton/compilers for the 90% (fused, custom, portable); vendor libraries for the pinned-to-peak 10%.",{size:10,fill:C.dim});
    return svg(176,b,"triton autotune per backend versus vendor library peak");
  })();

  /* ---------------- D8 — honest cross-vendor benchmarking ---------------- */

  /* d8-normalize — cost & watts, not wall time */
  D["d8-normalize"] = (() => {
    let b = t(320,22,"The wall-time winner is not the money winner — normalize before you conclude",{bold:true,size:13});
    b += box(14,40,612,24,{fill:C.acc,stroke:C.accS,r:5});
    const cols=[24,230,360,500];
    for (const [i,h] of ["metric","GPU A (premium)","GPU B (value)","verdict flips"].entries())
      b += t(cols[i],57,h,{a:"start",size:10,bold:true,fill:C.accT});
    const rows=[["throughput","1000 img/s","640 img/s","A (1.6×)","a"],["$/hr (cloud)","$3.20","$1.10","",""],["img / $","≈0.087/$·s","≈0.16/$·s","B (1.8×!)","b"],["watts","700 W","400 W","",""],["img / joule","1.43","1.60","B","b"]];
    let y=78;
    for (const r of rows){
      const flip=r[4]==="b";
      b += t(24,y,r[0],{a:"start",size:9.8,fill:C.tx});
      b += t(230,y,r[1],{a:"start",size:9.6,fill:C.dim});
      b += t(360,y,r[2],{a:"start",size:9.6,fill:C.dim});
      b += t(500,y,r[3],{a:"start",size:9.6,fill:flip?C.goodT:(r[3].startsWith("A")?C.accT:C.dim)});
      b += ln(14,y+6,626,y+6,{stroke:C.boxS,sw:0.8});
      y += 24;
    }
    b += t(320,y+14,"A wins the demo; B wins the datacenter. 'Faster' is meaningless until divided by dollars and watts (4.6's economics).",{size:10,fill:C.warn});
    return svg(y+30,b,"normalizing benchmark by cost and watts flips the winner");
  })();

  /* d8-roofline — % of own ceiling is the only fair number */
  D["d8-roofline"] = (() => {
    let b = t(320,22,"The only fair cross-vendor number: % of each machine's OWN roofline",{bold:true,size:13});
    const rf=(x,label,peak,pct,col)=>{
      let s=box(x,48,250,150,{fill:"#10141d",stroke:C.boxS});
      s+=ln(x+40,180,x+230,180,{sw:1.2})+ln(x+40,180,x+40,60,{sw:1.2});
      s+=ln(x+40,150,x+120,70,{stroke:C.dim2,sw:1.5})+ln(x+120,70,x+230,70,{stroke:C.dim2,sw:1.5});
      s+=t(x+125,64,"peak: "+peak,{size:9,fill:C.dim});
      const yy=70+(150-70)*(1-pct/100);
      s+=`<circle cx="${x+175}" cy="${yy}" r="5" style="fill:${col}"/>`;
      s+=t(x+175,yy-10,pct+"% of own",{size:9.5,bold:true,fill:col});
      s+=t(x+135,192,label,{size:10,bold:true,fill:col});
      return s;
    };
    b += rf(30,"GPU A",  "40 TF",  72, C.accT);
    b += rf(330,"GPU B", "24 TF",  88, C.goodT);
    b += t(320,220,"B reaches a higher FRACTION of its ceiling (88% vs 72%) — the better-utilized kernel — even though A's",{size:10,fill:C.dim});
    b += t(320,237,"absolute peak is higher. Compare utilization first (4.7); THEN decide with cost/watts (left). Wall time alone lies twice.",{size:10,fill:C.warn});
    return svg(252,b,"percent of own roofline compared across two gpus");
  })();

  /* d8-sins — the fake-benchmark autopsy */
  D["d8-sins"] = (() => {
    let b = t(320,22,"The five sins of a cross-vendor benchmark (spot them in any vendor slide)",{bold:true,size:13});
    const sins=[["1. no warmup","cold clocks / JIT counted — M1 L7's ritual skipped"],["2. wall time only","no $/watt normalization (left) — hides the real winner"],["3. different problem sizes","A at N=4096, B at N=1024 — not the same race"],["4. no roofline","'2× faster' with no ceiling = a number without meaning (4.7)"],["5. author's home turf","tuned for A, ported blind to B (the wavefront-32 bug, D2)"]];
    let y=42;
    for (const s of sins){
      b += box(24,y,600,30,{fill:C.bad,stroke:C.badS});
      b += t(38,y+20,s[0],{a:"start",size:10,bold:true,fill:C.badS});
      b += t(200,y+20,s[1],{a:"start",size:9.3,fill:C.dim});
      y += 37;
    }
    b += t(320,y+13,"The defense: same size, warm clocks, % of own roofline, cost+watts, and code EACH vendor would endorse.",{size:10,fill:C.goodT});
    return svg(y+28,b,"five sins of cross vendor gpu benchmarking");
  })();

  /* ---------------- D9 — capstone ---------------- */

  /* d9-map — one algorithm, four backends, one fixture set */
  D["d9-map"] = (() => {
    let b = t(320,22,"Capstone: one reduction, four backends, one shared truth",{bold:true,size:13});
    b += box(250,42,140,36,{fill:C.warnFill,stroke:C.warn});
    b += t(320,60,"reduction spec",{size:10.5,bold:true,fill:C.warn});
    b += t(320,73,"+ shared fixtures (M2 L6)",{size:8,fill:C.dim});
    const backs=[["CUDA","core / 5.8","done"],["HIP","D2","hipify"],["SYCL / Kokkos","D3 / D6","CPU ok"],["WGSL","D5","browser"]];
    for (let i=0;i<4;i++){
      const x=34+i*150;
      b += ln(320,78,x+64,104,{sw:1.1,dash:true});
      b += box(x,104,128,52,{fill:C.acc,stroke:C.accS});
      b += t(x+64,124,backs[i][0],{size:10,bold:true,fill:C.accT});
      b += t(x+64,140,backs[i][1],{size:8.5,fill:C.dim});
      b += t(x+64,152,backs[i][2],{size:8.5,fill:C.goodT});
    }
    b += box(120,176,400,34,{fill:C.good,stroke:C.goodS});
    b += t(320,197,"same fixtures judge all four → identical answer or the port is wrong",{size:9.8,fill:C.goodT});
    for (let i=0;i<4;i++) b += ln(34+i*150+64,156,320,176,{sw:0.9,dash:true});
    b += t(320,228,"The capstone proves the thesis: the core taught ideas, not a vendor. Four backends, one fixture set, one report.",{size:10,fill:C.dim});
    return svg(244,b,"capstone reduction across four backends with shared fixtures");
  })();

  /* d9-report — the portability report anatomy */
  D["d9-report"] = (() => {
    let b = t(320,22,"The deliverable: a portability report a stranger can act on (5.11's bar)",{bold:true,size:13});
    const parts=[["LOC delta table","CUDA 120 · HIP +4 · SYCL 150 · WGSL 180 — effort, measured"],["translation table, filled","every row of D1 with REAL code lines from your four ports"],["% of own roofline / device","D8 — the only fair speed number, per machine"],["'what the last 10% cost'","the tuning each backend needed past the portable 90%"],["machine files (5.1)","driver, toolkit, flags per backend — reproducible by a stranger"],["defense bank","#7: 'hand-port vs Kokkos vs Triton — when each?'"]];
    let y=42;
    for (const p of parts){
      b += box(24,y,600,29,{fill:C.box});
      b += t(38,y+19,p[0],{a:"start",size:10,bold:true,fill:C.accT});
      b += t(250,y+19,p[1],{a:"start",size:9,fill:C.dim});
      y += 35;
    }
    b += t(320,y+13,"This report — not any one kernel — is the portfolio piece: it shows JUDGMENT across vendors, which is the rare skill.",{size:10,fill:C.goodT});
    return svg(y+28,b,"portability capstone report anatomy");
  })();

  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, D);
})();

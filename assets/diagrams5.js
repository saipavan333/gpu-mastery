/* GPU Mastery — Module 5 diagram pack. Registers SVGs on window.DIAGRAMS. */
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
  const svg=(h,body,label)=>`<svg viewBox="0 0 640 ${h}" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="640" height="${h}" rx="10" style="fill:${C.card}"/>${body}</svg>`;
  const D = {};

  /* 5.1a — nvcc: the pipeline, twice */
  D["m5l1-toolchain"] = (() => {
    let b = t(320,22,"nvcc = 3.1's pipeline run TWICE, then stitched",{bold:true,size:13});
    b += box(30,44,120,44,{fill:C.acc,stroke:C.accS}) + t(90,64,"kernel.cu",{size:11,bold:true,fill:C.accT}) + t(90,80,"host + device code",{size:8.5,fill:C.dim});
    b += arrowR(150,66,186);
    b += t(300,52,"HOST path (your g++ — all of Module 3 applies)",{size:9.5,fill:C.dim});
    b += box(190,60,130,34) + t(255,81,"host C++ → .o",{size:10});
    b += t(300,116,"DEVICE path (per architecture!)",{size:9.5,fill:C.dim});
    b += box(190,124,130,34,{fill:C.good,stroke:C.goodS}) + t(255,145,"→ PTX (portable)",{size:10,fill:C.goodT});
    b += arrowR(320,141,350);
    b += box(354,124,130,34,{fill:C.good,stroke:C.goodS}) + t(419,145,"→ SASS (sm_90…)",{size:10,fill:C.goodT});
    b += ln(150,66,190,141,{dash:true,sw:1.2});
    b += box(504,84,112,52,{fill:C.warnFill,stroke:C.warn}) + t(560,106,"fatbinary",{size:10.5,bold:true,fill:C.warn}) + t(560,122,"all archs + PTX",{size:8.5,fill:C.dim});
    b += ln(320,77,504,100,{sw:1.2}) + ln(484,141,504,120,{sw:1.2});
    b += t(320,186,"-arch=sm_75 (Colab T4) · sm_89 (L4) · sm_90 (H100) · sm_120 (RTX 5090) — CUDA 13 dropped ≤ Volta.",{size:10.5,fill:C.accT});
    b += t(320,206,"PTX in the fatbin = forward compatibility: the driver JITs it for GPUs newer than your build.",{size:10.5,fill:C.dim});
    b += t(320,224,"Wrong arch symptom: 'no kernel image available' — 3.1's stage-diagnosis skill, new stage.",{size:10.5,fill:C.dim});
    return svg(238,b,"nvcc splitting cu file into host and device pipelines into a fatbinary");
  })();

  /* 5.1b — the verify ritual */
  D["m5l1-verify"] = (() => {
    let b = t(320,22,"The 60-second verify ritual (driver ≠ toolkit — M2 L7 §5, CUDA row)",{bold:true,size:13});
    b += box(30,46,280,74,{stroke:C.accS});
    b += t(46,68,"$ nvidia-smi",{a:"start",size:11,bold:true,fill:C.accT});
    b += t(46,88,"the DRIVER: GPU model, VRAM, max",{a:"start",size:10});
    b += t(46,104,"CUDA it can run (e.g. 'CUDA 13.3')",{a:"start",size:10});
    b += box(330,46,280,74,{stroke:C.goodS});
    b += t(346,68,"$ nvcc --version",{a:"start",size:11,bold:true,fill:C.goodT});
    b += t(346,88,"the TOOLKIT: what you COMPILE with",{a:"start",size:10});
    b += t(346,104,"(needs: toolkit ≤ driver's max)",{a:"start",size:10});
    b += box(30,136,580,54,{fill:C.warnFill,stroke:C.warn});
    b += t(46,158,"$ nvidia-smi --query-gpu=name,compute_cap --format=csv",{a:"start",size:10.5,fill:C.warn});
    b += t(46,178,"→ 'Tesla T4, 7.5' — YOUR -arch flag, answered by the machine (never guess it)",{a:"start",size:10,fill:C.warn});
    b += t(320,214,"Colab: Runtime → GPU, then run all three in a !-cell. Local: WSL2/Linux per setup.html. Same ritual forever.",{size:10.5,fill:C.dim});
    return svg(228,b,"nvidia-smi versus nvcc version and the compute capability query");
  })();

  /* 5.1c — hello.cu anatomy */
  D["m5l1-hello"] = (() => {
    let b = t(320,22,"hello.cu — every token explained by a module you finished",{bold:true,size:13});
    b += box(30,44,390,190,{fill:"#10141d",stroke:C.boxS});
    b += t(46,68,"#include <cstdio>",{a:"start",size:10.5,fill:C.dim});
    b += t(46,92,"__global__ void hello() {",{a:"start",size:10.5,fill:C.goodT});
    b += t(46,112,"  printf(\"block %d thread %d\\n\",",{a:"start",size:10.5});
    b += t(46,130,"         blockIdx.x, threadIdx.x);",{a:"start",size:10.5});
    b += t(46,148,"}",{a:"start",size:10.5,fill:C.goodT});
    b += t(46,172,"int main() {",{a:"start",size:10.5});
    b += t(46,190,"  hello<<<2, 4>>>();",{a:"start",size:10.5,fill:C.accT});
    b += t(46,208,"  cudaDeviceSynchronize();",{a:"start",size:10.5,fill:C.warn});
    b += t(46,226,"}",{a:"start",size:10.5});
    b += t(436,92,"__global__ = 'runs on GPU,",{a:"start",size:9.5,fill:C.goodT});
    b += t(436,108,"called from CPU' (a 3.1 macro!)",{a:"start",size:9.5,fill:C.dim});
    b += t(436,130,"built-ins: your coordinates",{a:"start",size:9.5,fill:C.dim});
    b += t(436,146,"in the grid (4.4's floor plan)",{a:"start",size:9.5,fill:C.dim});
    b += t(436,190,"<<<blocks, threads>>> = the",{a:"start",size:9.5,fill:C.accT});
    b += t(436,206,"launch config: 2×4 = 8 prints",{a:"start",size:9.5,fill:C.dim});
    b += t(436,226,"async! sync or exit early (5.3)",{a:"start",size:9.5,fill:C.warn});
    b += t(320,258,"$ nvcc -arch=sm_75 hello.cu -o hello && ./hello   →  8 lines, block order NOT guaranteed (4.4's contract).",{size:10.5,fill:C.dim});
    return svg(272,b,"annotated hello cuda kernel with launch syntax");
  })();

  /* 5.2a — grid/block/thread + the formula */
  D["m5l2-hierarchy"] = (() => {
    let b = t(320,22,"grid → blocks → threads, and the one formula that binds them",{bold:true,size:13});
    for (let g=0; g<4; g++){
      b += box(40+g*100,46,88,40,{fill:C.acc,stroke:C.accS});
      b += t(84+g*100,64,"block "+g,{size:9.5,fill:C.accT});
      b += t(84+g*100,78,"blockIdx.x="+g,{size:8,fill:C.dim});
    }
    b += t(485,68,"… gridDim.x = 4",{a:"start",size:9.5,fill:C.dim2});
    b += ln(140,86,140,108,{dash:true,sw:1}) + ln(40,86,60,108,{dash:true,sw:1});
    b += t(60,104,"zoom block 1:",{a:"start",size:9.5,fill:C.dim});
    for (let i=0;i<8;i++){
      b += box(60+i*64,112,56,34,{fill:C.good,stroke:C.goodS});
      b += t(88+i*64,128,"t"+i,{size:9.5,fill:C.goodT});
      b += t(88+i*64,141,"tid="+i,{size:7.5,fill:C.dim});
    }
    b += t(60,168,"blockDim.x = 8 threads per block",{a:"start",size:9.5,fill:C.dim});
    b += box(80,186,480,44,{fill:C.warnFill,stroke:C.warn});
    b += t(320,206,"i = blockIdx.x * blockDim.x + threadIdx.x",{size:13,bold:true,fill:C.warn});
    b += t(320,222,"block 1, thread 3 → i = 1×8 + 3 = 11 — M1 L2's linearization, now a job title",{size:9.5,fill:C.warn});
    b += t(320,254,"Same numbers you simulated in M2 L2's Python launch — the loop became hardware; the formula didn't change.",{size:10.5,fill:C.dim});
    return svg(268,b,"grid of blocks zooming into threads with the global index formula");
  })();

  /* 5.2b — the guard, now official */
  D["m5l2-guard"] = (() => {
    let b = t(320,22,"The guard: launched threads ≥ N, so the last block is ragged",{bold:true,size:13});
    let n=0;
    for (let g=0;g<3;g++){
      b += t(40+g*180+80,52,"block "+g,{size:10,fill:C.dim});
      for (let i=0;i<4;i++){
        const idle = n>9;
        b += box(40+g*180+i*42,60,38,38,idle?{fill:C.bad,stroke:C.badS}:{fill:C.acc,stroke:C.accS});
        b += t(40+g*180+i*42+19,84,idle?"✗":String(n),{size:11,fill:idle?C.badS:C.accT});
        n++;
      }
    }
    b += t(320,128,"grid = (N + B − 1) / B = ceil(10/4) = 3 blocks (M1 L2 → M2 L3's launch_shape → HERE)",{size:10.5,fill:C.accT});
    b += t(320,152,"if (i < N) { y[i] = a*x[i] + y[i]; }   ← threads 10, 11 exist and must do nothing",{size:11,fill:C.goodT});
    b += t(320,180,"Forget it and threads 10–11 write past the array: 3.4's OOB, at warp speed — compute-sanitizer names it (5.4).",{size:10.5,fill:C.dim});
    return svg(194,b,"ceil division launch with guarded ragged block");
  })();

  /* 5.2c — 2D grids for images */
  D["m5l2-2d"] = (() => {
    let b = t(320,22,"2D launches: .x must be the FAST axis (columns) — coalescing depends on it",{bold:true,size:13});
    for (let r=0;r<4;r++) for (let c=0;c<6;c++){
      b += box(40+c*52,46+r*40,48,34,{r:4,fill:(r===1&&c===2)?C.warnFill:C.box,stroke:(r===1&&c===2)?C.warn:C.boxS,sw:1});
    }
    b += t(196,66,"",{size:9});
    b += t(40,222,"image H×W, 16×16 thread blocks:",{a:"start",size:10,fill:C.dim});
    b += box(360,52,256,140,{fill:C.card,stroke:C.boxS});
    b += t(376,76,"int x = blockIdx.x*16 + threadIdx.x;",{a:"start",size:9.5,fill:C.goodT});
    b += t(376,94,"int y = blockIdx.y*16 + threadIdx.y;",{a:"start",size:9.5,fill:C.goodT});
    b += t(376,112,"if (x < W && y < H)",{a:"start",size:9.5,fill:C.accT});
    b += t(376,130,"  out[y*W + x] = f(in[y*W + x]);",{a:"start",size:9.5,fill:C.accT});
    b += t(376,158,"threadIdx.x varies fastest → it must",{a:"start",size:9.5,fill:C.warn});
    b += t(376,176,"index the ROW direction (x = col)",{a:"start",size:9.5,fill:C.warn});
    b += t(40,246,"dim3 grid((W+15)/16, (H+15)/16), block(16,16); — two ceil-divisions, two guards (M2 L8's images, kernel-ready)",{a:"start",size:10,fill:C.dim});
    b += t(320,270,"Swap x/y roles and every warp reads a COLUMN: 32 sectors per load (4.5) — the #1 first-image-kernel bug.",{size:10.5,fill:C.dim});
    return svg(284,b,"two dimensional grid over an image with x as the fast axis");
  })();

  /* 5.3a — two address spaces */
  D["m5l3-spaces"] = (() => {
    let b = t(320,22,"Two worlds, two pointers — same type, NEVER interchangeable",{bold:true,size:13});
    b += box(30,46,280,150,{stroke:C.accS});
    b += t(170,70,"HOST (CPU + DRAM)",{size:11,bold:true,fill:C.accT});
    b += t(46,96,"float *h_x = malloc(bytes);",{a:"start",size:10.5,fill:C.goodT});
    b += t(46,118,"h_x[i] ✓  (3.5's heap)",{a:"start",size:10});
    b += t(46,144,"passing h_x to a kernel:",{a:"start",size:10,fill:C.badS});
    b += t(46,162,"compiles fine → garbage/crash",{a:"start",size:10,fill:C.badS});
    b += t(46,180,"(the address means NOTHING there)",{a:"start",size:9,fill:C.dim});
    b += box(330,46,280,150,{stroke:C.goodS});
    b += t(470,70,"DEVICE (GPU + HBM)",{size:11,bold:true,fill:C.goodT});
    b += t(346,96,"float *d_x;",{a:"start",size:10.5,fill:C.goodT});
    b += t(346,114,"cudaMalloc(&d_x, bytes);  // 3.3's &!",{a:"start",size:10.5,fill:C.goodT});
    b += t(346,140,"d_x[i] in a KERNEL ✓",{a:"start",size:10});
    b += t(346,162,"d_x[i] on the HOST: segfault",{a:"start",size:10,fill:C.badS});
    b += t(346,180,"(3.8's unmapped page, on purpose)",{a:"start",size:9,fill:C.dim});
    b += arrowR(310,120,330,{stroke:C.warn,sw:2});
    b += t(320,226,"The ONLY crossing: cudaMemcpy(dst, src, bytes, direction) — 4.6's bridge with a byte count (n * sizeof *p, 3.5's idiom).",{size:10,fill:C.dim});
    b += t(320,244,"The h_/d_ prefix convention exists because the COMPILER can't tell them apart — your naming is the type system.",{size:10,fill:C.dim});
    return svg(258,b,"host and device pointers as separate address spaces");
  })();

  /* 5.3b — the six-step lifecycle */
  D["m5l3-lifecycle"] = (() => {
    let b = t(320,22,"The lifecycle: six steps, one cleanup path (3.5 §2's shape, GPU edition)",{bold:true,size:13});
    const steps=[["1  cudaMalloc(&d_x, bytes)","allocate on-device (256-B aligned)",C.acc,C.accS],
                 ["2  cudaMemcpy(d_x, h_x, bytes, HostToDevice)","cross the bridge — ONCE (4.6)",C.warnFill,C.warn],
                 ["3  kernel<<<grid, block>>>(d_x, n)","launch — returns IMMEDIATELY (async!)",C.good,C.goodS],
                 ["4  work happens on GPU","CPU is free — overlap opportunity (5.9)",C.good,C.goodS],
                 ["5  cudaMemcpy(h_y, d_y, bytes, DeviceToHost)","blocks until kernel done: implicit sync",C.warnFill,C.warn],
                 ["6  cudaFree(d_x)","one owner, one free (3.5's law)",C.acc,C.accS]];
    for (let i=0;i<6;i++){
      const y=42+i*38;
      b += box(30,y,400,30,{fill:steps[i][2],stroke:steps[i][3],sw:1.2});
      b += t(42,y+19,steps[i][0],{a:"start",size:10});
      b += t(444,y+19,steps[i][1],{a:"start",size:9,fill:C.dim});
      if(i<5) b += ln(50,y+30,50,y+38,{sw:1.2});
    }
    b += t(320,290,"Error path: goto cleanup with cudaFree(NULL)-is-safe — the 3.5 §2 pattern compiles here verbatim.",{size:10.5,fill:C.dim});
    return svg(304,b,"six step cuda memory lifecycle");
  })();

  /* 5.3c — asynchrony: the timeline truth */
  D["m5l3-async"] = (() => {
    let b = t(320,22,"Launches are async: the CPU runs ahead — know your sync points",{bold:true,size:13});
    b += t(30,56,"CPU:",{a:"start",size:10,fill:C.accT});
    b += box(80,44,90,20,{r:4,fill:C.acc,stroke:C.accS,sw:1}) + t(125,58,"launch K",{size:8.5});
    b += box(174,44,120,20,{r:4,fill:C.acc,stroke:C.accS,sw:1}) + t(234,58,"host code runs on",{size:8.5});
    b += box(298,44,150,20,{r:4,fill:C.warnFill,stroke:C.warn,sw:1}) + t(373,58,"memcpy D2H: BLOCKS…",{size:8.5,fill:C.warn});
    b += box(452,44,80,20,{r:4,fill:C.acc,stroke:C.accS,sw:1}) + t(492,58,"resumes",{size:8.5});
    b += t(30,100,"GPU:",{a:"start",size:10,fill:C.goodT});
    b += box(174,88,200,20,{r:4,fill:C.good,stroke:C.goodS,sw:1}) + t(274,102,"kernel K executes",{size:8.5,fill:C.goodT});
    b += box(378,88,70,20,{r:4,fill:C.warnFill,stroke:C.warn,sw:1}) + t(413,102,"copy",{size:8.5,fill:C.warn});
    b += ln(125,64,174,88,{dash:true,sw:1});
    b += t(320,140,"Implicit syncs: cudaMemcpy (plain), cudaDeviceSynchronize, cudaFree. Everything else queues.",{size:10.5,fill:C.accT});
    b += t(320,162,"Consequence 1: CPU timers around a bare launch measure ~5 µs of NOTHING (3.1 P6's law) — events time GPUs (5.9).",{size:10,fill:C.dim});
    b += t(320,180,"Consequence 2: a kernel's error may surface LINES LATER at the next sync — 5.4's whole subject.",{size:10,fill:C.dim});
    return svg(194,b,"cpu timeline running ahead of gpu kernel until blocking memcpy");
  })();

  /* 5.4a — errors surface late */
  D["m5l4-sticky"] = (() => {
    let b = t(320,22,"Async errors surface at the NEXT check — the message names the wrong line",{bold:true,size:13});
    const cells=[["launch A ✓",C.acc,C.accS],["launch B — OOB write!",C.bad,C.badS],["launch C ✓(queued)",C.acc,C.accS],["memcpy → returns B's error",C.warnFill,C.warn]];
    for (let i=0;i<4;i++){
      b += box(30+i*152,46,140,40,{fill:cells[i][1],stroke:cells[i][2],sw:1.3});
      b += t(100+i*152,70,cells[i][0],{size:9.5});
      if(i<3) b += arrowR(170+i*152,66,182+i*152);
    }
    b += t(320,116,"You'll stare at the memcpy; the crime was two calls earlier. (3.5 P4's 'crash inside free' — same shape.)",{size:10.5,fill:C.dim});
    b += box(30,134,580,74,{fill:C.card,stroke:C.boxS});
    b += t(46,156,"two error kinds:  NON-STICKY (bad args: invalid config) — returned at the call, recoverable",{a:"start",size:10,fill:C.goodT});
    b += t(46,176,"STICKY (kernel crashed the context: OOB, illegal access) — EVERY later call fails;",{a:"start",size:10,fill:C.badS});
    b += t(46,194,"the process must exit. cudaGetLastError() peeks; sync-then-check localizes.",{a:"start",size:10,fill:C.dim});
    b += t(320,232,"Debug ritual: CUDA_LAUNCH_BLOCKING=1 makes every launch synchronous — errors land on their true line (dev only!).",{size:10.5,fill:C.accT});
    return svg(246,b,"asynchronous cuda error surfacing at a later synchronization");
  })();

  /* 5.4b — CUDA_CHECK anatomy */
  D["m5l4-check"] = (() => {
    let b = t(320,22,"CUDA_CHECK — the 3.3 P7 macro, delivered as promised",{bold:true,size:13});
    b += box(30,44,450,120,{fill:"#10141d",stroke:C.boxS});
    b += t(46,68,"#define CUDA_CHECK(call) do {                      \\",{a:"start",size:10,fill:C.goodT});
    b += t(46,88,"  cudaError_t e = (call);                          \\",{a:"start",size:10});
    b += t(46,108,"  if (e != cudaSuccess) {                          \\",{a:"start",size:10});
    b += t(46,128,"    fprintf(stderr, \"%s:%d %s\\n\", __FILE__,       \\",{a:"start",size:10});
    b += t(46,148,"      __LINE__, cudaGetErrorString(e)); exit(1); } } while(0)",{a:"start",size:10});
    b += t(500,68,"wraps EVERY api call",{a:"start",size:9,fill:C.dim});
    b += t(500,108,"file:line + human text",{a:"start",size:9,fill:C.dim});
    b += t(500,128,"(M2 L6: fail loudly,",{a:"start",size:9,fill:C.dim});
    b += t(500,146,"fail located)",{a:"start",size:9,fill:C.dim});
    b += t(30,192,"kernels don't return errors — the launch-check PAIR:",{a:"start",size:10.5,fill:C.accT});
    b += t(30,212,"k<<<g,b>>>(...); CUDA_CHECK(cudaGetLastError());        // launch-config errors (now)",{a:"start",size:10,fill:C.dim});
    b += t(30,230,"CUDA_CHECK(cudaDeviceSynchronize());                    // execution errors (after) — debug builds",{a:"start",size:10,fill:C.dim});
    b += t(320,258,"Unchecked CUDA calls are 3.1's ignored warnings, with worse consequences. Every call. No exceptions.",{size:10.5,fill:C.dim});
    return svg(272,b,"cuda check macro anatomy and the launch check pair");
  })();

  /* 5.4c — compute-sanitizer report */
  D["m5l4-sanitizer"] = (() => {
    let b = t(320,22,"compute-sanitizer: ASan's GPU twin — you already read this report (3.8)",{bold:true,size:13});
    b += box(30,44,400,164,{fill:"#10141d",stroke:C.boxS});
    b += t(46,68,"========= Invalid __global__ write of size 4",{a:"start",size:10,fill:C.badS});
    b += t(46,88,"=========     at saxpy(float*,float*,int)+0x90",{a:"start",size:10,fill:C.accT});
    b += t(46,108,"=========     by thread (10,0,0) in block (2,0,0)",{a:"start",size:10,fill:C.warn});
    b += t(46,128,"=========     Address 0x7f4d00428 is out of bounds",{a:"start",size:10});
    b += t(46,148,"=========     …8 bytes after 40-byte allocation",{a:"start",size:10,fill:C.goodT});
    b += t(46,176,"========= ERROR SUMMARY: 2 errors",{a:"start",size:10,fill:C.dim});
    b += t(446,68,"① what + size",{a:"start",size:9.5,fill:C.badS});
    b += t(446,88,"② which KERNEL",{a:"start",size:9.5,fill:C.accT});
    b += t(446,108,"③ WHICH THREAD —",{a:"start",size:9.5,fill:C.warn});
    b += t(446,124,"i = 2×4+10... the",{a:"start",size:9.5,fill:C.dim});
    b += t(446,140,"guard failed! (5.2)",{a:"start",size:9.5,fill:C.dim});
    b += t(446,160,"④⑤ birthplace math:",{a:"start",size:9.5,fill:C.goodT});
    b += t(446,176,"3.8's ⑤, verbatim",{a:"start",size:9.5,fill:C.goodT});
    b += t(320,232,"$ compute-sanitizer ./prog  (memcheck default; racecheck for 5.5's __syncthreads bugs; initcheck for 3.2's ghosts)",{size:10,fill:C.dim});
    b += t(320,250,"The thread/block coordinates turn 100,000 suspects into ONE — then the 5.2 formula tells you which element.",{size:10.5,fill:C.accT});
    return svg(264,b,"compute sanitizer report annotated like asan");
  })();

  /* 5.5a — the tiled matmul choreography */
  D["m5l5-tiles"] = (() => {
    let b = t(320,22,"Tiled matmul: the 3.9 blocking you measured, now explicit code",{bold:true,size:13});
    const g=(x,y,n,hot,col)=>{let s="";for(let r=0;r<3;r++)for(let c=0;c<3;c++){const h=hot(r,c);s+=box(x+c*30,y+r*26,26,22,{r:3,fill:h?col:C.box,stroke:h?C.accS:C.boxS,sw:1});}return s;};
    b += t(85,50,"A (global)",{size:9.5,fill:C.dim});
    b += g(40,58,3,(r,c)=>r===1,C.acc);
    b += t(85,152,"band row 1",{size:8.5,fill:C.dim2});
    b += t(215,50,"B (global)",{size:9.5,fill:C.dim});
    b += g(170,58,3,(r,c)=>c===1,C.acc);
    b += t(215,152,"band col 1",{size:8.5,fill:C.dim2});
    b += arrowR(268,96,300,{stroke:C.goodS,sw:2});
    b += box(304,58,140,80,{fill:C.good,stroke:C.goodS});
    b += t(374,80,"__shared__ sA, sB",{size:10,fill:C.goodT});
    b += t(374,98,"one T×T tile each",{size:9,fill:C.dim});
    b += t(374,116,"(fast: 4.5's board)",{size:9,fill:C.dim});
    b += arrowR(444,96,476,{stroke:C.goodS,sw:2});
    b += t(540,50,"C tile (regs)",{size:9.5,fill:C.dim});
    b += g(480,58,3,(r,c)=>r===1&&c===1,C.warnFill);
    b += box(30,176,580,86,{fill:C.card,stroke:C.boxS});
    b += t(46,198,"for (phase = 0; phase < K/T; phase++) {",{a:"start",size:10,fill:C.accT});
    b += t(46,216,"  load my A-elem, my B-elem into sA, sB;   __syncthreads();   // tile ready",{a:"start",size:10});
    b += t(46,234,"  for (k = 0; k < T; k++) acc += sA[ty][k] * sB[k][tx];",{a:"start",size:10});
    b += t(46,252,"  __syncthreads();                                            // done reading",{a:"start",size:10});
    b += t(320,286,"Each global element is loaded ONCE per tile instead of once per USE: T× fewer HBM trips (next diagram prices it).",{size:10.5,fill:C.dim});
    return svg(300,b,"tiled matmul staging bands through shared memory tiles");
  })();

  /* 5.5b — the reuse arithmetic */
  D["m5l5-reuse"] = (() => {
    let b = t(320,22,"What tiling buys, in M1 L3's currency",{bold:true,size:13});
    b += box(30,46,285,120,{stroke:C.badS});
    b += t(172,70,"naive kernel",{size:11,bold:true,fill:C.badS});
    b += t(46,94,"each C element: reads 2K globals",{a:"start",size:10});
    b += t(46,114,"AI ≈ 2K FLOPs / 8K bytes = 0.25",{a:"start",size:10,fill:C.badS});
    b += t(46,136,"→ deep in the memory slope (4.7):",{a:"start",size:10,fill:C.dim});
    b += t(46,154,"~1–3% of peak, forever",{a:"start",size:10,fill:C.dim});
    b += box(325,46,285,120,{stroke:C.goodS});
    b += t(467,70,"tiled, T = 32",{size:11,bold:true,fill:C.goodT});
    b += t(341,94,"each global read serves T uses",{a:"start",size:10});
    b += t(341,114,"AI ≈ T/4 × (2K/2K) → ~8 FLOP/B",{a:"start",size:10,fill:C.goodT});
    b += t(341,136,"32× less HBM traffic — the dot",{a:"start",size:10,fill:C.dim});
    b += t(341,154,"climbs the roofline slope 32×",{a:"start",size:10,fill:C.dim});
    b += t(320,192,"Still left of the ridge (58+)! Shared memory's own bandwidth becomes the next wall — register tiling (5.11)",{size:10.5,fill:C.dim});
    b += t(320,210,"repeats the SAME trick one level up the 4.5 board. The memory hierarchy is optimized recursively.",{size:10.5,fill:C.dim});
    return svg(224,b,"arithmetic intensity raised from quarter to eight by tiling");
  })();

  /* 5.5c — why TWO syncs */
  D["m5l5-race"] = (() => {
    let b = t(320,22,"Why BOTH __syncthreads(): the race the second one prevents",{bold:true,size:13});
    b += t(30,52,"fast warp:",{a:"start",size:9.5,fill:C.accT});
    b += box(110,42,90,18,{r:3,fill:C.good,stroke:C.goodS,sw:1}) + t(155,55,"compute k-loop",{size:8});
    b += box(204,42,120,18,{r:3,fill:C.bad,stroke:C.badS,sw:1}) + t(264,55,"load NEXT tile into sA!",{size:8,fill:C.badS});
    b += t(30,88,"slow warp:",{a:"start",size:9.5,fill:C.warn});
    b += box(110,78,150,18,{r:3,fill:C.good,stroke:C.goodS,sw:1}) + t(185,91,"…still reading sA (old tile)",{size:8});
    b += ln(264,60,220,78,{stroke:C.badS,sw:1.6,dash:true});
    b += t(320,120,"Without sync #2, the fast warp overwrites data the slow warp is still reading: silent wrong numbers,",{size:10.5,fill:C.badS});
    b += t(320,138,"only under load, only sometimes — a 3.8-grade heisenbug in six characters of omission.",{size:10.5,fill:C.badS});
    b += t(320,166,"Detector: compute-sanitizer --tool racecheck names both accesses (5.4). Rule: sync AFTER writing shared,",{size:10.5,fill:C.goodT});
    b += t(320,184,"sync AFTER done reading — and NEVER put __syncthreads inside a divergent branch (deadlock: 5.6).",{size:10.5,fill:C.goodT});
    return svg(198,b,"race between warps on shared tile without second syncthreads");
  })();

  /* 5.6a — divergence at code level */
  D["m5l6-divergence"] = (() => {
    let b = t(320,22,"Divergence in code: the warp runs BOTH sides, masked",{bold:true,size:13});
    b += box(30,44,280,70,{fill:"#10141d",stroke:C.boxS});
    b += t(46,68,"if (tid % 2) out[i] = f(x[i]);",{a:"start",size:10.5,fill:C.badS});
    b += t(46,88,"else         out[i] = g(x[i]);",{a:"start",size:10.5,fill:C.badS});
    b += t(46,106,"// intra-warp coin flip",{a:"start",size:9,fill:C.dim});
    b += t(330,58,"pass 1: f() — odd lanes on, even masked",{a:"start",size:9.5,fill:C.dim});
    b += t(330,76,"pass 2: g() — even on, odd masked",{a:"start",size:9.5,fill:C.dim});
    b += t(330,96,"cost ≈ f + g: ~2× (4.4 Ex.2's ledger)",{a:"start",size:9.5,fill:C.warn});
    b += box(30,130,280,70,{fill:"#10141d",stroke:C.boxS});
    b += t(46,154,"if (blockIdx.x % 2) …    // uniform",{a:"start",size:10.5,fill:C.goodT});
    b += t(46,174,"out[i] = c ? f1 : f2;    // select",{a:"start",size:10.5,fill:C.goodT});
    b += t(46,192,"val = fmaxf(x[i], 0.f);  // ReLU!",{a:"start",size:10.5,fill:C.goodT});
    b += t(330,150,"whole warp agrees → one pass, free",{a:"start",size:9.5,fill:C.dim});
    b += t(330,170,"predication: no branch exists at all",{a:"start",size:9.5,fill:C.dim});
    b += t(330,190,"(4.1 Ex.2's kit, now native dialect)",{a:"start",size:9.5,fill:C.dim});
    b += t(320,226,"Audit every if by 4.4 P6's verdicts: guard=fine · uniform=free · selectable=rewrite · coin-flip=sort or pay.",{size:10.5,fill:C.dim});
    return svg(240,b,"divergent branch executing both passes versus uniform and predicated forms");
  })();

  /* 5.6b — the occupancy dial */
  D["m5l6-dial"] = (() => {
    let b = t(320,22,"Occupancy: three budgets, lowest wins (your 4.4 Ex.1 calculator, on-die)",{bold:true,size:13});
    const rows=[["registers: 65,536 per SM","kernel: 64/thread × 256 = 16K/block → 4 blocks",256,C.badS],
                ["shared: 228 KB per SM","kernel: 8 KB/block → 28 blocks",520,C.goodS],
                ["threads: 2048 (64 warps)","256/block → 8 blocks",420,C.goodS]];
    for (let i=0;i<3;i++){
      const y=48+i*62;
      b += t(30,y+12,rows[i][0],{a:"start",size:10.5,fill:C.accT});
      b += box(30,y+20,560,14,{r:4,fill:C.card,stroke:C.boxS,sw:1});
      b += box(30,y+20,rows[i][2],14,{r:4,fill:i===0?C.bad:C.good,stroke:rows[i][3],sw:1});
      b += t(30,y+50,rows[i][1],{a:"start",size:9.5,fill:C.dim});
    }
    b += t(320,246,"BINDING: registers → 4 blocks × 8 warps = 32/64 = 50% occupancy. The fix lives in the KERNEL (fewer live",{size:10.5,fill:C.warn});
    b += t(320,264,"locals — 3.9's hoisting), or accept it: 50% with high ILP often beats 100% with spills (next diagram).",{size:10.5,fill:C.dim});
    return svg(278,b,"three occupancy budgets with registers binding at fifty percent");
  })();

  /* 5.6c — the spill cliff */
  D["m5l6-spill"] = (() => {
    let b = t(320,22,"The spill cliff: forcing occupancy can move data to SLOW memory",{bold:true,size:13});
    b += t(30,52,"regs/thread:",{a:"start",size:9.5,fill:C.dim});
    const pts=[["40","OK: 6 blocks",C.good],["36","OK: 7 blocks",C.good],["32","full occupancy!",C.good],["28 (forced)","SPILLS → HBM 'local'!",C.bad]];
    for (let i=0;i<4;i++){
      b += box(130+i*124,40,116,44,{fill:pts[i][2],stroke:i===3?C.badS:C.goodS,sw:1.2});
      b += t(188+i*124,58,pts[i][0],{size:10,bold:true});
      b += t(188+i*124,74,pts[i][1],{size:7.8,fill:i===3?C.badS:C.dim});
    }
    b += t(320,112,"-maxrregcount / __launch_bounds__ NEGOTIATE with the compiler (3.9 P3's foreshadow) — below the kernel's",{size:10.5,fill:C.dim});
    b += t(320,130,"natural need, it spills: every 'register' access becomes a memory access. Occupancy ↑, throughput ↓.",{size:10.5,fill:C.dim});
    b += t(320,158,"Verdict by measurement: ncu shows spill counts (5.10). Occupancy is a means (4.4 quiz 1) — never a score.",{size:10.5,fill:C.goodT});
    return svg(172,b,"register reduction causing spills to local memory");
  })();

  /* 5.7a — access patterns in code */
  D["m5l7-code"] = (() => {
    let b = t(320,22,"The sector drill (4.5 Ex.1), applied to kernel lines",{bold:true,size:13});
    const rows=[["y[i] = a*x[i] + y[i];","i = bid*bdim + tid","4 sectors — perfect",C.goodS,C.goodT],
                ["out[i] = in[i * 8];","stride-8 floats","32 sectors — 12.5%",C.badS,C.badS],
                ["v = pts[i].y;  (float3 AoS)","12-B stride","~12 sectors — 33%",C.badS,C.badS],
                ["out[y*W + x] …  x from tid.x","2D done right (5.2)","4 sectors per warp row",C.goodS,C.goodT]];
    for (let i=0;i<4;i++){
      const y=44+i*52;
      b += box(30,y,300,40,{fill:"#10141d",stroke:C.boxS});
      b += t(44,y+25,rows[i][0],{a:"start",size:10,fill:C.tx});
      b += t(344,y+16,rows[i][1],{a:"start",size:9.5,fill:C.dim});
      b += t(344,y+34,rows[i][2],{a:"start",size:10,fill:rows[i][4]});
    }
    b += t(320,272,"Fixes, in order of preference: index the fast axis with tid.x (free) · SoA the structs (3.4 §3) ·",{size:10.5,fill:C.dim});
    b += t(320,290,"stage through shared to RESHAPE access (the transpose move) · float4 for instruction economy (4.5 q1).",{size:10.5,fill:C.dim});
    return svg(304,b,"four kernel access lines with their sector verdicts");
  })();

  /* 5.7b — transpose before/after */
  D["m5l7-transpose"] = (() => {
    let b = t(320,22,"The transpose fix: stage through shared so BOTH sides coalesce",{bold:true,size:13});
    b += box(30,44,285,108,{stroke:C.badS});
    b += t(172,64,"naive",{size:10.5,bold:true,fill:C.badS});
    b += t(46,86,"out[x*H + y] = in[y*W + x];",{a:"start",size:10,fill:C.tx});
    b += t(46,108,"read ✓ coalesced · write ✗ stride-H",{a:"start",size:9.5,fill:C.badS});
    b += t(46,128,"traffic ≈ 4.5× floor (predicted 4.5,",{a:"start",size:9.5,fill:C.dim});
    b += t(46,144,"measured in this lesson)",{a:"start",size:9.5,fill:C.dim});
    b += box(325,44,285,108,{stroke:C.goodS});
    b += t(467,64,"tiled + padded",{size:10.5,bold:true,fill:C.goodT});
    b += t(341,84,"__shared__ float t[32][33];  // +1!",{a:"start",size:9.5,fill:C.goodT});
    b += t(341,102,"t[ty][tx] = in[...];  __syncthreads();",{a:"start",size:9.5});
    b += t(341,120,"out[...] = t[tx][ty]; // swapped idx",{a:"start",size:9.5});
    b += t(341,140,"both sides stride-1 · banks clean",{a:"start",size:9.5,fill:C.goodT});
    b += t(320,178,"The tile ABSORBS the stride: global sees two coalesced passes; the transpose happens in shared memory,",{size:10.5,fill:C.dim});
    b += t(320,196,"where 'stride' costs banks not sectors — and the 33 pays that bill (M1 L2's phantom column, final form).",{size:10.5,fill:C.dim});
    return svg(210,b,"naive transpose versus shared memory staged transpose with padding");
  })();

  /* 5.7c — float4 vectorized access */
  D["m5l7-float4"] = (() => {
    let b = t(320,22,"float4: same bytes, quarter the instructions",{bold:true,size:13});
    b += box(30,44,285,86,{stroke:C.boxS});
    b += t(46,66,"float loads ×4:",{a:"start",size:10,fill:C.dim});
    b += t(46,86,"4 load instrs + 4 index computes",{a:"start",size:10});
    b += t(46,106,"per thread per 16 B",{a:"start",size:10});
    b += box(325,44,285,86,{stroke:C.goodS});
    b += t(341,66,"float4 v = ((float4*)x)[i];",{a:"start",size:10,fill:C.goodT});
    b += t(341,86,"1 instr, 16-B aligned by TYPE",{a:"start",size:10});
    b += t(341,106,"(M1 L1 masks, guaranteed)",{a:"start",size:10,fill:C.dim});
    b += t(320,156,"Traffic identical (4.5 quiz 1!) — the win is issue slots: fewer instructions = more latency-hiding headroom (4.4 §1).",{size:10,fill:C.dim});
    b += t(320,174,"Requires N%4 handling (a scalar tail — M1 L2's ragged block, again) and 16-B aligned base (cudaMalloc: ✓).",{size:10,fill:C.dim});
    return svg(188,b,"four scalar loads versus one float4 load");
  })();

  /* 5.8a — block reduction tree */
  D["m5l8-tree"] = (() => {
    let b = t(320,22,"Block reduction: M1 L3's staircase in shared memory",{bold:true,size:13});
    const widths=[256,128,64,32];
    for (let lvl=0;lvl<4;lvl++){
      const y=48+lvl*46, w=widths[lvl];
      const bw = Math.max(40, 440*w/256);
      b += box(40,y,bw,26,{r:5,fill:lvl===3?C.warnFill:C.acc,stroke:lvl===3?C.warn:C.accS,sw:1.2});
      b += t(40+bw/2,y+17,w+" active",{size:9.5});
      b += t(40+bw+14,y+17,lvl<3?("+"+(w/2)+" pairs · sync"):"→ warp shuffles (no sync)",{a:"start",size:9,fill:lvl===3?C.warn:C.dim});
    }
    b += t(320,246,"for (s = blockDim.x/2; s > 32; s >>= 1) { if (tid < s) sm[tid] += sm[tid+s]; __syncthreads(); }",{size:10.5,fill:C.accT});
    b += t(320,268,"tid < s keeps active threads CONTIGUOUS — early warps fully on, late warps fully off: divergence-free (5.6!).",{size:10.5,fill:C.goodT});
    b += t(320,286,"log₂(256) = 8 levels (M1 L3) — and the tree order is MORE accurate than serial (M1 L8 §3, cashing out).",{size:10.5,fill:C.dim});
    return svg(300,b,"shared memory reduction halving with syncthreads per level");
  })();

  /* 5.8b — warp shuffle finish */
  D["m5l8-shuffle"] = (() => {
    let b = t(320,22,"The last 32: register-to-register shuffles, no shared, no sync",{bold:true,size:13});
    const offs=[16,8,4,2,1];
    for (let i=0;i<5;i++){
      b += box(40+i*116,44,104,40,{fill:C.good,stroke:C.goodS,sw:1.2});
      b += t(92+i*116,62,"+= shfl_down("+offs[i]+")",{size:9});
      b += t(92+i*116,78,(32>>i)+" → "+(16>>i)+" values",{size:8,fill:C.dim});
      if(i<4) b += arrowR(144+i*116,64,156+i*116);
    }
    b += t(320,112,"v += __shfl_down_sync(0xffffffff, v, off);   // lanes exchange REGISTERS directly (4.4's third consequence)",{size:10.5,fill:C.accT});
    b += t(320,134,"The full mask 0xffffffff is M1 L1's bits naming which lanes participate — post-Volta explicitness (4.4 §2).",{size:10,fill:C.dim});
    b += t(320,152,"5 steps for a warp (log₂32 — M1 L3), zero shared traffic: this is why fast reductions finish in shuffles.",{size:10,fill:C.dim});
    return svg(166,b,"warp shuffle down reduction in five steps");
  })();

  /* 5.8c — grid-level finish */
  D["m5l8-grid"] = (() => {
    let b = t(320,22,"Grid level: how 4,000 block-partials become one number",{bold:true,size:13});
    b += box(30,44,285,110,{stroke:C.accS});
    b += t(172,64,"(a) atomic finish",{size:10.5,bold:true,fill:C.accT});
    b += t(46,86,"if (tid==0) atomicAdd(out, part);",{a:"start",size:9.5,fill:C.tx});
    b += t(46,108,"one line · 4,000 atomics (fine — 4.5)",{a:"start",size:9.5,fill:C.dim});
    b += t(46,128,"⚠ float order varies run-to-run:",{a:"start",size:9.5,fill:C.warn});
    b += t(46,144,"non-deterministic ulps (M1 L8 §5)",{a:"start",size:9.5,fill:C.warn});
    b += box(325,44,285,110,{stroke:C.goodS});
    b += t(467,64,"(b) two-pass finish",{size:10.5,bold:true,fill:C.goodT});
    b += t(341,86,"kernel 1: N → 4,000 partials",{a:"start",size:9.5});
    b += t(341,104,"kernel 2: 4,000 → 1 (one block)",{a:"start",size:9.5});
    b += t(341,126,"fixed order → bitwise reproducible",{a:"start",size:9.5,fill:C.goodT});
    b += t(341,144,"(3.9's determinism design, on GPU)",{a:"start",size:9.5,fill:C.dim});
    b += t(320,180,"Same choice as M1 L8 P7 and torch's deterministic mode: speed+simplicity vs reproducibility. Choose ON PURPOSE,",{size:10.5,fill:C.dim});
    b += t(320,198,"document in the report — and remember both are MORE accurate than a serial CPU sum (tree order).",{size:10.5,fill:C.dim});
    return svg(212,b,"atomic finish versus deterministic two pass reduction");
  })();

  /* 5.9a — streams overlap (API edition) */
  D["m5l9-streams"] = (() => {
    let b = t(320,22,"Streams: 4.6's overlap diagram, now with the API that builds it",{bold:true,size:13});
    b += t(30,52,"one stream (default):",{a:"start",size:9.5,fill:C.dim});
    b += box(190,42,120,18,{r:3,fill:C.bad,stroke:C.badS,sw:1}) + t(250,55,"H2D",{size:8.5});
    b += box(314,42,120,18,{r:3,fill:C.good,stroke:C.goodS,sw:1}) + t(374,55,"kernel",{size:8.5});
    b += box(438,42,120,18,{r:3,fill:C.warnFill,stroke:C.warn,sw:1}) + t(498,55,"D2H",{size:8.5});
    b += t(30,92,"3 streams, chunked:",{a:"start",size:9.5,fill:C.dim});
    const cw=96;
    for (let i=0;i<4;i++) b += box(190+i*cw,82,cw-6,16,{r:3,fill:C.bad,stroke:C.badS,sw:1}) + t(190+i*cw+cw/2-3,94,"in"+i,{size:8});
    for (let i=0;i<4;i++) b += box(190+67+i*cw,102,cw-6,16,{r:3,fill:C.good,stroke:C.goodS,sw:1}) + t(190+67+i*cw+cw/2-3,114,"k"+i,{size:8});
    for (let i=0;i<3;i++) b += box(190+134+i*cw,122,cw-6,16,{r:3,fill:C.warnFill,stroke:C.warn,sw:1}) + t(190+134+i*cw+cw/2-3,134,"out"+i,{size:8});
    b += box(30,158,580,74,{fill:C.card,stroke:C.boxS});
    b += t(46,180,"cudaStream_t s[3]; cudaStreamCreate(&s[i]);",{a:"start",size:10,fill:C.accT});
    b += t(46,198,"cudaMemcpyAsync(d, h, bytes, H2D, s[c%3]);   // PINNED host memory required (4.6 §4)",{a:"start",size:10});
    b += t(46,216,"kernel<<<g, b, 0, s[c%3]>>>(…);              // 4th launch param = the stream",{a:"start",size:10});
    b += t(320,256,"Rules: same-stream ops are ordered; cross-stream ops MAY overlap; plain cudaMemcpy or default-stream use",{size:10.5,fill:C.dim});
    b += t(320,274,"serializes everything. Verify overlap in the nsys TIMELINE (5.10) — never by assumption (4.6's gotcha).",{size:10.5,fill:C.dim});
    return svg(288,b,"serial stream versus three chunked overlapping streams with api calls");
  })();

  /* 5.9b — event timing */
  D["m5l9-events"] = (() => {
    let b = t(320,22,"Events: the only honest GPU stopwatch (CPU timers measure the queue)",{bold:true,size:13});
    b += box(30,44,580,110,{fill:"#10141d",stroke:C.boxS});
    b += t(46,68,"cudaEvent_t t0, t1; cudaEventCreate(&t0); cudaEventCreate(&t1);",{a:"start",size:10});
    b += t(46,88,"cudaEventRecord(t0);                 // a marker dropped INTO the stream",{a:"start",size:10,fill:C.accT});
    b += t(46,108,"kernel<<<g, b>>>(…);                 // repeats + warmup: M1 L7 still rules",{a:"start",size:10});
    b += t(46,128,"cudaEventRecord(t1); cudaEventSynchronize(t1);",{a:"start",size:10,fill:C.accT});
    b += t(46,146,"cudaEventElapsedTime(&ms, t0, t1);   // GPU clock, µs-resolution",{a:"start",size:10,fill:C.goodT});
    b += t(320,178,"Events record when the GPU REACHES them in stream order — they time device work, not the CPU's launch cost",{size:10.5,fill:C.dim});
    b += t(320,196,"(5.3's async trap, solved). Sync the EVENT, not the device: surgical waiting (4.6 P5's rule).",{size:10.5,fill:C.dim});
    return svg(210,b,"cuda event timing pattern");
  })();

  /* 5.9c — pinned memory path */
  D["m5l9-pinned"] = (() => {
    let b = t(320,22,"Pageable vs pinned: the hidden bounce (4.6 §4, now the API)",{bold:true,size:13});
    b += t(30,52,"malloc'd host buffer:",{a:"start",size:9.5,fill:C.badS});
    b += box(190,42,110,20,{r:4}) + t(245,56,"pageable",{size:8.5});
    b += arrowR(300,52,330) + box(334,42,130,20,{r:4,fill:C.warnFill,stroke:C.warn,sw:1}) + t(399,56,"driver staging copy",{size:8,fill:C.warn});
    b += arrowR(464,52,494) + box(498,42,110,20,{r:4,fill:C.good,stroke:C.goodS,sw:1}) + t(553,56,"DMA to GPU",{size:8.5});
    b += t(30,96,"cudaMallocHost:",{a:"start",size:9.5,fill:C.goodT});
    b += box(190,86,110,20,{r:4,fill:C.good,stroke:C.goodS,sw:1}) + t(245,100,"PINNED",{size:8.5,fill:C.goodT});
    b += arrowR(300,96,494,{stroke:C.goodS,sw:2}) ;
    b += box(498,86,110,20,{r:4,fill:C.good,stroke:C.goodS,sw:1}) + t(553,100,"DMA direct",{size:8.5});
    b += t(320,138,"~2× copy bandwidth, and cudaMemcpyAsync is only truly async FROM pinned memory (the 4.6 requirement's why).",{size:10.5,fill:C.dim});
    b += t(320,156,"Discipline: a reusable pinned pool for transfer buffers (3.5 §4's arena) — never pin casually at scale (4.6 gotcha).",{size:10.5,fill:C.dim});
    return svg(170,b,"pageable staging bounce versus pinned direct dma");
  })();

  /* 5.10a — the optimization loop */
  D["m5l10-loop"] = (() => {
    let b = t(320,22,"The optimization loop: M2 L6's method with sharper instruments",{bold:true,size:13});
    const steps=[["MEASURE","events, medians (M1 L7)",C.acc,C.accS],
                 ["LOCATE","nsys: which kernel/gap?",C.acc,C.accS],
                 ["DIAGNOSE","ncu: which roof? which %?",C.warnFill,C.warn],
                 ["ONE CHANGE","a NAMED lever (this module)",C.good,C.goodS],
                 ["RE-MEASURE","keep or REVERT + document",C.acc,C.accS]];
    for (let i=0;i<5;i++){
      const x=24+i*124;
      b += box(x,48,112,56,{fill:steps[i][2],stroke:steps[i][3],sw:1.4});
      b += t(x+56,70,steps[i][0],{size:10.5,bold:true});
      b += t(x+56,90,steps[i][1],{size:8,fill:C.dim});
      if(i<4) arrowR(x+112,76,x+124), b += arrowR(x+112,76,x+124);
    }
    b += ln(580,104,580,130) + ln(580,130,80,130) + ln(80,130,80,110) + triD(80,108,{});
    b += t(330,146,"loop until: at the roofline position (4.7) — then STOP (declaring 'done' is a skill: 4.7 quiz 2)",{size:10.5,fill:C.goodT});
    b += t(320,174,"'ONE change' is load-bearing: two changes = uninterpretable result (M2 L6's scientific method, forever).",{size:10.5,fill:C.dim});
    return svg(188,b,"measure locate diagnose change remeasure loop");
  })();

  /* 5.10b — nsys timeline anatomy */
  D["m5l10-nsys"] = (() => {
    let b = t(320,22,"Nsight Systems: the timeline that shows WHERE time goes",{bold:true,size:13});
    b += t(30,54,"CPU:",{a:"start",size:9,fill:C.dim});
    for (let i=0;i<6;i++) b += box(80+i*90,44,24,16,{r:3,fill:C.acc,stroke:C.accS,sw:1});
    b += t(30,86,"copies:",{a:"start",size:9,fill:C.dim});
    b += box(80,76,60,16,{r:3,fill:C.bad,stroke:C.badS,sw:1}) + box(420,76,60,16,{r:3,fill:C.warnFill,stroke:C.warn,sw:1});
    b += t(30,118,"GPU:",{a:"start",size:9,fill:C.dim});
    b += box(150,108,70,16,{r:3,fill:C.good,stroke:C.goodS,sw:1});
    b += box(260,108,26,16,{r:3,fill:C.good,stroke:C.goodS,sw:1});
    b += box(296,108,26,16,{r:3,fill:C.good,stroke:C.goodS,sw:1});
    b += box(332,108,80,16,{r:3,fill:C.good,stroke:C.goodS,sw:1});
    b += ln(230,116,258,116,{stroke:C.badS,dash:true,sw:1.4});
    b += t(244,140,"GAPS between kernels = launch",{a:"start",size:9.5,fill:C.badS});
    b += t(244,156,"overhead / CPU stalls — often the",{a:"start",size:9.5,fill:C.badS});
    b += t(244,172,"real bill for many-small-kernels",{a:"start",size:9.5,fill:C.badS});
    b += t(30,156,"reading order: is the GPU row",{a:"start",size:9.5,fill:C.dim});
    b += t(30,172,"FULL? do copies overlap kernels?",{a:"start",size:9.5,fill:C.dim});
    b += t(320,204,"$ nsys profile -o run ./prog — answers the SYSTEM questions (4.6's audit, drawn). Kernel internals → ncu:",{size:10.5,fill:C.dim});
    return svg(218,b,"nsight systems timeline with gaps and serialized copies annotated");
  })();

  /* 5.10c — ncu report anatomy */
  D["m5l10-ncu"] = (() => {
    let b = t(320,22,"Nsight Compute: every section maps to a lesson you own",{bold:true,size:13});
    const rows=[["Speed of Light: Mem 87% / SM 12%","→ memory-bound: which slope? (4.7)",C.accT],
                ["Roofline chart: dot at AI 0.24","→ your M1 L3 arithmetic, drawn for you",C.goodT],
                ["Mem Workload: 25% sector efficiency","→ coalescing surgery (5.7's drill)",C.badS],
                ["Occupancy: 50% ach / 50% theor, regs-bound","→ the dial (5.6) — is coverage enough?",C.warn],
                ["Warp State: 60% stalled 'long scoreboard'","→ waiting on HBM: hide or reduce traffic",C.dim],
                ["Source counters: spills, divergence per line","→ the line-level verdicts (5.6/5.7)",C.accT]];
    for (let i=0;i<6;i++){
      const y=44+i*38;
      b += box(30,y,330,30,{fill:"#10141d",stroke:C.boxS});
      b += t(44,y+19,rows[i][0],{a:"start",size:9.5});
      b += t(374,y+19,rows[i][1],{a:"start",size:9.5,fill:rows[i][2]});
    }
    b += t(320,292,"$ ncu --set full ./prog — expensive (replays kernels), surgical. The report is this MODULE's table of contents",{size:10.5,fill:C.dim});
    b += t(320,310,"with percentages attached: you built the decoder ring lesson by lesson. Recognition, not exploration (4.2 P7).",{size:10.5,fill:C.dim});
    return svg(324,b,"nsight compute sections mapped to course lessons");
  })();

  /* 5.11a — the capstone ladder */
  D["m5l11-ladder"] = (() => {
    let b = t(320,22,"The capstone ladder: matmul, % of fp32 peak (T4-class; YOURS will differ)",{bold:true,size:13});
    const rows=[["v1 naive (5.2)","one thread per C element, raw global reads","1–2%",30,C.badS],
                ["v2 coalesced (5.7)","x ↔ tid.x fixed: B reads stride-1","5–8%",70,C.warn],
                ["v3 tiled 32×32 (5.5)","shared staging: 32× less HBM traffic","25–40%",190,C.accS],
                ["v4 register-tiled (5.11)","each thread: 4×4 C in registers","50–70%",340,C.goodS],
                ["cuBLAS sgemm","the pros (+ tensor cores if fp16)","85–95%",510,C.goodS]];
    for (let i=0;i<5;i++){
      const y=46+i*48;
      b += t(30,y+12,rows[i][0],{a:"start",size:10.5,bold:true,fill:rows[i][4]===C.badS?C.badS:(i>=3?C.goodT:C.tx)});
      b += box(30,y+18,rows[i][3],14,{r:4,fill:C.box,stroke:rows[i][4],sw:1.4});
      b += t(rows[i][3]+40,y+29,rows[i][2],{a:"start",size:10,fill:C.dim});
      b += t(30,y+42,rows[i][1],{a:"start",size:9,fill:C.dim2});
    }
    b += t(320,300,"Every rung = one lesson's lever, measured with 5.9's events, verified against 3.9's fixture chain, reported",{size:10.5,fill:C.dim});
    b += t(320,318,"with 4.3/4.6's templates. ~40× naive→v4 by moving bytes less — the course's thesis, demonstrated by you.",{size:10.5,fill:C.dim});
    return svg(332,b,"matmul optimization ladder from naive to cublas");
  })();

  /* 5.11b — register tiling */
  D["m5l11-regtile"] = (() => {
    let b = t(320,22,"Register tiling: the 5.5 trick applied one level UP the board",{bold:true,size:13});
    b += box(30,44,180,120,{stroke:C.accS});
    b += t(120,66,"v3's limit",{size:10.5,bold:true,fill:C.accT});
    b += t(46,90,"1 output/thread →",{a:"start",size:9.5});
    b += t(46,108,"every FLOP reads",{a:"start",size:9.5});
    b += t(46,126,"shared twice: SHARED",{a:"start",size:9.5});
    b += t(46,144,"bw is the new wall",{a:"start",size:9.5,fill:C.warn});
    b += arrowR(214,104,246,{stroke:C.goodS,sw:2});
    b += box(250,44,360,120,{stroke:C.goodS});
    b += t(430,66,"v4: each thread owns a 4×4 C micro-tile",{size:10.5,bold:true,fill:C.goodT});
    b += t(266,90,"float acc[4][4];  float ar[4], bc[4];   // REGISTERS",{a:"start",size:9.5});
    b += t(266,108,"load 4 A-frags + 4 B-frags from shared ONCE →",{a:"start",size:9.5});
    b += t(266,126,"16 FMAs: shared reads per FLOP drop 4×",{a:"start",size:9.5,fill:C.goodT});
    b += t(266,146,"(registers: the only level with ~free bandwidth)",{a:"start",size:9.5,fill:C.dim});
    b += t(320,190,"Same move, third appearance: HBM→shared (5.5), shared→registers (here), and tensor cores are this idea",{size:10.5,fill:C.dim});
    b += t(320,208,"fused into silicon (4.4 §3). Cost: 16+ accumulators/thread — the 5.6 register dial pays for it (measure!).",{size:10.5,fill:C.dim});
    return svg(222,b,"register micro tile amortizing shared memory reads");
  })();

  /* 5.11c — chain of trust, final form */
  D["m5l11-trust"] = (() => {
    let b = t(320,22,"The chain of trust, complete: five implementations, one truth",{bold:true,size:13});
    const links=[["M1 L6","by hand","[[50,32],[122,77]]"],["M2 L4","Python oracle","exact match"],["M2 L5","NumPy @","allclose 1e-6"],["3.9","C ladder","K·ε budget"],["5.11","5 CUDA kernels","vs C fixtures"]];
    for (let i=0;i<5;i++){
      const x=24+i*124;
      b += box(x,46,112,58,{fill:i===4?C.good:C.acc,stroke:i===4?C.goodS:C.accS,sw:1.3});
      b += t(x+56,66,links[i][0],{size:10,bold:true,fill:i===4?C.goodT:C.accT});
      b += t(x+56,82,links[i][1],{size:9});
      b += t(x+56,96,links[i][2],{size:7.5,fill:C.dim});
      if(i<4) b += arrowR(x+112,74,x+124);
    }
    b += t(320,132,"Every CUDA kernel passes the SAME fixture suite (ragged sizes included) within a budgeted tolerance",{size:10.5,fill:C.accT});
    b += t(320,150,"BEFORE its performance number exists. Correctness gates performance — the M2 L6 playbook's iron rule.",{size:10.5,fill:C.accT});
    b += t(320,178,"Note the budget direction: GPU tree sums are MORE accurate than the serial C reference (M1 L8 §3) —",{size:10.5,fill:C.dim});
    b += t(320,196,"your tolerance comment must say so, or a reviewer will think you don't know. You know.",{size:10.5,fill:C.dim});
    return svg(210,b,"chain of trust from hand computation to cuda kernels");
  })();

  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, D);
})();

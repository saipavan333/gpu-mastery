# TRACKS PROGRESS LEDGER
Update at the END of every build session. Read at the START of every session.
(Why this file exists: sessions lose memory — see HANDOFF-OPUS.md PART 0.)

## State of the world
- 2026-07-07 — Core COMPLETE: Modules 1–5, 43 lessons, 132 verified diagrams
  (built by Claude Fable 5). QA: structure ALL CLEAN; 35/35 executed checks
  passed; 8 content bugs found-and-fixed (see HANDOFF-OPUS.md appendix).
- 2026-07-07 — **TRACK A COMPLETE**: 11 lessons + 34 verified diagrams,
  integrated (curriculum/index/README), full QA CLEAN (structure, escaping,
  consistency greps; the one TODO grep-hit is prose describing a template).
  Track-A postmortem — bugs its own QA caught: 19 diagram defects pre-lesson
  (incl. missing `b +=` rungs, 6 bold-title clips); a6-scale fp16-underflow
  overstatement (→ 2⁻²⁴ line); A2 7B=14 GB slip; A8 70B-TP 2× slip
  (140/8=17.5 GB → 191 tok/s). Signature executed results now cited across
  lessons: FD V-shape slopes; FlashAttention exact at 3.3e-16; one-pass
  variance = 0.0 at mean 1e3 fp32; fp16 absorption 96% loss; ring 2(N−1)/N
  verified; int8 RMS = scale/√12; KV 131 KB/token → 17.2 GB; decode ceilings
  239 (H100/7B) & 100 (T4/1.1B) tok/s.
- 2026-07-07 — **TRACK B COMPLETE**: 10 lessons + 30 verified diagrams,
  integrated, full QA CLEAN. The most-executed track in the course —
  signature results now cited in lessons: FD orders (×10/×100 per decade),
  Euler-vs-RK4 (÷2 vs ÷16.4), the stability wall (1e-25 vs 2e+19 at
  0.035/0.045) and its 2000-step incubation fuse (7e+46), oscillator energy
  (Euler ×147.5 — derived AND measured; symplectic bounded 2.2%), heat
  conservation 2.2e-16 + spread law to 4 digits, MC slope −0.494 (30-trial
  RMS; single-run −0.80 as the trap), antithetic 62×, same-seed corr 1.0,
  Chan merge exact, summation ladder (5.2e-5/9.1e-8/9.1e-9), **-ffast-math
  deleting Kahan (error reverts to exactly naive's — executed)**, one-pass
  variance = 0.0, sparse crossover (30×@1% / 0.7×@50%), Parseval, FFT 600×.
  Bugs QA caught: 4 diagram overflows + 1 messy arrow block (pre-lesson);
  b3-stencil caption crowding (visual pass); stray empty div in B7 quiz 2;
  raw `<double` escaping in B9 (×2 — the <<<-class bug, template edition).
- 2026-07-07 — **TRACK D COMPLETE**: 9 lessons + 24 verified diagrams + a LIVE
  in-browser WebGPU lab (track-d/lab-webgpu.html), integrated (curriculum/index/
  README), full QA CLEAN. Built by Claude Opus 4.8. Signature executed results now
  cited across lessons: hipify diff = 6 host-API renames of 15 lines, kernel body +
  the triple-angle launch byte-identical (D2); wavefront-64 reduction bug returns
  the sum of the FIRST 32 of 64 lanes exactly (true 327 → buggy 191, D2 centerpiece);
  benchmark normalization — GPU A wins throughput 1.56× but GPU B wins img/$ 1.86×
  and img/J 1.12× (D8); % of own roofline A 28.8TF@72% vs B 21.1TF@88% (D8); OpenMP
  parallel_reduce of 10M doubles matches serial within 2e-10 across 1/2/4 threads
  (D6, executed); LayoutLeft stride 1 (coalesced) vs LayoutRight stride 4 (D6); SYCL
  accessor DAG inference — K1||K3 overlap with ZERO user sync (D3, executed); WGSL
  browser reduction matches fp64 oracle within budget (2.6e-4 @1M, lab-verified in
  node, all-ones exact). Sandbox has no GPU/driver — HIP/SYCL/OpenCL/WGSL APIs
  verified vs docs; all algorithm/arithmetic claims executed in NumPy/C++/node.
- 2026-07-07 — **REGRESSION FOUND & FIXED (pre-existing, NOT Track D)**: three site
  files were TRUNCATED (no closing html) from a prior write — curriculum.html (mid
  Track-D summary; lost its footer + the diagrams.js/app.js tags that render the
  roadmap), index.html (mid "how this course works"; lost the grid2+wrap closes and
  trailing cards), track-b/lesson-09.html (missing body/html close). All three
  rebuilt; index's grid2 container div-close restored. Root cause = the NUL/
  truncation artifact (see Environment notes). ADD a site-wide closing-tag +
  div-balance check to every session's QA.
- 2026-07-07 — **TRACK C COMPLETE**: 11 lessons + 34 verified diagrams, integrated
  (curriculum/index/README), full QA CLEAN. Built by Claude Opus 4.8. Signature
  executed results now cited across lessons: perspective divide (same x, 8× w → 1/8
  screen size, C1); inverse-transpose normal proof (naive dot 3 WRONG, (M⁻¹)ᵀ dot 0
  CORRECT, C1); barycentric weights 0.417/0.25/0.333 sum 1, interp 19.167 (C2);
  sRGB 0.5 → linear 0.218 (2.2) / 0.214 (exact) and mip memory +1/3 (C5); GGX/Smith/
  Schlick at r=0.3 → D=3.94, G=0.99, F=0.04, Lambert energy conserves to 1.0 (C6);
  Möller-Trumbore t=1.0, u=v=0.25, hit (C9); separable blur 81→18 taps @9×9 (C7).
  Diagram QA caught (pre-lesson): ⟂ glyph rendering as tofu in c1-normal (→ ASCII
  "perp") — a FONT-coverage bug the geometry checker can't see, caught by contact
  sheets; 3 text overflows (c4-descriptors ×3, c9-denoise edge); c6-ggx values
  reconciled to the executed geometry (were illustrative). Sandbox: no window system
  — Vulkan/GLSL/RT APIs doc-verified; ALL math executed in NumPy.
- 2026-07-07 — **COURSE COMPLETE**: Core (Modules 1–5, 43 lessons) + all four career
  tracks — A (ML/AI infra, 11), B (HPC, 10), C (Graphics, 11), D (Portable GPU, 9) —
  = **84 lessons, 254 verified diagrams** (9 packs: 132 core + 34 A + 30 B + 34 C +
  24 D). Full-site QA CLEAN: all 89 HTML files close properly (no truncation),
  curriculum/index div-balanced, click-paths verified, no raw <<< / TODO in any
  track. 8 residual site-wide checker flags are ALL pre-existing SAFE false-positives
  (valid `<sub>`; `<stdint.h>` in a data-caption attribute; digit-after-`<<<` renders
  literally; TODO in a code comment / documented template; `KEY` = escaped template
  placeholder in prompt.html). PART 10 finish work done: curriculum footer "ALL 84
  LESSONS BUILT", index Track C card, README counts+tree, prompt.html completion note.
  The three portfolio capstones (5.11 matmul ladder, D9 four-backend report, C11
  renderer) are the GitHub set. HANDOFF-OPUS.md + prompt.html retained for extension.

## Post-course enhancements — "make me elite" roadmap (started 2026-07-07)
Relocated the whole course to C:\Users\saipa\Personal\Projects\AI\Tutorials\gpu-mastery
(verified byte-for-byte; work here now). Then began a 4-tier interactivity roadmap
requested by Pavan (visual labs + hands-on labs + widgets):
- **Tier 1 (in progress) — Interactive Labs.** DONE this phase: `labs.html` hub +
  four verified pure-JS tools — `lab-roofline.html` (4.7; math node-checked: SAXPY
  memory-bound 18 GF/s, GEMM compute-bound, ridge 36.8), `lab-occupancy.html` (5.6;
  100%→50% as regs bind), `lab-coalescing.html` (5.7; fp32 floor 8×, fp64 4×, sector
  counts verified), `lab-floatbits.html` (M1 L8/A6; IEEE encoder with subnormals+RNE,
  verified fp16(0.1)=0.0999755859375, e4m3 sat 448, e5m2 inf). A "Labs" nav link was
  inserted site-wide (94 pages) + an index callout. All JS node --check valid; all
  94 HTML intact; div-balanced. NEXT in Tier 1: spaced-repetition review deck (~200
  cards from the lessons' key facts/formulas/gotchas), more hands-on WebGPU labs
  (saxpy, naive→tiled matmul, the measured stride cliff), a reduction/scan animator.
- **DESIGN ELEVATION (2026-07-07, "make it master class"):** invoked the designer
  method (precise · premium · alive). Rewrote assets/style.css into a premium design
  system — layered surfaces, a signature accent→cyan→violet gradient, mono-eyebrow
  identity, bigger/tighter type, depth (shadows), micro-interactions (hover lift, press,
  focus-visible glow) with a prefers-reduced-motion guard, print styles — PRESERVING all
  41 prior class selectors so no lesson breaks; base neutrals kept close so the 254
  diagrams stay in harmony (they now lift with a soft shadow). Cascades to all 94 pages.
  Redesigned index.html into a real landing: hero with a signature SVG "compute-grid
  wavefront" motif (assets/hero-grid.svg, previewed via cairosvg), gradient headline,
  key stats, CTAs, premium track cards, a "built to one standard" 3-step, and the Labs
  callout. Verified: CSS braces balanced + selectors intact, all HTML closes, links
  resolve, div-balanced. CAVEAT: sandbox browser CDN is allowlist-blocked, so full-page
  pixels are unverified-by-me — needs a look on the live site (or a claude-in-chrome pass).
- **Tier 2:** portfolio hub (5.11/D9/C11 scaffolds+rubrics) + interview dojo.
- **Tier 3:** start-here roadmap, progress dashboard (streak/weak-topic flags), search.
- **Tier 4:** a Frontier module (Blackwell/FP4/3D-parallelism/MoE/serving) + war stories.
- **Tier 5:** glossary/index, prereq+outcome headers, dark/light toggle, PDF, progress export.
Build discipline unchanged: verify every tool's math (node), never ship truncated files.

## Canonical numbers ledger (do not contradict — HANDOFF PART 5c)
T4: sm_75 · 40 SMs · 8.1 TF fp32 · 320 GB/s spec / ~220 achievable · 64 KB
smem/SM · 65,536 regs/SM · 1024 thr/SM · 2 copy engines · PCIe ≈ 11–12 GB/s
pinned. Matmul ladder: 2.1 / ~95 / ~600 / ~2200 / ~3200 vs cuBLAS ~4400
GFLOP/s. Reduction 16M floats: 28 → 0.48 → 0.33 ms (ceiling 0.32).
Track D representative numbers (LABELED representative in-lesson; keep consistent if
reused): benchmark A/B — A 1000 img/s @ $3.20/hr @ 700W, B 640 img/s @ $1.10/hr @
400W → img/$ B 1.86×, img/J B 1.12×; roofline A 40TF@72%=28.8, B 24TF@88%=21.1.
Executed anchors: hipify 6/15 lines; wavefront 327→191; OpenMP reduce drift 2e-10;
WGSL reduce err 2.6e-4 @1M.

## Session log
| date | session | scope | outcome | decisions / notes for next session |
|------|---------|-------|---------|-------------------------------------|
| 2026-07-07 | C-3 | Lessons C7–C11 + integrate + full QA + ledger | DONE. C7 compute (reunion), C8 Vulkan sync (5.9 table), C9 ray tracing (Möller-Trumbore executed), C10 frame profiling, C11 CAPSTONE (renderer + RT effect, PSNR harness, 5.11 ship standard + defense bank). curriculum/index/README → Track C BUILT + COURSE COMPLETE (84 lessons/254 diagrams); PART 10 finish (footer "ALL 84 BUILT", prompt.html note). Full-site QA: track-c + all edited pages CLEAN; all 89 files close properly; 8 residual flags all pre-existing safe false-positives. | NEXT: course COMPLETE. Ship note to Pavan; capstones (5.11/D9/C11) → GitHub. |
| 2026-07-07 | C-2 | Lessons C1–C6 | DONE, structure CLEAN. Executed AS WRITTEN: perspective divide (2/8=0.25), inverse-transpose (dot 3 wrong / 0 right), barycentric (0.417/0.25/0.333, interp 19.167), sRGB 0.5→0.218, mip +1/3, GGX D=3.94/G=0.99/F=0.04, Lambert energy=1.0. All math NumPy-verified; Vulkan/GLSL API doc-verified (no window system in sandbox). | NEXT: C7–C11 + integrate. |
| 2026-07-07 | C-1 | Track C facts + diagramsC.js (34) | DONE: facts verified (Vulkan 1.4 SDK 1.4.341, RT extensions final, RenderDoc v1.45, glTF 2.0); 34 diagrams built, geometry checker ALL CLEAN, 5 cairosvg contact sheets viewed. Caught by contact sheets: ⟂ tofu in c1-normal (→ "perp"; font-coverage bug the checker can't see), 3 overflows, c6-ggx reconciled to executed geometry. | NEXT: lessons C1–C6 (HANDOFF PART 8 maps). |
| 2026-07-07 | D-3 | Integrate + full QA + ledger | DONE. curriculum/index/README → Track D BUILT (badge good, lesson-list, lab link, counts 73 lessons/220 diagrams). FOUND & FIXED 3 pre-existing truncations (curriculum, index [+ grid2 container close], track-b/lesson-09). Site-wide checker: track-d + repaired files ALL CLEAN; 8 residual flags all verified SAFE false-positives (valid `<sub>`; `<stdint.h>` inside a data-caption ATTRIBUTE; digit-after-`<<<` renders literally in browsers; TODO in a code comment / a documented template; `KEY` = escaped template placeholder in prompt.html). Lab JS `node --check` valid; pager chain + cross-links verified. | NEXT: Track C — HANDOFF PART 8 maps; lab can't open windows so C targets learner hardware. |
| 2026-07-07 | D-2 | Lessons D1–D9 + lab-webgpu.html | DONE, structure checker CLEAN. Executed AS WRITTEN: wavefront-64 bug (327→191 = first-32 lanes), hipify diff (6/15 host renames, kernel 0 lines, launch identical), cost/watt (A thr 1.56× / B img$ 1.86× / B imgJ 1.12×), roofline 72% vs 88%, SYCL DAG (K1||K3 overlap, zero sync), OpenMP reduce 10M (drift 2e-10), LayoutLeft/Right stride 1/4, WGSL reduction (2.6e-4 @1M + all-ones exact, node sim). No pocl/SYCL driver (no root) — OpenCL/SYCL/WGSL exercises target LEARNER machine. | NEXT: integrate + QA + ledger. |
| 2026-07-07 | D-1 | Track D facts + diagramsD.js (24) | DONE: facts verified (below); 24 diagrams built, geometry checker ALL CLEAN, 3 cairosvg contact sheets rendered + viewed. Caught by contact sheets (NOT the geometry checker): a DOUBLE-ESCAPE of &lt;/&gt; in 4 code diagrams — in diagram JS pass RAW `<`/`>` because `t()` calls `esc()`; only in LESSON HTML do you pre-escape `&lt;`. Also d5-wgsl 5th-row overflow, d3-dag over-long title. NUL-strip needed on the pack. | NEXT: lessons D1–D9 (HANDOFF PART 9 maps). |
| 2026-07-07 | A-3 | Lessons A5–A8 | DONE, checker CLEAN. Executed this session: online-softmax rescale (exact), FlashAttention tile equivalence (3.3e-16 fp64), one-pass variance TOTAL cancellation (0.0 vs 1e-4 at mean=1e3 fp32 — A5 centerpiece), fp16 flush table (2⁻²⁴ line), fp16 absorption stall (65k×1e-4 sums to 0.25 vs 6.55 — 96% lost, A6 centerpiece), ring-allreduce sim (2(N−1)/N verified), int8 RMS = scale/√12 (3 digits), KV 17.2 GB + decode ceilings (H100 239 tok/s, T4 100). Fixed in-flight: a6-scale diagram overstated fp16 underflow (1e-6 is subnormal-representable; corrected to 2⁻²⁴ flush line); A8 Ex.1 70B TP arithmetic (140/8=17.5 GB → 191 tok/s, was wrongly 8.75/380). | NEXT (final A session): A9 (torch.compile/Inductor: a9-stack/breaks/when), A10 (deployment: a10-container/serving/metrics), A11 (capstone fused epilogue: a11-fused/ladder/ship — mirror 5.11's project structure + defense bank). Then INTEGRATE (curriculum.html track-A card → lesson list + BUILT badge; index.html track card; README counts) + FULL QA (checker all-clean incl. no pending links, consistency greps, ledger totals) + present. |
| 2026-07-07 | A-2 | Lessons A1–A4 | DONE, structure-checked CLEAN (9 details-blocks each; only pending-link to unwritten A5). Claims executed: A1 gradients (8.784/−5.856 exact vs FD), FD V-shape table (O(h²) slopes measured), softmax identity-fill damage (pad-0: 4% quiet error positive rows, 0.66 catastrophic all-neg — in A4 quiz 1/worked ex), fp32 exp overflow at 89. A2 P3 arithmetic fixed in-flight (7B fp16 = 14 GB not 15.4). torch NOT installable in sandbox (see env notes) — torch semantics cross-checked vs M2 L5 stride model + docs; exercises Colab-targeted. | NEXT: A5–A8 (fusion/FA, precision, NCCL/DDP/FSDP, inference/vLLM). NumPy-execute: online-softmax rescale identity, FA tile equivalence, quantization error, ring-allreduce bytes formula. Keys: a5-*, a6-*, a7-*, a8-* (4 for A8). |
| 2026-07-07 | A-1 | Track A facts + diagramsA.js | DONE: facts verified (see below); 34 diagrams built, checker ALL CLEAN, 3 contact sheets visually reviewed. Bugs caught & fixed: 11 text overflows; 6 BOLD 13px titles clipped (checker's 0.52 width factor underestimates bold — use ≤80-char titles or 0.58 factor for bold); a11-ladder rungs missing (`rung()` called without `b +=` — helper returns a string); 2 reversed arrowheads (added triL/triU helpers for left/up arrows). | NEXT: write lessons A1–A4 (HANDOFF PART 6 maps). Style anchor: module-5/lesson-07.html. Diagram keys per lesson: a1-{graph,chain,fdcheck}, a2-{tensor,autograd,dispatch}, a3-{bind,gradcheck,contig}, a4-{model,mask,autotune}. Install CPU torch in sandbox for claim execution (HANDOFF 5b). |

## Facts verified (with dates)
**Track C — verified 2026-07-07:** **Vulkan 1.4** (LunarG SDK **1.4.341.0**,
Roadmap 2026 Profile; latest spec 1.4.356). Now CORE/mandatory: **dynamic
rendering** (skips legacy renderpass), **synchronization2**, push descriptors,
scalar block layouts, maintenance ≤ VK_KHR_maintenance6. **Bindless** =
descriptor indexing (one big texture array indexed in-shader) + new
**VK_EXT_descriptor_heap** overhaul; 8K / 8 render targets now guaranteed ·
**Ray tracing** final (not provisional): **VK_KHR_ray_tracing_pipeline**
(raygen/closest-hit/any-hit/miss/intersection + **SBT**), **VK_KHR_ray_query**
(inline RT from any shader stage), ray_tracing_maintenance1 (cull mask) — NVIDIA
RTX + AMD RDNA2+ · Tools: **RenderDoc v1.45** (2 Jul 2026, open-source MIT,
frame-capture; Vulkan/GL/D3D11/D3D12), **Nsight Graphics** (NVIDIA, RT + SM
profiling), AMD **Radeon GPU Profiler** · **glTF 2.0** (Khronos, metallic-
roughness PBR, GLB binary — "JPEG for 3D"; metallicRoughnessTexture packs
roughness=G, metalness=B; KHR_materials_specular/ior ext) — the capstone asset ·
**OpenGL 4.6** still the simplest first-triangle teaching path (C3 GL→Vulkan) ·
Lab reality: sandbox CANNOT open windows — C1–C8 exercises target the learner's
machine (ANY GPU vendor), RT (C9/C11) needs RTX/RDNA2+; **all MATH is NumPy-
verifiable** and WebGPU/Dawn/wgpu (Track D) is the headless/offscreen fallback.
Sources: Khronos, LunarG, Vulkan Docs, RenderDoc, NVIDIA Nsight.
**Track D — verified 2026-07-07:** ROCm **7.2.4** stable (7.13.0 tech preview);
HIP = CUDA-like C++ runtime/kernel lang; **HIPIFY** source-to-source CUDA↔HIP
(Clang tool or perl script). Supported: Instinct **MI300A/MI325X/MI350/MI355X**
(MI350 adds FP6/FP4) + consumer Radeon RX 7000 (RDNA3)/RX 9000 (RDNA4)/RDNA2 via
WSL2. AMD **wavefront = 64 lanes** (vs NVIDIA warp 32) — the core portability
gotcha · SYCL **2020 rev 6** standard; impls: Intel **oneAPI DPC++ 2026**
(ABI-breaking; `native_cpu` experimental CPU target + spir64_x86_64 AOT) and
**AdaptiveCpp** (community, ex-hipSYCL/Open SYCL); both run CPU backends ·
**OpenCL 3.1** (IWOCL 2026) makes **SPIR-V ingestion mandatory** in core;
SYCL/chipStar target OCL; strong in mobile/embedded; SVM optional since 3.0 ·
**WebGPU** in ALL major browsers: Chrome/Edge (113, 2023), Firefox 141 Win / 145
macOS, Safari 26.0 (~82% global); **subgroups** shipped **Chrome 134** (Feb 2025,
`enable subgroups;`), **timestamp-query** since Chrome 121 (quantized 100µs);
engines **Dawn** (C++, Chrome) + **wgpu** (Rust, Firefox), both standalone ·
**Kokkos 5.1.0** (C++20; backends CUDA/HIP/SYCL/OpenMP/HPX/threads) + **RAJA**
(LLNL, C++20) · TOP500 **June 2026**: LineShine (CN) #1; **El Capitan #2** (LLNL,
AMD EPYC + **Instinct MI300A**, 1.809 EF); Frontier #3 (AMD); **Aurora #4**
(Argonne, **Intel** Xeon Max + GPU Max/Ponte Vecchio, 1.012 EF) — El Cap=AMD,
Aurora=Intel CONFIRMED · **Triton** AMD backend (ROCm 6.2+): same Python →
TTIR→TTGIR→LLVM→**AMDGCN/hsaco** (NVIDIA path → PTX); MLIR dialects TTIR/TTGIR +
TritonAMDGPUDialect. Sources: Khronos, Chrome for Developers, web.dev, TOP500,
LLNL, ROCm docs, Intel oneAPI, Kokkos GitHub.
**Track B — verified 2026-07-07:** OpenMPI **5.0.x** current with CUDA-aware
via UCX/OFI (GPU buffers passed straight to MPI calls); **GPUDirect RDMA**
(GPU↔NIC, no host staging) standard on IB clusters · SLURM remains the
scheduler; **Apptainer** (renamed Singularity) the HPC container norm ·
GPU libs: cuBLAS/cuSPARSE/cuSOLVER/cuFFT ship with CUDA 13.x; 64-bit-int
APIs current · offload compilers: NVHPC **nvc++** (OpenACC + OpenMP-offload)
and clang/LLVM OpenMP-offload both live; OpenACC remains NVIDIA-centric ·
HPC stack is slow-moving vs ML: teach mechanisms, pin few versions.
**Track A — verified 2026-07-07:** PyTorch **2.11** stable (GA Mar 2026; FlexAttention
gains FA4 backend on Hopper/Blackwell; 2.9 (Oct 2025) added stable libtorch ABI,
symmetric memory, CUDA-13 wheels) · Triton **3.x** (pinned by torch) · FlashAttention:
FA2/FA3 in vLLM today; **FA4** exists (CuTeDSL, Hopper/Blackwell, ~20% over cuDNN
attn) · **FA2+ requires sm_80+** → Colab free T4 (sm_75) cannot run flash-attn
kernels: A5 teaches the algorithm via NumPy simulation + Triton, SDPA falls back on
T4 (state honestly in lessons) · NCCL **2.28** added device API; **2.30.x** current
(June 2026) · vLLM V1 engine: paged KV, continuous batching, native RL APIs (May
2026) — cite features, not minor versions · fp8 = e4m3/e5m2 (Hopper+), fp4/nvfp4
(Blackwell) — carried from Module 4 verification.

## Environment notes
- 2026-07-07: sandbox CANNOT install torch (pytorch.org index blocked; PyPI wheel
  ~900 MB dies silently). Consequence: torch-specific claims are verified via
  (a) NumPy equivalence where the semantics are shared (strides/views = M2 L5's
  verified model), (b) official docs for API behavior, (c) exercises run on
  Colab (torch preinstalled). Do NOT quote exact runtime error strings — paraphrase.
  Algorithmic claims (softmax, attention, quantization) stay NumPy-executed as planned.
- 2026-07-07 (Track D, Opus): sandbox has g++/OpenMP/node/numpy but NO GPU and NO
  installable GPU driver (pocl/ROCm/SYCL need root; pyopencl installs but finds no
  ICD). So HIP/SYCL/OpenCL/WGSL API claims are doc-verified; every ALGORITHM/ARITHMETIC
  claim is executed (wavefront bug, cost-watt math, SYCL DAG inference, OpenMP reduce,
  layout strides, WGSL reduction sim + node --check on the lab). WebGPU/OpenCL/SYCL
  exercises target the LEARNER's machine (browser is the one universal GPU lab).
- 2026-07-07: the NUL/truncation artifact is REAL and bit this session — fresh writes
  can gain trailing NUL bytes and a Write+linter interaction TRUNCATED the tail of
  diagramsD.js (repaired), and from a prior session curriculum/index/track-b-09.
  Defenses: QA scripts read with .replace(/\0/g,''); after any Write/Edit verify the
  file ENDS correctly (</html> or IIFE close) and re-check div balance. Writing new
  HTML via a bash quoted-heredoc to the mount path proved more reliable than the Write
  tool for large files. Correct Write path root: ...7ff32d2b-13b7-4009-9b07-368c7b5e5e95...

## Bugs QA caught in tracks (append — this list is the method working)
- diagramsA.js pre-lesson QA: 19 defects (overflows, bold-title clipping, missing
  `b +=` on a11-ladder rungs, 2 reversed arrowheads) — all fixed before any lesson
  referenced the pack.
- diagramsD.js pre-lesson QA: 3 defects — 1 over-long title (d3-dag), 1 panel-row
  overflow (d5-wgsl), and a DOUBLE-ESCAPE class across 4 code diagrams (d2-hipify,
  d3-single-source, d3-ndrange, d5-wgsl): `&lt;` literals passed to `t()` double-escape
  because `t()` already calls `esc()`. The geometry checker MISSED it (renders wrong,
  not out-of-bounds); the CONTACT SHEETS caught it — HANDOFF PART 4's two-stage check
  working exactly as designed. Rule: diagram JS text takes RAW `<`/`>`; lesson HTML
  takes pre-escaped `&lt;`/`&gt;`.
- Track D regression (pre-existing, not Track D's content): 3 TRUNCATED site files
  (curriculum.html, index.html [+ a lost grid2 container close], track-b/lesson-09.html)
  found by a site-wide closing-tag + div-balance check and repaired. Lesson: regression-
  check the WHOLE site every session, not just the new track.
- diagramsC.js pre-lesson QA: a FONT-COVERAGE bug — the ⟂ (U+27C2) glyph rendered as
  tofu (missing glyph) in c1-normal; the geometry checker can't see glyph coverage, so
  the CONTACT SHEETS caught it (→ ASCII "perp"). Also 3 text overflows (c4-descriptors
  ×3 long labels, c9-denoise bottom-edge caption) and c6-ggx values reconciled to the
  executed geometry (they'd been illustrative guesses; now D=3.94/G=0.99/F=0.04, matching
  the NumPy run). Rule reinforced (HANDOFF PART 4): eyes catch what geometry math can't —
  here, a whole class of missing-glyph bugs invisible to bounds-checking.

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

## Playbook alignment — FOUNDATION BATCH done (2026-07-07)
Mapped to the Tutorial Hub master COURSE_BUILD_PLAYBOOK.md. Audited gpu-mastery vs it;
executed Phase A (non-negotiables) + D1 (QA suite), all verified:
- **Single-source injector** (assets/gm-site.js, bootstrapped by app.js which computes
  asset/root base from its own currentScript). One edit now reaches all 94 pages. Verified
  by a hand-rolled DOM-shim test (no jsdom — it hung the sandbox).
- **Creator byline** "Built by U E Sai Pavan Vamshi Krishna" injected into nav (right-aligned)
  + footer, single-source. **Favicon** (GPU-grid motif: svg/32/180/ico in assets/img/) injected
  site-wide. **A11y**: skip-link, .wrap→#gm-main(role=main), diagram svg role=img+aria-label
  from caption. All confirmed in the shim test.
- **KaTeX** vendored offline (assets/katex/, reused from the Gradient Descent course). DECISION:
  delimiters are **$$…$$ (display) and \(…\) \[…\] (inline)** — NO single-$ — so the course's
  many currency/shell `$` (costs, $HOME) are always literal, eliminating the §5.1 collision class.
  Inline math must use \(…\). KaTeX loads **only on pages containing math** (§5.7 perf budget).
  No lessons use math yet → conversion of equation-heavy lessons to $$/\( is the remaining A2 work.
- **tools/qa.js** living regression suite (§7.1): broken-link (case-sensitive), per-text-node
  $$-parity, American-English locale, inline-script syntax, close-tag/div-balance, asset presence.
  Fixed: 3 British spellings (grey→gray, colour→color, behaviour→behavior). **QA: ALL CLEAN.**
- Also: app.js added to the 6 lab pages that lacked it (now 94/94).
NEXT (Phase B, priority order): content-index generator → search → glossary+tooltips → review/
flashcards → AI assistant (retrieval + Cloudflare Worker/Gemini; user will deploy the Worker) →
interview bank → job-readiness exam → cheat-sheets → Pyodide runnable code+auto-grader → more
visual labs → roadmap+concept-map+resume → read-aloud → PWA. Then C1 (prereqs/misconceptions),
E2 (SEO/OG/sitemap). Run tools/qa.js before every push.

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

---

## Platform features (Phase B) — playbook parity build

Single-source injector architecture: `assets/app.js` bootstraps shared platform
assets on all 97 pages via computed base paths, so global changes = one edit.

- **Search** (§3, §10) — `tools/build-index.js` -> `assets/search-data.js`
  (97 pages, keyword+phrase+IDF+stemming ranked in `assets/gm-search.js`, VERIFIED in
  node). Overlay (nav button, `/`, Cmd/Ctrl-K) + inline mode on `search.html`.
- **Glossary** (§3) — 54 terms in `assets/gm-glossary-data.js`; A–Z filterable
  `glossary.html` + inline hover/focus tooltips on first term occurrence per lesson
  (`assets/gm-glossary.js`). All 54 term->lesson links resolve (QA-checked).
- **Spaced-repetition Review** (§3) — `tools/build-review.js` harvests 222 cards
  (54 glossary terms + 168 quiz Q&A) -> `assets/review-data.js`. Leitner engine
  (`assets/gm-review.js`, boxes 1–5, intervals 1/2/4/8/16 d, localStorage), due-card
  session UI on `review.html`. Scheduling logic VERIFIED (11 node assertions:
  grade transitions, queue ordering + new-card cap, deck filter, stats).
- **QA suite extended** — `tools/qa.js` now strips `<script>`/`<style>` before the
  broken-link scan (fixed a false positive on inline-JS `href` strings) and adds a
  glossary-link resolution check. Standard: `QA: ALL CLEAN`.
- **Footer study strip** (single-source, `gm-site.js`) — Curriculum · Labs · Glossary ·
  Review · Search on every page.

Generated runtime data (`search-data.js`, `review-data.js`) IS committed — GitHub
Pages is a static host with no build step, so the site depends on them at runtime.
`.gitignore` excludes only `node_modules/`, `_shots/`, `*.log`.

- **AI Course Assistant** (§3, §10) — site-wide "Ask AI" FAB + chat panel
  (`assets/gm-assistant.js`, namespaced `.gma`). Offline mode works now: reuses
  `GMSearch.rank` over `GM_INDEX` + `GM_GLOSSARY` for grounded, cited answers
  (VERIFIED in node against real data — "memory coalescing" -> lesson 5.7 + the
  coalescing lab; "roofline model" -> lesson 4.7 + Roofline Explorer; glossary
  resolves occupancy / bank-conflict). Optional AI-written answers via an owner
  Cloudflare Worker (`worker/assistant-proxy.js`, Gemini free tier) configured in
  `assets/assistant-config.js` (empty = offline) — setup in `ASSISTANT-SETUP.md`.
  Answer cache, follow-up memory, prompt-injection defense in the Worker prompt.
  QA asset-presence check extended to 13 platform files.

- **Interview Prep** (`interview.html`) — 52 curated GPU/CUDA interview questions
  (`tools/build-interview.js.py` -> `assets/gm-interview-data.js`), balanced across
  9 topics (Architecture, Memory, CUDA, Performance, Foundations, ML Systems, HPC,
  Graphics, Portability) and 3 levels (14 easy / 28 medium / 10 hard). Each has a
  model answer and a link to the teaching lesson; all 52 links QA-verified. Filter
  by topic + difficulty + text; reveal one or all.
- **Job-Readiness Exam** (`exam.html`) — `tools/build-exam.js` harvests 168 full MCQs
  (question + options + correct + explanation) -> `assets/exam-data.js`. Engine
  (`assets/gm-exam.js`) samples by scope (All/Core/Track A–D) and length (10/25/50),
  shuffles questions AND options, optional 1-min/question timer with auto-submit,
  70% pass mark, best-score in localStorage, full per-question review with lesson
  links. Core VERIFIED (9 node assertions: option-shuffle preserves the correct
  answer across 50 seeds, scope/size caps, no duplicate questions, scoring + pass
  threshold). QA link-resolution extended to interview + exam.

- **Cheat Sheets** (`cheatsheet.html`) — one dense, printable reference page with a
  section per module (1–5) and track (A–D): bases/bits, floating point, pointers/UB,
  memory hierarchy + roofline formula, CUDA launch/qualifiers/perf levers, ML (GEMM,
  mixed precision, FlashAttention, DDP/FSDP, KV-cache), HPC libraries + clusters,
  graphics pipeline + PBR, and the cross-vendor warp-size trap. Jump-nav, and a
  light **@media print** stylesheet (hides nav/FAB, page-break per section) for a
  clean PDF. Content grounded in the verified lessons.

## Polish wave — motion, SEO, PWA, pedagogy, math

- **Motion layer** (`assets/gm-motion.js/.css`, single-source via app.js) — a calm,
  coherent motion language per playbook §4: opacity-only page-entrance + gentle
  IntersectionObserver scroll-reveal with a small stagger. Above-the-fold content
  reveals immediately (no flash); everything is fully visible if JS is off or
  `prefers-reduced-motion` is set (the hidden state is only armed by `html.gm-anim`,
  added by JS only when motion is allowed). No particle backgrounds. VERIFIED (node
  smoke: gm-anim armed, entrance, below-fold observed, above-fold pre-revealed).
- **SEO/OG** (`tools/build-seo.js`, idempotent) — per-page canonical + description +
  OpenGraph + Twitter-card on all 100 pages, a 1200×630 `assets/img/og.png`,
  `sitemap.xml` (100 urls) and `robots.txt`. Idempotency fixed (strip prior block
  before detecting the page's own description) — re-run changes 0.
- **PWA** — `manifest.webmanifest` (+ 192/512/maskable icons), `sw.js` service worker
  (precache shell, stale-while-revalidate assets, network-first HTML, cross-origin
  passthrough so the AI Worker is untouched), registered from app.js (skips file://).
  Manifest link + theme-color injected site-wide.
- **Prerequisites + common-misconceptions** (playbook §2) — `tools/build-lessonmeta.py`
  -> `assets/gm-lessonmeta-data.js` (49 lessons: all 43 core + 6 flagged track lessons,
  50 misconceptions). Injected single-source by gm-site.js: a prereq line after the
  title, a misconceptions callout before the key points. VERIFIED (node smoke inserts
  both on a simulated lesson page).
- **KaTeX math** (`tools/add-equations.js`) — a typeset "Key equations" panel added to
  8 equation-heavy lessons (M1.6, M1.8, A1, B1, C1, C2, C6, C9); 23 display equations,
  ALL 23 VERIFIED to parse with the vendored KaTeX in node. Static `\[` triggers the
  existing conditional KaTeX loader; annotated code-block derivations kept intact.
  Uses only `\[...\]`/`\(...\)` (never a bare `$`), so no currency/math collision.

## Feature-completion wave — the last §3 items

- **Resume where you left off** (§5.3) — app.js records the last lesson viewed
  (localStorage); gm-site.js injects a path-aware Resume card on the home page.
  VERIFIED (node smoke).
- **Read-aloud** (§3) — `assets/gm-readaloud.js` (Web Speech API): control bar on
  lesson pages with voice picker, speed, play/pause/stop, current-block highlight;
  graceful no-op if unsupported; reduced-motion aware.
- **Syntax highlighting** (§3) — `assets/gm-highlight.js`, a compact offline lexer
  (C/CUDA/C++, Python, GLSL, bash) with on-brand token colors + a print palette.
  VERIFIED escape-safe: 49/49 real code blocks round-trip to identical text.
- **Interactive concept map** (§3) — `concept-map.html`: the curriculum as a
  clickable dependency map (core path 1→5, then the four tracks), each node expands
  to its lessons, built from GM_INDEX. Indexed + in the footer strip.
- **Runnable Python + auto-grader** (§3, §3.1) — `assets/gm-run.js`: Module-2 Python
  blocks become editable, runnable cells (shared lazy Pyodide, output panel, numpy on
  demand, graceful offline fallback). Auto-grader via a sentinel-JSON harness
  (`@@GMX@@`), with a demonstrator graded exercise in module-2/lesson-03. Grader
  harness VERIFIED in real Python (wrong solution → partial, correct → all pass).
  Note: CUDA can't run in a browser, so runnable code targets the Python lessons.

Every §3 required feature is now built. Only §11 (access control / subscriptions)
remains deferred by the owner's explicit "build product, defer selling" decision.

## Motion fix + context split + three new labs

- **Real animation root cause found and fixed.** The home hero ran on a separate,
  page-only `.reveal`/`.d1-d4` CSS animation (`style.css`); everything else used
  `gm-motion.js`, which added the "hidden" class and the "reveal it" class to
  already-on-screen elements in the SAME synchronous tick — no frame is ever
  painted in between, so the browser skips the transition entirely (reads as "no
  animation" even though the code runs). Fixed: hero folded into `gm-motion.js`
  (one motion system, site-wide), on-screen elements now flip to `.gm-in` inside a
  double `requestAnimationFrame` so a real hidden frame paints first. VERIFIED with
  a hand-rolled DOM shim: before the rAF flush no on-screen node has `.gm-in`; after
  it, all on-screen nodes do, below-fold nodes still wait for `IntersectionObserver`.
  Dead `.reveal`/`.d1-d4`/`@keyframes rise` removed from `style.css`. `sw.js` CACHE
  bumped v2→v3.
- **Context split into `context/*.md`** — `HANDOFF.md` was a single ~900-word file
  read every session regardless of task. Split into `ARCHITECTURE.md`,
  `UI-LAYOUT.md`, `STUDY-TOOLS.md`, `ASSISTANT.md`, `DEPLOY.md`, `LABS.md`;
  `HANDOFF.md` is now a 1-page index. A session now reads only the topic file(s)
  its task needs.
- **WebGPU Matmul Lab** (`lab-matmul.html`) — finishes the labs.html "coming next"
  backlog item. Naive vs. shared-memory-tiled matmul, both on the user's GPU,
  GFLOP/s bar comparison, 12-point correctness spot-check against a CPU dot
  product (full N×N CPU replay would be too slow to run in a tab at N=2048).
  VERIFIED: the tiling algorithm (accumulate across k-tiles from local sub-blocks)
  checked against naive in Node across 5 shapes incl. non-multiple-of-tile sizes,
  all exact matches; `cpuDot` checked against a hand-computed 2×2 product; the
  no-WebGPU graceful-degradation path exercised in Node (stubbed `navigator`).
- **Monte Carlo Convergence Lab** (`lab-montecarlo.html`, Track B) — dart-throwing
  π estimator with a live log-log error-vs-N plot against the analytic
  `SE(N)=4√(p(1-p)/N)` curve. VERIFIED the 1/√N law empirically in Node (40-trial
  average error roughly halves per 4× N) before shipping; full start/pump-frames/
  reset/run-to-300k-cap state machine executed in a DOM-shimmed Node harness with
  zero exceptions.
- **PBR Material Explorer** (`lab-pbr.html`, Track C) — live per-pixel Cook-Torrance
  BRDF (GGX distribution, Smith geometry, Schlick Fresnel) on a canvas-shaded
  sphere; 6 material presets, roughness/metallic/light sliders, a 5-step roughness
  ladder. VERIFIED the BRDF math in Node first (Fresnel(VoH=1)=F0 exactly, GGX
  normalization integral ≈1 via Monte Carlo, G_Smith ∈ (0,1]) — this caught a real
  bug (an epsilon sized for typical roughness silently dominated and DIMMED the
  highlight at very low roughness instead of sharpening it; fixed with a smaller
  epsilon + a monotonicity re-check). A second runtime pass then caught a genuine
  scope bug (`shadeSphere` returned block-scoped `D`/`G` from outside the pixel
  loop — a `ReferenceError` `node --check` cannot see since it only parses syntax);
  fixed, then re-verified across 180 slider-range parameter combinations in a
  DOM-shimmed Node harness with zero exceptions.
- Wired into `labs.html` (new "Go deeper on your track" section for the two
  visualizers, matmul promoted out of "coming next") and `index.html`'s labs
  teaser. `tools/build-index.js` + `build-seo.js` re-run (104 pages indexed, SEO
  injected into the 4 changed pages).

## Animated hero (the real "landing page animation" ask)

- Root cause of the repeated "no animation on the home page" reports: the only
  home-page motion was the site-wide *entrance* fade/rise (`gm-motion.js`) — a
  one-shot ~0.5s effect on load that is genuinely easy to miss, especially since a
  parallel local tool had committed a message ("Add WebGL hero, page effects, 14
  widgets") describing a dynamic hero it never actually saved to the repo. So the
  page really did lack any visible, lasting animation.
- Fix: `assets/gm-hero.js` — the static `hero-grid.svg` is replaced by a live
  `<canvas id="hero-canvas" class="hero-art">` that continuously animates the
  course's core metaphor: a compute grid with an activation wavefront sweeping
  diagonally across it (blue→teal→violet, matching the original art). Canvas 2D,
  no dependencies, DPR-crisp, re-lays-out on resize, pauses on hidden tab. Loaded
  by `app.js` only when `#hero-canvas` is present (home only). The SVG stays as the
  `<noscript>` fallback. Honors `prefers-reduced-motion` (one static mid-sweep
  frame, no loop) — which is also the #1 thing to check if a user still sees
  nothing: OS-level "reduce motion" correctly disables it.
- VERIFIED in Node with a canvas shim (not just `node --check`): across the sweep
  the lit-cell centroid strictly advances (x+y: 153→269→377→478→580), the draw
  loop re-schedules itself, and in reduced-motion mode it draws 234 cells once and
  schedules ZERO animation frames. `sw.js` CACHE bumped v3→v4 (+ `gm-hero.js`
  precached). QA clean.

### Hero upgrade — "The Dispatch Lattice" (wondersmith)

- The plain 2D grid read as underwhelming ("animation is not good"), so the hero
  was rebuilt with the wondersmith method around ONE signature technique: a **WebGL
  fragment shader** computing a compute fabric the visitor *dispatches* with the
  cursor (energy blooms from the pointer, activation wavefronts ripple through the
  lattice; ambient waves in attract mode). Palette = brand ramp blue→teal→violet on
  navy. `assets/gm-hero.js` rewritten; `<canvas>` unchanged.
- **Robustness for blind-shipping (no browser in-sandbox):** a strict fallback
  chain — WebGL+compile OK → shader; any WebGL/compile/link failure (checked via
  `COMPILE_STATUS`/`LINK_STATUS` + try/catch) → the previous *verified* canvas-2D
  lattice (swapping in a cloned canvas, since a `webgl`-vended canvas can't yield a
  `2d` context); JS off → `<noscript>` SVG; reduced-motion → one still frame. The
  user can never get a black box.
- **Verification:** real WebGL compile isn't possible here (native `gl` build blocked
  by the network), so: (1) GLSL syntax-validated with `@shaderfrog/glsl-parser`
  (both stages parse; braces/parens balanced; all 4 uniforms declared+used); (2) a
  DOM + fake-GL Node shim proves all three selection paths (WebGL / 2D-on-compile-
  fail / 2D-on-no-WebGL), that the 2D wave centroid strictly advances, and that
  reduced-motion schedules zero frames. `sw.js` CACHE v4→v5. QA clean. **Pixel-level
  confirmation still requires a real browser** (Chrome extension wasn't connected).

## World-class hero — wondersmith pass (Concept A, user-chosen)

- Reworked the home hero to a **WebGL fragment-shader "Dispatch Lattice"** built to
  the wondersmith standard (one signature technique, the visitor is load-bearing).
  Process fix that finally broke the blind-shipping cycle: rendered **three live,
  cursor-interactive concept previews in `visualize` widgets** (A Dispatch Lattice /
  B Silicon Die / C Wavefront flow field); the user picked **A**, then I rendered the
  exact production hero (real two-column layout) as a fourth widget before committing.
- Elevated shader (over the automation's first Dispatch Lattice): a dim **parallax
  depth layer** behind the **main lattice** (warped cells + ambient diagonal waves +
  per-cell shimmer), **cursor bloom + ripple rings** on `u_active`, and **two crossing
  wavefront highlight lines**; blue→teal→violet ramp, vignette, pre-warmed clock.
- Robustness kept from the existing scaffold: WebGL → canvas-2D lattice → `<noscript>`
  SVG → reduced-motion still frame. Loaded by `app.js` only when `#hero-canvas` exists
  (home only, per the user's "home hero only, for now").
- VERIFIED: `node --check`; GLSL syntax-validated with `@shaderfrog/glsl-parser`
  (46 lines, all six elevation features asserted present); and — the key one — the
  exact production shader **compiled and rendered live in a real browser** via the
  visualize widget. `sw.js` CACHE bumped to v6. QA clean.
- Scope held to the home hero only; other pages keep the shared `gm-motion.js`
  entrance/scroll-reveal. A course-wide "motion DNA" accent remains available as a
  future pass if wanted.

## Course-wide backdrop (user override of the "home hero only" scope)

- The user asked for the Dispatch Lattice "as the entire course backdrop." I'd earlier
  advised against a full animated background on a learning site (readability/battery);
  they chose it anyway, so I built it the way that actually holds up:
  `assets/gm-backdrop.js` — a FIXED full-viewport **WebGL** layer injected behind every
  page by `app.js`. A dim, ambient-only variant of the lattice (no cursor), covered by
  a readability scrim.
- Safeguards: WebGL-only with a zero-regression fallback (body background is swapped to
  transparent ONLY after context+shader+first-frame succeed; otherwise the page keeps
  its CSS gradient). Scrim darkens the centered `.wrap` reading lane and lets the lattice
  breathe in the gutters. Low-res (0.62x) + ~30fps + low-power context + pause-on-hidden;
  phones (`max-width:520px`) skip it. `prefers-reduced-motion` → one static frame.
- Two tuning knobs surfaced (`LATTICE_DIM`, the scrim gradient) so intensity is a
  one-line change. VERIFIED: `node --check`, GLSL parsed with `@shaderfrog/glsl-parser`,
  and rendered live in a `visualize` widget behind realistic lesson prose (heading,
  paragraphs, a card, inline code) to confirm readability before shipping. `sw.js` CACHE
  bumped to v7 (+ `gm-backdrop.js` precached). QA clean. The home hero panel stays as the
  vivid, interactive instance; the backdrop is the calm site-wide layer — same visual
  language, two intensities.

## Module 0 — "The Big Picture" (new foundations, 6 lessons)

- Built a new **Module 0** before the math, on the user's "make it a complete
  masterclass, nothing left behind" brief: the missing conceptual on-ramp for a
  college student. Six full two-layer lessons (Concept → worked example → key
  points → quiz → exercises → go-deeper → gotchas → scenario → practice), plain
  English, each with hand-authored **inline SVG diagrams** (11 total) rather than
  the diagrams.js registry:
  - 0.1 What a computer actually does (fetch-execute, clock, the memory wall)
  - 0.2 The CPU — built for latency (caches, branch prediction, out-of-order)
  - 0.3 The GPU — built for throughput (SIMT, latency hiding, the bargain)
  - 0.4 CPU vs GPU — the trade-off (decision rule, host+device, Amdahl's law)
  - 0.5 How the GPU evolved (graphics → GPGPU → CUDA 2006 → AlexNet 2012 → tensor
        cores → Blackwell/Rubin) — dates + current frontier WEB-VERIFIED
  - 0.6 The GPU landscape & your roadmap (NVIDIA/AMD/Intel + software; the course→career map)
- **Integration:** new `module-0/` folder; curriculum.html gets a "Core · Module 0
  — The Big Picture (BUILT — start here)" section (moved "start here" off Module 1);
  index hero "Begin at" now points to Module 0 L1; concept-map.html CORE gains a
  "0" node and the core loop runs `["0".."5"]`; `tools/build-index.js` module list
  extended with `module-0` (it was hardcoded — new modules must be added or they
  won't index); search-data + SEO/sitemap rebuilt (110 urls). Headline counts
  updated site-wide: 84→90 lessons, 43→49-lesson core (index/curriculum/labs/prompt).
- **Verified:** all 12 SVG diagrams well-formed (XML-parsed); American English
  enforced (British-spelling scan per lesson); zero bare `$` in prose; and all 14
  numeric claims across the six lessons re-derived in node (clock ticks, cache-hit
  totals + 16× swing, throughput inversion 625×, Amdahl ceilings, layer MAC count)
  — ALL PASS. `qa.js` ALL CLEAN. `sw.js` CACHE → v12.

## Module 0 assessment integration + Amdahl's Law Explorer lab

- **Exam now includes Module 0**: re-ran `build-exam.js` (recursive walk auto-picks
  module-0) → 180 MCQs (was 168), Core group 98. Module 0 is now in EVERY system:
  search, concept map, review deck, prereqs/misconceptions, and the job-readiness exam.
  (Interview bank is a hand-curated advanced set, intentionally left as-is.)
- **New lab: `lab-amdahl.html`** — Amdahl's Law Explorer, tied to Lesson 0.4. Two
  live canvases (the serial-wall time bars + the diminishing-returns speedup curve
  with the ceiling asymptote), parallel-fraction + parallel-speedup sliders, preset
  serial fractions, plain-English verdict. Deterministic (no GPU/timing), chosen
  over the promised Stride-Cliff timing lab precisely because it's fully verifiable.
  Wired into labs.html "Reason with it" grid; cross-linked from lesson 0.4.
- **Verified:** `node --check` on the inline script; the full render pipeline
  executed across 220 slider combinations (incl. p=0, p→1, s=1) via a canvas-shim
  harness with zero throws; and the Amdahl math re-derived in Node — overall(0.9,50)=
  8.47, ceiling(0.9)=10, ceiling(0.99)=100, overall(0.8,∞)=5, overall(p,1)=1 — all
  pass. search-data + SEO/sitemap rebuilt (111 urls). `qa.js` ALL CLEAN. SW cache v15.
- Note: the labs.html "Stride Cliff (coming next)" WebGPU placeholder is deliberately
  still pending — a hardware-timed microbenchmark whose result can't be verified from
  the sandbox; deferred rather than shipped unverified.

## Two more labs + live GPU validation (Chrome connected)

- **lab-stride.html — The Stride Cliff (WebGPU, lesson 5.7)**: measures achieved
  memory bandwidth vs access stride; bar chart to the ~1/8 fp32 sector floor. The
  last labs.html "coming next" placeholder, now shipped. Address model + wrap logic
  verified in Node. **LIVE-VALIDATED on a real GPU** by running the exact benchmark
  via Chrome javascript_tool on the deployed https context (GPU-timed): 97.5 GB/s at
  stride 1 → 1.1 GB/s at stride 128 (floor 1.1% of peak) — a clean, dramatic cliff.
- **lab-softmax.html — Softmax Stability Explorer (Track A)**: naive softmax overflows
  to NaN on large logits vs the stable max-subtraction (the FlashAttention trick);
  editable logits + presets + naive/stable probability bars + verdict. Fills the
  Track A lab gap. Deterministic; 12 numeric checks verified in Node (naive→NaN on big
  logits, stable exact & sums to 1, argmax correct, fp32-overflow boundary ≈88.7).
- **LIVE VISUAL VALIDATION this session (Chrome):** deployed home page probed —
  reducedMotion:false, hero canvas heroWebGL:true with reveal complete, backdrop+scrim
  active (body transparent), 90-lesson stat, start-here→Module 0; two frames showed the
  hero wavefront MOVING (animation confirmed); search overlay opens fixed/centered
  (searchBoxTop 63px, not bottom); Module 0 lesson injects prereq + 2 misconceptions +
  2 diagrams; Amdahl lab renders with correct numbers (8.48×, ceiling 10×); Module 2
  shows 3 runnable Python cells; zero console errors. Both new labs wired into labs.html
  + search + SEO (113 sitemap urls); SW cache v17.

## All-Reduce Visualizer (lab-allreduce.html) — the multi-GPU communication lab

- **lab-allreduce.html — The All-Reduce Visualizer (Track A distributed + Track B MPI).**
  Fills the last "coming" track-visualizer gap and teaches the single most important
  multi-GPU concept: how gradients are summed across GPUs. Animated ring of N GPUs
  (2–8); toggle **ring all-reduce** vs **parameter server**; Play/Step/Reset; live
  byte tally + verdict. Ring: reduce-scatter (N-1 steps) then all-gather (N-1 steps),
  each moving one D/N chunk → 2(N-1)/N·D per GPU, balanced on every link, → 2D as N
  grows. Parameter server: root link carries (N-1)·D each way = N/2× the ring's per-GPU
  load (the hotspot). Both compute the identical sum; only the traffic pattern differs.
- **Verification (verify_allreduce.js):** re-derived the schedule independently — ring
  produces the EXACT element-wise sum on every GPU for N=2..8; per-GPU traffic ==
  2(N-1)/N·D to 1e-12; PS root == (N-1)·D; ratio == N/2. The lab embeds this exact
  reduce-scatter/all-gather indexing.
- **Runtime verification (DOM/canvas shim, harness.js + harness2.js):** drove the real
  page script through a full Play in BOTH modes for every N=2..8 plus the reduced-motion
  path — zero exceptions, all reach "Complete", and displayed numbers match (N=8,D=400 →
  PS root 2.73 GB = 7×400, ring 700 MB = 1.75×400).
- Auto-indexed by build-seo (canonical + sitemap, 114 urls) and build-index (search).
  Wired into labs.html "Go deeper" grid (first card). SW cache v18. QA: ALL CLEAN ✓.
- Prose has NO literal $ (uses <code>2(N-1)/N · D</code>), American English, reduced-motion
  guard (no auto token animation; steps still work), canvas sized to grow radius with N so
  cards never collide.

# GPU Mastery — from zero to deployed GPU code

A self-contained course website: school math → programming → C/C++ → hardware →
CUDA → four career tracks (ML/AI infra · HPC · Graphics · Portable GPU).

**COURSE COMPLETE — Core + all four career tracks BUILT: 84 lessons, 254 verified diagrams.**
**Track B — HPC/Scientific Computing (10 lessons):** numerical calculus with
measured orders and stability walls → GPU linear algebra with the measured
sparse crossover → stencils with physics fixtures (conservation to 2e-16) →
Monte Carlo with calibrated error bars → MPI+GPUDirect with the scaling
audit → directive porting → SLURM/checkpoint economics → the numerics
contract (including the executed -ffast-math Kahan deletion) → primitives →
a defensible multi-node scaling-study capstone.

The core (Modules 1–5, 43 lessons): Mathematical Foundations; Programming from
Zero; C & C++ for GPU Work; How Computers & GPUs Work; CUDA Fundamentals —
ending in the matmul-ladder capstone (2 GFLOP/s → ~40% of peak). **Track A —
ML/AI Infrastructure (11 lessons):** backprop from school math → PyTorch
internals → custom ops → Triton → FlashAttention (derived AND verified exact)
→ mixed precision (failures measured) → NCCL/DDP/FSDP → vLLM-era inference →
torch.compile → deployment → a fused-epilogue capstone served behind an
endpoint. **Track D — Vendor-Neutral / Portable GPU (9 lessons):** the CUDA
concepts proven vendor-neutral — the grand translation table → HIP and the
wavefront-64 trap (executed) → SYCL's runtime-inferred schedule → OpenCL's long
tail and SPIR-V → WebGPU in the browser (with a live, runnable reduction lab) →
Kokkos performance portability → Triton/MLIR compiler porting → honest
cost-and-watt cross-vendor benchmarking → a four-backend reduction capstone.
**Track C — Graphics / Game Engines (11 lessons):** the coordinate math and
rasterization pipeline as SIMT hardware → first triangle OpenGL→Vulkan 1.4 → GLSL
and the std140 trap → textures, sampling, and gamma → PBR lighting (GGX evaluated,
energy conservation checked) → compute shaders (the 5.8 reduction returns in GLSL) →
Vulkan sync → ray tracing (BVH, Möller-Trumbore executed, denoising) → frame
profiling → a small renderer with a ray-traced effect, budgeted and PSNR-tested.
All four tracks are now built; `HANDOFF-OPUS.md` and `prompt.html` are retained for
regenerating or extending the course.

## Use it as a desktop app (offline)

Open `index.html` in any browser. That's it — no install, no internet, no build
step. Quizzes, progress tracking, and diagrams all work from `file://`.
Optional app feel: in Chrome/Edge use "Save/Install page as app" to give it its
own window and icon. Progress is stored in the browser's localStorage (per
browser, per machine).

## Put it on the web (access from anywhere, ~2 minutes)

**Netlify Drop (fastest):** go to `app.netlify.com/drop`, drag this whole
`gpu-mastery` folder onto the page → you get a public URL immediately.

**GitHub Pages:** create a repo → upload this folder's contents → Settings →
Pages → Source: main branch, root → your course is at
`https://<you>.github.io/<repo>/`.

**Cloudflare Pages** works the same drag-and-drop way.

The site is pure static files — every free static host works.

## Folder layout

```
gpu-mastery/
  index.html          home + progress
  curriculum.html     the full 4-track map (84 lessons)
  setup.html          practice environments: Colab, WSL2+CUDA, ROCm, WebGPU
  prompt.html         the generator prompt that builds further modules
  assets/style.css    theme
  assets/app.js       quizzes, progress, diagram injection (no dependencies)
  assets/diagrams.js  verified SVG diagram pack — Module 1 (window.DIAGRAMS)
  assets/diagrams2.js verified SVG diagram pack — Module 2 (packs merge)
  assets/diagrams3.js verified SVG diagram pack — Module 3
  assets/diagrams4.js verified SVG diagram pack — Module 4
  assets/diagrams5.js verified SVG diagram pack — Module 5
  assets/diagramsA.js verified SVG diagram pack — Track A (34 diagrams)
  module-1/lesson-01..08.html
  module-2/lesson-01..08.html
  module-3/lesson-01..09.html
  module-4/lesson-01..07.html
  module-5/lesson-01..11.html   ← CUDA Fundamentals (core capstone)
  track-a/lesson-01..11.html    ← ML/AI Infrastructure (Track A)
  assets/diagramsB.js           ← Track B pack (30 diagrams)
  track-b/lesson-01..10.html    ← HPC / Scientific Computing (Track B)
  assets/diagramsC.js           ← Track C pack (34 diagrams)
  track-c/lesson-01..11.html    ← Graphics / Game Engines (Track C)
  assets/diagramsD.js           ← Track D pack (24 diagrams)
  track-d/lesson-01..09.html    ← Vendor-Neutral / Portable GPU (Track D)
  track-d/lab-webgpu.html       ← live in-browser WebGPU reduction lab
```

## Regenerating or extending the course

**`HANDOFF-OPUS.md` is the complete build system for the four career tracks** —
per-track lesson maps, the gold-standard spec with documented reasoning, the
diagram + QA protocols, and copy-paste session prompts. Open it, follow PART 0,
and paste the PART 11 session prompts into Claude (Opus 4.8 or later), one per
session, with this folder connected. Progress between sessions is tracked in
`TRACKS-PROGRESS.md`.

## Extending the course

1. Open `prompt.html`, copy the prompt, set the `{{MODULE}}` line
   (e.g. `Module 2: Programming from Zero`).
2. Give the LLM one existing lesson file + `assets/diagrams.js` as conventions
   references.
3. Save generated lessons as `module-2/lesson-01.html`… and append the new
   diagram pack it produces to `assets/diagrams.js` (or add a second pack file
   and a script tag — packs merge into `window.DIAGRAMS`).
4. Add the module's lesson list to `curriculum.html` (copy the Module 1 block,
   update `data-lesson` ids like `m2l1` — progress tracking picks them up
   automatically).

## Practice environments (summary — details in setup.html)

- **Google Colab** (free): real NVIDIA GPU, runs Python *and* compiles CUDA C++
  via `%%writefile` + `!nvcc`. Zero install. Enough for Modules 2–5.
- **Own NVIDIA GPU:** Windows → WSL2 + CUDA toolkit 13.x; Linux → native.
  Remember: driver (nvidia-smi) and toolkit (nvcc) are separate things.
- **AMD GPU:** ROCm 7.x + HIP on Linux (Track D2 path).
- **Any browser:** WebGPU compute (Track D5) — no install at all.

Content verified against the July 2026 stack: CUDA 13.3, PyTorch 2.x with
Triton 3.x, ROCm 7.2, Vulkan 1.4, WebGPU in all major browsers.

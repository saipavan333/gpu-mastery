# GPU MASTERY — COMPLETE HANDOFF FOR CLAUDE OPUS 4.8
## Build Tracks A–D (41 lessons) + finish work, to the exact standard of the completed core

Written by the model that built Modules 1–5 (43 lessons, 132 verified diagrams).
Everything below is the distilled method — including the reasoning behind every
rule, because the rules without the reasons decay into cargo cult within two
sessions. **REASONING blocks are addressed to both the running model and to
Pavan**: they document why the method is shaped this way.

---

# PART 0 — HOW TO USE THIS FILE

You (Opus) will build four career tracks on top of a finished 5-module core:

- **Track A — ML/AI Infrastructure** (11 lessons, folder `track-a/`)
- **Track B — HPC / Scientific Computing** (10 lessons, folder `track-b/`)
- **Track C — Graphics / Game Engines** (11 lessons, folder `track-c/`)
- **Track D — Vendor-Neutral / Portable GPU** (9 lessons, folder `track-d/`)

Work in **sessions of bounded scope** (context limits are real). Per track:

- Session 1: verify current facts (web search) → build + verify the diagram pack
- Session 2: write lessons 1–4
- Session 3: write lessons 5–8
- Session 4: write remaining lessons → integrate site pages → run FULL QA → update `TRACKS-PROGRESS.md`

At the START of every session: read this file, read `TRACKS-PROGRESS.md`
(create it on first session), and read ONE existing lesson
(`module-5/lesson-07.html` is the best single style reference) plus the first
100 lines of `assets/diagrams5.js`. At the END of every session: update
`TRACKS-PROGRESS.md` with what is done, what is next, and any decisions made.

> **REASONING — why a progress ledger file:** sessions lose memory. The core
> was built across many sessions and every continuation risk (drifting
> conventions, re-inventing decisions, contradicting earlier numbers) was
> controlled by re-reading artifacts, never by trusting recall. The ledger
> makes any future session resumable by a cold model in five minutes. Treat
> your own past sessions as untrusted collaborators whose work you re-verify.

Copy-paste session prompts are in **PART 11**. The user should paste those,
one per session, in order.

---

# PART 1 — THE CONTRACT (conventions that must not drift)

The site is pure static HTML/CSS/JS, fully offline, no dependencies. These are
load-bearing conventions; every generated file must obey them exactly.

**Files & folders**
```
gpu-mastery/
  assets/style.css      shared theme — DO NOT EDIT
  assets/app.js         quiz/progress/diagram engine — DO NOT EDIT
  assets/diagrams.js …diagrams5.js   existing packs — DO NOT EDIT
  assets/diagramsA.js   ← you create (then B, C, D)
  track-a/lesson-01.html … lesson-11.html   ← you create
  index.html, curriculum.html, README.md    ← you EDIT (integration only)
  TRACKS-PROGRESS.md    ← you create/maintain
```

**Per-lesson HTML contract** (copy the skeleton from any module-5 lesson):
- `<body data-lesson="al3">` — progress key: track letter + `l` + number
  (`al1…al11`, `bl1…bl10`, `cl1…cl11`, `dl1…dl9`). Must be unique site-wide.
- Nav block identical to existing lessons (relative links `../index.html` etc.).
- Diagrams: `<div class="diagram" data-diagram="KEY" data-caption="…"></div>`
  — app.js injects the SVG from `window.DIAGRAMS[KEY]` at page load.
- Quizzes: `<div class="quiz">` containing one `<div class="q">`, 3–4
  `<button class="opt">` of which **exactly one** has `data-c="1"`, then one
  `<div class="expl">`. app.js wires the interactivity.
- Exercises/practice: `<details><summary>…</summary><div class="body">…</div></details>`.
- Pager `<div class="pager">` linking prev/next lesson; first lesson links back
  to `../curriculum.html`, last links forward to it.
- Scripts at the bottom: the track's diagram pack THEN `../assets/app.js`.

**Diagram pack contract** (`assets/diagramsA.js`): one IIFE, same header as
`diagrams5.js` (copy its palette `C`, font `F`, helpers `esc/box/t/ln/tri/svg`
verbatim), diagrams registered as `D["a1-toolstack"] = (function(){ … })();`,
ending with `window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, D);`
Key naming: `a3-fusion`, `b2-cublas-flow`, `c7-compute`, `d5-wgsl` — lesson
number prefix, short kebab suffix.

**HTML escaping law:** inside ANY text or code block, `<` followed by a letter
MUST be `&lt;` (so CUDA launches are `&lt;&lt;&lt;grid, block&gt;&gt;&gt;`).
`<` followed by a digit, space, or `=` is technically safe but escape anyway.

> **REASONING:** the core's final QA found a rendering bug where a raw
> `<<<blocks, threads>>>` made the browser parse `<blocks…>` as an HTML tag
> and silently swallow the text. Silent content loss is the worst failure
> class in an offline site nobody re-proofreads. One mechanical rule kills it.

---

# PART 2 — THE GOLD STANDARD (lesson anatomy + why each part exists)

Every lesson is one self-contained HTML page with TWO layers.

**Layer 1 — the card** (the 80% a learner needs):
1. `<h1>` + `<p class="lead">` — the lesson's thesis in two sentences, always
   connecting to something already learned.
2. **Concept** — 3–5 `<h3>` subsections, each with a diagram and/or code block.
   Code blocks carry inline commentary (the `// why` voice), not bare listings.
3. **Worked example** (`<div class="card">`) — ONE realistic task solved with
   REAL NUMBERS, prediction stated before result, and a closing "what to
   internalize" paragraph.
4. **Key points** — exactly 6 `<li>`, each a full sentence with its mechanism,
   not a keyword.
5. **Quiz** — exactly 2 questions. Each is a small SCENARIO with a tempting
   wrong answer; the `expl` teaches why the distractors fail. The correct
   option is often the longest (it contains the full reasoning) — that is fine.
6. **Exercises** — exactly 2, done-on-a-real-machine style (Colab for A/B,
   local tools for C/D), each with full expected results in the body.

**Layer 2 — "Go deeper"** (after an `<hr>`, its own `<h1>`):
7. 2–3 numbered sections of internals/edge material with real syntax and at
   least one comparison or decision table (as `<pre>` tables — no HTML tables
   needed).
8. **Gotchas** — ≥6 `<div class="gotcha">`, each a REAL field failure with its
   mechanism and defense, not generic advice.
9. **Scenario** — one prose story (a production incident, a code review, an
   inherited system) where the lesson's knowledge is the decisive variable,
   ending with an explicit engineering moral.
10. **Practice** — exactly 7 `<details>` problems with full solutions; #7 is
    ALWAYS "the interview closer": a complete spoken-answer skeleton to the
    canonical interview question of this lesson.

**Voice:** a senior mentor who has been burned — direct, concrete, occasionally
wry, never breathless. Numbers over adjectives. Every claim either executed,
cited to a core lesson, or labeled "representative".

**Tie-back discipline:** every new concept explicitly cites the earlier lesson
it stands on, in the form "(5.7's sector floor)" or "(M1 L8's budget)". Target
5–15 tie-backs per lesson. The core anchors you will cite constantly:

- M1 L2 index arithmetic · M1 L7 measurement ritual (warmup, median-of-K,
  predict-first) · M1 L8 floats: non-associativity, budgets vs bitwise
- M2 L5 strides/views · M2 L6 testing constitution (fixtures, oracles, layers)
  · M2 L7 AoS/SoA
- 3.3 contracts/asserts · 3.5 ownership/malloc · 3.7 RAII · 3.8 sanitizers
- 4.4 warps/latency hiding · 4.5 memory system · 4.6 bridge economics /
  Little's law · 4.7 roofline + "the gap is the to-do list" + stopping rule
- 5.2 launch identity/guard · 5.3 two worlds + async model · 5.4 error
  channels/sanitizer · 5.5 tiling/barriers · 5.6 occupancy dial/ILP ·
  5.7 sectors/coalescing · 5.8 privatize-then-merge/determinism ·
  5.9 streams/max-lane law · 5.10 nsys-then-ncu · 5.11 trust stack/ship rules

> **REASONING — why tie-backs are the single most important stylistic rule:**
> a curriculum's value over a pile of blog posts is that concept N is TAUGHT
> IN TERMS OF concepts 1…N−1. Tie-backs force that: they make forgetting
> expensive and review automatic, they let hard new ideas (occupancy, streams)
> compress into one sentence of prior vocabulary, and they are honest — GPU
> engineering genuinely is ~20 primitive ideas recombined. When a draft
> paragraph has no tie-back available, that is a signal the curriculum is
> missing a prerequisite, not a license to hand-wave.

> **REASONING — why exactly 2 quizzes / 6 keypoints / 7 practice:** fixed
> quotas are quality raters. Unlimited quizzes drift into trivia; exactly two
> forces choosing the two misconceptions that actually cost engineers money.
> Practice #7 as the interview closer guarantees every lesson terminates in
> employable speech, which is the course's contract ("job-ready, defensible").

**DIAGRAMS — NO CAP (standing user instruction):** include as many diagrams as
understanding requires — the core averages ~3 per lesson; complex lessons may
need more. Never pad: each diagram must earn its place by showing STRUCTURE
(flows, layouts, timelines, ladders) that prose states less clearly. Every
diagram must pass the PART 4 verification before any lesson references it.

---

# PART 3 — THE WORKFLOW (order is load-bearing)

Per track, strictly in this order:

**STEP 1 — Verify facts (web search, ~30 min).** Each track's PART 6–9 section
lists the facts to verify. Record findings + dates in `TRACKS-PROGRESS.md`.
Baseline as of July 2026 (RE-VERIFY — do not trust this list at build time):
CUDA 13.3 · PyTorch 2.x + Triton 3.x · ROCm 7.2 · Vulkan 1.4 · WebGPU in all
major browsers · Colab free tier = T4 (sm_75) · RTX 5090 = sm_120 ·
B200/B300 shipping, Rubin (HBM4) arriving · NVLink 5 = 1.8 TB/s ·
PCIe gen5 ×16 ≈ 64 GB/s.

> **REASONING:** the single fastest way a technical course dies is version
> rot presented confidently. Facts about the living ecosystem (API names,
> version numbers, what Colab gives you free) must come from TODAY's search,
> not from training data — the core re-verified before every module and it
> caught real drift each time.

**STEP 2 — Build the diagram pack, verify it, THEN write lessons.**

> **REASONING — why diagrams first:** lessons reference diagram keys; writing
> lessons first creates dangling keys and — worse — prose that describes
> diagrams that don't exist yet, which then get built to match possibly-wrong
> prose. Building diagrams first forces you to design each lesson's structural
> story before writing it, and the verification loop (PART 4) is much cheaper
> run once per pack than interleaved with lesson writing.

**STEP 3 — Write lessons in batches of 3–4.** Full gold standard each; no
placeholders, no "TODO", no thin lessons to be fattened later.

**STEP 4 — Integrate.** curriculum.html: replace the track's `dim` summary
paragraph with a full `lesson-list` (copy Module 5's block, adjust ids/links;
badge → `<span class="badge good">BUILT</span>`). index.html: add a track card
mirroring the Module 5 card. README.md: update counts and the folder tree.

**STEP 5 — QA (PART 5). Nothing ships un-QA'd.** Then update the ledger.

---

# PART 4 — DIAGRAM SYSTEM (build + verify)

Geometry rules (calibrated for `assets/style.css`):
- `viewBox="0 0 640 H"` — width ALWAYS 640; height fits content exactly.
- Text width estimate: `chars × fontSize × 0.52` px. Every text element must
  satisfy `x + estWidth ≤ 634` (left-anchored) or centered equivalents.
- Fills/strokes ONLY from the palette object `C` (copy from diagrams5.js).
- Font sizes: 10–13px labels, 14–16px titles. No text below 9.5px.
- Arrowheads only via the `tri()` helper and only attached to drawn lines.
- Dense diagrams: prefer MORE VERTICAL SPACE over smaller text — the page
  scrolls, squinting doesn't.

**Mandatory verification loop** (run in the sandbox after writing each pack):
1. Write `/tmp/check.js` — a static checker that parses every SVG string and
   flags: any element outside the viewBox; any text whose estimated width
   overflows; any `tri()` arrowhead not within 3px of a line endpoint. (The
   core's checker: ~60 lines of regex extraction over rect/text/line/circle —
   rebuild it; it pays for itself in the first pack.)
2. Fix until ALL CLEAN.
3. Render a contact sheet to PNG (node + a renderer, or Python `cairosvg`) —
   3 sheets of ~11 diagrams each — and LOOK at them with your vision. Check:
   overlaps the static checker can't model, misaligned columns, labels
   colliding with boxes, arrows pointing at nothing.
4. Only then are the keys legal to reference from lessons.

> **REASONING:** SVG written blind has a ~30% visual-defect rate (measured
> across the core's 132 diagrams: every pack needed fixes; the checker caught
> ~80% of them, eyes caught the rest). A broken diagram is worse than none —
> it teaches a wrong structure confidently. The two-stage check exists because
> each stage catches what the other cannot: geometry math catches overflow
> eyes would miss at thumbnail size; eyes catch semantic misalignment math
> cannot see.

---

# PART 5 — QA PROTOCOL (the part most models skip; do not skip it)

**5a. Structure check** — run this after each batch and at track end
(adapt `TRACK` and tag whitelist; this is the exact core script):

```js
// /tmp/qa.js  — node /tmp/qa.js
const fs=require('fs'); const TRACK='track-a', PACK='assets/diagramsA.js';
let keys=new Set();
for (const f of fs.readdirSync('assets').filter(f=>f.startsWith('diagrams')))
  for (const m of fs.readFileSync('assets/'+f,'utf8').replace(/\0/g,'')
       .matchAll(/D\[["']([a-z0-9-]+)["']\]/g)) keys.add(m[1]);
let fail=0;
for (const f of fs.readdirSync(TRACK).filter(f=>f.endsWith('.html')).sort()){
  const h=fs.readFileSync(TRACK+'/'+f,'utf8').replace(/\0/g,''); const p=[];
  if(!h.includes('</html>')) p.push('TRUNCATED');
  for(const m of h.matchAll(/data-diagram="([^"]+)"/g))
    if(!keys.has(m[1])) p.push('missing key '+m[1]);
  h.split('<div class="quiz">').slice(1).forEach((q,i)=>{
    const b=q.slice(0, q.indexOf('<div class="expl">'));
    if((b.match(/data-c="1"/g)||[]).length!==1) p.push(`quiz ${i+1} data-c!=1`);});
  for(const m of h.matchAll(/href="(lesson-[0-9]+\.html)"/g))
    if(!fs.existsSync(TRACK+'/'+m[1])) p.push('dead link '+m[1]);
  const TAGS='html|head|meta|title|link|body|nav|div|a|span|h1|h2|h3|p|pre|code|ul|li|button|details|summary|hr|script|em|strong|br|table|tr|th|td';
  const re=new RegExp('<(?!/?(?:'+TAGS+')\\b)[A-Za-z]','g');
  if(re.test(h)) p.push('raw <letter — escaping bug');
  console.log(f+': '+(p.length?('PROBLEMS: '+p.join(' | ')):'OK'));
  if(p.length) fail++;
}
console.log(fail?'FAILURES '+fail:'ALL CLEAN');
```

**5b. Execute the claims.** Every number and code behavior in a lesson is a
claim. Classify each:
- **Executable here** → run it in the sandbox and fix the lesson to match
  reality. Per track: A — install CPU PyTorch (`pip install torch --index-url
  https://download.pytorch.org/whl/cpu --break-system-packages`) and run every
  tensor/autograd/numerics claim; algorithmic kernels (softmax, layernorm,
  attention math, quantization error) simulate in NumPy/C++ exactly as the
  core simulated CUDA kernels. B — NumPy/C++ for stencils, Monte Carlo
  convergence rates (1/√N!), FD truncation orders, ODE integrator error
  slopes. C — all the math (matrix/quaternion/projection identities,
  barycentric interpolation, PBR term arithmetic) in NumPy; GLSL/WGSL/Vulkan
  API claims verified against official docs via web fetch. D — HIP/SYCL/WGSL
  API signatures against docs; performance-portability arithmetic by hand.
- **Not executable** (needs GPU/driver/window system) → mark the number
  "representative", keep it CONSISTENT with the ledger below, and prefer
  ratios ("~2×", "~8× floor") over absolutes.

**5c. The numbers ledger — do not contradict the core.** The core's recurring
machine is Colab's T4: sm_75 · 40 SMs · 8.1 TF fp32 · 320 GB/s spec / ~220
achievable · 64 KB smem/SM · 65,536 regs/SM · 1024 threads/SM · 2 copy
engines · PCIe gen3 ≈ 11–12 GB/s pinned. Canonical results already printed in
core lessons: matmul ladder 2.1 / ~95 / ~600 / ~2200 / ~3200 GFLOP/s vs
cuBLAS ~4400; 16M-float reduction 28 ms → 0.48 → 0.33 (ceiling 0.32); stride
cliff floor = 1/8 for fp32. If a track lesson touches these, it must MATCH.

> **REASONING — why "execute the claims" is non-negotiable:** across the
> core's QA, running the numbers found ~10 real bugs that read perfectly:
> a quiz asserting two float loop-orders differ when they are bitwise
> identical; a branch demo that -O2 silently compiled into a branchless cmov
> (measuring nothing); an energy estimate off by 1000×; a sanitizer example
> blaming an in-bounds thread; a compute-time claim off by 2.4×. Prose review
> catches zero of these — only execution does. And each fix became a BETTER
> lesson than the unbugged draft would have been, because reality is a
> sharper teacher than plausibility. This is also the course's own doctrine
> (M1 L7, M2 L6, 5.11) applied to itself — the course must pass its own bar.

**5d. Consistency greps.** Before closing a track: grep all its lessons for
each canonical number/version and confirm one value everywhere; grep `<<<`;
grep `TODO|PLACEHOLDER|TBD` (must be zero hits).

---

# PART 6 — TRACK A: ML / AI INFRASTRUCTURE (11 lessons, `track-a/`)

**Facts to verify first:** current stable PyTorch + its Triton version; FlashAttention
generation in use; fp8 formats & hardware support (H100/B200); current vLLM
architecture (paged KV, continuous batching); NCCL version + collectives;
torch.compile/Inductor status; Triton language surface (tl.load masks, program_id,
num_warps/num_stages); tensor-core dtypes per arch (T4: fp16 only; Ampere+: TF32/bf16;
Hopper+: fp8). Colab T4 CAN run Triton and torch.compile — every lesson's exercises
should be Colab-runnable where possible.

**The through-line (state it in A1 and every capstone-thread mention):** the core
taught you to make ONE kernel fast; Track A is about making a MODEL fast, where the
unit of optimization is the whole graph — and the biggest lever is almost never a
faster kernel but a SKIPPED memory round-trip (fusion), a SMALLER dtype (mixed
precision), or a better-scheduled fleet (distributed, serving).

- **A1 — Calculus for backprop, from school level.** Slopes → derivative as local
  linear model → chain rule as bookkeeping → gradients/Jacobians → backprop as
  chain-rule-on-a-graph with memoization. Worked example: differentiate a 3-layer
  MLP's loss by hand for ONE weight, then verify numerically (finite differences —
  the M1 L7 predict/measure ritual applied to math). Tie the sum/dot-product
  gradients to M1's Σ machinery. Executable: 100% (NumPy). Diagrams: computation
  graph fwd/bwd; chain-rule ladder; finite-difference check.
- **A2 — PyTorch internals: tensors, autograd, dispatcher.** Tensor = M2 L5's
  strides + dtype + device (LITERALLY the same model — cite it); views vs copies
  redux; autograd tape, requires_grad, .backward(), .item() as a 5.3-quiz-2 sync
  trap; the dispatcher (device/dtype → kernel) as the answer to "where does my
  matmul actually run"; CUDA async semantics in torch (torch.cuda.synchronize
  before timing = 5.9's event discipline). Executable: CPU torch covers ~all.
- **A3 — Custom CUDA ops for PyTorch.** cpp_extension, the binding boilerplate,
  contiguity contracts (`.contiguous()` and why — M2 L5), gradcheck as the fixture
  (M2 L6's constitution wearing torch clothes), streams passed in (5.9's rule:
  every library call takes a stream). Worked example: bind the 5.8 reduction as a
  torch op with a correct backward.
- **A4 — Triton 3.x kernels in Python.** Program model: one PROGRAM per tile
  (vs CUDA's one thread per element — map the concepts explicitly: program_id ↔
  blockIdx, masks ↔ 5.2's guard, BLOCK_SIZE ↔ 5.5's tile); tl.load/store masking;
  autotune; num_warps/num_stages as 5.6's dial with a tuner. Worked example:
  saxpy → softmax in Triton, fixture vs torch (budget compare, M1 L8).
- **A5 — ML kernel patterns: fusion, softmax, layernorm, FlashAttention.** The
  traffic ledger of an unfused softmax (5 passes over HBM) vs fused (1) — 4.6/4.7
  arithmetic deciding everything; online softmax (the max-subtraction trick as
  M1 L8 overflow defense); layernorm's two-pass vs Welford; FlashAttention as
  5.5's tiling applied to attention (O(N²) HBM → O(N)) — derive the tile math,
  don't just cite the paper. Executable: NumPy simulations of every algorithm,
  exactness/budget policies stated.
- **A6 — Mixed precision & tensor cores.** fp16/bf16/TF32/fp8 formats (M1 L8
  extended — mantissa/exponent tables), loss scaling (why: gradient underflow),
  accumulate-in-fp32 law (5.11's gotcha, now the whole lesson), tensor-core
  shapes (multiples of 8/16) and why (the MMA unit's tile), what T4 has vs
  Ampere/Hopper/Blackwell. Executable: quantization-error measurements in NumPy.
- **A7 — Multi-GPU: NCCL, DDP, FSDP.** Ring/tree allreduce with BANDWIDTH MATH
  (2(n−1)/n × size — derive it; 4.6's tolls at cluster scale); DDP's
  overlap-backward-with-allreduce (5.9's pipeline law, model edition); FSDP's
  shard-gather-compute-release as a memory/traffic trade; NVLink vs PCIe vs IB
  topology reading. Executable: allreduce traffic arithmetic; simulate ring steps.
- **A8 — Inference: quantization, KV-cache, batching, vLLM.** KV-cache size
  arithmetic (the interview staple — do it for a named model); paged KV as 3.5's
  heap fragmentation solved by paging; continuous batching as 5.9's max-lane law
  on requests; int8/int4 weight quantization error budgets (M1 L8); prefill vs
  decode as compute-bound vs memory-bound (4.7 verdicts — decode reads the whole
  model per token!). Executable: all the arithmetic; quantization sims.
- **A9 — torch.compile & TorchInductor.** Graph capture (dynamo), what fuses and
  what breaks fusion (graph breaks: .item(), data-dependent control flow — 5.3's
  sync trap AGAIN), Inductor emitting Triton (A4 pays off), reading the generated
  kernels, when compile wins (small ops, fusion-rich) vs doesn't (already
  library-bound). Executable on CPU: torch.compile works CPU-side; measure.
- **A10 — Deployment: Docker+CUDA, Triton Inference Server, monitoring.** The
  driver/toolkit boundary in containers (5.1's split, containerized), image
  hygiene, TIS model config/batching, SLO math (p50/p99 from 5.9's scenario),
  GPU utilization metrics that lie (util% ≠ SOL% — 5.10's regimes), the
  watchdog-restart pattern (5.4 quiz 1) as deployment architecture.
- **A11 — CAPSTONE: a custom fused kernel, profiled and deployed.** Fuse
  bias+GELU (+residual) into a matmul epilogue (Triton), prove it: fixture vs
  torch reference (budget policy), ncu before/after (traffic delta = the win),
  serve it behind an endpoint, README to the 5.11 ship standard (trust stack,
  regime labels, stranger test). Mirror 5.11's structure: spec → trust stack →
  rungs → defense bank (7 questions incl. "when do custom kernels beat
  torch.compile?").

Diagram pack `diagramsA.js`, keys `a1-…` — expect ~30: computation graphs,
stride/dispatch flows, fusion traffic ladders, FlashAttention tiles, ring
allreduce, KV-cache paging, serving pipeline, precision format tables.

---

# PART 7 — TRACK B: HPC / SCIENTIFIC COMPUTING (10 lessons, `track-b/`)

**Verify:** current OpenMPI/MPICH + CUDA-aware MPI status; SLURM basics stable;
Apptainer (née Singularity); GPUDirect RDMA; cuFFT/cuSPARSE/cuSOLVER API
generations; OpenACC/OpenMP-offload compiler landscape (nvc++, clang).

**Through-line:** correctness has a different meaning here — the answer is a
PHYSICAL quantity with an error budget (M1 L8 grows teeth), and the machine is
a CLUSTER (4.6's bridge becomes a network).

- **B1 — Numerical calculus from scratch.** Finite differences (derive forward/
  central + their O(h)/O(h²) orders and MEASURE the slopes — beautiful M1 L7
  exercise), the h too-small floor (float cancellation — M1 L8 live), Euler →
  RK4 with measured convergence, stability (the exploding Euler oscillator).
  100% executable. This lesson is the track's A1: math taught by experiment.
- **B2 — cuBLAS/cuSPARSE/cuSOLVER.** Library-first doctrine (5.11 quiz 1 is the
  thesis); column-major trauma (5.11's gotcha, now the daily reality — the
  transpose identity); handles/streams; sparse formats (CSR/COO/ELL) as M2 L7
  layout decisions with fill-ratio arithmetic; when sparse beats dense (the
  crossover is ~worse than people think — compute it).
- **B3 — Stencils & grid codes.** 5.5 P6's stencil grown up: 2D/3D tiling with
  halos, halo-exchange as the future MPI pattern, red-black/Jacobi iterations,
  convergence measured; roofline for stencils (low AI — bandwidth citizens,
  4.7 verdicts).
- **B4 — Monte Carlo & cuRAND.** 1/√N convergence MEASURED (log-log slope −½ —
  M1's log literacy), parallel RNG correctness (independent streams, NOT seeds+i
  — show a collision disaster), variance reduction (antithetic, stratified) with
  measured variance ratios, π/option-pricing worked examples. Highly executable.
- **B5 — MPI+CUDA, NCCL, GPUDirect.** Rank model, halo exchange (B3 pays off)
  with overlap (5.9's ring at cluster scale), CUDA-aware MPI vs staging
  (4.6's staging tax, network edition), GPUDirect RDMA paths, weak vs strong
  scaling MEASURED-style tables and Amdahl/Gustafson honesty (4.3 tie).
- **B6 — OpenMP/OpenACC offload.** Directive model as "the compiler writes 5.3's
  plumbing"; data clauses ARE the ownership tables (3.5); when directives reach
  ~90% of CUDA and when they wall out; the pragma-audit workflow (map= mistakes
  = silent 4.6 round-trips — the classic).
- **B7 — Clusters: SLURM, modules, Apptainer.** sbatch/srun/gres anatomy, the
  module system vs containers, reproducible environments (B8 setup), job arrays
  for sweeps, respectful-citizen rules (scratch vs home, checkpointing —
  preemption as a FEATURE of cheap queues).
- **B8 — Precision & reproducibility.** The science edition of M1 L8 + 5.8:
  Kahan/pairwise summation with measured error growth, deterministic reductions
  across ranks (5.8's slot-array at MPI scale), ULP-budget regression tests for
  simulations, the "same cluster, different answer" postmortem taxonomy,
  when double is mandatory vs fp32-with-compensation.
- **B9 — Thrust/CUB/cuFFT.** The library ladder AGAIN (thrust one-liners → CUB
  block primitives = 5.8's ladder productized → cuFFT plans/batching/layout),
  plan reuse (5.3's alloc-once law), FFT correctness fixtures (Parseval as the
  oracle — lovely M2 L6 citation).
- **B10 — CAPSTONE: one simulation, 1 GPU → multi-node.** A 2D heat/wave code:
  correct serial oracle → single-GPU (tiled, B3) → multi-GPU halo exchange (B5)
  → SLURM batch (B7) → scaling study with honest efficiency table → repro
  package (B8): fixed seeds, error budgets, machine files. Defense bank incl.
  "why is your weak-scaling efficiency 82% and where did 18% go?"

Pack `diagramsB.js` (~28): FD stencils, convergence log-log plots, halo
exchanges, ring topologies, sparse formats, SLURM lifecycle, scaling curves.

---

# PART 8 — TRACK C: GRAPHICS / GAME ENGINES (11 lessons, `track-c/`)

**Verify:** Vulkan 1.4 core features (dynamic rendering, sync2, bindless
status); current SDK (LunarG) + validation layers; VK_KHR_ray_tracing_pipeline
& ray query; RenderDoc + Nsight Graphics current; wgpu/Dawn as fallback lab.
**Lab reality:** sandbox can't open windows — exercises target the learner's
own machine (any GPU vendor works for C1–C8; RT needs RTX/RDNA2+; state this
in C1 and offer headless/offscreen alternatives where possible). All MATH is
sandbox-verifiable in NumPy — verify every formula.

**Through-line:** a frame is a 16.6 ms budget (5.9's max-lane law where the
pipeline is the GPU itself), and graphics is throughput engineering where the
consumer is an eyeball, not a fixture — so correctness becomes "measurably
plausible" (PSNR, reference renders) instead of bitwise.

- **C1 — Graphics math.** Homogeneous coordinates (why w — affine becomes
  linear, M1's matrix machinery closing its arc), model/view/projection derived
  (do the perspective divide BY HAND for 2 points), quaternions vs Euler
  (gimbal demo by matrix arithmetic), normals need inverse-transpose (PROVE it
  with a sheared normal in NumPy). 100% executable math.
- **C2 — The rasterization pipeline.** The logical stages (IA → VS → raster →
  FS → ROP) mapped onto 4.4's SIMT hardware (fragments come in 2×2 quads —
  divergence 5.6 explains helper lanes!), barycentric interpolation computed
  by hand, perspective-correct vs affine (the PS1 wobble as the gotcha),
  z-buffer precision (M1 L8: why near-plane hoarding happens, reverse-Z fix).
- **C3 — First triangle: OpenGL → Vulkan 1.4.** The 50-line GL triangle, then
  the SAME triangle in Vulkan with every object explained as a 5.x concept
  (queues = 5.9 streams; command buffers = recorded launches; memory heaps =
  5.3's worlds; pipelines = compiled state). Dynamic rendering to skip
  legacy renderpass ceremony. "Why so verbose" answered honestly: explicit =
  the driver guesswork you now OWN (the 5.9 sync lesson as API design).
- **C4 — GLSL shaders deep dive.** Vertex/fragment I/O contract, uniforms/
  UBOs/SSBOs/push constants (a 4.5-style latency table!), std140/std430 layout
  rules as M2 L5 strides with alignment traps (vec3 padding — THE classic),
  texture sampling in shader code, shader compilation to SPIR-V (3.1's
  pipeline redux).
- **C5 — Textures, sampling, mipmaps.** Filtering math (bilinear by hand),
  mipmaps as 4.5's locality engineered for minification (derivatives choose
  the level — quads again!), anisotropy, sRGB (gamma — do the 0.5-isn't-half
  demo numerically), compressed formats (BC/ASTC) as bandwidth citizens (4.6).
- **C6 — Lighting: Phong → PBR.** Lambert/Blinn-Phong derived and computed for
  one point BY HAND, then the microfacet framework (NDF/G/F with the actual
  GGX/Smith/Schlick formulas evaluated numerically), energy conservation
  checked by integration (NumPy Monte Carlo — B4 cameo), metalness workflow.
  The math is fully verifiable — verify it.
- **C7 — Compute shaders.** The reunion lesson: workgroups = 5.2 blocks, shared
  = 5.5, barriers = 5.5's laws, subgroups = 5.6 warps — write the 5.8 reduction
  in GLSL compute and feel the déjà vu (that's the POINT: the core transfers).
  Post-processing (blur separability arithmetic: 2N vs N² taps), particle
  systems, GPU-driven culling teaser.
- **C8 — Vulkan explicit model: command buffers & sync.** Recording/submission/
  reuse, THE sync chapter: pipeline barriers/semaphores/fences/timeline
  semaphores mapped 1:1 onto 5.9's events-and-streams mental model (same
  graph, new names — provide the translation table), frames-in-flight =
  DEPTH-3 ring (5.9 P4 verbatim), the swapchain dance, validation layers as
  5.4's sanitizer (never develop without).
- **C9 — Ray tracing.** BVH as log(N) culling (M1's log lesson cashing in),
  the RT pipeline (raygen/hit/miss + SBT — the function-pointer table 3.6
  promised would return), ray-triangle (Möller–Trumbore) EXECUTED in NumPy,
  RT cores as fixed-function BVH/intersection (4.4's specialization story),
  denoising reality (1 spp is noise — the temporal accumulation bargain),
  hybrid pipelines (shadows/reflections/GI à la carte).
- **C10 — Frame profiling: RenderDoc & Nsight Graphics.** The 5.10 doctrine
  refitted: capture-first (RenderDoc = WHERE in the frame), then counters
  (Nsight = WHY in the pass); classic frame pathologies with fixes
  (overdraw, tiny draws = 5.2's launch confetti, bandwidth-blown G-buffers =
  4.6, sync bubbles = 5.9); the 10-minute frame triage runbook (mirror 5.10
  P3).
- **C11 — CAPSTONE: small renderer + one ray-traced effect.** Vulkan renderer:
  glTF loading, PBR forward pass, shadow map, then RT shadows OR reflections
  toggleable; frame-time budget table per pass (RenderDoc numbers); a
  reference-image test harness (PSNR vs golden renders — the fixture doctrine
  adapted to eyeballs); README to 5.11 ship standard; defense bank
  ("walk me through your frame", "why is your shadow pass 3.1 ms?").

Pack `diagramsC.js` (~34 — graphics is diagram-hungry): pipeline stages,
coordinate spaces chain, barycentric/quad diagrams, std140 layouts, mip
pyramids, BRDF geometry, sync graphs, frames-in-flight ring, BVH traversal,
RT pipeline/SBT, frame timeline anatomies.

---

# PART 9 — TRACK D: VENDOR-NEUTRAL / PORTABLE GPU (9 lessons, `track-d/`)

**Verify:** ROCm 7.x supported GPUs + hipify tooling; SYCL 2020 implementations
(oneAPI/DPC++, AdaptiveCpp); OpenCL 3.0 reality; WebGPU/WGSL browser status +
wgpu-native/Dawn; Kokkos/RAJA current; Triton-on-ROCm status; MLIR GPU dialects.
**Lab:** WGSL runs in ANY browser (the one universally free GPU lab — use it
hard); HIP/SYCL exercises target learner hardware or CPU backends (SYCL and
Kokkos CPU backends make most exercises runnable ANYWHERE — including your
sandbox: oneAPI/AdaptiveCpp or Kokkos-CPU can be pip/apt-installable; verify
and use for real execution).

**Through-line:** the core taught CUDA-the-concepts; this track proves the
concepts were never NVIDIA's — same warps/tiles/coalescing/streams under new
names everywhere — and teaches the real cost model of portability (the last
20% of performance is where the portability tax lives).

- **D1 — The portability problem & the 2026 landscape.** Why portability:
  supply, price, browsers, national labs (El Capitan is AMD; Aurora is Intel —
  verify current); the translation table (warp/wavefront/subgroup, SM/CU/EU,
  shared/LDS/SLM — this table is the track's spine, as a diagram AND prose);
  the honest taxonomy: single-source C++ (SYCL/Kokkos) vs dialect (HIP) vs
  IR-level (Triton/MLIR) vs API-level (WebGPU/OpenCL); the 90/10 rule of
  portable performance.
- **D2 — ROCm 7.x & HIP.** hipify on the 5.11 matmul (do it — the diff is
  ~renames: THAT's the lesson), wavefront 64 vs warp 32 (every 5.6/5.8
  hardcoded-32 assumption audited — shuffle widths, reduction trees; the bug
  taxonomy of blind ports), LDS = 5.5, rocprof vs ncu, MI-series memory
  (HBM widths that embarrass PCIe-class cards — 4.7 rooflines redrawn).
- **D3 — SYCL / oneAPI.** Single-source queues/buffers/accessors vs USM
  (accessors = 5.3's ownership made TYPES — the dependency graph the runtime
  builds from them = 5.9's DAG inferred instead of declared); nd_range =
  grid/block; local memory = 5.5; run on CPU backend IN THE SANDBOX (execute
  real code!), reductions built-in (5.8 productized).
- **D4 — OpenCL today.** The survivor's honest niche (embedded, FPGA-ish,
  legacy); kernel-as-string compilation (3.1's pipeline at RUNTIME), the
  boilerplate anatomy once, cl_mem vs SVM; why it lost to CUDA (ecosystem,
  not ergonomics — an engineering-history lesson worth having) and where it
  still wins (breadth).
- **D5 — WebGPU & WGSL.** The browser as the universal GPU lab: adapter/device/
  queue (5.9 shapes), buffers/bind groups (C4's descriptor discipline
  simplified), WGSL compute (workgroup = block, workgroupBarrier = 5.5),
  the 5.8 reduction IN THE BROWSER (provide the complete runnable HTML file —
  this course's site can HOST it as a live lab page: build
  `track-d/lab-webgpu.html` as a working in-browser playground), limits
  (no warp-shuffle equivalents in baseline — subgroups extension status:
  verify), timestamp queries for 5.10-style measurement.
- **D6 — Kokkos / RAJA.** Performance-portability layers: views (M2 L5 strides
  with COMPILE-TIME layout switching — LayoutLeft/Right chosen per backend =
  the AoS/SoA decision AUTOMATED), parallel_for/reduce/scan, execution+memory
  spaces (5.3's worlds as template parameters), team policies = 5.5/5.6
  hierarchy; run CPU backend for real; why labs bet on it (one codebase,
  every machine — B7's world).
- **D7 — Triton & MLIR: the compiler-level answer.** Triton as portable-BY-IR
  (A4's language, now the portability story: same Python → PTX or AMDGCN),
  MLIR dialect lowering (gpu → nvvm/rocdl) shown on ONE real example, why
  compilers are eating this problem (autotuning per-backend beats hand-porting
  — 5.6's dial turned by machines), limits (tensor-core-class perf still needs
  vendor paths — honest).
- **D8 — Honest cross-vendor benchmarking.** The methodology lesson: same-SKU
  fallacies, normalize by COST and WATTS not just wall time (4.6's economics
  completing), rooflines per machine FIRST (4.7 — "% of own ceiling" is the
  only fair cross-vendor number), warmup/clock parity (M1 L7 at fleet scale),
  the benchmark-README standard (5.11 P7 stranger test, multi-vendor edition);
  a worked fake-benchmark autopsy (spot the five sins).
- **D9 — CAPSTONE: one algorithm, four backends, one report.** The 5.8
  reduction (or histogram) in: CUDA (done — core), HIP (D2), SYCL or Kokkos
  (D3/D6, CPU backend acceptable), WGSL (D5, runs in browser). One shared
  fixture set (M2 L6), per-backend machine files (5.1), the portability
  report: LOC delta table, concept-translation table filled with REAL code
  lines, %-of-own-roofline per device (D8), "what the last 10% costs" per
  backend, defense bank ("when do you hand-port vs Kokkos vs Triton?" is
  question #7).

Pack `diagramsD.js` (~26): the grand translation table, backend stacks,
SYCL dependency graphs, WGSL pipeline, Kokkos spaces, MLIR lowering flow,
cost-normalized benchmark charts, four-backend capstone map.

---

# PART 10 — FINISH WORK (after all four tracks)

1. curriculum.html: all four track cards show full lesson lists + BUILT badges;
   footer → "ALL 84 LESSONS BUILT".
2. index.html: track cards with start links; hero copy updated (core + tracks).
3. README.md: final counts, full tree, per-track one-liners.
4. prompt.html: add a completion note ("course fully built; prompt retained
   for regeneration/extension").
5. Full-site QA: run the PART 5a script against EVERY folder (core included —
   regression check); click-path check index → curriculum → each track's first
   lesson (grep the hrefs); `TRACKS-PROGRESS.md` final entry: totals, dates,
   known representative-number disclaimers.
6. Ship note to Pavan listing: what to open first per track, which exercises
   need his own hardware (C track GPU, D track browsers), and the three
   capstone repos he should actually build and put on GitHub (5.11, A11, D9 —
   they are the portfolio).

---

# PART 11 — SESSION RUNNER PROMPTS (paste one per session)

**Session template — facts + diagrams (per track):**
```
Read HANDOFF-OPUS.md fully, then TRACKS-PROGRESS.md, then module-5/lesson-07.html
and the first 100 lines of assets/diagrams5.js (style references).
Execute PART 3 STEP 1 for Track {{X}}: verify every fact listed in PART {{6/7/8/9}}
via web search; record findings with dates in TRACKS-PROGRESS.md.
Then build assets/diagrams{{X}}.js: every diagram named in the track section plus
any the lesson maps imply, following PART 4 exactly — write the checker, run it
to ALL CLEAN, render contact sheets, view them, fix, re-verify.
Do not write any lessons this session. End by updating TRACKS-PROGRESS.md.
```

**Session template — lesson batch:**
```
Read HANDOFF-OPUS.md fully, then TRACKS-PROGRESS.md, then track {{X}}'s newest
existing lesson (or module-5/lesson-07.html if none) as the style anchor.
Write Track {{X}} lessons {{N–M}} per the PART {{6/7/8/9}} lesson maps, to the
FULL PART 2 gold standard — no placeholders, no thin drafts. Every lesson:
verify its executable claims in the sandbox AS YOU WRITE (PART 5b); reference
only diagram keys that exist in assets/diagrams{{X}}.js; obey the PART 1
contract and escaping law. Run the PART 5a checker on the new files before
finishing. Update TRACKS-PROGRESS.md.
```

**Session template — track close:**
```
Read HANDOFF-OPUS.md, TRACKS-PROGRESS.md. Write Track {{X}}'s remaining lessons
(including the capstone, mirroring 5.11's project structure). Then integrate
(PART 3 STEP 4): curriculum.html, index.html, README.md. Then run the FULL
PART 5 QA: structure script on the whole track, execute-the-claims sweep,
consistency greps (canonical numbers, raw <<<, TODO). Fix everything found —
QA that finds nothing on the first pass usually means the QA is broken, so
show the actual tool output. Update TRACKS-PROGRESS.md with a track postmortem:
bugs QA caught, decisions made, anything the next track should inherit.
```

Recommended order: **A → B → D → C** (A has the biggest job market and the
most sandbox-executable content; C is last because its exercises depend most
on the learner's own hardware — but any order works; the tracks only depend
on the core).

---

# APPENDIX — POSTMORTEM OF THE CORE (what QA actually caught, so you respect it)

1. Module 2: a "view detector" taught `.base` — execution proved it unreliable;
   the lesson was rebuilt around `np.shares_memory`. *Lesson: teach the tool
   that survives adversarial cases, found only by running them.*
2. Module 3: a quiz claimed loop-reordered float matmul differs bitwise from
   naive. Measurement: BITWISE IDENTICAL (reordering LOADS ≠ reordering ADDS).
   The quiz was rewritten around the true distinction — and that truth became
   a cornerstone of 5.11's verification policy. *Best content comes from being
   wrong in private.*
3. Module 4: gcc -O2 if-converted a branch demo into cmov — it measured
   nothing; rebuilt with a guarded load (7.6× effect, real). *Compilers eat
   naive benchmarks; every demo must be checked against the assembly or its
   effect size.*
4. Module 4: an energy estimate was off 1000× (10^15 vs 10^18 FLOPs). *Big
   numbers need dimensional re-derivation, not review-by-vibes.*
5. Module 5: the sanitizer example blamed thread (31,0,0) — arithmetic showed
   that thread was IN bounds; corrected to (64,0,0) = element 1,000,000
   exactly. *Even examples must survive their own index math.*
6. Module 5: "16 FLOPs per load" for register tiling — recomputation gave
   16 FMAs per 8 loads. *Ratios get re-derived, never quoted from memory.*
7. Module 5: an out-of-core compute time was 2.4× off; the corrected ratio
   (11×, not 50×) changed the design's story. *When a number justifies a
   design, the number gets executed first.*
8. Sitewide: the raw `<<<` HTML-swallowing bug (PART 1). *Mechanical laws
   beat vigilance.*

The pattern: **every one of these read perfectly and was wrong.** That is why
PART 5 is the longest part of this handoff, and why the sessions that feel
"slow" (facts, diagrams-first, execution) are the ones that made the core
worth handing to a learner. Build the tracks the same way.

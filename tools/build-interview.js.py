# Builds assets/gm-interview-data.js (window.GM_INTERVIEW). Run: python3 tools/build-interview.js.py
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

Q = [
# topic, level, question, answer, lesson-url
("Architecture","easy","How many threads are in a warp on NVIDIA GPUs, and why does the warp matter?",
 "Thirty-two. The warp is the unit of scheduling and execution — all 32 threads issue the same instruction together (SIMT). Divergence, coalescing, and occupancy are all reasoned about per-warp, so the number 32 shows up everywhere in GPU performance.","module-4/lesson-04.html"),
("Architecture","medium","What is SIMT and how does it differ from SIMD?",
 "SIMT = Single Instruction, Multiple Threads. Like SIMD, one instruction drives many lanes, but each thread keeps its own registers and can diverge on branches (at a cost) and is addressed individually. SIMD exposes fixed-width vectors to the programmer; SIMT presents independent threads that the hardware groups into warps.","module-4/lesson-04.html"),
("Architecture","medium","How do GPUs hide memory latency without large CPU-style caches?",
 "Massive multithreading. Each SM keeps many warps resident; when one warp stalls on a memory access the scheduler issues from another ready warp. With enough warps in flight, hundreds of cycles of global-memory latency are overlapped with useful work — the machine optimizes throughput, not single-thread latency.","module-4/lesson-04.html"),
("Architecture","easy","What is a streaming multiprocessor (SM)?",
 "The GPU's core building block. An SM contains ALUs/CUDA cores, warp schedulers, a large register file, shared memory/L1, and on recent GPUs tensor cores. A GPU is many SMs; a thread block is assigned whole to one SM and shares its resources.","module-4/lesson-04.html"),
("Architecture","easy","Why are GPUs throughput machines while CPUs are latency machines?",
 "CPUs spend transistors on caches, branch prediction, and out-of-order logic to make one thread fast (low latency). GPUs spend transistors on many simple ALUs and thousands of threads to maximize total work per second (high throughput), tolerating per-thread latency by switching warps.","module-4/lesson-01.html"),
("Architecture","hard","What limits how many blocks or warps can be resident on an SM at once?",
 "The tightest resource wins: registers per thread times threads, shared memory per block, threads-per-block against the SM's max threads, and a hard max-blocks-per-SM. Whichever runs out first caps occupancy — which is why cutting register or shared-memory use can let more warps run.","module-5/lesson-06.html"),

("Memory","easy","What is memory coalescing?",
 "When the 32 threads of a warp touch global-memory addresses inside the same aligned segment (128-byte line / 32-byte sectors), the hardware services them in the fewest possible transactions. Scattered or misaligned accesses pull in extra sectors you never use and waste bandwidth.","module-5/lesson-07.html"),
("Memory","medium","What are shared-memory bank conflicts and how do you avoid them?",
 "Shared memory is split into 32 banks. If threads in a warp hit different words in the same bank the accesses serialize (an N-way conflict costs N cycles). Distinct banks, or all threads reading one address (broadcast), are conflict-free. The classic fix is padding an array by one column so the stride stops aliasing a bank.","module-5/lesson-05.html"),
("Memory","easy","Sketch the GPU memory hierarchy from fastest to slowest.",
 "Registers (per-thread) -> shared memory / L1 (per-SM, tens of KB) -> L2 (device-wide) -> global memory / HBM (many GB). Capacity grows and effective bandwidth-per-byte falls as you move down; good code keeps hot data as high up as possible.","module-4/lesson-02.html"),
("Memory","hard","What is the roofline model and how do you use it?",
 "It plots attainable FLOP/s against arithmetic intensity (FLOPs per byte of DRAM traffic). The roof is min(peak compute, intensity x peak bandwidth). Kernels left of the ridge point are memory-bound (optimize data movement and reuse); right of it are compute-bound (optimize the math or use tensor cores).","module-4/lesson-07.html"),
("Memory","medium","Contrast global, shared, local, and constant memory.",
 "Global = device DRAM, visible to all threads, high latency. Shared = on-chip, per-block, low latency, programmer-managed. Local = per-thread private data that actually spills to global memory. Constant = small read-only cached space, fast when every thread reads the same address.","module-5/lesson-03.html"),
("Memory","medium","Why is pinned (page-locked) host memory faster for transfers?",
 "The GPU's DMA engine can copy directly from pinned host pages instead of staging through a pageable bounce buffer, giving higher PCIe bandwidth and enabling true asynchronous copies that overlap with compute. The trade-off is that pinned memory is a scarce OS resource.","module-4/lesson-06.html"),
("Memory","medium","What is arithmetic intensity and how do you raise it?",
 "FLOPs performed per byte of memory moved. You raise it with reuse: tiling/blocking so loaded data is used many times (shared-memory matmul tiles), fusing ops to avoid intermediate round-trips to DRAM, and picking algorithms that do more compute per byte. Higher intensity moves you toward the compute roof.","module-4/lesson-07.html"),

("CUDA","easy","What does the launch configuration <<<grid, block>>> specify?",
 "The grid dimensions (number of thread blocks) and block dimensions (threads per block). Their product is the total thread count; each thread derives a global index from blockIdx, blockDim, and threadIdx to find the data it owns.","module-5/lesson-02.html"),
("CUDA","easy","What does __syncthreads() do, and what is the classic bug?",
 "It is a block-wide barrier: every thread in the block must arrive before any moves on — used after writing shared memory before others read it. The classic bug is calling it inside divergent control flow so only some threads reach it, which deadlocks the block.","module-5/lesson-05.html"),
("CUDA","medium","How do you correctly compute a parallel sum (reduction)?",
 "Tree reduction in shared memory: each thread loads and adds a few elements, then you repeatedly add-and-halve the active stride with __syncthreads() between steps, and combine per-block partials with a second kernel or an atomic. Watch divergence and bank conflicts; modern code finishes the last 32 lanes with warp shuffles.","module-5/lesson-08.html"),
("CUDA","medium","What are CUDA streams and why use them?",
 "A stream is an ordered queue of GPU operations; work in different streams may overlap. Multiple streams let you overlap host-device copies with kernel execution and run independent kernels concurrently, hiding transfer time behind compute.","module-5/lesson-09.html"),
("CUDA","hard","What is a race condition in a kernel, and how do atomics help (and hurt)?",
 "When many threads read-modify-write the same location without ordering, updates are lost. Atomics (atomicAdd, etc.) make the read-modify-write indivisible, fixing correctness but serializing contended addresses. So you minimize contention — accumulate per-block partials, then combine — rather than hammering one global counter.","module-5/lesson-08.html"),
("CUDA","easy","What is unified (managed) memory?",
 "A single pointer valid on both host and device, with the driver migrating pages on demand. It simplifies code, but page-fault migration can be slow, so prefetching and access hints matter when you care about performance.","module-5/lesson-03.html"),
("CUDA","medium","What is the difference between PTX and SASS?",
 "PTX is NVIDIA's virtual, forward-compatible assembly ISA emitted by the compiler; SASS is the actual per-architecture machine code that ptxas generates from PTX and that really runs on the SMs. PTX can be JIT-compiled by the driver for newer GPUs; SASS is what a profiler shows you.","module-5/lesson-01.html"),
("CUDA","hard","A kernel gives wrong results only for large inputs. Likely causes?",
 "The grid is too small to cover the data (missing grid-stride loop), an index overflows a 32-bit int, threads read out of bounds past the last block, or a shared-memory/atomic race that only shows under contention. Run compute-sanitizer to localize it fast.","module-5/lesson-04.html"),

("Performance","medium","What is occupancy, and is higher always better?",
 "Occupancy is active warps per SM divided by the maximum. It exists to hide latency, so you usually want 'enough,' not 'maximum.' Pushing it higher shrinks registers and shared memory per thread, which can hurt; many kernels peak at moderate occupancy by exploiting instruction-level parallelism instead.","module-5/lesson-06.html"),
("Performance","medium","What is warp divergence and what does it cost?",
 "When threads in a warp take different sides of a data-dependent branch, the warp runs each path in turn with the non-participating lanes masked off, so the paths execute serially. You reduce it by aligning branches to warp boundaries or removing data-dependent branching from hot loops.","module-5/lesson-06.html"),
("Performance","medium","How do you decide if a kernel is compute-bound or memory-bound?",
 "Compute its arithmetic intensity and place it on the roofline, or read the profiler: if DRAM throughput is near peak while the math pipes sit idle it is memory-bound; if the compute (or tensor-core) pipes saturate first it is compute-bound. Then optimize whichever resource is the binding constraint.","module-4/lesson-07.html"),
("Performance","hard","A memory-bound kernel still gets low achieved bandwidth. What do you check first?",
 "Access pattern (coalescing and alignment), whether enough warps are in flight to saturate memory (memory-level parallelism/occupancy), sector efficiency (are you fetching bytes you never use), and whether you are actually PCIe-bound rather than DRAM-bound. Fix the access pattern before anything clever.","module-5/lesson-07.html"),
("Performance","medium","What does the Nsight profiler tell you that guesswork can't?",
 "Measured throughput of each pipe, achieved occupancy, memory sector efficiency, stall reasons, and where the time actually goes. It turns optimization from guessing into reading the binding constraint and attacking it — the difference between a 2x and a 20x speedup.","module-5/lesson-10.html"),

("Foundations","medium","Why is floating-point addition non-associative, and why does that matter on GPUs?",
 "With a finite mantissa, rounding after each add means (a+b)+c can differ from a+(b+c). A parallel reduction sums in an order that depends on thread and block counts, so GPU results vary run-to-run and against the CPU. You manage it with stable algorithms (Kahan), higher-precision accumulation, or an accepted tolerance.","module-1/lesson-08.html"),
("Foundations","easy","What is signed-integer overflow in C/CUDA?",
 "Undefined behavior. Unlike unsigned types, which wrap modulo 2^n, signed overflow lets the compiler assume it can never happen and optimize on that assumption — which can silently delete bounds checks. Use unsigned or wider types for indices that might grow large.","module-3/lesson-02.html"),
("Foundations","medium","FP32 vs FP16 vs BF16 — and why does BF16 exist?",
 "FP32 has an 8-bit exponent and 23-bit mantissa. FP16 has a 5-bit exponent and 10-bit mantissa — little dynamic range, prone to overflow/underflow. BF16 keeps FP32's 8-bit exponent with only 7 mantissa bits: the same range as FP32 with less precision, which trains robustly without the loss scaling FP16 needs.","module-1/lesson-08.html"),
("Foundations","easy","Why learn C pointers before CUDA?",
 "CUDA is C/C++ with a memory model: cudaMalloc hands you device pointers, kernels do pointer arithmetic to index arrays, and most bugs are out-of-bounds or wrong-address errors. Without a solid pointer mental model, GPU memory management and coalescing never click.","module-3/lesson-03.html"),

("ML Systems","medium","Why are matrix multiplications (GEMMs) the center of deep-learning performance?",
 "Linear layers, attention projections, and convolutions (via im2col or implicit GEMM) all reduce to GEMMs, which have high arithmetic intensity and map perfectly onto tensor cores. So most FLOPs — and most of the tuning effort — concentrate there.","track-a/lesson-05.html"),
("ML Systems","hard","What is the key idea behind FlashAttention?",
 "Standard attention writes the full N x N scores matrix to HBM, making it memory-bound. FlashAttention tiles the computation and uses an online (streaming) softmax so it never materializes that matrix — it carries running max/sum statistics in on-chip SRAM and fuses the whole attention into one kernel, slashing HBM traffic.","track-a/lesson-05.html"),
("ML Systems","medium","How does mixed-precision training work without diverging?",
 "Do the matmuls in FP16/BF16 on tensor cores for speed, but keep an FP32 master copy of the weights and accumulate in FP32. For FP16, loss scaling shifts tiny gradients into representable range. You get most of the speed and memory savings with near-FP32 stability.","track-a/lesson-06.html"),
("ML Systems","medium","What is a fused kernel and why fuse?",
 "Fusing combines several elementwise/reduction steps (say bias + activation + dropout) into one kernel so intermediates stay in registers or shared memory instead of round-tripping through global memory. It removes memory traffic and launch overhead — the main win for memory-bound ops.","track-a/lesson-05.html"),
("ML Systems","hard","Contrast DDP and FSDP for multi-GPU training.",
 "DDP replicates the whole model on each GPU and all-reduces gradients — simple, communicates only gradients, but each GPU must hold the full model. FSDP shards parameters, gradients, and optimizer state across GPUs and gathers them just in time, trading extra communication for the ability to train models too large to replicate.","track-a/lesson-07.html"),
("ML Systems","medium","In LLM inference, what is the KV cache and why does it dominate memory?",
 "Autoregressive decoding would recompute attention over all prior tokens; the KV cache stores past keys and values so each new token costs O(1) instead of O(n). Its size scales with batch x sequence length x layers x hidden, so it — not the weights — usually limits how many requests you can batch.","track-a/lesson-08.html"),
("ML Systems","medium","What does torch.compile actually do?",
 "It traces the model into a graph, then TorchInductor generates fused Triton/C++ kernels, cutting Python overhead and memory traffic through operator fusion. You often get a solid speedup with no model changes, paying a compile step and the occasional graph break.","track-a/lesson-09.html"),
("ML Systems","easy","What problem does Triton solve?",
 "It lets you write GPU kernels in Python at the block level: you manage tiles and memory movement, and Triton handles intra-block scheduling, coalescing, and register allocation. You get much of CUDA's performance with far less boilerplate — ideal for custom fused ML ops.","track-a/lesson-04.html"),

("HPC","easy","When should you call cuBLAS instead of writing your own GEMM?",
 "Almost always. cuBLAS is hand-tuned per architecture and uses tensor cores, so you will rarely beat it. Write your own only to learn the mechanics, or to fuse the GEMM with surrounding ops in a way a black-box library can't.","track-b/lesson-02.html"),
("HPC","medium","What governs the performance of a stencil / grid computation?",
 "It is usually memory-bound with neighbor reuse, so the game is reuse: load halo regions into shared memory, tile to fit on-chip storage, and keep loads coalesced. Arithmetic intensity is low, so bandwidth and reuse — not raw FLOPs — decide the speed.","track-b/lesson-03.html"),
("HPC","medium","Why do GPUs suit Monte Carlo, and what is the catch?",
 "The sample paths are embarrassingly parallel. The catch is random-number generation: you need a parallel-safe generator (cuRAND) giving each thread an independent, non-overlapping stream. Get that wrong and your 'independent' samples are correlated and the estimate is silently biased.","track-b/lesson-04.html"),
("HPC","hard","Why can the same GPU code give different results across runs, and how do you get reproducibility?",
 "Atomics and parallel reductions sum in nondeterministic order, floating point is non-associative, and libraries may pick different algorithms or tensor-core paths. For reproducibility, use deterministic reduction orders/algorithms, fixed seeds, controlled precision, and pinned library and algorithm versions.","track-b/lesson-08.html"),
("HPC","medium","What are NCCL and GPUDirect, and why do they matter at scale?",
 "NCCL provides topology-aware collective operations (all-reduce and friends) that pick the fastest paths — NVLink between GPUs and GPUDirect RDMA to move data GPU-to-GPU or GPU-to-NIC without staging through host memory. Together they keep communication from becoming the scaling bottleneck.","track-b/lesson-05.html"),

("Graphics","easy","Rasterization versus ray tracing, one line each?",
 "Rasterization projects triangles onto the screen and fills the pixels they cover — fast, the real-time default. Ray tracing shoots rays from the camera into the scene and finds what they hit — more physically accurate for shadows and reflections, but far costlier.","track-c/lesson-09.html"),
("Graphics","medium","What are homogeneous coordinates and the perspective divide?",
 "Adding a fourth coordinate w lets translation and perspective be written as 4x4 matrix multiplies. After the projection matrix, dividing x, y, z by w — the perspective divide — produces the foreshortening that makes distant objects appear smaller.","track-c/lesson-01.html"),
("Graphics","medium","What do the vertex, fragment, and compute shader stages do?",
 "The vertex shader transforms each vertex into clip space; the rasterizer turns triangles into fragments; the fragment (pixel) shader computes each fragment's color; the compute shader is a general-purpose GPU program outside the raster pipeline for arbitrary data-parallel work.","track-c/lesson-04.html"),
("Graphics","hard","In physically based rendering, what is a BRDF and what does the GGX term model?",
 "A BRDF gives the fraction of light arriving from one direction that reflects toward the viewer. In the Cook-Torrance model, GGX (Trowbridge-Reitz) is the normal-distribution function describing how microfacet normals spread around the surface normal — its long tails give realistic specular highlights with soft falloff.","track-c/lesson-06.html"),

("Portability","easy","What is HIP and how does it relate to CUDA?",
 "HIP is AMD's CUDA-like C++ API; the same source can compile for AMD (ROCm) or NVIDIA. The hipify tool mechanically translates most CUDA code (cudaMalloc becomes hipMalloc, and so on), so porting is often light — the hard parts are performance tuning and warp-size assumptions.","track-d/lesson-02.html"),
("Portability","medium","NVIDIA's warp is 32 threads. What is AMD's equivalent, and why is its size a portability trap?",
 "AMD calls it a wavefront. On GCN/CDNA it is 64 lanes; on RDNA it is 32 (with a 64-wide mode). Code that hard-codes 32 — warp-shuffle reductions, lane masks — can silently break or misbehave on 64-wide hardware, a classic cross-vendor bug.","track-d/lesson-02.html"),
("Portability","medium","What are SYCL and oneAPI?",
 "SYCL is a Khronos standard for single-source heterogeneous C++; Intel's oneAPI (DPC++) is one implementation. It targets CPUs, GPUs, and FPGAs across vendors from one codebase, competing with the CUDA/HIP model at a higher, standards-based abstraction level.","track-d/lesson-03.html"),
("Portability","medium","What are WebGPU and WGSL, and why do they matter?",
 "WebGPU is a modern GPU API for the browser (and native via Dawn/wgpu); WGSL is its shading language. It brings compute shaders and modern GPU access to the web, portably over Vulkan/Metal/D3D12 backends — GPU compute with zero install, which lowers the barrier to entry dramatically.","track-d/lesson-05.html"),
("Portability","hard","What is MLIR and why is it relevant to GPU portability?",
 "MLIR is a compiler infrastructure of reusable dialects and intermediate representations; a framework lowers high-level ops through progressively lower dialects down to many hardware backends. It underpins tools like Triton and vendor compilers, letting one front-end target diverse hardware without hand-writing each backend.","track-d/lesson-07.html"),
]

cards = [{"id": "iv-%d" % (i+1), "topic": t, "level": lv, "q": q, "a": a, "url": u}
         for i, (t, lv, q, a, u) in enumerate(Q)]

banner = "/* AUTO-GENERATED by tools/build-interview.js.py — do not edit by hand. */\n"
out = os.path.join(ROOT, "assets", "gm-interview-data.js")
with open(out, "w", encoding="utf-8") as f:
    f.write(banner + "window.GM_INTERVIEW = " + json.dumps(cards, ensure_ascii=False) + ";\n")

from collections import Counter
bt = Counter(c["topic"] for c in cards); bl = Counter(c["level"] for c in cards)
print("wrote", len(cards), "questions")
print("by topic:", dict(bt))
print("by level:", dict(bl))
# verify all lesson links exist
missing = [c["url"] for c in cards if not os.path.exists(os.path.join(ROOT, c["url"]))]
print("missing links:", missing if missing else "none")

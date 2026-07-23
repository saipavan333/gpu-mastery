/* GPU Mastery — Module 3 diagram pack. Registers SVGs on window.DIAGRAMS. */
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
  const triL=(x,y,o={})=>`<polygon points="${x+7},${y-4} ${x},${y} ${x+7},${y+4}" style="fill:${o.stroke||C.line}"/>`;
  const triD=(x,y,o={})=>`<polygon points="${x-4},${y-7} ${x},${y} ${x+4},${y-7}" style="fill:${o.stroke||C.line}"/>`;
  const triU=(x,y,o={})=>`<polygon points="${x-4},${y+7} ${x},${y} ${x+4},${y+7}" style="fill:${o.stroke||C.line}"/>`;
  const arrowR=(x1,y,x2,o={})=>ln(x1,y,x2,y,o)+tri(x2,y,o);
  const svg=(h,body,label)=>`<svg viewBox="0 0 640 ${h}" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="640" height="${h}" rx="10" style="fill:${C.card}"/>${body}</svg>`;
  const D = {};

  /* 3.1a — the compile pipeline */
  D["m3l1-pipeline"] = (() => {
    let b = t(320,22,"From text to executable: four machines in a trench coat",{bold:true,size:13});
    const st=[["hello.c","your text"],["hello.i","headers pasted in"],["hello.s","assembly"],["hello.o","machine code"],["hello","executable"]];
    const lbl=["preprocess","compile","assemble","link"];
    const flag=["-E stops","-S stops","-c stops",""];
    for (let i=0;i<5;i++){
      const x=24+i*124;
      b += box(x,56,104,52,i===4?{fill:C.good,stroke:C.goodS}:{fill:C.acc,stroke:C.accS});
      b += t(x+52,78,st[i][0],{size:11,bold:true,fill:i===4?C.goodT:C.accT});
      b += t(x+52,96,st[i][1],{size:9.5,fill:C.dim});
      if(i<4){ b += arrowR(x+104,82,x+124); b += t(x+114,48,lbl[i],{size:9.5,fill:C.dim}); if(flag[i]) b += t(x+114,124,flag[i],{size:9,fill:C.warn}); }
    }
    b += box(320,150,296,40,{fill:C.card,stroke:C.boxS});
    b += t(468,168,"libraries join at LINK time:",{size:10,fill:C.dim});
    b += t(468,183,"libc (printf), libm (-lm: sqrt, sinf)",{size:10,fill:C.accT});
    b += ln(468,150,510,116,{dash:true,sw:1.2});
    b += t(160,172,"gcc hello.c -o hello runs ALL four.",{size:10.5,fill:C.dim});
    b += t(160,190,"gcc -Wall -Wextra -O2 -g : the habit.",{size:10.5,fill:C.goodT});
    b += t(320,224,"Python interpreted this dance away (M2 L1). C makes you watch — because CUDA's nvcc is this pipeline, twice.",{size:10.5,fill:C.dim});
    return svg(238,b,"c compilation pipeline preprocess compile assemble link");
  })();

  /* 3.1b — static vs runtime errors */
  D["m3l1-static"] = (() => {
    let b = t(320,22,"When do you find out you were wrong?",{bold:true,size:13});
    b += t(40,54,"Python (M2): types checked at RUNTIME",{a:"start",size:10.5,fill:C.accT});
    b += box(40,64,110,36) + t(95,86,"write",{size:10.5});
    b += arrowR(150,82,180);
    b += box(180,64,110,36) + t(235,86,"ship / run",{size:10.5});
    b += arrowR(290,82,320);
    b += box(320,64,240,36,{fill:C.bad,stroke:C.badS}) + t(440,86,"TypeError — at 3am, in prod",{size:10.5,fill:C.badS});
    b += t(40,138,"C: types checked at COMPILE time",{a:"start",size:10.5,fill:C.goodT});
    b += box(40,148,110,36) + t(95,170,"write",{size:10.5});
    b += arrowR(150,166,180);
    b += box(180,148,190,36,{fill:C.warnFill,stroke:C.warn}) + t(275,170,"compile: error HERE",{size:10.5,fill:C.warn});
    b += arrowR(370,166,400);
    b += box(400,148,160,36,{fill:C.good,stroke:C.goodS}) + t(480,170,"run clean",{size:10.5,fill:C.goodT});
    b += t(320,214,"The compiler is a free, instant test suite for a whole class of bugs. Feed it -Wall -Wextra and READ what it says.",{size:10.5,fill:C.dim});
    b += t(320,232,"The trade: C makes you declare intent up front — and rewards you at scale. (Runtime bugs still exist: 3.3–3.8.)",{size:10.5,fill:C.dim});
    return svg(246,b,"python runtime errors versus c compile time errors");
  })();

  /* 3.1c — linker and symbols */
  D["m3l1-symbols"] = (() => {
    let b = t(320,22,"Linking: matching every 'needs' with a 'provides'",{bold:true,size:13});
    b += box(30,52,180,72,{fill:C.acc,stroke:C.accS});
    b += t(120,74,"main.o",{size:11,bold:true,fill:C.accT});
    b += t(120,94,"needs: saxpy, printf",{size:10,fill:C.warn});
    b += t(120,110,"provides: main",{size:10,fill:C.goodT});
    b += box(30,140,180,60,{fill:C.acc,stroke:C.accS});
    b += t(120,162,"saxpy.o",{size:11,bold:true,fill:C.accT});
    b += t(120,182,"provides: saxpy",{size:10,fill:C.goodT});
    b += box(30,216,180,44) + t(120,236,"libc.so",{size:10.5,bold:true}) + t(120,251,"provides: printf, malloc…",{size:9.5,fill:C.dim});
    b += arrowR(210,88,260) + arrowR(210,170,260) + arrowR(210,238,260);
    b += box(260,120,130,64,{fill:C.warnFill,stroke:C.warn}) + t(325,148,"linker (ld)",{size:11,bold:true,fill:C.warn}) + t(325,166,"match + stitch",{size:9.5,fill:C.dim});
    b += arrowR(390,152,440);
    b += box(440,124,170,56,{fill:C.good,stroke:C.goodS}) + t(525,148,"./program",{size:11,bold:true,fill:C.goodT}) + t(525,166,"every need met",{size:9.5,fill:C.dim});
    b += t(320,292,"“undefined reference” = nobody PROVIDED the symbol (forgot saxpy.o or -lm) — matchmaking, not syntax.",{size:10.5,fill:C.dim});
    b += t(320,310,"nm file.o lists needs (U) and provides (T). Compile errors are per-file; linker errors are at the party.",{size:10.5,fill:C.dim});
    return svg(324,b,"object files providing and needing symbols joined by the linker");
  })();

  /* 3.2a — type sizes */
  D["m3l2-sizes"] = (() => {
    let b = t(320,22,"Fixed widths are back (use <stdint.h> and mean what you say)",{bold:true,size:13});
    const rows=[["int8_t / uint8_t",1,"−128…127 / 0…255"],
                ["int16_t",2,"±32 767"],
                ["int32_t (int)",4,"±2.1e9 — indices overflow HERE (M1 L1)"],
                ["int64_t / size_t",8,"±9.2e18 / big sizes & all byte offsets"],
                ["float / double",4,"fp32 / fp64 — M1 L8's exact formats"],
                ["any pointer",8,"an address (48 bits used, M1 L1)"]];
    for (let i=0;i<6;i++){
      const y=48+i*40;
      b += t(200,y+20,rows[i][0],{a:"end",size:10.5,fill:C.accT});
      const nb=rows[i][1]===4&&i===4?4:rows[i][1];
      for (let j=0;j<8;j++){
        const on=j<nb;
        b += box(210+j*24,y+4,20,24,{r:3,fill:on?C.acc:C.card,stroke:on?C.accS:C.boxS,sw:on?1.6:0.8});
      }
      b += t(412,y+20,rows[i][2],{a:"start",size:9.5,fill:C.dim});
    }
    b += t(320,306,"sizeof(x) answers in bytes, at compile time. char/short/int/long vary by platform — stdint names don't. double = 8 bytes.",{size:10,fill:C.dim});
    return svg(320,b,"c integer and float types with their byte widths");
  })();

  /* 3.2b — integer promotion */
  D["m3l2-promotion"] = (() => {
    let b = t(320,22,"Small types secretly compute in int",{bold:true,size:13});
    b += box(30,54,120,44) + t(90,74,"uint8_t a=200",{size:10.5,fill:C.accT}) + t(90,90,"uint8_t b=100",{size:10.5,fill:C.accT});
    b += arrowR(150,76,190);
    b += box(190,54,150,44,{fill:C.warnFill,stroke:C.warn}) + t(265,74,"PROMOTE to int",{size:10.5,fill:C.warn}) + t(265,90,"a+b = 300 (no wrap!)",{size:10,fill:C.warn});
    b += arrowR(340,76,380);
    b += box(380,54,230,44,{fill:C.bad,stroke:C.badS}) + t(495,74,"store into uint8_t c",{size:10.5,fill:C.badS}) + t(495,90,"c = 300 mod 256 = 44",{size:10,fill:C.badS});
    b += t(320,132,"The wrap happens at the STORE, not in the arithmetic — anything smaller than int computes as int first.",{size:10.5,fill:C.dim});
    b += t(320,152,"Corollaries: (uint8_t)(a+b) picks truncation; a-b can't go negative in the MATH, only at the store.",{size:10,fill:C.dim});
    b += t(320,170,"NumPy (M2 L5) wraps in-dtype instead — same inputs, different rules. Know whose rules you're under.",{size:10,fill:C.dim});
    return svg(184,b,"uint8 values promoted to int before arithmetic then truncated at store");
  })();

  /* 3.2c — UB lets the optimizer delete your check */
  D["m3l2-ub"] = (() => {
    let b = t(320,22,"Undefined behavior: the compiler may assume it never happens",{bold:true,size:13});
    b += t(160,52,"you wrote (-O0 keeps it)",{size:10.5,fill:C.accT});
    b += box(30,62,270,58,{fill:C.card,stroke:C.boxS});
    b += t(46,84,"if (x + 1 < x)      // int x",{a:"start",size:10.5,fill:C.goodT});
    b += t(46,104,"    handle_overflow();",{a:"start",size:10.5,fill:C.goodT});
    b += arrowR(304,90,336,{stroke:C.badS,sw:2});
    b += t(478,52,"-O2 emits",{size:10.5,fill:C.badS});
    b += box(340,62,276,58,{fill:C.bad,stroke:C.badS});
    b += t(356,84,"/* branch deleted: signed overflow",{a:"start",size:10.5,fill:C.badS});
    b += t(356,104,"   is UB, so x+1<x is 'impossible' */",{a:"start",size:10.5,fill:C.badS});
    b += t(320,150,"Same story: for (int i = 0; i <= N; i++) with N = INT_MAX → 'always true' → infinite loop.",{size:10.5,fill:C.warn});
    b += t(320,176,"UB is not 'wraps like hardware' — it's a broken contract, and optimizers collect. M1 L1, with teeth.",{size:10.5,fill:C.dim});
    b += t(320,194,"-fsanitize=undefined (3.8) makes UB scream. Unsigned wrap stays DEFINED — use on purpose only.",{size:10.5,fill:C.goodT});
    return svg(208,b,"optimizer deleting an overflow check because signed overflow is undefined");
  })();

  /* 3.3a — pointer anatomy */
  D["m3l3-anatomy"] = (() => {
    let b = t(320,22,"A pointer is a variable whose VALUE is an address",{bold:true,size:13});
    b += t(96,56,"address",{size:10,fill:C.dim2});
    b += t(96,80,"0x7ffc…a4",{size:10,fill:C.dim2}) ;
    b += box(140,60,150,36,{fill:C.acc,stroke:C.accS}) + t(215,83,"int x = 42",{size:11.5,fill:C.accT});
    b += t(96,140,"0x7ffc…98",{size:10,fill:C.dim2});
    b += box(140,120,150,36,{fill:C.good,stroke:C.goodS}) + t(215,143,"int *p = &x",{size:11.5,fill:C.goodT});
    b += box(300,120,120,36,{fill:C.card,stroke:C.goodS,sw:1.2}) + t(360,143,"0x7ffc…a4",{size:10.5,fill:C.goodT});
    b += ln(420,138,470,138) + ln(470,138,470,96) + ln(470,96,300,96) + ln(300,96,300,96);
    b += ln(300,96,296,96) + triL(292,96);
    b += t(456,66,"p's VALUE is x's ADDRESS",{size:10,fill:C.dim});
    b += box(440,150,176,90,{fill:C.card,stroke:C.boxS});
    b += t(456,172,"&x  → 'address of x'",{a:"start",size:10.5,fill:C.accT});
    b += t(456,192,"*p  → 'follow p' = 42",{a:"start",size:10.5,fill:C.goodT});
    b += t(456,212,"*p = 7 → writes x",{a:"start",size:10.5,fill:C.warn});
    b += t(456,230,"p is 8 bytes (M1 L1)",{a:"start",size:10,fill:C.dim});
    b += t(320,272,"Python's names were invisible tags (M2 L1). C hands you the tag as a NUMBER to store, pass, and add to.",{size:10.5,fill:C.dim});
    b += t(320,290,"cudaMalloc gives you addresses; kernels receive pointers. This picture IS the GPU interface.",{size:10.5,fill:C.dim});
    return svg(304,b,"pointer p holding the address of variable x with address-of and dereference");
  })();

  /* 3.3b — swap: by value vs by pointer */
  D["m3l3-swap"] = (() => {
    let b = t(320,22,"Why swap needs pointers: C copies arguments",{bold:true,size:13});
    b += t(160,52,"swap(int a, int b) ✗",{size:10.5,fill:C.badS});
    b += box(40,62,240,56,{fill:C.card,stroke:C.boxS}) + t(56,82,"caller:  x=1  y=2",{a:"start",size:10.5});
    b += t(56,102,"(unchanged after the call)",{a:"start",size:10,fill:C.badS});
    b += box(40,130,240,52,{fill:C.bad,stroke:C.badS}) + t(56,150,"swap's frame: a=1  b=2",{a:"start",size:10.5,fill:C.badS});
    b += t(56,168,"copies swapped… then POP. Gone.",{a:"start",size:10,fill:C.badS});
    b += t(480,52,"swap(int *pa, int *pb) ✓",{size:10.5,fill:C.goodT});
    b += box(360,62,250,56,{fill:C.card,stroke:C.boxS}) + t(376,82,"caller:  x=2  y=1",{a:"start",size:10.5});
    b += t(376,102,"MUTATED through the pointers",{a:"start",size:10,fill:C.goodT});
    b += box(360,130,250,52,{fill:C.good,stroke:C.goodS}) + t(376,150,"swap's frame: pa=&x  pb=&y",{a:"start",size:10.5,fill:C.goodT});
    b += ln(430,132,430,118,{stroke:C.goodS,sw:1.6}) + triU(430,118,{stroke:C.goodS});
    b += ln(520,132,520,118,{stroke:C.goodS,sw:1.6}) + triU(520,118,{stroke:C.goodS});
    b += t(376,168,"pointers reach UP into the caller",{a:"start",size:10,fill:C.dim});
    b += t(320,214,"C is pass-by-value, always — the callee gets copies (M2 L3's frames). To mutate the caller's data, pass its ADDRESS.",{size:10.5,fill:C.dim});
    b += t(320,232,"Python quietly did this for mutable objects (M2 L4 aliasing). C makes the choice visible in every signature.",{size:10.5,fill:C.dim});
    return svg(246,b,"swap by value fails swap by pointer reaches the caller frame");
  })();

  /* 3.3c — pointer to pointer / cudaMalloc */
  D["m3l3-pp"] = (() => {
    let b = t(320,22,"float** — why cudaMalloc takes the address of your pointer",{bold:true,size:13});
    b += t(40,56,"float *d;               cudaMalloc(&d, bytes);",{a:"start",size:11,fill:C.accT});
    b += box(40,74,170,44,{fill:C.acc,stroke:C.accS}) + t(125,92,"d  (your float*)",{size:10.5,fill:C.accT}) + t(125,108,"value: ??? → 0x7f4dead000",{size:9.5,fill:C.dim});
    b += box(270,74,170,44,{fill:C.good,stroke:C.goodS}) + t(355,92,"&d  (a float**)",{size:10.5,fill:C.goodT}) + t(355,108,"cudaMalloc receives THIS",{size:9.5,fill:C.dim});
    b += ln(270,96,214,96) + triL(210,96,{stroke:C.goodS});
    b += box(480,74,136,44,{fill:C.warnFill,stroke:C.warn}) + t(548,92,"GPU memory",{size:10.5,fill:C.warn}) + t(548,108,"0x7f4dead000",{size:9.5,fill:C.warn});
    b += ln(440,96,476,96,{dash:true}) ;
    b += t(320,148,"The function must WRITE INTO d (give you the new address) — so it needs d's address. Return-value can't be used:",{size:10.5,fill:C.dim});
    b += t(320,166,"that slot is spent on the error code (cudaError_t). Pointer out-params = C's multi-return (M2 L3 tuples).",{size:10.5,fill:C.dim});
    b += t(320,192,"You will type &d_ptr a thousand times in Module 5. Today it stopped being magic.",{size:10.5,fill:C.goodT});
    return svg(206,b,"cudaMalloc writing a device address through a pointer to pointer");
  })();

  /* 3.4a — pointer arithmetic scales */
  D["m3l4-arith"] = (() => {
    let b = t(320,22,"Pointer arithmetic counts ELEMENTS, not bytes",{bold:true,size:13});
    const addr=["0x100","0x104","0x108","0x10c","0x110","0x114"];
    for (let i=0;i<6;i++){
      b += t(70+i*80,52,addr[i],{size:9.5,fill:C.dim2});
      b += box(30+i*80,60,76,40,{fill:i===2?C.good:C.acc,stroke:i===2?C.goodS:C.accS});
      b += t(68+i*80,85,"a["+i+"]",{size:11,fill:i===2?C.goodT:C.accT});
    }
    b += t(30,130,"float *p = a;      p + 2  →  0x100 + 2×sizeof(float)  =  0x108",{a:"start",size:11,fill:C.goodT});
    b += t(30,152,"a[i]  is defined as  *(a + i)   — indexing IS pointer math (M1 L1 §6: base + 4·i, now official)",{a:"start",size:10.5,fill:C.dim});
    b += t(30,180,"p2 - p  → 2 (elements, not bytes)      one-past-the-end (a+6): legal to POINT, illegal to READ",{a:"start",size:10.5,fill:C.warn});
    b += t(320,212,"Same math on the GPU: out[i] in a kernel is *(out + i) with i built from threadIdx — M1 L2's linearization, compiled.",{size:10.5,fill:C.dim});
    return svg(226,b,"pointer plus two advances two elements scaled by sizeof float");
  })();

  /* 3.4b — array decay */
  D["m3l4-decay"] = (() => {
    let b = t(320,22,"Arrays decay: the function receives an address and NOTHING else",{bold:true,size:13});
    b += t(150,52,"caller's frame",{size:10,fill:C.dim});
    b += box(40,60,220,56,{fill:C.acc,stroke:C.accS});
    b += t(150,82,"float arr[8]  (32 bytes)",{size:10.5,fill:C.accT});
    b += t(150,100,"sizeof(arr) = 32 ✓",{size:10,fill:C.goodT});
    b += arrowR(264,88,320);
    b += t(320,80,"f(arr, 8)",{size:10,fill:C.dim,a:"start"});
    b += t(470,52,"f(float *a, int n)",{size:10,fill:C.dim});
    b += box(380,60,230,56,{fill:C.warnFill,stroke:C.warn});
    b += t(495,82,"a: just an address (8 bytes)",{size:10.5,fill:C.warn});
    b += t(495,100,"sizeof(a) = 8 — length GONE",{size:10,fill:C.badS});
    b += t(320,148,"Python's len(xs) traveled with the list (M2 L4). In C the length travels only if YOU pass it — so every array",{size:10.5,fill:C.dim});
    b += t(320,166,"parameter is really a (pointer, count) pair. Forget the count and you've built a buffer overflow starter kit.",{size:10.5,fill:C.dim});
    b += t(320,192,"CUDA kernels inherit this: kernel(float *x, int n) — the guard if (i < n) is the count doing its job.",{size:10.5,fill:C.goodT});
    return svg(206,b,"array decaying to pointer losing its size across a function call");
  })();

  /* 3.4c — strings are bytes with a terminator */
  D["m3l4-string"] = (() => {
    let b = t(320,22,"A C string is bytes + a promise: it ends at \\0",{bold:true,size:13});
    const cells=[["'G'","71"],["'P'","80"],["'U'","85"],["'\\0'","0"]];
    for (let i=0;i<4;i++){
      b += box(60+i*90,54,84,44,{fill:i===3?C.bad:C.acc,stroke:i===3?C.badS:C.accS});
      b += t(102+i*90,74,cells[i][0],{size:11.5,fill:i===3?C.badS:C.accT});
      b += t(102+i*90,90,cells[i][1],{size:9.5,fill:C.dim});
    }
    b += t(430,80,"char s[4] = \"GPU\";",{a:"start",size:11,fill:C.goodT});
    b += t(430,100,"3 chars need 4 bytes",{a:"start",size:10,fill:C.warn});
    b += t(40,132,"strlen(s) WALKS until it meets 0 → O(n) every call (a loop condition calling strlen is O(n²) — Gauss, M1 L2)",{a:"start",size:10.5,fill:C.dim});
    b += t(40,154,"no terminator? strlen/printf march through memory until a 0 happens — reading garbage or crashing (3.8)",{a:"start",size:10.5,fill:C.badS});
    b += t(40,182,"write safely:  snprintf(buf, sizeof buf, \"run_%d.json\", i)   — bounded, always terminated",{a:"start",size:10.5,fill:C.goodT});
    b += t(320,212,"s1 == s2 compares ADDRESSES (M2 L4's is!); strcmp compares contents. The == string bug, C edition.",{size:10.5,fill:C.dim});
    return svg(226,b,"c string bytes with null terminator and strlen walk");
  })();

  /* 3.5a — the process memory map */
  D["m3l5-map"] = (() => {
    let b = t(320,22,"Where everything lives: one process, four neighborhoods",{bold:true,size:13});
    b += t(120,50,"high addresses",{size:9.5,fill:C.dim2});
    b += box(60,56,120,64,{fill:C.acc,stroke:C.accS}) + t(120,80,"STACK",{size:11,bold:true,fill:C.accT}) + t(120,98,"frames (M2 L3)",{size:9,fill:C.dim});
    b += ln(120,124,120,146,{stroke:C.accS,sw:1.6}) + triD(120,150,{stroke:C.accS}) + t(150,140,"grows ↓",{size:9,fill:C.dim,a:"start"});
    b += box(60,158,120,40,{fill:C.card,stroke:C.boxS,sw:0.8}) + t(120,182,"(gap)",{size:9.5,fill:C.dim2});
    b += ln(120,232,120,208,{stroke:C.goodS,sw:1.6}) + triU(120,204,{stroke:C.goodS}) + t(150,222,"grows ↑",{size:9,fill:C.dim,a:"start"});
    b += box(60,236,120,58,{fill:C.good,stroke:C.goodS}) + t(120,258,"HEAP",{size:11,bold:true,fill:C.goodT}) + t(120,276,"malloc lives here",{size:9,fill:C.dim});
    b += box(60,300,120,36,{fill:C.warnFill,stroke:C.warn}) + t(120,322,"globals (data/bss)",{size:9.5,fill:C.warn});
    b += box(60,342,120,36) + t(120,364,"code (text)",{size:9.5,fill:C.dim});
    b += t(120,392,"low addresses",{size:9.5,fill:C.dim2});
    b += box(230,60,386,120,{fill:C.card,stroke:C.boxS});
    b += t(246,84,"STACK: automatic, fast, ~8 MB limit,",{a:"start",size:10.5});
    b += t(246,102,"freed at return — locals die with frames",{a:"start",size:10.5});
    b += t(246,124,"(returning &local = dangling pointer)",{a:"start",size:10,fill:C.badS});
    b += t(246,146,"deep recursion → stack overflow",{a:"start",size:10,fill:C.dim});
    b += box(230,196,386,120,{fill:C.card,stroke:C.boxS});
    b += t(246,220,"HEAP: yours by request — malloc(n) borrows,",{a:"start",size:10.5});
    b += t(246,238,"free(p) returns. Big, slower, survives returns.",{a:"start",size:10.5});
    b += t(246,260,"YOU are the garbage collector now",{a:"start",size:10,fill:C.warn});
    b += t(246,282,"(Python refcounted for you — M2 L1's tags.",{a:"start",size:10,fill:C.dim});
    b += t(246,300,"cudaMalloc: same contract, different chip.)",{a:"start",size:10,fill:C.dim});
    b += t(380,392,"Every 3.3–3.5 bug is a wrong-neighborhood story: dangling = stack",{size:10,fill:C.dim});
    b += t(380,408,"address outliving its frame; leak = heap never returned.",{size:10,fill:C.dim});
    return svg(422,b,"process memory map with stack heap globals and code");
  })();

  /* 3.5b — malloc, free, and the dangling pointer */
  D["m3l5-heap"] = (() => {
    let b = t(320,22,"free() returns the memory — your pointer still remembers",{bold:true,size:13});
    b += t(40,56,"float *p = malloc(4 * sizeof *p);",{a:"start",size:11,fill:C.accT});
    b += box(40,70,130,36,{fill:C.acc,stroke:C.accS}) + t(105,93,"p: 0x55…2a0",{size:10.5,fill:C.accT});
    b += arrowR(170,88,220);
    b += box(220,70,180,36,{fill:C.good,stroke:C.goodS}) + t(310,93,"heap block (16 B)",{size:10.5,fill:C.goodT});
    b += t(40,140,"free(p);",{a:"start",size:11,fill:C.warn});
    b += box(40,154,130,36,{fill:C.acc,stroke:C.accS}) + t(105,177,"p: 0x55…2a0",{size:10.5,fill:C.accT});
    b += ln(170,172,220,172,{dash:true,stroke:C.badS});
    b += box(220,154,180,36,{fill:C.bad,stroke:C.badS}) + t(310,177,"RETURNED — not yours",{size:10.5,fill:C.badS});
    b += box(430,60,186,140,{fill:C.card,stroke:C.boxS});
    b += t(446,84,"the big three:",{a:"start",size:10.5,fill:C.warn});
    b += t(446,106,"leak: never free",{a:"start",size:10.5});
    b += t(446,126,"use-after-free: *p later",{a:"start",size:10.5});
    b += t(446,146,"double free: free(p) ×2",{a:"start",size:10.5});
    b += t(446,172,"all three: valgrind/ASan",{a:"start",size:10,fill:C.goodT});
    b += t(446,188,"catch them (3.8)",{a:"start",size:10,fill:C.goodT});
    b += t(320,226,"Every malloc: ONE owner, ONE free. Set p = NULL after — reuse then crashes loudly, not quietly.",{size:10.5,fill:C.dim});
    b += t(320,244,"C++ automates the contract (3.7 RAII) — but you must know what it automates.",{size:10.5,fill:C.dim});
    return svg(258,b,"pointer dangling after free with the three heap bugs");
  })();

  /* 3.5c — growable buffer, amortized doubling */
  D["m3l5-grow"] = (() => {
    let b = t(320,22,"Growth by doubling: Python's list trick, hand-built (M2 L4 §4)",{bold:true,size:13});
    const states=[["len 3 / cap 4",[1,1,1,0]],["push → len 4 / cap 4",[1,1,1,1]],["push → REALLOC to cap 8",[1,1,1,1,1,0,0,0]]];
    let y=54;
    for (const [lbl, cells] of states){
      b += t(40,y+16,lbl,{a:"start",size:10.5,fill:C.accT});
      for (let i=0;i<cells.length;i++){
        b += box(250+i*40,y,36,26,{r:4,fill:cells[i]?C.good:C.card,stroke:cells[i]?C.goodS:C.boxS});
      }
      y += 44;
    }
    b += t(40,y+12,"realloc may MOVE the block: every saved pointer into it now dangles (3.7's invalidation rule, previewed)",{a:"start",size:10,fill:C.badS});
    b += t(320,y+42,"Doubling makes N pushes cost ~2N copies total (geometric series — M1 L2 §4): 'amortized O(1)'. You now own the",{size:10.5,fill:C.dim});
    b += t(320,y+60,"mechanism behind Python lists, C++ vector, and every dynamic GPU buffer pool.",{size:10.5,fill:C.dim});
    return svg(y+74,b,"growable buffer doubling capacity on realloc");
  })();

  /* 3.6a — struct padding */
  D["m3l6-padding"] = (() => {
    let b = t(320,22,"Padding: the compiler aligns fields, you pay in bytes",{bold:true,size:13});
    b += t(40,54,"struct { char c; double d; int i; }   → 24 bytes",{a:"start",size:10.5,fill:C.badS});
    const row1=[["c",1,C.acc,C.accS],["pad",7,C.bad,C.badS],["d",8,C.good,C.goodS],["i",4,C.warnFill,C.warn],["pad",4,C.bad,C.badS]];
    let x=40;
    for (const [n,w,f,s] of row1){
      b += box(x,64,w*23,30,{r:4,fill:f,stroke:s,sw:1.2});
      b += t(x+w*11.5,84,n+" "+w,{size:9.5});
      x += w*23;
    }
    b += t(40,130,"struct { double d; int i; char c; }   → 16 bytes (big → small: 33% saved)",{a:"start",size:10.5,fill:C.goodT});
    const row2=[["d",8,C.good,C.goodS],["i",4,C.warnFill,C.warn],["c",1,C.acc,C.accS],["pad",3,C.bad,C.badS]];
    x=40;
    for (const [n,w,f,s] of row2){
      b += box(x,140,w*23,30,{r:4,fill:f,stroke:s,sw:1.2});
      b += t(x+w*11.5,160,n+" "+w,{size:9.5});
      x += w*23;
    }
    b += t(320,200,"Rule: each field sits at a multiple of its own size; the struct pads to its largest member (so arrays stay aligned).",{size:10.5,fill:C.dim});
    b += t(320,218,"Alignment is M1 L1's masks made law. 10M records × 8 pad bytes = 80 MB of nothing — order big→small.",{size:10.5,fill:C.dim});
    b += t(320,240,"GPU structs care doubly: alignment gates vectorized loads (float4 = 16-byte aligned — M2 L5 / Module 5).",{size:10.5,fill:C.goodT});
    return svg(254,b,"struct field ordering changing padding from 24 to 16 bytes");
  })();

  /* 3.6b — compilation units */
  D["m3l6-units"] = (() => {
    let b = t(320,22,"Each .c compiles ALONE; headers are the shared promises",{bold:true,size:13});
    b += box(250,52,140,36,{fill:C.warnFill,stroke:C.warn}) + t(320,74,"buffer.h",{size:10.5,bold:true,fill:C.warn});
    b += t(320,100,"declarations only: 'buf_push exists, takes (Buf*, float)'",{size:9.5,fill:C.dim});
    b += ln(285,88,180,118,{dash:true,sw:1.2}) + ln(355,88,460,118,{dash:true,sw:1.2});
    b += box(100,122,160,44,{fill:C.acc,stroke:C.accS}) + t(180,140,"main.c",{size:10.5,bold:true,fill:C.accT}) + t(180,157,"#include \"buffer.h\"",{size:9,fill:C.dim});
    b += box(380,122,160,44,{fill:C.acc,stroke:C.accS}) + t(460,140,"buffer.c",{size:10.5,bold:true,fill:C.accT}) + t(460,157,"the DEFINITIONS live here",{size:9,fill:C.dim});
    b += ln(180,166,180,190) + triD(180,194) + ln(460,166,460,190) + triD(460,194);
    b += box(115,198,130,34) + t(180,219,"main.o",{size:10.5});
    b += box(395,198,130,34) + t(460,219,"buffer.o",{size:10.5});
    b += ln(245,215,300,240) + ln(395,215,340,240);
    b += box(280,236,80,32,{fill:C.warnFill,stroke:C.warn}) + t(320,256,"ld",{size:11,bold:true,fill:C.warn});
    b += ln(320,268,320,288) + triD(320,292);
    b += box(260,296,120,34,{fill:C.good,stroke:C.goodS}) + t(320,317,"program",{size:10.5,fill:C.goodT});
    b += t(320,356,"The header promises; the linker checks delivery (3.1). Change buffer.c → recompile ONE unit, relink.",{size:10.5,fill:C.dim});
    return svg(370,b,"two compilation units sharing a header then linked");
  })();

  /* 3.6c — make's dependency graph */
  D["m3l6-make"] = (() => {
    let b = t(320,22,"make: rebuild exactly what your edit touched",{bold:true,size:13});
    b += box(250,52,140,34,{fill:C.good,stroke:C.goodS}) + t(320,73,"program",{size:10.5,fill:C.goodT});
    b += ln(285,86,180,112) + triD(180,116,{}) ;
    b += ln(355,86,460,112) + triD(460,116,{});
    b += box(110,120,140,34,{fill:C.acc,stroke:C.accS}) + t(180,141,"main.o",{size:10.5,fill:C.accT});
    b += box(390,120,140,34,{fill:C.warnFill,stroke:C.warn,sw:2.2}) + t(460,141,"buffer.o  ← rebuilt",{size:10.5,fill:C.warn});
    b += ln(145,154,110,180) + triD(110,184) + ln(215,154,250,180) + triD(250,184);
    b += ln(425,154,390,180) + triD(390,184) + ln(495,154,530,180) + triD(530,184);
    b += box(50,188,120,32) + t(110,208,"main.c",{size:10});
    b += box(200,188,120,32,{fill:C.card}) + t(260,208,"buffer.h",{size:10});
    b += box(330,188,120,32,{fill:C.bad,stroke:C.badS,sw:2.2}) + t(390,208,"buffer.c  ← edited",{size:10,fill:C.badS});
    b += box(470,188,120,32,{fill:C.card}) + t(530,208,"buffer.h",{size:10});
    b += t(320,248,"Rule in the Makefile:  buffer.o: buffer.c buffer.h  →  make compares timestamps, rebuilds buffer.o and program only.",{size:10.5,fill:C.dim});
    b += t(320,266,"main.o untouched. The stale-binary bug (3.1) is extinct. CMake generates this same graph for CUDA.",{size:10.5,fill:C.dim});
    return svg(280,b,"make dependency graph rebuilding only what changed");
  })();

  /* 3.7a — RAII scope timeline */
  D["m3l7-raii"] = (() => {
    let b = t(320,22,"RAII: the destructor is a free() that cannot be forgotten",{bold:true,size:13});
    b += t(160,52,"manual C — three exits, three frees",{size:10.5,fill:C.badS});
    b += box(30,60,280,140,{fill:C.card,stroke:C.boxS});
    b += t(46,82,"buf = malloc(...);",{a:"start",size:10,fill:C.accT});
    b += t(46,102,"if (err)  { free(buf); return; }",{a:"start",size:10});
    b += t(46,122,"if (err2) { return; }  // LEAK ✗",{a:"start",size:10,fill:C.badS});
    b += t(46,142,"...",{a:"start",size:10,fill:C.dim});
    b += t(46,162,"free(buf); return;",{a:"start",size:10});
    b += t(46,186,"every new exit path = a new chance to leak",{a:"start",size:9.5,fill:C.dim});
    b += t(480,52,"C++ RAII — zero exits to remember",{size:10.5,fill:C.goodT});
    b += box(330,60,286,140,{fill:C.card,stroke:C.goodS});
    b += t(346,82,"{ std::vector<float> buf(n);",{a:"start",size:10,fill:C.goodT});
    b += t(346,102,"  if (err)  return;   // dtor runs",{a:"start",size:10});
    b += t(346,122,"  if (err2) return;   // dtor runs",{a:"start",size:10});
    b += t(346,142,"  ...",{a:"start",size:10,fill:C.dim});
    b += t(346,162,"}  // scope closes → dtor runs. Always.",{a:"start",size:10,fill:C.goodT});
    b += t(346,186,"acquire in constructor, release in destructor",{a:"start",size:9.5,fill:C.dim});
    b += t(320,226,"The compiler inserts cleanup on EVERY path — early returns, exceptions, all. 3.5's ownership, enforced.",{size:10.5,fill:C.dim});
    b += t(320,244,"The same pattern will manage GPU memory and streams (torch tensors are RAII objects).",{size:10.5,fill:C.dim});
    return svg(258,b,"manual free on three exit paths versus raii destructor guarantee");
  })();

  /* 3.7b — vector anatomy + invalidation */
  D["m3l7-vector"] = (() => {
    let b = t(320,22,"std::vector = the 3.5 growable buffer, industrialized",{bold:true,size:13});
    b += box(40,56,180,72,{fill:C.acc,stroke:C.accS});
    b += t(130,76,"vector<float> v",{size:10.5,bold:true,fill:C.accT});
    b += t(130,96,"data* │ size 4 │ cap 4",{size:10,fill:C.dim});
    b += t(130,114,"(on the stack, 24 B)",{size:9,fill:C.dim2});
    b += arrowR(220,92,280);
    b += box(280,74,150,36,{fill:C.good,stroke:C.goodS}) + t(355,97,"heap: [4 floats]",{size:10.5,fill:C.goodT});
    b += t(40,164,"float *old = v.data();   v.push_back(x);   // cap full → NEW block, copy, old block freed",{a:"start",size:10.5,fill:C.warn});
    b += t(40,186,"*old  →  use-after-free. Same physics as 3.5's realloc move — vector just hides the realloc, not the RULE.",{a:"start",size:10.5,fill:C.badS});
    b += t(40,214,"v.data() + v.size()  is how vectors hand their buffer to C APIs — and to cudaMemcpy in Module 5.",{a:"start",size:10.5,fill:C.goodT});
    b += t(320,244,"reserve(n) preallocates (no moves below n); .at(i) bounds-checks; v[i] doesn't — C speed by default.",{size:10.5,fill:C.dim});
    return svg(258,b,"vector object pointing to heap buffer with invalidation on growth");
  })();

  /* 3.7c — value semantics vs reference semantics */
  D["m3l7-valuesem"] = (() => {
    let b = t(320,22,"C++ assignment COPIES — the exact opposite default from Python",{bold:true,size:13});
    b += t(160,52,"Python (M2 L4):  b = a",{size:10.5,fill:C.accT});
    b += box(60,62,60,28) + t(90,80,"a",{size:11,bold:true});
    b += box(60,98,60,28) + t(90,116,"b",{size:11,bold:true});
    b += box(170,70,120,48,{fill:C.warnFill,stroke:C.warn}) + t(230,98,"ONE list",{size:10.5,fill:C.warn});
    b += arrowR(120,76,170) + arrowR(120,112,170);
    b += t(480,52,"C++:  vector<float> b = a;",{size:10.5,fill:C.goodT});
    b += box(360,62,60,28) + t(390,80,"a",{size:11,bold:true});
    b += box(360,98,60,28) + t(390,116,"b",{size:11,bold:true});
    b += box(470,58,140,32,{fill:C.good,stroke:C.goodS}) + t(540,78,"buffer #1",{size:10,fill:C.goodT});
    b += box(470,96,140,32,{fill:C.good,stroke:C.goodS}) + t(540,116,"buffer #2 (copy!)",{size:10,fill:C.goodT});
    b += arrowR(420,74,470) + arrowR(420,112,470);
    b += t(320,158,"Safe: mutating b can't haunt a (no aliasing surprises). Costly: passing a vector BY VALUE copies megabytes —",{size:10.5,fill:C.dim});
    b += t(320,176,"so parameters travel as const vector<float>& — look, don't copy. The & is Python's default, made explicit.",{size:10.5,fill:C.dim});
    b += t(320,200,"Rule: receive by const&, return by value, alias on purpose only. (Raw pointers still alias like C.)",{size:10,fill:C.goodT});
    return svg(214,b,"python aliasing versus c plus plus copy on assignment");
  })();

  /* 3.8a — what a segfault is */
  D["m3l8-segv"] = (() => {
    let b = t(320,22,"Segfault = the MMU refusing an address your program never owned",{bold:true,size:13});
    const pages=[["code ✓",C.box,C.boxS],["heap ✓",C.good,C.goodS],["UNMAPPED",C.card,C.boxS],["UNMAPPED",C.card,C.boxS],["stack ✓",C.acc,C.accS]];
    for (let i=0;i<5;i++){
      b += box(40+i*116,56,104,44,{fill:pages[i][1],stroke:pages[i][2],sw:pages[i][0]==="UNMAPPED"?0.8:1.6});
      b += t(92+i*116,82,pages[i][0],{size:10.5,fill:pages[i][0]==="UNMAPPED"?C.dim2:C.tx});
    }
    b += ln(300,140,340,104,{stroke:C.badS,sw:2}) + `<polygon points="340,104 336.9,114.4 330.1,107.8" style="fill:${C.badS}"/>`;
    b += t(300,158,"*p with p = garbage → unmapped page → SIGSEGV (loud, honest, LUCKY)",{size:10.5,fill:C.badS});
    b += ln(210,196,150,104,{stroke:C.warn,sw:2,dash:true}) + `<polygon points="150,104 155.3,113.6 146.1,111.4" style="fill:${C.warn}"/>`;
    b += t(320,214,"the SCARY case: a wild write that lands on a page you DO own — no crash, silent corruption, symptoms far away",{size:10.5,fill:C.warn});
    b += t(320,240,"'No crash' proves nothing (UB!). Sanitizers exist to make the quiet case loud too.",{size:10.5,fill:C.dim});
    return svg(254,b,"wild pointers hitting unmapped pages crash while owned pages corrupt silently");
  })();

  /* 3.8b — symptom → tool */
  D["m3l8-tools"] = (() => {
    let b = t(320,22,"Pick the tool by the symptom",{bold:true,size:13});
    const rows=[["crashes / segfault","gdb backtrace · ASan (-fsanitize=address)",C.badS],
                ["memory climbing / leak","ASan leak report · valgrind --leak-check=full",C.warn],
                ["wrong values, no crash","UBSan (-fsanitize=undefined) · gdb watch var",C.accS],
                ["works -O0, breaks -O2","almost always UB — UBSan first, then diff flags",C.goodS]];
    for (let i=0;i<4;i++){
      const y=48+i*52;
      b += box(30,y,230,40,{stroke:rows[i][2]});
      b += t(145,y+25,rows[i][0],{size:10.5});
      b += arrowR(260,y+20,296);
      b += box(300,y,316,40,{fill:C.card,stroke:C.boxS});
      b += t(316,y+25,rows[i][1],{a:"start",size:10,fill:C.dim});
    }
    b += t(320,278,"Compile -g -fno-omit-frame-pointer for honest stacks. ASan ≈ 2× slowdown (dev builds, CI); valgrind ≈ 20× (deep hunts).",{size:10,fill:C.dim});
    b += t(320,296,"Module 5's compute-sanitizer is ASan's GPU twin — learn the reports here, reuse the literacy there.",{size:10,fill:C.goodT});
    return svg(310,b,"mapping crash leak and corruption symptoms to gdb asan ubsan valgrind");
  })();

  /* 3.8c — anatomy of an ASan report */
  D["m3l8-asan"] = (() => {
    let b = t(320,22,"Read an AddressSanitizer report like a traceback (M2 L6, C edition)",{bold:true,size:13});
    b += box(30,44,400,204,{fill:"#10141d",stroke:C.boxS});
    b += t(46,68,"ERROR: AddressSanitizer: heap-buffer-overflow",{a:"start",size:10.5,fill:C.badS});
    b += t(46,88,"WRITE of size 4 at 0x60300000eff0",{a:"start",size:10.5,fill:C.warn});
    b += t(46,112,"  #0 fill_buffer buffer.c:31",{a:"start",size:10.5,fill:C.accT});
    b += t(46,130,"  #1 main main.c:12",{a:"start",size:10,fill:C.dim});
    b += t(46,156,"allocated by thread T0 here:",{a:"start",size:10,fill:C.goodT});
    b += t(46,174,"  #0 malloc",{a:"start",size:10,fill:C.dim});
    b += t(46,192,"  #1 make_buffer buffer.c:14",{a:"start",size:10,fill:C.goodT});
    b += t(46,220,"0 bytes to the right of 40-byte region",{a:"start",size:10,fill:C.warn});
    b += t(450,68,"① WHAT kind of bug",{a:"start",size:10,fill:C.badS});
    b += t(450,88,"② read or write, size",{a:"start",size:10,fill:C.warn});
    b += t(450,118,"③ WHERE it happened",{a:"start",size:10,fill:C.accT});
    b += t(450,136,"(your deepest frame)",{a:"start",size:9.5,fill:C.dim});
    b += t(450,174,"④ where the block was",{a:"start",size:10,fill:C.goodT});
    b += t(450,192,"BORN — ties bug to owner",{a:"start",size:9.5,fill:C.dim});
    b += t(450,220,"⑤ the off-by-how-much",{a:"start",size:10,fill:C.warn});
    b += t(320,272,"'0 bytes right of a 40-byte region' + WRITE of 4 = you wrote float[10] of a float[10]: fencepost, convicted.",{size:10.5,fill:C.dim});
    b += t(320,290,"Every phrase maps to a 3.3–3.5 concept you own. Sanitizer reports are only scary before this module.",{size:10.5,fill:C.goodT});
    return svg(304,b,"annotated addresssanitizer heap buffer overflow report");
  })();

  /* 3.9a — loop order and strides */
  D["m3l9-loops"] = (() => {
    let b = t(320,22,"Same math, different walk: why ikj beats ijk",{bold:true,size:13});
    const grid=(x,y,lbl,hot)=>{ let s=t(x+51,y-6,lbl,{size:10,fill:C.dim});
      for(let r=0;r<3;r++) for(let c=0;c<3;c++)
        s+=box(x+c*34,y+r*30,30,26,{r:3,fill:hot==="row"&&r===0?C.acc:hot==="col"&&c===0?C.bad:hot==="one"&&r===0&&c===0?C.good:C.box,
          stroke:hot==="row"&&r===0?C.accS:hot==="col"&&c===0?C.badS:hot==="one"&&r===0&&c===0?C.goodS:C.boxS,sw:1.2});
      return s; };
    b += t(160,48,"ijk (naive): inner loop walks k",{size:10.5,fill:C.badS});
    b += grid(40,72,"A: row walk ✓ stride 1","row");
    b += grid(170,72,"B: COLUMN walk ✗ stride N","col");
    b += grid(300,72,"C: one cell (ok)","one");
    b += t(220,196,"B jumps N×4 bytes per step — a miss per multiply (M2 L5's axis-0 walk)",{size:9.5,fill:C.dim});
    b += t(480,48,"ikj: inner loop walks j",{size:10.5,fill:C.goodT});
    b += grid(430,72,"A[i][k]: ONE value, reused","one");
    b += t(480,196,"B row walk ✓ · C row walk ✓ —",{size:9.5,fill:C.dim});
    b += t(480,212,"all stride-1, 2–10× faster, same FLOPs",{size:9.5,fill:C.goodT});
    b += t(320,244,"The compiler will NOT reorder loops for you — float order changes rounding (M1 L8 ties its hands).",{size:10.5,fill:C.dim});
    b += t(320,262,"You choose the walk. On GPU the same choice is coalescing (5.7) — this experiment is the rehearsal.",{size:10.5,fill:C.goodT});
    return svg(276,b,"matmul loop orders ijk column walk versus ikj row walks");
  })();

  /* 3.9b — blocked / tiled matmul */
  D["m3l9-blocked"] = (() => {
    let b = t(320,22,"Blocking: compute C tile-by-tile so the working set fits in cache",{bold:true,size:13});
    const tile=(x,y,hr,hc,lbl)=>{ let s=t(x+70,y-6,lbl,{size:10,fill:C.dim});
      for(let r=0;r<4;r++) for(let c=0;c<4;c++){
        const hot=(hr==="row"?r<2:hr==="col"?c<2:(r<2&&c<2));
        s+=box(x+c*35,y+r*28,31,24,{r:3,fill:hot?C.acc:C.box,stroke:hot?C.accS:C.boxS,sw:1});
      } return s; };
    b += tile(40,66,"row",null,"A: a 2-row BAND");
    b += t(190,130,"×",{size:16,bold:true});
    b += tile(215,66,"col",null,"B: a 2-col BAND");
    b += t(365,130,"=",{size:16,bold:true});
    b += tile(390,66,"tile",null,"C: one 2×2 TILE");
    b += t(320,206,"Each C tile needs only its A band × B band — a working set that FITS in L1/L2 and gets reused K/tile times.",{size:10.5,fill:C.dim});
    b += t(320,224,"Cache reuse turns a bandwidth problem back into a compute problem (arithmetic intensity ↑ — M1 L3 §4, engineered).",{size:10.5,fill:C.dim});
    b += t(320,248,"Module 5.5 does EXACTLY this with shared memory as the 'cache' you control by hand. Same picture, same math.",{size:10.5,fill:C.goodT});
    return svg(262,b,"tiled matmul computing one c tile from a band of a and b");
  })();

  /* 3.9c — the honest GFLOP/s ladder */
  D["m3l9-ladder"] = (() => {
    let b = t(320,22,"The capstone ladder (typical laptop, fp32, 1024³ — MEASURE YOURS)",{bold:true,size:13});
    const rows=[["naive ijk -O2","~1 GFLOP/s",60,C.bad,C.badS],
                ["ikj (stride-1) -O3","~6 GFLOP/s",120,C.warnFill,C.warn],
                ["+ blocking (64³ tiles)","~15 GFLOP/s",190,C.acc,C.accS],
                ["+ OpenMP (8 cores)","~60 GFLOP/s",300,C.acc,C.accS],
                ["OpenBLAS sgemm","~200+ GFLOP/s",420,C.good,C.goodS],
                ["one 2026 GPU (5.11): ~30 TFLOP/s — off this chart","",560,C.good,C.goodS]];
    for (let i=0;i<6;i++){
      const y=46+i*40;
      b += box(30,y,rows[i][2],30,{r:5,fill:rows[i][3],stroke:rows[i][4],sw:1.4});
      b += t(38,y+20,rows[i][0],{a:"start",size:10.5});
      if (rows[i][1]) b += t(rows[i][2]+56,y+20,rows[i][1],{a:"start",size:10.5,fill:C.dim});
    }
    b += t(320,300,"~200× on ONE CPU from walking memory right, reusing cache, and using all cores — before any GPU exists in the story.",{size:10.5,fill:C.dim});
    b += t(320,318,"BLAS's last 3–10×: SIMD microkernels (out of scope, honestly labeled). Bars not to scale.",{size:10,fill:C.dim2});
    return svg(332,b,"gflops ladder from naive loops to blas to gpu");
  })();

  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, D);
})();

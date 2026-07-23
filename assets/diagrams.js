/* GPU Mastery — Module 1 diagram pack. Registers SVGs on window.DIAGRAMS. */
(function () {
  const C = { card:"#161b26", tx:"#e8edf5", dim:"#aab4c4", box:"#222a38",
    boxS:"#3b4760", acc:"#27406e", accS:"#5b9bff", accT:"#8fb6ff",
    good:"#173d31", goodS:"#36c98a", goodT:"#5fd6a4", warnFill:"#3a3320",
    warn:"#f5b850", bad:"#3d1f24", badS:"#ff6b6b", line:"#8a97aa" };
  const F = "font-family:Inter,system-ui,sans-serif";
  const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const box=(x,y,w,h,o={})=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r??8}" style="fill:${o.fill||C.box};stroke:${o.stroke||C.boxS};stroke-width:${o.sw||1.6}"/>`;
  const t=(x,y,s,o={})=>`<text x="${x}" y="${y}" text-anchor="${o.a||"middle"}" style="fill:${o.fill||C.tx};font-size:${o.size||12}px;font-weight:${o.bold?700:400};${F}">${esc(s)}</text>`;
  const ln=(x1,y1,x2,y2,o={})=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${o.stroke||C.line};stroke-width:${o.sw||1.7}${o.dash?";stroke-dasharray:5 4":""}"/>`;
  const tri=(x,y,o={})=>`<polygon points="${x-7},${y-4} ${x},${y} ${x-7},${y+4}" style="fill:${o.stroke||C.line}"/>`;
  const triL=(x,y,o={})=>`<polygon points="${x+7},${y-4} ${x},${y} ${x+7},${y+4}" style="fill:${o.stroke||C.line}"/>`;
  const triD=(x,y,o={})=>`<polygon points="${x-4},${y-7} ${x},${y} ${x+4},${y-7}" style="fill:${o.stroke||C.line}"/>`;
  const dot=(x,y,r,fill)=>`<circle cx="${x}" cy="${y}" r="${r}" style="fill:${fill}"/>`;
  const circ=(x,y,r,o={})=>`<circle cx="${x}" cy="${y}" r="${r}" style="fill:none;stroke:${o.stroke||C.boxS};stroke-width:${o.sw||1.8}"/>`;
  const arrowR=(x1,y,x2,o={})=>ln(x1,y,x2,y,o)+tri(x2,y,o);
  const svg=(h,body,label)=>`<svg viewBox="0 0 640 ${h}" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="640" height="${h}" rx="10" style="fill:${C.card}"/>${body}</svg>`;
  const D = {};

  /* L1 — binary place value */
  D["m1l1-binary"] = (() => {
    let b = t(320,24,"Binary is just place value: 10101101 = 173 = 0xAD",{bold:true,size:13});
    const bits=[1,0,1,0,1,1,0,1], weights=[128,64,32,16,8,4,2,1];
    for (let i=0;i<8;i++){
      const x=48+i*68, cx=x+31;
      b += t(cx,58,String(weights[i]),{size:11,fill:C.dim});
      b += box(x,68,62,44,bits[i]?{fill:C.acc,stroke:C.accS}:{});
      b += t(cx,96,String(bits[i]),{size:16,bold:true,fill:bits[i]?C.accT:C.dim});
      if(bits[i]) b += t(cx,130,"+"+weights[i],{size:11,fill:C.goodT});
    }
    b += t(320,154,"128 + 32 + 8 + 4 + 1 = 173",{size:13,fill:C.goodT,bold:true});
    b += box(48,168,266,34,{fill:C.warnFill,stroke:C.warn,sw:1.2}) + t(181,189,"nibble 1010 = hex A",{size:11,fill:C.warn});
    b += box(320,168,266,34,{fill:C.warnFill,stroke:C.warn,sw:1.2}) + t(453,189,"nibble 1101 = hex D",{size:11,fill:C.warn});
    b += t(320,226,"Hex is shorthand: one digit per 4 bits. Addresses & masks are written this way.",{size:11,fill:C.dim});
    return svg(240,b,"binary place value: 10101101 equals 173 equals 0xAD");
  })();

  /* L2 — 2D to 1D index linearization */
  D["m1l2-linearize"] = (() => {
    let b = t(320,22,"From 2D coordinates to 1D memory",{bold:true,size:13});
    b += t(158,44,"2D grid - width = 4",{size:11,fill:C.dim});
    for (let c=0;c<4;c++) b += t(83+c*50,60,"c"+c,{size:10,fill:C.dim});
    let n=0;
    for (let r=0;r<3;r++){
      b += t(46,95+r*50,"r"+r,{size:10,fill:C.dim,a:"end"});
      for (let c=0;c<4;c++){
        const hot=(r===1&&c===2);
        b += box(60+c*50,68+r*50,46,46,hot?{fill:C.acc,stroke:C.accS,sw:2}:{});
        b += t(83+c*50,95+r*50,String(n++),{size:13,fill:hot?C.accT:C.tx});
      }
    }
    b += box(310,84,300,84,{fill:C.card,stroke:C.boxS});
    b += t(460,110,"linear index = row * width + col",{size:12,fill:C.accT});
    b += t(460,132,"= 1 * 4 + 2 = 6",{size:13,bold:true,fill:C.goodT});
    b += t(460,154,"inverse: row = i / 4,  col = i % 4",{size:11,fill:C.dim});
    b += ln(183,214,183,236) + ln(183,236,342,236) + ln(342,236,342,258) + triD(342,258);
    b += t(56,250,"1D memory (linear index)",{size:11,fill:C.dim,a:"start"});
    for (let i=0;i<12;i++){
      const hot=(i===6);
      b += box(56+i*44,258,44,40,hot?{fill:C.good,stroke:C.goodS,sw:2}:{r:4});
      b += t(78+i*44,283,String(i),{size:12,fill:hot?C.goodT:C.dim});
    }
    b += t(320,322,"Every GPU thread computes exactly this to find its own piece of data.",{size:11,fill:C.dim});
    return svg(336,b,"mapping a 2D grid cell to a 1D memory index");
  })();

  /* L3 — orders of magnitude ladders */
  D["m1l3-magnitude"] = (() => {
    let b = t(320,22,"Powers of ten you must feel",{bold:true,size:13});
    b += t(170,48,"TIME (how long things take)",{size:11,bold:true,fill:C.accT});
    b += t(470,48,"COMPUTE (operations / second)",{size:11,bold:true,fill:C.goodT});
    const L=["1 ns - one clock tick (~1-2 GHz)","100 ns - main-memory (DRAM) read","10 us - CUDA kernel-launch overhead","4 ms - copy 100 MB over PCIe gen4","1 s - a human notices the delay"];
    const R=["10^9  GFLOP/s - one phone CPU core","10^12 TFLOP/s - laptop ~1, gaming GPU ~80","10^15 PFLOP/s - datacenter GPU tensor cores","10^18 EFLOP/s - top supercomputers","each step = x1000 - count the steps"];
    for (let i=0;i<5;i++){
      b += box(30,58+i*44,280,36) + t(44,80+i*44,L[i],{size:11,a:"start"});
      b += box(330,58+i*44,280,36,i===4?{fill:C.warnFill,stroke:C.warn,sw:1.2}:{});
      b += t(344,80+i*44,R[i],{size:11,a:"start",fill:i===4?C.warn:C.tx});
    }
    b += t(320,296,"A GPU can run thousands of arithmetic ops in the time of one memory trip -",{size:11,fill:C.dim});
    b += t(320,312,"that asymmetry drives every GPU optimization you will ever do.",{size:11,fill:C.dim});
    return svg(326,b,"time and compute orders of magnitude ladders");
  })();

  /* L4 — unit circle */
  D["m1l4-unitcircle"] = (() => {
    let b = t(320,24,"sin & cos live on the unit circle",{bold:true,size:13});
    b += ln(45,180,300,180,{stroke:C.boxS}) + ln(170,62,170,300,{stroke:C.boxS});
    b += circ(170,180,105,{stroke:C.line,sw:2});
    b += ln(170,180,254,180,{stroke:C.goodS,sw:2.6});
    b += ln(254,180,254,117,{stroke:C.accS,sw:2.6});
    b += ln(170,180,254,117,{stroke:C.warn,sw:2.6});
    b += dot(254,117,4.5,C.accT);
    b += t(212,198,"cos = 0.8",{size:11,fill:C.goodT});
    b += t(262,152,"sin = 0.6",{size:11,fill:C.accT,a:"start"});
    b += t(192,136,"r = 1",{size:11,fill:C.warn});
    b += t(191,172,"θ",{size:12,fill:C.tx});
    b += box(340,66,272,216,{fill:C.card,stroke:C.boxS});
    b += t(356,92,"The point at angle θ is",{size:11,a:"start",fill:C.dim});
    b += t(356,110,"(cos θ, sin θ) on a radius-1 circle",{size:11,a:"start"});
    b += t(356,140,"Key values:",{size:11,a:"start",fill:C.accT});
    b += t(356,158,"0° → (1,0)   90° → (0,1)   180° → (−1,0)",{size:11,a:"start"});
    b += t(356,176,"30°: sin = 0.5     45°: sin ≈ 0.707",{size:11,a:"start"});
    b += t(356,206,"Identity: sin²θ + cos²θ = 1",{size:11,a:"start",fill:C.goodT});
    b += t(356,236,"Code: radians = degrees × π / 180",{size:11,a:"start",fill:C.warn});
    b += t(356,254,"sinf(x) / cosf(x) expect RADIANS",{size:11,a:"start",fill:C.warn});
    b += t(320,320,"Every rotation, wave, circle and camera in graphics reduces to this picture.",{size:11,fill:C.dim});
    return svg(334,b,"unit circle with sin and cos as triangle legs");
  })();

  /* L5 — dot product */
  D["m1l5-dot"] = (() => {
    let b = t(320,24,"The dot product: one number that measures alignment",{bold:true,size:13});
    b += arrowR(70,210,300,{stroke:C.goodS,sw:2.4});
    b += t(308,214,"b",{a:"start",size:13,fill:C.goodT,bold:true});
    b += ln(70,210,250,120,{stroke:C.accS,sw:2.4});
    b += `<polygon points="250,120 243.1,128.5 239,120.4" style="fill:${C.accS}"/>`;
    b += ln(250,120,250,210,{stroke:C.line,dash:true,sw:1.4});
    b += ln(70,216,250,216,{stroke:C.goodS,sw:3});
    b += t(160,236,"‖a‖ cos θ  (shadow of a on b)",{size:11,fill:C.goodT});
    b += t(240,112,"a",{a:"start",size:13,fill:C.accT,bold:true});
    b += t(100,200,"θ",{size:12});
    b += box(340,58,280,224,{fill:C.card,stroke:C.boxS});
    b += t(356,84,"Two formulas, same number:",{size:11,a:"start",fill:C.dim});
    b += t(356,108,"algebra:   a·b = ax·bx + ay·by + az·bz",{size:11,a:"start"});
    b += t(356,126,"geometry:  a·b = ‖a‖ ‖b‖ cos θ",{size:11,a:"start"});
    b += t(356,156,"a·b > 0 → point the same way",{size:11,a:"start",fill:C.goodT});
    b += t(356,174,"a·b = 0 → perpendicular",{size:11,a:"start",fill:C.dim});
    b += t(356,192,"a·b < 0 → point opposite ways",{size:11,a:"start",fill:C.badS});
    b += t(356,222,"Lighting, similarity scores, neurons,",{size:11,a:"start",fill:C.accT});
    b += t(356,240,"attention - all dot products at scale.",{size:11,a:"start",fill:C.accT});
    return svg(300,b,"dot product as projection of vector a onto b");
  })();

  /* L6 — matmul cell */
  D["m1l6-matmul"] = (() => {
    let b = t(320,20,"Matrix multiply: every output cell is a dot product",{bold:true,size:13});
    const A=[[1,2,3],[4,5,6]], B=[[7,4],[8,5],[9,6]], Cm=[[50,32],[122,77]];
    b += t(101,88,"A (2×3)",{size:11,fill:C.dim});
    for (let r=0;r<2;r++) for (let c=0;c<3;c++){
      const hot=(r===0);
      b += box(40+c*42,96+r*42,40,40,hot?{fill:C.acc,stroke:C.accS,r:6}:{r:6});
      b += t(60+c*42,121+r*42,String(A[r][c]),{size:13,fill:hot?C.accT:C.tx});
    }
    b += t(370,60,"B (3×2)",{size:11,fill:C.dim,a:"start"});
    for (let r=0;r<3;r++) for (let c=0;c<2;c++){
      const hot=(c===1);
      b += box(270+c*42,40+r*42,40,40,hot?{fill:C.acc,stroke:C.accS,r:6}:{r:6});
      b += t(290+c*42,65+r*42,String(B[r][c]),{size:13,fill:hot?C.accT:C.tx});
    }
    b += t(370,216,"C = A·B",{size:11,fill:C.dim,a:"start"});
    for (let r=0;r<2;r++) for (let c=0;c<2;c++){
      const hot=(r===0&&c===1);
      b += box(270+c*42,192+r*42,40,40,hot?{fill:C.good,stroke:C.goodS,sw:2,r:6}:{r:6});
      b += t(290+c*42,217+r*42,String(Cm[r][c]),{size:13,fill:hot?C.goodT:C.tx});
    }
    b += box(430,96,190,136,{fill:C.card,stroke:C.boxS});
    b += t(444,120,"Cost: 2·m·n·k FLOPs",{size:11,a:"start",fill:C.accT});
    b += t(444,138,"4096³ matmul ≈ 137 GFLOP",{size:11,a:"start"});
    b += t(444,156,"= a few ms on one GPU",{size:11,a:"start"});
    b += t(444,184,"Neural networks are stacks",{size:11,a:"start",fill:C.dim});
    b += t(444,202,"of these. This is WHY",{size:11,a:"start",fill:C.dim});
    b += t(444,220,"GPUs exist.",{size:11,a:"start",fill:C.dim});
    b += t(320,300,"C[0][1] = 1·4 + 2·5 + 3·6 = 32",{size:13,bold:true,fill:C.goodT});
    b += t(320,320,"(row 0 of A) · (column 1 of B)",{size:11,fill:C.dim});
    return svg(334,b,"matrix multiplication highlighting one output cell as a dot product");
  })();

  /* L7 — normal distribution */
  D["m1l7-normal"] = (() => {
    let b = t(320,22,"The normal distribution: noise has a shape",{bold:true,size:13});
    const hs=[6,14,30,55,85,110,120,110,85,55,30,14,6];
    for (let i=0;i<13;i++){
      const h=hs[i], x=40+i*34;
      b += box(x,250-h,30,h,{fill:i===6?C.acc:C.box,stroke:i===6?C.accS:C.boxS,r:3});
    }
    b += ln(30,250,482,250,{stroke:C.boxS});
    b += ln(259,116,259,248,{stroke:C.warn,dash:true,sw:1.6});
    b += t(259,106,"mean μ",{size:11,fill:C.warn});
    b += ln(191,272,327,272,{stroke:C.goodS,sw:1.8}) + triL(191,272,{stroke:C.goodS}) + tri(327,272,{stroke:C.goodS});
    b += t(259,292,"±1σ ≈ 68% of samples",{size:11,fill:C.goodT});
    b += box(492,64,128,196,{fill:C.card,stroke:C.boxS});
    b += t(504,88,"Benchmarks:",{size:10.5,a:"start",fill:C.accT});
    b += t(504,106,"report MEDIAN -",{size:10.5,a:"start"});
    b += t(504,124,"one slow outlier",{size:10.5,a:"start"});
    b += t(504,142,"drags the mean.",{size:10.5,a:"start"});
    b += t(504,170,"68 / 95 / 99.7 %",{size:10.5,a:"start",fill:C.goodT});
    b += t(504,188,"within 1 / 2 / 3 σ",{size:10.5,a:"start",fill:C.goodT});
    b += t(504,216,"σ² = variance",{size:10.5,a:"start",fill:C.dim});
    b += t(504,234,"σ = spread",{size:10.5,a:"start",fill:C.dim});
    b += t(320,318,"Kernel timings, sensor noise, initial weights - all roughly bell-shaped.",{size:11,fill:C.dim});
    return svg(332,b,"histogram shaped like a normal distribution with mean and sigma marked");
  })();

  /* L8 — IEEE-754 layouts */
  D["m1l8-fp"] = (() => {
    let b = t(320,22,"IEEE-754: how every GPU number is stored",{bold:true,size:13});
    b += t(39,52,"s",{size:11,fill:C.badS}) + t(120,52,"exponent (8)",{size:11,fill:C.warn}) + t(401,52,"fraction / mantissa (23)",{size:11,fill:C.accT});
    b += box(30,60,18,40,{fill:C.bad,stroke:C.badS,r:4}) + box(48,60,145,40,{fill:C.warnFill,stroke:C.warn,r:4}) + box(193,60,417,40,{fill:C.acc,stroke:C.accS,r:4});
    b += t(39,85,"0",{size:13,bold:true}) + t(120,85,"10000001",{size:13,bold:true}) + t(401,85,"01110000000000000000000",{size:12,bold:true});
    b += t(320,128,"5.75 = +1.4375 × 2²  →  sign 0, exponent 2+127 = 129, fraction .4375",{size:12,fill:C.goodT});
    b += t(320,150,"value = (−1)^s × 1.fraction × 2^(exponent − 127)",{size:12,fill:C.dim});
    b += box(30,180,18,30,{fill:C.bad,stroke:C.badS,r:3}) + box(48,180,91,30,{fill:C.warnFill,stroke:C.warn,r:3}) + box(139,180,181,30,{fill:C.acc,stroke:C.accS,r:3});
    b += t(39,199,"1",{size:10}) + t(93,199,"5",{size:10}) + t(229,199,"10",{size:10});
    b += t(336,200,"fp16 - max 65504 - training can overflow to inf",{a:"start",size:11,fill:C.warn});
    b += box(30,225,18,30,{fill:C.bad,stroke:C.badS,r:3}) + box(48,225,145,30,{fill:C.warnFill,stroke:C.warn,r:3}) + box(193,225,127,30,{fill:C.acc,stroke:C.accS,r:3});
    b += t(39,244,"1",{size:10}) + t(120,244,"8",{size:10}) + t(256,244,"7",{size:10});
    b += t(336,245,"bf16 - fp32 range, 7-bit precision - ML workhorse",{a:"start",size:11,fill:C.goodT});
    b += t(320,292,"Fewer bits = faster tensor-core math but less precision. Every format is a trade.",{size:11,fill:C.dim});
    return svg(306,b,"IEEE-754 bit layouts for fp32, fp16 and bf16");
  })();

  const triU=(x,y,o={})=>`<polygon points="${x-4},${y+7} ${x},${y} ${x+4},${y+7}" style="fill:${o.stroke||C.line}"/>`;

  /* L1b — two's complement */
  D["m1l1-twoscomp"] = (() => {
    let b = t(320,22,"Two's complement (int8): negatives via the top bit",{bold:true,size:13});
    b += box(30,50,280,44,{fill:C.good,stroke:C.goodS}) + t(170,70,"0 ... 127",{size:12,bold:true,fill:C.goodT}) + t(170,86,"0xxxxxxx  (top bit 0 = positive)",{size:10.5,fill:C.goodT});
    b += box(330,50,280,44,{fill:C.bad,stroke:C.badS}) + t(470,70,"-128 ... -1",{size:12,bold:true,fill:C.badS}) + t(470,86,"1xxxxxxx  (top bit 1 = negative)",{size:10.5,fill:C.badS});
    b += t(320,124,"how to negate: invert every bit, then add 1",{size:11,fill:C.dim});
    b += t(320,146,"5 = 00000101   →   invert: 11111010   →   +1: 11111011 = −5",{size:12,fill:C.accT});
    b += box(110,176,120,36) + t(170,198,"127 + 1",{size:12,bold:true});
    b += arrowR(230,194,290,{stroke:C.badS,sw:2});
    b += box(290,176,180,36,{fill:C.warnFill,stroke:C.warn}) + t(380,198,"−128  (wraps around!)",{size:12,fill:C.warn});
    b += t(320,244,"In C/CUDA, signed overflow is UNDEFINED BEHAVIOR — the compiler may assume it never happens.",{size:10.5,fill:C.dim});
    return svg(258,b,"two's complement ranges and overflow wraparound for int8");
  })();

  /* L1c — bits to bytes to warp loads */
  D["m1l1-units"] = (() => {
    let b = t(320,24,"From bits to the sizes GPUs care about",{bold:true,size:13});
    const rows=[["bit","0 or 1"],["byte","8 bits"],["float32","4 bytes"],["warp load","32 × 4 B = 128 B"],["cache line","128 B on GPUs"]];
    for (let i=0;i<5;i++){
      const x=24+i*118;
      b += box(x,64,104,52,i>=3?{fill:C.acc,stroke:C.accS}:{});
      b += t(x+52,86,rows[i][0],{size:11.5,bold:true,fill:i>=3?C.accT:C.tx});
      b += t(x+52,104,rows[i][1],{size:10,fill:C.dim});
      if(i<4) b += arrowR(x+104,90,x+118);
    }
    b += t(320,152,"KB = 10³ bytes (marketing)      KiB = 2¹⁰ = 1024 bytes (memory)",{size:11,fill:C.warn});
    b += t(320,174,"a “12 GB” card ≈ 11.18 GiB — the discrepancy is just units",{size:11,fill:C.dim});
    b += t(320,208,"Every bandwidth and occupancy number you will ever compute starts from these.",{size:10.5,fill:C.dim});
    return svg(222,b,"chain from bit to byte to float to warp-sized 128-byte loads");
  })();

  /* L2b — sigma notation is a for-loop */
  D["m1l2-sigma"] = (() => {
    let b = t(320,22,"Σ is a for-loop you can already read",{bold:true,size:13});
    b += box(30,50,270,140,{fill:C.card,stroke:C.boxS});
    b += t(165,80,"n−1",{size:12,fill:C.dim});
    b += t(165,112,"Σ  aᵢ",{size:24,bold:true,fill:C.accT});
    b += t(165,136,"i = 0",{size:12,fill:C.dim});
    b += t(165,168,"= a₀ + a₁ + … + aₙ₋₁",{size:12});
    b += arrowR(304,120,336,{stroke:C.accS,sw:2});
    b += box(340,50,280,140,{fill:C.card,stroke:C.boxS});
    b += t(356,80,"float s = 0;              // start at 0",{size:10.5,a:"start",fill:C.goodT});
    b += t(356,104,"for (i = 0; i < n; i++)   // the range",{size:10.5,a:"start",fill:C.goodT});
    b += t(356,128,"    s += a[i];            // the term",{size:10.5,a:"start",fill:C.goodT});
    b += t(356,164,"// s is the sum",{size:10.5,a:"start",fill:C.dim});
    b += t(320,216,"Lower bound → init.  Upper bound → condition.  Term → body.",{size:11,fill:C.dim});
    b += t(320,234,"Π (product) is the same loop with  s *= a[i]  and s = 1.",{size:11,fill:C.dim});
    return svg(248,b,"sigma summation notation translated into a for loop");
  })();

  /* L2c — ceiling division for blocks */
  D["m1l2-ceil"] = (() => {
    let b = t(320,22,"How many blocks for N threads? Ceiling division",{bold:true,size:13});
    let n=0;
    for (let g=0;g<3;g++){
      b += t(40+g*180+80,56,"block "+g,{size:10.5,fill:C.dim});
      for (let i=0;i<4;i++){
        const idle = n>9;
        b += box(40+g*180+i*42,64,38,40,idle?{fill:C.card,stroke:C.boxS}:{fill:C.acc,stroke:C.accS});
        b += t(40+g*180+i*42+19,89,idle?"—":String(n),{size:12,fill:idle?C.dim2:C.accT});
        n++;
      }
    }
    b += t(320,142,"N = 10 threads needed, B = 4 per block  →  ⌈10/4⌉ = 3 blocks",{size:12,fill:C.accT});
    b += t(320,166,"int blocks = (N + B − 1) / B;    // = (10+3)/4 = 3 in integer math",{size:11.5,fill:C.goodT});
    b += box(120,186,400,48,{fill:C.warnFill,stroke:C.warn});
    b += t(320,206,"kernel guard:  if (i < N) { ...work... }",{size:12,fill:C.warn});
    b += t(320,224,"threads 10 and 11 exist but must do nothing",{size:10.5,fill:C.warn});
    b += t(320,260,"You will write this exact pattern in every CUDA launch for the rest of your career.",{size:10.5,fill:C.dim});
    return svg(274,b,"ceiling division computing three blocks for ten threads with idle lanes guarded");
  })();

  /* L3b — growth-rate cost table */
  D["m1l3-growth"] = (() => {
    let b = t(320,22,"What growth rates cost (operations needed)",{bold:true,size:13});
    const xs=[20,110,200,290,400,510], ws=[90,90,90,110,110,110];
    const head=["n","log₂ n","n","n log₂ n","n²","2ⁿ"];
    const rows=[["10","3.3","10","33","100","1 024"],
                ["1 000","10","10³","10⁴","10⁶","10³⁰¹ ops"],
                ["10⁶","20","10⁶","2×10⁷","10¹²","forget it"]];
    for (let c=0;c<6;c++){
      b += box(xs[c],46,ws[c],32,{fill:C.card2,stroke:C.boxS,r:4});
      b += t(xs[c]+ws[c]/2,66,head[c],{size:11,bold:true,fill:C.accT});
      for (let r=0;r<3;r++){
        const danger=(c===5)||(c===4&&r===2);
        b += box(xs[c],82+r*36,ws[c],32,danger?{fill:C.bad,stroke:C.badS,r:4}:{r:4});
        b += t(xs[c]+ws[c]/2,102+r*36,rows[r][c],{size:11,fill:danger?C.badS:C.tx});
      }
    }
    b += t(320,216,"An O(n²) algorithm at n = 1M costs 10¹² ops — algorithm choice beats hardware.",{size:11,fill:C.dim});
    b += t(320,234,"GPUs shrink the constant. The exponent is YOUR job.",{size:11,fill:C.dim});
    return svg(248,b,"table of operation counts for common growth rates at three problem sizes");
  })();

  /* L3c — log2 as halvings */
  D["m1l3-log2"] = (() => {
    let b = t(320,22,"log₂ answers one question: how many halvings to reach 1?",{bold:true,size:13});
    const vals=["16","8","4","2","1"];
    for (let i=0;i<5;i++){
      const x=40+i*120;
      b += box(x,56,70,44,i===4?{fill:C.good,stroke:C.goodS}:{});
      b += t(x+35,83,vals[i],{size:15,bold:true,fill:i===4?C.goodT:C.tx});
      if(i<4){ b += arrowR(x+70,78,x+120,{stroke:C.accS,sw:1.8}); b += t(x+95,70,"÷2",{size:10.5,fill:C.accT}); b += t(x+95,116,String(i+1),{size:10.5,fill:C.dim}); }
    }
    b += t(320,150,"log₂ 16 = 4 halvings",{size:13,bold:true,fill:C.goodT});
    b += t(320,176,"parallel sum of 1M values: log₂(2²⁰) = 20 rounds — not a million",{size:11,fill:C.accT});
    b += t(320,196,"tree depth, bits needed, binary-search steps: all the same question",{size:11,fill:C.dim});
    return svg(210,b,"halving 16 to 1 in four steps illustrating log base 2");
  })();

  /* L4b — radians */
  D["m1l4-radians"] = (() => {
    let b = t(320,24,"A radian is an arc one radius long",{bold:true,size:13});
    b += circ(150,180,95,{stroke:C.boxS,sw:1.8});
    b += ln(150,180,245,180,{stroke:C.line,sw:2});
    b += ln(150,180,201,100,{stroke:C.line,sw:2});
    b += `<path d="M 245 180 A 95 95 0 0 0 201 100" style="fill:none;stroke:${C.accS};stroke-width:3.5"/>`;
    b += t(200,196,"r",{size:11,fill:C.dim});
    b += t(262,138,"arc = r",{size:11,fill:C.accT,a:"start"});
    b += t(196,164,"1 rad",{size:10.5,fill:C.accT});
    b += box(320,66,292,204,{fill:C.card,stroke:C.boxS});
    b += t(336,92,"full circle = 2π rad = 360°",{size:11,a:"start"});
    b += t(336,110,"half = π rad",{size:11,a:"start"}) + t(478,110,"quarter = π/2 rad",{size:11,a:"start"});
    b += t(336,140,"degrees → radians:  × π/180",{size:11,a:"start",fill:C.goodT});
    b += t(336,158,"radians → degrees:  × 180/π",{size:11,a:"start",fill:C.goodT});
    b += t(336,188,"deg",{size:11,a:"start",fill:C.dim});
    b += t(336,206,"rad",{size:11,a:"start",fill:C.dim});
    const dv=["0","30","45","90","180"], rv=["0","π/6","π/4","π/2","π"], dx=[392,432,472,512,556];
    for (let i=0;i<5;i++){ b += t(dx[i],188,dv[i],{size:11,fill:C.dim}) + t(dx[i],206,rv[i],{size:11,fill:C.dim}); }
    b += t(336,236,"1 rad ≈ 57.2958°",{size:11,a:"start",fill:C.warn});
    b += t(336,254,"sinf / cosf / GLSL / rotate: RADIANS",{size:11,a:"start",fill:C.warn});
    b += t(320,300,"Passing degrees where radians are expected is the oldest bug in graphics.",{size:10.5,fill:C.dim});
    return svg(314,b,"unit circle showing one radian as an arc equal to the radius");
  })();

  /* L4c — y-down screen coordinates */
  D["m1l4-ydown"] = (() => {
    let b = t(320,22,"Math axes vs screen pixels: y flips",{bold:true,size:13});
    b += t(165,52,"math: y grows UP",{size:11,bold:true,fill:C.accT});
    b += arrowR(80,220,250,{stroke:C.line,sw:1.8});
    b += ln(80,220,80,90,{stroke:C.line,sw:1.8}) + triU(80,90);
    b += dot(170,160,4.5,C.accT) + t(182,156,"(3, 2)",{size:11,a:"start",fill:C.accT});
    b += t(258,236,"x",{size:11,fill:C.dim}) + t(66,86,"y",{size:11,fill:C.dim});
    b += t(475,52,"screen: y grows DOWN",{size:11,bold:true,fill:C.warn});
    b += arrowR(390,90,560,{stroke:C.line,sw:1.8});
    b += ln(390,90,390,240,{stroke:C.line,sw:1.8}) + triD(390,240);
    b += dot(480,150,4.5,C.warn) + t(492,146,"(3, 2) — same numbers,",{size:11,a:"start",fill:C.warn});
    b += t(492,164,"lower-right position",{size:11,a:"start",fill:C.warn});
    b += t(568,106,"x",{size:11,fill:C.dim}) + t(376,250,"y",{size:11,fill:C.dim});
    b += t(320,268,"Images, textures & window coords are y-down.  Convert: y_math = height − 1 − y_pixel",{size:11,fill:C.dim});
    return svg(282,b,"comparison of y-up math coordinates and y-down screen coordinates");
  })();

  /* L5b — vector addition tip to tail */
  D["m1l5-add"] = (() => {
    let b = t(320,24,"Vector addition: tip to tail",{bold:true,size:13});
    b += ln(90,240,240,180,{stroke:C.accS,sw:2.4}) + `<polygon points="240,180 232.4,187.9 229,179.5" style="fill:${C.accS}"/>`;
    b += ln(240,180,300,90,{stroke:C.goodS,sw:2.4}) + `<polygon points="300,90 298.2,100.8 290.8,95.8" style="fill:${C.goodS}"/>`;
    b += ln(90,240,300,90,{stroke:C.warn,sw:2.6}) + `<polygon points="300,90 294.5,99.5 289.3,92.1" style="fill:${C.warn}"/>`;
    b += ln(90,240,150,150,{dash:true,sw:1.3}) + ln(150,150,300,90,{dash:true,sw:1.3});
    b += t(150,204,"a",{size:13,bold:true,fill:C.accT});
    b += t(284,146,"b",{size:13,bold:true,fill:C.goodT});
    b += t(298,78,"a + b",{size:13,bold:true,fill:C.warn});
    b += box(380,56,240,184,{fill:C.card,stroke:C.boxS});
    b += t(396,82,"a = (5, 2)    b = (2, 3)",{size:11,a:"start"});
    b += t(396,102,"a + b = (5+2, 2+3) = (7, 5)",{size:11,a:"start",fill:C.goodT});
    b += t(396,132,"componentwise: each axis",{size:11,a:"start",fill:C.dim});
    b += t(396,150,"adds independently",{size:11,a:"start",fill:C.dim});
    b += t(396,180,"GPU: a float4 add does all",{size:11,a:"start",fill:C.accT});
    b += t(396,198,"four components at once",{size:11,a:"start",fill:C.accT});
    b += t(396,224,"a − b  =  a + (−b)",{size:11,a:"start"});
    b += t(320,278,"Forces, velocities, offsets, gradients — anything with direction adds this way.",{size:10.5,fill:C.dim});
    return svg(292,b,"tip-to-tail vector addition with parallelogram");
  })();

  /* L5c — normalization */
  D["m1l5-norm"] = (() => {
    let b = t(320,24,"Normalize: keep the direction, force length 1",{bold:true,size:13});
    b += ln(60,190,150,70,{stroke:C.accS,sw:2.4}) + `<polygon points="150,70 147.6,81.6 140.4,74.4" style="fill:${C.accS}"/>`;
    b += ln(60,190,78,166,{stroke:C.goodS,sw:3.4}) + `<polygon points="78,166 75.6,177.6 68.4,170.4" style="fill:${C.goodS}"/>`;
    b += t(170,100,"v = (3, 4)    ‖v‖ = √(9+16) = 5",{size:11,a:"start",fill:C.accT});
    b += t(60,152,"u = v/5 = (0.6, 0.8)",{size:11,a:"start",fill:C.goodT});
    b += box(360,52,260,158,{fill:C.card,stroke:C.boxS});
    b += t(376,78,"u = v / ‖v‖",{size:12,a:"start",bold:true});
    b += t(376,100,"(3,4) / 5 = (0.6, 0.8) → length 1",{size:11,a:"start",fill:C.goodT});
    b += t(376,130,"required before: angles, lighting,",{size:11,a:"start",fill:C.dim});
    b += t(376,148,"cosine similarity, any direction",{size:11,a:"start",fill:C.dim});
    b += t(376,178,"NEVER normalize (0,0):",{size:11,a:"start",fill:C.warn});
    b += t(376,196,"÷0 → NaN spreads everywhere",{size:11,a:"start",fill:C.warn});
    b += t(320,240,"With unit vectors, cos θ = a·b — no division, no magnitudes. Cheap and everywhere.",{size:10.5,fill:C.dim});
    return svg(254,b,"vector 3 4 normalized to unit vector 0.6 0.8");
  })();

  /* L6b — row-major vs column-major */
  D["m1l6-rowmajor"] = (() => {
    let b = t(320,22,"Same matrix, two memory orders",{bold:true,size:13});
    const M=[["a00","a01","a02"],["a10","a11","a12"]];
    for (let r=0;r<2;r++){
      for (let c=0;c<3;c++){
        b += box(40+c*42,44+r*42,40,40,r===0?{fill:C.acc,stroke:C.accS,r:5}:{fill:C.good,stroke:C.goodS,r:5});
        b += t(60+c*42,69+r*42,M[r][c],{size:10.5,fill:r===0?C.accT:C.goodT});
      }
      b += t(176,69+r*42,"← row "+r,{size:10.5,a:"start",fill:r===0?C.accT:C.goodT});
    }
    b += t(40,158,"row-major (C, CUDA, NumPy): rows sit together",{size:11,a:"start",fill:C.accT});
    const RM=["a00","a01","a02","a10","a11","a12"];
    for (let i=0;i<6;i++){
      const rowcol = i<3;
      b += box(40+i*64,168,60,34,rowcol?{fill:C.acc,stroke:C.accS,r:5}:{fill:C.good,stroke:C.goodS,r:5});
      b += t(70+i*64,189,RM[i],{size:10.5,fill:rowcol?C.accT:C.goodT});
    }
    b += t(40,232,"column-major (Fortran, cuBLAS, MATLAB): columns sit together",{size:11,a:"start",fill:C.warn});
    const CM=["a00","a10","a01","a11","a02","a12"];
    for (let i=0;i<6;i++){
      b += box(40+i*64,242,60,34,{fill:C.warnFill,stroke:C.warn,r:5});
      b += t(70+i*64,263,CM[i],{size:10.5,fill:C.warn});
    }
    b += t(320,300,"Hand a row-major array to a column-major API and it silently reads Aᵀ —",{size:11,fill:C.dim});
    b += t(320,318,"no error, just wrong numbers. The classic cuBLAS interop bug.",{size:11,fill:C.dim});
    return svg(332,b,"row-major versus column-major memory layout of a 2 by 3 matrix");
  })();

  /* L6c — matrix as transformation */
  D["m1l6-transform"] = (() => {
    let b = t(320,22,"A matrix IS a transformation: columns = where the axes land",{bold:true,size:13});
    b += t(160,52,"before",{size:10.5,fill:C.dim});
    b += arrowR(110,200,210,{stroke:C.line,sw:2}) + t(218,204,"x̂ = (1,0)",{size:10.5,a:"start"});
    b += ln(110,200,110,100,{stroke:C.line,sw:2}) + triU(110,100) + t(110,88,"ŷ = (0,1)",{size:10.5});
    b += t(270,120,"R(90°) =",{size:11,fill:C.accT});
    b += t(270,140,"[ 0  −1 ]",{size:12,fill:C.accT});
    b += t(270,158,"[ 1   0 ]",{size:12,fill:C.accT});
    b += t(430,52,"after R(90°)",{size:10.5,fill:C.dim});
    b += ln(430,200,430,100,{stroke:C.accS,sw:2.2}) + triU(430,100,{stroke:C.accS});
    b += t(438,110,"x̂ → (0, 1)",{size:10.5,a:"start",fill:C.accT});
    b += ln(430,200,330,200,{stroke:C.goodS,sw:2.2}) + triL(330,200,{stroke:C.goodS});
    b += t(368,188,"ŷ → (−1, 0)",{size:10.5,fill:C.goodT});
    b += t(320,240,"Column 1 = image of (1,0).  Column 2 = image of (0,1). Read ANY matrix this way.",{size:11,fill:C.dim});
    b += t(320,258,"Scale, rotate, reflect, project — all just choices of where the axes land.",{size:11,fill:C.dim});
    return svg(272,b,"rotation by 90 degrees shown as basis vectors landing on matrix columns");
  })();

  /* L7b — mean vs median with outlier */
  D["m1l7-meanmedian"] = (() => {
    let b = t(320,22,"Mean vs median: one cold start ruins the mean",{bold:true,size:13});
    const v=[2.1,2.2,2.2,2.3,9.8];
    for (let i=0;i<5;i++){
      const h=v[i]*20, x=60+i*74;
      b += box(x,240-h,56,h,i===4?{fill:C.bad,stroke:C.badS,r:4}:{fill:C.acc,stroke:C.accS,r:4});
      b += t(x+28,240-h-8,v[i].toFixed(1),{size:10.5,fill:i===4?C.badS:C.accT});
      b += t(x+28,258,"run "+(i+1),{size:10,fill:C.dim});
    }
    b += t(356+28,274,"(cold start / JIT)",{size:10,fill:C.badS});
    b += ln(40,166,430,166,{stroke:C.badS,dash:true,sw:1.6}) + t(444,170,"mean = 3.72 ms",{size:11,a:"start",fill:C.badS});
    b += ln(40,196,430,196,{stroke:C.goodS,dash:true,sw:1.6}) + t(444,200,"median = 2.2 ms",{size:11,a:"start",fill:C.goodT});
    b += t(320,304,"Benchmark ritual: warm up first, run ≥ 20 times, report median (and spread).",{size:11,fill:C.dim});
    return svg(318,b,"five kernel timings where an outlier drags the mean above the median");
  })();

  /* L7c — Monte Carlo pi */
  D["m1l7-montecarlo"] = (() => {
    let b = t(320,22,"Monte Carlo: estimate π by throwing random darts",{bold:true,size:13});
    b += box(60,60,200,200,{r:0,fill:"none",stroke:C.line,sw:1.8});
    b += circ(160,160,100,{stroke:C.accS,sw:2});
    const ins=[[10,20],[-40,35],[70,-20],[-80,-45],[25,80],[90,40],[-95,20],[5,-90],[-30,-70],[55,55],[-60,78],[20,-40],[-15,55],[45,-75],[-70,10],[80,-50],[-60,-60],[30,60],[-50,60]];
    const outs=[[95,-85],[-96,60],[60,-96],[88,88],[75,70]];
    for (const p of ins)  b += dot(160+p[0],160+p[1],3.4,C.goodS);
    for (const p of outs) b += dot(160+p[0],160+p[1],3.4,C.badS);
    b += box(300,70,320,186,{fill:C.card,stroke:C.boxS});
    b += t(316,96,"area circle / area square = πr²/(2r)² = π/4",{size:11,a:"start"});
    b += t(316,124,"so:  π ≈ 4 × (darts inside / total)",{size:11,a:"start",fill:C.accT});
    b += t(316,152,"here: 4 × 19/24 ≈ 3.17",{size:11,a:"start",fill:C.goodT});
    b += t(316,180,"1M darts → ≈ 3.141   (error ~ 1/√N)",{size:11,a:"start"});
    b += t(316,212,"every dart is independent →",{size:11,a:"start",fill:C.warn});
    b += t(316,230,"perfectly parallel. GPU heaven.",{size:11,a:"start",fill:C.warn});
    b += t(320,292,"The same trick prices options, renders films (path tracing), and simulates physics.",{size:10.5,fill:C.dim});
    return svg(306,b,"random darts in a square estimating pi from the fraction inside the circle");
  })();

  /* L8b — float density on the number line */
  D["m1l8-density"] = (() => {
    let b = t(320,22,"Floats are dense near 0, sparse far away",{bold:true,size:13});
    b += ln(30,140,600,140,{sw:1.8}) + tri(610,140);
    const seg=(x0,x1,n)=>{let s="";for(let i=0;i<n;i++){const x=x0+i*(x1-x0)/n;s+=ln(x,131,x,149,{stroke:C.accS,sw:1.2});}return s;};
    b += seg(75,110,8) + seg(110,180,8) + seg(180,320,8) + seg(320,600,8);
    b += ln(40,126,40,154,{stroke:C.tx,sw:1.8});
    const lab=[[40,"0"],[110,"1"],[180,"2"],[320,"4"],[600,"8"]];
    for (const p of lab) b += t(p[0],172,p[1],{size:11,fill:C.dim});
    b += t(145,110,"2²³ floats",{size:10,fill:C.accT}) + t(250,110,"2²³ floats",{size:10,fill:C.accT}) + t(460,110,"2²³ floats",{size:10,fill:C.accT});
    b += t(320,206,"gap at 1.0 ≈ 1.19e−7  (machine epsilon)",{size:11,fill:C.goodT});
    b += t(320,226,"gap at 2²⁴ = 16,777,216 is 2 → fp32 cannot store the odd integers above it",{size:11,fill:C.warn});
    b += t(320,246,"23 fraction bits stretched across each doubling: precision is RELATIVE, not absolute",{size:10.5,fill:C.dim});
    return svg(260,b,"number line with float tick spacing doubling every power of two");
  })();

  /* L8c — catastrophic cancellation */
  D["m1l8-cancel"] = (() => {
    let b = t(320,22,"Absorption & cancellation: big + small = big",{bold:true,size:13});
    b += box(80,44,480,40) + t(320,68,"fp32(1e8 + 1):  the gap near 1e8 is 8  →  rounds back to 100 000 000",{size:11});
    b += box(80,96,480,40,{fill:C.bad,stroke:C.badS}) + t(320,120,"(1e8 + 1) − 1e8  =  0.0     (true answer: 1.0)",{size:12,bold:true,fill:C.badS});
    b += box(80,148,480,40,{fill:C.warnFill,stroke:C.warn}) + t(320,172,"ML version: loss + tiny_gradient → the gradient silently VANISHES",{size:11,fill:C.warn});
    b += box(80,200,480,56,{fill:C.good,stroke:C.goodS});
    b += t(320,222,"fixes: accumulate in wider precision (fp32/fp64),",{size:11,fill:C.goodT});
    b += t(320,240,"sum small→large, Kahan summation, pairwise (tree) reduction",{size:11,fill:C.goodT});
    b += t(320,286,"Parallel tree reductions aren't just fast — they are MORE accurate. Win-win.",{size:10.5,fill:C.dim});
    return svg(300,b,"absorption making one hundred million plus one minus one hundred million equal zero");
  })();

  /* Roadmap — core + four tracks (index page) */
  D["roadmap"] = (() => {
    let b = t(320,24,"One shared core, four career tracks",{bold:true,size:13.5});
    const mods=[["M1 · Math","8 lessons"],["M2 · Python","8 lessons"],["M3 · C/C++","9 lessons"],["M4 · Hardware","7 lessons"],["M5 · CUDA","11 lessons"]];
    for (let i=0;i<5;i++){
      const x=24+i*118;
      b += box(x,60,104,52,{fill:C.acc,stroke:C.accS});
      b += t(x+52,82,mods[i][0],{size:11,bold:true,fill:C.accT});
      b += t(x+52,100,mods[i][1],{size:10,fill:C.dim});
      if(i<4) b += arrowR(x+104,86,x+118);
    }
    b += t(320,136,"43 shared core lessons — then pick a track (or, over time, do all four)",{size:10.5,fill:C.dim});
    b += ln(548,112,548,146) + ln(94,146,562,146);
    for (const x of [94,250,406,562]) b += ln(x,146,x,200) + triD(x,200);
    const tracks=[["A · ML / AI Infra","11 lessons · deploy",C.accS,C.accT],["B · HPC / Scientific","10 lessons · cluster",C.goodS,C.goodT],["C · Graphics / Engines","11 lessons · renderer",C.warn,C.warn],["D · Portable GPU","9 lessons · 4 backends","#b48cff","#cdb4ff"]];
    for (let i=0;i<4;i++){
      const x=24+i*156;
      b += box(x,200,140,64,{stroke:tracks[i][2]});
      b += t(x+70,226,tracks[i][0],{size:11,bold:true,fill:tracks[i][3]});
      b += t(x+70,246,tracks[i][1],{size:10,fill:C.dim});
    }
    b += box(24,296,608,56,{fill:C.card2,stroke:C.boxS});
    b += t(320,318,"Every track ends with deployed, profiled, REAL GPU code:",{size:11,fill:C.tx});
    b += t(320,338,"a served model kernel · a cluster simulation · a renderer · a 4-backend port",{size:11,fill:C.dim});
    return svg(372,b,"curriculum roadmap: five core modules feeding four specialization tracks");
  })();

  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, D);
})();
/* end of Module 1 diagram pack (25 diagrams) */

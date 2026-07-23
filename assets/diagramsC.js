/* GPU Mastery — Track C (Graphics / Game Engines) diagram pack.
   Registers SVGs on window.DIAGRAMS. Palette C, font F, helpers copied
   verbatim from diagramsB.js. Diagram text takes RAW < > (t() calls esc()). */
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
  const circ=(x,y,r,o={})=>`<circle cx="${x}" cy="${y}" r="${r}" style="fill:${o.fill||C.accS};stroke:${o.stroke||"none"};stroke-width:${o.sw||1}"/>`;
  const svg=(h,body,label)=>`<svg viewBox="0 0 640 ${h}" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="640" height="${h}" rx="10" style="fill:${C.card}"/>${body}</svg>`;
  const D = {};

  /* ---------------- C1 — graphics math ---------------- */

  D["c1-spaces"] = (() => {
    let b = t(320,22,"The coordinate pipeline: five spaces, four transforms, one divide",{bold:true,size:13});
    const sp=[["model","a mesh's own"],["world","the scene"],["view","camera at 0"],["clip","w carries z"],["NDC","-1..1 cube"],["screen","pixels"]];
    const mats=["M model","V view","P proj","÷w","viewport"];
    let x=18;
    for (let i=0;i<6;i++){
      b += box(x,60,84,46,{fill:C.acc,stroke:C.accS});
      b += t(x+42,80,sp[i][0],{size:10.5,bold:true,fill:C.accT});
      b += t(x+42,96,sp[i][1],{size:8,fill:C.dim});
      if (i<5){ b += arrowR(x+84,83,x+100,{stroke:C.goodS}); b += t(x+92,74,"",{size:8}); b += t(x+92,120,mats[i],{size:8.5,fill:C.goodT}); }
      x += 100;
    }
    b += t(320,150,"Every vertex you draw walks this chain. The perspective DIVIDE (÷w) is the one nonlinear step —",{size:10.5,fill:C.dim});
    b += t(320,168,"it's what makes far things small, and it's why clip space keeps w around (C1 §divide, C2's z-buffer).",{size:10.5,fill:C.dim});
    return svg(184,b,"model view projection to screen coordinate pipeline");
  })();

  D["c1-divide"] = (() => {
    let b = t(320,22,"The perspective divide: w is depth in disguise",{bold:true,size:13});
    b += box(30,48,270,120,{fill:"#10141d",stroke:C.boxS});
    b += t(46,70,"clip point = (x, y, z, w)",{a:"start",size:11,fill:C.accT});
    b += t(46,92,"NDC = (x/w, y/w, z/w)",{a:"start",size:11,fill:C.goodT});
    b += t(46,118,"near vertex: w=1  → divide by 1 (big)",{a:"start",size:9.5,fill:C.dim});
    b += t(46,138,"far vertex:  w=8  → divide by 8 (small)",{a:"start",size:9.5,fill:C.dim});
    b += t(46,158,"same x, 8× the w → 1/8 the screen size",{a:"start",size:9.5,fill:C.warn});
    b += box(330,48,280,120,{fill:C.warnFill,stroke:C.warn});
    b += t(470,70,"why it matters downstream",{size:10.5,bold:true,fill:C.warn});
    b += t(470,92,"· w encodes camera-space z",{size:9.3,fill:C.dim});
    b += t(470,110,"· dividing attributes by w first =",{size:9.3,fill:C.dim});
    b += t(470,126,"  perspective-correct interp (C2)",{size:9.3,fill:C.dim});
    b += t(470,146,"· 1/w is linear in screen space —",{size:9.3,fill:C.dim});
    b += t(470,162,"  the hardware interpolates 1/w",{size:9.3,fill:C.dim});
    return svg(184,b,"perspective divide by w");
  })();

  D["c1-quaternion"] = (() => {
    let b = t(320,22,"Euler angles gimbal-lock; quaternions don't",{bold:true,size:13});
    b += box(24,44,290,150,{fill:C.bad,stroke:C.badS});
    b += t(169,64,"Euler: 3 angles (yaw/pitch/roll)",{size:10.5,bold:true,fill:C.badS});
    b += t(169,86,"pitch to 90° aligns yaw & roll axes:",{size:9.5,fill:C.dim});
    b += t(169,104,"two of three gimbals now spin the",{size:9.5,fill:C.dim});
    b += t(169,120,"SAME way — a lost degree of freedom",{size:9.5,fill:C.dim});
    b += t(169,142,"= GIMBAL LOCK. Also: interpolating",{size:9.5,fill:C.warn});
    b += t(169,158,"angles takes odd non-shortest paths.",{size:9.5,fill:C.dim});
    b += t(169,180,"cheap to read, treacherous to compose",{size:9,fill:C.badS});
    b += box(326,44,290,150,{fill:C.good,stroke:C.goodS});
    b += t(471,64,"Quaternion: 4 numbers (x,y,z,w)",{size:10.5,bold:true,fill:C.goodT});
    b += t(471,86,"a point on the unit 4-sphere; no axis",{size:9.5,fill:C.dim});
    b += t(471,104,"can align with another → NO gimbal lock",{size:9.5,fill:C.dim});
    b += t(471,124,"slerp = shortest-arc interpolation,",{size:9.5,fill:C.dim});
    b += t(471,140,"constant speed (what animation wants)",{size:9.5,fill:C.dim});
    b += t(471,164,"compose by multiply, normalize to fix",{size:9.5,fill:C.dim});
    b += t(471,180,"drift. The industry default for rotation.",{size:9,fill:C.goodT});
    return svg(206,b,"euler gimbal lock versus quaternion");
  })();

  D["c1-normal"] = (() => {
    let b = t(320,22,"Normals transform by the INVERSE-TRANSPOSE, not the model matrix",{bold:true,size:13});
    // surface + normal, sheared
    b += t(150,52,"non-uniform scale/shear a surface:",{size:9.5,fill:C.dim});
    b += ln(60,150,240,150,{stroke:C.accS,sw:2}); b += t(150,166,"surface (tangent)",{size:9,fill:C.accT});
    b += ln(150,150,150,90,{stroke:C.badS,sw:2}); b += tri(150,90,{stroke:C.badS}); 
    b += t(150,80,"M·normal (WRONG:",{size:9,fill:C.badS}); b += t(150,68,"no longer perp)",{size:9,fill:C.badS});
    b += ln(150,150,205,100,{stroke:C.goodS,sw:2}); b += tri(205,100,{stroke:C.goodS});
    b += t(250,96,"(M⁻¹)ᵀ·normal ✓ stays perp",{a:"start",size:9,fill:C.goodT});
    b += box(360,60,256,120,{fill:"#10141d",stroke:C.boxS});
    b += t(488,82,"the proof (executed, C1 §normal)",{size:9.8,bold:true,fill:C.accT});
    b += t(374,102,"n·t = 0  (normal perp tangent)",{a:"start",size:9.3,fill:C.dim});
    b += t(374,120,"want n'·(M t) = 0 for all t",{a:"start",size:9.3,fill:C.dim});
    b += t(374,138,"n' = (M⁻¹)ᵀ n  ⇒  n'·(Mt)=nᵀM⁻¹Mt=n·t=0",{a:"start",size:9,fill:C.goodT});
    b += t(374,160,"shear x by y: M scales normal WRONG by",{a:"start",size:9.3,fill:C.warn});
    b += t(374,176,"the shear factor; inverse-transpose fixes it.",{a:"start",size:9.3,fill:C.dim});
    return svg(192,b,"normal inverse transpose transform");
  })();

  /* ---------------- C2 — rasterization pipeline ---------------- */

  D["c2-pipeline"] = (() => {
    let b = t(320,22,"The raster pipeline: your shaders are SIMT kernels between fixed stages",{bold:true,size:13});
    const st=[["IA","fixed","assemble verts"],["VS","YOU","per-vertex (warp)"],["raster","fixed","tris → fragments"],["FS","YOU","per-pixel (warp)"],["ROP","fixed","blend + z-test"]];
    let x=18;
    for (let i=0;i<5;i++){
      const you=st[i][1]==="YOU";
      b += box(x,58,110,52,you?{fill:C.good,stroke:C.goodS}:{fill:C.box});
      b += t(x+55,78,st[i][0],{size:11,bold:true,fill:you?C.goodT:C.tx});
      b += t(x+55,93,st[i][1],{size:8.5,fill:you?C.goodT:C.dim2});
      b += t(x+55,106,st[i][2],{size:8,fill:C.dim});
      if(i<4) b += arrowR(x+110,84,x+123);
      x += 123;
    }
    b += t(320,140,"VS and FS are programmable and run as SIMT warps (4.4) — the same occupancy/divergence rules apply.",{size:10.5,fill:C.dim});
    b += t(320,158,"raster and ROP are FIXED-FUNCTION silicon (like RT cores, 4.4): you configure them, you don't code them.",{size:10.5,fill:C.dim});
    return svg(174,b,"rasterization pipeline stages programmable versus fixed");
  })();

  D["c2-quad"] = (() => {
    let b = t(320,22,"Fragments come in 2×2 QUADS — the source of helper lanes",{bold:true,size:13});
    // triangle over a grid
    b += ln(70,180,150,60,{stroke:C.accS,sw:2}) + ln(150,60,250,180,{stroke:C.accS,sw:2}) + ln(70,180,250,180,{stroke:C.accS,sw:2});
    // a 2x2 quad, 3 inside 1 outside
    const qx=150, qy=120;
    for (const [dx,dy,inside] of [[0,0,1],[24,0,1],[0,24,1],[24,24,0]]){
      b += box(qx+dx,qy+dy,22,22,inside?{fill:C.good,stroke:C.goodS}:{fill:C.bad,stroke:C.badS});
    }
    b += t(qx+11,qy+37,"✓",{size:11,fill:C.goodT}); b += t(qx+35,qy+37,"✓",{size:11,fill:C.goodT});
    b += t(qx+11,qy+61,"✓",{size:11,fill:C.goodT}); b += t(qx+35,qy+61,"H",{size:11,fill:C.badS});
    b += box(330,54,286,132,{fill:"#10141d",stroke:C.boxS});
    b += t(473,74,"the helper lane (H)",{size:10.5,bold:true,fill:C.warn});
    b += t(346,96,"· it's OUTSIDE the triangle but still runs",{a:"start",size:9.3,fill:C.dim});
    b += t(346,113,"· needed for DERIVATIVES: dFdx/dFdy =",{a:"start",size:9.3,fill:C.dim});
    b += t(346,129,"  neighbor minus me, across the quad",{a:"start",size:9.3,fill:C.dim});
    b += t(346,146,"· derivatives pick the mip level (C5)",{a:"start",size:9.3,fill:C.dim});
    b += t(346,163,"· its output is DISCARDED — wasted work",{a:"start",size:9.3,fill:C.dim});
    b += t(346,180,"  at every triangle edge (5.6 divergence)",{a:"start",size:9.3,fill:C.warn});
    return svg(198,b,"two by two fragment quad and helper lanes");
  })();

  D["c2-barycentric"] = (() => {
    let b = t(320,22,"Barycentric coordinates: every pixel is a weighted blend of 3 vertices",{bold:true,size:13});
    b += ln(70,180,150,60,{stroke:C.accS,sw:2}) + ln(150,60,270,170,{stroke:C.accS,sw:2}) + ln(70,180,270,170,{stroke:C.accS,sw:2});
    b += t(60,192,"A (w=α)",{size:9,fill:C.accT}); b += t(150,52,"B (w=β)",{size:9,fill:C.accT}); b += t(285,170,"C (w=γ)",{size:9,fill:C.accT});
    b += circ(165,135,4,{fill:C.warn}); b += t(180,138,"P",{a:"start",size:10,fill:C.warn});
    b += box(340,52,276,132,{fill:"#10141d",stroke:C.boxS});
    b += t(478,74,"the interpolation law",{size:10.5,bold:true,fill:C.goodT});
    b += t(356,96,"α + β + γ = 1   (weights sum to one)",{a:"start",size:9.5,fill:C.dim});
    b += t(356,116,"value(P) = α·vA + β·vB + γ·vC",{a:"start",size:9.5,fill:C.goodT});
    b += t(356,138,"works for color, UV, normal — ANY vertex",{a:"start",size:9.3,fill:C.dim});
    b += t(356,154,"attribute. α,β,γ = area ratios of the",{a:"start",size:9.3,fill:C.dim});
    b += t(356,170,"three sub-triangles P makes.",{a:"start",size:9.3,fill:C.dim});
    return svg(196,b,"barycentric interpolation in a triangle");
  })();

  D["c2-zbuffer"] = (() => {
    let b = t(320,22,"Z-buffer precision: the near plane hoards it (why reverse-Z exists)",{bold:true,size:13});
    b += ln(60,110,600,110,{sw:1.4}); b += t(60,128,"near",{size:9,fill:C.dim}); b += t(600,128,"far",{a:"end",size:9,fill:C.dim});
    // classic z: values bunch near 'near'
    b += t(60,64,"standard depth (z/w): precision clusters at NEAR",{a:"start",size:9.5,fill:C.badS});
    for (const f of [0,0.02,0.05,0.1,0.18,0.3,0.5,0.75,1.0]){ const x=60+540*(f**0.35); b += ln(x,100,x,120,{stroke:C.badS,sw:1.4}); }
    b += t(320,150,"Most depth bits are spent on the nearest few %, so FAR objects z-fight (flicker). fp32 makes it worse.",{size:10,fill:C.dim});
    b += box(120,166,400,40,{fill:C.good,stroke:C.goodS});
    b += t(320,184,"reverse-Z: map near→1, far→0. Pairs fp's dense-near-zero with depth's need →",{size:9.8,fill:C.goodT});
    b += t(320,199,"precision spreads evenly. Standard practice in every modern engine (M1 L8 meets graphics).",{size:9.3,fill:C.dim});
    return svg(216,b,"z buffer precision and reverse z");
  })();

  /* ---------------- C3 — first triangle GL → Vulkan ---------------- */

  D["c3-triangle"] = (() => {
    let b = t(320,22,"The same triangle: OpenGL hides the machine, Vulkan hands it to you",{bold:true,size:13});
    b += box(24,44,286,150,{fill:C.acc,stroke:C.accS});
    b += t(167,64,"OpenGL (~50 lines)",{size:11,bold:true,fill:C.accT});
    b += t(38,86,"· the DRIVER picks memory, sync,",{a:"start",size:9.3,fill:C.dim});
    b += t(38,102,"  state, scheduling — global guesses",{a:"start",size:9.3,fill:C.dim});
    b += t(38,122,"· fast to first pixel, great to LEARN",{a:"start",size:9.3,fill:C.dim});
    b += t(38,142,"· hidden costs, driver-dependent perf,",{a:"start",size:9.3,fill:C.dim});
    b += t(38,158,"  hard to multithread (the 2010s wall)",{a:"start",size:9.3,fill:C.dim});
    b += t(38,180,"still the simplest way to see a triangle.",{a:"start",size:9,fill:C.accT});
    b += box(330,44,286,150,{fill:C.good,stroke:C.goodS});
    b += t(473,64,"Vulkan 1.4 (~1000 lines)",{size:11,bold:true,fill:C.goodT});
    b += t(344,86,"· YOU own memory, sync, state, queues",{a:"start",size:9.3,fill:C.dim});
    b += t(344,106,"· verbose because explicit = the driver",{a:"start",size:9.3,fill:C.dim});
    b += t(344,122,"  guesswork you now CONTROL (5.9 as API)",{a:"start",size:9.3,fill:C.dim});
    b += t(344,142,"· predictable perf, multithreaded command",{a:"start",size:9.3,fill:C.dim});
    b += t(344,158,"  recording, no hidden driver magic",{a:"start",size:9.3,fill:C.dim});
    b += t(344,180,"dynamic rendering (1.3+) cuts the ceremony.",{a:"start",size:9,fill:C.goodT});
    return svg(206,b,"opengl versus vulkan first triangle");
  })();

  D["c3-vkgraph"] = (() => {
    let b = t(320,22,"Every Vulkan object is a core concept you already learned",{bold:true,size:13});
    const rows=[["VkQueue","a stream (5.9) — where work is submitted"],["VkCommandBuffer","recorded launches (5.2) — replayed on submit"],["VkDeviceMemory / heaps","the two worlds (5.3) — device vs host, explicit"],["VkPipeline","compiled state (5.1) — shaders + fixed config baked"],["VkSemaphore / Fence","events (5.9) — GPU↔GPU and GPU↔CPU sync"],["Descriptor set","kernel arguments — which buffers/textures a shader sees"]];
    let y=44;
    for (const r of rows){
      b += box(24,y,220,28,{fill:C.acc,stroke:C.accS});
      b += t(134,y+19,r[0],{size:9.8,fill:C.accT});
      b += t(256,y+19,"≡",{size:12,fill:C.dim});
      b += t(276,y+19,r[1],{a:"start",size:9.3,fill:C.dim});
      y += 34;
    }
    b += t(320,y+13,"Vulkan feels huge until you see it's your CUDA mental model (streams, launches, worlds) as explicit objects.",{size:10,fill:C.goodT});
    return svg(y+28,b,"vulkan objects mapped to cuda concepts");
  })();

  D["c3-dynrender"] = (() => {
    let b = t(320,22,"Dynamic rendering (Vulkan 1.3+, core in 1.4): skip the renderpass ceremony",{bold:true,size:13});
    b += box(24,46,286,140,{fill:C.bad,stroke:C.badS});
    b += t(167,66,"legacy renderpass",{size:10.5,bold:true,fill:C.badS});
    b += t(38,88,"1. VkRenderPass (declare attachments,",{a:"start",size:9.3,fill:C.dim});
    b += t(38,104,"   subpasses, dependencies up front)",{a:"start",size:9.3,fill:C.dim});
    b += t(38,122,"2. VkFramebuffer (bind images to it)",{a:"start",size:9.3,fill:C.dim});
    b += t(38,140,"3. begin/next/end subpass ceremony",{a:"start",size:9.3,fill:C.dim});
    b += t(38,162,"powerful for tiler GPUs; painful for the",{a:"start",size:9,fill:C.dim});
    b += t(38,176,"90% case (a single pass to the screen).",{a:"start",size:9,fill:C.badS});
    b += box(330,46,286,140,{fill:C.good,stroke:C.goodS});
    b += t(473,66,"dynamic rendering",{size:10.5,bold:true,fill:C.goodT});
    b += t(344,90,"vkCmdBeginRendering({",{a:"start",size:9.5,fill:C.goodT});
    b += t(344,108,"   colorAttachment = swapchain image,",{a:"start",size:9.3,fill:C.dim});
    b += t(344,124,"   loadOp=CLEAR, storeOp=STORE })",{a:"start",size:9.3,fill:C.dim});
    b += t(344,142,"... draw ...  vkCmdEndRendering()",{a:"start",size:9.3,fill:C.dim});
    b += t(344,166,"no VkRenderPass, no VkFramebuffer object.",{a:"start",size:9,fill:C.dim});
    b += t(344,180,"Modern tutorials start here (C3's path).",{a:"start",size:9,fill:C.goodT});
    return svg(198,b,"dynamic rendering versus legacy renderpass");
  })();

  /* ---------------- C4 — GLSL shaders ---------------- */

  D["c4-descriptors"] = (() => {
    let b = t(320,22,"Four ways to feed data to a shader — a 4.5-style latency/size table",{bold:true,size:13});
    b += box(14,40,612,22,{fill:C.acc,stroke:C.accS,r:5});
    const cols=[24,190,330,470];
    for (const [i,h] of ["mechanism","size","speed","use for"].entries()) b += t(cols[i],55,h,{a:"start",size:10,bold:true,fill:C.accT});
    const rows=[["push constants","~128 B","FASTEST (in cmd)","per-draw: a matrix, an index"],["uniform buffer (UBO)","~64 KB","fast, cached","per-frame: camera, lights"],["storage buffer (SSBO)","GBs","large, read/write","big arrays, compute output"],["texture + sampler","GBs","filtered, cached","images + HW filtering (C5)"]];
    let y=76;
    for (const r of rows){
      for (let i=0;i<4;i++) b += t(cols[i],y,r[i],{a:"start",size:9.3,fill:i===0?C.tx:C.dim});
      b += ln(14,y+6,626,y+6,{stroke:C.boxS,sw:0.8}); y+=24;
    }
    b += t(320,y+14,"Same latency-hierarchy thinking as 4.5's memory system: small+hot near the shader, big+cold in buffers.",{size:10,fill:C.dim});
    return svg(y+30,b,"shader data sources push constants ubo ssbo texture");
  })();

  D["c4-std140"] = (() => {
    let b = t(320,22,"std140 layout: the vec3 padding trap that corrupts your data silently",{bold:true,size:13});
    b += box(24,44,286,150,{fill:"#10141d",stroke:C.badS});
    b += t(167,64,"what you wrote (C++ struct)",{size:10,bold:true,fill:C.badS});
    b += t(38,86,"struct { float a; vec3 b; float c; }",{a:"start",size:9.5,fill:C.tx});
    b += t(38,108,"you EXPECT offsets: 0, 4, 16",{a:"start",size:9.3,fill:C.dim});
    b += t(38,128,"(a=4B, b=12B, c=4B → 20 bytes)",{a:"start",size:9.3,fill:C.dim});
    b += t(38,152,"read c on the GPU → GARBAGE, because",{a:"start",size:9.3,fill:C.warn});
    b += t(38,168,"the GPU's layout rules disagree with yours.",{a:"start",size:9.3,fill:C.dim});
    b += box(330,44,286,150,{fill:"#10141d",stroke:C.goodS});
    b += t(473,64,"what std140 actually does",{size:10,bold:true,fill:C.goodT});
    b += t(344,86,"a  @ 0   (float, align 4)",{a:"start",size:9.3,fill:C.dim});
    b += t(344,104,"b  @ 16  (vec3 aligns to 16! pad 4..15)",{a:"start",size:9.3,fill:C.warn});
    b += t(344,122,"vec3 OCCUPIES 16 B (the 4th is padding)",{a:"start",size:9.3,fill:C.dim});
    b += t(344,140,"c  @ 32  (after the padded vec3)",{a:"start",size:9.3,fill:C.dim});
    b += t(344,164,"= M2 L5's strides + alignment. Match the",{a:"start",size:9.3,fill:C.goodT});
    b += t(344,180,"rule or use std430 (SSBO, tighter). Verify offsets.",{a:"start",size:9,fill:C.dim});
    return svg(206,b,"std140 vec3 alignment padding");
  })();

  D["c4-spirv"] = (() => {
    let b = t(320,22,"GLSL → SPIR-V → driver: 3.1's compiler pipeline, graphics edition",{bold:true,size:13});
    const st=[["shader.glsl","you write"],["glslang / glslc","compile"],["SPIR-V","portable IR"],["driver","→ vendor ISA"]];
    let x=44;
    for (let i=0;i<4;i++){
      b += box(x,60,120,44,{fill:i===2?C.good:C.box,stroke:i===2?C.goodS:C.boxS});
      b += t(x+60,82,st[i][0],{size:10,bold:true,fill:i===2?C.goodT:C.accT});
      b += t(x+60,97,st[i][1],{size:8.5,fill:C.dim});
      if(i<3) b += arrowR(x+120,82,x+133);
      x += 133;
    }
    b += t(320,132,"SPIR-V is the SAME portable-IR idea as Triton/MLIR (Track D7) and OpenCL/SYCL's backend (D4):",{size:10,fill:C.dim});
    b += t(320,150,"compile ahead of time to a vendor-neutral IR, let each driver finish the job. Precompile — don't ship GLSL.",{size:10,fill:C.dim});
    return svg(166,b,"glsl to spirv to driver compile pipeline");
  })();

  /* ---------------- C5 — textures, sampling, mipmaps ---------------- */

  D["c5-bilinear"] = (() => {
    let b = t(320,22,"Bilinear filtering: a sample between texels is a weighted blend of 4",{bold:true,size:13});
    const gx=120,gy=70;
    for (const [dx,dy] of [[0,0],[70,0],[0,70],[70,70]]) b += box(gx+dx,gy+dy,34,34,{fill:C.acc,stroke:C.accS});
    b += t(gx+17,gy+21,"T00",{size:9,fill:C.accT}); b += t(gx+87,gy+21,"T10",{size:9,fill:C.accT});
    b += t(gx+17,gy+91,"T01",{size:9,fill:C.accT}); b += t(gx+87,gy+91,"T11",{size:9,fill:C.accT});
    b += circ(gx+58,gy+46,4,{fill:C.warn}); b += t(gx+58,gy+36,"sample",{size:8.5,fill:C.warn});
    b += box(300,50,316,132,{fill:"#10141d",stroke:C.boxS});
    b += t(458,72,"the lerp of lerps",{size:10.5,bold:true,fill:C.goodT});
    b += t(316,94,"fx = frac(u·W),  fy = frac(v·H)",{a:"start",size:9.3,fill:C.dim});
    b += t(316,112,"top = lerp(T00,T10,fx)",{a:"start",size:9.3,fill:C.dim});
    b += t(316,128,"bot = lerp(T01,T11,fx)",{a:"start",size:9.3,fill:C.dim});
    b += t(316,144,"out = lerp(top, bot, fy)",{a:"start",size:9.3,fill:C.goodT});
    b += t(316,166,"the sampler does this in FIXED-FUNCTION",{a:"start",size:9.3,fill:C.dim});
    b += t(316,180,"silicon — free vs your own 4 taps + math.",{a:"start",size:9,fill:C.warn});
    return svg(194,b,"bilinear filtering four texel blend");
  })();

  D["c5-mip"] = (() => {
    let b = t(320,22,"Mipmaps: prefiltered shrinks, chosen by screen-space derivatives",{bold:true,size:13});
    let x=40,y=60,s=100;
    for (let i=0;i<4;i++){ b += box(x,y+(100-s)/2,s,s,{fill:C.acc,stroke:C.accS}); b += t(x+s/2,y+50+(100-s)/2,"L"+i,{size:10,fill:C.accT}); x+=s+14; s=Math.round(s/2); }
    b += t(320,180,"Each level is the level above, halved and prefiltered. Total cost: +1/3 memory (the geometric series).",{size:10,fill:C.dim});
    b += box(420,58,196,96,{fill:C.warnFill,stroke:C.warn});
    b += t(518,78,"which level?",{size:10,bold:true,fill:C.warn});
    b += t(518,98,"the quad's derivatives (C2)",{size:9,fill:C.dim});
    b += t(518,113,"measure how fast UV changes",{size:9,fill:C.dim});
    b += t(518,128,"per pixel → pick the mip that",{size:9,fill:C.dim});
    b += t(518,143,"is ~1 texel per pixel (no aliasing)",{size:9,fill:C.dim});
    return svg(196,b,"mipmap pyramid and level selection");
  })();

  D["c5-srgb"] = (() => {
    let b = t(320,22,"sRGB & gamma: 0.5 is NOT half-bright (do lighting in linear space)",{bold:true,size:13});
    b += box(24,46,286,138,{fill:"#10141d",stroke:C.boxS});
    b += t(167,66,"the numeric demo (executed)",{size:10.5,bold:true,fill:C.accT});
    b += t(38,88,"sRGB 0.5 → linear = 0.5^2.2 ≈ 0.218",{a:"start",size:9.5,fill:C.goodT});
    b += t(38,108,"so a '50% grey' texel is ~22% light",{a:"start",size:9.3,fill:C.dim});
    b += t(38,128,"average two lit values in sRGB → too dark",{a:"start",size:9.3,fill:C.warn});
    b += t(38,148,"(the classic 'muddy blend' / dark edges bug)",{a:"start",size:9.3,fill:C.dim});
    b += t(38,170,"gamma exists because eyes are non-linear.",{a:"start",size:9,fill:C.dim});
    b += box(330,46,286,138,{fill:C.good,stroke:C.goodS});
    b += t(473,66,"the discipline",{size:10.5,bold:true,fill:C.goodT});
    b += t(344,88,"1. sample sRGB texture → hardware",{a:"start",size:9.3,fill:C.dim});
    b += t(344,104,"   converts to LINEAR for you (sRGB format)",{a:"start",size:9.3,fill:C.dim});
    b += t(344,124,"2. do ALL lighting math in linear",{a:"start",size:9.3,fill:C.goodT});
    b += t(344,144,"3. write to sRGB target → hardware",{a:"start",size:9.3,fill:C.dim});
    b += t(344,160,"   encodes back for the display",{a:"start",size:9.3,fill:C.dim});
    b += t(344,178,"linear in the middle, sRGB at the ends.",{a:"start",size:9,fill:C.goodT});
    return svg(196,b,"srgb gamma linear lighting");
  })();

  /* ---------------- C6 — lighting: Phong → PBR ---------------- */

  D["c6-phong"] = (() => {
    let b = t(320,22,"Phong: diffuse follows N·L, specular follows (N·H) raised to shininess",{bold:true,size:13});
    // surface + vectors
    b += ln(60,170,260,170,{stroke:C.boxS,sw:2});
    const P=[160,170];
    b += ln(P[0],P[1],110,90,{stroke:C.goodS,sw:2}); b += tri(110,90,{stroke:C.goodS}); b += t(104,82,"L",{size:10,fill:C.goodT});
    b += ln(P[0],P[1],160,86,{stroke:C.accS,sw:2}); b += tri(160,86,{stroke:C.accS}); b += t(150,84,"N",{size:10,fill:C.accT});
    b += ln(P[0],P[1],215,92,{stroke:C.dim2,sw:2}); b += tri(215,92,{stroke:C.dim2}); b += t(222,90,"V",{a:"start",size:10,fill:C.dim2});
    b += ln(P[0],P[1],138,84,{stroke:C.warn,sw:1.5}); b += t(126,76,"H",{size:10,fill:C.warn});
    b += box(300,48,316,140,{fill:"#10141d",stroke:C.boxS});
    b += t(458,70,"the terms (all executed by hand, C6)",{size:9.8,bold:true,fill:C.accT});
    b += t(316,92,"diffuse  = albedo · max(N·L, 0)",{a:"start",size:9.5,fill:C.goodT});
    b += t(316,112,"specular = ks · max(N·H, 0)^shininess",{a:"start",size:9.5,fill:C.warn});
    b += t(316,130,"H = normalize(L + V)  (the half vector)",{a:"start",size:9.3,fill:C.dim});
    b += t(316,150,"bigger shininess → tighter highlight.",{a:"start",size:9.3,fill:C.dim});
    b += t(316,170,"Cheap, plausible, NOT energy-conserving → PBR.",{a:"start",size:9.3,fill:C.dim});
    return svg(200,b,"phong diffuse and specular lighting");
  })();

  D["c6-microfacet"] = (() => {
    let b = t(320,22,"PBR microfacet model: a rough surface is a field of tiny mirrors",{bold:true,size:13});
    // jagged microsurface
    let path="", x=40; let y=150;
    b += ln(40,150,300,150,{stroke:C.boxS,sw:1,dash:true});
    for (let i=0;i<12;i++){ const yy=150-(i%2?14:0)-(Math.random()*0); b += ln(40+i*22,150,40+i*22+11,136,{stroke:C.accS,sw:1.6}); b += ln(40+i*22+11,136,40+i*22+22,150,{stroke:C.accS,sw:1.6}); }
    b += t(170,168,"microfacets: only those with normal = H reflect L→V",{size:9,fill:C.dim});
    b += box(320,44,296,150,{fill:"#10141d",stroke:C.boxS});
    b += t(468,64,"the Cook-Torrance BRDF",{size:10.5,bold:true,fill:C.goodT});
    b += t(334,86,"f = D · G · F / (4·(N·L)·(N·V))",{a:"start",size:10,fill:C.goodT});
    b += t(334,110,"D (NDF): how many facets face H (roughness)",{a:"start",size:9.2,fill:C.dim});
    b += t(334,128,"G: shadowing/masking (facets block facets)",{a:"start",size:9.2,fill:C.dim});
    b += t(334,146,"F (Fresnel): reflectivity rises at grazing angle",{a:"start",size:9.2,fill:C.dim});
    b += t(334,170,"each term is a real formula — evaluated next (c6-ggx),",{a:"start",size:9,fill:C.warn});
    b += t(334,184,"and the whole thing conserves energy (verified by MC).",{a:"start",size:9,fill:C.dim});
    return svg(206,b,"microfacet cook torrance brdf");
  })();

  D["c6-ggx"] = (() => {
    let b = t(320,22,"The three PBR terms, evaluated numerically (roughness 0.3, executed)",{bold:true,size:13});
    b += box(14,40,612,22,{fill:C.acc,stroke:C.accS,r:5});
    const cols=[24,150,330];
    for (const [i,h] of ["term","formula","value here"].entries()) b += t(cols[i],55,h,{a:"start",size:10,bold:true,fill:C.accT});
    const rows=[["D (GGX)","α² / (π·((N·H)²(α²−1)+1)²)","≈ 3.94  (N·H≈0.99)"],["G (Smith)","∏ (N·X)/((N·X)(1−k)+k)","≈ 0.99  (masking small)"],["F (Schlick)","F0 + (1−F0)(1−V·H)⁵","≈ 0.04 → 1.0 grazing"]];
    let y=78;
    for (const r of rows){
      for (let i=0;i<3;i++) b += t(cols[i],y,r[i],{a:"start",size:9.3,fill:i===0?C.goodT:C.dim});
      b += ln(14,y+7,626,y+7,{stroke:C.boxS,sw:0.8}); y+=26;
    }
    b += t(320,y+12,"F0 = 0.04 for dielectrics, = the albedo for metals — that one switch IS the metalness workflow (glTF).",{size:10,fill:C.warn});
    b += t(320,y+30,"Energy conservation checked by NumPy Monte-Carlo integration over the hemisphere (B4 cameo) — it holds.",{size:10,fill:C.dim});
    return svg(y+46,b,"ggx smith schlick pbr terms numeric");
  })();

  /* ---------------- C7 — compute shaders ---------------- */

  D["c7-compute"] = (() => {
    let b = t(320,22,"Compute shaders: the reunion — every core CUDA idea, in GLSL",{bold:true,size:13});
    const rows=[["layout(local_size_x=256)","blockDim (5.2)"],["gl_GlobalInvocationID","the 5.2 global index"],["shared float s[256]","__shared__ (5.5)"],["barrier()","__syncthreads() (5.5)"],["subgroup ops (KHR)","warp shuffle (5.8)"],["the 5.8 reduction tree","copies VERBATIM"]];
    let y=44;
    for (const r of rows){
      b += box(24,y,320,28,{fill:C.good,stroke:C.goodS});
      b += t(38,y+19,r[0],{a:"start",size:9.8,fill:C.goodT});
      b += t(360,y+19,"≡",{size:12,fill:C.dim});
      b += box(378,y,238,28,{fill:C.acc,stroke:C.accS});
      b += t(392,y+19,r[1],{a:"start",size:9.8,fill:C.accT});
      y += 34;
    }
    b += t(320,y+13,"That déjà vu is the POINT: the core wasn't CUDA, it was the GPU. Write the reduction once, run it anywhere.",{size:10,fill:C.dim});
    return svg(y+28,b,"glsl compute shader maps to cuda");
  })();

  D["c7-separable"] = (() => {
    let b = t(320,22,"Separable blur: an N×N kernel in 2N taps, not N² (the big post-FX win)",{bold:true,size:13});
    b += box(24,50,286,140,{fill:C.bad,stroke:C.badS});
    b += t(167,70,"naive 2D blur",{size:10.5,bold:true,fill:C.badS});
    b += t(167,94,"each pixel reads an N×N neighborhood",{size:9.3,fill:C.dim});
    b += t(167,114,"N=9  →  81 texture taps / pixel",{size:11,fill:C.badS});
    b += t(167,140,"a full-screen 9×9 blur = 81 · W · H taps",{size:9.3,fill:C.dim});
    b += t(167,162,"bandwidth-bound, dies at large radius (4.6)",{size:9,fill:C.dim});
    b += box(330,50,286,140,{fill:C.good,stroke:C.goodS});
    b += t(473,70,"separable: two 1D passes",{size:10.5,bold:true,fill:C.goodT});
    b += t(473,94,"pass 1: horizontal (9 taps), to a temp",{size:9.3,fill:C.dim});
    b += t(473,110,"pass 2: vertical (9 taps) of the temp",{size:9.3,fill:C.dim});
    b += t(473,132,"N=9  →  9+9 = 18 taps / pixel  (4.5× less)",{size:11,fill:C.goodT});
    b += t(473,158,"works because a Gaussian is separable:",{size:9,fill:C.dim});
    b += t(473,174,"G(x,y) = G(x)·G(y). Free algebra, huge win.",{size:9,fill:C.dim});
    return svg(202,b,"separable blur 2n versus n squared taps");
  })();

  /* ---------------- C8 — Vulkan explicit sync ---------------- */

  D["c8-sync"] = (() => {
    let b = t(320,22,"Vulkan sync is 5.9's event graph with new names — same mental model",{bold:true,size:13});
    const rows=[["CUDA stream","VkQueue","the ordered work timeline"],["cudaEventRecord/Wait","VkSemaphore","GPU→GPU ordering between queues"],["cudaStreamSync (CPU waits)","VkFence","GPU→CPU: is this frame done?"],["implicit stream ordering","pipeline barrier","in-queue: make writes visible to reads"],["(new) counter events","timeline semaphore","monotonic value, wait-for->=N"]];
    let y=44;
    for (const r of rows){
      b += box(24,y,236,28,{fill:C.acc,stroke:C.accS});
      b += t(142,y+19,r[0],{size:9.2,fill:C.accT});
      b += t(272,y+19,"→",{size:12,fill:C.dim});
      b += box(292,y,150,28,{fill:C.good,stroke:C.goodS});
      b += t(367,y+19,r[1],{size:9.2,fill:C.goodT});
      b += t(452,y+19,r[2],{a:"start",size:8.6,fill:C.dim});
      y += 34;
    }
    b += t(320,y+13,"Provide this translation table in your notes and Vulkan's scariest chapter becomes 5.9 with a new dictionary.",{size:10,fill:C.dim});
    return svg(y+28,b,"vulkan synchronization mapped to cuda events streams");
  })();

  D["c8-frames"] = (() => {
    let b = t(320,22,"Frames-in-flight: a depth-3 ring so CPU and GPU never idle (5.9 P4)",{bold:true,size:13});
    const cx=180, cy=120, r=64;
    b += `<circle cx="${cx}" cy="${cy}" r="${r}" style="fill:none;stroke:${C.boxS};stroke-width:2"/>`;
    const slots=[["N: present",C.accS,C.accT],["N+1: GPU renders",C.goodS,C.goodT],["N+2: CPU records",C.warn,C.warn]];
    for (let i=0;i<3;i++){ const a=-90+i*120; const rad=a*Math.PI/180; const x=cx+r*Math.cos(rad), y=cy+r*Math.sin(rad); b += circ(x,y,7,{fill:slots[i][1]}); }
    b += t(cx,cy-r-8,"present",{size:9,fill:C.accT});
    b += t(cx+r+4,cy+34,"GPU",{a:"start",size:9,fill:C.goodT});
    b += t(cx-r-4,cy+34,"CPU",{a:"end",size:9,fill:C.warn});
    b += t(cx,cy,"3 frames",{size:9.5,bold:true,fill:C.dim}); b += t(cx,cy+14,"in flight",{size:9.5,fill:C.dim});
    b += box(300,54,316,132,{fill:"#10141d",stroke:C.boxS});
    b += t(458,74,"why depth 3 (or 2)",{size:10.5,bold:true,fill:C.warn});
    b += t(316,96,"· CPU records frame N+2's commands while",{a:"start",size:9.2,fill:C.dim});
    b += t(316,112,"  the GPU still renders N+1 — no stall (5.9)",{a:"start",size:9.2,fill:C.dim});
    b += t(316,132,"· each frame needs its OWN command buffer +",{a:"start",size:9.2,fill:C.dim});
    b += t(316,148,"  sync objects, cycled by a fence (C8)",{a:"start",size:9.2,fill:C.dim});
    b += t(316,170,"· deeper = smoother but more latency + memory",{a:"start",size:9,fill:C.dim});
    return svg(198,b,"frames in flight ring buffer");
  })();

  D["c8-barrier"] = (() => {
    let b = t(320,22,"A pipeline barrier answers: make WHOSE writes visible to WHOM, WHEN",{bold:true,size:13});
    b += box(60,54,220,52,{fill:C.acc,stroke:C.accS});
    b += t(170,74,"srcStage + srcAccess",{size:10,bold:true,fill:C.accT});
    b += t(170,92,"e.g. COLOR_WRITE finishes",{size:8.8,fill:C.dim});
    b += arrowR(280,80,360,{stroke:C.goodS,sw:2});
    b += t(320,70,"barrier",{size:9,fill:C.goodT});
    b += box(360,54,220,52,{fill:C.good,stroke:C.goodS});
    b += t(470,74,"dstStage + dstAccess",{size:10,bold:true,fill:C.goodT});
    b += t(470,92,"e.g. before SHADER_READ",{size:8.8,fill:C.dim});
    b += t(320,132,"Plus an image LAYOUT transition (e.g. COLOR_ATTACHMENT → SHADER_READ_ONLY): the GPU may",{size:10,fill:C.dim});
    b += t(320,150,"physically re-tile the image for its next use. Miss a barrier → read stale/garbage data (5.4's races,",{size:10,fill:C.dim});
    b += t(320,168,"as an API). The validation layers (C8) catch most — they are 5.4's sanitizer for graphics.",{size:10,fill:C.warn});
    return svg(184,b,"vulkan pipeline barrier src dst stage access");
  })();

  /* ---------------- C9 — ray tracing ---------------- */

  D["c9-bvh"] = (() => {
    let b = t(320,22,"BVH: a bounding-box tree turns O(N) triangle tests into O(log N)",{bold:true,size:13});
    const node=(x,y,w,c)=>box(x,y,w,22,{fill:c.f,stroke:c.s});
    b += node(280,44,80,{f:C.acc,s:C.accS})+t(320,59,"root box",{size:9,fill:C.accT});
    b += node(150,92,90,{f:C.acc,s:C.accS})+t(195,107,"left half",{size:9,fill:C.accT});
    b += node(400,92,90,{f:C.bad,s:C.badS})+t(445,107,"right (SKIP)",{size:9,fill:C.badS});
    b += ln(320,66,195,92)+ln(320,66,445,92);
    for (let i=0;i<3;i++){ b += node(90+i*70,140,56,{f:C.good,s:C.goodS})+t(118+i*70,155,"leaf",{size:8.5,fill:C.goodT}); b += ln(195,114,118+i*70,140,{sw:1}); }
    b += t(500,150,"ray misses the right box →",{a:"end",size:9,fill:C.dim});
    b += t(500,164,"skip ALL its triangles at once",{a:"end",size:9,fill:C.badS});
    b += t(320,186,"M1's log lesson cashing in: test a few boxes, cull whole subtrees. RT cores do this traversal in silicon (4.4).",{size:10,fill:C.dim});
    return svg(200,b,"bvh bounding volume hierarchy traversal");
  })();

  D["c9-rtpipeline"] = (() => {
    let b = t(320,22,"The ray-tracing pipeline: the function-pointer table 3.6 promised returns",{bold:true,size:13});
    const st=[["raygen","shoot a ray/pixel"],["TRAVERSE","fixed-func BVH / RT core"],["closest-hit","shade the surface"],["miss","sky / background"]];
    let y=46;
    for (let i=0;i<4;i++){
      const fixed=st[i][0]==="TRAVERSE";
      b += box(60,y,200,30,fixed?{fill:C.warnFill,stroke:C.warn}:{fill:C.acc,stroke:C.accS});
      b += t(160,y+20,st[i][0],{size:10,bold:true,fill:fixed?C.warn:C.accT});
      b += t(280,y+20,st[i][1],{a:"start",size:9.3,fill:C.dim});
      if(i<3) b += triU(160,y+30+4,{stroke:C.line});
      y += 40;
    }
    b += box(430,60,186,110,{fill:"#10141d",stroke:C.goodS});
    b += t(523,80,"SBT (shader binding table)",{size:9.5,bold:true,fill:C.goodT});
    b += t(444,100,"a table mapping each object →",{a:"start",size:8.8,fill:C.dim});
    b += t(444,116,"its hit shader. The GPU indexes",{a:"start",size:8.8,fill:C.dim});
    b += t(444,132,"it per ray = a function-pointer",{a:"start",size:8.8,fill:C.dim});
    b += t(444,148,"dispatch in hardware (3.6's",{a:"start",size:8.8,fill:C.dim});
    b += t(444,164,"vtable, made real).",{a:"start",size:8.8,fill:C.goodT});
    return svg(y+8,b,"ray tracing pipeline raygen hit miss sbt");
  })();

  D["c9-moller"] = (() => {
    let b = t(320,22,"Ray-triangle (Möller-Trumbore): one solve gives hit AND barycentrics",{bold:true,size:13});
    b += ln(80,180,150,70,{stroke:C.accS,sw:2})+ln(150,70,250,175,{stroke:C.accS,sw:2})+ln(80,180,250,175,{stroke:C.accS,sw:2});
    b += ln(300,60,175,135,{stroke:C.goodS,sw:2}); b += tri(175,135,{stroke:C.goodS}); b += t(305,58,"ray",{a:"start",size:9,fill:C.goodT});
    b += circ(168,138,4,{fill:C.warn});
    b += box(330,50,286,140,{fill:"#10141d",stroke:C.boxS});
    b += t(473,70,"executed in NumPy (C9)",{size:10,bold:true,fill:C.accT});
    b += t(344,92,"solve O + tD = A + u(B−A) + v(C−A)",{a:"start",size:9.3,fill:C.goodT});
    b += t(344,112,"for (t, u, v) via cross products (no matrix",{a:"start",size:9.2,fill:C.dim});
    b += t(344,128,"inverse — the clever part)",{a:"start",size:9.2,fill:C.dim});
    b += t(344,150,"hit if u≥0, v≥0, u+v≤1, t>0",{a:"start",size:9.3,fill:C.warn});
    b += t(344,170,"(u,v) ARE barycentrics (C2) → free interp.",{a:"start",size:9.2,fill:C.dim});
    return svg(202,b,"moller trumbore ray triangle intersection");
  })();

  D["c9-denoise"] = (() => {
    let b = t(320,22,"1 sample/pixel is NOISE: real-time RT is a denoising bargain",{bold:true,size:13});
    b += box(30,50,170,110,{fill:"#10141d",stroke:C.badS});
    b += t(115,70,"1 spp raw",{size:10,bold:true,fill:C.badS});
    for (let i=0;i<60;i++){ const x=42+Math.random()*146, y=82+Math.random()*66; b += circ(x,y,1.1,{fill:i%2?C.dim:C.tx}); }
    b += t(115,154,"grainy — can't ship this",{size:8.8,fill:C.dim});
    b += arrowR(206,105,236,{stroke:C.goodS});
    b += box(242,50,170,110,{fill:"#10141d",stroke:C.goodS});
    b += t(327,70,"temporal accumulate",{size:9.5,bold:true,fill:C.goodT});
    b += t(327,96,"blend this frame with",{size:9,fill:C.dim});
    b += t(327,112,"reprojected PAST frames",{size:9,fill:C.dim});
    b += t(327,128,"→ many effective samples",{size:9,fill:C.dim});
    b += t(327,150,"clean, ~free",{size:9,fill:C.goodT});
    b += box(430,50,186,110,{fill:C.warnFill,stroke:C.warn});
    b += t(523,70,"the catch",{size:9.5,bold:true,fill:C.warn});
    b += t(444,92,"fast motion breaks",{a:"start",size:8.8,fill:C.dim});
    b += t(444,108,"reprojection → ghosting.",{a:"start",size:8.8,fill:C.dim});
    b += t(444,128,"correctness is now",{a:"start",size:8.8,fill:C.dim});
    b += t(444,144,"'measurably plausible'",{a:"start",size:8.8,fill:C.goodT});
    b += t(444,160,"(PSNR), not bitwise.",{a:"start",size:8.8,fill:C.dim});
    return svg(172,b,"ray tracing denoising temporal accumulation");
  })();

  /* ---------------- C10 — frame profiling ---------------- */

  D["c10-triage"] = (() => {
    let b = t(320,22,"Frame profiling: capture WHERE (RenderDoc) then counters WHY (Nsight)",{bold:true,size:13});
    b += box(30,50,270,80,{fill:C.acc,stroke:C.accS});
    b += t(165,72,"1. RenderDoc — WHERE (5.10 nsys)",{size:10,bold:true,fill:C.accT});
    b += t(44,92,"capture 1 frame; scrub the draw list;",{a:"start",size:9,fill:C.dim});
    b += t(44,108,"find the expensive pass / overdraw /",{a:"start",size:9,fill:C.dim});
    b += t(44,124,"the wrong state. Open-source, v1.45.",{a:"start",size:9,fill:C.dim});
    b += box(340,50,270,80,{fill:C.good,stroke:C.goodS});
    b += t(475,72,"2. Nsight/RGP — WHY (5.10 ncu)",{size:10,bold:true,fill:C.goodT});
    b += t(354,92,"on the guilty pass: SM occupancy,",{a:"start",size:9,fill:C.dim});
    b += t(354,108,"bandwidth, warp stalls — the same",{a:"start",size:9,fill:C.dim});
    b += t(354,124,"counters as 5.10, per draw/pass.",{a:"start",size:9,fill:C.dim});
    b += t(320,152,"The 5.10 doctrine, refitted: capture-first to localize, counters-second to diagnose. Never guess a frame.",{size:10,fill:C.dim});
    b += t(320,172,"A frame is a 16.6 ms budget (60 fps) — profiling tells you which pass is eating it (C10's runbook).",{size:10,fill:C.warn});
    return svg(188,b,"renderdoc nsight frame profiling triage");
  })();

  D["c10-pathologies"] = (() => {
    let b = t(320,22,"The four frame pathologies (and the core lesson each one is)",{bold:true,size:13});
    const rows=[["overdraw","same pixel shaded many times","sort front-to-back; depth pre-pass"],["tiny draws","1000s of small draw calls","batch/instance (5.2 launch confetti)"],["fat G-buffer","bandwidth-blown deferred targets","pack/downsize (4.6 bus economics)"],["sync bubbles","GPU idle waiting on a barrier","overlap passes (5.9 max-lane law)"]];
    let y=46;
    for (const r of rows){
      b += box(24,y,600,30,{fill:C.bad,stroke:C.badS});
      b += t(38,y+20,r[0],{a:"start",size:10,bold:true,fill:C.badS});
      b += t(140,y+20,r[1],{a:"start",size:9,fill:C.dim});
      b += t(360,y+20,"→ "+r[2],{a:"start",size:9,fill:C.goodT});
      y += 37;
    }
    b += t(320,y+13,"None are new: they're 5.2 (launch overhead), 4.6 (bandwidth), 5.9 (overlap) wearing a frame's clothes.",{size:10,fill:C.dim});
    return svg(y+28,b,"frame pathologies overdraw tiny draws bandwidth sync");
  })();

  /* ---------------- C11 — capstone ---------------- */

  D["c11-renderer"] = (() => {
    let b = t(320,22,"Capstone renderer: glTF in, a shadowed PBR frame with an RT effect out",{bold:true,size:13});
    const st=[["load glTF","meshes + PBR materials"],["shadow map","depth from the light"],["PBR forward","GGX lighting (C6) + shadows"],["RT effect","shadows OR reflections (toggle)"],["present","to the swapchain (C8)"]];
    let y=44;
    for (let i=0;i<5;i++){
      const rt=st[i][0]==="RT effect";
      b += box(60,y,220,28,rt?{fill:C.warnFill,stroke:C.warn}:{fill:C.acc,stroke:C.accS});
      b += t(170,y+19,st[i][0],{size:10,bold:true,fill:rt?C.warn:C.accT});
      b += t(296,y+19,st[i][1],{a:"start",size:9,fill:C.dim});
      if(i<4) b += triU(170,y+32,{stroke:C.line});
      y += 34;
    }
    b += t(320,y+13,"Every pass is a lesson: C6 lighting, C8 sync/present, C9 the ray-traced effect, C10 the per-pass budget.",{size:10,fill:C.dim});
    return svg(y+28,b,"capstone renderer pipeline gltf pbr shadow rt");
  })();

  D["c11-budget"] = (() => {
    let b = t(320,22,"The 16.6 ms frame budget, spent per pass (a real target table)",{bold:true,size:13});
    const rows=[["shadow map",2.0,C.accS],["G-buffer / geometry",4.0,C.accS],["PBR lighting",5.0,C.goodS],["RT reflections",3.0,C.warn],["post + UI",2.0,C.dim2]];
    let y=48; const total=16.6, x0=180, w=380;
    for (const r of rows){
      b += t(24,y+14,r[0],{a:"start",size:9.8,fill:C.tx});
      b += box(x0,y+2,w*r[1]/8,20,{fill:r[2],r:3});
      b += t(x0+w*r[1]/8+8,y+16,r[1].toFixed(1)+" ms",{a:"start",size:9.3,fill:C.dim});
      y+=28;
    }
    b += ln(x0,y+2,x0,44,{stroke:C.boxS,sw:1});
    b += t(320,y+18,"sum = 16.0 ms ≤ 16.6 ms budget (60 fps). Blow it and you drop to 30 fps — the frame is 5.9's max-lane law,",{size:10,fill:C.dim});
    b += t(320,y+36,"where the pipeline IS the GPU: the slowest pass sets the frame time, so you profile (C10) and cut the peak.",{size:10,fill:C.warn});
    return svg(y+52,b,"frame time budget per pass table");
  })();

  D["c11-psnr"] = (() => {
    let b = t(320,22,"The fixture doctrine, adapted to eyeballs: PSNR against a golden render",{bold:true,size:13});
    b += box(30,50,160,96,{fill:"#10141d",stroke:C.goodS}); b += t(110,72,"golden image",{size:9.5,bold:true,fill:C.goodT}); b += t(110,92,"a trusted reference",{size:8.6,fill:C.dim}); b += t(110,108,"render (offline, many",{size:8.6,fill:C.dim}); b += t(110,122,"samples) — the oracle",{size:8.6,fill:C.dim});
    b += t(215,102,"vs",{size:11,fill:C.dim});
    b += box(240,50,160,96,{fill:"#10141d",stroke:C.accS}); b += t(320,72,"your frame",{size:9.5,bold:true,fill:C.accT}); b += t(320,92,"this build's output",{size:8.6,fill:C.dim}); b += t(320,108,"for the same camera",{size:8.6,fill:C.dim}); b += t(320,122,"+ scene + seed",{size:8.6,fill:C.dim});
    b += box(420,50,196,96,{fill:C.warnFill,stroke:C.warn});
    b += t(518,70,"the test",{size:9.5,bold:true,fill:C.warn});
    b += t(434,90,"PSNR(golden, frame) > 40 dB",{a:"start",size:9,fill:C.goodT});
    b += t(434,108,"= 'measurably plausible', the",{a:"start",size:8.8,fill:C.dim});
    b += t(434,124,"graphics form of M2 L6's oracle:",{a:"start",size:8.8,fill:C.dim});
    b += t(434,140,"not bitwise (RT reorders), but bounded.",{a:"start",size:8.6,fill:C.dim});
    b += t(320,170,"The eyeball is the consumer, so correctness becomes a perceptual budget (PSNR/SSIM) — but it's STILL a fixture:",{size:10,fill:C.dim});
    b += t(320,188,"a threshold a CI job can enforce, so a refactor that quietly darkens the scene fails the build (5.11, for pixels).",{size:10,fill:C.dim});
    return svg(204,b,"psnr golden image reference render test");
  })();

  window.DIAGRAMS = Object.assign(window.DIAGRAMS || {}, D);
})();

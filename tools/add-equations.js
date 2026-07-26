#!/usr/bin/env node
/* Insert a typeset "Key equations" panel (KaTeX \[...\]) into the equation-heavy
   lessons, right after the lead paragraph. Idempotent: skips a file that already
   has a .gm-eq panel. Static \[ triggers app.js's KaTeX loader; gm-site renders it.
   Run: node tools/add-equations.js */
'use strict';
const fs = require('fs');
const path = require('path');
const R = String.raw;
const ROOT = path.resolve(__dirname, '..');

// [ latex, caption ]  — captions are HTML (KaTeX ignores non-math nodes)
const EQ = {
  'module-1/lesson-06.html': [
    [R`C_{ij} = \sum_{k} A_{ik} B_{kj}`, 'matrix multiply — one dot product per output cell'],
    [R`(AB)^{T} = B^{T} A^{T}`, 'transpose reverses a product'],
  ],
  'module-1/lesson-08.html': [
    [R`x = (-1)^{s}\,(1.m)\,2^{\,e-127}`, 'IEEE-754 FP32: sign, mantissa, biased exponent'],
    [R`\varepsilon_{\text{FP32}} = 2^{-23} \approx 1.19\times10^{-7}`, 'machine epsilon — the gap near 1.0'],
    [R`\left|\frac{\text{fl}(x)-x}{x}\right| \le \tfrac{1}{2}\,\varepsilon`, 'relative error bound of one rounded operation'],
  ],
  'track-a/lesson-01.html': [
    [R`f'(x) = \lim_{h\to 0}\frac{f(x+h)-f(x)}{h}`, 'the derivative — a local exchange rate'],
    [R`\frac{dy}{dx} = f'(g(x))\,g'(x)`, 'chain rule — slopes multiply along a chain'],
    [R`\frac{\partial L}{\partial x} = \sum_{i}\frac{\partial L}{\partial y_i}\,\frac{\partial y_i}{\partial x}`, 'reverse-mode: sum contributions over every path (backprop)'],
  ],
  'track-b/lesson-01.html': [
    [R`f'(x) \approx \frac{f(x+h)-f(x)}{h}`, 'forward difference — first order, error O(h)'],
    [R`f'(x) \approx \frac{f(x+h)-f(x-h)}{2h} + O(h^{2})`, 'central difference — second order accuracy'],
    [R`\int_{a}^{b} f\,dx \approx \frac{h}{2}\Big(f_0 + 2\sum_{i=1}^{n-1} f_i + f_n\Big)`, 'trapezoidal rule'],
  ],
  'track-c/lesson-01.html': [
    [R`\mathbf{p}' = M\,\mathbf{p}, \qquad \mathbf{p} = (x,\,y,\,z,\,1)^{T}`, 'homogeneous coords make translation a matrix multiply'],
    [R`(x,\,y,\,z,\,w) \;\to\; \Big(\tfrac{x}{w},\ \tfrac{y}{w},\ \tfrac{z}{w}\Big)`, 'the perspective divide'],
    [R`\mathbf{p}_{\text{clip}} = P\,V\,M\;\mathbf{p}_{\text{model}}`, 'the model-view-projection pipeline'],
  ],
  'track-c/lesson-02.html': [
    [R`E(\mathbf{p}) = (p_x-a_x)(b_y-a_y) - (p_y-a_y)(b_x-a_x)`, 'edge function — sign tells inside vs outside'],
    [R`\mathbf{p} = \alpha\,\mathbf{a} + \beta\,\mathbf{b} + \gamma\,\mathbf{c}, \quad \alpha+\beta+\gamma = 1`, 'barycentric coordinates of a fragment'],
    [R`f = \frac{\alpha f_a/w_a + \beta f_b/w_b + \gamma f_c/w_c}{\alpha/w_a + \beta/w_b + \gamma/w_c}`, 'perspective-correct interpolation'],
  ],
  'track-c/lesson-06.html': [
    [R`I = k_a + k_d\,(\mathbf{n}\cdot\mathbf{l}) + k_s\,(\mathbf{r}\cdot\mathbf{v})^{\alpha}`, 'Phong — ambient + diffuse + specular'],
    [R`f_r = \frac{D\,F\,G}{4\,(\mathbf{n}\cdot\mathbf{l})(\mathbf{n}\cdot\mathbf{v})}`, 'Cook-Torrance microfacet specular BRDF'],
    [R`D_{\text{GGX}} = \frac{\alpha^{2}}{\pi\big((\mathbf{n}\cdot\mathbf{h})^{2}(\alpha^{2}-1)+1\big)^{2}}`, 'GGX normal-distribution function'],
  ],
  'track-c/lesson-09.html': [
    [R`\mathbf{r}(t) = \mathbf{o} + t\,\mathbf{d}, \qquad t > 0`, 'a ray: origin plus direction'],
    [R`\lVert\, \mathbf{o} + t\,\mathbf{d} - \mathbf{c}\, \rVert^{2} = R^{2}`, 'ray-sphere intersection'],
    [R`L_o = L_e + \int_{\Omega} f_r\,L_i\,(\mathbf{n}\cdot\boldsymbol{\omega}_i)\,d\omega_i`, 'the rendering equation'],
  ],
};

let changed = 0;
for (const rel of Object.keys(EQ)) {
  const fp = path.join(ROOT, rel);
  if (!fs.existsSync(fp)) { console.log('MISSING', rel); continue; }
  let html = fs.readFileSync(fp, 'utf8');
  if (html.indexOf('class="gm-eq"') >= 0) continue;   // idempotent
  const rows = EQ[rel].map(([tex, cap]) =>
    '  <div class="gm-eq-row">\\[ ' + tex + ' \\]<span class="gm-eq-cap">' + cap + '</span></div>').join('\n');
  const panel = '\n<div class="gm-eq"><div class="gm-eq-h">Key equations</div>\n' + rows + '\n</div>';
  const m = html.match(/<p class="lead">[\s\S]*?<\/p>/);
  if (!m) { console.log('NO LEAD in', rel); continue; }
  html = html.replace(m[0], m[0] + panel);
  fs.writeFileSync(fp, html);
  changed++;
}
console.log('equation panels inserted into', changed, 'lessons');

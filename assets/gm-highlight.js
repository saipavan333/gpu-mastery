/* GPU Mastery — compact, dependency-free syntax highlighter for <pre><code>.
   No language class needed: a universal lexer for C/CUDA/C++, Python, GLSL, and
   bash. Operates on the block's text (escape-safe, round-trip preserving), wraps
   tokens in namespaced .gm-hl spans, and is idempotent. Exposes hl() for tests. */
(function () {
  "use strict";

  var KW = wordset("if else for while do return break continue switch case default goto sizeof typedef struct union enum const constexpr static extern volatile inline register void __global__ __device__ __host__ __shared__ __constant__ __restrict__ class public private protected virtual override template typename namespace using new delete this operator try catch throw nullptr def lambda import from as with pass yield global nonlocal assert del elif except finally raise in is not and or with async await uniform attribute varying layout precision discard then fi done esac function local export echo");
  var TY = wordset("int float double char bool long short unsigned signed size_t void auto int8_t int16_t int32_t int64_t uint8_t uint16_t uint32_t uint64_t half float2 float3 float4 double2 int2 int3 int4 uint dim3 vec2 vec3 vec4 ivec2 ivec3 ivec4 mat2 mat3 mat4 sampler2D sampler3D str bytes list dict tuple set frozenset object True False None");
  var BI = wordset("printf malloc free memcpy memset cudaMalloc cudaMemcpy cudaFree cudaMemset cudaDeviceSynchronize __syncthreads __syncwarp atomicAdd threadIdx blockIdx blockDim gridDim print range len enumerate zip map filter sum min max abs round int float open np numpy torch tensor gl_Position gl_FragCoord texture normalize dot cross length mix clamp");

  function wordset(s) { var o = {}; s.split(/\s+/).forEach(function (w) { o[w] = 1; }); return o; }
  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function span(cls, txt) { return '<span class="gm-hl-' + cls + '">' + esc(txt) + "</span>"; }

  // one-pass lexer; each alternative is a token class (comments/strings/numbers consume their body)
  var RE = new RegExp([
    "(#\\s*(?:include|define|ifndef|ifdef|endif|pragma|undef|elif|if|else|line|error)\\b[^\\n]*)", // 1 preprocessor
    "(//[^\\n]*|/\\*[\\s\\S]*?\\*/|#[^\\n]*)",                                                      // 2 comment
    "(\"(?:\\\\.|[^\"\\\\])*\"|'(?:\\\\.|[^'\\\\])*'|`(?:\\\\.|[^`\\\\])*`)",                        // 3 string
    "(\\b(?:0[xX][0-9a-fA-F]+|\\d+\\.?\\d*(?:[eE][+-]?\\d+)?)[fFuUlL]*\\b)",                          // 4 number
    "([A-Za-z_]\\w*)",                                                                                // 5 identifier
    "([\\s\\S])"                                                                                      // 6 other (single char)
  ].join("|"), "g");

  function hl(code) {
    var out = "", m;
    RE.lastIndex = 0;
    while ((m = RE.exec(code)) !== null) {
      if (m[1] != null) out += span("p", m[1]);
      else if (m[2] != null) out += span("c", m[2]);
      else if (m[3] != null) out += span("s", m[3]);
      else if (m[4] != null) out += span("n", m[4]);
      else if (m[5] != null) {
        var w = m[5];
        if (KW[w]) out += span("k", w);
        else if (TY[w]) out += span("t", w);
        else if (BI[w]) out += span("b", w);
        else out += esc(w);
      } else out += esc(m[6]);
      if (RE.lastIndex === m.index) RE.lastIndex++;   // safety against zero-width
    }
    return out;
  }

  if (typeof window !== "undefined") window.GMHighlight = { hl: hl };
  if (typeof document === "undefined") return;

  function run() {
    var blocks = document.querySelectorAll("pre > code, pre code");
    for (var i = 0; i < blocks.length; i++) {
      var el = blocks[i];
      if (el.getAttribute("data-hl") || el.children.length) continue;   // skip processed / structured blocks
      var text = el.textContent;
      if (!text || !text.trim()) continue;
      el.innerHTML = hl(text);
      el.setAttribute("data-hl", "1");
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
})();

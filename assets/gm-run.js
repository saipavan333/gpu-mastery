/* GPU Mastery — in-browser runnable Python (Pyodide) + auto-grader.
   Runs only on Module 2 (Python) lessons — CUDA can't run in a browser.
   Turns Python code blocks into editable, runnable cells with an output panel,
   lazy-loads a SHARED Pyodide runtime once, and grades exercises marked
   .gm-lab[data-check] via a sentinel-JSON harness. Graceful fallback if the
   runtime can't load (offline/file://). Namespaced .gm-run. */
(function () {
  "use strict";
  if (typeof document === "undefined") return;
  if (window.__gmRunLoaded) return; window.__gmRunLoaded = true;

  var VER = "v0.26.4";
  var BASE = "https://cdn.jsdelivr.net/pyodide/" + VER + "/full/";
  var _py = null;

  function getPyodide(onStatus) {
    if (_py) return _py;
    _py = new Promise(function (resolve, reject) {
      var s = document.createElement("script"); s.src = BASE + "pyodide.js";
      s.onload = function () {
        if (!window.loadPyodide) { reject(new Error("Pyodide unavailable")); return; }
        onStatus && onStatus("Starting Python…");
        window.loadPyodide({ indexURL: BASE }).then(resolve, reject);
      };
      s.onerror = function () { reject(new Error("Couldn't download the Python runtime (needs internet the first time).")); };
      document.head.appendChild(s);
    });
    return _py;
  }

  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  var loadedNumpy = false;

  async function runCode(code, outEl, statusCb) {
    outEl.className = "gm-run-out"; outEl.textContent = "";
    var buf = [];
    var py;
    try { py = await getPyodide(statusCb); }
    catch (e) { outEl.classList.add("err"); outEl.textContent = "⚠ " + e.message; return { ok: false }; }
    try {
      if (!loadedNumpy && /\b(numpy|np)\b/.test(code)) { statusCb && statusCb("Loading numpy…"); await py.loadPackage("numpy"); loadedNumpy = true; }
      py.setStdout({ batched: function (s) { buf.push(s); } });
      py.setStderr({ batched: function (s) { buf.push(s); } });
      var ret = await py.runPythonAsync(code);
      if (ret !== undefined && ret !== null) buf.push(String(ret));
      outEl.textContent = buf.join("") || "✓ ran (no output)";
      return { ok: true, out: buf.join("") };
    } catch (e) {
      outEl.classList.add("err");
      outEl.textContent = (buf.join("") ? buf.join("") + "\n" : "") + String(e.message || e).split("\n").slice(-6).join("\n");
      return { ok: false };
    }
  }

  // Auto-grader: run user code, then the check asserts; the harness prints a sentinel JSON verdict.
  var HARNESS = "\nimport json as _json\n_gmx=[]\ndef _check(name, cond):\n    _gmx.append([name, bool(cond)])\n";
  async function gradeCode(userCode, checkCode, outEl, statusCb) {
    var full = userCode + "\n" + HARNESS + checkCode + "\nprint('@@GMX@@'+_json.dumps(_gmx))\n";
    var buf = [];
    var py;
    try { py = await getPyodide(statusCb); }
    catch (e) { outEl.className = "gm-run-out err"; outEl.textContent = "⚠ " + e.message; return; }
    try {
      if (!loadedNumpy && /\b(numpy|np)\b/.test(full)) { statusCb && statusCb("Loading numpy…"); await py.loadPackage("numpy"); loadedNumpy = true; }
      py.setStdout({ batched: function (s) { buf.push(s); } });
      py.setStderr({ batched: function (s) { buf.push(s); } });
      await py.runPythonAsync(full);
    } catch (e) {
      outEl.className = "gm-run-out err";
      outEl.textContent = (buf.join("") || "") + "\n" + String(e.message || e).split("\n").slice(-6).join("\n");
      return;
    }
    var text = buf.join(""), verdict = [];
    var m = text.match(/@@GMX@@(\[.*\])/);
    var printed = text.replace(/@@GMX@@\[.*\]\s*$/, "").trim();
    try { verdict = JSON.parse(m[1]); } catch (e) {}
    var passed = verdict.filter(function (v) { return v[1]; }).length, total = verdict.length;
    var rows = verdict.map(function (v) { return '<div class="gm-run-case ' + (v[1] ? "ok" : "no") + '">' + (v[1] ? "✓" : "✗") + " " + esc(v[0]) + "</div>"; }).join("");
    outEl.className = "gm-run-out grade " + (total && passed === total ? "allok" : "some");
    outEl.innerHTML = (printed ? '<div class="gm-run-print">' + esc(printed) + "</div>" : "") +
      '<div class="gm-run-verdict">' + (total ? passed + " / " + total + " checks passed" : "No checks ran") + "</div>" + rows;
  }
  function esc(s) { var d = document.createElement("div"); d.textContent = s == null ? "" : String(s); return d.innerHTML; }

  function makeCell(pre, code, checkCode) {
    if (pre.getAttribute("data-run")) return; pre.setAttribute("data-run", "1");
    var bar = el("div", "gm-run-bar");
    var runBtn = el("button", "gm-run-btn", "▶ Run");
    var editBtn = el("button", "gm-run-edit", "✎ Edit");
    var status = el("span", "gm-run-status", "");
    bar.appendChild(runBtn); if (checkCode) { var g = el("button", "gm-run-grade-btn", "✓ Check"); bar.appendChild(g); } bar.appendChild(editBtn); bar.appendChild(status);
    var out = el("div", "gm-run-out"); out.style.display = "none";
    pre.parentNode.insertBefore(bar, pre.nextSibling);
    pre.parentNode.insertBefore(out, bar.nextSibling);

    var ta = null;
    function current() { return ta ? ta.value : code; }
    function busy(b, label) { runBtn.disabled = b; status.textContent = b ? (label || "Running…") : ""; }
    function showOut() { out.style.display = "block"; }
    runBtn.addEventListener("click", async function () { showOut(); busy(true); await runCode(current(), out, function (s) { status.textContent = s; }); busy(false); });
    editBtn.addEventListener("click", function () {
      if (ta) return;
      ta = el("textarea", "gm-run-ta"); ta.value = code; ta.rows = Math.min(20, code.split("\n").length + 1);
      ta.setAttribute("aria-label", "Editable code"); ta.spellcheck = false;
      pre.style.display = "none"; pre.parentNode.insertBefore(ta, pre.nextSibling); ta.focus();
      editBtn.textContent = "↺ Reset";
      editBtn.onclick = function () { ta.value = code; };
    });
    if (checkCode) {
      bar.querySelector(".gm-run-grade-btn").addEventListener("click", async function () { showOut(); busy(true, "Checking…"); await gradeCode(current(), checkCode, out, function (s) { status.textContent = s; }); busy(false); });
    }
  }

  function boot() {
    if (!/\/module-2\/lesson-\d/.test(location.pathname)) return;   // Python module only
    var main = document.getElementById("gm-main") || document.querySelector(".wrap"); if (!main) return;
    // graded labs: <div class="gm-lab" data-check="..."><pre><code>starter</code></pre></div>
    [].forEach.call(main.querySelectorAll(".gm-lab[data-check]"), function (lab) {
      var pre = lab.querySelector("pre"), code = lab.querySelector("code");
      if (pre && code) makeCell(pre, code.textContent, lab.getAttribute("data-check"));
    });
    // plain runnable python blocks
    [].forEach.call(main.querySelectorAll("pre > code"), function (code) {
      if (code.closest(".gm-lab")) return;
      var t = code.textContent || "";
      if (!/\bprint\s*\(|\bimport\b|\bdef\b|\bnp\./.test(t)) return;   // looks like Python
      if (/#include|__global__|std::|int main|cudaMalloc/.test(t)) return;   // not C/CUDA
      if (t.length > 4000) return;
      makeCell(code.parentNode, t, null);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();

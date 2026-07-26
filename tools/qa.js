#!/usr/bin/env node
/* GPU Mastery — living QA regression suite (playbook §7.1). Run before every push. */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
function pages() {
  let out = [];
  for (const d of ['.', 'module-1','module-2','module-3','module-4','module-5','track-a','track-b','track-c','track-d'])
    for (const f of fs.readdirSync(path.join(ROOT,d))) if (f.endsWith('.html')) out.push(path.join(d===''?'.':d, f).replace('./',''));
  return out;
}
const read = f => fs.readFileSync(path.join(ROOT,f),'utf8').replace(/\0/g,'');
let FAIL = 0; const bad = (t,items)=>{ if(items.length){ FAIL+=items.length; console.log(`✗ ${t}: ${items.length}`); items.slice(0,12).forEach(x=>console.log('   '+x)); } else console.log(`✓ ${t}`); };

// 1) broken internal links (case-sensitive)
(function(){ let b=[]; for(const f of pages()){ const dir=path.dirname(f), s=read(f).replace(/<(script|style)[\s\S]*?<\/\1>/g,'');
  for(const m of s.matchAll(/(?:href|src)="([^"#?]+)"/g)){ let t=m[1]; if(/^(https?:|mailto:|data:|\/\/|#)/.test(t))continue; t=t.split(/[#?]/)[0]; if(!t)continue;
    if(!fs.existsSync(path.join(ROOT,dir,t))) b.push(`${f} -> ${t}`); } } bad('broken links', b); })();

// 2) per-text-node math-$ collision scan (§5.1): after stripping code/pre/script/style + gm-nomath, no bare $ in prose
(function(){ let b=[]; for(const f of pages()){ let s=read(f)
    .replace(/<(pre|code|script|style|textarea)[\s\S]*?<\/\1>/g,'')
    .replace(/<span class="gm-nomath">[\s\S]*?<\/span>/g,'');
  for(const node of s.replace(/<[^>]+>/g,'\n').split('\n')){ const dd=(node.match(/\$\$/g)||[]).length; if(dd%2!==0) b.push(`${f}: unpaired $$ in "${node.trim().slice(0,50)}"`); } }
  bad('unpaired $$ display-math (per-text-node)', b); })();

// 3) locale scan — American English (§5.4)
(function(){ const brit=/\b(optimis(e|ed|ing|ation)|colour|behaviour|centre|labelled|modelled|minimis|maximis|analys(e|ed|ing)|catalogue|licence|defence|organis(e|ed|ing)|realis(e|ed|ing)|initialis|normalis|visualis|generalis|parallelis|favourite|honour|grey|fibre|litre|artefact|aluminium)\b/gi;
  let b=[]; for(const f of pages()){ const s=read(f).replace(/<(script|style|pre|code)[\s\S]*?<\/\1>/g,''); const seen=new Set();
    for(const m of s.matchAll(brit)){ const w=m[0].toLowerCase(); if(!seen.has(w)){ seen.add(w); b.push(`${f}: "${m[0]}"`);} } } bad('British spellings', b); })();

// 4) inline-script syntax check (parse, don't run)
(function(){ let b=[]; for(const f of pages()){ const s=read(f);
  for(const m of s.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)){ const code=m[1]; if(!code.trim())continue;
    try{ new Function(code); }catch(e){ b.push(`${f}: ${e.message.split('\n')[0]}`); } } } bad('inline-script syntax errors', b); })();

// 5) structure — closes properly, div-balanced
(function(){ let b=[]; for(const f of pages()){ const s=read(f);
  if(!s.includes('</html>')) b.push(`${f}: no </html>`);
  let d=0; for(const t of s.match(/<\/?div\b/g)||[]) d+=t==='<div'?1:-1; if(d!==0) b.push(`${f}: div imbalance ${d}`);
} bad('structure (close tag / div balance)', b); })();

// 6) external asset references resolve (favicon, katex, gm-site)
(function(){ let b=[]; for(const f of ['index.html','module-5/lesson-07.html','lab-roofline.html']){ }
  for(const a of ['assets/gm-site.js','assets/gm-site.css','assets/gm-motion.js','assets/gm-motion.css','assets/gm-search.js','assets/gm-search.css','assets/search-data.js',
      'assets/gm-glossary.js','assets/gm-glossary-data.js','assets/gm-review.js','assets/review-data.js',
      'assets/gm-assistant.js','assets/gm-assistant.css','assets/assistant-config.js','worker/assistant-proxy.js',
      'assets/gm-interview-data.js','assets/gm-lessonmeta-data.js','assets/gm-exam.js','assets/gm-exam.css','assets/exam-data.js',
      'assets/katex/katex.min.js','assets/katex/contrib/auto-render.min.js','assets/img/favicon.svg','assets/img/favicon-32.png','assets/img/favicon.ico','assets/img/og.png','assets/img/icon-192.png','assets/img/icon-512.png','assets/img/icon-maskable-512.png','assets/img/favicon-180.png','sitemap.xml','robots.txt','manifest.webmanifest','sw.js'])
    if(!fs.existsSync(path.join(ROOT,a))) b.push('missing '+a); bad('platform assets present', b); })();

(function(){ let b=[]; try{ global.window={}; require('../assets/search-data.js'); } catch(e){}
  try{ delete require.cache[require.resolve('../assets/gm-glossary-data.js')]; global.window={}; require('../assets/gm-glossary-data.js');
    (global.window.GM_GLOSSARY||[]).forEach(function(g){ if(g.s && !fs.existsSync(path.join(ROOT,g.s))) b.push('glossary "'+g.t+'" -> '+g.s); });
  }catch(e){ b.push('glossary data load: '+e.message); }
  try{ delete require.cache[require.resolve('../assets/gm-interview-data.js')]; global.window={}; require('../assets/gm-interview-data.js');
    (global.window.GM_INTERVIEW||[]).forEach(function(q){ if(q.url && !fs.existsSync(path.join(ROOT,q.url))) b.push('interview '+q.id+' -> '+q.url); });
  }catch(e){ b.push('interview data load: '+e.message); }
  bad('glossary + interview links resolve', b); })();

console.log('\n' + (FAIL? `QA: ${FAIL} issue(s) — NOT clean` : 'QA: ALL CLEAN ✓'));
process.exit(FAIL?1:0);

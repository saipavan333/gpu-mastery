#!/usr/bin/env node
/* Build the shared content index (search + assistant). Emits assets/search-data.js. */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const strip = h => h.replace(/<[^>]+>/g,' ')
  .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&middot;/g,'·')
  .replace(/&hellip;/g,'…').replace(/&mdash;/g,'—').replace(/&ndash;/g,'–').replace(/&nbsp;/g,' ')
  .replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&[a-z]+;/g,' ').replace(/\s+/g,' ').trim();
const first = (s,re) => { const m = s.match(re); return m ? strip(m[1]) : ''; };

function kindOf(f){
  if (f.startsWith('module-')) return { k:'core', label:'Core' };
  if (f.startsWith('track-a')) return { k:'track-a', label:'Track A · ML/AI Infra' };
  if (f.startsWith('track-b')) return { k:'track-b', label:'Track B · HPC' };
  if (f.startsWith('track-c')) return { k:'track-c', label:'Track C · Graphics' };
  if (f.startsWith('track-d')) return { k:'track-d', label:'Track D · Portable' };
  if (/^lab-|^labs\.html|lab-webgpu/.test(f)) return { k:'lab', label:'Interactive Lab' };
  return { k:'hub', label:'Hub' };
}
let pages = [];
for (const d of ['.', 'module-0','module-1','module-2','module-3','module-4','module-5','track-a','track-b','track-c','track-d'])
  for (const f of fs.readdirSync(path.join(ROOT,d))) if (f.endsWith('.html')) pages.push(d==='.'?f:d+'/'+f);

const index = [];
for (const f of pages) {
  const s = fs.readFileSync(path.join(ROOT,f),'utf8').replace(/\0/g,'');
  if (/lesson-\d+\.html/.test(f) || true) {}
  const title = first(s,/<title>([\s\S]*?)<\/title>/).replace(/\s*[—-]\s*GPU Mastery.*$/,'').trim() || first(s,/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const h1 = first(s,/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const lead = first(s,/<p class="lead"[^>]*>([\s\S]*?)<\/p>/) || first(s,/<p[^>]*>([\s\S]*?)<\/p>/);
  const badge = first(s,/<span class="badge"[^>]*>([\s\S]*?)<\/span>/);
  const heads = [...s.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/g)].map(m=>strip(m[1])).filter(x=>x && x.length<80);
  const dl = first(s,/data-lesson="([^"]+)"/);
  const ki = kindOf(f);
  const num = (badge.match(/(?:Module|Track)\s+\w+\s*·\s*Lesson\s*\d+|Lesson\s*\d+|Capstone/i)||[''])[0] || dl;
  index.push({
    url: f, kind: ki.k, group: ki.label,
    title: title || h1 || f, num: num.replace(/\s+/g,' ').trim(),
    heads: heads.slice(0, 14),
    summary: lead.slice(0, 320),
    // compact searchable blob (lowercased): title + heads + summary
    text: (title + ' ' + h1 + ' ' + heads.join(' ') + ' ' + lead).toLowerCase().slice(0, 1400)
  });
}
const out = 'window.GM_INDEX = ' + JSON.stringify(index) + ';\n';
fs.writeFileSync(path.join(ROOT,'assets/search-data.js'), out);
console.log('indexed', index.length, 'pages ->', (out.length/1024).toFixed(1), 'KB');
console.log('sample:', JSON.stringify(index.find(x=>x.url.includes('track-c/lesson-01')), null, 0).slice(0,300));

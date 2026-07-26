#!/usr/bin/env node
/* Inject SEO/OpenGraph/Twitter meta + canonical into every page (idempotent),
   and generate sitemap.xml + robots.txt. Re-runnable: the injected block is
   fenced by <!-- gm-seo:start/end --> and replaced in place.
   Run: node tools/build-seo.js */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const BASE = 'https://saipavan333.github.io/gpu-mastery/';
const SITE = 'GPU Mastery';
const OG_IMG = BASE + 'assets/img/og.png';

function walk(dir, out) {
  for (const name of fs.readdirSync(dir)) {
    const fp = path.join(dir, name); const st = fs.statSync(fp);
    if (st.isDirectory()) { if (['assets','tools','.git','node_modules','worker'].includes(name)) continue; walk(fp, out); }
    else if (name.endsWith('.html')) out.push(fp);
  }
  return out;
}
function attr(s){ return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function textOf(h){ return String(h).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim(); }
function clip(s,n){ s=(s||'').trim(); return s.length>n ? s.slice(0,n).replace(/\s+\S*$/,'')+'…' : s; }

const pages = walk(ROOT, []).sort();
let changed = 0;
const urls = [];

for (const f of pages) {
  let rel = path.relative(ROOT, f).split(path.sep).join('/');
  const raw = fs.readFileSync(f, 'utf8');
  // strip any previously-injected block FIRST, so detection reflects the page's
  // own <head> (not a description we injected on a prior run) — keeps this idempotent
  const html = raw.replace(/\s*<!-- gm-seo:start -->[\s\S]*?<!-- gm-seo:end -->/, '');
  const loc = rel === 'index.html' ? BASE : BASE + rel;
  urls.push(loc);

  const title = textOf((html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || SITE);
  const hasDesc = /<meta\s+name=["']description["']/i.test(html);
  let desc = (html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) || [])[1];
  if (!desc) {
    const lead = (html.match(/<p class="lead">([\s\S]*?)<\/p>/i) || [])[1]
              || (html.match(/<p>([\s\S]*?)<\/p>/i) || [])[1] || '';
    desc = clip(textOf(lead), 158) || (title + ' — part of the GPU Mastery course, from electrons to tensor cores.');
  }
  const type = /lesson-/.test(rel) ? 'article' : 'website';

  const lines = ['<!-- gm-seo:start -->',
    '<link rel="canonical" href="' + attr(loc) + '">',
    '<link rel="manifest" href="' + BASE + 'manifest.webmanifest">',
    '<meta name="theme-color" content="#0b0e14">',
    '<link rel="apple-touch-icon" href="' + BASE + 'assets/img/favicon-180.png">'];
  if (!hasDesc) lines.push('<meta name="description" content="' + attr(clip(desc, 158)) + '">');
  lines.push(
    '<meta property="og:type" content="' + type + '">',
    '<meta property="og:site_name" content="' + SITE + '">',
    '<meta property="og:title" content="' + attr(title) + '">',
    '<meta property="og:description" content="' + attr(clip(desc, 200)) + '">',
    '<meta property="og:url" content="' + attr(loc) + '">',
    '<meta property="og:image" content="' + OG_IMG + '">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:title" content="' + attr(title) + '">',
    '<meta name="twitter:description" content="' + attr(clip(desc, 200)) + '">',
    '<meta name="twitter:image" content="' + OG_IMG + '">',
    '<!-- gm-seo:end -->');
  const block = lines.join('\n');

  const next = html.replace(/<\/head>/i, block + '\n</head>');
  if (next !== raw) { fs.writeFileSync(f, next); changed++; }
}

// sitemap.xml
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map(u => '  <url><loc>' + u + '</loc></url>').join('\n') + '\n</urlset>\n';
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);

// robots.txt
fs.writeFileSync(path.join(ROOT, 'robots.txt'),
  'User-agent: *\nAllow: /\n\nSitemap: ' + BASE + 'sitemap.xml\n');

console.log('SEO injected into', changed, 'of', pages.length, 'pages');
console.log('sitemap.xml:', urls.length, 'urls · robots.txt written');

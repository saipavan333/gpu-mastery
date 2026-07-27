/* GPU Mastery — service worker for offline / installable use.
   Precache the shell, stale-while-revalidate for assets, network-first for pages.
   Bump CACHE when shipping new content so clients refresh. */
'use strict';
var CACHE = 'gpu-mastery-v3';   /* bump on any asset change so clients refresh past the cache */

/* Core shell — kept resilient: a single 404 won't fail the whole install. */
var SHELL = [
  './', 'index.html', 'curriculum.html', 'setup.html', 'labs.html',
  'glossary.html', 'search.html', 'review.html', 'interview.html', 'exam.html', 'cheatsheet.html', 'concept-map.html',
  'assets/style.css', 'assets/app.js',
  'assets/gm-readaloud.js', 'assets/gm-highlight.js', 'assets/gm-run.js', 'assets/gm-lessonmeta-data.js',
  'assets/gm-site.js', 'assets/gm-site.css', 'assets/gm-motion.js', 'assets/gm-motion.css',
  'assets/gm-search.js', 'assets/gm-search.css', 'assets/search-data.js',
  'assets/gm-glossary.js', 'assets/gm-glossary.css', 'assets/gm-glossary-data.js',
  'assets/gm-assistant.js', 'assets/gm-assistant.css', 'assets/assistant-config.js',
  'assets/img/favicon.svg', 'assets/img/icon-192.png', 'assets/img/icon-512.png',
  'manifest.webmanifest'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return Promise.all(SHELL.map(function (u) { return c.add(u).catch(function () {}); }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url;
  try { url = new URL(req.url); } catch (_) { return; }
  if (url.origin !== self.location.origin) return;   // don't touch cross-origin (e.g. the AI Worker)

  // HTML navigations: network-first (fresh content), fall back to cache, then to home
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').indexOf('text/html') >= 0) {
    e.respondWith(
      fetch(req).then(function (r) {
        var cp = r.clone(); caches.open(CACHE).then(function (c) { c.put(req, cp); });
        return r;
      }).catch(function () {
        return caches.match(req).then(function (m) { return m || caches.match('index.html'); });
      })
    );
    return;
  }

  // Same-origin assets: stale-while-revalidate
  e.respondWith(
    caches.match(req).then(function (cached) {
      var net = fetch(req).then(function (r) {
        if (r && r.status === 200 && r.type === 'basic') {
          var cp = r.clone(); caches.open(CACHE).then(function (c) { c.put(req, cp); });
        }
        return r;
      }).catch(function () { return cached; });
      return cached || net;
    })
  );
});

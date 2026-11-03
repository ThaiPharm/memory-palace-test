// Cache-first app shell; network fills cache on first visit.
const CACHE = 'palace-v14';
const ASSETS = ["./assets/pdf.worker.min-yatZIOMy.mjs","./assets/index-alcwdb93.css","./assets/index-Db41beru.js","./assets/view3d-Czt4U-HD.js","./assets/maker3d-BptiJTIq.js","./assets/xr-DPLhMM34.js","./assets/three.module-DaJnxDS_.js","./assets/pdf-BnPRJEQ6.js","./assets/pdf.worker.min-DgRcL-GR.js","./assets/index-CvSeWqE7.js","./assets/post-BBtaSTw7.js","./index.html"]; // filled at build time (vite.config.ts)
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll([...new Set(['./', './index.html', './manifest.webmanifest', './icon.svg', './scan-sample.svg', ...ASSETS])]))); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(caches.match(e.request, { ignoreVary: true }).then(hit => hit || fetch(e.request).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return res;
  }).catch(() => caches.match('./index.html'))));
});

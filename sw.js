// Cache-first hashed assets; network-first HTML so a deploy is picked up.
// Never fall back to index.html for missing JS/CSS (that used to break 3D after an update).
const CACHE = 'palace-v27';
const ASSETS = ["./assets/pdf.worker.min-yatZIOMy.mjs","./assets/index-BJ1OsXm4.css","./assets/index-Bopk1UeF.js","./assets/view3d-DQ_KhRRH.js","./assets/maker3d-ePvAFf5N.js","./assets/xr-Co3QO5O0.js","./assets/three.module-C5SW4t2S.js","./assets/pdf-BnPRJEQ6.js","./assets/pdf.worker.min-DgRcL-GR.js","./assets/index-CvSeWqE7.js","./assets/post-BGl-exU4.js","./index.html"]; // filled at build time (vite.config.ts)

function isNavigation(req) {
  if (req.mode === 'navigate' || req.destination === 'document') return true;
  try { const path = new URL(req.url).pathname; return path.endsWith('/') || path.endsWith('.html'); }
  catch { return false; }
}

self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll([...new Set(['./', './index.html', './manifest.webmanifest', './icon.svg', './scan-sample.svg', './samples/scan-two-rooms.obj', './samples/roomplan-room.usdz', './samples/walk-through.mp4', ...ASSETS])]))); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  if (isNavigation(e.request)) {
    e.respondWith(fetch(e.request).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => { c.put(e.request, copy); c.put('./index.html', copy.clone()); }); }
      return res;
    }).catch(() => caches.match(e.request).then(hit => hit || caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(e.request, { ignoreVary: true }).then(hit => hit || fetch(e.request).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return res;
  }).catch(() => new Response('Offline', { status: 503, statusText: 'Offline' }))));
});

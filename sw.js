// Offline-Speicher der App. Bei jeder neuen Version VERSION erhöhen,
// dann laden alle Geräte die neuen Dateien beim nächsten Öffnen.
const VERSION = "2026-10-27-1";
const CACHE = "trainingsplan-" + VERSION;
const FILES = [
  "./", "index.html", "config.js", "manifest.webmanifest",
  "vendor/supabase.js", "vendor/xlsx.full.min.js",
  "fonts/lato-300.woff2", "fonts/lato-400.woff2", "fonts/lato-700.woff2", "fonts/lato-900-italic.woff2",
  "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith("trainingsplan-") && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Seite und config.js: zuerst aus dem Netz (damit Änderungen sofort ankommen), offline aus dem Speicher.
// Alles andere: aus dem Speicher, sonst aus dem Netz.
// Anfragen an Supabase laufen nie über diesen Speicher.
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  const fresh = req.mode === "navigate" || url.pathname.endsWith("/config.js") || url.pathname.endsWith("/index.html");
  if (fresh){
    e.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 4000);
        const res = await fetch(req, { signal: ctrl.signal }); clearTimeout(t);
        if (res.ok) cache.put(req.mode === "navigate" ? "index.html" : req, res.clone());
        return res;
      } catch(err){
        return (await cache.match(req.mode === "navigate" ? "index.html" : req)) || (await cache.match("index.html")) || Response.error();
      }
    })());
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok){ const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  })));
});

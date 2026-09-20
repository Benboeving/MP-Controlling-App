const CACHE_NAME = 'mp-controlling-neu-v17';
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./service-worker.js"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(c => c.put("./index.html", copy));
      return response;
    }).catch(() => caches.match("./index.html")));
  } else {
    event.respondWith(fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(c => c.put(event.request, copy));
      return response;
    }).catch(() => caches.match(event.request)));
  }
});

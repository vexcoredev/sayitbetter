// Offline shell for the Say It Better web app. Bump VERSION when shipping changes.
const VERSION = "limaret-app-v5"; // "limaret-" prefix predates the rename; kept so old caches are cleaned up
const SHELL = ["./", "index.html", "app.css", "app.js", "manifest.webmanifest", "icons/icon-180.png", "icons/icon-192.png", "../assets/logo.svg"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k.startsWith("limaret-app-") && k !== VERSION).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Same-origin files: serve from cache, refresh in the background. AI calls and model downloads go straight to the network.
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(caches.open(VERSION).then(async (cache) => {
    const cached = await cache.match(e.request, { ignoreSearch: true });
    const network = fetch(e.request).then((res) => {
      if (res.ok) cache.put(e.request, res.clone());
      return res;
    }).catch(() => cached);
    return cached || network;
  }));
});

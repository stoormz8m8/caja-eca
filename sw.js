// Guarda la app en el celular para que abra rápido; los datos siempre vienen de la hoja.
const CACHE = "caja-eca-v2";
const ARCHIVOS = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png",
  "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.hostname.includes("script.google")) return;
  // Primero la red (para recibir mejoras), si no hay internet se usa la copia guardada.
  e.respondWith(fetch(e.request).then(r => { const copia = r.clone(); if (r.ok) caches.open(CACHE).then(c => c.put(e.request, copia)); return r; })
    .catch(() => caches.match(e.request, {ignoreSearch: true})));
});

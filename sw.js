// Service Worker — Kiniela Mundial 2026
// Solo cachea el shell estático; las llamadas a Supabase van siempre a la red.

const CACHE_NAME = 'kiniela-v2';
const SHELL = [
  './index.html',
  './style.css',
  './app.js',
  './favicon.JPG',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Supabase y CDN siempre van a la red
  if (e.request.url.includes('supabase') || e.request.url.includes('jsdelivr')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

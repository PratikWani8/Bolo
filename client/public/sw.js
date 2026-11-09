// BOLO Service Worker for Offline & Low-Connectivity Resilience
const CACHE_NAME = 'bolo-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Offline fallback for schemes & FAQs
const OFFLINE_SCHEME_CACHE = 'bolo-schemes-offline-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== OFFLINE_SCHEME_CACHE) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Cache API requests for schemes, FAQs, helplines using stale-while-revalidate strategy
  if (url.pathname.includes('/api/schemes') || url.pathname.includes('/api/helplines')) {
    event.respondWith(
      caches.open(OFFLINE_SCHEME_CACHE).then((cache) => {
        return fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            return cache.match(event.request).then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              return new Response(
                JSON.stringify({
                  success: true,
                  isOfflineCached: true,
                  message: 'Viewing offline cached schemes. Reconnect for real-time verification.',
                  schemes: [],
                }),
                { headers: { 'Content-Type': 'application/json' } }
              );
            });
          });
      })
    );
    return;
  }

  // General network first with cache fallback
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((res) => {
        if (res) return res;
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/index.html');
        }
      });
    })
  );
});

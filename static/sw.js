const CACHE_NAME = 'clientside-cache-v1';
const PRECACHE_URLS = [
  '/',
  '/favicon.svg',
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Try network first for navigation requests, fallback to cache.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
            .catch(() => caches.match(event.request).then((r) => r || caches.match('/')))
    );
    return;
  }

  // For other requests, use cache-first
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((resp) => {
          // Only cache successful GET requests
          if (!resp || resp.status !== 200 || event.request.method !== 'GET') return resp;
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resp.clone()));
          return resp;
        })
        .catch(() => {})
    })
  );
});

// Handle push events (display notifications when push arrives)
self.addEventListener('push', (event) => {
  let payload = {};
  try {
    if (event.data) payload = event.data.json();
  } catch {
    try {
      payload = { body: event.data.text() };
    } catch {
      payload = { body: '' };
    }
  }

  const title = payload.title || 'Notification';
  const options = {
    body: payload.body || '',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    data: payload.data || {}
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data && event.notification.data.url;
  if (url) {
    event.waitUntil(clients.openWindow(url));
  }
});


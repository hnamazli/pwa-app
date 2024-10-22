const CACHE_NAME = 'react-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    // caches.open(CACHE_NAME)
    //   .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/logo192.png',
    badge: '/favicon.ico'
  };

  event.waitUntil(
    self.registration.showNotification('React PWA Notification', options)
  );
});
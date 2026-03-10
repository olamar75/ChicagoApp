// Service Worker for Chicago App
const CACHE_NAME = 'chicago-app-v9';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './icon-192.png',
  './icon-512.png'
];

// Install event - activate immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Fetch event - network first for app files, cache first for images
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isAppFile = url.pathname.endsWith('.html') || 
                    url.pathname.endsWith('.css') || 
                    url.pathname.endsWith('.js') ||
                    url.pathname === '/' || 
                    url.pathname === './';
  
  if (isAppFile) {
    // Network first for app files to ensure fresh content
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // Cache first for images and other assets
    event.respondWith(
      caches.match(event.request)
        .then((response) => response || fetch(event.request))
    );
  }
});

// Activate event - take control immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

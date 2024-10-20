// Define a cache name
const CACHE_NAME = 'my-cache-v1';
const urlsToCache = [
    '/',                // Cache the root page
    '/index.html',      // Main HTML
    '/src/styles.css',  // Main CSS
    '/src/script.js',   // Main JavaScript
    // Add other essential assets here
];

// Install event: Cache specified URLs
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Service Worker: Caching files');
            return cache.addAll(urlsToCache);
        })
    );
});

// Activate event: Clean up old caches if necessary
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Removing old cache', cache);
                        return caches.delete(cache); // Delete old cache
                    }
                })
            );
        })
    );
});

// Fetch event: Serve requests from cache or fetch from network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return cached response or fetch from network
            return (
                response ||
                fetch(event.request).then((networkResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                })
            );
        })
    );
});

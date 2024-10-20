// service-worker.ts

// Define a cache name
const CACHE_NAME = 'my-cache-v1';
const urlsToCache = [
  '/',               // Cache the root page
  '/index.html',     // Cache the main HTML file
  '/src/styles.css', // Update path to the main CSS file
  '/src/script.js',  // Update path to the main JavaScript entry point
  // Add other essential files here (images, fonts, etc.)
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
  console.log('Service Worker: Activated');
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
  console.log('Service Worker: Fetching', event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      // If a cached response is found, return it; otherwise, fetch from network
      return (
        response ||
        fetch(event.request).then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone()); // Cache the new response
            return response; // Return the network response
          });
        })
      );
    })
  );
});

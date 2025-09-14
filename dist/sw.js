const CACHE_NAME = 'meps-v1.0.2';
const STATIC_CACHE = 'meps-static-v1.0.2';
const DYNAMIC_CACHE = 'meps-dynamic-v1.0.2';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/meps/',
  '/meps/index.html',
  '/meps/manifest.json',
  '/meps/icons/icon-192x192.png',
  '/meps/icons/icon-192x192.svg'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /^https:\/\/api\.fda\.gov\/drug\/label\.json/,
  /^https:\/\/rxnav\.nlm\.nih\.gov\/REST/
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static files', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete ALL old caches to force fresh load
            console.log('Service Worker: Deleting cache', cacheName);
            return caches.delete(cacheName);
          })
        );
      })
      .then(() => {
        console.log('Service Worker: All caches cleared, activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle API requests
  if (isApiRequest(url)) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Handle static files
  if (isStaticFile(url)) {
    event.respondWith(handleStaticRequest(request));
    return;
  }
  
  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }
  
  // Default: try network first, fallback to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then((cache) => {
              cache.put(request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(request);
      })
  );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag);
  
  if (event.tag === 'medication-sync') {
    event.waitUntil(syncMedicationData());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New medication safety alert',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icons/action-icon.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/close-icon.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('MEPS Safety Alert', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/meps/?action=safety')
    );
  }
});

// Helper functions
function isApiRequest(url) {
  return API_CACHE_PATTERNS.some(pattern => pattern.test(url.href));
}

function isStaticFile(url) {
  return url.pathname.startsWith('/meps/assets/') || 
         url.pathname.startsWith('/assets/') ||
         url.pathname.endsWith('.css') || 
         url.pathname.endsWith('.js') ||
         url.pathname.endsWith('.png') ||
         url.pathname.endsWith('.jpg') ||
         url.pathname.endsWith('.svg');
}

async function handleApiRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Return cached response immediately
    fetchAndCache(request, cache);
    return cachedResponse;
  }
  
  // Try network first
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed, no cached response available');
    return new Response(
      JSON.stringify({ error: 'Offline - No cached data available' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('Offline - Resource not available', { status: 503 });
  }
}

async function handleNavigationRequest(request) {
  // For development, always try network first
  try {
    return await fetch(request);
  } catch (error) {
    // Fallback to cache only if network fails
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match('/meps/index.html');
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response('Offline - Application not available', { status: 503 });
  }
}

async function fetchAndCache(request, cache) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
  } catch (error) {
    console.log('Service Worker: Background fetch failed', error);
  }
}

async function syncMedicationData() {
  console.log('Service Worker: Syncing medication data...');
  // Implement medication data sync logic here
  // This would sync any offline changes when back online
}

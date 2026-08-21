// AURA — minimal service worker.
// Purpose: make the app installable (Add to Home Screen) and cache the
// static app shell so the UI itself opens instantly even on a flaky
// connection. It deliberately does NOT cache YouTube iframe/player
// traffic or API calls — playback and search always go live.

const CACHE = 'aura-shell-v2';
const SHELL = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Never intercept YouTube, the search API, or the lyrics API — those
  // must always hit the network for live playback and results.
  if (
    url.origin.includes('youtube.com') ||
    url.origin.includes('ytimg.com') ||
    url.pathname.startsWith('/api/')
  ) {
    return;
  }

  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then(
      (cached) =>
        cached ||
        fetch(e.request)
          .then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
            return res;
          })
          .catch(() => cached)
    )
  );
});

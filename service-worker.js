// The Pages workflow substitutes the commit SHA so every release has its own shell.
const release = 'local-dev';
const scope = self.registration.scope;
const cachePrefix = `sprintline-shell:${scope}:`;
const cacheName = cachePrefix + release;
const home = new URL('./', scope).href;
const entry = new URL('index.html', scope).href;
const assets = new Set([
  'index.html',
  'styles.css',
  'workspace-data.js',
  'workspace-store.js',
  'app.js',
  'offline.js',
  'manifest.webmanifest',
  'assets/sprintline.svg',
  'assets/icons/sprintline/favicon.ico',
  'assets/icons/sprintline/apple-touch-icon.png',
  'assets/icons/sprintline/icon-192.png',
  'assets/icons/sprintline/icon-512.png'
].map(path => new URL(path, scope).href));

self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => {
    return cache.addAll([...assets].map(url => new Request(url, { cache: 'reload' })));
  }));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(cachePrefix) && key !== cacheName)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (request.mode === 'navigate') url.search = '';
  const cacheKey = url.href === home ? entry : url.href;
  if (!assets.has(cacheKey)) return;

  event.respondWith((async () => {
    const cached = await caches.match(cacheKey, { cacheName });
    return cached || fetch(request);
  })());
});

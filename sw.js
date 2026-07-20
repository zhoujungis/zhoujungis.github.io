// Service Worker — caches app shell, network-first for HTML
const CACHE = 'zhoujun-blog-v7'
// Files that MUST exist for the site to work offline. Each is added
// individually so a missing/renamed file doesn't break the whole install
// (caches.addAll() is atomic — one failure kills the whole precache).
const SHELL = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json',
  '/404.html', // SPA deep-link fallback works offline
]

self.addEventListener('install', (e) => {
  self.skipWaiting()
  e.waitUntil(
    caches.open(CACHE).then(async (c) => {
      // Add each shell file independently — survives 404s.
      await Promise.all(
        SHELL.map(async (url) => {
          try {
            await c.add(url)
          } catch {
            // Individual file 404s don't break the whole SW install.
            // Runtime fetch handler will fall back to network anyway.
          }
        }),
      )
    }),
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url)

  // Don't touch API / admin / non-GET requests
  if (url.pathname.startsWith('/api/')) return
  if (url.pathname.startsWith('/admin')) return
  if (e.request.method !== 'GET') return

  // Navigation: network-first, fallback to cache, fallback to /404.html
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {})
          return res
        })
        .catch(() =>
          caches.match(e.request).then((cached) => cached || caches.match('/404.html'))
        )
    )
    return
  }

  // Static assets: cache-first, fallback to network
  // L2: terminal .catch() so a 504-style "both fail" still resolves
  e.respondWith(
    caches
      .match(e.request)
      .then((cached) => {
        if (cached) return cached
        return fetch(e.request).then((res) => {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {})
          return res
        })
      })
      .catch(
        () =>
          new Response('', {
            status: 504,
            statusText: 'Offline and not cached',
          }),
      ),
  )
})

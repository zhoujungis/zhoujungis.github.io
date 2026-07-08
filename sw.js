// ========================================
// Service Worker — Network-first for content, cache for shell
// ========================================
const CACHE = 'zhoujun-blog-v2'
const SHELL = ['/', '/index.html', '/favicon.svg', '/manifest.json']

// ---- Install: pre-cache app shell ----
self.addEventListener('install', (e) => {
  self.skipWaiting()
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL))
  )
})

// ---- Activate: clean old caches ----
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      )
    )
  )
  self.clients.claim()
})

// ---- Fetch: stale-while-revalidate for static, network-first for nav ----
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url)

  // Never cache API calls
  if (url.pathname.startsWith('/api/')) return

  // Never cache admin routes
  if (url.pathname.startsWith('/admin')) return

  // For navigation requests (HTML) — network-first with cache fallback
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const clone = res.clone()
          caches.open(CACHE).then((c) => c.put(e.request, clone))
          return res
        })
        .catch(() => caches.match(e.request))
    )
    return
  }

  // For static assets — stale-while-revalidate
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetched = fetch(e.request).then((res) => {
        caches.open(CACHE).then((c) => c.put(e.request, res.clone()))
        return res
      })
      return cached || fetched
    })
  )
})

// Service Worker — caches app shell, network-first for HTML
const CACHE = 'zhoujun-blog-v3'
const SHELL = ['/', '/index.html', '/favicon.svg', '/manifest.json']

self.addEventListener('install', (e) => {
  self.skipWaiting()
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)))
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

  // Navigation: network-first, fallback to cache
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).then((res) => {
        try { caches.open(CACHE).then((c) => c.put(e.request, res.clone())) } catch (_) {}
        return res
      }).catch(() => caches.match(e.request))
    )
    return
  }

  // Static assets: cache-first, fallback to network
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached
      return fetch(e.request).then((res) => {
        try { caches.open(CACHE).then((c) => c.put(e.request, res.clone())) } catch (_) {}
        return res
      })
    })
  )
})

// Service Worker — caches app shell, network-first for HTML.
//
// Cache hygiene (see issue: unbounded growth):
// - Old versioned caches are deleted on activate.
// - Each cache has a MAX entry cap; oldest entries are evicted FIFO on every
//   write (Cache API has no LRU, FIFO is a good-enough approximation).
// - Only same-origin, HTTP-200 GET responses are stored; API/admin/opaque
//   responses are never cached.
// - Bump CACHE_VERSION on each release that changes cached shell files.
const CACHE_VERSION = 'v9'
const CACHE = `zhoujun-blog-${CACHE_VERSION}`
const NAV_CACHE = `${CACHE}-nav`
const STATIC_CACHE = `${CACHE}-static`
// Live2D model assets live in their own bucket: they are ~2MB of immutable
// files, and the generic static cache's FIFO cap would otherwise evict them.
const LIVE2D_CACHE = `${CACHE}-live2d`

// Upper bounds — long sessions / photo browsing can't grow storage forever.
const MAX_NAV_ENTRIES = 30
const MAX_STATIC_ENTRIES = 150
// 49 files ship under /live2d/ (2 JS + model json + .moc + 6 textures +
// 4 expressions + 18 motions + 15 sounds) — 80 leaves headroom for a model swap.
const MAX_LIVE2D_ENTRIES = 80

// Files that MUST exist for the site to work offline. Each is added
// individually so a missing/renamed file doesn't break the whole install
// (caches.addAll() is atomic — one failure kills the whole precache).
const SHELL = [
  // '/' and '/index.html' serve the same document — precache it once.
  '/',
  '/favicon.svg',
  '/manifest.json',
  '/articles.json', // build-time article snapshot (API-down fallback)
  '/404.html', // SPA deep-link fallback works offline
]

self.addEventListener('install', (e) => {
  self.skipWaiting()
  e.waitUntil(
    caches.open(STATIC_CACHE).then(async (c) => {
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
      await trimCache(STATIC_CACHE, MAX_STATIC_ENTRIES)
    }),
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== NAV_CACHE && k !== STATIC_CACHE && k !== LIVE2D_CACHE)
            .map((k) => caches.delete(k)),
        ),
      ),
  )
  self.clients.claim()
})

// FIFO eviction: delete oldest entries until the cache fits the cap.
async function trimCache(cacheName, maxEntries) {
  try {
    const cache = await caches.open(cacheName)
    const keys = await cache.keys()
    if (keys.length > maxEntries) {
      await Promise.all(
        keys.slice(0, keys.length - maxEntries).map((k) => cache.delete(k)),
      )
    }
  } catch {
    // Best-effort — never break serving because trimming failed.
  }
}

function isCacheable(req, res) {
  if (!res || res.status !== 200) return false
  if (req.method !== 'GET') return false
  try {
    // Same-origin only — never store cross-origin/opaque responses.
    if (new URL(req.url).origin !== self.location.origin) return false
  } catch {
    return false
  }
  return true
}

async function putWithCap(cacheName, req, res, maxEntries) {
  try {
    const cache = await caches.open(cacheName)
    await cache.put(req, res)
    await trimCache(cacheName, maxEntries)
  } catch {
    // Quota / private mode — serving the live response still works.
  }
}

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
          if (isCacheable(e.request, res)) {
            putWithCap(NAV_CACHE, e.request, res.clone(), MAX_NAV_ENTRIES)
          }
          return res
        })
        .catch(() =>
          caches.match(e.request).then((cached) => cached || caches.match('/404.html')),
        ),
    )
    return
  }

  // articles.json: stale-while-revalidate. The homepage renders from this
  // snapshot BEFORE the API answers, so it must never wait on the network —
  // the previous network-first policy put the round trip straight back on the
  // critical path it was meant to remove.
  if (url.pathname === '/articles.json') {
    // Kick the refresh off immediately; the cache lookup below races it.
    const network = fetch(e.request)
      .then((res) => {
        if (isCacheable(e.request, res)) {
          putWithCap(STATIC_CACHE, e.request, res.clone(), MAX_STATIC_ENTRIES)
        }
        return res
      })
      .catch(() => null)

    e.respondWith(
      caches.match(e.request).then(async (cached) => {
        if (cached) return cached
        return (
          (await network) ||
          new Response('', { status: 504, statusText: 'Offline and not cached' })
        )
      }),
    )
    // Called synchronously so the worker stays alive for the background refresh.
    e.waitUntil(network.catch(() => {}))
    return
  }

  // Live2D model assets: cache-first in a dedicated bucket. The engine re-reads
  // motions/expressions repeatedly, and a model hit is 100% immutable, so there
  // is nothing to revalidate. Not precached in install — the widget only mounts
  // at ≥768px, so phone visitors would pay ~2MB for nothing.
  if (url.pathname.startsWith('/live2d/')) {
    e.respondWith(
      caches
        .match(e.request)
        .then((cached) => {
          if (cached) return cached
          return fetch(e.request).then((res) => {
            if (isCacheable(e.request, res)) {
              putWithCap(LIVE2D_CACHE, e.request, res.clone(), MAX_LIVE2D_ENTRIES)
            }
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
    return
  }

  // Static assets: cache-first, fallback to network
  // L2: terminal .catch() so a 504-style "both fail" still resolves
  e.respondWith(
    caches
      .match(e.request, { ignoreSearch: false })
      .then((cached) => {
        if (cached) return cached
        return fetch(e.request).then((res) => {
          if (isCacheable(e.request, res)) {
            putWithCap(STATIC_CACHE, e.request, res.clone(), MAX_STATIC_ENTRIES)
          }
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

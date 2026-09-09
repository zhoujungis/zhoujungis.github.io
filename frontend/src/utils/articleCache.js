/**
 * articleCache.js — API-down fallback for article lists & details.
 *
 * Chain of fallbacks when the backend is unreachable (outage / cold start):
 *   1. Build-time snapshot `/articles.json` (written by scripts/prerender.mjs,
 *      always ships with the deploy — no backend needed, no CORS).
 *   2. Last successful API response persisted in localStorage.
 *
 * The snapshot holds the FULL list, so filtered/paginated views are resolved
 * client-side (category/tag filter + page slicing) to mimic the API shape:
 * `{ results, count }`. Detail pages fall back to the last-seen full payload
 * cached per slug (list snapshots carry no html_content).
 */
import { catSlug, tagSlug } from './labels'

const SNAPSHOT_URL = `${import.meta.env.BASE_URL || '/'}articles.json`.replace(/\/+/g, '/')
const LS_LIST_KEY = 'zj_articles_cache_v1'
const LS_DETAIL_PREFIX = 'zj_article_detail_v1:'
const LS_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

let snapshotPromise = null

function readLS(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed?.savedAt && Date.now() - parsed.savedAt > LS_TTL_MS) {
      localStorage.removeItem(key)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function writeLS(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), value }))
  } catch {
    // Quota / private mode — caching is best-effort, never break the app.
  }
}

function fetchSnapshot() {
  if (!snapshotPromise) {
    snapshotPromise = fetch(SNAPSHOT_URL, { headers: { Accept: 'application/json' } })
      .then((res) => {
        if (!res.ok) throw new Error(`snapshot HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => data?.results || data || [])
      .catch(() => {
        snapshotPromise = null // allow retry on next call
        return null
      })
  }
  return snapshotPromise
}

function matchesFilter(article, params = {}) {
  const catFilter = params.category__slug || params.category
  if (catFilter) {
    const slug = catSlug(article.category) || article.category
    if (slug !== catFilter) return false
  }
  const tagFilter = params.tags__slug || params.tag
  if (tagFilter) {
    const tags = Array.isArray(article.tags) ? article.tags : []
    const slugs = tags.map((t) => tagSlug(t) || t)
    if (!slugs.includes(tagFilter)) return false
  }
  return true
}

function paginate(list, params = {}) {
  const page = Math.max(1, parseInt(params.page, 10) || 1)
  const pageSize = Math.max(1, parseInt(params.page_size || params.pageSize, 10) || 10)
  const count = list.length
  const start = (page - 1) * pageSize
  return { results: list.slice(start, start + pageSize), count, page, pageSize }
}

/**
 * Resolve an article list without the API. Returns `{ results, count, ... }`
 * shaped like a DRF paginated response, plus `source: 'snapshot'|'cache'`,
 * or `null` when nothing is available.
 */
export async function resolveListFallback(params = {}) {
  const snapshot = await fetchSnapshot()
  const cached = snapshot?.length ? null : readLS(LS_LIST_KEY)?.value
  const full = snapshot?.length ? snapshot : cached?.list
  if (!full?.length) return null
  const source = snapshot?.length ? 'snapshot' : 'cache'
  const filtered = full.filter((a) => matchesFilter(a, params))
  // Newest first — same ordering the pages apply to live data.
  const sorted = [...filtered].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  )
  return { ...paginate(sorted, params), source }
}

export function saveListCache(list, count) {
  if (Array.isArray(list) && list.length) writeLS(LS_LIST_KEY, { list, count })
}

export function saveDetailCache(article) {
  if (article?.slug) writeLS(LS_DETAIL_PREFIX + article.slug, article)
}

export function loadDetailCache(slug) {
  return readLS(LS_DETAIL_PREFIX + slug)?.value || null
}

export const cacheNoticeText = {
  snapshot: '后端暂时不可用，当前显示构建时的静态快照',
  cache: '后端暂时不可用，当前显示上次缓存的内容',
}

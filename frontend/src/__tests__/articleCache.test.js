import { describe, it, expect, vi, beforeEach } from 'vitest'

function makeArticle(i, overrides = {}) {
  return {
    slug: `cache-test-${i}`,
    title: `Cache test ${i}`,
    excerpt: '',
    cover_image: '',
    category: i % 2 === 0 ? { name: 'Tech', slug: 'tech' } : 'Life',
    tags: [],
    created_at: `2026-08-${String(i).padStart(2, '0')}T00:00:00+08:00`,
    updated_at: `2026-08-${String(i).padStart(2, '0')}T00:00:00+08:00`,
    reading_time: 3,
    views_count: 0,
    likes_count: 0,
    is_top: false,
    ...overrides,
  }
}

describe('articleCache offline fallback', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.unstubAllGlobals()
  })

  it('falls back to the localStorage list when API + snapshot are down', async () => {
    // Snapshot fetch fails (offline build / first deploy without snapshot).
    vi.stubGlobal('fetch', () => Promise.reject(new Error('offline')))
    const mod = await import('../utils/articleCache')
    const list = [makeArticle(1), makeArticle(2), makeArticle(3)]
    mod.saveListCache(list, list.length)

    const res = await mod.resolveListFallback({ page: 1, page_size: 2 })
    expect(res).not.toBeNull()
    expect(res.source).toBe('cache')
    expect(res.count).toBe(3)
    expect(res.results).toHaveLength(2)
    // newest first
    expect(res.results[0].slug).toBe('cache-test-3')
  })

  it('applies category filtering on cached data', async () => {
    vi.stubGlobal('fetch', () => Promise.reject(new Error('offline')))
    const mod = await import('../utils/articleCache')
    mod.saveListCache([makeArticle(1), makeArticle(2), makeArticle(3)], 3)

    const res = await mod.resolveListFallback({ category__slug: 'tech', page_size: 10 })
    expect(res.count).toBe(1)
    expect(res.results[0].slug).toBe('cache-test-2')
  })

  it('returns null when nothing is cached anywhere', async () => {
    vi.stubGlobal('fetch', () => Promise.reject(new Error('offline')))
    const mod = await import('../utils/articleCache')
    expect(await mod.resolveListFallback({})).toBeNull()
    expect(mod.loadDetailCache('nope')).toBeNull()
  })

  it('round-trips article details through localStorage', async () => {
    const mod = await import('../utils/articleCache')
    const article = { ...makeArticle(9), html_content: '<p>full</p>' }
    mod.saveDetailCache(article)
    expect(mod.loadDetailCache('cache-test-9')).toMatchObject({ html_content: '<p>full</p>' })
  })
})

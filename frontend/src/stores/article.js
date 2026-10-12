import { defineStore } from 'pinia'
import {
  getArticles,
  getArticleBySlug,
  getCategories,
  getTags,
} from '../api/articles'
import {
  resolveListFallback,
  saveListCache,
  saveDetailCache,
  loadDetailCache,
  deriveCategories,
  deriveTags,
  cacheNoticeText,
} from '../utils/articleCache'

// Monotonic counters — only the latest in-flight fetch gets to commit.
// Earlier responses are discarded even if they arrive after a newer one
// was started. Keeps Home/Search/Archive pages consistent when the user
// rapidly switches filters / pages / slugs.
let listSeq = 0
let detailSeq = 0

export const useArticleStore = defineStore('article', {
  state: () => ({
    articles: [],
    // M26: per-slug cache so failures don't poison subsequent loads
    articlesBySlug: {},
    currentArticle: null,
    currentArticleSlug: null,
    categories: [],
    tags: [],
    loading: false,
    // API-down fallback state — when true, `articles` come from the
    // build-time snapshot / localStorage cache instead of the live API.
    fromCache: false,
    cacheNotice: '',
    pagination: {
      count: 0,
      page: 1,
      pageSize: 10,
    },
  }),

  actions: {
    // Stale-while-revalidate: the build-time snapshot renders first, the live
    // API replaces it when it lands. `articles` is deliberately NOT cleared up
    // front — that was the skeleton flash on every page/filter change, and it
    // now runs while the snapshot is already on screen.
    async fetchArticles(params = {}) {
      this.loading = true
      this.fromCache = false
      this.cacheNotice = ''
      const seq = ++listSeq

      const fallback = await resolveListFallback(params)
      if (seq !== listSeq) return
      if (fallback?.results?.length) {
        this.articles = fallback.results
        this.pagination.count = fallback.count
        this.loading = false
      }

      try {
        const response = await getArticles(params)
        if (seq !== listSeq) return // superseded — drop result
        this.articles = response.data.results || response.data
        if (response.data.count !== undefined) {
          this.pagination.count = response.data.count
        }
        // Persist for API-down fallback (best-effort, see articleCache.js).
        saveListCache(this.articles, this.pagination.count)
      } catch (err) {
        if (seq !== listSeq) return
        if (fallback?.results?.length) {
          // Snapshot content is already on screen — label it instead of
          // replacing it with an error state.
          this.fromCache = true
          this.cacheNotice = cacheNoticeText[fallback.source] || ''
          return
        }
        throw err
      } finally {
        if (seq === listSeq) this.loading = false
      }
    },

    getArticleBySlug(slug) {
      return this.articlesBySlug[slug] || null
    },

    async fetchArticleBySlug(slug) {
      this.loading = true
      const seq = ++detailSeq
      try {
        const response = await getArticleBySlug(slug)
        if (seq !== detailSeq) return null // superseded
        const article = response.data
        if (article) {
          this.articlesBySlug = { ...this.articlesBySlug, [slug]: article }
          this.currentArticle = article
          this.currentArticleSlug = slug
          saveDetailCache(article)
        } else {
          console.error('fetchArticleBySlug: response.data is empty', response)
        }
        return article
      } catch (e) {
        if (seq !== detailSeq) throw e
        // API down — serve the last-seen full payload for this slug so
        // detail pages still render instead of erroring out.
        const cached = loadDetailCache(slug)
        if (cached) {
          this.articlesBySlug = { ...this.articlesBySlug, [slug]: cached }
          this.currentArticle = cached
          this.currentArticleSlug = slug
          return cached
        }
        console.error('fetchArticleBySlug error:', slug, e?.message, e?.response?.status, e?.response?.data)
        throw e
      } finally {
        if (seq === detailSeq) this.loading = false
      }
    },

    async fetchCategories() {
      try {
        const response = await getCategories()
        this.categories = response.data.results || response.data
      } catch (err) {
        // Degrade to an index derived from the build-time snapshot rather than
        // leaving the (prerendered) /categories page empty.
        const derived = await deriveCategories()
        if (derived.length) {
          this.categories = derived
          return
        }
        console.error('fetchCategories failed:', err?.message || err)
        throw err
      }
    },

    async fetchTags() {
      try {
        const response = await getTags()
        this.tags = response.data.results || response.data
      } catch (err) {
        const derived = await deriveTags()
        if (derived.length) {
          this.tags = derived
          return
        }
        console.error('fetchTags failed:', err?.message || err)
        throw err
      }
    },
  },
})

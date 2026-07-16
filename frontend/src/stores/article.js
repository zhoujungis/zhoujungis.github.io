import { defineStore } from 'pinia'
import {
  getArticles,
  getArticleBySlug,
  getCategories,
  getTags,
} from '../api/articles'

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
    pagination: {
      count: 0,
      page: 1,
      pageSize: 10,
    },
  }),

  actions: {
    async fetchArticles(params = {}) {
      this.loading = true
      this.articles = []
      const seq = ++listSeq
      try {
        const response = await getArticles(params)
        if (seq !== listSeq) return // superseded — drop result
        this.articles = response.data.results || response.data
        if (response.data.count !== undefined) {
          this.pagination.count = response.data.count
        }
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
        } else {
          console.error('fetchArticleBySlug: response.data is empty', response)
        }
        return article
      } catch (e) {
        if (seq !== detailSeq) throw e
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
        console.error('fetchCategories failed:', err?.message || err)
        throw err
      }
    },

    async fetchTags() {
      try {
        const response = await getTags()
        this.tags = response.data.results || response.data
      } catch (err) {
        console.error('fetchTags failed:', err?.message || err)
        throw err
      }
    },
  },
})

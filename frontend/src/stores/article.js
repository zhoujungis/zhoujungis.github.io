import { defineStore } from 'pinia'
import {
  getArticles,
  getArticleBySlug,
  getCategories,
  getTags,
} from '../api/articles'

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
      try {
        const response = await getArticles(params)
        this.articles = response.data.results || response.data
        if (response.data.count !== undefined) {
          this.pagination.count = response.data.count
        }
      } finally {
        this.loading = false
      }
    },

    getArticleBySlug(slug) {
      return this.articlesBySlug[slug] || null
    },

    async fetchArticleBySlug(slug) {
      this.loading = true
      try {
        const response = await getArticleBySlug(slug)
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
        console.error('fetchArticleBySlug error:', slug, e?.message, e?.response?.status, e?.response?.data)
        throw e
      } finally {
        this.loading = false
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

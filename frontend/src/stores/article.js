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
    currentArticle: null,
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

    async fetchArticleBySlug(slug) {
      this.loading = true
      try {
        const response = await getArticleBySlug(slug)
        this.currentArticle = response.data
      } finally {
        this.loading = false
      }
    },

    async fetchCategories() {
      try {
        const response = await getCategories()
        this.categories = response.data.results || response.data
      } catch {
        // silently handle
      }
    },

    async fetchTags() {
      try {
        const response = await getTags()
        this.tags = response.data.results || response.data
      } catch {
        // silently handle
      }
    },
  },
})

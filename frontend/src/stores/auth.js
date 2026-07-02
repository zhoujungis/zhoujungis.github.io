import { defineStore } from 'pinia'
import { login as apiLogin } from '../api/admin'
import client from '../api/client'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    isAuthenticated: !!localStorage.getItem('token'),
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
  },

  actions: {
    async login(username, password) {
      const response = await apiLogin(username, password)
      const { access, ...userData } = response.data

      this.token = access
      this.user = userData
      this.isAuthenticated = true

      localStorage.setItem('token', access)
      localStorage.setItem('user', JSON.stringify(userData))
    },

    logout() {
      this.token = null
      this.user = null
      this.isAuthenticated = false

      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    checkAuth() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      this.token = token
      this.user = user ? JSON.parse(user) : null
      this.isAuthenticated = !!token
    },
  },
})

import { defineStore } from 'pinia'
import { login as apiLogin } from '../api/admin'
import client from '../api/client'

const TOKEN_KEY = 'token'
const EXPIRY_KEY = 'token_expiry'
const USER_KEY = 'user'

function getStoredToken() {
  const token = localStorage.getItem(TOKEN_KEY)
  const expiry = localStorage.getItem(EXPIRY_KEY)
  // Treat expired tokens as if they don't exist
  if (token && expiry) {
    const expMs = parseInt(expiry, 10)
    if (Date.now() >= expMs) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(EXPIRY_KEY)
      localStorage.removeItem(USER_KEY)
      return null
    }
  }
  return token || null
}

// Parse JWT payload (no verification — just for reading expiry)
function parseJwtPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch { return null }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: getStoredToken(),
    user: JSON.parse(localStorage.getItem(USER_KEY) || 'null'),
    isAuthenticated: !!getStoredToken(),
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
  },

  actions: {
    async login(username, password) {
      const response = await apiLogin(username, password)
      const { access, refresh } = response.data

      this.token = access
      this.user = null
      this.isAuthenticated = true

      localStorage.setItem(TOKEN_KEY, access)
      if (refresh) localStorage.setItem('refresh_token', refresh)

      // Extract expiry from JWT payload (exp claim is in seconds)
      const payload = parseJwtPayload(access)
      if (payload?.exp) {
        localStorage.setItem(EXPIRY_KEY, String(payload.exp * 1000))
      }
      localStorage.removeItem(USER_KEY)
    },

    logout() {
      this.token = null
      this.user = null
      this.isAuthenticated = false

      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(EXPIRY_KEY)
      localStorage.removeItem('refresh_token')
      localStorage.removeItem(USER_KEY)
    },

    checkAuth() {
      const token = getStoredToken()
      const user = localStorage.getItem(USER_KEY)
      this.token = token
      this.user = user ? JSON.parse(user) : null
      this.isAuthenticated = !!token
    },
  },
})

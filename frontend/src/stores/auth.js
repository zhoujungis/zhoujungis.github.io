import { defineStore } from 'pinia'
import { login as apiLogin } from '../api/admin'
import { getMe, updateMe } from '../api/auth'

const TOKEN_KEY = 'token'
const EXPIRY_KEY = 'token_expiry'
const USER_KEY = 'user'
const REFRESH_KEY = 'refresh_token'

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

// L14: tolerate malformed JSON in localStorage.user. Without this, dirty
// legacy storage (manual edits, partial migration from older sessions) can
// throw during Pinia init and white-screen the whole app.
function safeParseUser() {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch (err) {
    console.warn('auth: invalid user JSON in localStorage, clearing', err)
    localStorage.removeItem(USER_KEY)
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: getStoredToken(),
    user: safeParseUser(),
    isAuthenticated: !!getStoredToken(),
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    displayName: (state) => state.user?.nickname || state.user?.email?.split('@')[0] || '',
    isStaff: (state) => !!state.user?.is_staff,
  },

  actions: {
    // 三种登录方式（邮箱验证码 / Google / GitHub）最终都落到这一处
    applyAuth({ access, refresh, user } = {}) {
      if (!access) throw new Error('No access token in auth response')

      this.token = access
      this.user = user || null
      this.isAuthenticated = true

      localStorage.setItem(TOKEN_KEY, access)
      if (refresh) localStorage.setItem(REFRESH_KEY, refresh)
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
      else localStorage.removeItem(USER_KEY)

      // Extract expiry from JWT payload (exp claim is in seconds)
      const payload = parseJwtPayload(access)
      if (payload?.exp) {
        localStorage.setItem(EXPIRY_KEY, String(payload.exp * 1000))
      }
    },

    async login(username, password) {
      const response = await apiLogin(username, password)
      const { access, refresh } = response.data
      this.applyAuth({ access, refresh, user: null })
    },

    async fetchMe() {
      const response = await getMe()
      this.user = response.data
      localStorage.setItem(USER_KEY, JSON.stringify(response.data))
      return response.data
    },

    async updateNickname(nickname) {
      const response = await updateMe({ nickname })
      this.user = response.data
      localStorage.setItem(USER_KEY, JSON.stringify(response.data))
      return response.data
    },

    logout() {
      this.token = null
      this.user = null
      this.isAuthenticated = false

      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(EXPIRY_KEY)
      localStorage.removeItem(REFRESH_KEY)
      localStorage.removeItem(USER_KEY)
    },

    checkAuth() {
      const token = getStoredToken()
      this.token = token
      this.user = safeParseUser()
      this.isAuthenticated = !!token
    },
  },
})

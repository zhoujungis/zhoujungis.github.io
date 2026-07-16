import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
  // 30s default — PythonAnywhere can be slow on cold start; no timeout = hangs forever
  timeout: 30000,
})

// Helper: read CSRF token from cookie (Django sets this on auth)
function getCsrfToken() {
  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]*)/)
  return match ? match[1] : null
}

// Helper: read JWT from localStorage
function getStoredToken() {
  return localStorage.getItem('token')
}

// Helper: read refresh token from localStorage
function getStoredRefreshToken() {
  return localStorage.getItem('refresh_token')
}

// Request interceptor: attach JWT (if stored in localStorage) + CSRF token
client.interceptors.request.use(
  (config) => {
    // JWT — from localStorage (will be replaced by HttpOnly cookie flow later)
    const token = getStoredToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // CSRF — required for cookie-based session auth
    const csrf = getCsrfToken()
    if (csrf) {
      config.headers['X-CSRFToken'] = csrf
    }

    return config
  },
  (error) => Promise.reject(error),
)

// ── Single-flight refresh: at most one /token/refresh/ call at a time ──
// Other 401 responses queue until it resolves, then retry with new token.
let refreshInFlight = null

async function refreshAccessToken() {
  if (refreshInFlight) return refreshInFlight

  const refresh = getStoredRefreshToken()
  if (!refresh) {
    throw new Error('No refresh token')
  }

  refreshInFlight = axios
    .post(
      `${client.defaults.baseURL}token/refresh/`,
      { refresh },
      { timeout: 15000, _skipRefresh: true },
    )
    .then((res) => {
      const { access, refresh: newRefresh } = res.data || {}
      if (!access) throw new Error('No access token in refresh response')
      localStorage.setItem('token', access)
      // H-F1: simplejwt returns a fresh refresh token when ROTATE_REFRESH_TOKENS
      // is enabled. Persist it so the next access-token expiry doesn't reuse
      // the (now-blacklisted) old refresh token.
      if (newRefresh) localStorage.setItem('refresh_token', newRefresh)
      // Update expiry from new JWT
      try {
        const payload = JSON.parse(
          atob(access.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')),
        )
        if (payload?.exp) {
          localStorage.setItem('token_expiry', String(payload.exp * 1000))
        }
      } catch {
        // ignore malformed JWT
      }
      return access
    })
    .finally(() => {
      // Allow next refresh after this one settles (success or failure)
      setTimeout(() => {
        refreshInFlight = null
      }, 0)
    })

  return refreshInFlight
}

function clearAuth() {
  localStorage.removeItem('token')
  localStorage.removeItem('token_expiry')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
}

// Response interceptor: refresh on 401 for authenticated requests, redirect
// only when an admin route was being accessed with a now-invalid token.
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status
    const original = error.config || {}

    if (status !== 401) {
      return Promise.reject(error)
    }

    // Never try to refresh the refresh endpoint itself or the login endpoint
    const url = original.url || ''
    if (url.includes('/token/')) {
      return Promise.reject(error)
    }
    // Caller opted out of refresh (used by router guard's manual refresh attempt)
    if (original._skipRefresh) {
      return Promise.reject(error)
    }

    // If this request wasn't authenticated, don't redirect to admin — just fail.
    // (e.g. anon user hitting /articles/ with some transient 401)
    const wasAuthenticated = !!original.headers?.Authorization

    // Try refresh if we have a refresh token
    if (wasAuthenticated && getStoredRefreshToken()) {
      // Don't retry the same request more than once
      if (original._retry) {
        clearAuth()
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin'
        }
        return Promise.reject(error)
      }
      original._retry = true
      try {
        const newToken = await refreshAccessToken()
        original.headers.Authorization = `Bearer ${newToken}`
        return client(original)
      } catch (refreshErr) {
        // Refresh failed — only redirect if this was an admin request
        clearAuth()
        if (typeof window !== 'undefined' && (original.url || '').includes('/admin/')) {
          window.location.href = '/admin'
        }
        return Promise.reject(refreshErr)
      }
    }

    // Anonymous 401 (e.g. CSRF glitch on public endpoint): just rethrow,
    // do not blow away the user's session or redirect them.
    return Promise.reject(error)
  },
)

export default client

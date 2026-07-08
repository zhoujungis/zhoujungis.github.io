import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
  // Send cookies for cross-origin requests (httpOnly JWT support)
  withCredentials: true,
})

// Helper: read CSRF token from cookie (Django sets this on auth)
function getCsrfToken() {
  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]*)/)
  return match ? match[1] : null
}

// Request interceptor: attach JWT (if stored in localStorage) + CSRF token
client.interceptors.request.use(
  (config) => {
    // JWT — fallback for localStorage-based auth (legacy compatibility)
    const token = localStorage.getItem('token')
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

// Response interceptor: handle 401 — clear credentials and redirect
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('token_expiry')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
      window.location.href = '/admin'
    }
    return Promise.reject(error)
  },
)

export default client

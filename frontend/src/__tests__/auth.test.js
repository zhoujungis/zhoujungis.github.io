import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../stores/auth'

// Mock the api/admin module
vi.mock('../api/admin', () => ({
  login: vi.fn(() => Promise.resolve({
    data: {
      access: 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjk5OTk5OTk5OTl9.signature',
      refresh: 'refresh-token-123',
    },
  })),
}))

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('starts unauthenticated when no token present', () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)
    expect(store.token).toBeNull()
  })

  it('login sets token and authenticates', async () => {
    const store = useAuthStore()
    await store.login('admin', 'password')
    expect(store.isAuthenticated).toBe(true)
    expect(store.token).toBeTruthy()
    expect(localStorage.getItem('token')).toBeTruthy()
    // Check expiry was stored
    expect(localStorage.getItem('token_expiry')).toBeTruthy()
  })

  it('logout clears token and deauthenticates', async () => {
    const store = useAuthStore()
    await store.login('admin', 'password')
    store.logout()
    expect(store.isAuthenticated).toBe(false)
    expect(store.token).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('token_expiry')).toBeNull()
  })

  it('checkAuth detects expired token', () => {
    // Set an expired token
    localStorage.setItem('token', 'expired.jwt.token')
    localStorage.setItem('token_expiry', String(Date.now() - 10000))
    const store = useAuthStore()
    store.checkAuth()
    expect(store.isAuthenticated).toBe(false)
    // Should have cleaned up
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('checkAuth keeps valid token', () => {
    // Set a valid token (expiry in the future)
    localStorage.setItem('token', 'valid.jwt.token')
    localStorage.setItem('token_expiry', String(Date.now() + 3600000))
    const store = useAuthStore()
    store.checkAuth()
    expect(store.isAuthenticated).toBe(true)
    expect(store.token).toBe('valid.jwt.token')
  })
})

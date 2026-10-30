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

// 读者登录相关的请求在 store 里只用到 getMe / updateMe
vi.mock('../api/auth', () => ({
  getMe: vi.fn(() => Promise.resolve({
    data: { id: 1, email: 'reader@example.com', nickname: '小周', avatar_url: '', is_staff: false },
  })),
  updateMe: vi.fn((payload) => Promise.resolve({
    data: { id: 1, email: 'reader@example.com', nickname: payload.nickname, avatar_url: '', is_staff: false },
  })),
  requestEmailCode: vi.fn(),
  verifyEmailCode: vi.fn(),
  startOAuth: vi.fn(),
  exchangeOAuthTicket: vi.fn(),
}))

const READER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjk5OTk5OTk5OTl9.signature'

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

  it('applyAuth 保存读者身份与昵称', () => {
    const store = useAuthStore()
    store.applyAuth({
      access: READER_TOKEN,
      refresh: 'reader-refresh',
      user: { id: 7, email: 'reader@example.com', nickname: '小周', avatar_url: '' },
    })
    expect(store.isLoggedIn).toBe(true)
    expect(store.displayName).toBe('小周')
    expect(localStorage.getItem('refresh_token')).toBe('reader-refresh')
    expect(JSON.parse(localStorage.getItem('user')).nickname).toBe('小周')
  })

  it('displayName 无昵称时回退到邮箱前缀', () => {
    const store = useAuthStore()
    store.applyAuth({
      access: READER_TOKEN,
      refresh: 'reader-refresh',
      user: { id: 7, email: 'reader@example.com', nickname: '' },
    })
    expect(store.displayName).toBe('reader')
  })

  it('updateNickname 同步服务端返回值到本地', async () => {
    const store = useAuthStore()
    store.applyAuth({
      access: READER_TOKEN,
      refresh: 'reader-refresh',
      user: { id: 7, email: 'reader@example.com', nickname: 'reader', avatar_url: '' },
    })
    await store.updateNickname('新的昵称')
    expect(store.displayName).toBe('新的昵称')
    expect(JSON.parse(localStorage.getItem('user')).nickname).toBe('新的昵称')
  })

  it('fetchMe 刷新昵称并落盘', async () => {
    const store = useAuthStore()
    store.applyAuth({ access: READER_TOKEN, refresh: 'reader-refresh', user: null })
    await store.fetchMe()
    expect(store.displayName).toBe('小周')
    expect(JSON.parse(localStorage.getItem('user')).email).toBe('reader@example.com')
  })
})

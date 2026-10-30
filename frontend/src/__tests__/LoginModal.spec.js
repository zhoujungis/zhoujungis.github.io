import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { createPinia } from 'pinia'
import LoginModal from '../components/LoginModal.vue'
import { useLoginModal } from '../composables/useLogin'
import { useAuthStore } from '../stores/auth'

vi.mock('../api/auth', () => ({
  requestEmailCode: vi.fn(() => Promise.resolve({ data: { detail: '验证码已发送', cooldown: 60 } })),
  verifyEmailCode: vi.fn(() => Promise.resolve({
    data: {
      access: 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjk5OTk5OTk5OTl9.signature',
      refresh: 'reader-refresh',
      user: { id: 7, email: 'reader@example.com', nickname: 'reader', avatar_url: '' },
    },
  })),
  getMe: vi.fn(),
  updateMe: vi.fn(),
  startOAuth: vi.fn(() => Promise.resolve({ data: { url: 'https://github.com/login/oauth/authorize' } })),
  exchangeOAuthTicket: vi.fn(),
}))

import { requestEmailCode, verifyEmailCode } from '../api/auth'

const $ = (selector) => document.body.querySelector(selector)

function mountModal() {
  const pinia = createPinia()
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { template: '<div />' } }],
  })
  return { wrapper: mount(LoginModal, { global: { plugins: [router, pinia] } }), pinia }
}

describe('LoginModal', () => {
  let wrapper

  beforeEach(() => {
    localStorage.clear()
    useLoginModal().closeLogin()
    vi.clearAllMocks()
  })

  afterEach(() => {
    wrapper?.unmount()
    useLoginModal().closeLogin()
  })

  it('默认隐藏，openLogin 后显示邮箱表单', async () => {
    const mounted = mountModal()
    wrapper = mounted.wrapper
    expect($('.login-card')).toBeNull()

    useLoginModal().openLogin()
    await flushPromises()

    expect($('.login-card')).toBeTruthy()
    expect($('.login-input')).toBeTruthy()
    expect($('.oauth-row')).toBeTruthy()
  })

  it('邮箱格式不合法时给出提示且不发请求', async () => {
    const mounted = mountModal()
    wrapper = mounted.wrapper
    useLoginModal().openLogin()
    await flushPromises()

    const input = $('.login-input')
    input.value = 'not-an-email'
    input.dispatchEvent(new Event('input'))
    await flushPromises()

    $('form').dispatchEvent(new Event('submit'))
    await flushPromises()

    expect(requestEmailCode).not.toHaveBeenCalled()
    expect($('.login-error').textContent).toContain('邮箱')
  })

  it('发送验证码后进入验证码步骤并开始倒计时', async () => {
    const mounted = mountModal()
    wrapper = mounted.wrapper
    useLoginModal().openLogin()
    await flushPromises()

    const input = $('.login-input')
    input.value = ' Reader@Example.com '
    input.dispatchEvent(new Event('input'))
    await flushPromises()

    $('form').dispatchEvent(new Event('submit'))
    await flushPromises()

    expect(requestEmailCode).toHaveBeenCalledWith('Reader@Example.com')
    expect($('.code-input')).toBeTruthy()
    expect($('.login-head').textContent).toContain('验证码')
  })

  it('验证码正确后写入登录态并关闭弹窗', async () => {
    const mounted = mountModal()
    wrapper = mounted.wrapper
    const auth = useAuthStore(mounted.pinia)

    useLoginModal().openLogin()
    await flushPromises()

    const emailInput = $('.login-input')
    emailInput.value = 'reader@example.com'
    emailInput.dispatchEvent(new Event('input'))
    await flushPromises()
    $('form').dispatchEvent(new Event('submit'))
    await flushPromises()

    const codeInput = $('.code-input')
    codeInput.value = '123456'
    codeInput.dispatchEvent(new Event('input'))
    await flushPromises()
    $('form').dispatchEvent(new Event('submit'))
    await flushPromises()

    expect(verifyEmailCode).toHaveBeenCalledWith('reader@example.com', '123456')
    expect(auth.isLoggedIn).toBe(true)
    expect(auth.displayName).toBe('reader')
    expect($('.login-card')).toBeNull()
  })
})

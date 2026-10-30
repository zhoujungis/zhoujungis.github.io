import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import NewsletterForm from '../components/NewsletterForm.vue'
import { useAuthStore } from '../stores/auth'
import { useSubscription } from '../composables/useSubscription'
import { subscribeEmail, fetchSubscription, toggleSubscription } from '../api/newsletter'

vi.mock('../api/newsletter', () => ({
  subscribeEmail: vi.fn(() => Promise.resolve({ data: { detail: '订阅成功！' } })),
  fetchSubscription: vi.fn(() =>
    Promise.resolve({ data: { subscribed: true, email: 'reader@test.com' } }),
  ),
  toggleSubscription: vi.fn(() => Promise.resolve({ data: { subscribed: false } })),
}))

function mountForm() {
  const pinia = createPinia()
  setActivePinia(pinia)
  return { pinia, wrapper: mount(NewsletterForm, { global: { plugins: [pinia] } }) }
}

describe('NewsletterForm', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    useSubscription().reset()
  })

  it('未登录时展示邮箱输入框，提交调用订阅接口', async () => {
    const { wrapper } = mountForm()
    expect(wrapper.find('.newsletter-input').exists()).toBe(true)

    await wrapper.find('.newsletter-input').setValue('anon@test.com')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(subscribeEmail).toHaveBeenCalledWith('anon@test.com')
    expect(wrapper.text()).toContain('订阅成功！')
  })

  it('已登录时不再输入邮箱，直接开关订阅', async () => {
    const { pinia, wrapper } = mountForm()
    useAuthStore(pinia).applyAuth({
      access: 'a.b.c',
      user: { id: 1, email: 'reader@test.com', nickname: '小周' },
    })
    useSubscription().reset()
    await flushPromises()

    // 重新挂载以触发 onMounted 里的状态拉取
    const loggedIn = mount(NewsletterForm, { global: { plugins: [pinia] } })
    await flushPromises()

    expect(loggedIn.find('.newsletter-input').exists()).toBe(false)
    expect(loggedIn.find('.newsletter-mail').text()).toBe('reader@test.com')
    expect(fetchSubscription).toHaveBeenCalled()

    // 已订阅 → 显示「取消订阅」；点击后走 toggle 接口并翻转状态
    const unsub = loggedIn.find('.newsletter-unsub')
    expect(unsub.text()).toBe('取消订阅')
    await unsub.trigger('click')
    await flushPromises()

    expect(toggleSubscription).toHaveBeenCalled()
    expect(useSubscription().subscribed.value).toBe(false)
    expect(loggedIn.find('.newsletter-btn').text()).toBe('订阅更新')
    expect(wrapper.exists()).toBe(true)
  })
})

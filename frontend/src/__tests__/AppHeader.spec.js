import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import { SITE_NAME } from '../utils/seo'

function withRouter() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'Home', component: { template: '<div />' } },
      { path: '/articles', name: 'Articles', component: { template: '<div />' } },
    ],
  })
  return router
}

describe('AppHeader', () => {
  it('renders the blog wordmark', async () => {
    const router = withRouter()
    await router.push('/'); await router.isReady()
    const wrapper = mount(AppHeader, { global: { plugins: [router] } })
    expect(wrapper.find('.logo').text()).toContain(SITE_NAME)
    expect(wrapper.find('.logo').text()).toContain('ZhouJun·ShenZhen')
    expect(wrapper.find('.logo-mark').attributes('src')).toBe('/icons/icon-192.png')
  })

  it('renders nav link 「文章」 pointing to /articles', async () => {
    const router = withRouter()
    await router.push('/'); await router.isReady()
    const wrapper = mount(AppHeader, { global: { plugins: [router] } })
    const articleLink = wrapper.findAll('.nav-link').find(a => a.text() === '文章')
    expect(articleLink).toBeTruthy()
    expect(articleLink.attributes('href')).toBe('/articles')
  })
})

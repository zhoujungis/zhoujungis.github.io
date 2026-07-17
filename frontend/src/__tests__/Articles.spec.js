import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import Articles from '../pages/Articles.vue'
import { useArticleStore } from '../stores/article'

// Stub ArticleCard to avoid pulling in heavy deps
vi.mock('../components/ArticleCard.vue', () => ({
  default: { name: 'ArticleCard', props: ['article'], template: '<div class="stub-card" />' },
}))
// Stub SidePanel to avoid pulling in heavy deps
vi.mock('../components/SidePanel.vue', () => ({
  default: { name: 'SidePanel', template: '<div class="stub-side" />' },
}))

describe('Articles page', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders page-articles root container', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/articles', component: Articles }] })
    await router.push('/articles'); await router.isReady()
    const wrapper = mount(Articles, { global: { plugins: [router] } })
    expect(wrapper.find('.page-articles').exists()).toBe(true)
  })

  it('shows page-header with title 文章', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/articles', component: Articles }] })
    await router.push('/articles'); await router.isReady()
    const wrapper = mount(Articles, { global: { plugins: [router] } })
    expect(wrapper.find('.page-title').text()).toBe('文章')
  })

  it('renders article-grid when store has results', async () => {
    const store = useArticleStore()
    store.articles = [{ id: 1, slug: 'a', is_top: false }]
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/articles', component: Articles }] })
    await router.push('/articles'); await router.isReady()
    const wrapper = mount(Articles, { global: { plugins: [router] } })
    expect(wrapper.find('.article-grid').exists()).toBe(true)
    expect(wrapper.findAll('.stub-card').length).toBe(1)
  })
})
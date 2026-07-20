import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import Articles from '../pages/Articles.vue'
import sidePanelSource from '../components/SidePanel.vue?raw'
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

  it('renders the page header above the two-column article layout', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/articles', component: Articles }] })
    await router.push('/articles'); await router.isReady()
    const wrapper = mount(Articles, { global: { plugins: [router] } })

    expect(wrapper.find('.page-articles > .page-header').exists()).toBe(true)
    expect(wrapper.find('.home-layout > .page-header').exists()).toBe(false)
  })

  it('clears filters without leaving the article listing', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/articles', component: Articles }] })
    await router.push('/articles?category=vue&page=2'); await router.isReady()
    const wrapper = mount(Articles, { global: { plugins: [router] } })
    const clearLink = wrapper.find('.filter-clear')

    expect(clearLink.attributes('href')).toBe('/articles')
    await clearLink.trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/articles')
    expect(router.currentRoute.value.query).toEqual({})
  })

  it('routes sidebar category and tag filters to the article listing', () => {
    expect(sidePanelSource.match(/path: '\/articles'/g)).toHaveLength(2)
  })
})
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import Articles from '../pages/Articles.vue'
import { useArticleStore } from '../stores/article'

// Stub ArticleCard to avoid pulling in heavy deps
vi.mock('../components/ArticleCard.vue', () => ({
  default: { name: 'ArticleCard', props: ['article'], template: '<div class="stub-card" />' },
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

  it('renders the page header above the article list', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/articles', component: Articles }] })
    await router.push('/articles'); await router.isReady()
    const wrapper = mount(Articles, { global: { plugins: [router] } })

    expect(wrapper.find('.page-articles > .page-header').exists()).toBe(true)
    expect(wrapper.find('.articles-list > .page-header').exists()).toBe(false)
  })

  it('does NOT render SidePanel (sidebar removed)', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/articles', component: Articles }] })
    await router.push('/articles'); await router.isReady()
    const wrapper = mount(Articles, { global: { plugins: [router] } })

    expect(wrapper.find('.side-panel').exists()).toBe(false)
    expect(wrapper.find('.home-layout').exists()).toBe(false)
  })

  it('clears filters without leaving the article listing', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/articles', component: Articles }] })
    await router.push('/articles?category=vue&page=2'); await router.isReady()
    const wrapper = mount(Articles, { global: { plugins: [router] } })
    // 静态「清除筛选」链接已换成筛选切换栏里的「全部」chip
    const allChip = wrapper.find('.filter-chip')

    expect(allChip.text()).toBe('全部')
    await allChip.trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/articles')
    expect(router.currentRoute.value.query).toEqual({})
  })

  it('renders the filter switch with both dimensions and chips from the store', async () => {
    const store = useArticleStore()
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/articles', component: Articles }] })
    await router.push('/articles'); await router.isReady()
    const wrapper = mount(Articles, { global: { plugins: [router] } })
    // 先让 onMounted 里的 fetchCategories/fetchTags 落定，再注入样本，
    // 否则接口回落会把我们种的分类/标签覆盖掉
    await flushPromises()
    store.categories = [{ name: 'Vue', slug: 'vue', article_count: 3 }]
    store.tags = [{ name: '测试', slug: 'testing', count: 2 }]
    await flushPromises()

    const dims = wrapper.findAll('.filter-dim').map((b) => b.text())
    expect(dims).toEqual(['分类', '标签'])
    // 默认维度是分类：chips = 全部 + 分类项
    const chips = wrapper.findAll('.filter-chip').map((b) => b.text())
    expect(chips[0]).toBe('全部')
    expect(chips).toContain('Vue3')

    // 切到标签维度，chips 换成标签集
    await wrapper.findAll('.filter-dim')[1].trigger('click')
    await flushPromises()
    const tagChips = wrapper.findAll('.filter-chip').map((b) => b.text())
    expect(tagChips).toContain('测试2')
  })
})
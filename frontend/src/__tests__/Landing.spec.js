import { describe, it, expect, vi, beforeEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { mount, flushPromises } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import Home from '../pages/Home.vue'

const globalStyles = readFileSync('src/styles/global.scss', 'utf8')

vi.mock('@/api/articles', () => ({
  getArticles: vi.fn(() => Promise.resolve({ data: { results: [] } })),
  getArticleBySlug: vi.fn(),
  getCategories: vi.fn(() => Promise.resolve({ data: [] })),
  getTags: vi.fn(() => Promise.resolve({ data: [] })),
}))

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: Home },
      { path: '/articles', component: { template: '<div />' } },
      { path: '/article/:slug', component: { template: '<div />' } },
    ],
  })
}

describe('Landing (Home.vue)', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders page-landing root container', async () => {
    const router = makeRouter()
    await router.push('/'); await router.isReady()
    const wrapper = mount(Home, { global: { plugins: [router] } })
    expect(wrapper.find('.page-landing').exists()).toBe(true)
  })

  it('renders masthead with kicker, name and subtitle', async () => {
    const router = makeRouter()
    await router.push('/'); await router.isReady()
    const wrapper = mount(Home, { global: { plugins: [router] } })
    expect(wrapper.find('.masthead__kicker').text()).toBe('ZhouJun · 深圳')
    expect(wrapper.find('.masthead__name').text()).toBe('代码与生活')
    expect(wrapper.find('.masthead__sub').text()).toBe('写字、写码、写日常。')

    // 自述三句，一句一行
    const lede = wrapper.findAll('.masthead__lede p').map((p) => p.text())
    expect(lede).toHaveLength(3)
    expect(lede[0]).toBe('代码的世界非黑即白，生活的画布斑驳陆离。')
    expect(lede[2]).toBe('世界很大，我想把这些亲历的创造与感动，妥帖地存放于此。')
  })

  it('renders latest-section with header and view-all link', async () => {
    const router = makeRouter()
    await router.push('/'); await router.isReady()
    const wrapper = mount(Home, { global: { plugins: [router] } })
    await flushPromises()
    expect(wrapper.find('.front-section').exists()).toBe(true)
    expect(wrapper.find('.section-title').text()).toBe('最新文章')
    const more = wrapper.find('.section-more')
    expect(more.exists()).toBe(true)
    expect(more.attributes('href')).toBe('/articles')
  })

  it('shows featured + list when latest articles are returned', async () => {
    const { getArticles } = await import('@/api/articles')
    getArticles.mockResolvedValueOnce({
      data: {
        results: [
          { slug: 'a1', title: 'Article One', excerpt: 'excerpt one', created_at: '2026-01-01T00:00:00Z', category: { name: '技术' }, tags: [], reading_time: 3, cover_image: '' },
          { slug: 'a2', title: 'Article Two', excerpt: 'excerpt two', created_at: '2026-01-02T00:00:00Z', category: null, tags: [], reading_time: 2, cover_image: '' },
          { slug: 'a3', title: 'Article Three', excerpt: '', created_at: '2026-01-03T00:00:00Z', category: null, tags: [], reading_time: 1, cover_image: '' },
          { slug: 'a4', title: 'Article Four', excerpt: '', created_at: '2026-01-04T00:00:00Z', category: null, tags: [], reading_time: 1, cover_image: '' },
          { slug: 'a5', title: 'Article Five', excerpt: '', created_at: '2026-01-05T00:00:00Z', category: null, tags: [], reading_time: 1, cover_image: '' },
        ],
      },
    })
    const router = makeRouter()
    await router.push('/'); await router.isReady()
    const wrapper = mount(Home, { global: { plugins: [router] } })
    await flushPromises()
    expect(wrapper.find('.lead-story').exists()).toBe(true)
    // sorted newest-first, so 2026-01-05 (Article Five) is featured
    expect(wrapper.find('.lead-story__title').text()).toBe('Article Five')
    expect(wrapper.findAll('.index-item').length).toBe(4)
  })

  it('primary CTA points to /articles', async () => {
    const router = makeRouter()
    await router.push('/'); await router.isReady()
    const wrapper = mount(Home, { global: { plugins: [router] } })
    const cta = wrapper.find('.mast-cta')
    expect(cta.exists()).toBe(true)
    expect(cta.attributes('href')).toBe('/articles')
    expect(cta.text()).toMatch(/阅读文章/)
  })

  it('keeps dark-theme override for the landing surface', () => {
    expect(globalStyles).toContain('.page-landing')
  })
})

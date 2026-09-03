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

  it('renders .landing__name', async () => {
    const router = makeRouter()
    await router.push('/'); await router.isReady()
    const wrapper = mount(Home, { global: { plugins: [router] } })
    expect(wrapper.find('.landing__name').text()).toBe('Zhou Jun')
  })

  it('renders latest-section with header and view-all link', async () => {
    const router = makeRouter()
    await router.push('/'); await router.isReady()
    const wrapper = mount(Home, { global: { plugins: [router] } })
    await flushPromises()
    expect(wrapper.find('.latest-section').exists()).toBe(true)
    expect(wrapper.find('.latest-title').text()).toBe('最新文章')
    const more = wrapper.find('.latest-more')
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
    expect(wrapper.find('.latest-featured').exists()).toBe(true)
    // sorted newest-first, so 2026-01-05 (Article Five) is featured
    expect(wrapper.find('.latest-featured__title').text()).toBe('Article Five')
    expect(wrapper.findAll('.latest-item').length).toBe(4)
  })

  it('primary CTA points to /articles', async () => {
    const router = makeRouter()
    await router.push('/'); await router.isReady()
    const wrapper = mount(Home, { global: { plugins: [router] } })
    const cta = wrapper.find('.cta--primary')
    expect(cta.exists()).toBe(true)
    expect(cta.attributes('href')).toBe('/articles')
    expect(cta.text()).toMatch(/阅读文章/)
  })

  it('defines dark-theme overrides for landing surfaces and text', () => {
    for (const selector of [
      '.page-landing',
      '.avatar-frame',
      '.landing__name',
      '.cta--primary',
      '.landing__bio',
      '.avatar-handle',
    ]) {
      expect(globalStyles).toContain(selector)
    }
  })
})

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import Algorithms from '../pages/Algorithms.vue'
import { ALGORITHMS } from '../data/algorithms'

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/algo', component: { template: '<div />' } },
      { path: '/article/:slug', component: { template: '<div />' } },
    ],
  })
}

describe('Algorithms 题解页', () => {
  it('渲染标题、题数与完整题单', async () => {
    const router = makeRouter()
    await router.push('/algo'); await router.isReady()
    const wrapper = mount(Algorithms, { global: { plugins: [router] } })

    expect(wrapper.find('.page-title').text()).toBe('算法解读')
    expect(wrapper.findAll('.algo-item')).toHaveLength(ALGORITHMS.length)
    // 统计行里报的题数要和实际渲染条数一致
    expect(wrapper.find('.algo-stats').text()).toContain(String(ALGORITHMS.length))
  })

  it('已发布的题目渲染成链接，未发布的渲染成不可点的行', async () => {
    const router = makeRouter()
    await router.push('/algo'); await router.isReady()
    const wrapper = mount(Algorithms, { global: { plugins: [router] } })

    const rows = wrapper.findAll('.algo-item')
    rows.forEach((row, i) => {
      const link = row.find('.algo-item__link')
      const algo = ALGORITHMS[i]
      if (algo.published) {
        expect(link.attributes('href')).toBe(`/article/${algo.slug}`)
        expect(link.classes()).not.toContain('is-pending')
      } else {
        // 后端还没有这篇文章 —— 做成链接点进去就是 404
        expect(link.attributes('href')).toBeUndefined()
        expect(link.classes()).toContain('is-pending')
        expect(row.find('.algo-item__pending').text()).toBe('待发布')
      }
    })
  })

  it('题解页展示完整题单，不受首页「只放两条」的限制', async () => {
    const router = makeRouter()
    await router.push('/algo'); await router.isReady()
    const wrapper = mount(Algorithms, { global: { plugins: [router] } })
    expect(wrapper.findAll('.algo-item').length).toBe(ALGORITHMS.length)
  })
})

/**
 * TocNav.spec.js — 标题锚点认领（正文扁平目录的 `#section-N` 死链修复）。
 *
 * 背景：文章的正文目录是手写的 `- [一、xxx](#section-1)`；后端的
 * Python-Markdown 只给 ASCII 标题生成 id、bleach 又会把标题 id 洗掉，
 * 所以存储的 HTML 里没有 `section-N` 元素，正文目录链接点不动。
 * TocNav 现在按「链接文字 === 标题文字」把锚点认领给对应标题。
 */
import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import TocNav from '../components/TocNav.vue'

// jsdom 没有 IntersectionObserver，setupObserver 需要它
class IOStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.IntersectionObserver = IOStub

const TITLE_1 = '一、核心洞察：数岛屿 = 数连通块'
const TITLE_2 = '二、递归 DFS 为什么会爆栈'

const buildBody = (headings) => {
  const body = document.createElement('div')
  body.className = 'markdown-body'
  body.innerHTML = headings.map((h) => `<h2>${h}</h2>`).join('')
  document.body.appendChild(body)
  return body
}

const settle = async () => {
  await nextTick()
  await nextTick()
}

describe('TocNav 标题锚点', () => {
  let body
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    wrapper = null
    body?.remove()
    body = null
  })

  it('正文目录链接（#section-N）由对应标题认领，侧栏与正文指向同一元素', async () => {
    body = buildBody(['题目', TITLE_1, TITLE_2])
    wrapper = mount(TocNav, {
      props: {
        html: `
          <ul>
            <li><a href="#section-1">${TITLE_1}</a></li>
            <li><a href="#section-2">${TITLE_2}</a></li>
          </ul>
          <h2>题目</h2>
          <h2>${TITLE_1}</h2>
          <h2>${TITLE_2}</h2>
        `,
      },
    })
    await settle()

    const live = body.querySelectorAll('h2')
    expect(live[0].id).toBe('toc-heading-0') // 未列入目录 → 合成 id
    expect(live[1].id).toBe('section-1')
    expect(live[2].id).toBe('section-2')

    const hrefs = wrapper.findAll('.toc-link').map((a) => a.attributes('href'))
    expect(hrefs).toEqual(['#toc-heading-0', '#section-1', '#section-2'])
  })

  it('非哈希链接与文字对不上的链接不会被认领', async () => {
    body = buildBody(['真实标题'])
    wrapper = mount(TocNav, {
      props: {
        html: `
          <a href="/article/other/">外链</a>
          <a href="#section-9">和标题对不上的文字</a>
          <h2>真实标题</h2>
        `,
      },
    })
    await settle()

    expect(body.querySelector('h2').id).toBe('toc-heading-0')
    expect(wrapper.find('.toc-link').attributes('href')).toBe('#toc-heading-0')
  })

  it('两个标题文字相同时，锚点只被第一个认领', async () => {
    body = buildBody(['重复标题', '重复标题'])
    wrapper = mount(TocNav, {
      props: {
        html: '<a href="#section-1">重复标题</a><h2>重复标题</h2><h2>重复标题</h2>',
      },
    })
    await settle()

    const live = body.querySelectorAll('h2')
    expect(live[0].id).toBe('section-1')
    expect(live[1].id).toBe('toc-heading-1')
  })
})

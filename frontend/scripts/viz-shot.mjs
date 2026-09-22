/**
 * viz-shot.mjs — 把某个算法动画的若干帧渲染成 PNG，供离线自查布局。
 *
 * 为什么要这么绕：本机的 agent-browser 起不来（GLES2 驱动问题），
 * 所以"肉眼看一眼动画长什么样"只能自己搭一座桥：
 *
 *   jsdom 里挂载动画 → 把 svg 内容序列化 → sharp 转 PNG → 写盘
 *
 * 用法（在 frontend 目录下）：
 *   node scripts/viz-shot.mjs intersectLists .shots 0 3 5 7 9 10
 *
 * 参数：模块名、输出目录、要截的帧号（省略则截全部）。
 */
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { JSDOM } from 'jsdom'
import sharp from 'sharp'
import { createServer } from 'vite'

const [moduleName = 'intersectLists', outDirArg = '.shots', ...frameArgs] = process.argv.slice(2)
const outDir = resolve(process.cwd(), outDirArg)
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

// ── 1. 起一个 vite dev server，用它的 ssrLoadModule 拿 ESM 模块 ──────────────
const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})

/**
 * 在 jsdom 里挂载动画并返回 SVG 字符串。
 * 每个帧号开一个全新的 jsdom —— 复用会串味（模块级缓存、样式注入等）。
 */
async function shot(frameIndex) {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    pretendToBeVisual: true,
  })
  const { window } = dom

  // 动画模块直接用到的浏览器 API，jsdom 缺的补齐
  globalThis.window = window
  globalThis.document = window.document
  globalThis.IntersectionObserver = class {
    constructor() {}
    observe() {}
    disconnect() {}
  }
  window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} })

  const mod = await server.ssrLoadModule(`/src/viz/${moduleName}.js`)
  const mount = mod[Object.keys(mod).find((k) => k.startsWith('mount'))]

  const host = window.document.createElement('div')
  window.document.body.appendChild(host)

  const handle = mount(host, { autoplay: false, initialStep: frameIndex })

  const svgEl = window.document.querySelector('svg')
  if (!svgEl) throw new Error(`第 ${frameIndex} 帧没有生成 svg`)
  svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

  const vb = svgEl.getAttribute('viewBox').split(/\s+/).map(Number)
  const w = Math.ceil(vb[2]) || 900
  const h = Math.ceil(vb[3]) || 420

  // 把页面里注入的 <style> 一并塞进 svg，否则 CSS 变量全丢、画面会糊成黑白
  const styles = Array.from(window.document.querySelectorAll('style'))
    .map((s) => s.textContent)
    .join('\n')
  // svg 里没有 html/body 之类的祖先，把主题相关的选择器降级成 :root
  const scoped = styles.replace(/html\.theme-dark/g, ':root')

  const inner = svgEl.outerHTML.replace(
    /(<svg[^>]*>)/,
    `$1<defs><style><![CDATA[${scoped}]]></style></defs>`,
  )

  const wrapper = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
    `<rect width="${w}" height="${h}" fill="#ffffff"/>${inner}</svg>`

  handle.destroy?.()
  return { data: wrapper, w, h }
}

const frames = frameArgs.length
  ? frameArgs.map(Number)
  : // 没指定就尝试 0..15，模块自己会因为越界被 createPlayer 夹住
    Array.from({ length: 16 }, (_, i) => i)

for (const f of frames) {
  try {
    const { data, w, h } = await shot(f)
    const file = join(outDir, `${moduleName}-f${String(f).padStart(2, '0')}.png`)
    await sharp(Buffer.from(data)).png().toFile(file)
    console.log(`ok ${file} (${w}x${h})`)
  } catch (e) {
    console.error(`fail frame ${f}: ${e.message}`)
  }
}

await server.close()

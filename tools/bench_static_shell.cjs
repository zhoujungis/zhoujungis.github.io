/**
 * 英文站静态化的账本：把「首屏要下载和执行多少字节」算成可复现的数字。
 *
 * 输出（每行一个指标，便于直接抄进文章）：
 *   - en 页面 HTML 原始 / gzip 字节
 *   - en 页面引用的外部 script / css 数量与字节
 *   - 内联 JS 字节数与行数
 *   - SPA 首屏引导包（首页 chunk + 公共包 + CSS）的原始 / gzip 字节
 *   - 两者的 JS 解析 + 编译耗时（vm.compileFunction，N 次取中位数）
 */

const fs = require('fs')
const path = require('path')
const zlib = require('zlib')
const vm = require('vm')

const DIST = path.join(__dirname, '..', 'frontend', 'dist')
const gz = (buf) => zlib.gzipSync(buf).length
const kb = (n) => (n / 1024).toFixed(1) + ' KB'

function refs(html, attr, test) {
  const re = new RegExp(`<${test}[^>]*${attr}="([^"]+)"`, 'g')
  return [...html.matchAll(re)].map((m) => m[1])
}

function size(p) {
  if (!fs.existsSync(p)) return null
  const buf = fs.readFileSync(p)
  return { raw: buf.length, gzip: gz(buf) }
}

function timeCompile(source, runs = 7, asModule = false) {
  const samples = []
  for (let i = 0; i < runs; i++) {
    const t0 = process.hrtime.bigint()
    if (asModule) {
      // 只解析 + 编译，不实例化、不执行：SourceTextModule 的构造就是这一步
      new vm.SourceTextModule(source, { identifier: `bench-${i}` })
    } else {
      vm.compileFunction(source, ['window', 'document', 'navigator'])
    }
    const t1 = process.hrtime.bigint()
    samples.push(Number(t1 - t0) / 1e6)
  }
  samples.sort((a, b) => a - b)
  return samples[Math.floor(samples.length / 2)]
}

const enHtmlPath = path.join(DIST, 'en', 'index.html')
const enHtml = fs.readFileSync(enHtmlPath, 'utf8')
const enScripts = refs(enHtml, 'src', 'script')
const enCss = refs(enHtml, 'href', 'link[^>]*rel="stylesheet"')
// 只统计可执行的经典脚本 / 模块脚本，跳过 JSON-LD 之类的数据块
const inlineScripts = [...enHtml.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)]
  .filter(([, attrs]) => {
    if (/\bsrc=/.test(attrs)) return false
    const m = attrs.match(/\btype="([^"]+)"/)
    return !m || /javascript|ecmascript|module/i.test(m[1])
  })
  .map(([, , body]) => body)
const inlineJs = inlineScripts.join('\n')

console.log('== /en/ 静态壳 ==')
console.log('html raw', kb(Buffer.byteLength(enHtml)), '| gzip', kb(gz(enHtml)))
console.log('external scripts', enScripts.length, '| external css', enCss.length)
console.log('inline js bytes', Buffer.byteLength(inlineJs), '| lines', inlineJs.split('\n').length)

for (const p of enCss) {
  const s = size(path.join(DIST, p.replace(/^\//, '')))
  if (s) console.log('css', p, kb(s.raw), '| gzip', kb(s.gzip))
}

// SPA 首屏：dist/index.html 引用的入口脚本 + 预加载的 Home chunk + 全局 CSS
const spaHtml = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')
const spaScripts = refs(spaHtml, 'src', 'script')
const spaPreloads = refs(spaHtml, 'href', 'link[^>]*rel="modulepreload"')
const spaCss = refs(spaHtml, 'href', 'link[^>]*rel="stylesheet"')

let bootRaw = 0
let bootGzip = 0
const bootFiles = []
for (const p of [...spaScripts, ...spaPreloads, ...spaCss]) {
  const f = path.join(DIST, p.replace(/^\//, ''))
  const s = size(f)
  if (!s) continue
  bootRaw += s.raw
  bootGzip += s.gzip
  bootFiles.push([p, s.raw, s.gzip])
}
console.log('\n== SPA 首屏引导（中文站同构） ==')
console.log('files', bootFiles.length, '| raw', kb(bootRaw), '| gzip', kb(bootGzip))
for (const [p, r, g] of bootFiles) console.log('  ', p, kb(r), '| gzip', kb(g))

// 解析 + 编译成本：整个入口包 vs 那 20 行内联脚本
const biggest = bootFiles.filter(([p]) => p.endsWith('.js')).sort((a, b) => b[1] - a[1])[0]
if (biggest) {
  const src = fs.readFileSync(path.join(DIST, biggest[0].replace(/^\//, '')), 'utf8')
  console.log('\n== JS 解析 + 编译（中位数，7 次） ==')
  console.log('entry bundle', biggest[0], kb(Buffer.byteLength(src)), '->', timeCompile(src, 7, true).toFixed(1), 'ms')
  console.log('inline shell', 'inline', kb(Buffer.byteLength(inlineJs)), '->', timeCompile(inlineJs).toFixed(2), 'ms')
}

// 请求数：静态壳 vs SPA
console.log('\n== 首屏请求数 ==')
console.log('en static shell:', 1 + enCss.length + enScripts.length, '(html + css + js)')
console.log('spa boot      :', 1 + bootFiles.length, '(html + assets)')

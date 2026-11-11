/**
 * 计时跑一次完整构建，并把三个阶段的时间拆开。
 *
 *   node tools/time_build.cjs            # npm run build（vite + prerender + postbuild）
 *   node tools/time_build.cjs --no-cache # 先清空图片缓存再跑（对照全量重压）
 */
const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const ROOT = path.resolve(__dirname, '..')
const FRONTEND = path.join(ROOT, 'frontend')
const noCache = process.argv.includes('--no-cache')

if (noCache) {
  fs.rmSync(path.join(FRONTEND, '.cache', 'images'), { recursive: true, force: true })
  console.log('[time_build] cleared image cache')
}

const t0 = Date.now()
const res = spawnSync('npm', ['run', 'build'], {
  cwd: FRONTEND,
  shell: true,
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024,
})
const total = (Date.now() - t0) / 1000

const out = (res.stdout || '') + (res.stderr || '')
fs.writeFileSync(path.join(ROOT, 'build_timed.log'), out, 'utf8')

const vite = out.match(/built in ([\d.]+)s/)
const compress = out.match(/Done: (\d+) images, (\d+) encoded, (\d+) cached, ([\d.]+)s/)
const prerender = out.match(/\[prerender\] wrote (\d+) article pages?/)

console.log(`exit code      : ${res.status}`)
console.log(`vite build     : ${vite ? vite[1] + ' s' : 'n/a'}`)
console.log(`prerender      : ${prerender ? prerender[1] + ' pages' : 'n/a'} (含在总时长里)`)
console.log(
  `image postbuild: ${compress ? `${compress[4]} s (${compress[2]} encoded, ${compress[3]} cached)` : 'n/a'}`
)
console.log(`TOTAL          : ${total.toFixed(1)} s`)

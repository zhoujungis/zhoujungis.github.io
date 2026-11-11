#!/usr/bin/env node
/**
 * compress-images.mjs — 把源 PNG/JPG 转 WebP + AVIF，输出到 dist/ 同名位置。
 *
 * 由 postbuild 钩子触发，也可独立运行 `npm run precompress`。
 *
 * 增量策略：编码结果缓存在 frontend/.cache/images/（**不在 dist 里** ——
 * vite build 会在开始时清空 dist，缓存放进去等于每次都被删）。命中缓存时
 * 只做文件拷贝，94 张图从 ~205s 降到 ~1s。
 *
 *   npm run precompress            # 增量
 *   npm run precompress -- --force # 全量重压
 */
import sharp from 'sharp'
import { promises as fs } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(process.cwd(), '..') // frontend/ 的上一级 = 项目根
const PUBLIC_DIR = path.join(ROOT, 'frontend', 'public')
// vite build 的输出目录是 frontend/dist/，deploy.sh 再把它拷贝到项目根
const DIST_DIR = path.join(ROOT, 'frontend', 'dist')
// 缓存必须活在 dist 之外，否则被 vite 的 emptyOutDir 删掉
const CACHE_DIR = path.join(ROOT, 'frontend', '.cache', 'images')
const MANIFEST = path.join(CACHE_DIR, 'manifest.json')

const WEBP_QUALITY = 80
const AVIF_QUALITY = 60
const MAX_DIMENSION = 2400

const FORCE = process.argv.includes('--force')
const OPTIONS_KEY = `webp${WEBP_QUALITY}-avif${AVIF_QUALITY}-max${MAX_DIMENSION}`

async function getTargets() {
  const photosDir = path.join(PUBLIC_DIR, 'photos')
  const entries = await fs.readdir(photosDir, { withFileTypes: true })
  const targets = []
  for (const ent of entries) {
    if (ent.isFile()) {
      const ext = path.extname(ent.name).toLowerCase()
      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        targets.push({
          src: path.join('frontend', 'public', 'photos', ent.name).replace(/\\/g, '/'),
          outDir: 'photos',
        })
      }
    }
  }
  return targets
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true })
}

async function loadManifest() {
  try {
    const raw = JSON.parse(await fs.readFile(MANIFEST, 'utf8'))
    return raw && raw.options === OPTIONS_KEY && raw.entries ? raw.entries : {}
  } catch {
    return {}
  }
}

async function saveManifest(entries) {
  await fs.writeFile(
    MANIFEST,
    JSON.stringify({ options: OPTIONS_KEY, entries }, null, 2),
    'utf8'
  )
}

async function cachedOutputs(src, entry, stat) {
  if (FORCE || !entry) return null
  if (entry.size !== stat.size || entry.mtimeMs !== stat.mtimeMs) return null
  const base = path.basename(src, path.extname(src))
  const webp = path.join(CACHE_DIR, `${base}.webp`)
  const avif = path.join(CACHE_DIR, `${base}.avif`)
  try {
    const [w, a] = await Promise.all([fs.stat(webp), fs.stat(avif)])
    if (w.size === 0 || a.size === 0) return null
    return { webp, avif }
  } catch {
    return null
  }
}

async function publish(file, destAbs, label, src) {
  await fs.copyFile(file, destAbs)
  const st = await fs.stat(destAbs)
  console.log(`[${label}] ${src} → ${path.relative(ROOT, destAbs)} (${(st.size / 1024).toFixed(1)} KB)`)
  return st.size
}

async function compressOne({ src, outDir }, manifest) {
  const absSrc = path.join(ROOT, src)
  const ext = path.extname(src).toLowerCase()
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
    console.warn(`[skip] unsupported extension: ${src}`)
    return 'skipped'
  }

  const base = path.basename(src, ext)
  const outAbsDir = path.join(DIST_DIR, outDir)
  await ensureDir(outAbsDir)
  await ensureDir(CACHE_DIR)

  const srcStat = await fs.stat(absSrc)
  const hit = await cachedOutputs(src, manifest[src], srcStat)

  let webpSize
  let avifSize
  if (hit) {
    webpSize = await publish(hit.webp, path.join(outAbsDir, `${base}.webp`), 'webp*', src)
    avifSize = await publish(hit.avif, path.join(outAbsDir, `${base}.avif`), 'avif*', src)
  } else {
    const webpCache = path.join(CACHE_DIR, `${base}.webp`)
    const avifCache = path.join(CACHE_DIR, `${base}.avif`)
    const pipeline = sharp(absSrc).resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: 'inside',
      withoutEnlargement: true,
    })
    await pipeline.clone().webp({ quality: WEBP_QUALITY }).toFile(webpCache)
    await pipeline.clone().avif({ quality: AVIF_QUALITY }).toFile(avifCache)
    webpSize = await publish(webpCache, path.join(outAbsDir, `${base}.webp`), 'webp', src)
    avifSize = await publish(avifCache, path.join(outAbsDir, `${base}.avif`), 'avif', src)
  }

  // 原图保留（vite 也会拷 public/，这里显式复制保证 postbuild 独立跑也对）
  if (src.startsWith('frontend/public/')) {
    const relInPublic = src.replace(/^frontend\/public\//, '')
    await fs.copyFile(absSrc, path.join(DIST_DIR, relInPublic))
  }

  manifest[src] = {
    size: srcStat.size,
    mtimeMs: srcStat.mtimeMs,
    webp: webpSize,
    avif: avifSize,
  }
  return hit ? 'cached' : 'encoded'
}

async function main() {
  const started = Date.now()
  await ensureDir(DIST_DIR)
  console.log(`Compressing images (WebP + AVIF)${FORCE ? ' [force]' : ''}...`)
  const manifest = await loadManifest()
  const targets = await getTargets()
  let encoded = 0
  let cached = 0
  for (const t of targets) {
    try {
      const result = await compressOne(t, manifest)
      if (result === 'encoded') encoded++
      if (result === 'cached') cached++
    } catch (e) {
      console.error(`[error] ${t.src}: ${e.message}`)
      process.exit(1)
    }
  }
  await saveManifest(manifest)
  const seconds = ((Date.now() - started) / 1000).toFixed(1)
  console.log(
    `Done: ${targets.length} images, ${encoded} encoded, ${cached} cached, ${seconds}s.`
  )
}

main()

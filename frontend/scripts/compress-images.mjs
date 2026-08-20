#!/usr/bin/env node
/**
 * compress-images.mjs — 把源 PNG/JPG 转 WebP + AVIF,输出到 dist/ 同名位置。
 * 由 prebuild 钩子触发,也可独立运行 `npm run precompress`。
 */
import sharp from 'sharp'
import { promises as fs } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(process.cwd(), '..') // frontend/ 的上一级 = 项目根
const PUBLIC_DIR = path.join(ROOT, 'frontend', 'public')
// vite build 的输出目录是 frontend/dist/,deploy.sh 再把它拷贝到项目根 dist/
const DIST_DIR = path.join(ROOT, 'frontend', 'dist')

const WEBP_QUALITY = 80
const AVIF_QUALITY = 60
const MAX_DIMENSION = 2400

// 源 PNG/JPG 列表(相对路径,以项目根为基准)
// hero.png 已随无用素材一并删除(P5),不再参与压缩。
const TARGETS = [
  { src: 'frontend/public/photos/tibet-2026.png', outDir: 'photos' },
]

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true })
}

async function compressOne({ src, outDir }) {
  const absSrc = path.join(ROOT, src)
  const ext = path.extname(src).toLowerCase()
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
    console.warn(`[skip] unsupported extension: ${src}`)
    return
  }

  const base = path.basename(src, ext)
  const outAbsDir = path.join(DIST_DIR, outDir)
  await ensureDir(outAbsDir)

  const pipeline = sharp(absSrc).resize({
    width: MAX_DIMENSION,
    height: MAX_DIMENSION,
    fit: 'inside',
    withoutEnlargement: true,
  })

  // WebP
  const webpPath = path.join(outAbsDir, `${base}.webp`)
  await pipeline.clone().webp({ quality: WEBP_QUALITY }).toFile(webpPath)
  const webpStat = await fs.stat(webpPath)
  console.log(`[webp] ${src} → ${path.relative(ROOT, webpPath)} (${(webpStat.size / 1024).toFixed(1)} KB)`)

  // AVIF
  const avifPath = path.join(outAbsDir, `${base}.avif`)
  await pipeline.clone().avif({ quality: AVIF_QUALITY }).toFile(avifPath)
  const avifStat = await fs.stat(avifPath)
  console.log(`[avif] ${src} → ${path.relative(ROOT, avifPath)} (${(avifStat.size / 1024).toFixed(1)} KB)`)

  // 原图保留(若 src 在 public/ 也复制到 dist/,供 Vite 拷贝)
  if (src.startsWith('frontend/public/')) {
    const relInPublic = src.replace(/^frontend\/public\//, '')
    const dest = path.join(DIST_DIR, relInPublic)
    await ensureDir(path.dirname(dest))
    await fs.copyFile(absSrc, dest)
    console.log(`[copy] ${src} → ${path.relative(ROOT, dest)}`)
  }
}

async function main() {
  await ensureDir(DIST_DIR)
  console.log('Compressing images...')
  for (const t of TARGETS) {
    try {
      await compressOne(t)
    } catch (e) {
      console.error(`[error] ${t.src}: ${e.message}`)
      process.exit(1)
    }
  }
  console.log('Done.')
}

main()

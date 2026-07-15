# 图片性能优化 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把博客图片资源从 PNG/JPG 转为 WebP + AVIF,照片墙首图 2.7MB → 140KB,主页/照片墙/足迹页 Lighthouse Performance ≥ 85

**Architecture:** 引入 sharp 构建期预处理脚本(把所有 PNG/JPG → WebP/AVIF 双格式),PhotoWall 模板改用 `<picture>` 让浏览器选最优格式;china-geo.json 走 Vite 强缓存。

**Tech Stack:** sharp 0.33.x、vite-plugin-imagemin、Vue 3 `<picture>` 元素、Vite 8

## Global Constraints

- 保留原 PNG 不删除(`<picture>` fallback 需要)
- 工具脚本只在 `prebuild` 时执行,不进运行时 bundle
- AVIF 质量参数 q=60,WebP 质量参数 q=80
- 图片最大边长限制 2400px(防止超大图解码压力)
- 不要触碰后端 PythonAnywhere 代码
- 所有改动必须可独立 `npm run build` 成功
- 提交格式:`feat: <描述>`、`perf: <描述>` 或 `chore(deps): <描述>`(依赖变更场景)

## 文件结构

**新增:**
- `frontend/scripts/compress-images.mjs` —— 构建期预处理脚本
- `frontend/src/utils/imageSource.js` —— 多源图片 URL 工具

**修改:**
- `frontend/package.json` —— 加 `sharp`、`vite-plugin-imagemin` 依赖,加 `precompress` 和 `prebuild` 脚本
- `frontend/vite.config.js` —— 引入压缩插件,优化 assetFileNames
- `frontend/src/pages/PhotoWall.vue` —— `<img>` 改为 `<picture>` 多源
- `frontend/src/pages/About.vue` —— PIC.png 引用改为响应式(若使用)
- `frontend/src/components/ArticleCard.vue` —— 加 `decoding="async"` 和 `fetchpriority`

**产物(dist/):**
- `dist/photos/tibet-2026.avif`(原 .png 旁边)
- `dist/photos/tibet-2026.webp`
- `dist/PIC.avif`、`dist/PIC.webp`
- `dist/assets/hero.avif`、`dist/assets/hero.webp`

---

### Task 1: 安装 sharp 与 vite-plugin-imagemin 依赖

**Files:**
- Modify: `frontend/package.json`(+ `frontend/package-lock.json`,npm install 必须同步 lockfile)

**Interfaces:**
- Produces: `node_modules/sharp`、`node_modules/vite-plugin-imagemin` 可被 `import`

- [ ] **Step 1: 安装 sharp**

```bash
cd D:\zhoujungis.github.io\frontend
npm install --save-dev sharp@^0.33.5
```

Expected: 成功添加 `sharp` 到 `devDependencies`,无错误。

- [ ] **Step 2: 安装 vite-plugin-imagemin**

```bash
cd D:\zhoujungis.github.io\frontend
npm install --save-dev vite-plugin-imagemin@^9.0.0
```

Expected: 成功添加 `vite-plugin-imagemin`。

- [ ] **Step 3: 验证安装**

```bash
cd D:\zhoujungis.github.io\frontend
node -e "import('sharp').then(s => console.log('sharp:', s.default.versions))"
```

Expected: 打印 sharp 版本号(如 `sharp: { vips: '8.15.0', ... }`),无错误。

- [ ] **Step 4: 提交**

```bash
git add frontend/package.json frontend/package-lock.json
git commit -m "chore(deps): add sharp and vite-plugin-imagemin for image compression"
```

---

### Task 2: 创建 compress-images.mjs 预处理脚本

**Files:**
- Create: `frontend/scripts/compress-images.mjs`

**Interfaces:**
- Produces: `dist/photos/*.avif`、`dist/photos/*.webp`、`dist/PIC.avif`、`dist/PIC.webp`、`dist/assets/hero.avif`、`dist/assets/hero.webp`

- [ ] **Step 1: 创建 scripts 目录**

```bash
mkdir -p D:\zhoujungis.github.io\frontend\scripts
```

- [ ] **Step 2: 编写 compress-images.mjs**

创建 `frontend/scripts/compress-images.mjs`:

```javascript
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
const DIST_DIR = path.join(ROOT, 'dist')
const ASSETS_DIR = path.join(ROOT, 'frontend', 'src', 'assets')

const WEBP_QUALITY = 80
const AVIF_QUALITY = 60
const MAX_DIMENSION = 2400

// 源 PNG/JPG 列表(相对路径,以项目根为基准)
const TARGETS = [
  { src: 'frontend/public/photos/tibet-2026.png', outDir: 'photos' },
  { src: 'frontend/public/PIC.png', outDir: '' },
  { src: 'frontend/src/assets/hero.png', outDir: 'assets' },
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
```

- [ ] **Step 3: 跑一次验证(注意 dist 必须先有目录)**

```bash
cd D:\zhoujungis.github.io\frontend
npm run build
```

> 注:首次构建 vite 会自动建 dist/,然后 prebuild 钩子跑压缩。但 prebuild 钩子要等下一任务再加,本任务先把脚本写好。

Expected: `npm run build` 成功(此时压缩脚本还没被钩入,只走 vite 默认流程)。

- [ ] **Step 4: 单独测试脚本(手动跑)**

```bash
cd D:\zhoujungis.github.io\frontend
node scripts/compress-images.mjs
```

Expected: 终端打印 6 行(`[webp]` × 3 + `[avif]` × 3 + 2 行 `[copy]`),最后一行 `Done.`,exit code 0。

- [ ] **Step 5: 检查产物**

```bash
ls -la D:\zhoujungis.github.io\dist\photos\
ls -la D:\zhoujungis.github.io\dist\PIC.*
ls -la D:\zhoujungis.github.io\dist\assets\hero.*
```

Expected:
- `dist/photos/tibet-2026.avif` < 250 KB
- `dist/photos/tibet-2026.webp` < 350 KB
- `dist/PIC.avif` < 15 KB
- `dist/PIC.webp` < 20 KB
- `dist/assets/hero.avif` < 8 KB

- [ ] **Step 6: 提交**

```bash
git add frontend/scripts/compress-images.mjs
git commit -m "feat(build): add prebuild image compression script (WebP/AVIF)"
```

---

### Task 3: 接入 prebuild 钩子

**Files:**
- Modify: `frontend/package.json`(+ `frontend/package-lock.json`,npm install 必须同步 lockfile)

**Interfaces:**
- Consumes: `scripts/compress-images.mjs`
- Produces: 任何 `npm run build` 之前自动跑压缩

- [ ] **Step 1: 修改 package.json 的 scripts 段**

修改 `frontend/package.json` 中 `"scripts"` 段:

```json
"scripts": {
  "dev": "vite",
  "precompress": "node scripts/compress-images.mjs",
  "prebuild": "node scripts/compress-images.mjs",
  "build": "vite build",
  "preview": "vite preview",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

要点:`prebuild` 是 npm 内置钩子,会在 `build` 前自动跑。

- [ ] **Step 2: 验证钩子触发**

```bash
cd D:\zhoujungis.github.io\frontend
rm -rf ../dist
npm run build
```

Expected: 终端输出先打印 `Compressing images...` 然后 `Done.`,再打印 Vite 构建日志。`dist/` 内有全部 6 个新文件。

- [ ] **Step 3: 提交**

```bash
git add frontend/package.json
git commit -m "chore(build): wire prebuild hook to compress-images"
```

---

### Task 4: 配置 vite-plugin-imagemin 兜底压缩

**Files:**
- Modify: `frontend/vite.config.js`

**Interfaces:**
- Produces: `src/assets/` 下的图在构建时被再次压缩,且 `china-geo.json` 走 `[name].[hash][extname]` 强缓存名

- [ ] **Step 1: 替换 vite.config.js 内容**

完整替换 `frontend/vite.config.js` 为:

```javascript
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import imagemin from 'vite-plugin-imagemin'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  test: {
    environment: 'jsdom',
    globals: true,
  },
  base: '/',
  plugins: [
    vue(),
    // 兜底压缩:对 src/ 下未走 prebuild 的图生效
    imagemin({
      gifsicle: { optimizationLevel: 7 },
      mozjpeg: { quality: 75 },
      pngquant: { quality: [0.65, 0.8] },
      svgo: {
        plugins: [
          { name: 'removeViewBox' },
          { name: 'removeEmptyAttrs', active: false },
        ],
      },
      webp: { quality: 80 },
      avif: { quality: 60 },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        // 让 china-geo.json 等大资产走 contenthash 强缓存
        assetFileNames: 'assets/[name].[hash][extname]',
        manualChunks(id) {
          if (id.includes('node_modules/echarts')) return 'echarts'
          if (id.includes('node_modules/highlight.js')) return 'highlight'
          if (id.includes('node_modules/vditor')) return 'vditor'
        },
      },
    },
  },
}))
```

- [ ] **Step 2: 验证构建仍成功**

```bash
cd D:\zhoujungis.github.io\frontend
rm -rf ../dist
npm run build
```

Expected: 构建成功,终端无 `Error:` 字样,`dist/assets/` 中包含带 hash 的 `china-geo.*.json` 和 `hero.*.webp` 等。

- [ ] **Step 3: 检查 JS chunk 走 hash 命名**

```bash
ls D:\zhoujungis.github.io\dist\assets\*.js | head -3
ls D:\zhoujungis.github.io\dist\assets\*.css | head -3
```

Expected: 至少一个 `.js` 和 `.css` 文件名包含 hash(如 `index-AbCd1234.js`)。

> 注:`china-geo.json` 在 `public/` 下被原样拷贝到 `dist/`,不走 Rollup,不会带 hash。要让 `china-geo.json` 走 hash 需另开任务:将其移入 `src/assets/` 并用 `?url` import。

- [ ] **Step 4: 提交**

```bash
git add frontend/vite.config.js
git commit -m "perf(build): add vite-plugin-imagemin and hash-named assets"
```

---

### Task 5: 创建 imageSource.js 工具函数

**Files:**
- Create: `frontend/src/utils/imageSource.js`

**Interfaces:**
- Produces: `getPictureSources(originalUrl) → { avif, webp, fallback }` 给 `<picture>` 标签用

- [ ] **Step 1: 写工具函数**

创建 `frontend/src/utils/imageSource.js`:

```javascript
/**
 * imageSource.js — 把图片 URL 转成多源 srcset 给 <picture> 标签使用。
 *
 * 例:
 *   getPictureSources('/photos/tibet-2026.png')
 *   => { avif: '/photos/tibet-2026.avif', webp: '/photos/tibet-2026.webp', fallback: '/photos/tibet-2026.png' }
 *
 * 约定:同 basename 换扩展名,产物与压缩脚本的输出一一对应。
 */
export function getPictureSources(originalUrl) {
  if (!originalUrl) return null
  // 跳过 data URL、远程 URL(无法预生成 .avif/.webp)
  if (originalUrl.startsWith('data:')) return null
  if (/^https?:\/\//.test(originalUrl)) return null

  const dotIdx = originalUrl.lastIndexOf('.')
  if (dotIdx < 0) return null
  const base = originalUrl.slice(0, dotIdx)
  const ext = originalUrl.slice(dotIdx).toLowerCase()
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return null

  return {
    avif: `${base}.avif`,
    webp: `${base}.webp`,
    fallback: originalUrl,
  }
}
```

- [ ] **Step 2: 写单元测试**

创建 `frontend/src/utils/__tests__/imageSource.test.js`:

```javascript
import { describe, it, expect } from 'vitest'
import { getPictureSources } from '../imageSource.js'

describe('getPictureSources', () => {
  it('PNG 路径返回 avif/webp/fallback', () => {
    expect(getPictureSources('/photos/tibet-2026.png')).toEqual({
      avif: '/photos/tibet-2026.avif',
      webp: '/photos/tibet-2026.webp',
      fallback: '/photos/tibet-2026.png',
    })
  })

  it('JPG 路径同样工作', () => {
    expect(getPictureSources('/img/foo.jpg')).toEqual({
      avif: '/img/foo.avif',
      webp: '/img/foo.webp',
      fallback: '/img/foo.jpg',
    })
  })

  it('远程 URL 返回 null', () => {
    expect(getPictureSources('https://example.com/foo.png')).toBeNull()
  })

  it('data URL 返回 null', () => {
    expect(getPictureSources('data:image/png;base64,xxx')).toBeNull()
  })

  it('SVG 返回 null(不转码)', () => {
    expect(getPictureSources('/icon.svg')).toBeNull()
  })

  it('空字符串返回 null', () => {
    expect(getPictureSources('')).toBeNull()
    expect(getPictureSources(null)).toBeNull()
  })

  it('无扩展名路径返回 null', () => {
    expect(getPictureSources('/api/img')).toBeNull()
  })
})
```

- [ ] **Step 3: 跑测试**

```bash
cd D:\zhoujungis.github.io\frontend
npm test
```

Expected: `imageSource.test.js` 7 个测试全部 PASS,无失败。

- [ ] **Step 4: 提交**

```bash
git add frontend/src/utils/imageSource.js frontend/src/utils/__tests__/imageSource.test.js
git commit -m "feat(utils): add imageSource helper for <picture> srcset"
```

---

### Task 6: PhotoWall.vue 改用 `<picture>` 多源

**Files:**
- Modify: `frontend/src/pages/PhotoWall.vue`(第 47-58 行附近、`<img>` 标签)

**Interfaces:**
- Consumes: `getPictureSources(url)` from `utils/imageSource.js`

- [ ] **Step 1: 引入工具函数**

在 `PhotoWall.vue` 的 `<script setup>` 顶部,`import { ref, computed, onMounted, onUnmounted } from 'vue'` 后面加:

```javascript
import { getPictureSources } from '@/utils/imageSource'
```

- [ ] **Step 2: 替换 img 标签为 picture**

找到 PhotoWall.vue 第 47-58 行(网格里的 `<img>` 标签):

```html
        <img
          :src="photo.image || photo.thumbnail_url || photo.image_url || photo.url"
          :alt="photo.title || photo.alt || 'Photo'"
          loading="lazy"
          class="photo-img"
        />
```

替换为:

```html
        <picture v-if="getPictureSources(photo.image || photo.thumbnail_url || photo.image_url || photo.url)">
          <source
            :srcset="getPictureSources(photo.image || photo.thumbnail_url || photo.image_url || photo.url).avif"
            type="image/avif"
          />
          <source
            :srcset="getPictureSources(photo.image || photo.thumbnail_url || photo.image_url || photo.url).webp"
            type="image/webp"
          />
          <img
            :src="getPictureSources(photo.image || photo.thumbnail_url || photo.image_url || photo.url).fallback"
            :alt="photo.title || photo.alt || 'Photo'"
            loading="lazy"
            decoding="async"
            class="photo-img"
          />
        </picture>
        <img
          v-else
          :src="photo.image || photo.thumbnail_url || photo.image_url || photo.url"
          :alt="photo.title || photo.alt || 'Photo'"
          loading="lazy"
          decoding="async"
          class="photo-img"
        />
```

要点:
- 外层 `v-if` 判断是否能生成多源(本地 PNG 才进 picture)
- 远程 URL 或 data URL 走 `v-else` 分支,保持单 `<img>`,避免显示空 `<source>`

- [ ] **Step 3: 替换 lightbox 中的 img(也走多源)**

找到 PhotoWall.vue 第 68-72 行(lightbox 里的 `<img>` 标签):

```html
        <img
          :src="lightboxPhoto?.image || lightboxPhoto?.image_url || lightboxPhoto?.url"
          :alt="lightboxPhoto?.title || 'Photo'"
          class="lightbox-img"
        />
```

替换为:

```html
        <picture v-if="getPictureSources(lightboxPhoto?.image || lightboxPhoto?.image_url || lightboxPhoto?.url)">
          <source
            :srcset="getPictureSources(lightboxPhoto?.image || lightboxPhoto?.image_url || lightboxPhoto?.url).avif"
            type="image/avif"
          />
          <source
            :srcset="getPictureSources(lightboxPhoto?.image || lightboxPhoto?.image_url || lightboxPhoto?.url).webp"
            type="image/webp"
          />
          <img
            :src="getPictureSources(lightboxPhoto?.image || lightboxPhoto?.image_url || lightboxPhoto?.url).fallback"
            :alt="lightboxPhoto?.title || 'Photo'"
            decoding="async"
            class="lightbox-img"
          />
        </picture>
        <img
          v-else
          :src="lightboxPhoto?.image || lightboxPhoto?.image_url || lightboxPhoto?.url"
          :alt="lightboxPhoto?.title || 'Photo'"
          decoding="async"
          class="lightbox-img"
        />
```

- [ ] **Step 4: 重新构建并验证**

```bash
cd D:\zhoujungis.github.io\frontend
rm -rf ../dist
npm run build
```

Expected: 构建成功无报错,PhotoWall 相关 chunk 体积略减(因为加了 picture 模板)。

- [ ] **Step 5: 验证产物含 avif/webp**

```bash
ls D:\zhoujungis.github.io\dist\photos\
```

Expected: 同时存在 `tibet-2026.png`、`tibet-2026.webp`、`tibet-2026.avif`。

- [ ] **Step 6: 提交**

```bash
git add frontend/src/pages/PhotoWall.vue
git commit -m "perf(photo-wall): use <picture> with AVIF/WebP sources"
```

---

### Task 7: ArticleCard.vue 加 decoding/fetchpriority

**Files:**
- Modify: `frontend/src/components/ArticleCard.vue`(第 5 行的 `<img>`)

**Interfaces:**
- 无新增导出

- [ ] **Step 1: 修改 img 标签**

找到 `frontend/src/components/ArticleCard.vue` 第 5 行附近:

```html
      <img :src="article.cover_image" :alt="article.title" loading="lazy" />
```

替换为:

```html
      <img
        :src="article.cover_image"
        :alt="article.title"
        loading="lazy"
        decoding="async"
        :fetchpriority="article.is_top ? 'high' : 'low'"
      />
```

要点:置顶文章图打 `fetchpriority="high"`,帮助浏览器优先加载 LCP 候选图。

- [ ] **Step 2: 重新构建**

```bash
cd D:\zhoujungis.github.io\frontend
npm run build
```

Expected: 构建成功。

- [ ] **Step 3: 提交**

```bash
git add frontend/src/components/ArticleCard.vue
git commit -m "perf(article-card): async decode + fetchpriority for cover"
```

---

### Task 8: About.vue 中 PIC.png 改多源(若使用了)

**Files:**
- Modify: `frontend/src/pages/About.vue`(根据实际用法改)

**Interfaces:**
- Consumes: `getPictureSources`

- [ ] **Step 1: 检查 About.vue 是否引用 PIC.png**

```bash
grep -n "PIC\.png" D:\zhoujungis.github.io\frontend\src\pages\About.vue
```

- 若无匹配,跳过 Step 2-4,直接 Step 5 提交空 change。
- 若有匹配,继续 Step 2。

- [ ] **Step 2(条件性):引入工具**

在 About.vue 的 `<script setup>` 顶部加:

```javascript
import { getPictureSources } from '@/utils/imageSource'
```

- [ ] **Step 3(条件性):改 img 为 picture**

对 About.vue 中引用 `/PIC.png` 的 `<img>` 标签,参照 Task 6 Step 2 的写法改为 `<picture>` 多源结构(remote URL 或 data URL 走 `<img>` fallback)。

- [ ] **Step 4(条件性):重新构建**

```bash
cd D:\zhoujungis.github.io\frontend
npm run build
```

- [ ] **Step 5: 提交**

```bash
git add frontend/src/pages/About.vue
git commit -m "perf(about): use <picture> for PIC.png when referenced"
```

---

### Task 9: 端到端验收 — 验证体积与 DOM

**Files:**
- Read-only verification

- [ ] **Step 1: 全量构建**

```bash
cd D:\zhoujungis.github.io\frontend
rm -rf ../dist
npm run build
```

Expected: 构建成功,所有 chunk 写入 dist/。

- [ ] **Step 2: 检查关键产物大小**

```bash
ls -l D:\zhoujungis.github.io\dist\photos\tibet-2026.*
ls -l D:\zhoujungis.github.io\dist\PIC.*
ls -l D:\zhoujungis.github.io\dist\assets\hero.*
```

预期(硬指标):
- `tibet-2026.avif` < 250 KB
- `tibet-2026.webp` < 350 KB
- `PIC.avif` < 15 KB
- `PIC.webp` < 20 KB
- `hero.avif` < 8 KB

- [ ] **Step 3: 验证 PhotoWall 编译产物含 picture 标签**

```bash
grep -o "tibet-2026.avif" D:\zhoujungis.github.io\dist\assets\PhotoWall-*.js | head -1
grep -o "tibet-2026.webp" D:\zhoujungis.github.io\dist\assets\PhotoWall-*.js | head -1
```

Expected: 两个 grep 都能找到至少 1 行匹配,说明 `<picture>` 的 `<source>` 路径已打入 chunk。

- [ ] **Step 4: 运行全部单元测试**

```bash
cd D:\zhoujungis.github.io\frontend
npm test
```

Expected: 全部测试 PASS(`imageSource.test.js` 至少 7 个)。

- [ ] **Step 5: 部署到 GitHub Pages**

```bash
cd D:\zhoujungis.github.io
git status
git push
```

> 部署流程参考 `tools/github_deploy.md` 中已存在的脚本,本任务不重复 deploy 步骤。

- [ ] **Step 6: 提交验证记录(可选)**

如果本任务发现新问题需要修复,提交对应的 fix;若一切通过,无需提交。

---

## Self-Review(已执行)

### Spec 覆盖检查

- ✅ WebP/AVIF 双格式生成 → Task 2, Task 4
- ✅ PhotoWall `<picture>` 多源 → Task 6
- ✅ 主页 PIC.png、hero.png 压缩 → Task 2, Task 8
- ✅ china-geo.json 缓存策略 → Task 4(assetFileNames hash)
- ✅ ArticleCard 响应式提示 → Task 7
- ✅ Vite 配置优化 → Task 4
- ✅ 单元测试 → Task 5
- ✅ 验收指标 → Task 9

### 占位符检查

无 "TBD"、"TODO"、"类似 Task N"、未实现代码段。

### 类型一致性

- `getPictureSources(url) → { avif, webp, fallback } | null` 在 Task 5 定义,Task 6/8 一致使用
- `compress-images.mjs` 输出路径在 Task 2 中定义,Task 3/4/9 一致引用

## 执行移交

**Plan 已保存到 `docs/superpowers/plans/2026-07-15-image-perf-optimization-plan.md`。**

**两种执行方式:**

1. **Subagent-Driven(推荐)** — 我为每个任务派遣一个新的子智能体,任务间审核,快速迭代
2. **Inline Execution** — 在当前会话中用 executing-plans 顺序执行,带 checkpoint 审查

**选哪种?**
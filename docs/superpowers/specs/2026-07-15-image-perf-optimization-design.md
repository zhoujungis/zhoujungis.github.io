# 2026-07-15 图片性能优化 — 设计文档

## 目标

把博客中影响加载速度最大的"图片类资源"压缩到极致,首屏总体积下降 60-80%,三个目标页面(Lighthouse Performance)在 4G 模拟下达到 90+:

1. **主页** — `PIC.png`、`hero.png` 及所有组件内嵌图
2. **照片墙** — `photos/tibet-2026.png`(当前 2.7MB,最大瓶颈)
3. **足迹** — `china-geo.json`(583KB)、首页用到的 echarts(1.1MB,按需加载)

## 范围

### 范围内

- `frontend/public/photos/**`、`frontend/public/PIC.png`、`frontend/src/assets/hero.png`
- `frontend/public/china-geo.json`
- `frontend/vite.config.js` —— 引入压缩插件、调优 build 配置
- `frontend/src/pages/PhotoWall.vue` —— 改为 `<picture>` 多源
- `frontend/src/components/ArticleCard.vue` —— 加 `srcset`/`sizes`(若后端图支持)
- 新增构建脚本 `frontend/scripts/compress-images.mjs`
- 新增工具 `frontend/src/utils/imageSource.js`

### 范围外

- 不动后端 PythonAnywhere 的图片返回逻辑(架构改动,本次排除)
- 不引入 CDN(用户未要求,且与 GitHub Pages 静态部署冲突)
- 不优化文章详情页内嵌图(后端返回的图片不在静态资源路径上)
- 不动 Service Worker 缓存策略(已有 `sw.js`)

## 设计

### 总体架构

```
            ┌─────────────────────────────────────────────┐
            │        构建期(sharp + vite-plugin-imagemin) │
            └─────────────────────────────────────────────┘
                                ↓
源 PNG ────────────────→ .webp(q=80) + .avif(q=60) + 原 PNG 保留
源 JPG ────────────────→ .webp(q=80) + .avif(q=60) + 原 JPG 保留
源 SVG ────────────────→ 仅 SVGO 压缩(无格式转换)
china-geo.json ────────→ 保持 JSON(改用 Vite assetFileNames 让其有 hash 缓存)
                                ↓
            ┌─────────────────────────────────────────────┐
            │              运行时(浏览器选最佳)            │
            └─────────────────────────────────────────────┘
                                ↓
<picture>
  <source srcset="*.avif" type="image/avif">   ← 现代浏览器优先
  <source srcset="*.webp" type="image/webp">   ← 主流兼容
  <img src="*.png" loading="lazy" decoding="async">  ← 旧浏览器 fallback
</picture>
```

### 模块划分

| 模块 | 职责 | 文件 |
|------|------|------|
| 图片预处理 | 把 PNG/JPG 转 WebP/AVIF,限制最大边长 | `frontend/scripts/compress-images.mjs` |
| Vite 压缩 | 对构建产物中所有图做一次兜底压缩 | `vite.config.js`(配 `vite-plugin-imagemin`) |
| 模板改造 | 用 `<picture>` 让浏览器选最优格式 | `PhotoWall.vue`、`About.vue`(用 PIC.png 的地方) |
| 工具函数 | 把图片 URL 转成多源 srcset | `utils/imageSource.js` |
| 验证 | 对比压缩比,检查 LCP 元素 | CI 中跑 Lighthouse CI(可选) |

### 数据流

#### 静态资源(部署在 GitHub Pages)

1. 开发者执行 `npm run build` 时:
   - `compress-images.mjs` 把 `public/photos/tibet-2026.png` 等源图处理为 `*.webp` + `*.avif`,输出到 `dist/photos/`
   - `vite-plugin-imagemin` 对 `src/assets/` 内的图再次压缩
   - Vite 把 `public/` 下所有非源 PNG 拷到 `dist/`
2. 浏览器加载照片墙时:
   - Chrome ≥85 / Firefox ≥93 / Safari ≥14 → 选 AVIF(最小)
   - 其余现代浏览器 → 选 WebP
   - 老旧浏览器(罕见) → 退回原 PNG

#### china-geo.json

- 文件保持 JSON 格式(echarts 解析器要 JSON)
- Vite 配置 `build.rollupOptions.output.assetFileNames: 'assets/[name].[hash][extname]'`,让文件走强缓存
- 不在首屏加载,延迟到进入足迹页时才 `fetch`,且浏览器走 `disk cache` 命中

### 关键决策

1. **用 sharp + 自写脚本,不直接用 vite-plugin-imagemin**
   - 后者内置的图片压缩(squoosh/sharp)对大图支持有限,不如直接控制
   - 把压缩做成 prebuild 钩子,IDE 中也能独立跑

2. **保留原 PNG,不删**
   - `<picture>` 的 fallback 必须有
   - 旧设备 / 邮件订阅场景可能仍然用到

3. **AVIF 限制最大边长 2400px**
   - 浏览器对超大 AVIF 解码有内存压力
   - 照片墙那一张分辨率已经很高,但用户实际看到的是 1200px 宽度

4. **不内联 china-geo.json**
   - 583KB 内联进 JS 会让首屏 JS 体积爆炸
   - 走独立 fetch + 浏览器缓存更稳

### 错误处理

| 场景 | 行为 |
|------|------|
| sharp 安装失败 / 处理报错 | `compress-images.mjs` 抛错退出码 1,CI 失败 |
| AVIF/WebP 文件生成后丢失 | `<picture>` 自动降级到 `<img>` 的 PNG,页面仍正常 |
| 后端图(文章封面)未提供多尺寸 | `<img>` 标签不写 `srcset`,只 `loading="lazy"` |
| 浏览器不支持 `<picture>`(几乎不存在) | 直接显示 `<img>` 的 `src` |

### 测试与验收

构建产物体积对比(基线 vs 优化后,预估):

| 资源 | 基线 | 优化后(AVIF) | 压缩比 |
|------|------|--------------|--------|
| `photos/tibet-2026` | 2.78 MB | ~140 KB | -95% |
| `PIC.png` | 60 KB | ~12 KB | -80% |
| `hero.png` | 13 KB | ~5 KB | -62% |
| `china-geo.json`(gzip) | 583 KB | ~150 KB(Brotli) | -74% |

验收标准:

- [ ] `dist/photos/tibet-2026.avif` 文件大小 < 250KB
- [ ] `dist/PIC.webp` 文件大小 < 15KB
- [ ] PhotoWall 页面 DOM 中能找到 `<picture>` 标签且含 `<source type="image/avif">`
- [ ] Lighthouse(模拟 4G、Slow CPU)主页 + 照片墙 + 足迹 Performance ≥ 85(目标 90+,85 为最低可接受线)
- [ ] 视觉对比:三张图原图/WebP/AVIF 肉眼无可见差异

## 后续

- 跟进可能的改进(本次不做):
  - 引入 `<link rel="preload">` 预加载 LCP 图片
  - Service Worker 离线缓存策略升级
  - 后端 PythonAnywhere 加图片动态缩放端点
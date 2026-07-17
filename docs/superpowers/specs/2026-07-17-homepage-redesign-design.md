# 首页改版 — 首页不放文章,文章迁到独立标签页 — 设计文档

**日期**：2026-07-17
**状态**：Approved (待用户最终 spec 复核)

---

## 背景

当前首页（`Home.vue`）承担了两类截然不同的职责：

1. 个人门户 — 应当展示"我是谁、我在做什么"的人格化入口
2. 文章索引 — 置顶文章 + 文章卡片网格 + 分页 + 右栏 SidePanel

结果首页信息密度高、视觉重心分散，**访客一进来看到的是文章列表而不是人**。这与一个"个人门户"的定位冲突。

## 目标

1. 首页变成**纯 Landing**：只展示个人介绍与「读文章」入口，**完全不放文章卡片/网格/分页**。
2. 新建独立 `/articles` 路由作为**文章主页**：复用旧 Home.vue 的所有文章展示能力（置顶、网格、分页、筛选、SidePanel）。
3. 首屏响应更快：Landing 不依赖任何 HTTP 接口，零网络往返。
4. **不动**既有的归档（时间线）、分类、标签、搜索、照片墙、友链、足迹、关于、Admin。

## 非目标

- ❌ 不改文章详情页（`ArticleDetail.vue`）
- ❌ 不改归档 `/archives` 的时间线交互
- ❌ 不改 SidePanel 组件
- ❌ 不改 article store / API 形状
- ❌ 不引入新依赖（无新 npm 包）
- ❌ 不重写配色，沿用现有 `accent-pink / neon-cyan / accent-purple` 体系

## 决策

| 项目 | 决策 | 原因 |
|---|---|---|
| 首页布局 | 左右分屏：左 5/12 头像区，右 7/12 文字+CTA | 大头像=人格化；CTA 在右手黄金位；视觉冲击强 |
| 文章页位置 | 新增 `/articles`，与 `/archives` 并存 | `/archives` 是时间线视角，`/articles` 是列表视角，二者职责分明 |
| 导航顺序 | 首页 · 文章 · 归档 · ... | 「文章」紧贴「首页」，强化入口 |
| 导航英文 key | `Home / Articles / Archives / ...` | `Articles.vue` 组件命名对齐 |
| 代码复用 | 把旧 `Home.vue` 的文章展示主体**整体搬迁**到 `Articles.vue` | 改动最小，bug 面最小，分页/筛选/SidePanel 全部继承 |
| 头像资源 | 使用 `frontend/public/PIC.svg`（已存在的 DiceBear `notionists` 矢量头像）| 2026-07-17 avatar spec 已统一资产 |
| ParticleBg | 保留在 `<App>` 层；首页可见，`/articles` 不再叠加 | 文章页专注阅读 |
| Live2D | 不动 | 现有装饰与 Landing 不冲突 |

**为什么选左右分屏（B）而非居中（A）或 GitHub Profile（C）：**

- 项目已有粒子背景 / Live2D / 玻璃拟态语言，需要"画布"承载，分屏正好把背景色让出来
- 大头像 = 用户要"个人门户"的核心诉求
- CTA「读文章 →」放在右下黄金位，转化路径最短
- GitHub Profile 风（C）跟现有"赛博朋克粉/紫"渐变气质略冲突

## 实施步骤

### Step 1 — 新增 `frontend/src/pages/Articles.vue`

把 `frontend/src/pages/Home.vue` 旧版（1-470 行）**整体复制**到 `Articles.vue`，做三处文案/类名调整：

| 旧 Home.vue | 新 Articles.vue |
|---|---|
| `<h3 class="pinned-heading">置顶文章</h3>` | 顶部加 `<header class="page-header"><h1 class="page-title neon-text-cyan">文章</h1><p class="page-subtitle">所有文章按时间倒序排列,共 {{ count }} 篇</p></header>` 块 |
| 类名 `.page-home` | 类名 `.page-articles`，避免与新 Home 样式串扰 |
| `ParticleBg` 仍挂在 `<App>`，本组件**不再单独引入** | 不变 |

其余脚本（`loadArticles` / `pinnedArticles` / `regularArticles` / `totalPages` / `visiblePages` / `goToPage` / `clearFilter` / `watch(route.query)` / `onMounted`）**一字不动**。

### Step 2 — 注册路由 `frontend/src/router/index.js`

在第 7 行（`Archives` 之前）插入：
```js
{ path: '/articles', name: 'Articles', component: () => import('../pages/Articles.vue') },
```

### Step 3 — 导航增加「文章」`frontend/src/components/AppHeader.vue`

第 37-47 行 `navLinks` 数组，在 `{ path: '/', label: '首页' }` 之后插入：
```js
{ path: '/articles', label: '文章' },
```

同时 **左上角 logo 文字** 由 `ZhouJun` 改为 `个人博客`（用户决定 — 让站点有更明显的中文侧语义，新访客一眼看出"个人博客"而非人名）。

### Step 4 — 完全重写 `frontend/src/pages/Home.vue`

按 `landing__avatar / landing__intro` 双栏结构实现。模板骨架：

```html
<template>
  <div class="page page-landing">
    <article class="landing">
      <section class="landing__avatar">
        <div class="avatar-frame">
          <img src="/PIC.svg" alt="Zhou Jun"
               class="avatar-image"
               loading="eager" fetchpriority="high"
               @error="onAvatarError" />
          <span class="avatar-status" title="在线" v-if="!avatarFailed" />
        </div>
        <p class="avatar-handle">@zhoujun · 📍上海</p>
      </section>

      <section class="landing__intro">
        <h1 class="landing__name">Zhou Jun</h1>
        <p class="landing__tagline">探索代码 · 写作 · 光影</p>

        <p class="landing__bio">
          工程师 · 写作者。用代码构建工具，用文字记录思考，
          用脚步丈量世界。👋 欢迎来到我的角落。
        </p>

        <div class="landing__cta">
          <router-link to="/articles" class="cta cta--primary">
            📖 读文章 →
          </router-link>
          <router-link to="/about" class="cta cta--secondary">
            关于我
          </router-link>
        </div>

        <ul class="landing__social">
          <li><a href="https://github.com/zhoujungis" target="_blank" rel="noopener">🐙 GitHub</a></li>
          <li><a href="mailto:hi@zhoujun.cn">📮 Email</a></li>
          <li><a href="https://zhoujun123.pythonanywhere.com/rss.xml">📡 RSS</a></li>
        </ul>
      </section>
    </article>
  </div>
</template>
```

**样式规范（沿用变量，无新色值）：**

| 元素 | 规范 |
|---|---|
| `.page-landing` | `min-height: calc(100vh - 60px)`,`display: flex`,`align-items: center`,`padding: 32px 24px`,`max-width: 1100px`,`margin: 0 auto` |
| `.landing` | `display: grid`,`grid-template-columns: 5fr 7fr`,`gap: 48px`,`align-items: center` |
| `.avatar-frame` | `width: 240px`,`height: 240px`,`border-radius: 50%`,`overflow: hidden`,`position: relative`,双层 `::before` 渐变描边 `linear-gradient(135deg, $accent-pink, $accent-purple)`,`padding: 4px`,内层 `background: $bg-card` |
| `.avatar-image` | `width: 100%;height: 100%;border-radius: 50%;object-fit: cover` |
| `.avatar-status` | `position: absolute; right: 14px; bottom: 14px; width: 14px; height: 14px; background: $accent-mint; border-radius: 50%`,加 `box-shadow: 0 0 0 3px $bg-card, 0 0 12px rgba(129,212,196,.6)`,`@keyframes pulse` 2s infinite |
| `.avatar-handle` | `text-align: center`,`color: $text-secondary`,`font-size: .9rem`,`margin-top: 16px` |
| `.landing__name` | `font-size: clamp(2.2rem, 4vw, 3.4rem)`,`font-weight: 700`,`background: linear-gradient(135deg, $accent-pink, $accent-purple)`,`-webkit-background-clip: text`,`-webkit-text-fill-color: transparent`（SCSS 中需用 `@supports` 或与现代浏览器写法） |
| `.landing__tagline` | `font-family: $font-mono`,`letter-spacing: .15em`,`color: $accent-pink`,`font-size: .95rem`,`text-transform: uppercase` |
| `.landing__bio` | `font-size: 1rem`,`line-height: 1.85`,`color: $text-secondary`,`max-width: 540px`,`margin: 8px 0 32px` |
| `.landing__cta` | `display: flex`,`gap: 12px`,`flex-wrap: wrap` |
| `.cta--primary` | `padding: 12px 24px`,`background: $accent-pink`,`color: #fff`,`border-radius: 10px`,`text-decoration: none`,`font-weight: 600`,`box-shadow: 0 4px 16px rgba(255,133,162,.3)`,`hover: translateY(-2px) + 加深阴影`,`transition: transform $transition-fast, box-shadow $transition-fast` |
| `.cta--secondary` | `padding: 12px 24px`,`border: 1px solid $accent-pink`,`color: $accent-pink`,`border-radius: 10px`,`text-decoration: none`,`font-weight: 600`,`hover: background: rgba(255,133,162,.06)` |
| `.landing__social` | `display: flex`,`gap: 20px`,`margin-top: 32px`,`list-style: none`,`padding: 0`,`a: color: $text-secondary, font-size: .9rem, hover: $accent-pink` |
| 暗黑模式 | 现状 `$accent-pink / $accent-purple / $bg-card` 等已通过 dark mode 类自动切换 (`2026-07-17-categories-tags-dark-mode-design.md` 已对齐) ;Landing 沿用同一套,**不引入新色值** |

**响应式断点：**

| 断点 | 行为 |
|---|---|
| `≤ 1023px` | `.landing` 改 `grid-template-columns: 1fr`,`.avatar-frame { width: 180px; height: 180px }`,`.landing__bio { max-width: none }`,文字块 `text-align: center`,`.landing__cta` 居中 |
| `≤ 767px` | `.avatar-frame { width: 120px; height: 120px }`,`.landing__name` 取下界 `2rem` |
| `prefers-reduced-motion: reduce` | 关掉 `.avatar-status` 的 `pulse` 动画 |

**脚本**：

```js
import { ref } from 'vue'
const avatarFailed = ref(false)
function onAvatarError() {
  avatarFailed.value = true
}
// onMounted 中不调用任何 fetch —— Landing 零网络依赖
```

### Step 5 — 暗黑模式

- 头像渐变描边沿用 `var(--accent-pink)` / `var(--accent-purple)`，dark/light token 已有
- `name` 渐变 `var(--accent-pink) → var(--accent-purple)` 双模式都有合适对比
- `cta--primary` 背景色自动跟随主题（dark 模式更亮一档）
- 不引入新色值

### Step 6 — 旧链接兼容（可选）

若用户已收藏 `/`,`/?page=2` 等老链接：

| 老路径 | 新行为 |
|---|---|
| `/` | 渲染新 Landing（文章列表已不在此） |
| `/?category=foo` | 新 Landing 渲染；忽略 query（用户从导航去 /articles 即可） |
| `/?tag=foo&page=2` | 同上 |

是否需要做"老 query 自动 301 到 `/articles?...`"待用户决定（不在本 spec 范围；先实现直跳，验证后再加迁移）。**建议先不做** — 站内文章不多，搜索权重不敏感。

## 边界 / 错误处理

| 场景 | 行为 |
|---|---|
| `PIC.svg` 加载失败 | `@error="onAvatarError"` → 隐藏 `.avatar-status` + 显示首字母占位 `<div class="avatar-fallback">Z</div>`（CSS 提供灰底圆） |
| 主 CTA 跳转到 `/articles` 但路由未注册 | 路由一定注册（Step 2），若未来误删则走 `<NotFound>`，不污染 Landing |
| 关 JS | `<noscript>` 提示「需要启用 JavaScript 才能浏览文章」（沿用现有 `<noscript>` 位置） |
| `/articles` 接口失败 | 旧 Home.vue 已实现：`error.value` + 重试按钮（不重写） |
| `/articles` 空文章 | 旧代码已有 empty-state（不重写） |
| `/articles` 越界分页 | `goToPage` 校验 `1 ≤ page ≤ totalPages`（旧代码已有） |
| SidePanel 加载失败 | SidePanel 自身降级（不阻塞主区） |

## 性能

- Landing 零 HTTP 请求 → 首屏最快
- 头像 `loading="eager" fetchpriority="high"` —— 首屏关键资源
- `ParticleBg` 维持现状（`<App>` 层挂载）
- `/articles` 整体迁移代码 → 重复利用虚拟 DOM 渲染管线，无新打包体积

## 测试

### 单元

- **新增**：`frontend/src/__tests__/Articles.spec.js`
  - 基于现有 `Home.spec.js`（如存在），把路由断言从 `/` 改成 `/articles`
  - 断言：渲染了 `.article-grid` 或 `.pinned-section`、渲染了 `ArticleCard`
  - 断言：空状态显示 `.empty-state`、错误状态显示 `.retry-btn`
- **新增**：`frontend/src/__tests__/Landing.spec.js`
  - mount `Home.vue`，断言 DOM 中**不存在** `.article-grid`、不存在 `ArticleCard`
  - 断言渲染了 `.landing__name`、`.cta--primary`、`.landing__social`
  - 断言头像 `src="/PIC.svg"`

### e2e（手工冒烟即可）

- 访问 `/` → 无 `.article-grid`
- 访问 `/articles` → 显示文章网格
- 点击导航"文章" → 跳到 `/articles`
- 深色模式下头像描边 / 名字渐变 / CTA 不破图
- 移动端 375px 视口 → 单列堆叠、头像 120px

## 验收清单

- [ ] `/` 渲染 `landing__avatar / landing__intro`，**完全不存在** `.article-grid` 与 `ArticleCard`
- [ ] `/` 首屏响应 < 200ms（DevTools Network 验证零业务请求）
- [ ] `/articles` 视觉、行为与旧 Home 完全一致（逐项对照）
- [ ] 导航「文章」在第二位高亮，`router-link-active` 工作
- [ ] `/article/:slug` 详情页不受影响
- [ ] `/archives /categories /tags /photos /friends /footprints /about /search /admin` 全部正常
- [ ] 暗黑模式无破图
- [ ] 移动端 ≤767px 单列堆叠，头像 120px
- [ ] `prefers-reduced-motion: reduce` 关掉 pulse
- [ ] `frontend build` 通过、无 ESLint 警告

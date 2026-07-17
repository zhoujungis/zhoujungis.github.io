# 分类页与标签页夜间模式优化 — 设计文档

**日期**：2026-07-17
**状态**：Approved

## 背景

用户在夜间模式下访问博客的 `/categories` 与 `/tags` 页面时觉得"太丑"。根因如下：

1. **SCSS 变量是浅色优先**：`Categories.vue` 与 `Tags.vue` 都引用了 `$bg-card`（白色 0.85 透明）、`$glass-border`（粉色 0.15 透明）、`$neon-cyan`（薄荷绿 `#81d4c4`）等为浅色主题调校的变量，在夜间模式下视觉割裂。
2. **全局夜间覆写缺失**：`frontend/src/styles/global.scss` 的 `html.theme-dark {}` 块里有针对 `.article-card` / `.glass-card` / `.comment-item` / `.comment-form` 的覆写，但**没有** `.category-card` / `.tag-cloud` / `.tag-item` / `.state-message` / `.retry-btn` / `.skeleton-*` 等规则 —— 所以这两个页面在夜间模式下几乎完全沿用浅色 token。
3. **对比度问题**：
   - 浅色背景卡（`rgba(255,255,255,0.85)`)在深色页面上像贴了一块白板；
   - 粉色边框在 0.15 alpha 下几乎不可见，卡片边界融化；
   - hover 用的薄荷绿霓虹与夜间整体粉/紫/cyan 霓虹语言不一致；
   - 骨架屏的浅色 shimmer 渐变在深底上偏暗。

## 目标

1. 分类页与标签页在夜间模式下视觉与博客其他页面（首页、文章详情、归档）保持一致 —— 深底、低对比边框、霓虹强调色（cyan / pink / purple）。
2. 浅色模式不受任何影响。
3. 改动最小、风险最低 —— 不引入新 token 系统、不动 Vue 组件逻辑、不改路由或 API。

## 决策

| 项目 | 决策 |
|---|---|
| 修改方式 | 沿用现有 `global.scss` 的 `html.theme-dark { ... !important ... }` 覆写模式 |
| 改动文件 | `frontend/src/styles/global.scss`（仅此一处） |
| 新增代码 | 在 `html.theme-dark` 块末尾追加一个子块：`// Categories & Tags` |
| 改动行数 | 约 40–60 行 SCSS |
| 浅色模式 | 不受影响（所有覆写都嵌套在 `html.theme-dark` 选择器内） |
| 是否动 token | 不动 —— 用户在 brainstorming 时已选择"仅修夜间样式"，不引入深色专用 token 系统 |
| 是否动 Vue 组件 | 不动 —— 标签页的霓虹色数组、组件 props、API 调用、跳转逻辑全部保持原样 |

**为什么不选其他方案：**

- **新建深色 token（`$bg-card-dark` 等）**：用户已明确选择"仅修样式"，避免范围蔓延；如果未来其他页面也出现夜间问题，可作为独立 PR 引入 token 系统。
- **CSS 变量（`var(--bg-card)`）切换**：可读性最好但需要全站重构工作量大。
- **组件级 `<style scoped>` 内用 `@media (prefers-color-scheme: dark)`**：分散到两个文件，未来加新页面易遗漏；不如在全局集中维护。

## 实施步骤

### Step 1：在 `global.scss` 追加夜间覆写

定位到 `frontend/src/styles/global.scss` 的 `html.theme-dark { ... }` 块（目前到第 174 行），在 `// Page header subtitles` 之后、`// ---- Focus-visible ----` 之前追加以下子块：

```scss
// Categories & Tags pages
.category-card {
  background: rgba(255, 255, 255, 0.04) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
  &:hover {
    border-color: rgba(0, 229, 255, 0.4) !important;
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.5),
      0 0 24px rgba(0, 229, 255, 0.12) !important;
  }
}

.card-icon {
  background: rgba(0, 229, 255, 0.1) !important;
  border-color: rgba(0, 229, 255, 0.25) !important;
  color: #00e5ff !important;
  .category-card:hover & {
    background: rgba(0, 229, 255, 0.18) !important;
    box-shadow: 0 0 20px rgba(0, 229, 255, 0.25) !important;
  }
}

.category-name {
  color: #e0e0e0 !important;
  .category-card:hover & {
    color: #00e5ff !important;
    text-shadow: 0 0 8px rgba(0, 229, 255, 0.5) !important;
  }
}

.category-count {
  color: #aaa !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  background: rgba(255, 255, 255, 0.03) !important;
}

.tag-cloud {
  background: rgba(255, 255, 255, 0.04) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
}

.tag-item {
  &:hover {
    background: rgba(255, 255, 255, 0.08) !important;
  }
}

// Skeleton screens — brightened shimmer for dark background visibility
.skeleton-card,
.loading-state {
  background: rgba(255, 255, 255, 0.03) !important;
  border-color: rgba(255, 255, 255, 0.06) !important;
}

.skeleton-line,
.skeleton-tag {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.04) 25%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.04) 75%
  ) !important;
  background-size: 200% 100% !important;
}

.state-message {
  color: #999 !important;
  svg { color: #888 !important; }
}
```

### Step 2：本地构建验证

```bash
cd frontend
npm run build
```

预期：构建成功，无 SCSS 编译错误，无新增 lint 警告。

### Step 3：部署

```bash
cd frontend
./deploy.sh
```

（`deploy.sh` 已在仓库中，按现有脚本走 git commit + push 触发 GitHub Pages 部署。）

### Step 4：浏览器人工验证

部署后访问：
- `https://zhoujungis.github.io/categories` —— 切换深色模式，截图比对
- `https://zhoujungis.github.io/tags` —— 切换深色模式，截图比对
- 浅色模式回归 —— 确认分类/标签页未受影响

## 影响范围

| 维度 | 影响 |
|---|---|
| 前端构建产物 | 体积增加 < 1 KB（gzip 后） |
| 浅色模式 | 无影响（所有规则嵌套在 `html.theme-dark` 内） |
| 其他页面 | 无影响（仅 `.category-*`、`.tag-*`、`.skeleton-*`、`.state-message` 类别） |
| 后端 / API | 无影响 |
| 数据库 | 无影响 |
| 依赖 | 无新增 |

## 风险与回滚

- **风险**：低 —— 仅追加 CSS，CSS 选择器与原组件一致，使用 `!important` 模式与现有夜间覆写一致。
- **回滚**：单文件、单 commit，`git revert` 即可。

## 验收标准

1. ✅ `npm run build` 成功，无 SCSS 报错。
2. ✅ `/categories` 与 `/tags` 在 `html.theme-dark` 下背景、边框、文字、hover 效果与博客其他夜间页面视觉一致。
3. ✅ 浅色模式下两个页面与改动前完全一致。
4. ✅ 骨架屏、错误状态、空状态在夜间下对比度合适。
5. ✅ 部署成功（`git push` 后 GitHub Pages 正常更新）。
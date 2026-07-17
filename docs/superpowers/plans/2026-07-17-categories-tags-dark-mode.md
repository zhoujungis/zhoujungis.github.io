# Categories & Tags Dark Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复 `/categories` 与 `/tags` 页面在夜间模式下的视觉割裂问题，让两个页面在夜间模式下与博客其他页面（首页、文章详情、归档）保持一致 —— 深底、低对比边框、霓虹强调色。

**Architecture:** 沿用现有 `global.scss` 中 `html.theme-dark { ... !important ... }` 的全局覆写模式，在该块末尾追加一个针对 `.category-card`、`.tag-cloud`、`.tag-item`、`.skeleton-*`、`.state-message` 的子块。改动集中在一处，不动 Vue 组件、不引入新 token、不改路由或 API。

**Tech Stack:** Vue 3 + Vite + SCSS + GitHub Pages 部署

## Global Constraints

- 改动文件：`frontend/src/styles/global.scss`（仅此一处）
- 不动 Vue 组件 / Pinia store / router / API
- 浅色模式必须保持完全一致（所有覆写嵌套在 `html.theme-dark` 选择器内）
- 夜间颜色与现有 token 对齐：cyan `#00e5ff`、卡片背景 `rgba(255,255,255,0.04)`、边框 `rgba(255,255,255,0.08)`
- 不引入新依赖
- 单 commit 完成代码改动，单 commit 完成部署

---

## File Structure

本计划只修改一个文件：

| 文件 | 角色 |
|---|---|
| `frontend/src/styles/global.scss` | 现有夜间覆写块（`html.theme-dark {}`）的扩展 —— 追加约 50 行 SCSS |

无新建文件、无删除文件、无重命名。

---

### Task 1: 追加夜间模式覆写规则

**Files:**
- Modify: `frontend/src/styles/global.scss:174`（在 `// Page header subtitles` 注释之后、`// ---- Focus-visible ----` 之前）

**Interfaces:**
- Consumes: 现有的 `html.theme-dark { ... }` 块结构（位于 `global.scss` 第 103–174 行）
- Produces: 在该块末尾追加子块 `// Categories & Tags pages`，覆盖 `.category-card`、`.card-icon`、`.category-name`、`.category-count`、`.tag-cloud`、`.tag-item`、`.skeleton-card`、`.loading-state`、`.skeleton-line`、`.skeleton-tag`、`.state-message` 选择器

- [ ] **Step 1: 定位插入点**

打开 `frontend/src/styles/global.scss`，确认 `html.theme-dark {}` 块的结束位置（当前位于第 174 行的 `}` 后），以及后续的 `// ---- Focus-visible (accessibility) ----` 注释（当前位于第 176 行）。

- [ ] **Step 2: 在 `// Page header subtitles` 子块之后追加新 SCSS**

在 `.page-subtitle { color: #999 !important; }` 这一行后面、空行（当前为第 173 行）与 `// ---- Focus-visible (accessibility) ----`（当前第 176 行）之间，**插入以下完整代码块**（注意保留 2 空格缩进以与现有子块风格一致）：

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

- [ ] **Step 3: 校验文件结构**

在编辑器中确认：
- `html.theme-dark {` 在第 103 行
- 闭合 `}` 在文件末尾之前
- 新插入的内容**完全嵌套**在 `html.theme-dark { ... }` 内部（缩进 2 空格）
- 后续的 `// ---- Focus-visible (accessibility) ----` 块未受影响

- [ ] **Step 4: 提交代码改动**

```bash
cd D:/zhoujungis.github.io
git add frontend/src/styles/global.scss
git commit -m "style(dark): add category & tag page dark mode overrides"
```

预期：1 file changed, 50+ insertions(+)

---

### Task 2: 构建验证

**Files:** 无

**Interfaces:**
- Consumes: Task 1 修改后的 `global.scss`
- Produces: `frontend/dist/` 下生成的最新静态资源

- [ ] **Step 1: 运行前端构建**

```bash
cd D:/zhoujungis.github.io/frontend
npm run build
```

预期输出（关键行）：
- `vite v8.x.x building for production...`
- `✓ built in X.XXs`
- 无 `Error`、无 `[sass] Error`、无 `Pre-transform error`
- 退出码 0

若构建失败：检查 SCSS 是否有语法错误（缺失分号、嵌套层数过深等），回到 Task 1 修正。

- [ ] **Step 2: 检查构建产物**

```bash
ls D:/zhoujungis.github.io/frontend/dist/assets/*.css
```

预期：看到至少一个 CSS 文件，大小相比改动前增加 < 2 KB。

---

### Task 3: 部署

**Files:** 无（通过 `deploy.sh` 自动 git push）

**Interfaces:**
- Consumes: Task 1 提交的代码改动 + Task 2 构建验证
- Produces: GitHub Pages 上线的最新静态资源

- [ ] **Step 1: 执行部署脚本**

```bash
cd D:/zhoujungis.github.io/frontend
./deploy.sh
```

预期行为：
- 脚本读取 `.env.production`、执行 `npm run build`、将 `dist/` 复制到仓库根
- 自动 `git add` + `git commit -m "deploy: update site ..."`
- 自动 `git push origin master`
- GitHub Pages 通过 GitHub Action 自动部署

- [ ] **Step 2: 验证远端提交**

```bash
git -C D:/zhoujungis.github.io log --oneline -3
```

预期：看到最近的 `deploy: ...` commit。

- [ ] **Step 3: 浏览器人工核对（远程进行）**

打开：
1. `https://zhoujungis.github.io/categories` —— 切换为夜间模式，确认：
   - 卡片背景为深色半透明，不再突兀白色
   - 边框可见但不抢眼
   - hover 时边框变 cyan 并发出 glow
   - 图标圆环可见，文字 hover 变 cyan
   - 计数徽章文字清晰
2. `https://zhoujungis.github.io/tags` —— 切换为夜间模式，确认：
   - 容器背景深色
   - 标签三色霓虹（cyan / pink / purple）保留
   - hover 时背景提亮、霓虹 glow 生效
3. 切回浅色模式 —— 确认两个页面与改动前完全一致

---

## 自审清单

- [x] **Spec 覆盖**：spec 中所有夜间覆写需求 → Task 1 已包含
- [x] **无占位符**：所有步骤都是具体动作，无 "TBD / TODO / 类似 Task N"
- [x] **类型一致性**：本计划无新类型/接口，仅 CSS 选择器和颜色值
- [x] **范围聚焦**：单文件改动，3 个任务，无范围蔓延
- [x] **浅色模式不受影响**：所有覆写嵌套在 `html.theme-dark` 内

## 风险与回滚

- **风险**：低 —— 仅追加 CSS 规则，CSS 选择器与原组件模板一致
- **回滚**：`git revert HEAD~1..HEAD`（如果 deploy 是新 commit，需要 revert 两次）或 `git revert <commit-hash>`
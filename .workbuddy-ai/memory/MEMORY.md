# MEMORY.md — 项目长期约定

## 博客文章发布流程

1. 写正文到 `article/<slug>.md`，带 YAML frontmatter（title / slug / category_id / tags / status / cover_image）
2. 在 `tools/` 下新建 `publish_<name>.py`，参考既有脚本（`_auth.py` 提供 `API_URL` 与 `get_token()`）
3. 运行脚本发布：`python tools/publish_<name>.py`
   - API：`https://zhoujun123.pythonanywhere.com/api`，凭据在 `tools/.env`（`BLOG_USERNAME` / `BLOG_PASSWORD`）
   - 按 slug 幂等：已存在则 PUT 更新，不存在则 POST 创建
4. 发布后用 `GET /api/articles/<slug>/` 复核 status / tags / reading_time

## 标签约定

- **复用已有标签，不要按字面新建。** 历史上因为发布脚本直接 POST 新标签，产生了重复：
  `backend`(Hou Duan) vs `backend-dev`(后端)、`frontend` vs `frontend-dev`、
  `tech-sharing` vs `tech-sharing-dev`。
- 常用标签 slug：`django`(2)、`backend-dev`(40)、`database`(110)、`drf`(17)、`redis`(111)、`security`(107)、`performance`(114)
- 新脚本的 tag 解析顺序应为：**按 slug 查 → 按 name 查 → 才新建**（见 `tools/publish_slow_query_index_article.py`）

## 分类

常用 `tech`（技术教程，id=1）；`project-practice`(8) 项目实践、`personal`(3) 个人随笔、`deploy`(2) 部署指南、`ai-coding`(5) AI编程。

## 前端构建与 SEO 预渲染（重要）

发布文章后，**仅调 API 是不够的**：站点的 SEO 静态页与离线快照要靠前端构建生成。

```bash
cd frontend && npm run build        # = vite build && node scripts/prerender.mjs
cp -r frontend/dist/article/. ../article/ && cp frontend/dist/articles.json ../articles.json && cp frontend/dist/index.html ../index.html
```

- **必须跑完整的 `npm run build`**，不要单独跑 `node scripts/prerender.mjs`。
  `vite build` 会清空 `dist/` 并生成**干净**的 shell；只跑 prerender 会拿上一次构建残留的
  `dist/index.html` 当模板，导致文章页里混入首页的 `<style>`/`<noscript>` 垃圾。
- prerender 从 API 拉数据，把正文塞进每页的 `<noscript>`；它按 `updated_at` 走
  `frontend/.cache/prerender-details.json` 缓存，改过内容的文章会自动重取。
- 根目录（仓库根）才是 GitHub Pages 的部署目录，`frontend/dist/` 只是构建产物。

### Markdown 目录（TOC）写法

**绝对不要写 `- 1. 标题`。** markdown 会解析成 `<ul><li><ol><li>`，每个内层 `<ol>` 都从 1 重新计数，
渲染出来**每一条目录都是 "1."**。正确写法是扁平列表：

```markdown
**目录**

- 第一节标题
- 第二节标题
```

`tools/publish_*.py` 里的 `check_toc()` 会在发布前拦截这种写法。
历史遗留的 4 篇已用 `tools/fix_toc_numbering.py` 修复（本地 + 服务端）。

## 正文风格（读者是后端工程师）

- 问题先行，标题带具体数字（"从 21 条 SQL 到 2 条"）
- 所有性能结论必须**本机实测**，给中位数并标注环境口径；不写估算值
- 结构：前言钩子 → 目录 → 分节（含对比表 / 正反代码例）→ 方法论 → Checklist → 结语
- 保留"诚实章节"：写还没修的坑、方案的局限、不适用场景
- 篇幅 30 分钟以上；用 `>` 引用块收关键结论

# 博客前后端分离重构 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将现有 Hexo 静态博客重构为 Vue 3 + Django 前后端分离架构

**Architecture:** 前端 Vue 3 SPA 调用 Django REST API，JWT 认证。Vite 构建静态文件部署到 GitHub Pages，Django 部署到 PythonAnywhere。

**Tech Stack:** Vue 3, Vite 5, Vue Router 4, Pinia 2, Axios, marked + highlight.js, Vditor, SCSS, Django 5, Django REST Framework 3, Simple JWT, SQLite

## Global Constraints

- 配色: 青色 #00e5ff, 品红 #ff0080, 紫色 #7b2fff, 深色背景 #0a0a0f
- 所有 API 路径以 /api/ 为前缀
- JWT Token 通过 Authorization: Bearer 传递
- 评论需审核后才公开显示
- 保留现有 live2dw/ 目录

---

## Phase 0: 项目初始化与环境搭建

### Task 0.1: 清理旧文件，初始化新项目结构

- [ ] Step 1: 备份 Live2D

```bash
cp -r live2dw /tmp/live2d-backup
```

- [ ] Step 2: 清理所有旧 Hexo 生成文件（保留 .git, docs, .claude）

```bash
find . -maxdepth 1 -not -name '.git' -not -name 'docs' -not -name '.claude' -not -name '.' -not -name '..' -exec rm -rf {} +
```

- [ ] Step 3: 创建目录结构

```bash
mkdir -p backend frontend
```

- [ ] Step 4: 恢复 live2d 到 public-live2d

```bash
cp -r /tmp/live2d-backup/live2dw public-live2d
```

- [ ] Step 5: 创建 .gitignore

```
__pycache__/
*.py[cod]
*.sqlite3
node_modules/
dist/
.env
*.log
venv/
.venv/
```

- [ ] Step 6: Commit `chore: clear old Hexo files, init new project structure`

---

### Task 0.2: 搭建 Django 后端项目

- [ ] Step 1: 创建 Python 虚拟环境并安装依赖

```bash
cd backend && python -m venv venv && source venv/Scripts/activate
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers markdown pygments python-frontmatter
pip freeze > requirements.txt
```

- [ ] Step 2: 创建 Django 项目

```bash
cd backend && django-admin startproject blog_api .
```

- [ ] Step 3: 修改 `backend/blog_api/settings.py`

关键配置:
- ALLOWED_HOSTS = ['*'] (开发阶段)
- 添加 'rest_framework', 'corsheaders', 到 INSTALLED_APPS
- 添加 'corsheaders.middleware.CorsMiddleware' 到 MIDDLEWARE 最顶部
- CORS_ALLOW_ALL_ORIGINS = True
- REST_FRAMEWORK 配置 JWT 为默认认证
- LANGUAGE_CODE = 'zh-hans'
- TIME_ZONE = 'Asia/Shanghai'

- [ ] Step 4: 创建 Django Apps

```bash
cd backend && python manage.py startapp articles
python manage.py startapp comments
python manage.py startapp photos
python manage.py startapp friends
python manage.py startapp accounts
```

- [ ] Step 5: 注册所有 app 到 INSTALLED_APPS

- [ ] Step 6: Commit `feat: init Django project with all apps`

## Phase 1: 后端数据模型 & 公开 API

### Task 1.1: 定义数据模型 (Categories, Tags, Article, Comment, Photo, FriendLink)

**Files to create:**
- backend/articles/models.py (Category, Tag, Article)
- backend/comments/models.py (Comment)
- backend/photos/models.py (Photo)
- backend/friends/models.py (FriendLink)

**Implementation notes:**
- Article.save() 自动调用 markdown 库将 content 渲染为 html_content
- Article.save() 自动生成 excerpt (截取前50词)
- Comment 支持树形回复 (parent 自引用外键)
- Article 按 is_top 降序 + created_at 降序排列

- [ ] Step 1: Create all models as specified in design doc sections
- [ ] Step 2: Run `python manage.py makemigrations && python manage.py migrate`
- [ ] Step 3: Register models in respective admin.py files
- [ ] Step 4: Commit `feat: add all data models`

---

### Task 1.2: 创建 DRF Serializers

**Files to create:**
- backend/articles/serializers.py (ArticleListSerializer, ArticleDetailSerializer, CategorySerializer, TagSerializer)
- backend/comments/serializers.py (CommentSerializer with nested replies)
- backend/photos/serializers.py (PhotoSerializer)
- backend/friends/serializers.py (FriendLinkSerializer)

**Key interfaces:**
- CategorySerializer.get_article_count() → published article count per category
- TagSerializer.get_article_count() → published article count per tag
- CommentSerializer.get_replies() → nested approved replies
- ArticleListSerializer: compact (no full content/html_content)
- ArticleDetailSerializer: all fields including html_content

- [ ] Step 1: Create serializers as specified above
- [ ] Step 2: Commit `feat: add DRF serializers`

---

### Task 1.3: 创建公开 API Views & URL 路由

**Files to create:**
- backend/articles/views.py → ArticleViewSet (ReadOnly), CategoryViewSet, TagViewSet
- backend/articles/urls.py → DefaultRouter for articles/categories/tags
- backend/comments/views.py → ArticleCommentList (ListCreateAPIView)
- backend/comments/urls.py → articles/<slug>/comments/ endpoint
- backend/photos/views.py → PhotoViewSet (ReadOnly)
- backend/photos/urls.py → /api/photos/
- backend/friends/views.py → FriendLinkViewSet (ReadOnly)
- backend/friends/urls.py → /api/friends/

**Key behaviors:**
- ArticleViewSet.retrieve() increments views_count before returning
- ArticleViewSet supports filtering by category__slug, tags__slug, status
- ArticleViewSet supports search on title and content
- ArticleCommentList filters by article slug + is_approved=True
- New comments auto-set parent=None, is_approved=False

- [ ] Step 1: Create views and URL configurations
- [ ] Step 2: Update backend/blog_api/urls.py to include all app URLs under /api/
- [ ] Step 3: Add django-filters to INSTALLED_APPS
- [ ] Step 4: Runserver and verify all endpoints respond with correct data
- [ ] Step 5: Commit `feat: add public API views and routing`

---

## Phase 2: 后端 Auth & 管理 API

### Task 2.1: JWT 认证配置

**Files to modify:**
- backend/blog_api/settings.py → REST_FRAMEWORK config, SIMPLE_JWT config
- backend/blog_api/urls.py → TokenObtainPairView, TokenRefreshView

**Configuration:**
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
}
```

- [ ] Step 1: Configure JWT and pagination in settings.py
- [ ] Step 2: Add token endpoints to main urls.py
- [ ] Step 3: Create superuser `python manage.py createsuperuser`
- [ ] Step 4: Test: POST /api/token/ with credentials → receive access + refresh tokens
- [ ] Step 5: Commit `feat: add JWT auth configuration`

---

### Task 2.2: 管理 API — 文章 CRUD

**Files to create:**
- backend/articles/admin_views.py → ArticleAdminViewSet (full CRUD, IsAuthenticated)
- backend/articles/admin_urls.py → /api/admin/articles/ routes

**Key behaviors:**
- Only authenticated users can create/update/delete
- POST/PUT accepts: title, slug, content, cover_image, status, is_top, category_id, tags_ids
- On save: auto-render html_content from markdown content
- Image upload endpoint returns URL of uploaded file

- [ ] Step 1: Create admin views with JWT permission
- [ ] Step 2: Create image upload endpoint
- [ ] Step 3: Test all CRUD operations with curl/Postman
- [ ] Step 4: Commit `feat: add admin article CRUD API`

---

### Task 2.3: 管理 API — 评论审核 & 统计

**Files to create/modify:**
- backend/comments/admin_views.py → CommentAdminViewSet
- backend/comments/admin_urls.py

**Endpoints:**
- GET /api/admin/comments/pending/ → unapproved comments
- PUT /api/admin/comments/<id>/approve/ → approve a comment
- DELETE /api/admin/comments/<id>/ → delete a comment
- GET /api/admin/stats/ → { total_articles, total_views, total_comments, categories_count, tags_count }

- [ ] Step 1: Create comment admin views
- [ ] Step 2: Create statistics endpoint
- [ ] Step 3: Test all endpoints
- [ ] Step 4: Commit `feat: add comment moderation and stats API`

---

## Phase 3: 前端 Foundation & 全局布局

### Task 3.1: 创建 Vue 3 + Vite 项目

- [ ] Step 1: `npm create vite@latest frontend -- --template vue`
- [ ] Step 2: `cd frontend && npm install`
- [ ] Step 3: Install dependencies:
```bash
npm install vue-router@4 pinia axios marked highlight.js vditor
npm install -D sass @types/node
```
- [ ] Step 4: Configure vite.config.js with base: '/' and resolve aliases
- [ ] Step 5: Commit `feat: init Vue 3 + Vite project`

---

### Task 3.2: 全局样式 & 主题变量

**Files to create:**
- frontend/src/styles/variables.scss
- frontend/src/styles/global.scss
- frontend/src/styles/neon.scss
- frontend/src/styles/glass.scss

**variables.scss key values:**
```scss
$bg-primary: #0a0a0f;
$bg-secondary: #13131a;
$bg-card: rgba(20, 20, 30, 0.7);
$text-primary: #e0e0e0;
$text-secondary: #888;
$neon-cyan: #00e5ff;
$neon-pink: #ff0080;
$neon-purple: #7b2fff;
$font-mono: 'Fira Code', 'Consolas', monospace;
```

**global.scss key things:**
- Reset + box-sizing: border-box
- Body: bg $bg-primary, color $text-primary
- Scrollbar styling (thin, dark)
- Selection color
- Links default styling
- Layout: min-height 100vh

**neon.scss utilities:**
- .neon-text-cyan, .neon-text-pink, .neon-text-purple
- .neon-border-cyan (box-shadow glow effect)
- .neon-glow (keyframe animation for pulsing glow)

**glass.scss:**
- .glass-card: backdrop-filter: blur(12px), bg semi-transparent, border-radius, border subtle

- [ ] Step 1: Create all SCSS files
- [ ] Step 2: Import global.scss in main.js
- [ ] Step 3: Commit `feat: add global styles and theme variables`

---

### Task 3.3: 路由配置 & App 壳

**Files to create:**
- frontend/src/router/index.js
- frontend/src/App.vue
- frontend/src/main.js (update with router + pinia)

**Routes:**
```javascript
const routes = [
  { path: '/', name: 'Home', component: () => import('../pages/Home.vue') },
  { path: '/article/:slug', name: 'ArticleDetail', component: () => import('../pages/ArticleDetail.vue') },
  { path: '/categories', name: 'Categories', component: () => import('../pages/Categories.vue') },
  { path: '/tags', name: 'Tags', component: () => import('../pages/Tags.vue') },
  { path: '/search', name: 'Search', component: () => import('../pages/Search.vue') },
  { path: '/about', name: 'About', component: () => import('../pages/About.vue') },
  { path: '/photos', name: 'PhotoWall', component: () => import('../pages/PhotoWall.vue') },
  { path: '/friends', name: 'FriendLinks', component: () => import('../pages/FriendLinks.vue') },
  { path: '/archives', name: 'Archives', component: () => import('../pages/Archives.vue') },
  { path: '/admin', name: 'AdminLogin', component: () => import('../pages/admin/AdminLogin.vue') },
  { path: '/admin/dashboard', name: 'AdminDashboard', meta: { requiresAuth: true }, component: () => import('../pages/admin/AdminDashboard.vue') },
  { path: '/admin/editor/:id?', name: 'ArticleEditor', meta: { requiresAuth: true }, component: () => import('../pages/admin/ArticleEditor.vue') },
  { path: '/admin/articles', name: 'ArticleList', meta: { requiresAuth: true }, component: () => import('../pages/admin/ArticleList.vue') },
  { path: '/admin/comments', name: 'CommentManage', meta: { requiresAuth: true }, component: () => import('../pages/admin/CommentManage.vue') },
]
```

**App.vue layout:**
- AppHeader at top
- <router-view> with transition animation
- Live2DWidget (fixed bottom-right)
- BackToTop button
- LoadingScreen on first load

- [ ] Step 1: Create router/index.js with all routes
- [ ] Step 2: Create App.vue with layout structure
- [ ] Step 3: Update main.js
- [ ] Step 4: Commit `feat: add router and App shell`

---

### Task 3.4: Axios API 客户端 & Store

**Files to create:**
- frontend/src/api/client.js
- frontend/src/api/articles.js
- frontend/src/api/comments.js
- frontend/src/api/admin.js
- frontend/src/stores/auth.js
- frontend/src/stores/article.js

**client.js:**
- Axios instance with baseURL from env or 'http://localhost:8000/api/'
- Request interceptor: attach JWT token from localStorage
- Response interceptor: handle 401 (clear token, redirect to login)

**stores/auth.js (Pinia):**
- state: token, user, isAuthenticated
- actions: login(username, password), logout()
- persist token to localStorage

**stores/article.js:**
- state: articles[], currentArticle, loading, pagination
- actions: fetchArticles(params), fetchArticleBySlug(slug), fetchCategories(), fetchTags()

- [ ] Step 1: Create API client and modules
- [ ] Step 2: Create Pinia stores
- [ ] Step 3: Commit `feat: add API client and Pinia stores`

---

## Phase 4: 前端公开页面

### Task 4.1: 全局组件 — AppHeader, ParticleBg, BackToTop, LoadingScreen

**Files to create:**
- frontend/src/components/AppHeader.vue
- frontend/src/components/ParticleBg.vue
- frontend/src/components/BackToTop.vue
- frontend/src/components/LoadingScreen.vue

**AppHeader.vue:**
- Fixed top nav, glass-card background
- Logo: neon-cyan glowing text "ZhouJun"
- Nav links: 首页 / 归档 / 分类 / 标签 / 照片墙 / 友链 / 关于 / 搜索
- Mobile: hamburger menu with slide-out drawer
- Active route highlighted with neon underline

**ParticleBg.vue:**
- Canvas element filling viewport, position fixed, z-index: -1
- Stars/particles with slow movement, occasional neon-colored particles
- Mouse interaction (particles attracted/repelled by cursor)
- Use requestAnimationFrame loop

**BackToTop.vue:**
- Fixed button bottom-right (above Live2D), appears on scroll > 300px
- Neon ring with arrow icon inside
- Smooth scroll to top on click

**LoadingScreen.vue:**
- Full screen overlay with neon logo animation
- Progress bar with neon glow
- Fade out when page loaded

- [ ] Step 1: Create all global components
- [ ] Step 2: Test them in App.vue
- [ ] Step 3: Commit `feat: add global components`

---

### Task 4.2: 首页 — 文章列表 + 侧边栏

**Files to create:**
- frontend/src/pages/Home.vue
- frontend/src/components/ArticleCard.vue
- frontend/src/components/SidePanel.vue

**Home.vue:**
- ParticleBg component as background
- Main content area: grid of ArticleCards (2-column on desktop, 1-col on mobile)
- Pagination at bottom (page numbers with neon styling)
- SidePanel on right side (on desktop), hidden on mobile
- Top section: pinned/is_top article highlighted with neon border

**ArticleCard.vue:**
- Props: article object
- Glass-card styling
- Cover image (if present) with overlay gradient
- Title with neon hover effect
- Meta: date, category badge, tags, views count
- Excerpt text (2-line clamp)
- Click navigates to /article/:slug

**SidePanel.vue:**
- Mini about section (avatar + short intro + social links)
- Category list with counts
- Tag cloud
- Friend links (compact)

- [ ] Step 1: Create Home.vue with layout
- [ ] Step 2: Create ArticleCard.vue
- [ ] Step 3: Create SidePanel.vue
- [ ] Step 4: Connect to article store, fetch articles on mount
- [ ] Step 5: Commit `feat: add home page with article list and sidebar`

---

### Task 4.3: 文章详情页 + Markdown 渲染 + 评论区

**Files to create:**
- frontend/src/pages/ArticleDetail.vue
- frontend/src/components/MarkdownView.vue
- frontend/src/components/CommentList.vue
- frontend/src/components/CommentForm.vue
- frontend/src/components/TocNav.vue

**ArticleDetail.vue:**
- Two-column layout: content (left) + TocNav (right, sticky)
- Article header: title, author, date, category, tags, views
- MarkdownView for body
- Comment section below article
- SEO: set document.title = article.title

**MarkdownView.vue:**
- Props: html (string of rendered HTML)
- Render with v-html
- Style all Markdown elements with neon theme:
  - h1-h6: neon-cyan headings
  - code blocks: dark bg with pink accent, highlight.js syntax coloring
  - blockquote: neon-purple left border
  - tables: glass-card style
  - links: neon-cyan underline
  - images: rounded with shadow
- Responsive adjustments

**CommentList.vue:**
- Props: articleSlug
- Fetch comments from API
- Render nested tree (parent comments with replies indented)
- Each comment: avatar placeholder, name, time, content
- Loading and empty states

**CommentForm.vue:**
- Form: name, email, content (textarea)
- Submit via POST to API
- Success/error feedback
- Input validation

**TocNav.vue:**
- Props: html (extract h2/h3/h4 headings)
- Generate TOC from heading tags
- Active heading highlighted on scroll (IntersectionObserver)
- Sticky position

- [ ] Step 1: Create MarkdownView.vue with full styling
- [ ] Step 2: Create CommentList + CommentForm
- [ ] Step 3: Create TocNav
- [ ] Step 4: Create ArticleDetail.vue composing all
- [ ] Step 5: Commit `feat: add article detail with markdown and comments`

---

### Task 4.4: 其他页面 (分类/标签/搜索/归档/关于/照片/友链)

**Files to create:**
- frontend/src/pages/Categories.vue
- frontend/src/pages/Tags.vue
- frontend/src/pages/Search.vue
- frontend/src/pages/Archives.vue
- frontend/src/pages/About.vue
- frontend/src/pages/PhotoWall.vue
- frontend/src/pages/FriendLinks.vue

**Categories.vue:**
- Grid of category cards, each showing name + article count
- Click navigates to filtered home (or inline loads articles)

**Tags.vue:**
- Tag cloud: tags sized by article count
- Neon colors cycling per tag
- Click filters articles

**Search.vue:**
- Search input with neon border on focus
- Results displayed as ArticleCards
- Debounced API calls (300ms)

**Archives.vue:**
- Timeline layout (vertical line with dots)
- Grouped by year/month
- Each entry: date + title + tags

**About.vue:**
- Personal info (photo, bio, skills)
- Sections: 关于我 / 技能 / 经历 / 联系方式
- Skills shown as progress bars with neon colors
- Timeline for experience

**PhotoWall.vue:**
- Masonry/mosaic grid of photos
- Lightbox on click (full size image)
- Lazy loading

**FriendLinks.vue:**
- Card grid of friend sites
- Each card: site name, description, link arrow

- [ ] Step 1: Create all 7 page components
- [ ] Step 2: Commit `feat: add all public pages`

---

## Phase 5: 前端管理面板

### Task 5.1: Admin Login + Dashboard

**Files to create:**
- frontend/src/pages/admin/AdminLogin.vue
- frontend/src/pages/admin/AdminDashboard.vue
- frontend/src/components/AdminSidebar.vue

**AdminLogin.vue:**
- Centered card on dark bg
- Username + password fields
- Neon submit button
- Error display
- On success: store JWT, redirect to /admin/dashboard

**AdminDashboard.vue:**
- AdminSidebar on left
- Stats cards: total articles, total views, total comments, pending comments
- Quick action buttons: new article, view site
- Recent articles table

**AdminSidebar.vue:**
- Logo + "管理后台" title
- Nav: 仪表盘 / 文章管理 / 新建文章 / 评论审核 / 返回站点
- Active state with neon left border

- [ ] Step 1: Create AdminSidebar component
- [ ] Step 2: Create AdminLogin with JWT auth flow
- [ ] Step 3: Create AdminDashboard with stats
- [ ] Step 4: Add navigation guard for meta.requiresAuth routes
- [ ] Step 5: Commit `feat: add admin login and dashboard`

---

### Task 5.2: Article Editor & Article Manager

**Files to create:**
- frontend/src/pages/admin/ArticleEditor.vue
- frontend/src/pages/admin/ArticleList.vue

**ArticleEditor.vue:**
- Two-pane: editor (left) + live preview (right)
- Vditor Markdown editor with toolbar
- Image drag-and-drop upload to backend
- Metadata form:
  - Title input
  - Slug input (auto-generate from title)
  - Category select (dropdown from API)
  - Tags multi-select
  - Cover image URL input
  - Status toggle: draft / published / archived
  - is_top checkbox
- Save as draft / Publish button
- Route param :id for editing existing article

**ArticleList.vue:**
- Table of all articles (all statuses)
- Columns: title, status badge, category, tags, views, date, actions
- Actions: edit (navigate to editor), delete (confirm dialog)
- Filter by status tabs
- Pagination

- [ ] Step 1: Create ArticleEditor with Vditor
- [ ] Step 2: Create ArticleList with CRUD
- [ ] Step 3: Commit `feat: add article editor and manager`

---

### Task 5.3: Comment Manager

**Files to create:**
- frontend/src/pages/admin/CommentManage.vue

**CommentManage.vue:**
- Tabs: pending / approved
- List of comments with: article title, author, content, date
- Approve / Delete buttons
- Click article title navigates to article

- [ ] Step 1: Create CommentManage page
- [ ] Step 2: Commit `feat: add comment manager`

---

## Phase 6: CLI 工具 & 部署

### Task 6.1: CLI 文章管理工具

**Files to create:**
- backend/tools/article_cli.py

**Commands:**

```
# Create new markdown article template
python article_cli.py new "文章标题"

# Publish/sync a markdown file to server
python article_cli.py publish <file.md> --api-url https://your-server.com/api

# List all articles on server
python article_cli.py list --api-url https://your-server.com/api

# Batch sync directory
python article_cli.py sync <directory> --api-url https://your-server.com/api
```

**article_cli.py structure:**
- Uses argparse for CLI
- Reads YAML/matter frontmatter from markdown files
- Posts to /api/admin/articles/ via requests
- JWT auth (stores token in ~/.blog_token)
- login command to authenticate

- [ ] Step 1: Create article_cli.py with argparse structure
- [ ] Step 2: Implement new, publish, list, sync, login commands
- [ ] Step 3: Commit `feat: add CLI article management tool`

---

### Task 6.2: 部署脚本 & 配置

**Files to create:**
- frontend/deploy.sh
- backend/pythonanywhere_wsgi.py
- README.md (project overview + setup instructions)

**frontend/deploy.sh:**
```bash
#!/bin/bash
# Build and deploy to GitHub Pages
cd frontend
npm run build
cp -r dist/* ../  # Copy to repo root
# Also copy live2d
cp -r ../public-live2d/* ../live2dw/
# Commit and push
git add -A
git commit -m "deploy: update site $(date +%Y-%m-%d)"
git push origin master
```

**Deployment checklist:**
1. Backend: Push code to PythonAnywhere, configure WSGI, set up venv, migrate DB, create superuser
2. Frontend: Update API_BASE_URL in prod env, run deploy.sh, push to GitHub
3. CORS: Add GitHub Pages domain to CORS_ALLOWED_ORIGINS

- [ ] Step 1: Create frontend/deploy.sh
- [ ] Step 2: Create README.md with full setup instructions
- [ ] Step 3: Create backend deployment notes
- [ ] Step 4: Commit `feat: add deployment scripts and docs`

---

### Task 6.3: 数据迁移 (旧文章)

- [ ] Step 1: Convert 2018/12/03/hello-world/index.html content to Markdown
- [ ] Step 2: Create the article via admin API or Django admin
- [ ] Step 3: Commit `feat: migrate old hello-world article`

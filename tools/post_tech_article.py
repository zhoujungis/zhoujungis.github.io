import json, urllib.request, urllib.error

API = 'https://zhoujun123.pythonanywhere.com/api'
UN, PW = 'zhoujun', 'admin'

def api(method, path, data=None):
    url = f'{API}{path}'
    req = urllib.request.Request(url, method=method)
    req.add_header('Content-Type', 'application/json')
    if data is not None:
        req.data = json.dumps(data).encode()
    if '/token/' not in path:
        tr = urllib.request.Request(f'{API}/token/',
            data=json.dumps({'username': UN, 'password': PW}).encode(),
            headers={'Content-Type': 'application/json'})
        token = json.loads(urllib.request.urlopen(tr).read())['access']
        req.add_header('Authorization', f'Bearer {token}')
    try:
        resp = urllib.request.urlopen(req)
        if method == 'DELETE': return True
        return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f'{method} {path} -> {e.code}: {body[:300]}')
        return None

content = r"""
## 前言

作为一名遥感与地理信息系统方向的学生，我一直希望拥有一个属于自己的技术博客——既能记录学习心得，又能与志同道合的朋友交流。经过一段时间的折腾，这个博客终于上线了！

本文将详细介绍这个博客的技术架构、核心功能实现以及部署方案，希望能给正在搭建个人博客的同学一些参考。

---

## 整体架构概览

博客采用**前后端分离**架构，前端和后端分别部署在不同的平台：

```
┌──────────────────────────────────────────────────────────┐
│                      用户浏览器                            │
│               https://zhoujungis.github.io                │
└───────────────┬──────────────────────────┬───────────────┘
                │                          │
                │ 静态资源 (HTML/CSS/JS)     │ API 请求
                │                          │
        ┌───────▼────────┐      ┌─────────▼──────────┐
        │  GitHub Pages   │      │   PythonAnywhere    │
        │                 │      │                     │
        │  Vue 3 SPA      │ ───▶ │  Django REST API    │
        │  (Vite 构建)     │      │  (DRF + JWT)        │
        │                 │      │                     │
        └─────────────────┘      │  SQLite 数据库       │
                                 └─────────────────────┘
```

| 层级 | 技术栈 | 部署平台 |
|------|--------|----------|
| 前端 | Vue 3 + Vite + Vue Router + Pinia | GitHub Pages |
| 后端 | Django 6.0 + Django REST Framework | PythonAnywhere |
| 数据库 | SQLite | PythonAnywhere 文件系统 |
| 认证 | Simple JWT (Access + Refresh Token) | - |

---

## 前端技术栈详解

### 核心技术选型

前端基于 **Vue 3** 生态构建，选择了现代化的工具链：

```json
{
  "dependencies": {
    "vue": "^3.5.39",
    "vue-router": "^4.6.4",
    "pinia": "^3.0.4",
    "axios": "^1.18.1",
    "vditor": "^3.11.2",
    "highlight.js": "^11.11.1",
    "echarts": "^6.1.0"
  },
  "devDependencies": {
    "vite": "^8.1.1",
    "@vitejs/plugin-vue": "^6.0.7",
    "sass": "^1.101.0"
  }
}
```

#### 为什么选择这些技术？

- **Vite** 替代 Webpack：极速冷启动，基于 ESM 的开发服务器，HMR 几乎瞬间完成
- **Pinia** 替代 Vuex：更简洁的 API，完整的 TypeScript 支持，更好的 tree-shaking
- **Vditor**：国产 Markdown 编辑器，支持所见即所得/即时渲染/分屏预览三种模式，内置代码高亮和数学公式

### 路由设计

博客采用 Vue Router 的懒加载策略，每个页面按需加载，减小首屏体积：

```javascript
const routes = [
  { path: '/',              component: () => import('../pages/Home.vue') },
  { path: '/article/:slug', component: () => import('../pages/ArticleDetail.vue') },
  { path: '/categories',    component: () => import('../pages/Categories.vue') },
  { path: '/tags',          component: () => import('../pages/Tags.vue') },
  { path: '/search',        component: () => import('../pages/Search.vue') },
  { path: '/archives',      component: () => import('../pages/Archives.vue') },
  { path: '/photos',        component: () => import('../pages/PhotoWall.vue') },
  { path: '/friends',       component: () => import('../pages/FriendLinks.vue') },
  { path: '/footprints',    component: () => import('../pages/Footprints.vue') },
  { path: '/about',         component: () => import('../pages/About.vue') },
]
```

路由守卫保护管理后台页面，未登录用户自动跳转到登录页：

```javascript
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      next({ name: 'AdminLogin' })  // 未登录 → 跳转登录
    } else {
      next()
    }
  } else {
    next()
  }
})
```

### 状态管理

使用 Pinia 管理文章列表和当前文章的状态：

```javascript
export const useArticleStore = defineStore('article', {
  state: () => ({
    articles: [],
    currentArticle: null,
    categories: [],
    tags: [],
    loading: false,
    pagination: { count: 0, page: 1, pageSize: 10 },
  }),
  actions: {
    async fetchArticles(params = {}) { /* ... */ },
    async fetchArticleBySlug(slug) { /* ... */ },
    async fetchCategories() { /* ... */ },
    async fetchTags() { /* ... */ },
  },
})
```

### API 通信层

Axios 封装了统一的请求/响应拦截器：

- **请求拦截器**：自动从 localStorage 读取 JWT Token 并附加到请求头
- **响应拦截器**：遇到 401 状态码自动清除 Token 并重定向到登录页

```javascript
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/',
})

// 自动附加 JWT Token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 401 自动处理
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/admin'
    }
    return Promise.reject(error)
  },
)
```

### 特色组件

博客包含了一系列精心设计的 UI 组件：

| 组件 | 功能 |
|------|------|
| `ParticleBg.vue` | Canvas 粒子动画背景 |
| `Live2DWidget.vue` | 看板娘 Live2D 交互挂件 |
| `ReadingProgress.vue` | 文章阅读进度条 |
| `ThemeToggle.vue` | 亮色/暗色主题切换 |
| `LoadingScreen.vue` | 页面加载骨架屏 |
| `MarkdownView.vue` | Markdown 渲染组件（基于 Vditor） |
| `TocNav.vue` | 文章目录导航 |
| `ShareButtons.vue` | 社交分享按钮 |
| `CommentList.vue` | 评论列表（含嵌套回复） |

---

## 后端技术栈详解

### 技术选型

后端基于 **Django 6.0** 和 **Django REST Framework** 构建：

```
django
├── Django 6.0.6              # Web 框架
├── djangorestframework 3.17  # REST API 框架
├── django-cors-headers 4.9   # 跨域支持
├── django-filter 25.2        # 查询过滤
├── djangorestframework-simplejwt 5.5  # JWT 认证
├── Markdown 3.10             # Markdown 渲染
├── Pillow 12.3               # 图片处理
└── Pygments 2.20             # 代码语法高亮
```

### 数据模型设计

核心是 **Article** 模型，支持草稿/已发布/归档/定时发布四种状态：

```python
class Article(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "草稿"
        PUBLISHED = "published", "已发布"
        ARCHIVED = "archived", "已归档"
        SCHEDULED = "scheduled", "定时发布"

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    content = models.TextField()              # Markdown 原始内容
    html_content = models.TextField(editable=False)  # 渲染后的 HTML
    excerpt = models.TextField(editable=False)       # 自动生成摘要
    category = models.ForeignKey(Category, ...)
    tags = models.ManyToManyField(Tag, ...)
    status = models.CharField(max_length=16, choices=Status.choices)
    is_top = models.BooleanField(default=False)       # 置顶
    views_count = models.PositiveIntegerField(default=0)
    likes_count = models.PositiveIntegerField(default=0)
    cover_image = models.URLField(blank=True)
    scheduled_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

保存文章时自动完成以下处理：

1. **Markdown → HTML**：使用 Python-Markdown 库，启用代码高亮、表格、目录等扩展
2. **自动摘要**：去除 Markdown 语法符号，提取前 50 个词作为摘要
3. **定时发布**：到达预定时间自动将状态从 `scheduled` 切换为 `published`

### RESTful API 设计

API 遵循 RESTful 规范，使用 Django REST Framework 的 ViewSet + Router：

```
GET    /api/articles/              文章列表（分页、搜索、分类/标签过滤）
GET    /api/articles/{slug}/       文章详情（自动 +1 阅读数）
GET    /api/categories/            分类列表（含文章计数）
GET    /api/tags/                  标签列表（含文章计数）
POST   /api/articles/{slug}/like/  点赞文章（Cookie 去重）
POST   /api/subscribe/             邮件订阅
POST   /api/token/                 JWT 登录获取 Token
POST   /api/token/refresh/         刷新 Token
POST   /api/admin/articles/        创建文章（需认证）
PUT    /api/admin/articles/{id}/   更新文章（需认证）
DELETE /api/admin/articles/{id}/   删除文章（需认证）
```

API 安全措施：
- **速率限制**：匿名用户 30次/分钟，认证用户 100次/分钟，评论 3次/分钟，订阅 5次/小时
- **JWT 认证**：Access Token 60分钟过期，Refresh Token 1天过期
- **CORS 配置**：仅允许前端域名跨域访问

### 文章详情 API 的智能关联

文章详情接口不仅返回文章内容，还会自动计算：

- **上一篇/下一篇文章**：按发布时间排序的上下文导航
- **相关文章推荐**：基于共同标签匹配，最多 3 篇
- **阅读时间估算**：中文字符 + 英文单词 ÷ 250 ≈ 分钟数

---

## 部署架构

### 双平台部署方案

```
┌─────────────────────────────────────────┐
│              开发机 (Windows)             │
│                                         │
│  git push origin master                 │
│  cd frontend && bash deploy.sh          │
│                                         │
└──────┬──────────────┬───────────────────┘
       │              │
       │  源码推送     │  API 调用 (构建产物推送)
       ▼              ▼
┌──────────────┐  ┌──────────────────┐
│   GitHub      │  │  PythonAnywhere   │
│              │  │                   │
│  源码仓库     │  │  Django 后端       │
│  + 构建产物   │  │  ├─ git pull      │
│              │  │  ├─ migrate       │
│  GitHub       │  │  └─ Reload       │
│  Pages        │  │                   │
│  自动部署     │  │  zhoujun123       │
│              │  │  .pythonanywhere   │
└──────────────┘  └──────────────────┘
```

### 前端部署流程

`deploy.sh` 脚本自动化了整个前端部署流程：

```bash
#!/bin/bash
set -e

# 1. 构建 Vue 应用
npm run build

# 2. 将构建产物复制到仓库根目录（GitHub Pages 从这里读取）
cp -r dist/* ../

# 3. 复制 Live2D 资源（如果有）
if [ -d "../public-live2d" ]; then
  cp -r ../public-live2d/* ../live2dw/
fi

# 4. 提交并推送到 GitHub
git add -A
git commit -m "deploy: update site $(date +%Y-%m-%d_%H:%M)"
git push origin master
```

关键设计点：
- GitHub Pages 从仓库根目录提供服务，所以构建产物必须复制到根目录
- 源码在 `frontend/` 目录下，构建产物在根目录，通过 `.gitignore` 精确控制
- 部署即是一次 git commit + push，简洁可追溯

### 后端部署流程

后端部署在 PythonAnywhere 的免费计划上，通过 Web 控制台操作：

```bash
cd ~/zhoujungis.github.io/backend
git pull origin master           # 拉取最新代码
source venv/bin/activate         # 激活虚拟环境
pip install -r requirements.txt  # 安装依赖（如有新增）
python manage.py migrate         # 数据库迁移（如有模型变更）
python manage.py collectstatic --noinput  # 收集静态文件
# 然后在 Web 选项卡点击 Reload 按钮
```

---

## 核心功能实现

### Markdown 渲染管道

文章从编写到展示经历了完整的渲染管道：

```
Markdown 原文
    │
    ▼
Python-Markdown 渲染 (后端保存时)
    ├── fenced_code    → 围栏代码块
    ├── codehilite     → Pygments 语法高亮
    ├── tables         → 表格支持
    ├── extra          → 额外语法扩展
    └── toc            → 自动生成目录
    │
    ▼
html_content 字段存入数据库
    │
    ▼
前端 Vditor 预览模式展示
    ├── highlight.js   → 前端代码高亮
    └── 响应式图片      → 移动端适配
```

### 点赞系统（Cookie 去重）

点赞功能使用 Cookie 防刷，无需登录即可互动：

```python
@api_view(["POST"])
@permission_classes([AllowAny])
@throttle_classes([AnonRateThrottle])
def like_article(request, slug):
    article = get_object_or_404(Article, slug=slug, status=Article.Status.PUBLISHED)
    cookie_key = f"liked_{article.slug}"

    if request.COOKIES.get(cookie_key):
        return Response({"detail": "已点赞"})

    article.likes_count += 1
    article.save(update_fields=["likes_count"])

    resp = Response({"likes_count": article.likes_count})
    resp.set_cookie(cookie_key, "1", max_age=86400 * 365, httponly=True, samesite="Lax")
    return resp
```

设计亮点：
- Cookie 有效期 365 天，相当于每篇文章每人只能点赞一次
- `httponly=True` 防止 XSS 篡改
- 配合 API 速率限制，防止恶意刷赞

### 搜索功能

搜索基于 Django REST Framework 的 `SearchFilter`，对文章标题和内容进行全文搜索：

```python
class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = {
        "category__slug": ["exact"],
        "tags__slug": ["exact"],
    }
    search_fields = ["title", "content"]
```

前端搜索页面将关键词通过查询参数发送：

```javascript
getArticles({ search: keyword })  // → GET /api/articles/?search=vue
```

### RSS 与 Sitemap

为了让搜索引擎更好地收录，博客实现了：

- **RSS Feed** (`/rss.xml`)：使用 Django 的 `Feed` 类，输出最新的已发布文章
- **Sitemap** (`/sitemap.xml`)：包含文章动态 Sitemap + 静态页面 Sitemap，站点域名自动配置为 `zhoujungis.github.io`

### 邮件订阅

简单的邮件订阅功能，支持基本的格式校验和频率限制（5次/小时/IP）：

```python
@api_view(["POST"])
@throttle_classes([SubscribeThrottle])
def subscribe_newsletter(request):
    email = request.data.get("email", "").strip().lower()
    if not email or "@" not in email:
        return Response({"error": "请输入有效的邮箱地址"}, status=400)
    _, created = Subscriber.objects.get_or_create(email=email)
    # ...
```

---

## 性能优化与用户体验

### 首屏加载优化

```
优化手段                        效果
──────────────────────────────────────────
路由懒加载 (Dynamic Import)      减小初始 JS Bundle 体积
Vite 代码分割                    按页面自动拆包
骨架屏 (Skeleton Screen)        避免白屏，提升感知速度
SCSS 变量 + CSS 变量             统一主题，减少重复样式
```

### 状态覆盖设计

每个页面都考虑了完整的 UI 状态：

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Loading  │───▶│  Empty   │    │  Error   │───▶│  Retry   │
│ (骨架屏)  │    │ (空状态)  │    │ (错误提示)│    │ (重试按钮)│
└──────────┘    └──────────┘    └──────────┘    └──────────┘
       │                                               │
       └───────────────▶  Data  ◀──────────────────────┘
                        (正常展示)
```

### 交互细节

- **粒子背景**：Canvas 绘制的动态粒子网络，轻量无卡顿
- **阅读进度条**：页面顶部细线，实时反映阅读进度
- **暗色主题**：CSS 变量驱动，一键切换，LocalStorage 持久化
- **Live2D 看板娘**：可拖拽的二次元角色挂件
- **返回顶部**：长页面自动出现的悬浮按钮
- **页面过渡动画**：路由切换时的淡入淡出效果

---

## 管理后台

博客内置了完整的管理后台，通过 `/admin` 路径访问：

| 页面 | 路由 | 功能 |
|------|------|------|
| 登录页 | `/admin` | JWT 认证登录 |
| 仪表盘 | `/admin/dashboard` | 数据概览 |
| 文章列表 | `/admin/articles` | 文章的增删改查、状态管理 |
| 文章编辑器 | `/admin/editor/:id?` | Vditor 编辑器，支持 Markdown 实时预览 |
| 评论管理 | `/admin/comments` | 评论审核与管理 |

编辑器集成了 Vditor，支持：
- 所见即所得 / 即时渲染 / 分屏预览三种模式
- 工具栏：表情、表格、甘特图、流程图、数学公式
- 上传图片到后端
- 自动保存草稿

---

## 项目目录结构

```
zhoujungis.github.io/
├── frontend/                    # Vue 3 前端
│   ├── src/
│   │   ├── api/                 # API 请求封装
│   │   │   ├── client.js        #   Axios 实例 + 拦截器
│   │   │   ├── articles.js      #   文章/分类/标签 API
│   │   │   ├── admin.js         #   管理后台 API
│   │   │   └── comments.js      #   评论 API
│   │   ├── components/          # 通用组件 (18个)
│   │   ├── pages/               # 页面组件
│   │   │   └── admin/           #   管理后台页面
│   │   ├── router/              # Vue Router 路由配置
│   │   ├── stores/              # Pinia 状态管理
│   │   ├── App.vue              # 根组件
│   │   └── main.js              # 入口文件
│   ├── deploy.sh                # 前端部署脚本
│   ├── vite.config.js           # Vite 构建配置
│   └── package.json             # 依赖管理
│
├── backend/                     # Django 后端
│   ├── blog_api/                # Django 项目配置
│   │   ├── settings.py          #   项目设置
│   │   └── urls.py              #   路由聚合
│   ├── articles/                # 文章 App
│   │   ├── models.py            #   数据模型
│   │   ├── views.py             #   API 视图
│   │   ├── serializers.py       #   序列化器
│   │   └── urls.py              #   API 路由
│   ├── comments/                # 评论 App
│   ├── photos/                  # 照片墙 App
│   ├── friends/                 # 友链 App
│   ├── accounts/                # 用户 App
│   └── requirements.txt         # Python 依赖
│
├── tools/                       # CLI 工具脚本
│   ├── create_article.py        #   创建文章
│   ├── post_article.py          #   发布文章
│   ├── update_article.py        #   更新文章
│   └── setup_categories.py      #   初始化分类
│
├── .claude/                     # Claude Code 配置
│   └── skills/deploy/           #   部署技能定义
│
├── index.html                   # GitHub Pages 入口
├── assets/                      # 构建产物 (Vite 输出)
└── CNAME                        # 自定义域名配置
```

---

## 总结与展望

### 技术选型心得

| 维度 | 选择 | 理由 |
|------|------|------|
| 前端框架 | Vue 3 | 渐进式、中文社区活跃、上手友好 |
| 构建工具 | Vite | 秒级冷启动、HMR 极速 |
| 后端框架 | Django | 全栈框架、ORM 强大、开箱即用 |
| API 风格 | REST | 成熟稳定、前端生态兼容好 |
| 部署方案 | GitHub Pages + PA | 免费、无需运维、稳定可靠 |

### 未来计划

- **评论系统升级**：接入 GitHub Discussions 或 Giscus，用 GitHub OAuth 替代匿名评论
- **全文搜索增强**：考虑引入 Elasticsearch 或 MeiliSearch
- **CI/CD 自动化**：用 GitHub Actions 实现 push 自动构建部署
- **PWA 支持**：Service Worker 离线缓存，提升移动端体验
- **性能监控**：接入 Google Analytics 或自建 Umami 统计

### 开源与交流

这个博客的所有代码都是开源的，欢迎访问我的 GitHub 仓库：

> **[github.com/zhoujungis/zhoujungis.github.io](https://github.com/zhoujungis/zhoujungis.github.io)**

如果你也在搭建个人博客，或者对遥感、GIS、Web 开发感兴趣，欢迎来交流讨论！🚀
"""

article = {
    'title': '博客搭建技术全解析：Vue 3 + Django 前后端分离实战',
    'slug': 'blog-tech-stack',
    'content': content,
    'status': 'published',
    'is_top': True,
    'cover_image': '',
}

# Check if article exists, update it
existing = api('GET', '/articles/blog-tech-stack/')
if existing and existing.get('slug'):
    print(f"Article exists (id={existing['id']}), updating...")
    result = api('PUT', f'/admin/articles/{existing["id"]}/', article)
    if result:
        print(f"Updated! id={result['id']}, title={result['title']}")
    else:
        print("UPDATE FAILED")
else:
    result = api('POST', '/admin/articles/', article)
    if result:
        print(f"Created! id={result['id']}, title={result['title']}")
    else:
        print("CREATE FAILED")

print("Done!")

# 博客前后端分离重构 — 设计文档

**日期:** 2026-07-02
**作者:** Zhou Jun

---

## 1. 概述

将现有 Hexo 静态博客重构为前后端分离架构。前端 Vue 3 SPA 部署到 GitHub Pages，后端 Django REST API 部署到 PythonAnywhere。同时提供在线编辑器 + CLI 工具两种文章管理方式。

## 2. 目标

- 前后端解耦，独立开发与部署
- 深色极客风 UI：粒子背景、霓虹配色、Live2D 保留
- 完整的博客功能：文章、分类标签、搜索、评论、照片墙、友链、RSS、置顶/草稿
- Markdown 在线编辑 + CLI 本地管理

## 3. 仓库结构

```
前端源码 (私有仓库或独立目录):
├── src/
│   ├── components/      # 可复用组件
│   ├── pages/           # 页面组件
│   ├── api/             # API 请求封装 (axios)
│   ├── stores/          # Pinia 状态管理
│   ├── styles/          # 全局样式 & 主题变量
│   ├── utils/           # 工具函数 & Markdown 渲染
│   └── router/          # 路由配置
├── public/
│   └── live2d/          # Live2D 模型文件
├── dist/                # 构建产物 → 推送到 zhoujungis.github.io
└── vite.config.js

后端 (部署到 PythonAnywhere):
├── blog_api/            # Django 项目配置
├── articles/            # 文章 App
├── comments/            # 评论 App
├── photos/              # 照片 App
├── friends/             # 友链 App
├── accounts/            # 用户认证 App (JWT)
└── manage.py

当前仓库 (zhoujungis.github.io):
└── [前端 dist/ 构建产物]  # 清空旧文件后填入
```

## 4. 数据模型

### Article (文章)
| 字段 | 类型 | 说明 |
|------|------|------|
| title | CharField | 标题 |
| slug | SlugField | URL 别名，唯一 |
| content | TextField | Markdown 原文 |
| html_content | TextField | 渲染后的 HTML |
| excerpt | TextField | 自动截取摘要 |
| cover_image | URLField | 封面图 URL |
| status | CharField | draft / published / archived |
| is_top | BooleanField | 是否置顶 |
| views_count | IntegerField | 阅读量 |
| category | FK → Category | 分类 |
| tags | M2M → Tag | 标签 |
| created_at | DateTimeField | 创建时间 |
| updated_at | DateTimeField | 更新时间 |

### Category (分类)
| 字段 | 类型 | 说明 |
|------|------|------|
| name | CharField | 分类名 |
| slug | SlugField | 别名 |

### Tag (标签)
| 字段 | 类型 | 说明 |
|------|------|------|
| name | CharField | 标签名 |
| slug | SlugField | 别名 |

### Comment (评论)
| 字段 | 类型 | 说明 |
|------|------|------|
| article | FK → Article | 所属文章 |
| parent | FK → self | 父评论 (支持回复) |
| author_name | CharField | 昵称 |
| author_email | EmailField | 邮箱 |
| content | TextField | 内容 |
| is_approved | BooleanField | 审核通过 |
| created_at | DateTimeField | 时间 |

### Photo (照片)
| 字段 | 类型 | 说明 |
|------|------|------|
| title | CharField | 标题 |
| image | ImageField | 图片文件 |
| description | TextField | 描述 |
| uploaded_at | DateTimeField | 上传时间 |

### FriendLink (友链)
| 字段 | 类型 | 说明 |
|------|------|------|
| name | CharField | 站点名 |
| url | URLField | 链接 |
| description | CharField | 简介 |
| sort_order | IntegerField | 排序 |

## 5. 前端路由 & 组件

| 路由 | 页面组件 | 说明 |
|------|----------|------|
| `/` | Home.vue | 首页，文章列表 + 粒子背景 + 侧边栏 |
| `/article/:slug` | ArticleDetail.vue | 文章详情 + 目录导航 + 评论区 |
| `/categories` | Categories.vue | 分类总览 |
| `/tags` | Tags.vue | 标签云 |
| `/search` | Search.vue | 全文搜索 |
| `/about` | About.vue | 关于我 |
| `/photos` | PhotoWall.vue | 照片墙 |
| `/friends` | FriendLinks.vue | 友情链接 |
| `/archives` | Archives.vue | 文章归档（时间线） |
| `/admin` | AdminLogin.vue | 管理后台登录 |
| `/admin/dashboard` | AdminDashboard.vue | 仪表盘 |
| `/admin/editor` | ArticleEditor.vue | 文章编辑器 |
| `/admin/articles` | ArticleList.vue | 文章管理列表 |
| `/admin/comments` | CommentManage.vue | 评论审核 |

### 全局组件
- `AppHeader` — 顶部导航栏，带霓虹发光 logo
- `Live2DWidget` — 右下角看板娘
- `BackToTop` — 回到顶部按钮
- `LoadingScreen` — 首屏加载动画
- `ParticleBg` — 粒子/星空背景

## 6. REST API

### 公开接口
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/articles/` | 文章列表（分页，支持 `?category=` `?tag=` `?search=` `?status=published`） |
| GET | `/api/articles/:slug/` | 文章详情（含渲染后 HTML） |
| GET | `/api/categories/` | 分类列表（含文章计数） |
| GET | `/api/tags/` | 标签列表（含文章计数） |
| GET | `/api/articles/:slug/comments/` | 获取文章评论 |
| POST | `/api/articles/:slug/comments/` | 提交评论 |
| GET | `/api/search/?q=` | 全文搜索 |
| GET | `/api/photos/` | 照片列表 |
| GET | `/api/friends/` | 友链列表 |
| GET | `/api/rss/` | RSS 订阅源 |

### 管理接口（需 JWT 认证）
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/admin/login/` | 登录获取 Token |
| POST | `/api/admin/articles/` | 新建文章 |
| PUT | `/api/admin/articles/:id/` | 编辑文章 |
| DELETE | `/api/admin/articles/:id/` | 删除文章 |
| POST | `/api/admin/upload/` | 图片上传 |
| GET | `/api/admin/comments/pending/` | 待审核评论 |
| PUT | `/api/admin/comments/:id/approve/` | 审核通过 |
| GET | `/api/admin/stats/` | 阅读统计 |

## 7. 文章管理工具

### 在线编辑器
- Vue 前端管理面板，路由 `/admin/*`
- Markdown 编辑器（Milkdown 或 Vditor），实时预览
- 支持图片拖拽上传、元信息表单、保存/发布/草稿状态切换

### CLI 工具 (`tools/article-cli.py`)
- 本地 Python 脚本
- `new` — 创建 Markdown 文章模板
- `publish` — 通过 API 发布
- `upload` — 上传 Markdown 文件
- `list` — 列出文章
- `sync` — 批量同步目录下的 Markdown 文件

## 8. 视觉风格

- **主题：** 深色背景为主色调
- **配色：** 霓虹色系（青色 `#00e5ff`、品红 `#ff0080`、紫色 `#7b2fff` 为主）
- **背景：** CSS/Canvas 粒子星空效果
- **卡片：** 半透明暗色玻璃拟态卡片
- **字体：** 系统默认中文字体 + Fira Code 等宽字体（代码块）
- **特效：** 标题霓虹发光、hover 动画、页面切换过渡
- **挂件：** 右下角 Live2D 看板娘（保留现有模型）

## 9. 技术栈

| 层 | 技术 | 版本 |
|----|------|------|
| 前端框架 | Vue | 3.x |
| 构建工具 | Vite | 5.x |
| 路由 | Vue Router | 4.x |
| 状态管理 | Pinia | 2.x |
| HTTP 客户端 | Axios | 1.x |
| Markdown 渲染 | marked + highlight.js | - |
| Markdown 编辑器 | Vditor | - |
| CSS 方案 | SCSS | - |
| 后端框架 | Django | 5.x |
| REST API | Django REST Framework | 3.x |
| 认证 | Simple JWT | - |
| 数据库 | SQLite | - |
| 前端部署 | GitHub Pages | - |
| 后端部署 | PythonAnywhere | - |

## 10. 实施顺序

1. 后端 — Django 项目搭建 + 数据模型 + API
2. 后端 — 管理接口 + JWT 认证
3. 前端 — Vite 项目搭建 + 基础布局
4. 前端 — 首页文章列表 + 粒子背景
5. 前端 — 文章详情 + Markdown 渲染
6. 前端 — 分类/标签/搜索/归档/关于/照片/友链页面
7. 前端 — 管理面板 + 在线编辑器
8. CLI 工具 — article-cli.py
9. 部署 — 后端到 PythonAnywhere + 前端到 GitHub Pages
10. 验收测试

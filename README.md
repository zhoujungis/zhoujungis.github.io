# 🌸 ZhouJun's Blog

[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Django](https://img.shields.io/badge/Django-6.0-092E20?logo=django)](https://www.djangoproject.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> 可爱风个人技术博客，樱花粉主题 🎀，前后端分离架构。

🔗 **在线访问：** [zhoujungis.github.io](https://zhoujungis.github.io)

---

## ✨ 功能

- 📝 **文章管理** — Markdown 写作 + Vditor 在线编辑器，支持草稿/发布/置顶/定时发布
- 🏷️ **分类 & 标签** — 文章归类，标签云，分类筛选
- 💬 **评论系统** — 支持回复、嵌套评论，honeypot 防 spam
- 🔍 **全文搜索** — 后端 Django 搜索，搜索结果高亮
- 🖼️ **照片墙** — 图片展示 + 灯箱预览
- 🔗 **友情链接** — 独立友链页面
- 🗺️ **足迹地图** — ECharts 中国地图，去过的城市标记，按区域分组统计
- 🌓 **明暗主题** — 樱花粉亮色 / 赛博朋克暗色，自动记忆
- 📡 **RSS 订阅** — Atom Feed
- 📧 **邮件订阅** — 新文章发布自动通知订阅者（支持 163/QQ/Gmail SMTP）
- 📊 **管理后台** — 仪表盘、文章管理、评论审核、订阅者管理
- 🦊 **Live2D 看板娘** — 右下角可爱角色
- 🎀 **樱花粉萌系 UI** — 花瓣粒子、软阴影、弹跳动效、骨架屏加载
- 📱 **PWA** — Service Worker 离线缓存，可安装到桌面

---

## 🏗️ 架构

```
┌─────────────────────────────────────┐
│          GitHub Pages (前端)          │
│      Vue 3 + Vite SPA               │
│          ↕ REST API                  │
│    PythonAnywhere (后端)             │
│      Django + DRF + SQLite          │
└─────────────────────────────────────┘
```

| 层 | 技术栈 | 部署位置 |
|----|--------|----------|
| 前端 | Vue 3 + Vite + Vue Router + Pinia + Axios + SCSS + ECharts | GitHub Pages |
| 后端 | Django 5.x + DRF + SimpleJWT + SQLite | PythonAnywhere |

---

## 🚀 本地开发

### 环境要求

- Node.js >= 18
- Python >= 3.12 (Django 5.x / 6.0.x requirement)

### 前端

```bash
cd frontend
npm install
cp .env.example .env     # 编辑 API 地址
npm run dev              # http://localhost:5173
```

### 后端

```bash
cd backend
python -m venv venv
source venv/bin/activate    # Linux/macOS
# venv\Scripts\activate     # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver  # http://localhost:8000
```

### 运行测试

```bash
cd frontend
npm test                 # 运行一次
npm run test:watch       # watch 模式
```

---

## 🔧 环境变量

### 前端 (`frontend/.env`)

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `VITE_API_BASE_URL` | 后端 API 地址 | `http://localhost:8000/api/` |

### 后端 (`backend/.env`)

| 变量 | 说明 | 示例 |
|------|------|------|
| `EMAIL_HOST` | SMTP 服务器 | `smtp.163.com` |
| `EMAIL_PORT` | SMTP 端口 | `465` |
| `EMAIL_USE_SSL` | 使用 SSL | `True` |
| `EMAIL_HOST_USER` | 邮箱账号 | `you@163.com` |
| `EMAIL_HOST_PASSWORD` | SMTP 授权码（非登录密码） | `xxxx` |
| `DEBUG` | 调试模式 | `False` |

> `.env` 文件由 `settings.py` 自动加载，无需额外安装包。

---

## 📦 部署

### 前端 → GitHub Pages

```bash
cd frontend
bash deploy.sh
```

或手动：

```bash
cd frontend
npm run build
cp -r dist/* ../
cd ..
git add -A && git commit -m "deploy" && git push origin master
```

### 后端 → PythonAnywhere

```bash
# PythonAnywhere Bash 控制台
cd ~/zhoujungis.github.io/backend
git pull origin master
source venv/bin/activate
python manage.py migrate
```

然后 **Web** 标签 → **Reload**。

---

## 📂 项目结构

```
├── frontend/              # Vue 3 前端
│   ├── src/
│   │   ├── api/           # Axios 封装 (client, articles, comments, admin)
│   │   ├── components/    # 全局组件 (30+)
│   │   ├── composables/   # 组合式函数 (useScroll, useTheme)
│   │   ├── pages/         # 页面组件
│   │   │   └── admin/     # 管理后台 (Dashboard, Editor, ArticleList, etc.)
│   │   ├── router/        # 路由配置 + 认证守卫
│   │   ├── stores/        # Pinia 状态 (auth, article)
│   │   ├── styles/        # SCSS 主题 (variables, global, skeleton, etc.)
│   │   ├── utils/         # 工具函数 (labels, readingTime, seo)
│   │   └── __tests__/     # Vitest 单元测试
│   ├── public/            # 静态资源 (favicon, sw.js, 404.html, etc.)
│   ├── deploy.sh          # 一键部署脚本
│   └── .env.example       # 环境变量模板
├── backend/               # Django 后端
│   ├── blog_api/          # Django 配置 (settings, urls, wsgi)
│   ├── articles/          # 文章 App (models, views, signals, admin)
│   │   └── templates/     # 邮件模板 (新文章通知)
│   ├── comments/          # 评论 App
│   ├── photos/            # 照片 App
│   ├── friends/           # 友链 App
│   ├── accounts/          # 账户 App
│   ├── requirements.txt   # Python 依赖
│   └── .env.example       # 环境变量模板
├── tools/                 # CLI 文章管理脚本
├── docs/                  # 设计文档
└── assets/                # 构建产物（GitHub Pages 从此目录 serving）
```

---

## 📄 License

MIT © Zhou Jun

---

<p align="center">🌸 用爱发电，用心写作 🌸</p>

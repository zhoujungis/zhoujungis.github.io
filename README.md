# 🌸 ZhouJun's Blog

[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Django](https://img.shields.io/badge/Django-6.0-092E20?logo=django)](https://www.djangoproject.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> 一个可爱风的个人技术博客，樱花粉主题 🎀，前后端分离架构。

🔗 **在线访问：** [zhoujungis.github.io](https://zhoujungis.github.io)

---

## ✨ 功能

- 📝 **文章管理** — Markdown 写作 + Vditor 在线编辑器，支持草稿/发布/置顶
- 🏷️ **分类 & 标签** — 文章归类，标签云
- 💬 **评论系统** — 支持回复、审核，JWT 认证
- 🔍 **全文搜索** — 后端 Django 搜索
- 🖼️ **照片墙** — 图片展示 + 灯箱预览
- 🔗 **友情链接** — 独立友链页面
- 📡 **RSS 订阅** — Atom Feed
- 📊 **管理后台** — 仪表盘、文章管理、评论审核
- 🦊 **Live2D 看板娘** — 右下角可爱角色
- 🎀 **樱花粉萌系 UI** — 花瓣粒子、软阴影、弹跳动效

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
| 前端 | Vue 3 + Vite + Vue Router + Pinia + Axios + Vditor + SCSS | GitHub Pages |
| 后端 | Django 6.0 + DRF + SimpleJWT + SQLite | PythonAnywhere |

---

## 🚀 本地开发

### 环境要求

- Node.js >= 18
- Python >= 3.10

### 前端

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
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

### 环境变量

前端 `frontend/.env`：

```
VITE_API_BASE_URL=http://localhost:8000/api/
```

后端通过 `blog_api/settings.py` 中的 `os.environ` 读取。

---

## 📦 部署

### 前端 → GitHub Pages

```bash
cd frontend
npm run build
cp -r dist/* ../ && git add -A && git commit -m "deploy" && git push
```

### 后端 → PythonAnywhere

详见 [backend/pythonanywhere_deploy.md](backend/pythonanywhere_deploy.md)

---

## 📂 项目结构

```
├── frontend/           # Vue 3 前端源码
│   ├── src/
│   │   ├── api/        # Axios 封装
│   │   ├── components/ # 全局组件
│   │   ├── pages/      # 页面组件
│   │   │   └── admin/  # 管理后台
│   │   ├── stores/     # Pinia 状态
│   │   ├── styles/     # SCSS 主题
│   │   └── router/     # 路由配置
│   └── deploy.sh
├── backend/            # Django 后端
│   ├── blog_api/       # Django 配置
│   ├── articles/       # 文章 App
│   ├── comments/       # 评论 App
│   ├── photos/         # 照片 App
│   ├── friends/        # 友链 App
│   └── accounts/       # 账户 App
├── docs/               # 文档
└── assets/             # 构建产物（前端）
```

---

## 📄 License

MIT © Zhou Jun

---

<p align="center">🌸 用爱发电，用心写作 🌸</p>

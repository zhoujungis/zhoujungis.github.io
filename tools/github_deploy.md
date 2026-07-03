## 🎯 前言

这篇教程详细讲解如何把 Vue 3 + Vite 前端项目部署到 GitHub Pages。

> 全程免费！GitHub Pages 提供免费的 HTTPS 托管和全球 CDN 加速，非常适合个人博客和项目展示。

---

## 📋 准备工作

开始之前请确保：

- ✅ 有一个 **GitHub 账号**（没有的话去 [github.com](https://github.com) 注册）
- ✅ 安装了 **Git**（`git --version` 检查）
- ✅ 安装了 **Node.js >= 18**（`node --version` 检查）
- ✅ 有一个 **Vue 3 + Vite 项目**（或者跟着这篇教程从头创建）

---

## 🏗️ 第一步：创建 GitHub 仓库

### 1.1 新建仓库

登录 GitHub，点击右上角 `+` → `New repository`：

```
┌─────────────────────────────────────────────────┐
│               Create a new repository            │
├─────────────────────────────────────────────────┤
│  Repository name:  ➤ YOUR_USERNAME.github.io    │
│  Description:      ➤ 我的个人博客                │
│                                                     
│  ● Public    ○ Private                           │
│                                                     
│  ☑ Add a README file                             │
│                                                     
│            [ Create repository ]                  │
└─────────────────────────────────────────────────┘
```

> ⚠️ **重要！** 仓库名必须是 `你的用户名.github.io` 格式，例如 `zhangsan.github.io`。这是 GitHub Pages 的命名规则。

### 1.2 克隆到本地

```bash
# 替换为你的实际仓库地址
git clone https://github.com/YOUR_USERNAME/YOUR_USERNAME.github.io.git
cd YOUR_USERNAME.github.io
```

---

## ⚙️ 第二步：创建 Vue 3 项目

### 2.1 使用 Vite 脚手架

```bash
# 在仓库根目录下创建 Vue 项目
npm create vite@latest frontend -- --template vue

cd frontend
npm install
```

### 2.2 安装必要的依赖

```bash
# 路由和状态管理
npm install vue-router@4 pinia axios

# Markdown 支持和 SCSS
npm install marked highlight.js vditor
npm install -D sass
```

### 2.3 配置 vite.config.js

打开 `frontend/vite.config.js`，确保 base 路径正确：

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/',  // ← 用户/组织站点用 '/'
  // base: '/你的仓库名/',  // ← 项目站点用这个
  plugins: [vue()],
})
```

> 💡 **提示**：如果你的仓库名是 `YOUR_USERNAME.github.io`，用 `base: '/'`。如果是其他名字的仓库，用 `base: '/仓库名/'`。

---

## 🏠 第三步：创建首页组件

### 3.1 最小可运行示例

创建 `frontend/src/pages/Home.vue`：

```html
<template>
  <div class="home">
    <h1>🎉 我的博客上线了！</h1>
    <p>欢迎来到我的 GitHub Pages</p>
  </div>
</template>

<script setup>
// 这里可以写你的逻辑
</script>

<style scoped>
.home {
  text-align: center;
  padding: 100px 20px;
}
h1 { color: #ff85a2; font-size: 2.5rem; }
</style>
```

### 3.2 配置路由

修改 `frontend/src/router/index.js`：

```javascript
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('../pages/Home.vue') },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../pages/NotFound.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
```

### 3.3 创建 404 页面

创建 `frontend/src/pages/NotFound.vue`：

```html
<template>
  <div class="not-found">
    <h1>404</h1>
    <p>页面不存在</p>
    <router-link to="/">返回首页</router-link>
  </div>
</template>
```

---

## 🔨 第四步：本地测试

```bash
cd frontend
npm run dev
```

打开浏览器访问 `http://localhost:5173`，确认一切正常后按 `Ctrl+C` 停止。

---

## 📦 第五步：构建项目

```bash
cd frontend
npm run build
```

构建成功后，项目根目录会生成 `frontend/dist/` 文件夹：

```
frontend/dist/
├── index.html
├── favicon.svg
├── assets/
│   ├── index-abc123.js
│   ├── index-abc123.css
│   ├── Home-xyz789.js
│   └── ...
```

---

## 🚀 第六步：配置部署脚本

### 6.1 创建 deploy.sh

在 `frontend/` 下创建 `deploy.sh`：

```bash
#!/bin/bash
set -e

echo "🔨 开始构建..."
npm run build

echo "📦 复制文件到仓库根目录..."
rm -rf ../assets/ ../index.html ../favicon.svg
cp -r dist/* ../

echo "📤 提交到 GitHub..."
cd ..
git add assets/ index.html favicon.svg
git commit -m "deploy: $(date '+%Y-%m-%d %H:%M')"
git push origin master

echo "✅ 部署完成！等待几分钟后访问 https://你的用户名.github.io"
```

### 6.2 添加 .nojekyll 文件

GitHub Pages 默认用 Jekyll 处理，会忽略 `_` 开头的文件。在仓库根目录创建 `.nojekyll` 来禁用：

```bash
# 在仓库根目录（不是 frontend/ 里面）
touch .nojekyll
git add .nojekyll
git commit -m "add .nojekyll to bypass Jekyll"
```

---

## 🌐 第七步：部署到 GitHub Pages

### 7.1 运行部署

```bash
cd frontend
bash deploy.sh
```

### 7.2 检查部署状态

1. 打开 GitHub 仓库页面
2. 点击 **Settings** → **Pages**
3. 看到绿色的 `✅ Your site is live at https://xxx.github.io`

### 7.3 验证

打开浏览器访问 `https://你的用户名.github.io`，应该能看到你的 Vue 页面！

---

## ⚠️ 常见问题

### Q1: 页面刷新后 404？

> **原因**：GitHub Pages 不支持 SPA 的 HTML5 History 模式。

**解决方案**：改用 `createWebHashHistory()`：

```javascript
// router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),  // ← 改成这个
  routes,
})
```

URL 会变成 `https://xxx.github.io/#/article/xxx`，但刷新不会 404。

> 或者用 404.html 重定向技巧——把 `index.html` 复制一份命名为 `404.html`，GitHub Pages 会把所有 404 请求重定向到它。

### Q2: 样式加载不出来？

> 检查 `vite.config.js` 的 `base` 路径是否正确。

### Q3: 某些文件 404？

> 文件以下划线 `_` 开头会被 Jekyll 忽略。添加 `.nojekyll` 文件即可。

### Q4: 修改后网站没变化？

> GitHub Pages 有一两分钟的部署延迟。或者浏览器缓存，试试 Ctrl+Shift+R 强制刷新。

---

## 📊 部署流程图

```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐
│  npm run    │    │  cp dist/*   │    │  git push    │
│  build      │───▶│  to repo     │───▶│  to GitHub   │
│  (构建)     │    │  root (复制)  │    │  (推送)       │
└─────────────┘    └──────────────┘    └──────┬───────┘
                                              │
                                              ▼
┌─────────────┐    ┌──────────────┐    ┌──────────────┐
│  浏览器      │◀───│  GitHub      │◀───│  GitHub      │
│  访问       │    │  Pages 服务   │    │  Actions 构建 │
└─────────────┘    └──────────────┘    └──────────────┘
```

---

## 🎉 总结

你的 Vue 3 前端现在已经成功部署到 GitHub Pages 了！

| 步骤 | 关键操作 |
|------|----------|
| 1 | 创建 `用户名.github.io` 仓库 |
| 2 | 用 Vite 创建 Vue 项目 |
| 3 | 设置 `base: '/'` |
| 4 | `npm run build` 构建 |
| 5 | 把 `dist/` 复制到仓库根目录 |
| 6 | Git commit + push |
| 7 | 等一两分钟，访问网站 |

> 🌸 搞定了！现在别人就可以通过 `https://你的用户名.github.io` 访问你的网站了。

---

## 🔗 参考链接

- [GitHub Pages 官方文档](https://docs.github.com/en/pages)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [Vue Router History 模式](https://router.vuejs.org/guide/essentials/history-mode.html)

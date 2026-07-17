# 头像样式与图片更换 — 设计文档

**日期**：2026-07-17
**状态**：Draft

## 背景

用户对当前博客头像有两点不满：

1. **装饰性"圈圈"很难看**：当前头像在两处显示（About 页面、侧边栏），外面套了一个圆 + 彩色描边 + 霓虹发光阴影。在用户看来这种"圆框+发光"装饰太丑。
2. **头像本身不够好看**：当前 `PIC.png` 是一张山水风景照 + 数字水印，并不是一个合适的个人头像。

## 目标

1. 去掉头像的装饰性圆框（描边、发光阴影），但**保留头像本身的圆形裁剪**（用户选择"圆形但去掉边框和发光"）。
2. 替换头像图片为一个更现代、更适合个人博客的矢量插画风格。
3. About 页面和侧边栏的两处头像**视觉风格完全一致**。

## 决策

| 项目 | 决策 |
|---|---|
| 头像来源 | DiceBear 矢量头像服务（api.dicebear.com） |
| 风格 | `notionists`（Notion 风极简插画） |
| 种子 | `zhoujun`（确定性、可复现） |
| 文件格式 | SVG（矢量，体积小，所有现代浏览器原生支持） |
| 形状 | 圆形（`border-radius: 50%`） |
| 装饰 | 无描边、无发光阴影、无背景色 |
| 一致性 | About 与 SidePanel 完全相同视觉处理 |

**为什么不选其他方案：**
- 自己用图像生成 API（如 DALL-E）：用户偏好矢量、可复用、不依赖外部 API key
- Unsplash 风景图：仍是"风景"路线，与原头像气质类似，没有质的提升
- 程序化 SVG 手绘：工作量大、不可控、与 DiceBear 同等效果但更费时

## 实施步骤

### Step 1：生成并保存新头像
- 使用 curl 从 `https://api.dicebear.com/9.x/notionists/svg?seed=zhoujun` 下载 SVG
- 保存为：
  - 仓库根目录：`/PIC.svg`
  - 前端 public 目录：`/frontend/public/PIC.svg`

### Step 2：清理旧头像资源
- 删除仓库根目录：`PIC.png`、`PIC.avif`、`PIC.webp`
- 删除 `frontend/public/PIC.png`（确认存在，无 avif/webp 同伴）
- **不删除** `frontend/src/assets/hero.png`：虽然源文件中无 `hero` 引用，但 `compress-images.mjs` 仍把它作为 hero 图的源（orphaned 但保留以避免破坏潜在未来用例）

### Step 3：修改 `frontend/src/pages/About.vue`

**Template（第 5-29 行）** — 简化为单一 `<img>` 引用 SVG：
```html
<div class="profile-avatar">
  <div class="avatar">
    <img src="/PIC.svg" alt="Zhou Jun" class="avatar-image" />
  </div>
</div>
```

**Style（第 130-154 行）** — 删去 `avatar-circle`，重命名为 `avatar`：
```scss
.profile-avatar {
  text-align: center;
  margin-bottom: 20px;
}

.avatar {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  margin: 0 auto;
  overflow: hidden;
  // 删除：background, border, box-shadow
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
```

**删除**：`import { getPictureSources } from '@/utils/imageSource'`（不再需要多格式回退）

### Step 4：修改 `frontend/src/components/SidePanel.vue`

**Template（第 6-8 行）** — 改用 SVG：
```html
<div class="avatar">
  <img src="/PIC.svg" alt="Zhou Jun" class="avatar-image" />
</div>
```

**Style（第 189-201 行）** — 保留尺寸，去掉装饰：
```scss
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto 12px;
  overflow: hidden;
  // 删除：border, box-shadow, background
}
```

### Step 5：构建与部署
- `cd frontend && npm run build` — 输出到 `frontend/dist/` 和仓库根 `dist/`
- 部署脚本（`frontend/deploy.sh`）应已处理 GitHub Pages 推送
- 验证部署后的页面没有视觉回归

## 涉及文件

| 文件 | 操作 |
|---|---|
| `PIC.svg` | 新建（仓库根） |
| `frontend/public/PIC.svg` | 新建 |
| `frontend/src/pages/About.vue` | 修改 |
| `frontend/src/components/SidePanel.vue` | 修改 |
| `PIC.png`, `PIC.avif`, `PIC.webp`（仓库根） | 删除 |
| `frontend/public/PIC.png` | 删除 |

## 测试

- 部署后访问 `https://zhoujungis.github.io/about`：
  - 头像显示为 Notion 风格插画
  - 没有粉色描边
  - 没有粉色霓虹发光
  - 形状仍是圆形
- 访问首页（带侧边栏）：
  - 侧边栏小头像与 About 大头像视觉一致
  - 没有青色描边或青色发光
- 在浏览器开发者工具中检查 `<img>` 是否加载 `PIC.svg`，加载无 404
- 检查 dist 目录下 `PIC.svg` 确实被复制

## 风险与回滚

- **风险 1**：DiceBear 服务不可用
  - **缓解**：SVG 文件已下载保存到本地，不依赖运行时 API 调用
- **风险 2**：SVG 在某些环境下不显示
  - **缓解**：现代浏览器（Chrome/Firefox/Safari/Edge）全部原生支持 SVG，且项目本身就是 Vite/ES Module 构建，访客均为现代浏览器
- **回滚**：所有变更在 git 中，可通过 `git revert` 一键回滚到上一个 commit
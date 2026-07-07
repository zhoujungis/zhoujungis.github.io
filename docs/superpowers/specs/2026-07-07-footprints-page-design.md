# 足迹页面设计

## 概述

新增"足迹"页面，以中国地图展示已走过的城市，体现"读万卷书，行万里路"的理念。地图上使用涟漪动画标记每个城市，匹配博客现有的玻璃态设计风格。

## 已走过城市（13座）

北京、天津、南京、苏州、合肥、安庆、广州、深圳、长沙、南昌、赣州、武汉、重庆

## 技术方案

### 地图库

**ECharts** + 中国地图 GeoJSON：

- ECharts 原生支持地图坐标系，注册 GeoJSON 后可用 `map` 系列渲染
- `effectScatter` 系列提供涟漪动画效果，精准匹配需求
- 项目已有 Vite 构建链，`npm install echarts` 即可，无需额外封装库
- 中国 GeoJSON 从 DataV 等 CDN 获取，或存放为本地静态资源

### 页面结构

```
Footprints.vue
├── 页面标题区："读万卷书，行万里路" + 副标题
├── 地图卡片（glass-card 容器）
│   └── ECharts 地图实例（china map + effectScatter）
└── 统计区：已走过城市数量 + 城市名列表
```

### 路由

- 路径：`/footprints`
- 名称：`Footprints`
- 懒加载：`() => import('../pages/Footprints.vue')`

### 导航

- 桌面导航：首页 > 归档 > 分类 > 标签 > 照片墙 > 友链 > **足迹** > 关于 > 搜索
- 移动端抽屉同步更新

## ECharts 配置要点

### 地图底图

- `geo` 组件注册 `china` 地图
- 区域填充色使用半透明，跟随主题
- 区域边框浅色
- 禁用缩放漫游（保持简洁），或保留轻度缩放

### 涟漪标记

- `effectScatter` 系列叠加在地图上
- 每个城市一个坐标点 `[lng, lat]`
- `rippleEffect` 配置：`scale: 4`, `brushType: 'stroke'`
- 颜色：`#ff85a2`（站点 accent-pink）
- 符号大小：`12`

### 城市标签

- 使用另一个 `scatter` 系列 + `label` 显示城市名
- 或使用 `graphic` 手动定位文本
- 标签颜色跟随主题文字色

### 悬停交互

- Tooltip 显示城市名
- 悬停时标记点高亮放大

### 主题适配

- 在 `mounted` 中读取当前主题（`document.documentElement` 属性或 store）
- 监听主题切换事件，调用 `chart.setOption()` 更新配色
- 地图背景色、标签色、tooltip 色均使用变量

## 响应式

- 地图容器宽度 100%，移动端等比缩放
- `resize` 事件监听，调用 `chart.resize()`
- 地图宽高比保持约 1:0.8（中国地图自然比例）

## 依赖

- `echarts`: ^5.x — 新增 npm 依赖
- 中国 GeoJSON: 存放于 `frontend/src/assets/china.json` 或 `frontend/public/`

## 文件变更清单

| 文件 | 操作 |
|------|------|
| `frontend/src/pages/Footprints.vue` | **新增** |
| `frontend/src/router/index.js` | 修改（添加路由） |
| `frontend/src/components/AppHeader.vue` | 修改（添加导航项） |
| `frontend/package.json` | 修改（添加 echarts 依赖） |

## 风险

- 中国地图 GeoJSON 需包含完整省界数据（含南海诸岛缩略图），使用 DataV 提供的 GeoJSON（`https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json`），或本地存放备选
- ECharts 地图在暗色主题下配色需调试，确保标签可读；主题切换通过监听 `html[data-theme]` 属性变化来实现

# Footprints Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "足迹" (Footprints) page showing a China map with ripple-animated markers on 13 visited cities.

**Architecture:** A new Vue SFC page (`Footprints.vue`) renders an ECharts instance inside a glass-card container. China GeoJSON is fetched from a local static file. The chart uses `geo` for the base map and `effectScatter` for pulsing city markers. A MutationObserver watches `html.theme-dark` to redraw the chart with dark-adapted colors.

**Tech Stack:** Vue 3 (Composition API), ECharts 5, SCSS (existing variables), Vue Router (lazy-loaded route)

## Global Constraints

- Follow existing page patterns: `<div class="page page-footprints">` wrapper, glass-card containers, SCSS with `@use '@/styles/variables' as *`
- Theme: light (sakura) by default; dark via `html.theme-dark` class on `<html>`
- All copy in Chinese
- Mobile-responsive: single-column, map fills width
- ECharts instance must `resize()` on window resize and `dispose()` on unmount
- China GeoJSON stored locally in `frontend/public/` for offline reliability

---

### Task 1: Install echarts dependency

**Files:**
- Modify: `frontend/package.json`

- [ ] **Step 1: Install echarts**

```bash
cd frontend && npm install echarts
```

Expected: `echarts` added to `package.json` dependencies.

- [ ] **Step 2: Commit**

```bash
git add frontend/package.json frontend/package-lock.json
git commit -m "chore: add echarts dependency for footprints map"
```

---

### Task 2: Download China GeoJSON to public directory

**Files:**
- Create: `frontend/public/china-geo.json`

- [ ] **Step 1: Download the GeoJSON file**

Fetch China boundary GeoJSON from DataV and save to the public directory so it's served as a static asset (no runtime CDN dependency):

```bash
curl -o frontend/public/china-geo.json "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json"
```

Expected: `frontend/public/china-geo.json` exists, ~500KB+.

- [ ] **Step 2: Verify the file is valid JSON**

```bash
node -e "const fs = require('fs'); const data = JSON.parse(fs.readFileSync('frontend/public/china-geo.json','utf8')); console.log('Features:', data.features.length); console.log('Valid JSON — OK')"
```

Expected: Outputs feature count and "Valid JSON — OK".

- [ ] **Step 3: Commit**

```bash
git add frontend/public/china-geo.json
git commit -m "assets: add China GeoJSON for footprints map"
```

---

### Task 3: Create Footprints.vue page

**Files:**
- Create: `frontend/src/pages/Footprints.vue`

**Interfaces:**
- Produces: `<Footprints>` Vue component (default export, no props)

- [ ] **Step 1: Create the page file**

Write `frontend/src/pages/Footprints.vue`:

```vue
<template>
  <div class="page page-footprints">
    <div class="footprints-header">
      <h1 class="footprints-title">🗺️ 读万卷书，行万里路</h1>
      <p class="footprints-subtitle">用脚步丈量世界，用代码记录生活</p>
    </div>

    <div class="map-card glass-card">
      <div ref="chartRef" class="chart-container"></div>
    </div>

    <div class="stats-card glass-card">
      <p class="stats-intro">📍 已走过 <strong>{{ cities.length }}</strong> 座城市</p>
      <div class="city-tags">
        <span v-for="city in cities" :key="city.name" class="city-tag">{{ city.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)
let chart = null
let themeObserver = null

const cities = [
  { name: '北京', lng: 116.4074, lat: 39.9042 },
  { name: '天津', lng: 117.1902, lat: 39.1252 },
  { name: '南京', lng: 118.7969, lat: 32.0603 },
  { name: '苏州', lng: 120.5954, lat: 31.2990 },
  { name: '合肥', lng: 117.2273, lat: 31.8206 },
  { name: '安庆', lng: 117.0510, lat: 30.5319 },
  { name: '广州', lng: 113.2644, lat: 23.1291 },
  { name: '深圳', lng: 114.0579, lat: 22.5431 },
  { name: '长沙', lng: 112.9388, lat: 28.2278 },
  { name: '南昌', lng: 115.8581, lat: 28.6820 },
  { name: '赣州', lng: 114.9350, lat: 25.8318 },
  { name: '武汉', lng: 114.3054, lat: 30.5931 },
  { name: '重庆', lng: 106.5516, lat: 29.5630 },
]

function isDark() {
  return document.documentElement.classList.contains('theme-dark')
}

function getChartOption() {
  const dark = isDark()
  const textColor = dark ? '#aaa' : '#4a3040'
  const mapBg = dark ? '#1a1a2e' : '#fff5f7'
  const borderColor = dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,133,162,0.2)'
  const emphasisBg = dark ? 'rgba(255,133,162,0.15)' : 'rgba(255,133,162,0.1)'

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{b}',
      backgroundColor: dark ? '#222' : '#fff',
      borderColor: '#ff85a2',
      textStyle: { color: dark ? '#e0e0e0' : '#4a3040' },
    },
    geo: {
      map: 'china',
      roam: false,
      zoom: 1.15,
      center: [108, 34],
      label: { show: false },
      itemStyle: {
        areaColor: dark ? '#1a1a2e' : '#fef0f3',
        borderColor: borderColor,
        borderWidth: 1,
      },
      emphasis: {
        label: { show: true, color: textColor },
        itemStyle: { areaColor: emphasisBg },
      },
    },
    series: [
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: cities.map(c => ({ name: c.name, value: [c.lng, c.lat] })),
        symbolSize: 10,
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke',
          scale: 4,
          period: 5,
          color: '#ff85a2',
        },
        itemStyle: {
          color: '#ff85a2',
          shadowBlur: 10,
          shadowColor: '#ff85a2',
        },
        label: {
          show: true,
          formatter: '{b}',
          position: 'right',
          distance: 6,
          color: textColor,
          fontSize: 11,
        },
        emphasis: {
          scale: 2,
        },
      },
    ],
  }
}

async function initChart() {
  if (!chartRef.value) return

  // Fetch GeoJSON
  const resp = await fetch('/china-geo.json')
  const geoJson = await resp.json()
  echarts.registerMap('china', geoJson)

  chart = echarts.init(chartRef.value)
  chart.setOption(getChartOption())

  window.addEventListener('resize', handleResize)
}

function handleResize() {
  chart?.resize()
}

function updateTheme() {
  if (chart && !chart.isDisposed()) {
    chart.setOption(getChartOption(), true)
  }
}

onMounted(async () => {
  await nextTick()
  await initChart()

  // Watch theme changes
  themeObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.attributeName === 'class') {
        updateTheme()
      }
    }
  })
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  themeObserver?.disconnect()
  chart?.dispose()
  chart = null
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.page-footprints {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 16px;
}

.footprints-header {
  text-align: center;
  margin-bottom: 28px;
}

.footprints-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: $accent-pink;
  margin-bottom: 8px;
}

.footprints-subtitle {
  font-size: 0.9rem;
  color: $text-secondary;
  margin-bottom: 0;
}

.map-card {
  margin-bottom: 24px;
  padding: 8px;
  overflow: hidden;
}

.chart-container {
  width: 100%;
  height: 520px;

  @media (max-width: 767px) {
    height: 360px;
  }
}

.stats-card {
  text-align: center;
  padding: 20px 24px;
}

.stats-intro {
  font-size: 0.95rem;
  color: $text-secondary;
  margin-bottom: 16px;

  strong {
    color: $accent-pink;
    font-size: 1.1rem;
  }
}

.city-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.city-tag {
  display: inline-block;
  padding: 5px 16px;
  border-radius: 20px;
  background: rgba(255, 133, 162, 0.08);
  border: 1px solid rgba(255, 133, 162, 0.2);
  color: $accent-pink;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all $transition-fast;

  &:hover {
    background: rgba(255, 133, 162, 0.15);
    border-color: $accent-pink;
    transform: translateY(-2px);
  }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/Footprints.vue
git commit -m "feat: add Footprints page with China map and ripple markers"
```

---

### Task 4: Add route for /footprints

**Files:**
- Modify: `frontend/src/router/index.js`

**Interfaces:**
- Consumes: `Footprints.vue` (lazy-loaded default export from Task 3)
- Produces: `/footprints` route → `Footprints` named route

- [ ] **Step 1: Add the route**

In `frontend/src/router/index.js`, add the footprints route after the friends route (line 12):

```js
{ path: '/footprints', name: 'Footprints', component: () => import('../pages/Footprints.vue') },
```

Insert it between the FriendLinks and Archives routes:

```js
  { path: '/photos', name: 'PhotoWall', component: () => import('../pages/PhotoWall.vue') },
  { path: '/friends', name: 'FriendLinks', component: () => import('../pages/FriendLinks.vue') },
  { path: '/footprints', name: 'Footprints', component: () => import('../pages/Footprints.vue') },
  { path: '/archives', name: 'Archives', component: () => import('../pages/Archives.vue') },
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/router/index.js
git commit -m "feat: add /footprints route"
```

---

### Task 5: Add navigation link in AppHeader

**Files:**
- Modify: `frontend/src/components/AppHeader.vue`

**Interfaces:**
- Consumes: `/footprints` route (from Task 4)

- [ ] **Step 1: Add "足迹" to navLinks array**

In `frontend/src/components/AppHeader.vue`, add the footprints entry to the `navLinks` array, between 友链 and 关于:

```js
const navLinks = [
  { path: '/', label: '首页' },
  { path: '/archives', label: '归档' },
  { path: '/categories', label: '分类' },
  { path: '/tags', label: '标签' },
  { path: '/photos', label: '照片墙' },
  { path: '/friends', label: '友链' },
  { path: '/footprints', label: '足迹' },
  { path: '/about', label: '关于' },
  { path: '/search', label: '搜索' },
]
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/AppHeader.vue
git commit -m "feat: add 足迹 nav link in header"
```

---

### Task 6: Verify end-to-end

- [ ] **Step 1: Start dev server**

```bash
cd frontend && npm run dev
```

- [ ] **Step 2: Manual verification checklist**

Navigate to `http://localhost:5173/footprints` and verify:
- Page loads without errors
- China map renders with all provinces visible
- 13 city markers show with ripple animation (pulsing effect)
- City name labels visible next to markers
- Hover on a marker shows tooltip with city name
- Stats card below map shows "已走过 13 座城市" with all city tags
- Toggle dark theme → map colors adapt (background, labels, tooltip)
- Toggle back to light → map colors revert
- Resize browser window → chart resizes correctly
- Navigate away and back → chart re-initializes cleanly (no memory leak)
- Mobile viewport (375px) → map is full-width, layout is single-column

- [ ] **Step 3: Build check**

```bash
cd frontend && npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit any final tweaks**

```bash
git add -A
git commit -m "chore: final adjustments for footprints page"
```

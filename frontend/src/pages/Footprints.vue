<template>
  <div class="page page-footprints">
    <!-- Header -->
    <div class="footprints-header">
      <div class="header-decoration">
        <span class="deco-dot"></span>
        <span class="deco-line"></span>
        <span class="deco-dot"></span>
      </div>
      <h1 class="footprints-title">🗺️ 读万卷书，行万里路</h1>
      <p class="footprints-subtitle">用脚步丈量世界，用代码记录生活</p>
    </div>

    <!-- Map -->
    <div class="map-card glass-card">
      <div ref="chartRef" class="chart-container"></div>
      <p v-if="error" class="map-error">{{ error }}</p>
    </div>

    <!-- Stats Overview -->
    <div class="stats-overview">
      <div class="stat-card glass-card">
        <span class="stat-icon">🏙️</span>
        <span class="stat-number">{{ cities.length }}</span>
        <span class="stat-label">座城市</span>
      </div>
      <div class="stat-card glass-card">
        <span class="stat-icon">🗺️</span>
        <span class="stat-number">{{ visitedProvinces.length }}</span>
        <span class="stat-label">个省/地区</span>
      </div>
      <div class="stat-card glass-card">
        <span class="stat-icon">✨</span>
        <span class="stat-number">{{ coveragePercent }}%</span>
        <span class="stat-label">探索进度</span>
      </div>
    </div>

    <!-- Cities by Region -->
    <div class="regions-section">
      <h2 class="section-title">📍 足迹分布</h2>
      <div class="region-grid">
        <div v-for="region in regions" :key="region.name" class="region-card glass-card">
          <h3 class="region-name">{{ region.emoji }} {{ region.name }}</h3>
          <div class="region-city-tags">
            <span v-for="city in region.cities" :key="city" class="region-city-tag">{{ city }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)
const error = ref('')
let chart = null
let themeObserver = null

// ========================================
// City data — 26 cities across 13 provinces
// ========================================
const cities = [
  // 京津冀
  { name: '北京', lng: 116.4074, lat: 39.9042, province: '北京市' },
  { name: '天津', lng: 117.1902, lat: 39.1252, province: '天津市' },
  // 长三角
  { name: '南京', lng: 118.7969, lat: 32.0603, province: '江苏省' },
  { name: '苏州', lng: 120.5954, lat: 31.2990, province: '江苏省' },
  { name: '合肥', lng: 117.2273, lat: 31.8206, province: '安徽省' },
  { name: '安庆', lng: 117.0510, lat: 30.5319, province: '安徽省' },
  // 珠三角
  { name: '广州', lng: 113.2644, lat: 23.1291, province: '广东省' },
  { name: '深圳', lng: 114.0579, lat: 22.5431, province: '广东省' },
  { name: '香港', lng: 114.1657, lat: 22.2793, province: '香港特别行政区' },
  { name: '澳门', lng: 113.5491, lat: 22.1987, province: '澳门特别行政区' },
  { name: '中山', lng: 113.3824, lat: 22.5159, province: '广东省' },
  { name: '珠海', lng: 113.5767, lat: 22.2707, province: '广东省' },
  // 潮汕
  { name: '潮州', lng: 116.6224, lat: 23.6581, province: '广东省' },
  { name: '汕头', lng: 116.6821, lat: 23.3535, province: '广东省' },
  // 中部
  { name: '武汉', lng: 114.3054, lat: 30.5931, province: '湖北省' },
  { name: '长沙', lng: 112.9388, lat: 28.2278, province: '湖南省' },
  { name: '衡阳', lng: 112.5727, lat: 26.8932, province: '湖南省' },
  { name: '南昌', lng: 115.8581, lat: 28.6820, province: '江西省' },
  { name: '赣州', lng: 114.9350, lat: 25.8318, province: '江西省' },
  // 西南
  { name: '重庆', lng: 106.5516, lat: 29.5630, province: '重庆市' },
  { name: '内江', lng: 105.0584, lat: 29.5801, province: '四川省' },
  { name: '泸州', lng: 105.4423, lat: 28.8718, province: '四川省' },
  { name: '昆明', lng: 102.8329, lat: 24.8801, province: '云南省' },
  { name: '丽江', lng: 100.2299, lat: 26.8550, province: '云南省' },
  { name: '大理', lng: 100.2299, lat: 25.6065, province: '云南省' },
  { name: '保山', lng: 99.1770, lat: 25.1120, province: '云南省' },
]

// ========================================
// Region groups for display
// ========================================
const regions = [
  { name: '京津冀', emoji: '🏛️', cities: ['北京', '天津'] },
  { name: '长三角', emoji: '🌉', cities: ['南京', '苏州', '合肥', '安庆'] },
  { name: '珠三角', emoji: '🌊', cities: ['广州', '深圳', '香港', '澳门', '中山', '珠海'] },
  { name: '潮汕', emoji: '🍵', cities: ['潮州', '汕头'] },
  { name: '中部', emoji: '⛰️', cities: ['武汉', '长沙', '衡阳', '南昌', '赣州'] },
  { name: '西南', emoji: '🏔️', cities: ['重庆', '内江', '泸州', '昆明', '丽江', '大理', '保山'] },
]

// ========================================
// Computed stats
// ========================================
const visitedProvinces = computed(() => {
  return [...new Set(cities.map(c => c.province))]
})

const coveragePercent = computed(() => {
  return Math.round((visitedProvinces.value.length / 34) * 100)
})

// ========================================
// Theme helpers
// ========================================
function isDark() {
  return document.documentElement.classList.contains('theme-dark')
}

// ========================================
// ECharts option
// ========================================
function getChartOption() {
  const dark = isDark()
  const textColor = dark ? '#bbb' : '#4a3040'
  const mapBg = dark ? '#1a1a2e' : '#fef0f3'
  const borderColor = dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,133,162,0.18)'
  const visitedColor = dark ? '#3d2030' : '#ffe0e8'
  const visitedBorder = dark ? 'rgba(255,133,162,0.3)' : 'rgba(255,133,162,0.4)'
  const emphasisBg = dark ? 'rgba(255,133,162,0.12)' : 'rgba(255,133,162,0.08)'

  // Build geo regions for visited provinces
  const geoRegions = visitedProvinces.value
    .filter(p => p) // filter out empty names
    .map(p => ({
      name: p,
      itemStyle: {
        areaColor: visitedColor,
        borderColor: visitedBorder,
        borderWidth: 1.5,
      },
      label: { show: false },
      emphasis: {
        itemStyle: { areaColor: dark ? '#4d2840' : '#ffd0dc' },
      },
    }))

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        if (params.seriesType === 'effectScatter') {
          const city = cities.find(c => c.name === params.name)
          const prov = city ? city.province : ''
          return `<strong>${params.name}</strong><br/>📍 ${prov}`
        }
        return params.name
      },
      backgroundColor: dark ? '#1e1e2e' : '#fff',
      borderColor: '#ff85a2',
      borderWidth: 1,
      textStyle: { color: dark ? '#e0e0e0' : '#4a3040', fontSize: 13 },
      extraCssText: 'border-radius: 10px; padding: 8px 12px; box-shadow: 0 4px 16px rgba(255,133,162,0.15);',
    },
    geo: {
      map: 'china',
      roam: true,
      zoom: 1.15,
      center: [108, 34],
      scaleLimit: { min: 0.8, max: 8 },
      label: { show: false },
      itemStyle: {
        areaColor: mapBg,
        borderColor: borderColor,
        borderWidth: 1,
        shadowBlur: 0,
      },
      emphasis: {
        label: { show: true, color: textColor, fontSize: 12 },
        itemStyle: { areaColor: emphasisBg },
      },
      regions: geoRegions,
    },
    series: [
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: cities.map(c => ({ name: c.name, value: [c.lng, c.lat] })),
        symbolSize: 12,
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke',
          scale: 5,
          period: 4.5,
          color: '#ff85a2',
        },
        itemStyle: {
          color: '#ff85a2',
          shadowBlur: 14,
          shadowColor: '#ff85a2',
          borderColor: '#fff',
          borderWidth: 1.5,
        },
        label: {
          show: true,
          formatter: '{b}',
          position: 'right',
          distance: 8,
          color: textColor,
          fontSize: 11,
          fontWeight: 500,
        },
        emphasis: {
          scale: 2.2,
          itemStyle: {
            shadowBlur: 20,
            shadowColor: '#ff85a2',
          },
        },
      },
    ],
  }
}

// ========================================
// Chart lifecycle
// ========================================
async function initChart() {
  if (!chartRef.value) return

  try {
    const resp = await fetch('/china-geo.json')
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const geoJson = await resp.json()
    echarts.registerMap('china', geoJson)

    chart = echarts.init(chartRef.value)
    chart.setOption(getChartOption())

    window.addEventListener('resize', handleResize)
  } catch (e) {
    console.error('地图加载失败:', e)
    error.value = '地图加载失败，请稍后重试'
  }
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

// ========================================
// Page layout
// ========================================
.page-footprints {
  max-width: 960px;
  margin: 0 auto;
  padding: 28px 16px 40px;
}

// ========================================
// Header
// ========================================
.footprints-header {
  text-align: center;
  margin-bottom: 32px;
}

.header-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;

  .deco-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: $accent-pink;
    opacity: 0.6;
  }

  .deco-line {
    width: 40px;
    height: 1px;
    background: linear-gradient(90deg, transparent, $accent-pink, transparent);
    opacity: 0.5;
  }
}

.footprints-title {
  font-size: 2rem;
  font-weight: 800;
  color: $accent-pink;
  margin: 0 0 8px;
  letter-spacing: 1px;

  @media (max-width: 767px) {
    font-size: 1.5rem;
  }
}

.footprints-subtitle {
  font-size: 0.95rem;
  color: $text-secondary;
  margin: 0;
}

// ========================================
// Map card
// ========================================
.map-card {
  margin-bottom: 28px;
  padding: 8px;
  overflow: hidden;
}

.chart-container {
  width: 100%;
  height: 540px;

  @media (max-width: 767px) {
    height: 380px;
  }
}

.map-error {
  text-align: center;
  padding: 20px;
  color: #e74c3c;
  font-size: 0.9rem;
}

// ========================================
// Stats overview — 3-column cards
// ========================================
.stats-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 28px;

  @media (max-width: 639px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 16px;
  text-align: center;
  cursor: default;

  &:hover {
    transform: translateY(-3px);
  }
}

.stat-icon {
  font-size: 1.6rem;
  margin-bottom: 6px;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: $accent-pink;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.85rem;
  color: $text-secondary;
  margin-top: 4px;
}

// ========================================
// Regions section
// ========================================
.regions-section {
  margin-top: 4px;
}

.section-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: $text-primary;
  margin: 0 0 16px;
  padding-left: 4px;
}

.region-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 639px) {
    grid-template-columns: 1fr;
  }
}

.region-card {
  padding: 18px 20px;
  cursor: default;

  &:hover {
    transform: translateY(-2px);
  }
}

.region-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: $text-primary;
  margin: 0 0 12px;
}

.region-city-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.region-city-tag {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 16px;
  background: rgba(255, 133, 162, 0.07);
  border: 1px solid rgba(255, 133, 162, 0.18);
  color: $accent-pink;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all $transition-fast;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 133, 162, 0.14);
    border-color: $accent-pink;
    transform: translateY(-1px);
  }
}
</style>

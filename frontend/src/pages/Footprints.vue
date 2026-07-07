<template>
  <div class="page page-footprints">
    <div class="footprints-header">
      <h1 class="footprints-title">🗺️ 读万卷书，行万里路</h1>
      <p class="footprints-subtitle">用脚步丈量世界，用代码记录生活</p>
    </div>

    <div class="map-card glass-card">
      <div ref="chartRef" class="chart-container"></div>
      <p v-if="error" class="map-error">{{ error }}</p>
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
const error = ref('')
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

  try {
    // Fetch GeoJSON
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

.map-error {
  text-align: center;
  padding: 16px;
  color: #e74c3c;
  font-size: 0.9rem;
}
</style>

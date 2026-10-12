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
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useTheme } from '@/composables/useTheme'
// P1 perf: import only the echarts pieces this page uses (map + scatter +
// effectScatter). The old `import('echarts')` pulled the full ~1.1 MB build
// for a single choropleth map. Tree-shaking cuts the chunk substantially.
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { ScatterChart, EffectScatterChart } from 'echarts/charts'
import { GeoComponent, TooltipComponent } from 'echarts/components'
import { LabelLayout } from 'echarts/features'
import {
  FOOTPRINT_CITIES,
  FOOTPRINT_REGIONS,
  FOOTPRINT_PROVINCES,
} from '@/data/footprints'

echarts.use([
  CanvasRenderer,
  ScatterChart,
  EffectScatterChart,
  GeoComponent,
  TooltipComponent,
  LabelLayout,
])

const { isDark } = useTheme()

const chartRef = ref(null)
const error = ref('')
let chart = null

// ========================================
// Data — shared with the build-time pre-renderer (src/data/footprints.js)
// ========================================
// Cannot stay inline: scripts/prerender.mjs needs the same list to write the
// crawlable <noscript> snapshot of this page, and a Node script can't import a
// .vue file. Aliased so the rest of the component reads unchanged.
const cities = FOOTPRINT_CITIES
const regions = FOOTPRINT_REGIONS

// ========================================
// Computed stats
// ========================================
const visitedProvinces = computed(() => FOOTPRINT_PROVINCES)

const coveragePercent = computed(() => {
  return Math.round((visitedProvinces.value.length / 34) * 100)
})

// ========================================
// ECharts option
// ========================================
function getChartOption() {
  const dark = isDark.value

  // ---- colour tokens ----
  const textColor = dark ? '#dce4de' : '#263129'
  const mapBg = dark ? '#222c27' : '#eef0e9'
  const mapBorder = dark ? 'rgba(237,241,238,0.08)' : 'rgba(63,107,87,0.18)'
  const visitedFill = dark ? '#2e4036' : '#dfe8e1'
  const visitedStroke = dark ? 'rgba(143,178,156,0.45)' : 'rgba(63,107,87,0.5)'
  const unvisitedEmphasis = dark ? 'rgba(143,178,156,0.08)' : 'rgba(63,107,87,0.07)'
  const visitedEmphasis = dark ? '#395044' : '#cfddd3'

  // ---- geo regions: highlight visited provinces ----
  const geoRegions = visitedProvinces.value
    .filter(p => p)
    .map(p => ({
      name: p,
      itemStyle: {
        areaColor: visitedFill,
        borderColor: visitedStroke,
        borderWidth: 1.5,
      },
      label: { show: false },
      emphasis: {
        itemStyle: { areaColor: visitedEmphasis },
        label: { show: true, color: textColor, fontSize: 12 },
      },
    }))

  // ---- series data: per-item label position for dense clusters ----
  const scatterData = cities.map(c => {
    const item = { name: c.name, value: [c.lng, c.lat] }
    if (c.labelPos) item.label = { position: c.labelPos, distance: 8 }
    return item
  })

  return {
    backgroundColor: 'transparent',

    // ----- tooltip -----
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        if (params.seriesType === 'effectScatter') {
          const city = cities.find(c => c.name === params.name)
          const prov = city ? city.province : ''
          return `<strong>${params.name}</strong><br/><span style="opacity:.7">📍 ${prov}</span>`
        }
        return params.name
      },
      backgroundColor: dark ? '#222c27' : '#fff',
      borderColor: '#3f6b57',
      borderWidth: 1,
      textStyle: { color: dark ? '#edf1ee' : '#263129', fontSize: 13 },
      extraCssText: 'border-radius: 6px; padding: 8px 12px; box-shadow: 0 8px 24px rgba(31,42,36,0.14);',
    },

    // ----- base map -----
    geo: {
      map: 'china',
      roam: true,
      zoom: 1.15,
      center: [107, 35],
      scaleLimit: { min: 0.8, max: 8 },
      silent: false,
      label: { show: false },
      itemStyle: {
        areaColor: mapBg,
        borderColor: mapBorder,
        borderWidth: 1,
      },
      emphasis: {
        label: { show: true, color: textColor, fontSize: 12 },
        itemStyle: { areaColor: unvisitedEmphasis },
      },
      regions: geoRegions,
    },

    // ----- series -----
    series: [
      // Layer 1 — soft glow ring behind each marker
      {
        type: 'scatter',
        coordinateSystem: 'geo',
        data: scatterData,
        symbolSize: 18,
        silent: true,
        itemStyle: {
          color: dark ? 'rgba(143,178,156,0.18)' : 'rgba(63,107,87,0.2)',
        },
        label: { show: false },
      },
      // Layer 2 — ripple markers
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: scatterData,
        symbolSize: 11,
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke',
          scale: 5.5,
          period: 5,
          color: '#3f6b57',
        },
        itemStyle: {
          color: '#3f6b57',
          shadowBlur: 8,
          shadowColor: 'rgba(63,107,87,0.35)',
          borderColor: dark ? '#2a2a3e' : '#fff',
          borderWidth: 1.8,
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
        labelLayout: { hideOverlap: true },
        emphasis: {
          scale: 2.5,
          itemStyle: {
            shadowBlur: 16,
            shadowColor: '#3f6b57',
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
    error.value = '地图加载失败，请稍后重试'
  }
}

function handleResize() {
  chart?.resize()
}

// Reactively update chart when theme changes
watch(isDark, () => {
  if (chart && !chart.isDisposed()) {
    chart.setOption(getChartOption(), true)
  }
})

onMounted(async () => {
  await nextTick()
  await initChart()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
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
  padding: 52px 20px 40px;
}

// ========================================
// Header
// ========================================
.footprints-header {
  text-align: left;
  margin-bottom: 32px;
}

.header-decoration {
  display: none;
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
  font-size: 2.4rem;
  font-weight: 750;
  color: $text-primary;
  margin: 0 0 8px;
  letter-spacing: 0;

  @media (max-width: 767px) {
    font-size: 2rem;
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
  background: rgba($accent-pink, 0.07);
  border: 1px solid rgba($accent-pink, 0.18);
  color: $accent-pink;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all $transition-fast;
  white-space: nowrap;

  &:hover {
    background: rgba($accent-pink, 0.14);
    border-color: $accent-pink;
    transform: translateY(-1px);
  }
}

@media (max-width: 767px) {
  .page-footprints { padding: 32px 14px 28px; }
  .footprints-header { margin-bottom: 24px; }
  .map-card { margin-bottom: 18px; padding: 4px; }
}
</style>

<template>
  <div ref="live2dContainer" class="live2d-widget"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue'

const live2dContainer = ref(null)

onMounted(() => {
  const script = document.createElement('script')
  script.src = '/live2d/L2Dwidget.min.js'
  script.async = true
  script.onload = () => {
    if (window.L2Dwidget) {
      window.L2Dwidget.init({
        model: {
          jsonPath: 'https://unpkg.com/live2d-widget-model-shizuku@1.0.5/assets/shizuku.model.json',
        },
        display: {
          position: 'right',
          width: 100,
          height: 220,
          hOffset: -30,
          vOffset: -10,
        },
        mobile: {
          show: false,
        },
        react: {
          opacityDefault: 0.25,
          opacityOnHover: 0.8,
        },
      })

      // After init, make the L2Dwidget canvas not block clicks
      nextTick(() => {
        const canvases = document.querySelectorAll('#live2d-widget-model-shizuku-tororo canvas, #live2d-widget-model-shizuku-tororo')
        canvases.forEach(el => {
          el.style.pointerEvents = 'none'
        })
        // Also set pointer-events on any L2Dwidget generated elements
        const widgetEls = document.querySelectorAll('[id^="live2d-widget"]')
        widgetEls.forEach(el => {
          el.style.pointerEvents = 'none'
        })
      })
    }
  }
  document.body.appendChild(script)
})

onBeforeUnmount(() => {
  const scripts = document.querySelectorAll('script[src*="L2Dwidget"]')
  scripts.forEach(s => s.remove())
  // Clean up widget elements
  const widgetEls = document.querySelectorAll('[id^="live2d-widget"]')
  widgetEls.forEach(el => el.remove())
})
</script>

<style lang="scss" scoped>
.live2d-widget {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 1;
  pointer-events: none;
}
</style>

<style>
/* Global styles for L2Dwidget canvas after it's created */
[id^="live2d-widget"] {
  pointer-events: none !important;
  z-index: 1 !important;
}
[id^="live2d-widget"] canvas {
  pointer-events: none !important;
}
</style>

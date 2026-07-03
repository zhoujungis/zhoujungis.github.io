<template>
  <div ref="live2dContainer" class="live2d-widget"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

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
          width: 150,
          height: 300,
          hOffset: 0,
          vOffset: -20,
        },
        mobile: {
          show: true,
          scale: 0.5,
        },
        react: {
          opacityDefault: 0.7,
          opacityOnHover: 0.2,
        },
      })
    }
  }
  document.body.appendChild(script)
})

onBeforeUnmount(() => {
  const scripts = document.querySelectorAll('script[src*="L2Dwidget"]')
  scripts.forEach(s => s.remove())
})
</script>

<style lang="scss" scoped>
.live2d-widget {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 999;
  pointer-events: none;
}
</style>

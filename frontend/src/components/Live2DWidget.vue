<template>
  <div ref="live2dContainer" class="live2d-widget"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const live2dContainer = ref(null)

// P0-4 fix: L2Dwidget's built-in `mobile.show:false` was unreliable — the
// portrait still rendered on narrow viewports and overlapped article text.
// Guard at the component level instead: only mount on genuinely wide
// screens, and defer the (heavy) model load off the critical path.
const MOBILE_BREAKPOINT = 768

let loadTimer = null
let cancelled = false

function isWideEnough() {
  return typeof window !== 'undefined' && window.innerWidth >= MOBILE_BREAKPOINT
}

function injectWidget() {
  if (cancelled || window.L2Dwidget) return
  const script = document.createElement('script')
  script.src = '/live2d/L2Dwidget.min.js'
  script.async = true
  script.onload = () => {
    if (cancelled || !window.L2Dwidget) return
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
    const canvases = document.querySelectorAll('#live2d-widget-model-shizuku-tororo canvas, #live2d-widget-model-shizuku-tororo')
    canvases.forEach(el => {
      el.style.pointerEvents = 'none'
    })
    // Also set pointer-events on any L2Dwidget generated elements
    const widgetEls = document.querySelectorAll('[id^="live2d-widget"]')
    widgetEls.forEach(el => {
      el.style.pointerEvents = 'none'
    })
  }
  document.body.appendChild(script)
}

function scheduleLoad() {
  // Defer until the browser is idle (or ~2.5s as a fallback) so the widget
  // never competes with first paint / article text for the main thread.
  if ('requestIdleCallback' in window) {
    loadTimer = window.requestIdleCallback(() => injectWidget(), { timeout: 4000 })
  } else {
    loadTimer = window.setTimeout(injectWidget, 2500)
  }
}

function handleResize() {
  // If the viewport drops below the breakpoint after load, hide the widget.
  if (!isWideEnough()) {
    document.querySelectorAll('[id^="live2d-widget"]').forEach(el => {
      el.style.display = 'none'
    })
  } else {
    document.querySelectorAll('[id^="live2d-widget"]').forEach(el => {
      el.style.display = ''
    })
  }
}

onMounted(() => {
  // Never even load on small screens (phones) — fixes the overlap bug.
  if (!isWideEnough()) return
  scheduleLoad()
  window.addEventListener('resize', handleResize, { passive: true })
})

onBeforeUnmount(() => {
  cancelled = true
  if (loadTimer) {
    if ('cancelIdleCallback' in window) window.cancelIdleCallback(loadTimer)
    else window.clearTimeout(loadTimer)
  }
  window.removeEventListener('resize', handleResize)
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

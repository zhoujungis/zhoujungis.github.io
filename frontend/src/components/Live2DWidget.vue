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
let onLoad = null
let cancelled = false

function isWideEnough() {
  return typeof window !== 'undefined' && window.innerWidth >= MOBILE_BREAKPOINT
}

// Decoration only — skip it entirely for visitors who asked for less motion or
// who are on a metered / slow connection. The model alone is ~2MB.
function shouldSkip() {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return true
  const conn = navigator.connection
  if (conn?.saveData) return true
  if (conn?.effectiveType && ['slow-2g', '2g', '3g'].includes(conn.effectiveType)) return true
  return false
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
        // Self-hosted (frontend/public/live2d/model/shizuku/) — unpkg.com
        // was slow/unreliable in mainland China and a third-party dependency.
        jsonPath: '/live2d/model/shizuku/shizuku.model.json',
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

function scheduleIdle() {
  onLoad = null
  if (cancelled) return
  if ('requestIdleCallback' in window) {
    loadTimer = window.requestIdleCallback(() => injectWidget(), { timeout: 4000 })
  } else {
    loadTimer = window.setTimeout(injectWidget, 2500)
  }
}

function scheduleLoad() {
  // Wait for `load` before even scheduling: the model plus its ~19 motion,
  // expression and texture requests used to start while the browser was still
  // working on first paint, competing for both the main thread and bandwidth.
  if (document.readyState === 'complete') {
    scheduleIdle()
    return
  }
  onLoad = () => scheduleIdle()
  window.addEventListener('load', onLoad, { once: true })
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
  // Never even load on small screens (phones) — fixes the overlap bug — nor
  // for visitors who opted out of motion or are on a constrained connection.
  if (!isWideEnough() || shouldSkip()) return
  scheduleLoad()
  window.addEventListener('resize', handleResize, { passive: true })
})

onBeforeUnmount(() => {
  cancelled = true
  if (onLoad) window.removeEventListener('load', onLoad)
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

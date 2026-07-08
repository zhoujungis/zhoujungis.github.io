/**
 * Shared scroll observer — a single rAF-based scroll listener
 * that all components can tap into, avoiding N independent listeners.
 */
import { ref, onMounted, onUnmounted } from 'vue'

const listeners = new Set()
let rafId = null

function onGlobalScroll() {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    const y = window.scrollY
    for (const fn of listeners) fn(y)
    rafId = null
  })
}

let attached = false

function ensureAttached() {
  if (attached) return
  window.addEventListener('scroll', onGlobalScroll, { passive: true })
  attached = true
}

function ensureDetached() {
  if (listeners.size > 0) return
  window.removeEventListener('scroll', onGlobalScroll)
  attached = false
  if (rafId) { cancelAnimationFrame(rafId); rafId = null }
}

export function useScroll(callback) {
  const scrollY = ref(0)

  function handler(y) {
    scrollY.value = y
    if (callback) callback(y)
  }

  onMounted(() => {
    listeners.add(handler)
    ensureAttached()
    handler(window.scrollY) // initial value
  })

  onUnmounted(() => {
    listeners.delete(handler)
    ensureDetached()
  })

  return { scrollY }
}

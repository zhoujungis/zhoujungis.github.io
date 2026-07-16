import { ref, onUnmounted } from 'vue'

/**
 * Coordinated body scroll lock — ref-counted so multiple overlapping
 * overlays (drawer + lightbox, etc.) don't fight over `body.style.overflow`.
 *
 * Usage:
 *   const lock = useScrollLock()
 *   watch(visible, (v) => v ? lock.acquire() : lock.release())
 *   onUnmounted(() => lock.release())   // safety net
 */

// Module-level counter — shared across all consumers.
let count = 0
let savedOverflow = null

function setLocked(locked) {
  if (typeof document === 'undefined') return
  if (locked) {
    if (count === 1) {
      // First lock — capture current value and lock
      savedOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
    // else: already locked, just increment
  } else {
    // Caller is releasing; count was already decremented outside
  }
}

export function useScrollLock() {
  function acquire() {
    count += 1
    setLocked(true)
  }
  function release() {
    if (count === 0) return
    count -= 1
    if (count === 0 && savedOverflow !== null) {
      document.body.style.overflow = savedOverflow
      savedOverflow = null
    }
  }
  // Auto-release on unmount in case the consumer forgot.
  onUnmounted(release)
  return { acquire, release, get count() { return count } }
}
/**
 * Centralised theme state — components can reactively read/write
 * the current theme without MutationObserver hacks.
 */
import { ref, watch } from 'vue'

const isDark = ref(false)

// Initialise from localStorage or system preference
const saved = localStorage.getItem('theme')
if (saved === 'dark') {
  isDark.value = true
  document.documentElement.classList.add('theme-dark')
} else if (!saved) {
  // Default to light (sakura)
  isDark.value = false
}

// Keep DOM in sync
watch(isDark, (val) => {
  document.documentElement.classList.toggle('theme-dark', val)
  localStorage.setItem('theme', val ? 'dark' : 'light')
})

export function useTheme() {
  function toggle() {
    isDark.value = !isDark.value
  }

  return { isDark, toggle }
}

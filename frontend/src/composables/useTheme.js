/**
 * Centralised theme state — components can reactively read/write
 * the current theme without MutationObserver hacks.
 *
 * IMPORTANT: Do NOT call watch / watchEffect at module level —
 * Vue requires an active component instance for those.
 */
import { ref } from 'vue'

const isDark = ref(false)

// Initialise once from localStorage
const saved = localStorage.getItem('theme')
if (saved === 'dark') {
  isDark.value = true
  document.documentElement.classList.add('theme-dark')
}

export function useTheme() {
  function toggle() {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('theme-dark', isDark.value)
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  return { isDark, toggle }
}

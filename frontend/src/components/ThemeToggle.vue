<template>
  <button
    class="theme-toggle"
    :class="{ 'theme-toggle--floating': floating }"
    :title="isDark ? '切换到亮色主题' : '切换到暗色主题'"
    :aria-label="isDark ? '切换到亮色主题' : '切换到暗色主题'"
    @click="toggle"
  >
    <svg v-if="!isDark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
    <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" />
    </svg>
  </button>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme'

defineProps({
  floating: {
    type: Boolean,
    default: false,
  },
})

const { isDark, toggle } = useTheme()
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  padding: 0;
  color: $text-secondary;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 50%;
  cursor: pointer;
  transition: color $transition-fast, background $transition-fast, border-color $transition-fast;

  svg { width: 18px; height: 18px; }

  &:hover {
    color: $accent-pink;
    background: $bg-secondary;
    border-color: $glass-border;
  }
}

.theme-toggle--floating {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 999;
  background: $bg-card;
  border-color: $glass-border;
  box-shadow: $card-shadow;
}
</style>

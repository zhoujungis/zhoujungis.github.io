<template>
  <button class="theme-toggle" :title="isLight ? '切换到暗色主题' : '切换到亮色主题'" @click="toggle">
    <svg v-if="isLight" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isLight = ref(true)  // default: sakura light theme

function toggle() {
  isLight.value = !isLight.value
  document.documentElement.classList.toggle('theme-dark', !isLight.value)
  localStorage.setItem('theme', isLight.value ? 'light' : 'dark')
}

onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark') {
    isLight.value = false
    document.documentElement.classList.add('theme-dark')
  }
})
</script>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px; height: 36px;
  border-radius: 50%;
  border: 1px solid var(--glass-border, rgba(255,255,255,0.08));
  background: rgba(255,255,255,0.04);
  color: var(--text-secondary, #999);
  cursor: pointer;
  transition: color 0.2s, background 0.2s;
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 999;
}
.theme-toggle:hover {
  color: var(--neon-cyan, #00e5ff);
  background: rgba(0,229,255,0.08);
}
</style>

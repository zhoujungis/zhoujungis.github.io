<template>
  <transition name="fade">
    <button v-if="visible" class="back-to-top" @click="scrollToTop" aria-label="回到顶部">
      <svg class="arrow-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { useScroll } from '@/composables/useScroll'

const { scrollY } = useScroll()
const visible = computed(() => scrollY.value > 300)
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.back-to-top {
  position: fixed; bottom: 24px; right: 24px; z-index: 998;
  width: 42px; height: 42px; border-radius: 50%;
  border: 1px solid $glass-border;
  background: rgba(255, 255, 255, 0.94);
  color: $accent-pink;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: $card-shadow;
  transition: transform $transition-base, box-shadow $transition-base, border-color $transition-base;

  &:hover {
    transform: translateY(-3px);
    box-shadow: $card-shadow-hover;
    border-color: $accent-pink;
  }

  &:active { transform: scale(0.95); }
}

@media (max-width: 767px) {
  .back-to-top { right: 14px; bottom: 16px; width: 40px; height: 40px; }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.35s ease, transform 0.35s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(8px); }
</style>

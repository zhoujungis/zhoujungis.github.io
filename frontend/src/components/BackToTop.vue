<template>
  <transition name="fade">
    <button
      v-if="visible"
      class="back-to-top"
      @click="scrollToTop"
      aria-label="Back to top"
    >
      <svg
        class="arrow-icon"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 300
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/styles/variables' as *;

.back-to-top {
  position: fixed;
  bottom: 80px;
  right: 24px;
  z-index: 998;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid $neon-cyan;
  background: rgba(10, 10, 15, 0.7);
  color: $neon-cyan;
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    box-shadow $transition-fast,
    background $transition-fast,
    border-color $transition-fast;
  box-shadow:
    0 0 6px rgba($neon-cyan, 0.4),
    0 0 12px rgba($neon-cyan, 0.2),
    inset 0 0 6px rgba($neon-cyan, 0.1);

  &:hover {
    background: rgba($neon-cyan, 0.12);
    border-color: color.adjust($neon-cyan, $lightness: 10%);
    box-shadow:
      0 0 10px rgba($neon-cyan, 0.6),
      0 0 20px rgba($neon-cyan, 0.3),
      inset 0 0 10px rgba($neon-cyan, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }
}

.arrow-icon {
  display: block;
}

// Transition
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>

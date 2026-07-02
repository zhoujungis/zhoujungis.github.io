<template>
  <transition name="fade-out">
    <div v-if="loading" class="loading-screen">
      <div class="loading-content">
        <h1 class="logo-neon">ZhouJun</h1>
        <div class="progress-track">
          <div class="progress-bar"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(true)

onMounted(() => {
  // Wait for the next tick to ensure everything is rendered,
  // then fade out after a short minimum display time.
  const MIN_DISPLAY_MS = 600
  const startTime = Date.now()

  const hide = () => {
    const elapsed = Date.now() - startTime
    const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed)

    setTimeout(() => {
      loading.value = false
    }, remaining)
  }

  // Use requestIdleCallback if available, else fallback to setTimeout
  if (window.requestIdleCallback) {
    window.requestIdleCallback(hide, { timeout: 200 })
  } else {
    setTimeout(hide, 50)
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $bg-primary;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

// ---- Neon logo ----
.logo-neon {
  font-family: $font-mono;
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: 4px;
  color: $neon-pink;
  text-shadow:
    0 0 7px $neon-pink,
    0 0 10px $neon-pink,
    0 0 21px $neon-pink,
    0 0 42px rgba($neon-pink, 0.5),
    0 0 82px rgba($neon-pink, 0.3);
  animation: pulse-glow 1.8s ease-in-out infinite;
  margin: 0;

  @media (max-width: 480px) {
    font-size: 2.2rem;
  }
}

@keyframes pulse-glow {
  0%, 100% {
    text-shadow:
      0 0 7px $neon-pink,
      0 0 10px $neon-pink,
      0 0 21px $neon-pink,
      0 0 42px rgba($neon-pink, 0.5);
    opacity: 1;
  }
  50% {
    text-shadow:
      0 0 10px $neon-pink,
      0 0 20px $neon-pink,
      0 0 40px $neon-pink,
      0 0 80px rgba($neon-pink, 0.6),
      0 0 120px rgba($neon-pink, 0.3);
    opacity: 1;
  }
}

// ---- Progress bar ----
.progress-track {
  width: 200px;
  height: 3px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  width: 40%;
  background: $neon-cyan;
  border-radius: 2px;
  box-shadow:
    0 0 6px $neon-cyan,
    0 0 12px rgba($neon-cyan, 0.4);
  animation: scan-line 1.4s ease-in-out infinite;
}

@keyframes scan-line {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(150%);
  }
  100% {
    transform: translateX(350%);
  }
}

// ---- Fade out transition ----
.fade-out-leave-active {
  transition: opacity 0.5s ease;
}

.fade-out-leave-to {
  opacity: 0;
}
</style>

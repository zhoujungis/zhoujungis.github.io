<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import ParticleBg from './components/ParticleBg.vue'
import Live2DWidget from './components/Live2DWidget.vue'
import BackToTop from './components/BackToTop.vue'
import LoadingScreen from './components/LoadingScreen.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import ThemeToggle from './components/ThemeToggle.vue'
</script>

<template>
  <LoadingScreen />
  <ReadingProgress />
  <ParticleBg />
  <AppHeader />
  <main class="main-content">
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
  <AppFooter />
  <Live2DWidget />
  <BackToTop />
  <ThemeToggle />
</template>

<style lang="scss">
.main-content {
  padding-top: 56px;
  min-height: calc(100vh - 120px);
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.page-enter-from { opacity: 0; transform: translateY(12px); }
.page-leave-to { opacity: 0; transform: translateY(-12px); }
</style>

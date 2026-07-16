<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import ParticleBg from './components/ParticleBg.vue'
import Live2DWidget from './components/Live2DWidget.vue'
import BackToTop from './components/BackToTop.vue'
import LoadingScreen from './components/LoadingScreen.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import ThemeToggle from './components/ThemeToggle.vue'

const route = useRoute()
// M24: 60fps canvas + Live2D model load add no value on admin pages —
// they're CPU heavy and make login/dashboard sluggish, especially on phones.
const isAdmin = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <LoadingScreen />
  <ReadingProgress />
  <ParticleBg v-if="!isAdmin" />
  <AppHeader v-if="!isAdmin" />
  <main class="main-content" :class="{ 'main-content--admin': isAdmin }">
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
  <AppFooter v-if="!isAdmin" />
  <Live2DWidget v-if="!isAdmin" />
  <BackToTop v-if="!isAdmin" />
  <ThemeToggle />
</template>

<style lang="scss">
.main-content {
  padding-top: 56px;
  min-height: calc(100vh - 120px);
}

.main-content--admin {
  padding-top: 0;
  min-height: 100vh;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.page-enter-from { opacity: 0; transform: translateY(12px); }
.page-leave-to { opacity: 0; transform: translateY(-12px); }
</style>
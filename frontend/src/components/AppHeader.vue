<template>
  <header class="app-header">
    <div class="header-inner">
      <router-link to="/" class="logo">ZhouJun</router-link>

      <nav class="nav-desktop">
        <router-link v-for="link in navLinks" :key="link.path" :to="link.path" class="nav-link">
          {{ link.label }}
        </router-link>
      </nav>

      <button class="hamburger" :class="{ active: drawerOpen }" aria-label="菜单" @click="drawerOpen = !drawerOpen">
        <span></span><span></span><span></span>
      </button>
    </div>

    <transition name="drawer">
      <div v-if="drawerOpen" class="drawer-overlay" @click="drawerOpen = false" />
    </transition>

    <transition name="slide">
      <aside v-if="drawerOpen" class="drawer">
        <nav class="drawer-nav">
          <router-link v-for="link in navLinks" :key="link.path" :to="link.path" class="drawer-link" @click="drawerOpen = false">
            {{ link.label }}
          </router-link>
        </nav>
      </aside>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const drawerOpen = ref(false)
const navLinks = [
  { path: '/', label: '首页' },
  { path: '/archives', label: '归档' },
  { path: '/categories', label: '分类' },
  { path: '/tags', label: '标签' },
  { path: '/photos', label: '照片墙' },
  { path: '/friends', label: '友链' },
  { path: '/footprints', label: '足迹' },
  { path: '/about', label: '关于' },
  { path: '/search', label: '搜索' },
]
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.app-header {
  position: fixed;
  top: 0; left: 0; right: 0; z-index: 1000;
  height: 60px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 133, 162, 0.12);
  box-shadow: 0 2px 16px rgba(255, 133, 162, 0.08);
}

.header-inner {
  max-width: 1200px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  height: 100%; padding: 0 1.5rem;
}

.logo {
  font-size: 1.35rem; font-weight: 700;
  color: $accent-pink; text-decoration: none;
  letter-spacing: 0.5px;
  transition: transform $transition-bounce;
  &:hover { transform: scale(1.05); }
}

.nav-desktop {
  display: flex; gap: 0.25rem;
  @media (max-width: 767px) { display: none; }
}

.nav-link {
  text-decoration: none; color: $text-secondary;
  font-size: 0.875rem; padding: 0.35rem 0.75rem;
  border-radius: $radius-sm;
  transition: color $transition-fast, background $transition-fast;

  &:hover { color: $text-primary; background: rgba(255, 133, 162, 0.06); }

  &.router-link-active, &.router-link-exact-active {
    color: $accent-pink; font-weight: 600;
    background: rgba(255, 133, 162, 0.08);
  }
}

.hamburger {
  display: none; flex-direction: column; justify-content: center; align-items: center;
  gap: 4px; width: 36px; height: 36px;
  background: transparent; border: 1px solid $glass-border;
  border-radius: $radius-sm; cursor: pointer; padding: 6px;
  @media (max-width: 767px) { display: flex; }

  span {
    display: block; width: 18px; height: 2px;
    background: $text-secondary; border-radius: 2px;
    transition: transform $transition-base, opacity $transition-base;
  }
  &.active {
    span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
    span:nth-child(2) { opacity: 0; }
    span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
  }
}

.drawer-overlay {
  position: fixed; top: 60px; left: 0; right: 0; bottom: 0;
  background: rgba(74, 48, 64, 0.2); z-index: 998;
}

.drawer {
  position: fixed; top: 60px; right: 0;
  width: 270px; max-width: 80vw; height: calc(100vh - 60px);
  background: #fff; border-left: 1px solid $glass-border;
  z-index: 999; overflow-y: auto; padding: 1.5rem 1rem;
  box-shadow: -4px 0 20px rgba(255, 133, 162, 0.08);
}

.drawer-nav { display: flex; flex-direction: column; gap: 0.25rem; }

.drawer-link {
  text-decoration: none; color: $text-secondary;
  font-size: 1rem; padding: 0.75rem 1rem;
  border-radius: $radius-sm;
  transition: color $transition-fast, background $transition-fast;

  &:hover { color: $text-primary; background: rgba(255, 133, 162, 0.06); }

  &.router-link-active, &.router-link-exact-active {
    color: $accent-pink; font-weight: 600;
    background: rgba(255, 133, 162, 0.08);
  }
}

.drawer-enter-active, .drawer-leave-active { transition: opacity $transition-base; }
.drawer-enter-from, .drawer-leave-to { opacity: 0; }
.slide-enter-active { transition: transform $transition-base; }
.slide-leave-active { transition: transform $transition-fast; }
.slide-enter-from { transform: translateX(100%); }
.slide-leave-to { transform: translateX(100%); }

@media (max-width: 767px) { .header-inner { padding: 0 1rem; } }
</style>

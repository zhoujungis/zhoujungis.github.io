<template>
  <header class="app-header">
    <div class="header-inner">
      <router-link to="/" class="logo neon-text-cyan">ZhouJun</router-link>

      <!-- Desktop nav -->
      <nav class="nav-desktop">
        <router-link
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="nav-link"
        >
          {{ link.label }}
        </router-link>
      </nav>

      <!-- Hamburger button (mobile) -->
      <button
        class="hamburger"
        :class="{ active: drawerOpen }"
        aria-label="Toggle navigation menu"
        @click="drawerOpen = !drawerOpen"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- Mobile drawer overlay -->
    <transition name="drawer">
      <div v-if="drawerOpen" class="drawer-overlay" @click="drawerOpen = false" />
    </transition>

    <!-- Mobile drawer -->
    <transition name="slide">
      <aside v-if="drawerOpen" class="drawer">
        <nav class="drawer-nav">
          <router-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="drawer-link"
            @click="drawerOpen = false"
          >
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
  { path: '/about', label: '关于' },
  { path: '/search', label: '搜索' },
]
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 60px;
  background: $glass-bg;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid $glass-border;
  box-shadow: 0 1px 0 rgba($neon-purple, 0.15), 0 4px 20px rgba(0, 0, 0, 0.3);
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 1.5rem;
}

// ---- Logo ----
.logo {
  font-size: 1.35rem;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: 0.5px;

  &.neon-text-cyan {
    color: $neon-cyan;
    text-shadow:
      0 0 7px $neon-cyan,
      0 0 10px $neon-cyan,
      0 0 21px $neon-cyan,
      0 0 42px rgba($neon-cyan, 0.4);
  }
}

// ---- Desktop Nav ----
.nav-desktop {
  display: flex;
  gap: 0.25rem;

  @media (max-width: 767px) {
    display: none;
  }
}

.nav-link {
  text-decoration: none;
  color: $text-secondary;
  font-size: 0.875rem;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  transition: color $transition-fast, background $transition-fast;
  position: relative;

  &:hover {
    color: $text-primary;
    background: rgba(255, 255, 255, 0.04);
  }

  &.router-link-active,
  &.router-link-exact-active {
    color: $neon-cyan;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0.75rem;
      right: 0.75rem;
      height: 2px;
      background: $neon-cyan;
      box-shadow: 0 0 8px $neon-cyan, 0 0 16px rgba($neon-cyan, 0.4);
      border-radius: 1px;
    }
  }
}

// ---- Hamburger ----
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  width: 36px;
  height: 36px;
  background: transparent;
  border: 1px solid $glass-border;
  border-radius: 8px;
  cursor: pointer;
  padding: 6px;
  transition: border-color $transition-fast;

  @media (max-width: 767px) {
    display: flex;
  }

  span {
    display: block;
    width: 18px;
    height: 2px;
    background: $text-secondary;
    border-radius: 2px;
    transition: transform $transition-base, opacity $transition-base;
  }

  &.active {
    span:nth-child(1) {
      transform: translateY(6px) rotate(45deg);
    }
    span:nth-child(2) {
      opacity: 0;
    }
    span:nth-child(3) {
      transform: translateY(-6px) rotate(-45deg);
    }
  }
}

// ---- Drawer Overlay ----
.drawer-overlay {
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
}

// ---- Drawer ----
.drawer {
  position: fixed;
  top: 60px;
  right: 0;
  width: 270px;
  max-width: 80vw;
  height: calc(100vh - 60px);
  background: $bg-secondary;
  border-left: 1px solid $glass-border;
  z-index: 999;
  overflow-y: auto;
  padding: 1.5rem 1rem;
}

.drawer-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.drawer-link {
  text-decoration: none;
  color: $text-secondary;
  font-size: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  transition: color $transition-fast, background $transition-fast;

  &:hover {
    color: $text-primary;
    background: rgba(255, 255, 255, 0.04);
  }

  &.router-link-active,
  &.router-link-exact-active {
    color: $neon-cyan;
    background: rgba($neon-cyan, 0.06);

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0.75rem;
      right: 0.75rem;
      height: 2px;
      background: $neon-cyan;
      box-shadow: 0 0 8px $neon-cyan, 0 0 16px rgba($neon-cyan, 0.4);
      border-radius: 1px;
    }
  }
}

// ---- Transitions ----
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity $transition-base;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.slide-enter-active {
  transition: transform $transition-base;
}
.slide-leave-active {
  transition: transform $transition-fast;
}
.slide-enter-from {
  transform: translateX(100%);
}
.slide-leave-to {
  transform: translateX(100%);
}

// ---- Responsive adjustments ----
@media (max-width: 767px) {
  .header-inner {
    padding: 0 1rem;
  }
}
</style>

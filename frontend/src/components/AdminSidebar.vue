<template>
  <aside class="admin-sidebar" :class="{ 'is-open': isOpen }">
    <div class="sidebar-header">
      <router-link to="/admin/dashboard" class="sidebar-logo neon-text-purple" @click="closeSidebar">
        管理后台
      </router-link>
    </div>

    <nav class="sidebar-nav">
      <router-link
        v-for="link in navLinks"
        :key="link.path"
        :to="link.path"
        class="nav-link"
        @click="closeSidebar"
      >
        <span class="nav-icon">{{ link.icon }}</span>
        <span class="nav-label">{{ link.label }}</span>
      </router-link>
    </nav>
  </aside>

  <!-- Mobile-only backdrop + hamburger. Hidden on desktop via CSS. -->
  <button
    v-if="isMobile"
    class="admin-sidebar-toggle"
    :class="{ 'is-open': isOpen }"
    :aria-label="isOpen ? '关闭菜单' : '打开菜单'"
    @click="toggleSidebar"
  >
    <span class="toggle-bar" />
    <span class="toggle-bar" />
    <span class="toggle-bar" />
  </button>
  <div v-if="isMobile && isOpen" class="admin-sidebar-backdrop" @click="closeSidebar" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useScrollLock } from '@/composables/useScrollLock'

const navLinks = [
  { path: '/admin/dashboard', icon: '📊', label: '仪表盘' },
  { path: '/admin/articles', icon: '📝', label: '文章管理' },
  { path: '/admin/editor', icon: '✏️', label: '新建文章' },
  { path: '/admin/comments', icon: '💬', label: '评论审核' },
  { path: '/', icon: '🏠', label: '返回站点' },
]

const isOpen = ref(false)
const isMobile = ref(false)
const scrollLock = useScrollLock()

function syncIsMobile() {
  isMobile.value = window.innerWidth < 768
}

function toggleSidebar() {
  isOpen.value = !isOpen.value
  if (isOpen.value) scrollLock.acquire()
  else scrollLock.release()
}

function closeSidebar() {
  if (!isOpen.value) return
  isOpen.value = false
  scrollLock.release()
}

// Auto-release if the drawer is closed for any other reason (route change
// already calls closeSidebar, but this is a safety net for v-if unmounts).
watch(isOpen, (v) => {
  if (!v) scrollLock.release()
})

onMounted(() => {
  syncIsMobile()
  window.addEventListener('resize', syncIsMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncIsMobile)
  scrollLock.release()
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.admin-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 220px;
  height: 100vh;
  z-index: 900;
  background: $glass-bg;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-right: 1px solid $glass-border;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  transition: transform 0.25s ease;

  @media (max-width: 767px) {
    transform: translateX(-100%);
    z-index: 1000;
    width: 260px;
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.4);

    &.is-open {
      transform: translateX(0);
    }
  }
}

.admin-sidebar-toggle {
  display: none;
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 1001;
  width: 40px;
  height: 40px;
  padding: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid $glass-border;
  border-radius: 8px;
  cursor: pointer;

  @media (max-width: 767px) {
    display: flex;
  }
}

.toggle-bar {
  display: block;
  width: 22px;
  height: 2px;
  background: #fff;
  border-radius: 2px;
  transition: transform 0.2s, opacity 0.2s;

  .admin-sidebar-toggle.is-open & {
    &:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    &:nth-child(2) { opacity: 0; }
    &:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
  }
}

.admin-sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;

  @media (max-width: 767px) {
    display: block;
  }
}

.sidebar-header {
  padding: 1.5rem 1.25rem;
  border-bottom: 1px solid $glass-border;
}

.sidebar-logo {
  font-size: 1.25rem;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: 1px;

  &.neon-text-purple {
    color: $neon-purple;
    text-shadow:
      0 0 7px $neon-purple,
      0 0 10px $neon-purple,
      0 0 21px $neon-purple,
      0 0 42px rgba($neon-purple, 0.4);
  }
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  gap: 2px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.75rem 1.25rem;
  font-size: 0.9rem;
  color: $text-secondary;
  text-decoration: none;
  transition:
    color $transition-fast,
    background $transition-fast,
    border-color $transition-fast;
  border-left: 3px solid transparent;
  background: transparent;

  &:hover {
    color: $text-primary;
    background: rgba(255, 255, 255, 0.03);
  }

  &.router-link-active,
  &.router-link-exact-active {
    color: $neon-purple;
    background: rgba($neon-purple, 0.06);
    border-left-color: $neon-purple;
    box-shadow: inset 3px 0 6px -3px rgba($neon-purple, 0.3);
  }
}

.nav-icon {
  font-size: 1rem;
  width: 20px;
  text-align: center;
  line-height: 1;
}

.nav-label {
  line-height: 1;
}
</style>

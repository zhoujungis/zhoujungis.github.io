<template>
  <aside class="admin-sidebar">
    <div class="sidebar-header">
      <router-link to="/admin/dashboard" class="sidebar-logo neon-text-purple">
        管理后台
      </router-link>
    </div>

    <nav class="sidebar-nav">
      <router-link
        v-for="link in navLinks"
        :key="link.path"
        :to="link.path"
        class="nav-link"
      >
        <span class="nav-icon">{{ link.icon }}</span>
        <span class="nav-label">{{ link.label }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
const navLinks = [
  { path: '/admin/dashboard', icon: '📊', label: '仪表盘' },
  { path: '/admin/articles', icon: '📝', label: '文章管理' },
  { path: '/admin/editor', icon: '✏️', label: '新建文章' },
  { path: '/admin/comments', icon: '💬', label: '评论审核' },
  { path: '/', icon: '🏠', label: '返回站点' },
]
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

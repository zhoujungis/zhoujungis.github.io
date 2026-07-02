<template>
  <header class="app-header">
    <div class="header-inner">
      <router-link to="/" class="logo">Logo</router-link>
      <nav class="nav">
        <router-link to="/">Home</router-link>
        <router-link to="/categories">Categories</router-link>
        <router-link to="/tags">Tags</router-link>
        <router-link to="/archives">Archives</router-link>
        <router-link to="/about">About</router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  height: 56px;

  .header-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 0 1.5rem;
  }

  .logo {
    font-size: 1.25rem;
    font-weight: 700;
    text-decoration: none;
    color: inherit;
  }

  .nav {
    display: flex;
    gap: 1rem;

    a {
      text-decoration: none;
      color: #666;
      transition: color 0.2s;

      &:hover,
      &.router-link-active {
        color: #333;
      }
    }
  }
}
</style>

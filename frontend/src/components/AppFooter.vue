<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <div class="footer-left">
        <span class="copyright">&copy; {{ year }} Zhou Jun</span>
        <span class="divider">·</span>
        <span class="tech">Powered by Vue 3 &amp; Django</span>
      </div>
      <div class="footer-right">
        <a href="https://github.com/zhoujungis/zhoujungis.github.io" target="_blank" rel="noopener" class="footer-link" title="Source code">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
        </a>
        <a href="https://zhoujun123.pythonanywhere.com/rss.xml" target="_blank" rel="noopener" class="footer-link rss-link" title="RSS">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="6.18" cy="17.82" r="2.18"/><path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z"/></svg>
        </a>
        <span class="runtime" v-if="uptime">{{ uptime }}</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const year = new Date().getFullYear()
const uptime = ref('')

onMounted(() => {
  // Site launch date. Hard-coded because a static GitHub Pages build has no
  // access to git history at runtime; keep in sync with the first deploy.
  const start = new Date('2025-07-01')
  const now = new Date()
  const days = Math.floor((now - start) / 86400000)
  if (days >= 0) {
    if (days < 30) uptime.value = `已运行 ${days} 天`
    else if (days < 365) uptime.value = `已运行 ${Math.floor(days / 30)} 个月`
    else uptime.value = `已运行 ${Math.floor(days / 365)} 年 ${days % 365 > 30 ? Math.floor((days % 365) / 30) + ' 个月' : ''}`
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.app-footer {
  margin-top: 72px;
  border-top: 1px solid $glass-border;
  background: rgba(255, 255, 255, 0.38);
  padding: 24px 0;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  width: min(100% - 40px, 1160px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;

  @media (max-width: 767px) {
    flex-direction: column;
    text-align: center;
  }
}

.footer-left,
.footer-right {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: $text-secondary;
}

.divider { opacity: 0.3; }

.footer-link {
  display: inline-flex;
  align-items: center;
  color: $text-secondary;
  text-decoration: none;
  transition: color $transition-fast;
  width: 32px;
  height: 32px;
  justify-content: center;
  border-radius: 50%;
  &:hover { color: $accent-pink; background: $bg-secondary; }
}

.rss-link:hover { color: #f26522; }
.runtime { font-family: $font-mono; opacity: 0.6; }

@media (max-width: 767px) {
  .app-footer { margin-top: 48px; padding: 22px 0; }
  .footer-inner { width: calc(100% - 24px); gap: 12px; }
  .footer-left { flex-wrap: wrap; justify-content: center; }
}
</style>

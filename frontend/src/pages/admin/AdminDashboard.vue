<template>
  <div class="admin-dashboard">
    <AdminSidebar />

    <div class="dashboard-main">
      <header class="dashboard-header">
        <h1 class="dashboard-title">仪表盘</h1>
      </header>

      <!-- Stats row -->
      <section class="stats-row">
        <div class="stat-card glass-card">
          <div class="stat-value neon-text-cyan">{{ stats.total_articles ?? '--' }}</div>
          <div class="stat-label">文章总数</div>
        </div>
        <div class="stat-card glass-card">
          <div class="stat-value neon-text-pink">{{ stats.total_views ?? '--' }}</div>
          <div class="stat-label">总浏览量</div>
        </div>
        <div class="stat-card glass-card">
          <div class="stat-value neon-text-purple">{{ stats.total_comments ?? '--' }}</div>
          <div class="stat-label">评论总数</div>
        </div>
        <div class="stat-card glass-card">
          <div class="stat-value neon-warning">{{ pendingCount }}</div>
          <div class="stat-label">待审核</div>
        </div>
      </section>

      <!-- Quick actions -->
      <section class="quick-actions">
        <router-link to="/admin/editor" class="action-btn neon-border-cyan">
          ✏️ 新建文章
        </router-link>
        <router-link to="/" class="action-btn neon-border-purple">
          🏠 查看站点
        </router-link>
      </section>

      <!-- Recent articles table -->
      <section class="recent-section glass-card">
        <h2 class="section-title">最近文章</h2>

        <div v-if="recentArticles.length === 0" class="empty-state">
          暂无文章
        </div>

        <table v-else class="articles-table">
          <thead>
            <tr>
              <th class="col-title">标题</th>
              <th class="col-status">状态</th>
              <th class="col-date">日期</th>
              <th class="col-views">浏览</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="article in recentArticles" :key="article.id">
              <td class="col-title">{{ article.title }}</td>
              <td class="col-status">
                <span
                  class="status-badge"
                  :class="statusBadgeClass(article.status)"
                >
                  {{ statusLabel(article.status) }}
                </span>
              </td>
              <td class="col-date">{{ formatDate(article.created_at) }}</td>
              <td class="col-views">{{ article.views_count ?? 0 }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminSidebar from '@/components/AdminSidebar.vue'
import { getStats, getPendingComments } from '@/api/admin'
import client from '@/api/client'

const stats = ref({})
const recentArticles = ref([])
const pendingCount = ref('--')

onMounted(async () => {
  try {
    const statsRes = await getStats()
    stats.value = statsRes.data

    const articlesRes = await client.get('/admin/articles/', { params: { page_size: 5 } })
    recentArticles.value = articlesRes.data.results || []

    // Pending comment count comes from /admin/comments/pending/ — count field
    try {
      const pendingRes = await getPendingComments()
      // H-F2: prefer the backend's reported total count, not the page-1
      // length. Previously this read `list.length` which was capped at the
      // page size and made it look like only 10 comments were pending
      // even when 50+ were waiting.
      pendingCount.value =
        pendingRes.data?.count ?? (pendingRes.data?.results?.length ?? '--')
    } catch {
      pendingCount.value = '--'
    }
  } catch (err) {
    console.error('Failed to load dashboard data:', err)
  }
})

function formatDate(dateStr) {
  if (!dateStr) return '--'
  const d = new Date(dateStr)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function statusBadgeClass(status) {
  return {
    published: 'published',
    draft: 'draft',
    archived: 'archived',
    scheduled: 'scheduled',
  }[status] || 'draft'
}

function statusLabel(status) {
  return {
    published: '已发布',
    draft: '草稿',
    archived: '已归档',
    scheduled: '定时',
  }[status] || '草稿'
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.admin-dashboard {
  display: flex;
  min-height: calc(100vh - 56px);
  background: $bg-primary;
}

.dashboard-main {
  flex: 1;
  margin-left: 220px;
  padding: 2rem;
  max-width: calc(100vw - 220px);

  @media (max-width: 767px) {
    margin-left: 0;
    max-width: 100vw;
    padding: 60px 16px 24px;
  }
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: $text-primary;
  letter-spacing: 1px;
}

// ---- Stats row ----
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  text-align: center;
  padding: 1.5rem 1rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 0.35rem;
}

.stat-label {
  font-size: 0.8rem;
  color: $text-secondary;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.neon-warning {
  color: #ffaa00;
  text-shadow:
    0 0 7px #ffaa00,
    0 0 10px #ffaa00,
    0 0 21px rgba(255, 170, 0, 0.4);
}

// ---- Quick actions ----
.quick-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: $font-mono;
  color: $text-primary;
  background: transparent;
  border: 1px solid $glass-border;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  transition:
    background $transition-fast,
    box-shadow $transition-fast,
    border-color $transition-fast;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.15);
  }

  &.neon-border-cyan:hover {
    box-shadow:
      0 0 5px $neon-cyan,
      0 0 10px rgba($neon-cyan, 0.3);
  }

  &.neon-border-purple:hover {
    box-shadow:
      0 0 5px $neon-purple,
      0 0 10px rgba($neon-purple, 0.3);
  }
}

// ---- Recent articles section ----
.recent-section {
  padding: 1.5rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 1.25rem;
}

.empty-state {
  color: $text-secondary;
  text-align: center;
  padding: 2rem;
  font-size: 0.9rem;
}

.articles-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.articles-table thead th {
  text-align: left;
  padding: 0.65rem 0.75rem;
  color: $text-secondary;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid $glass-border;
}

.articles-table tbody td {
  padding: 0.65rem 0.75rem;
  color: $text-primary;
  border-bottom: 1px solid rgba($glass-border, 0.5);
  vertical-align: middle;
}

.articles-table tbody tr:last-child td {
  border-bottom: none;
}

.articles-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.02);
}

.col-title {
  min-width: 200px;
}

.col-status {
  width: 80px;
}

.col-date {
  width: 110px;
  color: $text-secondary;
}

.col-views {
  width: 60px;
  text-align: center;
  color: $text-secondary;
}

.status-badge {
  display: inline-block;
  padding: 2px 10px;
  font-size: 0.72rem;
  font-weight: 600;
  border-radius: 999px;

  &.published {
    color: #00e676;
    background: rgba(0, 230, 118, 0.1);
    border: 1px solid rgba(0, 230, 118, 0.3);
  }

  &.draft {
    color: $text-secondary;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid $glass-border;
  }
}
</style>

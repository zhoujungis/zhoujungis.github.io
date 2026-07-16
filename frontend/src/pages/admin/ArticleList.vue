<template>
  <div class="admin-article-list">
    <AdminSidebar />

    <div class="list-main">
      <header class="list-header">
        <h1 class="list-title">文章管理</h1>
        <router-link to="/admin/editor" class="btn-new">+ 新建文章</router-link>
      </header>

      <!-- Status filter tabs -->
      <div class="filter-tabs">
        <button
          v-for="tab in filterTabs"
          :key="tab.key"
          type="button"
          class="filter-tab"
          :class="{ active: currentFilter === tab.key }"
          @click="switchFilter(tab.key)"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="glass-card table-card">
        <div class="skeleton-row" v-for="n in 5" :key="n">
          <div class="skeleton-cell skeleton-title"></div>
          <div class="skeleton-cell skeleton-badge"></div>
          <div class="skeleton-cell skeleton-tags"></div>
          <div class="skeleton-cell skeleton-views"></div>
          <div class="skeleton-cell skeleton-date"></div>
          <div class="skeleton-cell skeleton-actions"></div>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="fetchError" class="glass-card error-card">
        <p class="error-text">加载失败：{{ fetchError }}</p>
        <button class="btn-retry" @click="fetchArticles">重试</button>
      </div>

      <!-- Empty state -->
      <div v-else-if="articles.length === 0" class="glass-card empty-card">
        <p class="empty-text">暂无文章</p>
      </div>

      <!-- Articles table -->
      <div v-else class="glass-card table-card">
        <table class="articles-table">
          <thead>
            <tr>
              <th class="col-title">标题</th>
              <th class="col-status">状态</th>
              <th class="col-category">分类</th>
              <th class="col-tags">标签</th>
              <th class="col-views">阅读量</th>
              <th class="col-date">日期</th>
              <th class="col-actions">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="article in articles" :key="article.id">
              <td class="col-title">
                <router-link
                  :to="`/article/${article.slug}`"
                  class="article-title-link"
                >
                  {{ article.title }}
                </router-link>
              </td>
              <td class="col-status">
                <span class="status-badge" :class="getStatusClass(article)">
                  {{ getStatusLabel(article) }}
                </span>
              </td>
              <td class="col-category">
                {{ article.category_name || article.category?.name || '--' }}
              </td>
              <td class="col-tags">
                <span
                  v-for="tag in (article.tags_display || article.tags || [])"
                  :key="typeof tag === 'object' ? tag.id : tag"
                  class="tag-pill"
                >
                  {{ typeof tag === 'object' ? tag.name : tag }}
                </span>
                <span v-if="!article.tags?.length && !article.tags_display?.length" class="no-tags">--</span>
              </td>
              <td class="col-views">{{ article.views_count ?? 0 }}</td>
              <td class="col-date">{{ formatDate(article.created_at) }}</td>
              <td class="col-actions">
                <button
                  type="button"
                  class="action-link action-edit"
                  @click="editArticle(article.id)"
                >
                  编辑
                </button>
                <button
                  type="button"
                  class="action-link action-delete"
                  @click="confirmDelete(article)"
                >
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button
          type="button"
          class="page-btn"
          :disabled="pagination.page <= 1"
          @click="goToPage(pagination.page - 1)"
        >
          &laquo; 上一页
        </button>

        <template v-for="(page, idx) in visiblePages" :key="`${page}-${idx}`">
          <span v-if="page === '...'" class="page-ellipsis">…</span>
          <button
            v-else
            type="button"
            class="page-btn"
            :class="{ active: page === pagination.page }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </template>

        <button
          type="button"
          class="page-btn"
          :disabled="pagination.page >= totalPages"
          @click="goToPage(pagination.page + 1)"
        >
          下一页 &raquo;
        </button>
      </div>
    </div>

    <!-- Delete confirmation modal -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
        <div class="modal-dialog glass-card">
          <h3 class="modal-title">确认删除</h3>
          <p class="modal-body">
            确定要删除文章 <strong>{{ deleteTarget?.title }}</strong> 吗？此操作不可撤销。
          </p>
          <div class="modal-actions">
            <button
              type="button"
              class="btn btn-cancel"
              @click="closeDeleteModal"
            >
              取消
            </button>
            <button
              type="button"
              class="btn btn-confirm"
              @click="handleDelete"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import AdminSidebar from '@/components/AdminSidebar.vue'
import { deleteArticle } from '@/api/admin'
import client from '@/api/client'

const router = useRouter()

// ---- State ----
const articles = ref([])
const loading = ref(false)
const fetchError = ref(null)
const pagination = ref({
  count: 0,
  page: 1,
  pageSize: 10,
})
const currentFilter = ref('all')

// Delete modal
const showDeleteModal = ref(false)
const deleteTarget = ref(null)

// Filter tabs
const filterTabs = [
  { key: 'all', label: '全部' },
  { key: 'published', label: '已发布' },
  { key: 'draft', label: '草稿' },
  { key: 'archived', label: '已归档' },
]

// ---- Computed ----
const totalPages = computed(() => {
  if (!pagination.value.count) return 1
  return Math.ceil(pagination.value.count / pagination.value.pageSize)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = pagination.value.page
  const delta = 2
  const range = []

  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
    range.push(i)
  }

  if (range[0] > 1) {
    if (range[0] > 2) {
      range.unshift('...')
    }
    range.unshift(1)
  }

  if (range[range.length - 1] < total) {
    if (range[range.length - 1] < total - 1) {
      range.push('...')
    }
    range.push(total)
  }

  return range
})

// ---- Methods ----
function getStatusClass(article) {
  return {
    published: 'published',
    archived: 'archived',
    scheduled: 'scheduled',
    draft: 'draft',
  }[article.status] || 'draft'
}

function getStatusLabel(article) {
  return {
    published: '已发布',
    archived: '已归档',
    scheduled: '定时',
    draft: '草稿',
  }[article.status] || '草稿'
}

function formatDate(dateStr) {
  if (!dateStr) return '--'
  const d = new Date(dateStr)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function switchFilter(filter) {
  currentFilter.value = filter
  pagination.value.page = 1
}

function goToPage(page) {
  if (typeof page !== 'number' || page < 1 || page > totalPages.value) return
  pagination.value.page = page
}

function editArticle(id) {
  router.push(`/admin/editor/${id}`)
}

function confirmDelete(article) {
  deleteTarget.value = article
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  deleteTarget.value = null
}

async function handleDelete() {
  if (!deleteTarget.value) return

  try {
    await deleteArticle(deleteTarget.value.id)
    articles.value = articles.value.filter((a) => a.id !== deleteTarget.value.id)
    pagination.value.count = Math.max(0, pagination.value.count - 1)

    // M11: if we deleted the last item on the last page, step back and refetch
    if (articles.value.length === 0 && pagination.value.page > 1) {
      pagination.value.page -= 1
    }
    closeDeleteModal()
    await fetchArticles()
  } catch (err) {
    console.error('Failed to delete article:', err)
    alert('删除失败: ' + (err.response?.data?.detail || err.message))
    closeDeleteModal()
  }
}

let fetchSeq = 0

async function fetchArticles() {
  const seq = ++fetchSeq
  loading.value = true
  fetchError.value = null
  try {
    const params = {
      page: pagination.value.page,
      page_size: pagination.value.pageSize,
    }
    if (currentFilter.value !== 'all') {
      params.status = currentFilter.value
    }
    const res = await client.get('/admin/articles/', { params })
    if (seq !== fetchSeq) return
    articles.value = res.data.results || []
    pagination.value.count = res.data.count || 0
  } catch (err) {
    if (seq !== fetchSeq) return
    console.error('Failed to fetch articles:', err)
    articles.value = []
    fetchError.value = err?.response?.data?.detail || err?.message || '网络错误'
  } finally {
    if (seq === fetchSeq) loading.value = false
  }
}

// ---- Watchers ----
watch(
  [currentFilter, () => pagination.value.page],
  () => {
    fetchArticles()
  },
  { immediate: false },
)

// ---- Lifecycle ----
onMounted(() => {
  fetchArticles()
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.admin-article-list {
  display: flex;
  min-height: calc(100vh - 56px);
  background: $bg-primary;
}

.list-main {
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

// ---- Header ----
.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.list-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: $text-primary;
  letter-spacing: 1px;
}

.btn-new {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.6rem 1.25rem;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: $font-mono;
  color: #fff;
  background: rgba($neon-pink, 0.12);
  border: 1px solid rgba($neon-pink, 0.35);
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  transition:
    background $transition-fast,
    box-shadow $transition-fast,
    border-color $transition-fast;

  &:hover {
    background: rgba($neon-pink, 0.22);
    border-color: rgba($neon-pink, 0.55);
    box-shadow:
      0 0 10px rgba($neon-pink, 0.2),
      0 0 20px rgba($neon-pink, 0.08);
  }
}

// ---- Filter Tabs ----
.filter-tabs {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1.25rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 3px;
  display: inline-flex;
}

.filter-tab {
  padding: 0.4rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: $font-mono;
  color: $text-secondary;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition:
    color $transition-fast,
    background $transition-fast;

  &:hover {
    color: $text-primary;
  }

  &.active {
    color: $text-primary;
    background: rgba(255, 255, 255, 0.08);
  }
}

// ---- Table Card ----
.table-card {
  padding: 0;
  overflow: hidden;
}

.articles-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.articles-table thead th {
  text-align: left;
  padding: 0.75rem 0.85rem;
  color: $text-secondary;
  font-weight: 600;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid $glass-border;
  background: rgba(255, 255, 255, 0.02);
}

.articles-table tbody td {
  padding: 0.7rem 0.85rem;
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

// ---- Column widths ----
.col-title {
  min-width: 180px;
}

.col-status {
  width: 80px;
}

.col-category {
  width: 100px;
}

.col-tags {
  width: 150px;
}

.col-views {
  width: 70px;
  text-align: center;
  color: $text-secondary;
}

.col-date {
  width: 100px;
  color: $text-secondary;
}

.col-actions {
  width: 110px;
  white-space: nowrap;
}

// ---- Title link ----
.article-title-link {
  color: $text-primary;
  text-decoration: none;
  transition: color $transition-fast;

  &:hover {
    color: $neon-cyan;
  }
}

// ---- Status Badge ----
.status-badge {
  display: inline-block;
  padding: 2px 10px;
  font-size: 0.72rem;
  font-weight: 600;
  border-radius: 999px;
  white-space: nowrap;

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

  &.archived {
    color: #ffaa00;
    background: rgba(255, 170, 0, 0.1);
    border: 1px solid rgba(255, 170, 0, 0.3);
  }
}

// ---- Tags ----
.tag-pill {
  display: inline-block;
  padding: 1px 7px;
  margin: 1px 3px 1px 0;
  font-size: 0.7rem;
  color: $neon-purple;
  background: rgba($neon-purple, 0.08);
  border: 1px solid rgba($neon-purple, 0.2);
  border-radius: 999px;
  white-space: nowrap;
}

.no-tags {
  color: $text-secondary;
  font-size: 0.8rem;
}

// ---- Action links ----
.action-link {
  background: none;
  border: none;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: $font-mono;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  transition:
    color $transition-fast,
    background $transition-fast;

  &.action-edit {
    color: $neon-cyan;

    &:hover {
      background: rgba($neon-cyan, 0.08);
    }
  }

  &.action-delete {
    color: #ff5252;

    &:hover {
      background: rgba(255, 82, 82, 0.08);
    }
  }
}

// ---- Empty state ----
.empty-card {
  padding: 3rem;
  text-align: center;
}

.empty-text {
  color: $text-secondary;
  font-size: 0.9rem;
}

// ---- Skeleton ----
.skeleton-row {
  display: flex;
  gap: 1rem;
  padding: 0.85rem;
  border-bottom: 1px solid rgba($glass-border, 0.5);
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
}

.skeleton-cell {
  height: 14px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 4px;
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton-title {
  flex: 2;
}

.skeleton-badge {
  width: 60px;
}

.skeleton-tags {
  flex: 1;
}

.skeleton-views {
  width: 40px;
}

.skeleton-date {
  width: 80px;
}

.skeleton-actions {
  width: 80px;
}

@keyframes shimmer {
  0% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.4;
  }
}

// ---- Pagination ----
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  margin-top: 1.25rem;
}

.page-btn {
  padding: 0.4rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: $font-mono;
  color: $text-secondary;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid $glass-border;
  border-radius: 6px;
  cursor: pointer;
  transition:
    color $transition-fast,
    background $transition-fast,
    border-color $transition-fast;

  &:hover:not(:disabled):not(.active) {
    color: $text-primary;
    border-color: rgba(255, 255, 255, 0.15);
  }

  &.active {
    color: $neon-cyan;
    border-color: rgba($neon-cyan, 0.3);
    background: rgba($neon-cyan, 0.06);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

// ---- Delete Modal ----
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-dialog {
  width: 380px;
  max-width: 90vw;
  padding: 1.5rem;
}

.modal-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 0.75rem;
}

.modal-body {
  font-size: 0.88rem;
  color: $text-secondary;
  line-height: 1.5;
  margin-bottom: 1.5rem;

  strong {
    color: $text-primary;
  }
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.55rem 1.25rem;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: $font-mono;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid transparent;
  transition:
    background $transition-fast,
    color $transition-fast,
    box-shadow $transition-fast;
}

.btn-cancel {
  color: $text-secondary;
  background: rgba(255, 255, 255, 0.04);
  border-color: $glass-border;

  &:hover {
    color: $text-primary;
    background: rgba(255, 255, 255, 0.08);
  }
}

.btn-confirm {
  color: #fff;
  background: rgba(255, 82, 82, 0.15);
  border-color: rgba(255, 82, 82, 0.4);

  &:hover {
    background: rgba(255, 82, 82, 0.25);
    box-shadow: 0 0 8px rgba(255, 82, 82, 0.2);
  }
}
</style>

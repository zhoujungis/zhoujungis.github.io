<template>
  <div class="admin-layout">
    <AdminSidebar />
    <main class="admin-main">
      <div class="page-comment-manage">
        <h1 class="page-title">评论管理</h1>

        <!-- Tabs -->
        <div class="tabs">
          <button
            :class="['tab', { active: activeTab === 'pending' }]"
            @click="activeTab = 'pending'"
          >
            待审核
            <span v-if="pendingComments.length" class="tab-badge">{{ pendingComments.length }}</span>
          </button>
          <button
            :class="['tab', { active: activeTab === 'approved' }]"
            @click="activeTab = 'approved'"
          >
            已通过
            <span v-if="approvedComments.length" class="tab-badge">{{ approvedComments.length }}</span>
          </button>
        </div>

        <!-- Loading skeleton -->
        <div v-if="loading" class="loading-state">
          <div v-for="n in 4" :key="n" class="skeleton-card glass-card">
            <div class="skeleton-line skeleton-title" />
            <div class="skeleton-line skeleton-meta" />
            <div class="skeleton-line skeleton-content" />
            <div class="skeleton-line skeleton-content short" />
          </div>
        </div>

        <!-- Pending tab -->
        <div v-else-if="activeTab === 'pending'" class="tab-content">
          <div v-if="pendingComments.length === 0" class="empty-state">
            暂无待审核评论
          </div>
          <div v-else class="comment-list">
            <div
              v-for="comment in pendingComments"
              :key="comment.id"
              class="comment-card glass-card"
            >
              <div class="comment-card-header">
                <router-link
                  :to="`/article/${comment.article_slug}`"
                  class="article-link"
                >
                  {{ comment.article_title }}
                </router-link>
              </div>
              <div class="comment-card-body">
                <div class="comment-meta">
                  <span class="author">{{ comment.author }}</span>
                  <span class="date">{{ formatDate(comment.created_at) }}</span>
                </div>
                <p class="comment-content">{{ comment.content }}</p>
              </div>
              <div class="comment-card-footer">
                <button
                  class="btn btn-approve"
                  :disabled="approvingIds.has(comment.id)"
                  @click="handleApprove(comment.id)"
                >
                  {{ approvingIds.has(comment.id) ? '处理中...' : '✅ 通过' }}
                </button>
                <button
                  class="btn btn-delete"
                  :disabled="deletingIds.has(comment.id)"
                  @click="confirmDelete(comment.id)"
                >
                  {{ deletingIds.has(comment.id) ? '处理中...' : '❌ 删除' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Approved tab -->
        <div v-else class="tab-content">
          <div v-if="approvedComments.length === 0" class="empty-state">
            暂无评论
          </div>
          <div v-else class="comment-list">
            <div
              v-for="comment in approvedComments"
              :key="comment.id"
              class="comment-card glass-card"
            >
              <div class="comment-card-header">
                <router-link
                  :to="`/article/${comment.article_slug}`"
                  class="article-link"
                >
                  {{ comment.article_title }}
                </router-link>
                <span class="approved-badge">已通过</span>
              </div>
              <div class="comment-card-body">
                <div class="comment-meta">
                  <span class="author">{{ comment.author }}</span>
                  <span class="date">{{ formatDate(comment.created_at) }}</span>
                </div>
                <p class="comment-content">{{ comment.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Delete confirmation dialog -->
    <Teleport to="body">
      <div v-if="deleteTargetId !== null" class="dialog-overlay" @click.self="cancelDelete">
        <div class="dialog glass-panel">
          <p class="dialog-title">确认删除</p>
          <p class="dialog-text">确定要删除这条评论吗？</p>
          <p class="dialog-warning">此操作不可撤销。</p>
          <div class="dialog-actions">
            <button class="btn btn-cancel" @click="cancelDelete">取消</button>
            <button class="btn btn-delete" @click="handleDelete">确认删除</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminSidebar from '@/components/AdminSidebar.vue'
import { getPendingComments, approveComment, deleteComment } from '@/api/admin'

const activeTab = ref('pending')
const pendingComments = ref([])
const approvedComments = ref([])
const loading = ref(true)
const approvingIds = ref(new Set())
const deletingIds = ref(new Set())
const deleteTargetId = ref(null)

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${min}`
}

async function loadPendingComments() {
  loading.value = true
  try {
    const response = await getPendingComments()
    pendingComments.value = response.data.results || response.data || []
  } catch (err) {
    console.error('Failed to load pending comments:', err)
    pendingComments.value = []
  } finally {
    loading.value = false
  }
}

async function handleApprove(id) {
  if (approvingIds.value.has(id)) return
  approvingIds.value.add(id)
  try {
    await approveComment(id)
    const idx = pendingComments.value.findIndex((c) => c.id === id)
    if (idx !== -1) {
      const [comment] = pendingComments.value.splice(idx, 1)
      approvedComments.value.push(comment)
    }
  } catch (err) {
    console.error('Failed to approve comment:', err)
  } finally {
    approvingIds.value.delete(id)
  }
}

function confirmDelete(id) {
  deleteTargetId.value = id
}

function cancelDelete() {
  deleteTargetId.value = null
}

async function handleDelete() {
  const id = deleteTargetId.value
  if (id === null) return
  deletingIds.value.add(id)
  try {
    await deleteComment(id)
    pendingComments.value = pendingComments.value.filter((c) => c.id !== id)
    deleteTargetId.value = null
  } catch (err) {
    console.error('Failed to delete comment:', err)
  } finally {
    deletingIds.value.delete(id)
  }
}

onMounted(() => {
  loadPendingComments()
})
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/styles/variables' as *;

.admin-layout {
  display: flex;
  min-height: 100vh;
  background: $bg-primary;
}

.admin-main {
  margin-left: 220px;
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 24px;
  color: $text-primary;
}

/* ---------- Tabs ---------- */
.tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid $glass-border;
  margin-bottom: 24px;
}

.tab {
  position: relative;
  padding: 10px 24px;
  background: transparent;
  border: none;
  color: $text-secondary;
  font-family: $font-mono;
  font-size: 0.9rem;
  cursor: pointer;
  transition: color $transition-fast;

  &:hover {
    color: $text-primary;
  }

  &.active {
    color: $neon-cyan;

    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: $neon-cyan;
      box-shadow: 0 0 8px $neon-cyan;
    }
  }
}

.tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  margin-left: 6px;
  border-radius: 10px;
  background: $neon-cyan;
  color: $bg-primary;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1;
}

/* ---------- Loading skeleton ---------- */
.loading-state {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-card {
  padding: 20px;
}

.skeleton-line {
  height: 14px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.06);
  margin-bottom: 10px;
  animation: skeleton-pulse 1.5s ease-in-out infinite;

  &.skeleton-title {
    width: 40%;
    height: 18px;
  }

  &.skeleton-meta {
    width: 30%;
  }

  &.skeleton-content {
    width: 100%;
  }

  &.short {
    width: 60%;
  }
}

@keyframes skeleton-pulse {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
}

/* ---------- Empty state ---------- */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: $text-secondary;
  font-size: 0.95rem;
}

/* ---------- Comment list ---------- */
.comment-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-card {
  padding: 20px;
}

.comment-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.article-link {
  font-size: 0.95rem;
  font-weight: 600;
  color: $neon-cyan;
  text-decoration: none;
  transition: color $transition-fast;

  &:hover {
    color: color.adjust($neon-cyan, $lightness: 15%);
    text-decoration: underline;
  }
}

.approved-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 4px;
  background: rgba($neon-cyan, 0.15);
  color: $neon-cyan;
  font-size: 0.78rem;
  font-weight: 600;
  white-space: nowrap;
}

.comment-card-body {
  margin-bottom: 14px;
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 0.82rem;
  color: $text-secondary;

  .author {
    color: $neon-purple;
    font-weight: 600;
  }

  .date {
    &::before {
      content: '·';
      margin-right: 8px;
      color: $text-secondary;
    }
  }
}

.comment-content {
  font-size: 0.88rem;
  line-height: 1.6;
  color: $text-primary;
  word-break: break-word;
}

/* ---------- Action buttons ---------- */
.comment-card-footer {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 7px 18px;
  border-radius: 6px;
  font-family: $font-mono;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all $transition-fast;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.btn-approve {
  background: transparent;
  border-color: $neon-cyan;
  color: $neon-cyan;

  &:hover:not(:disabled) {
    background: rgba($neon-cyan, 0.12);
    box-shadow: 0 0 12px rgba($neon-cyan, 0.3);
  }
}

.btn-delete {
  background: transparent;
  border-color: $neon-pink;
  color: $neon-pink;

  &:hover:not(:disabled) {
    background: rgba($neon-pink, 0.12);
    box-shadow: 0 0 12px rgba($neon-pink, 0.3);
  }
}

.btn-cancel {
  background: transparent;
  border-color: $glass-border;
  color: $text-secondary;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.05);
    color: $text-primary;
  }
}

/* ---------- Delete confirmation dialog ---------- */
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.dialog {
  width: 360px;
  max-width: 90vw;
  padding: 28px;
  text-align: center;
}

.dialog-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: $neon-pink;
  margin-bottom: 12px;
}

.dialog-text {
  font-size: 0.92rem;
  color: $text-primary;
  margin-bottom: 6px;
}

.dialog-warning {
  font-size: 0.8rem;
  color: $neon-pink;
  margin-bottom: 20px;
  opacity: 0.8;
}

.dialog-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}
</style>

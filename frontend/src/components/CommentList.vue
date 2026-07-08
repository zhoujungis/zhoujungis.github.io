<template>
  <div class="comment-list">
    <h3 class="comments-title">
      评论
      <span v-if="comments.length" class="comments-count">({{ comments.length }})</span>
    </h3>

    <!-- Loading skeleton -->
    <div v-if="loading" class="skeleton-comments">
      <div v-for="i in 3" :key="i" class="skeleton-comment">
        <div class="skeleton-avatar" />
        <div class="skeleton-body">
          <div class="skeleton-line w-30" />
          <div class="skeleton-line w-50" />
          <div class="skeleton-line w-80" />
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!topLevelComments.length" class="empty-comments">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <p>暂无评论，来说点什么吧</p>
    </div>

    <!-- Comment tree -->
    <div v-else class="comments-tree">
      <div
        v-for="comment in topLevelComments"
        :key="comment.id"
        class="comment-item"
      >
        <div class="comment-main">
          <div
            class="comment-avatar"
            :style="{ background: avatarColor(comment.author_name) }"
          >
            {{ comment.author_name ? comment.author_name.charAt(0).toUpperCase() : '?' }}
          </div>
          <div class="comment-content">
            <div class="comment-header">
              <span class="comment-author">{{ comment.author_name }}</span>
              <span class="comment-time">{{ formatTime(comment.created_at) }}</span>
            </div>
            <p class="comment-text">{{ comment.content }}</p>
            <button
              class="reply-btn"
              @click="toggleReply(comment.id)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 17 4 12 9 7"/>
                <path d="M20 18v-2a4 4 0 0 0-4-4H4"/>
              </svg>
              回复
            </button>
          </div>
        </div>

        <!-- Inline reply form -->
        <CommentForm
          v-if="replyToId === comment.id"
          :article-slug="articleSlug"
          :parent-id="comment.id"
          @submitted="onCommentSubmitted"
          @cancel="replyToId = null"
          class="reply-form-wrapper"
        />

        <!-- Replies -->
        <div v-if="getReplies(comment.id).length" class="replies">
          <div
            v-for="reply in getReplies(comment.id)"
            :key="reply.id"
            class="comment-item reply-item"
          >
            <div class="comment-main">
              <div
                class="comment-avatar comment-avatar-sm"
                :style="{ background: avatarColor(reply.author_name) }"
              >
                {{ reply.author_name ? reply.author_name.charAt(0).toUpperCase() : '?' }}
              </div>
              <div class="comment-content">
                <div class="comment-header">
                  <span class="comment-author">{{ reply.author_name }}</span>
                  <span class="comment-time">{{ formatTime(reply.created_at) }}</span>
                </div>
                <p class="comment-text">{{ reply.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getComments } from '@/api/comments'
import CommentForm from './CommentForm.vue'

const props = defineProps({
  articleSlug: {
    type: String,
    required: true,
  },
})

const comments = ref([])
const loading = ref(true)
const replyToId = ref(null)

const topLevelComments = computed(() =>
  comments.value.filter((c) => !c.parent)
)

function getReplies(parentId) {
  return comments.value.filter((c) => String(c.parent) === String(parentId))
}

function toggleReply(commentId) {
  replyToId.value = replyToId.value === commentId ? null : commentId
}

async function fetchComments() {
  loading.value = true
  try {
    const res = await getComments(props.articleSlug)
    comments.value = res.data.results || res.data || []
  } catch {
    comments.value = []
  } finally {
    loading.value = false
  }
}

function onCommentSubmitted() {
  replyToId.value = null
  fetchComments()
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const now = Date.now()
  const date = new Date(dateStr)
  const diff = now - date.getTime()

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 30) return `${days}天前`
  if (days < 365) return `${Math.floor(days / 30)}个月前`
  return `${Math.floor(days / 365)}年前`
}

function avatarColor(name) {
  const colors = [
    '#ff0080', '#00e5ff', '#7b2fff', '#ff6b35',
    '#00c853', '#ffd600', '#ea80fc', '#40c4ff',
    '#ff5252', '#69f0ae', '#ffab40', '#b388ff',
  ]
  if (!name) return colors[0]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

onMounted(fetchComments)
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/skeleton' as *;

.comment-list {
  margin-top: 8px;
}

.comments-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.comments-count {
  font-size: 0.85rem;
  color: $text-secondary;
  font-weight: 400;
}

// ============ Skeleton ============
.skeleton-comments {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-comment {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: $bg-card;
  border-radius: $glass-radius;
  border: 1px solid $glass-border;
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  @include skeleton-shimmer;
}

.skeleton-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-line {
  height: 12px;
  border-radius: 4px;
  @include skeleton-shimmer;
}

.w-30 { width: 30%; }
.w-50 { width: 50%; }
.w-80 { width: 80%; }

// ============ Empty state ============
.empty-comments {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 20px;
  color: $text-secondary;
  text-align: center;

  svg {
    opacity: 0.4;
  }

  p {
    font-size: 0.95rem;
  }
}

// ============ Comment tree ============
.comments-tree {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-item {
  background: $bg-card;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid $glass-border;
  border-radius: $glass-radius;
  padding: 16px 20px;
  transition: border-color $transition-base;

  &:hover {
    border-color: rgba(255, 255, 255, 0.1);
  }
}

.comment-main {
  display: flex;
  gap: 12px;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.comment-avatar-sm {
  width: 32px;
  height: 32px;
  font-size: 0.85rem;
}

.comment-content {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.comment-author {
  font-size: 0.9rem;
  font-weight: 600;
  color: $neon-cyan;
}

.comment-time {
  font-size: 0.78rem;
  color: $text-secondary;
}

.comment-text {
  font-size: 0.9rem;
  line-height: 1.6;
  color: $text-primary;
  margin: 0 0 8px;
  word-wrap: break-word;
}

.reply-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  font-family: $font-mono;
  color: $text-secondary;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 2px 0;
  transition: color $transition-fast;

  svg {
    opacity: 0.6;
  }

  &:hover {
    color: $neon-cyan;
    svg { opacity: 1; }
  }
}

// ============ Replies ============
.replies {
  margin-top: 12px;
  margin-left: 52px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reply-item {
  padding: 12px 16px;
  background: rgba(20, 20, 30, 0.4);
  border-color: rgba(255, 255, 255, 0.05);
}

.reply-form-wrapper {
  margin-top: 12px;
  margin-left: 52px;
}

// ============ Responsive ============
@media (max-width: 767px) {
  .comment-item {
    padding: 12px 14px;
  }

  .replies {
    margin-left: 12px;
  }

  .reply-form-wrapper {
    margin-left: 0;
  }
}
</style>

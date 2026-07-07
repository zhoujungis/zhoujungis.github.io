<template>
  <div class="newsletter glass-card">
    <h4 class="newsletter-title">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
      订阅更新
    </h4>
    <p class="newsletter-desc">新文章发布时，通过邮件通知你</p>
    <form @submit.prevent="subscribe" class="newsletter-form">
      <input
        v-model="email"
        type="email"
        placeholder="your@email.com"
        class="newsletter-input"
        :disabled="done"
        required
      />
      <button type="submit" class="newsletter-btn" :disabled="submitting || done">
        <span v-if="submitting">...</span>
        <span v-else-if="done">✓</span>
        <span v-else>订阅</span>
      </button>
    </form>
    <p v-if="msg" :class="msgType">{{ msg }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import client from '@/api/client'

const email = ref('')
const submitting = ref(false)
const done = ref(false)
const msg = ref('')
const msgType = ref('')

async function subscribe() {
  if (!email.value.trim()) return
  submitting.value = true
  msg.value = ''
  try {
    const res = await client.post('/subscribe/', { email: email.value.trim() })
    done.value = true
    msg.value = res.data.detail || '订阅成功！'
    msgType.value = 'msg-success'
  } catch (e) {
    const detail = e?.response?.data?.error || e?.response?.data?.detail || '订阅失败'
    msg.value = typeof detail === 'string' ? detail : '订阅失败，请稍后重试'
    msgType.value = 'msg-error'
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.newsletter {
  padding: 20px;
  margin-top: 20px;
}
.newsletter-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: $neon-cyan;
  display: flex; align-items: center; gap: 6px;
  margin-bottom: 4px;
}
.newsletter-desc {
  font-size: 0.8rem;
  color: $text-secondary;
  margin: 0 0 12px;
}
.newsletter-form {
  display: flex; gap: 8px;
}
.newsletter-input {
  flex: 1;
  padding: 8px 12px;
  font-size: 0.85rem;
  font-family: $font-mono;
  color: $text-primary;
  background: rgba(255,255,255,0.04);
  border: 1px solid $glass-border;
  border-radius: 6px;
  outline: none;
  &::placeholder { color: rgba($text-secondary, 0.5); }
  &:focus { border-color: rgba($neon-cyan, 0.4); }
  &:disabled { opacity: 0.4; }
}
.newsletter-btn {
  padding: 8px 16px;
  font-size: 0.85rem; font-weight: 600;
  font-family: $font-mono;
  color: #fff;
  background: rgba($neon-cyan, 0.15);
  border: 1px solid $neon-cyan;
  border-radius: 6px;
  cursor: pointer;
  transition: background $transition-fast;
  white-space: nowrap;
  &:hover:not(:disabled) { background: rgba($neon-cyan, 0.25); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}
.msg-success { font-size: 0.8rem; color: #00e676; margin: 8px 0 0; }
.msg-error { font-size: 0.8rem; color: $neon-pink; margin: 8px 0 0; }
</style>

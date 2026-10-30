<template>
  <div class="newsletter">
    <!-- 已登录：邮箱来自账号，只做订阅开关 -->
    <template v-if="auth.isLoggedIn">
      <div class="newsletter-row">
        <span class="newsletter-mail">{{ email || auth.user?.email }}</span>
        <button
          v-if="!subscribed"
          type="button"
          class="newsletter-btn"
          :disabled="busy"
          @click="toggleSub"
        >
          {{ busy ? '处理中…' : '订阅更新' }}
        </button>
        <button
          v-else
          type="button"
          class="newsletter-unsub"
          :disabled="busy"
          @click="toggleSub"
        >
          取消订阅
        </button>
      </div>
      <p v-if="subscribed" class="newsletter-hint">已订阅，新文章发布时会邮件通知你</p>
    </template>

    <!-- 未登录：留邮箱订阅 -->
    <form v-else @submit.prevent="subscribe" class="newsletter-form">
      <input
        v-model="emailInput"
        type="email"
        placeholder="留下你的邮箱"
        class="newsletter-input"
        :disabled="done"
        required
        aria-label="订阅邮箱"
      />
      <button type="submit" class="newsletter-btn" :disabled="submitting || done">
        <span v-if="submitting">提交中…</span>
        <span v-else-if="done">已订阅</span>
        <span v-else>订阅更新</span>
      </button>
    </form>

    <p v-if="msg" :class="['newsletter-msg', msgType]">{{ msg }}</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSubscription } from '@/composables/useSubscription'
import { subscribeEmail } from '@/api/newsletter'

const auth = useAuthStore()
const { subscribed, email, busy, refresh, toggle } = useSubscription()

const emailInput = ref('')
const submitting = ref(false)
const done = ref(false)
const msg = ref('')
const msgType = ref('')

onMounted(() => {
  if (auth.isLoggedIn) refresh()
})

async function subscribe() {
  if (!emailInput.value.trim()) return
  submitting.value = true
  msg.value = ''
  try {
    const res = await subscribeEmail(emailInput.value.trim())
    done.value = true
    msg.value = res.data.detail || '订阅成功，新文章发布时会邮件通知你'
    msgType.value = 'is-success'
  } catch (e) {
    const detail = e?.response?.data?.error || e?.response?.data?.detail || '订阅失败，请稍后重试'
    msg.value = typeof detail === 'string' ? detail : '订阅失败，请稍后重试'
    msgType.value = 'is-error'
  } finally {
    submitting.value = false
  }
}

async function toggleSub() {
  msg.value = ''
  try {
    await toggle()
    if (subscribed.value) {
      msg.value = '已订阅，新文章发布时会邮件通知你'
      msgType.value = 'is-success'
    } else {
      msg.value = '已取消订阅'
      msgType.value = 'is-success'
    }
  } catch (e) {
    msg.value = e?.response?.data?.detail || '操作失败，请稍后重试'
    msgType.value = 'is-error'
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.newsletter {
  font-family: $font-mono;
}

.newsletter-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid $glass-border;
}

.newsletter-mail {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.8rem;
  color: $text-secondary;
}

.newsletter-form {
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.newsletter-input {
  flex: 1;
  min-width: 0;
  padding: 8px 0 10px;
  font-family: $font-mono;
  font-size: 0.82rem;
  color: $text-primary;
  background: transparent;
  border: 0;
  border-bottom: 1px solid $glass-border;
  outline: none;
  transition: border-color $transition-fast;

  &::placeholder { color: rgba($text-secondary, 0.55); }
  &:focus { border-bottom-color: $text-primary; }
  &:disabled { opacity: 0.45; }
}

.newsletter-btn {
  padding: 8px 18px;
  font-family: $font-mono;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #fff;
  background: $text-primary;
  border: 1px solid $text-primary;
  border-radius: $radius-sm;
  cursor: pointer;
  white-space: nowrap;
  transition: background $transition-fast, border-color $transition-fast;

  &:hover:not(:disabled) {
    background: $neon-cyan;
    border-color: $neon-cyan;
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

.newsletter-unsub {
  padding: 0;
  font-family: $font-mono;
  font-size: 0.76rem;
  color: $text-secondary;
  background: none;
  border: 0;
  border-bottom: 1px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: color $transition-fast, border-color $transition-fast;

  &:hover:not(:disabled) {
    color: $neon-pink;
    border-bottom-color: $neon-pink;
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

.newsletter-hint,
.newsletter-msg {
  margin: 10px 0 0;
  font-size: 0.72rem;
  line-height: 1.6;
}

.newsletter-hint { color: $text-secondary; }
.newsletter-msg.is-success { color: $neon-cyan; }
.newsletter-msg.is-error { color: $neon-pink; }

@media (max-width: 520px) {
  .newsletter-form { flex-direction: column; align-items: stretch; gap: 10px; }
  .newsletter-btn { width: 100%; }
}
</style>

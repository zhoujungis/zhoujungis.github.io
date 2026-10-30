<template>
  <div class="comment-form" :class="{ 'reply-form': !!parentId }">
    <!-- 未登录：先登录再评论 -->
    <div v-if="!auth.isLoggedIn" class="login-cta">
      <h4 class="form-title">{{ parentId ? '回复评论' : '发表评论' }}</h4>
      <p class="login-cta__hint">登录后即可参与讨论，支持邮箱验证码、Google 与 GitHub</p>
      <button type="button" class="submit-btn" @click="openLogin()">登录 / 注册</button>
    </div>

    <template v-else>
      <div class="form-head">
        <h4 class="form-title">{{ parentId ? '回复评论' : '发表评论' }}</h4>
        <span class="form-identity">以 <strong>{{ auth.displayName }}</strong> 的身份</span>
      </div>

      <form @submit.prevent="submitForm" class="form-body">
        <!-- Honeypot (hidden from humans, filled by bots) -->
        <div class="hp-field" aria-hidden="true">
          <input v-model="form.website" type="text" tabindex="-1" autocomplete="off" />
        </div>

        <div class="form-field">
          <textarea
            v-model="form.content"
            placeholder="说点什么..."
            rows="4"
            class="form-textarea"
            :class="{ 'input-error': errors.content }"
            @input="clearError"
          />
          <p v-if="errors.content" class="field-error">{{ errors.content }}</p>
        </div>

        <p v-if="submitError" class="submit-error">{{ submitError }}</p>
        <p v-if="submitted" class="submit-success">评论已发布</p>

        <div class="form-actions">
          <button
            v-if="parentId"
            type="button"
            class="cancel-btn"
            @click="$emit('cancel')"
          >
            取消回复
          </button>
          <button type="submit" class="submit-btn" :disabled="submitting">
            <span v-if="submitting" class="spinner" />
            <span v-else>提交</span>
          </button>
        </div>
      </form>
    </template>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { postComment } from '@/api/comments'
import { useLoginModal } from '@/composables/useLogin'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  articleSlug: {
    type: String,
    required: true,
  },
  parentId: {
    type: [Number, String],
    default: null,
  },
})

const emit = defineEmits(['submitted', 'cancel'])

const auth = useAuthStore()
const { openLogin } = useLoginModal()

const form = reactive({
  content: '',
  website: '',  // honeypot — must stay empty
})

const errors = reactive({
  content: '',
})

const submitting = ref(false)
const submitError = ref(null)
const submitted = ref(false)

function validate() {
  errors.content = ''
  const content = form.content.trim()

  if (!content) {
    errors.content = '请输入评论内容'
    return false
  }
  if (content.length < 3) {
    errors.content = '评论内容至少 3 个字符'
    return false
  }
  return true
}

function clearError() {
  if (errors.content) errors.content = ''
  submitError.value = null
}

async function submitForm() {
  if (!validate()) return
  submitting.value = true
  submitError.value = null

  try {
    const data = {
      content: form.content.trim(),
      website: form.website,  // honeypot
    }
    if (props.parentId) {
      data.parent = props.parentId
    }
    await postComment(props.articleSlug, data)
    submitted.value = true
    setTimeout(() => { submitted.value = false }, 3000)
    emit('submitted')
    form.content = ''
  } catch (e) {
    if (e?.response?.status === 401) {
      auth.logout()
      openLogin('登录状态已失效，请重新登录')
      return
    }
    const detail = e?.response?.data
    if (detail && typeof detail === 'object') {
      const contentError = detail.content
      if (contentError) {
        errors.content = Array.isArray(contentError) ? contentError[0] : contentError
      }
      submitError.value =
        detail.detail ||
        (Array.isArray(detail.non_field_errors) ? detail.non_field_errors[0] : detail.non_field_errors) ||
        null
    } else if (typeof detail === 'string') {
      submitError.value = detail
    } else {
      submitError.value = e.message || '提交失败，请稍后重试'
    }
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.comment-form {
  background: $bg-card;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid $glass-border;
  border-radius: $glass-radius;
  padding: 20px 24px;
  transition: border-color $transition-base;

  &.reply-form {
    margin-top: 12px;
    padding: 16px 20px;
    border-color: rgba($neon-purple, 0.2);
  }
}

.form-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.form-title {
  font-size: 1rem;
  font-weight: 600;
  color: $neon-cyan;
}

.form-identity {
  color: $text-secondary;
  font-size: 0.8rem;

  strong { color: $text-primary; font-weight: 600; }
}

.login-cta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;

  .form-title { margin-bottom: 0; }

  &__hint {
    color: $text-secondary;
    font-size: 0.85rem;
    line-height: 1.6;
  }

  .submit-btn { align-self: flex-end; }
}

.form-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-textarea {
  width: 100%;
  padding: 10px 14px;
  font-size: 0.9rem;
  font-family: $font-mono;
  color: $text-primary;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid $glass-border;
  border-radius: 8px;
  outline: none;
  transition: border-color $transition-fast, background $transition-fast;
  resize: vertical;
  min-height: 80px;

  &::placeholder {
    color: rgba($text-secondary, 0.6);
  }

  &:focus {
    border-color: rgba($neon-cyan, 0.4);
    background: rgba(255, 255, 255, 0.06);
    box-shadow: 0 0 8px rgba($neon-cyan, 0.08);
  }

  &.input-error {
    border-color: $neon-pink;
    box-shadow: 0 0 8px rgba($neon-pink, 0.12);
  }
}

.field-error {
  font-size: 0.78rem;
  color: $neon-pink;
  margin: 0;
}

.submit-error {
  font-size: 0.85rem;
  color: $neon-pink;
  margin: 0;
  padding: 8px 12px;
  background: rgba(255, 0, 128, 0.06);
  border-radius: 6px;
  border: 1px solid rgba(255, 0, 128, 0.15);
}

.submit-success {
  font-size: 0.85rem;
  color: #00e676;
  margin: 0;
  padding: 8px 12px;
  background: rgba(0, 230, 118, 0.06);
  border-radius: 6px;
  border: 1px solid rgba(0, 230, 118, 0.15);
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  align-items: center;
}

.submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 24px;
  font-size: 0.85rem;
  font-family: $font-mono;
  font-weight: 600;
  color: #fff;
  background: rgba($neon-cyan, 0.15);
  border: 1px solid $neon-cyan;
  border-radius: 8px;
  cursor: pointer;
  transition: background $transition-fast, box-shadow $transition-fast;

  &:hover:not(:disabled) {
    background: rgba($neon-cyan, 0.25);
    box-shadow: 0 0 12px rgba($neon-cyan, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.cancel-btn {
  padding: 8px 16px;
  font-size: 0.85rem;
  font-family: $font-mono;
  color: $text-secondary;
  background: transparent;
  border: 1px solid $glass-border;
  border-radius: 8px;
  cursor: pointer;
  transition: color $transition-fast, border-color $transition-fast;

  &:hover {
    color: $text-primary;
    border-color: rgba(255, 255, 255, 0.15);
  }
}

.hp-field {
  position: absolute;
  left: -9999px;
  opacity: 0;
  height: 0;
  width: 0;
  overflow: hidden;
}

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>

<template>
  <div class="comment-form" :class="{ 'reply-form': !!parentId }">
    <h4 v-if="parentId" class="form-title">回复评论</h4>
    <h4 v-else class="form-title">发表评论</h4>

    <form @submit.prevent="submitForm" class="form-body">
      <!-- Name -->
      <div class="form-field">
        <input
          v-model="form.author_name"
          type="text"
          placeholder="昵称 *"
          class="form-input"
          :class="{ 'input-error': errors.author_name }"
          @input="clearError('author_name')"
        />
        <p v-if="errors.author_name" class="field-error">{{ errors.author_name }}</p>
      </div>

      <!-- Email -->
      <div class="form-field">
        <input
          v-model="form.author_email"
          type="email"
          placeholder="邮箱 *"
          class="form-input"
          :class="{ 'input-error': errors.author_email }"
          @input="clearError('author_email')"
        />
        <p v-if="errors.author_email" class="field-error">{{ errors.author_email }}</p>
      </div>

      <!-- Content -->
      <div class="form-field">
        <textarea
          v-model="form.content"
          placeholder="说点什么..."
          rows="4"
          class="form-textarea"
          :class="{ 'input-error': errors.content }"
          @input="clearError('content')"
        />
        <p v-if="errors.content" class="field-error">{{ errors.content }}</p>
      </div>

      <!-- Submit error -->
      <p v-if="submitError" class="submit-error">{{ submitError }}</p>

      <!-- Submit success -->
      <p v-if="submitted" class="submit-success">评论已提交！</p>

      <!-- Actions -->
      <div class="form-actions">
        <button
          v-if="parentId"
          type="button"
          class="cancel-btn"
          @click="$emit('cancel')"
        >
          取消回复
        </button>
        <button
          type="submit"
          class="submit-btn"
          :disabled="submitting"
        >
          <span v-if="submitting" class="spinner" />
          <span v-else>提交</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { postComment } from '@/api/comments'

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

const form = reactive({
  author_name: '',
  author_email: '',
  content: '',
})

const errors = reactive({
  author_name: '',
  author_email: '',
  content: '',
})

const submitting = ref(false)
const submitError = ref(null)
const submitted = ref(false)

function validate() {
  let valid = true
  errors.author_name = ''
  errors.author_email = ''
  errors.content = ''

  if (!form.author_name.trim()) {
    errors.author_name = '请输入昵称'
    valid = false
  }

  if (!form.author_email.trim()) {
    errors.author_email = '请输入邮箱'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.author_email)) {
    errors.author_email = '邮箱格式不正确'
    valid = false
  }

  if (!form.content.trim()) {
    errors.content = '请输入评论内容'
    valid = false
  } else if (form.content.trim().length < 3) {
    errors.content = '评论内容至少3个字符'
    valid = false
  }

  return valid
}

function clearError(field) {
  if (errors[field]) errors[field] = ''
  submitError.value = null
}

async function submitForm() {
  if (!validate()) return
  submitting.value = true
  submitError.value = null

  try {
    const data = {
      author_name: form.author_name.trim(),
      author_email: form.author_email.trim(),
      content: form.content.trim(),
    }
    if (props.parentId) {
      data.parent = props.parentId
    }
    await postComment(props.articleSlug, data)
    submitted.value = true
    setTimeout(() => { submitted.value = false }, 3000)
    emit('submitted')
    form.author_name = ''
    form.author_email = ''
    form.content = ''
  } catch (e) {
    const detail = e?.response?.data
    if (typeof detail === 'object' && detail !== null) {
      // Map API field errors to form fields
      const apiErrors = detail
      if (apiErrors.author_name) {
        errors.author_name = Array.isArray(apiErrors.author_name)
          ? apiErrors.author_name[0]
          : apiErrors.author_name
      }
      if (apiErrors.author_email) {
        errors.author_email = Array.isArray(apiErrors.author_email)
          ? apiErrors.author_email[0]
          : apiErrors.author_email
      }
      if (apiErrors.content) {
        errors.content = Array.isArray(apiErrors.content)
          ? apiErrors.content[0]
          : apiErrors.content
      }
      if (apiErrors.detail) {
        submitError.value = apiErrors.detail
      }
      if (apiErrors.non_field_errors) {
        submitError.value = Array.isArray(apiErrors.non_field_errors)
          ? apiErrors.non_field_errors[0]
          : apiErrors.non_field_errors
      }
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

.form-title {
  font-size: 1rem;
  font-weight: 600;
  color: $neon-cyan;
  margin-bottom: 16px;
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

.form-input,
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

.form-textarea {
  min-height: 80px;
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

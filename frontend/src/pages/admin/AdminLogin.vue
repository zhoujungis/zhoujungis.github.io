<template>
  <div class="admin-login-page">
    <div class="login-card glass-card">
      <h1 class="login-heading neon-text-cyan">管理员登录</h1>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-field">
          <label class="field-label" for="username">用户名</label>
          <input
            id="username"
            v-model.trim="username"
            type="text"
            class="field-input"
            placeholder="请输入用户名"
            autocomplete="username"
            :disabled="loading"
          />
        </div>

        <div class="form-field">
          <label class="field-label" for="password">密码</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="field-input"
            placeholder="请输入密码"
            autocomplete="current-password"
            :disabled="loading"
          />
        </div>

        <p v-if="error" class="login-error">{{ error }}</p>

        <button
          type="submit"
          class="login-btn neon-border-cyan"
          :disabled="loading || !username || !password"
        >
          <span v-if="loading" class="btn-loading">
            <span class="spinner" />
            登录中...
          </span>
          <span v-else>登 录</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

onMounted(() => {
  authStore.checkAuth()
  if (authStore.isAuthenticated) {
    router.push('/admin/dashboard')
  }
})

async function handleLogin() {
  if (!username.value || !password.value) return

  loading.value = true
  error.value = ''

  try {
    await authStore.login(username.value, password.value)
    router.push('/admin/dashboard')
  } catch (err) {
    if (err.response && err.response.status === 401) {
      error.value = '用户名或密码错误'
    } else if (err.response && err.response.data && err.response.data.detail) {
      error.value = err.response.data.detail
    } else {
      error.value = '登录失败，请检查网络连接'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.admin-login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 56px);
  padding: 2rem;
  background: $bg-primary;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 2.5rem 2rem;
}

.login-heading {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  letter-spacing: 2px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-label {
  font-size: 0.8rem;
  color: $text-secondary;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.field-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: $bg-card;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid $glass-border;
  border-radius: 8px;
  color: $text-primary;
  font-size: 0.95rem;
  font-family: $font-mono;
  outline: none;
  transition:
    border-color $transition-fast,
    box-shadow $transition-fast;

  &::placeholder {
    color: rgba($text-secondary, 0.5);
  }

  &:focus {
    border-color: $neon-cyan;
    box-shadow:
      0 0 5px rgba($neon-cyan, 0.2),
      0 0 10px rgba($neon-cyan, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.login-error {
  color: #ff4444;
  font-size: 0.85rem;
  text-align: center;
  padding: 0.5rem;
  background: rgba(255, 68, 68, 0.08);
  border-radius: 6px;
  border: 1px solid rgba(255, 68, 68, 0.15);
}

.login-btn {
  width: 100%;
  padding: 0.85rem 1rem;
  font-size: 1rem;
  font-weight: 700;
  font-family: $font-mono;
  color: $neon-cyan;
  background: transparent;
  border: 1px solid $neon-cyan;
  border-radius: 8px;
  cursor: pointer;
  letter-spacing: 4px;
  transition:
    background $transition-fast,
    box-shadow $transition-fast,
    opacity $transition-fast;

  &:hover:not(:disabled) {
    background: rgba($neon-cyan, 0.08);
    box-shadow:
      0 0 5px $neon-cyan,
      0 0 10px rgba($neon-cyan, 0.5),
      inset 0 0 5px rgba($neon-cyan, 0.1);
  }

  &:active:not(:disabled) {
    background: rgba($neon-cyan, 0.15);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.btn-loading {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba($neon-cyan, 0.3);
  border-top-color: $neon-cyan;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

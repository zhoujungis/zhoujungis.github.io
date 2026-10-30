<template>
  <Teleport to="body">
    <Transition name="login-fade">
      <div v-if="visible" class="login-overlay" @click.self="closeLogin">
        <div class="login-card" role="dialog" aria-modal="true" aria-labelledby="login-title">
          <button class="close-btn" type="button" aria-label="关闭" @click="closeLogin">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6l-12 12" /></svg>
          </button>

          <header class="login-head">
            <h2 id="login-title">{{ step === 'email' ? '登录 / 注册' : '输入验证码' }}</h2>
            <p v-if="step === 'email'">邮箱验证码、Google 或 GitHub，任选一种即可登录</p>
            <p v-else>验证码已发送至 <strong>{{ email }}</strong></p>
          </header>

          <p v-if="error" class="login-error">{{ error }}</p>

          <form v-if="step === 'email'" class="login-form" @submit.prevent="sendCode">
            <input
              v-model="email"
              type="email"
              class="login-input"
              placeholder="you@example.com"
              autocomplete="email"
              :disabled="loading"
            />
            <button type="submit" class="primary-btn" :disabled="loading">
              <span v-if="loading">发送中…</span>
              <span v-else>发送验证码</span>
            </button>
          </form>

          <form v-else class="login-form" @submit.prevent="submitCode">
            <input
              v-model="code"
              type="text"
              class="login-input code-input"
              inputmode="numeric"
              maxlength="6"
              placeholder="6 位数字验证码"
              autocomplete="one-time-code"
              :disabled="loading"
            />
            <button type="submit" class="primary-btn" :disabled="loading || code.trim().length !== 6">
              <span v-if="loading">登录中…</span>
              <span v-else>登录</span>
            </button>
            <div class="code-actions">
              <button type="button" class="link-btn" @click="backToEmail">换个邮箱</button>
              <button type="button" class="link-btn" :disabled="cooldown > 0" @click="sendCode">
                {{ cooldown > 0 ? `${cooldown}s 后重发` : '重新发送' }}
              </button>
            </div>
          </form>

          <template v-if="step === 'email'">
            <div class="divider"><span>或使用第三方账号</span></div>
            <div class="oauth-row">
              <button type="button" class="oauth-btn" @click="oauth('github')">
                <svg viewBox="0 0 16 16" aria-hidden="true" class="oauth-icon">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.88.51-1.08-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
                GitHub
              </button>
              <button type="button" class="oauth-btn" @click="oauth('google')">
                <svg viewBox="0 0 48 48" aria-hidden="true" class="oauth-icon">
                  <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
                  <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
                  <path fill="#FBBC05" d="M11.69 28.18c-.44-1.32-.69-2.73-.69-4.18s.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z" />
                  <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
                </svg>
                Google
              </button>
            </div>
          </template>

          <p class="login-foot">登录后即可发表评论，昵称可在右上角修改。</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { requestEmailCode, startOAuth, verifyEmailCode } from '@/api/auth'
import { useLoginModal } from '@/composables/useLogin'
import { useScrollLock } from '@/composables/useScrollLock'
import { useAuthStore } from '@/stores/auth'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const { visible, message, closeLogin } = useLoginModal()
const auth = useAuthStore()
const route = useRoute()
const scrollLock = useScrollLock()

const step = ref('email')
const email = ref('')
const code = ref('')
const loading = ref(false)
const error = ref('')
const cooldown = ref(0)
let timer = null

function clearTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function startCooldown(seconds) {
  clearTimer()
  cooldown.value = Math.min(300, Math.max(1, Number(seconds) || 60))
  timer = setInterval(() => {
    cooldown.value -= 1
    if (cooldown.value <= 0) clearTimer()
  }, 1000)
}

function onKeydown(event) {
  if (event.key === 'Escape') closeLogin()
}

watch(visible, (open) => {
  if (open) {
    scrollLock.acquire()
    window.addEventListener('keydown', onKeydown)
    error.value = message.value
    message.value = ''
    if (!email.value) step.value = 'email'
  } else {
    scrollLock.release()
    window.removeEventListener('keydown', onKeydown)
    clearTimer()
    cooldown.value = 0
    loading.value = false
  }
})

onUnmounted(() => {
  clearTimer()
  window.removeEventListener('keydown', onKeydown)
})

function backToEmail() {
  step.value = 'email'
  code.value = ''
  error.value = ''
}

async function sendCode() {
  const value = email.value.trim()
  if (!EMAIL_RE.test(value)) {
    error.value = '请输入正确的邮箱地址'
    return
  }

  loading.value = true
  error.value = ''
  try {
    const res = await requestEmailCode(value)
    email.value = value
    step.value = 'code'
    startCooldown(res.data?.cooldown || 60)
  } catch (e) {
    const detail = e?.response?.data
    error.value = detail?.detail || '发送失败，请稍后重试'
    if (detail?.cooldown) startCooldown(detail.cooldown)
  } finally {
    loading.value = false
  }
}

async function submitCode() {
  const value = code.value.trim()
  if (value.length !== 6) {
    error.value = '请输入 6 位验证码'
    return
  }

  loading.value = true
  error.value = ''
  try {
    const res = await verifyEmailCode(email.value, value)
    auth.applyAuth(res.data)
    closeLogin()
    code.value = ''
    step.value = 'email'
  } catch (e) {
    error.value = e?.response?.data?.detail || '登录失败，请重试'
  } finally {
    loading.value = false
  }
}

function oauth(provider) {
  error.value = ''
  loading.value = true
  startOAuth(provider, route.fullPath)
    .then(({ data }) => {
      if (data?.url) {
        window.location.assign(data.url)
        return
      }
      throw new Error('missing authorize url')
    })
    .catch((e) => {
      error.value = e?.response?.data?.detail || '该登录方式暂时不可用'
      loading.value = false
    })
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.login-overlay {
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(18, 26, 21, 0.5);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.login-card {
  position: relative;
  width: min(100%, 392px);
  padding: 30px 28px 22px;
  background: var(--surface);
  border: 1px solid var(--glass-border);
  border-radius: 18px;
  box-shadow: $card-shadow-hover;
}

.close-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 50%;
  cursor: pointer;
  transition: color $transition-fast, background $transition-fast, border-color $transition-fast;

  svg {
    width: 16px;
    height: 16px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
  }

  &:hover {
    color: var(--text-primary);
    background: var(--surface-muted);
    border-color: var(--hairline);
  }
}

.login-head {
  margin-bottom: 18px;

  h2 {
    color: var(--text-primary);
    font-size: 1.18rem;
    font-weight: 700;
    letter-spacing: 0.01em;
  }

  p {
    margin-top: 6px;
    color: var(--text-secondary);
    font-size: 0.84rem;
    line-height: 1.5;

    strong { color: var(--text-primary); font-weight: 600; }
  }
}

.login-error {
  margin-bottom: 12px;
  padding: 8px 11px;
  color: #d64545;
  font-size: 0.82rem;
  line-height: 1.5;
  background: rgba(214, 69, 69, 0.08);
  border: 1px solid rgba(214, 69, 69, 0.18);
  border-radius: 8px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.login-input {
  width: 100%;
  height: 44px;
  padding: 0 14px;
  color: var(--text-primary);
  background: var(--page-bg);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  font-family: $font-mono;
  font-size: 0.92rem;
  outline: none;
  transition: border-color $transition-fast, box-shadow $transition-fast;

  &::placeholder { color: var(--text-secondary); opacity: 0.7; }

  &:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-soft);
  }
}

.code-input {
  text-align: center;
  letter-spacing: 0.32em;
  font-size: 1.05rem;
}

.primary-btn {
  height: 44px;
  color: #fff;
  background: var(--accent);
  border: 1px solid var(--accent);
  border-radius: 10px;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity $transition-fast, transform 0.12s ease;

  &:hover:not(:disabled) { opacity: 0.92; }
  &:active:not(:disabled) { transform: scale(0.985); }
  &:disabled { opacity: 0.45; cursor: not-allowed; }
}

.code-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2px;
}

.link-btn {
  padding: 0;
  color: var(--text-secondary);
  background: transparent;
  border: 0;
  font-size: 0.8rem;
  cursor: pointer;
  transition: color $transition-fast;

  &:hover:not(:disabled) { color: var(--accent); }
  &:disabled { opacity: 0.55; cursor: not-allowed; }
}

.divider {
  position: relative;
  margin: 22px 0 16px;
  text-align: center;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--hairline);
  }

  span {
    position: relative;
    padding: 0 10px;
    color: var(--text-secondary);
    background: var(--surface);
    font-size: 0.76rem;
  }
}

.oauth-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.oauth-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 42px;
  color: var(--text-primary);
  background: var(--page-bg);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color $transition-fast, background $transition-fast, transform 0.12s ease;

  &:hover {
    background: var(--surface-muted);
    border-color: var(--accent-line);
  }
  &:active { transform: scale(0.98); }
}

.oauth-icon {
  width: 16px;
  height: 16px;
  flex: 0 0 16px;
}

.login-foot {
  margin-top: 18px;
  color: var(--text-secondary);
  font-size: 0.76rem;
  line-height: 1.6;
  text-align: center;
}

.login-fade-enter-active,
.login-fade-leave-active { transition: opacity $transition-fast; }
.login-fade-enter-from,
.login-fade-leave-to { opacity: 0; }

@media (max-width: 480px) {
  .login-card { padding: 26px 20px 18px; }
}
</style>

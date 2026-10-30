import { ref } from 'vue'
import { fetchSubscription, toggleSubscription } from '@/api/newsletter'

// 模块级单例：头部用户菜单和正文里的订阅卡片共享同一份状态，
// 任一入口切换后另一个入口立刻同步，不必各自再发一次请求。
const subscribed = ref(false)
const email = ref('')
const busy = ref(false)
const loaded = ref(false)

async function refresh() {
  busy.value = true
  try {
    const res = await fetchSubscription()
    subscribed.value = !!res.data?.subscribed
    email.value = res.data?.email || ''
    loaded.value = true
  } catch {
    // 未登录 / 网络异常：保持现有状态，不打扰用户
  } finally {
    busy.value = false
  }
}

async function toggle() {
  busy.value = true
  try {
    const res = await toggleSubscription()
    subscribed.value = !!res.data?.subscribed
    loaded.value = true
    return subscribed.value
  } finally {
    busy.value = false
  }
}

function reset() {
  subscribed.value = false
  email.value = ''
  loaded.value = false
}

export function useSubscription() {
  return { subscribed, email, busy, loaded, refresh, toggle, reset }
}

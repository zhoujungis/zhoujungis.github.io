import { ref } from 'vue'

// 全站单例：头部「登录」、评论框、回复按钮都打开同一个弹窗。
const visible = ref(false)
const message = ref('')

export function useLoginModal() {
  return {
    visible,
    message,
    openLogin(notice = '') {
      message.value = notice
      visible.value = true
    },
    closeLogin() {
      visible.value = false
    },
  }
}

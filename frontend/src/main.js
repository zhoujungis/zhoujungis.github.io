import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './styles/global.scss'
import App from './App.vue'
import router from './router'
import { applyRouteSeo } from './utils/seo'
import { captureStaticFallback } from './utils/prerenderPreview'
import { exchangeOAuthTicket } from './api/auth'
import { refreshAccessToken } from './api/client'
import { useLoginModal } from './composables/useLogin'
import { useAuthStore } from './stores/auth'
import { autoSwitchLang } from './utils/locale'

// 首次访问且系统时区在中文地区之外 → 直接换到 /en/。必须在挂载前调用，
// 否则中文首页会先闪一下再跳走。
autoSwitchLang()

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)

// Page-level <title>, canonical and og:* for every route. ArticleDetail is
// excluded because it sets its own once the article data arrives (see its
// applySeo()); everything else is covered here, which is what stops one
// page's title and og:image from leaking onto the next.
//
// Registered BEFORE app.use(router) on purpose: installing the router is what
// triggers the initial navigation, so a hook added afterwards would miss it
// and a direct hit on /articles would keep the site-name <title>.
router.afterEach((to) => {
  // 这几个页面会按自己拿到的数据写 SEO 标签（文章/专题/标签名与数量在
  // 客户端是异步可变的），这里跳过，避免被通用标题覆盖。
  const selfSeo = ['ArticleDetail', 'TopicDetail', 'TagDetail', 'CategoryDetail']
  if (!selfSeo.includes(to.name)) applyRouteSeo(to)
})

app.use(router)

// ── 登录态自举 ───────────────────────────────────────────────
// 1) 先读 localStorage 里的 JWT，避免每个组件都自己 parse 一遍；
// 2) OAuth 回调会带着一次性 login_ticket 跳回来，兑换成 JWT 后立刻把它
//    从地址栏抹掉（票据只能用一次，留在 URL 里只会污染分享链接）；
// 3) 已有登录态时拉一次 /auth/me/，昵称在别的设备改过也能同步过来。
const auth = useAuthStore(pinia)
auth.checkAuth()

const params = new URLSearchParams(window.location.search)
const ticket = params.get('login_ticket')
const loginError = params.get('login_error')

if (ticket || loginError) {
  params.delete('login_ticket')
  params.delete('login_error')
  const query = params.toString()
  const cleanUrl = window.location.pathname + (query ? `?${query}` : '')
  window.history.replaceState({}, '', cleanUrl)

  // 已登录时地址栏里残留的 OAuth 参数只是历史遗留（刷新、分享链接都会带上），
  // 既不该重新兑换票据（票据一次性，必然 400），也不该打断阅读弹登录框。
  if (auth.isAuthenticated) {
    // 什么都不做，仅把参数抹掉
  } else if (ticket) {
    exchangeOAuthTicket(ticket)
      .then((res) => auth.applyAuth(res.data))
      .catch((err) => {
        console.warn('auth: login ticket exchange failed', err)
        useLoginModal().openLogin('登录未完成，请重新登录')
      })
  } else {
    useLoginModal().openLogin('登录未完成，请重试')
  }
}

if (auth.isAuthenticated) {
  auth.fetchMe().catch(() => {
    // 令牌失效交给 client.js 的刷新/清空逻辑处理，这里不弹错误。
  })
} else if (localStorage.getItem('refresh_token')) {
  // access token 只有 1 小时，refresh token 有 30 天。超过 1 小时再打开页面时
  // 上面的 checkAuth() 已经把过期的 access 清掉了，但 refresh 仍然有效——
  // 主动续一次，否则「登录状态保持 30 天」形同虚设。
  refreshAccessToken()
    .then(() => {
      auth.checkAuth()
      return auth.fetchMe()
    })
    .catch((err) => {
      // 网络超时 / 5xx 只是暂时失败：保留 refresh token，下次打开再续。
      // 只有服务端明确拒绝（400/401/403）才彻底退出登录。
      if (err?.definitive) auth.logout()
      else console.warn('auth: refresh temporarily failed', err)
    })
}

// 必须在 app.mount 之前保存静态正文：mount 会先清空 #app，再执行组件 setup，
// 否则详情页的零等待首屏读不到预渲染内容。
captureStaticFallback()

app.mount('#app')

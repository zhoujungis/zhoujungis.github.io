import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './styles/global.scss'
import App from './App.vue'
import router from './router'

// ── 移动端禁止缩放：iOS 那一层 ────────────────────────────────────────────
// 三层里唯一需要 JS 的一层。iOS 10 起 Safari 出于无障碍考虑**故意忽略** viewport 的
// `user-scalable=no` 与 `maximum-scale`，所以在 iPhone 上光改 meta 是没用的。
// `gesturestart` / `gesturechange` / `gestureend` 是 Safari 私有的多指手势事件，
// 取消它们就挡住了捏合缩放；单指滚动、以及所有 `overflow` 滚动容器都不受影响。
// Android / Chrome / Edge 由 global.scss 的 `touch-action: pan-x pan-y` 负责，
// 老浏览器由 viewport meta 兜底。
// `passive: false` 是必须的 —— passive 监听器里 preventDefault() 会被静默忽略。
for (const type of ['gesturestart', 'gesturechange', 'gestureend']) {
  document.addEventListener(type, (event) => event.preventDefault(), { passive: false })
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

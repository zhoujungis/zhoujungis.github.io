import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './styles/global.scss'
import App from './App.vue'
import router from './router'
import { applyRouteSeo } from './utils/seo'

const app = createApp(App)

app.use(createPinia())

// Page-level <title>, canonical and og:* for every route. ArticleDetail is
// excluded because it sets its own once the article data arrives (see its
// applySeo()); everything else is covered here, which is what stops one
// page's title and og:image from leaking onto the next.
//
// Registered BEFORE app.use(router) on purpose: installing the router is what
// triggers the initial navigation, so a hook added afterwards would miss it
// and a direct hit on /articles would keep the site-name <title>.
router.afterEach((to) => {
  if (to.name !== 'ArticleDetail') applyRouteSeo(to)
})

app.use(router)

app.mount('#app')

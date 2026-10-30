import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { refreshAccessToken } from '../api/client'
import { listPageMeta } from '../utils/siteConfig'

// `meta.title` drives <title> via applyRouteSeo() in main.js. Pages that also
// exist as static HTML (see siteConfig LIST_PAGES) reuse the exact same title
// and description the build wrote into their file, and declare the slashed
// canonical form — the URL GitHub Pages actually answers with 200.
const routes = [
  { path: '/', name: 'Home', component: () => import('../pages/Home.vue') },
  { path: '/article/:slug', name: 'ArticleDetail', component: () => import('../pages/ArticleDetail.vue') },
  { path: '/articles', name: 'Articles', meta: listPageMeta('/articles/'), component: () => import('../pages/Articles.vue') },
  { path: '/categories', name: 'Categories', meta: listPageMeta('/categories/'), component: () => import('../pages/Categories.vue') },
  { path: '/tags', name: 'Tags', meta: listPageMeta('/tags/'), component: () => import('../pages/Tags.vue') },
  {
    path: '/search',
    name: 'Search',
    // Prerendered for the 200, but noindex: results only exist in response to
    // a query, so there is nothing for a crawler to index.
    meta: listPageMeta('/search/'),
    component: () => import('../pages/Search.vue'),
  },
  { path: '/photos', name: 'PhotoWall', meta: listPageMeta('/photos/'), component: () => import('../pages/PhotoWall.vue') },
  { path: '/friends', name: 'FriendLinks', meta: listPageMeta('/friends/'), component: () => import('../pages/FriendLinks.vue') },
  { path: '/footprints', name: 'Footprints', meta: listPageMeta('/footprints/'), component: () => import('../pages/Footprints.vue') },
  { path: '/archives', name: 'Archives', meta: listPageMeta('/archives/'), component: () => import('../pages/Archives.vue') },
  // 合规与介绍页（AdSense 审核必查）：三条路由共用一个页面组件，正文来自
  // data/sitePages.js，路由 meta 通过 listPageMeta 带上 sitePage key。
  { path: '/about', name: 'About', meta: listPageMeta('/about/'), component: () => import('../pages/SitePage.vue') },
  { path: '/privacy', name: 'Privacy', meta: listPageMeta('/privacy/'), component: () => import('../pages/SitePage.vue') },
  { path: '/disclaimer', name: 'Disclaimer', meta: listPageMeta('/disclaimer/'), component: () => import('../pages/SitePage.vue') },
  { path: '/admin', name: 'AdminLogin', meta: { title: '管理后台', robots: 'noindex, nofollow' }, component: () => import('../pages/admin/AdminLogin.vue') },
  { path: '/admin/dashboard', name: 'AdminDashboard', meta: { requiresAuth: true, title: '管理后台', robots: 'noindex, nofollow' }, component: () => import('../pages/admin/AdminDashboard.vue') },
  { path: '/admin/editor/:id?', name: 'ArticleEditor', meta: { requiresAuth: true, title: '编辑文章', robots: 'noindex, nofollow' }, component: () => import('../pages/admin/ArticleEditor.vue') },
  { path: '/admin/articles', name: 'ArticleList', meta: { requiresAuth: true, title: '文章管理', robots: 'noindex, nofollow' }, component: () => import('../pages/admin/ArticleList.vue') },
  { path: '/admin/comments', name: 'CommentManage', meta: { requiresAuth: true, title: '评论管理', robots: 'noindex, nofollow' }, component: () => import('../pages/admin/CommentManage.vue') },
  { path: '/:pathMatch(.*)*', name: 'NotFound', meta: { title: '页面不存在', robots: 'noindex, follow' }, component: () => import('../pages/NotFound.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Try to refresh an expired access token using the stored refresh token.
// P4: reuses the single-flight refresh from api/client.js instead of keeping
// a second, divergent copy of the same logic here.
async function tryRefresh() {
  try {
    await refreshAccessToken()
    return true
  } catch {
    return false
  }
}

router.beforeEach(async (to, from, next) => {
  if (!to.meta.requiresAuth) {
    next()
    return
  }
  const authStore = useAuthStore()
  authStore.checkAuth() // re-reads expiry; clears isAuthenticated if expired

  if (authStore.isAuthenticated) {
    next()
    return
  }

  // Token is missing or expired — try a refresh before giving up.
  // Without this, a user with a valid refresh token who opens an admin
  // page after their access token expired gets kicked out even though
  // /token/refresh/ would have succeeded.
  const refreshed = await tryRefresh()
  if (refreshed) {
    authStore.checkAuth()
    if (authStore.isAuthenticated) {
      next()
      return
    }
  }

  // Refresh failed or no refresh token — back to login.
  next({ name: 'AdminLogin' })
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import client from '../api/client'

const routes = [
  { path: '/', name: 'Home', component: () => import('../pages/Home.vue') },
  { path: '/article/:slug', name: 'ArticleDetail', component: () => import('../pages/ArticleDetail.vue') },
  { path: '/articles', name: 'Articles', component: () => import('../pages/Articles.vue') },
  { path: '/categories', name: 'Categories', component: () => import('../pages/Categories.vue') },
  { path: '/tags', name: 'Tags', component: () => import('../pages/Tags.vue') },
  { path: '/search', name: 'Search', component: () => import('../pages/Search.vue') },
  { path: '/about', name: 'About', component: () => import('../pages/About.vue') },
  { path: '/photos', name: 'PhotoWall', component: () => import('../pages/PhotoWall.vue') },
  { path: '/friends', name: 'FriendLinks', component: () => import('../pages/FriendLinks.vue') },
  { path: '/footprints', name: 'Footprints', component: () => import('../pages/Footprints.vue') },
  { path: '/archives', name: 'Archives', component: () => import('../pages/Archives.vue') },
  { path: '/admin', name: 'AdminLogin', component: () => import('../pages/admin/AdminLogin.vue') },
  { path: '/admin/dashboard', name: 'AdminDashboard', meta: { requiresAuth: true }, component: () => import('../pages/admin/AdminDashboard.vue') },
  { path: '/admin/editor/:id?', name: 'ArticleEditor', meta: { requiresAuth: true }, component: () => import('../pages/admin/ArticleEditor.vue') },
  { path: '/admin/articles', name: 'ArticleList', meta: { requiresAuth: true }, component: () => import('../pages/admin/ArticleList.vue') },
  { path: '/admin/comments', name: 'CommentManage', meta: { requiresAuth: true }, component: () => import('../pages/admin/CommentManage.vue') },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../pages/NotFound.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Try to refresh an expired access token using the stored refresh token
// (mirrors the response interceptor logic in api/client.js).
async function tryRefresh() {
  const refresh = localStorage.getItem('refresh_token')
  if (!refresh) return false
  try {
    const res = await client.post(
      '/token/refresh/',
      { refresh },
      // Bypass the 401 interceptor for the refresh call itself
      { _skipRefresh: true, timeout: 10000 },
    )
    const access = res.data?.access
    const newRefresh = res.data?.refresh
    if (!access) return false
    localStorage.setItem('token', access)
    // H-F1: persist the rotated refresh token (if any)
    if (newRefresh) localStorage.setItem('refresh_token', newRefresh)
    // Update expiry
    try {
      const payload = JSON.parse(
        atob(access.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')),
      )
      if (payload?.exp) localStorage.setItem('token_expiry', String(payload.exp * 1000))
    } catch { /* ignore malformed JWT */ }
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

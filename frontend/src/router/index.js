import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { refreshAccessToken } from '../api/client'

const routes = [
  { path: '/', name: 'Home', component: () => import('../pages/Home.vue') },
  { path: '/article/:slug', name: 'ArticleDetail', component: () => import('../pages/ArticleDetail.vue') },
  { path: '/articles', name: 'Articles', component: () => import('../pages/Articles.vue') },
  { path: '/categories', name: 'Categories', component: () => import('../pages/Categories.vue') },
  { path: '/tags', name: 'Tags', component: () => import('../pages/Tags.vue') },
  { path: '/search', name: 'Search', component: () => import('../pages/Search.vue') },
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

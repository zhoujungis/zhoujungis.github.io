import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', name: 'Home', component: () => import('../pages/Home.vue') },
  { path: '/article/:slug', name: 'ArticleDetail', component: () => import('../pages/ArticleDetail.vue') },
  { path: '/categories', name: 'Categories', component: () => import('../pages/Categories.vue') },
  { path: '/tags', name: 'Tags', component: () => import('../pages/Tags.vue') },
  { path: '/search', name: 'Search', component: () => import('../pages/Search.vue') },
  { path: '/about', name: 'About', component: () => import('../pages/About.vue') },
  { path: '/photos', name: 'PhotoWall', component: () => import('../pages/PhotoWall.vue') },
  { path: '/friends', name: 'FriendLinks', component: () => import('../pages/FriendLinks.vue') },
  { path: '/archives', name: 'Archives', component: () => import('../pages/Archives.vue') },
  { path: '/admin', name: 'AdminLogin', component: () => import('../pages/admin/AdminLogin.vue') },
  { path: '/admin/dashboard', name: 'AdminDashboard', meta: { requiresAuth: true }, component: () => import('../pages/admin/AdminDashboard.vue') },
  { path: '/admin/editor/:id?', name: 'ArticleEditor', meta: { requiresAuth: true }, component: () => import('../pages/admin/ArticleEditor.vue') },
  { path: '/admin/articles', name: 'ArticleList', meta: { requiresAuth: true }, component: () => import('../pages/admin/ArticleList.vue') },
  { path: '/admin/comments', name: 'CommentManage', meta: { requiresAuth: true }, component: () => import('../pages/admin/CommentManage.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      next({ name: 'AdminLogin' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router

import client from './client'
import { SITE_ORIGIN } from '@/utils/siteConfig'

// 数据库里早期录入的封面是绝对地址 https://zhoujungis.github.io/photos/xxx.png。
// 域名迁移后这些地址会先撞一次 GitHub Pages 的跨域 301 才落到新域名，
// 既慢又可能把 http/https 混在一起（HTTPS 页面里一旦出现 http 图片就会被
// 浏览器直接拦成 Mixed Content）。这里在数据入口统一收敛到当前站点。
const LEGACY_HOSTS = ['https://zhoujungis.github.io', 'http://zhoujungis.github.io']

function normalizeImageUrl(url) {
  if (typeof url !== 'string' || !url) return url
  const hit = LEGACY_HOSTS.find((host) => url.startsWith(`${host}/`))
  return hit ? `${SITE_ORIGIN}${url.slice(hit.length)}` : url
}

function normalizeArticle(article) {
  if (!article || !article.cover_image) return article
  return { ...article, cover_image: normalizeImageUrl(article.cover_image) }
}

function normalizePageResponse(data) {
  // 列表接口分页时是 {count, results: [...]}，否则就是裸数组
  if (Array.isArray(data)) return data.map(normalizeArticle)
  if (data && Array.isArray(data.results)) {
    return { ...data, results: data.results.map(normalizeArticle) }
  }
  return data
}

export function getArticles(params) {
  return client.get('/articles/', { params }).then((res) => ({
    ...res,
    data: normalizePageResponse(res.data),
  }))
}

export function getArticleBySlug(slug) {
  return client.get(`/articles/${slug}/`).then((res) => ({
    ...res,
    data: normalizeArticle(res.data),
  }))
}

export function getCategories() {
  return client.get('/categories/')
}

export function getTags() {
  return client.get('/tags/')
}

export function getPhotos(params) {
  return client.get('/photos/', { params })
}

export function getFriends() {
  return client.get('/friends/')
}

import client from './client'

export function getArticles(params) {
  return client.get('/articles/', { params })
}

export function getArticleBySlug(slug) {
  return client.get(`/articles/${slug}/`)
}

export function getCategories() {
  return client.get('/categories/')
}

export function getTags() {
  return client.get('/tags/')
}

export function getPhotos() {
  return client.get('/photos/')
}

export function getFriends() {
  return client.get('/friends/')
}

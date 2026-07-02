import client from './client'

export function login(username, password) {
  return client.post('/token/', { username, password })
}

export function createArticle(data) {
  return client.post('/admin/articles/', data)
}

export function updateArticle(id, data) {
  return client.put(`/admin/articles/${id}/`, data)
}

export function deleteArticle(id) {
  return client.delete(`/admin/articles/${id}/`)
}

export function uploadImage(file) {
  const formData = new FormData()
  formData.append('image', file)
  return client.post('/admin/upload/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function getPendingComments() {
  return client.get('/admin/comments/pending/')
}

export function approveComment(id) {
  return client.put(`/admin/comments/${id}/approve/`)
}

export function deleteComment(id) {
  return client.delete(`/admin/comments/${id}/`)
}

export function getStats() {
  return client.get('/admin/stats/')
}

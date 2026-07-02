import client from './client'

export function getComments(articleSlug) {
  return client.get(`/articles/${articleSlug}/comments/`)
}

export function postComment(articleSlug, data) {
  return client.post(`/articles/${articleSlug}/comments/`, data)
}

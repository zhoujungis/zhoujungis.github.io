import client from './client'

export function subscribeEmail(email) {
  return client.post('/subscribe/', { email })
}

export function fetchSubscription() {
  return client.get('/subscribe/status/')
}

export function toggleSubscription() {
  return client.post('/subscribe/toggle/')
}

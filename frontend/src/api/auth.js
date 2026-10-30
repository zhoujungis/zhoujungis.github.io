import client from './client'

export function requestEmailCode(email) {
  return client.post('/auth/email/request/', { email })
}

export function verifyEmailCode(email, code) {
  return client.post('/auth/email/verify/', { email, code })
}

export function getMe() {
  return client.get('/auth/me/')
}

export function updateMe(payload) {
  return client.patch('/auth/me/', payload)
}

export function startOAuth(provider, next) {
  return client.get(`/auth/oauth/${provider}/start/`, { params: { next } })
}

export function exchangeOAuthTicket(ticket) {
  return client.post('/auth/oauth/exchange/', { ticket })
}

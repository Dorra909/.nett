const BASE = 'http://localhost:5080/api'

function getToken() {
  if (typeof localStorage !== 'undefined') return localStorage.getItem('token')
  return null
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  }
  const res = await fetch(`${BASE}${path}`, {
    headers,
    ...options,
  })
  if (!res.ok) {
    const message = await res.text()
    throw new Error(message || `Erreur HTTP ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  // Auth
  login: data => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: data => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  // Properties (publiques)
  properties: (search = '') => request(`/properties${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  createProperty: data => request('/properties', { method: 'POST', body: JSON.stringify(data) }),
  updateProperty: (id, data) => request(`/properties/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProperty: id => request(`/properties/${id}`, { method: 'DELETE' }),

  // Users
  users: () => request('/users'),
  createUser: data => request('/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id, data) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: id => request(`/users/${id}`, { method: 'DELETE' }),

  // Requests
  requests: () => request('/requests'),
  updateRequest: (id, status) => request(`/requests/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // Messages
  messages: () => request('/messages'),
  readMessage: id => request(`/messages/${id}/read`, { method: 'PUT' }),

  // Dashboard
  dashboard: () => request('/dashboard'),

  // Client (protégé)
  clientProperties: () => request('/client/properties'),
  clientCreateRequest: data => request('/client/requests', { method: 'POST', body: JSON.stringify(data) }),
  clientRequests: () => request('/client/requests'),
  clientMessages: () => request('/client/messages'),
}

// The Vite proxy serves this locally; production can override it with
// VITE_API_URL=/api (when Nginx proxies the same path to FastAPI).
const API_URL = import.meta.env.VITE_API_URL || '/api'
const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).detail || 'Request failed')
  return response.status === 204 ? null : response.json()
}
export const budgetApi = {
  summary: month => request(`/budget/summary?month=${month}`),
  items: month => request(`/budget/items?month=${month}`),
  create: item => request('/budget/items', { method: 'POST', body: JSON.stringify(item) }),
  update: (id, item) => request(`/budget/items/${id}`, { method: 'PUT', body: JSON.stringify(item) }),
  remove: id => request(`/budget/items/${id}`, { method: 'DELETE' }),
  exportPdf: async month => {
    const response = await fetch(`${API_URL}/reports/export?month=${month}`, { method: 'POST', credentials: 'include' })
    if (!response.ok) throw new Error('Could not generate report')
    const url = URL.createObjectURL(await response.blob()); const a = document.createElement('a'); a.href = url; a.download = `budget-report-${month.slice(0, 7)}.pdf`; a.click(); URL.revokeObjectURL(url)
  }
}

export const authApi = {
  login: (username, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me', { method: 'GET' })
}

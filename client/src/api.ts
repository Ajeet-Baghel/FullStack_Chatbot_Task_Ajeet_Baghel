const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export const apiUrl = (path: string): string => `${API_URL}${path}`

export const apiFetch = (path: string, init?: RequestInit): Promise<Response> =>
  fetch(apiUrl(path), { ...init, credentials: 'include' })

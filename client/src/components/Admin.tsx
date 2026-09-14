import { useEffect, useState, FormEvent } from 'react'
import { apiFetch } from '../api'
import './Admin.css'
import AdminDashboard from './AdminDashboard'

function Admin({ onBack }: { onBack: () => void }) {
  const [authed, setAuthed] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch('/api/admin/session')
      .then(response => response.ok ? response.json() : { authenticated: false })
      .then(data => setAuthed(Boolean(data.authenticated)))
      .catch(() => setAuthed(false))
      .finally(() => setCheckingSession(false))
  }, [])

  const login = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const response = await apiFetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Unable to sign in')
      setPassword('')
      setAuthed(true)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const logout = async () => {
    try {
      await apiFetch('/api/admin/logout', { method: 'POST' })
    } finally {
      setAuthed(false)
    }
  }

  if (checkingSession) {
    return <div className="admin-login"><p>Checking admin session...</p></div>
  }

  if (authed) {
    return <AdminDashboard onBack={onBack} onLogout={logout} />
  }

  return (
    <div className="admin-login">
      <h2>Admin Login</h2>
      <form onSubmit={login} className="admin-login-form">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <p className="admin-login-error">{error}</p>}
        <button type="submit" className="btn">Login</button>
        <button type="button" onClick={onBack} className="btn secondary">Back</button>
      </form>
    </div>
  )
}

export default Admin

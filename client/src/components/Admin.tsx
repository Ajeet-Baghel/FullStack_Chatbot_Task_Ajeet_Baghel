import { useState, FormEvent } from 'react'
import './Admin.css'
import AdminDashboard from './AdminDashboard'

function Admin({ onBack }: { onBack: () => void }) {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const login = (e: FormEvent) => {
    e.preventDefault()
    if (password === 'admin') {
      setAuthed(true)
      setError('')
    } else {
      setError('Invalid password')
    }
  }

  if (authed) {
    return <AdminDashboard onBack={onBack} />
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

import { useEffect, useState, FormEvent } from 'react'
import { apiFetch } from '../api'
import './Admin.css'

type Enquiry = {
  id: number
  name: string
  email: string
  phone: string
  user_type: string
  interest: string
  message: string
  status: string
  created_at: string
  updated_at: string
}

const userTypes = ['All', 'Student', 'Customer', 'Other']
const statuses = ['New', 'Contacted', 'In Progress', 'Closed']

function AdminDashboard({ onBack, onLogout }: { onBack: () => void; onLogout: () => void }) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [selected, setSelected] = useState<Enquiry | null>(null)
  const [newStatus, setNewStatus] = useState('')

  const fetchEnquiries = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await apiFetch('/api/enquiries')
      if (res.status === 401) {
        onLogout()
        return
      }
      if (!res.ok) throw new Error('Failed to load enquiries')
      const data: Enquiry[] = await res.json()
      setEnquiries(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEnquiries()
  }, [])

  const filtered = enquiries.filter(e => {
    const q = search.toLowerCase()
    const matchesSearch =
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.message.toLowerCase().includes(q)
    const matchesType = filterType === 'All' || e.user_type === filterType
    return matchesSearch && matchesType
  })

  const openDetail = (enq: Enquiry) => {
    setSelected(enq)
    setNewStatus(enq.status)
  }

  const updateStatus = async (e: FormEvent) => {
    e.preventDefault()
    if (!selected) return
    const body = { ...selected, status: newStatus }
    try {
      const res = await apiFetch(`/api/enquiries/${selected.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (res.status === 401) {
        onLogout()
        return
      }
      if (!res.ok) throw new Error('Update failed')
      setSelected(null)
      await fetchEnquiries()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const deleteEnquiry = async (id: number) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return
    try {
      const res = await apiFetch(`/api/enquiries/${id}`, { method: 'DELETE' })
      if (res.status === 401) {
        onLogout()
        return
      }
      if (!res.ok) throw new Error('Delete failed')
      setSelected(null)
      await fetchEnquiries()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div className="admin">
      <header className="admin-header">
        <h2>Admin Dashboard</h2>
        <div className="admin-actions">
          <button onClick={onBack} className="btn small">Back to site</button>
          <button onClick={onLogout} className="btn small secondary">Logout</button>
        </div>
      </header>

      <div className="admin-toolbar">
        <input
          type="text"
          placeholder="Search by name, email, or message"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="admin-search"
        />
        <select value={filterType} onChange={e => setFilterType(e.target.value)}>
          {userTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button onClick={fetchEnquiries} className="btn small">Refresh</button>
      </div>

      {error && <p className="admin-error">{error}</p>}
      {loading && <p className="admin-loading">Loading enquiries...</p>}

      {!loading && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Type</th>
              <th>Interest</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(enq => (
              <tr key={enq.id} onClick={() => openDetail(enq)} className="admin-row">
                <td>{enq.id}</td>
                <td>{enq.name}</td>
                <td>{enq.email}</td>
                <td>{enq.user_type}</td>
                <td>{enq.interest}</td>
                <td>{enq.status}</td>
                <td>{new Date(enq.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && filtered.length === 0 && <p className="admin-empty">No enquiries found.</p>}

      {selected && (
        <div className="admin-modal-backdrop" onClick={() => setSelected(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>Enquiry #{selected.id}</h3>
            <div className="admin-detail">
              <p><strong>Name:</strong> {selected.name}</p>
              <p><strong>Email:</strong> {selected.email}</p>
              <p><strong>Phone:</strong> {selected.phone}</p>
              <p><strong>Type:</strong> {selected.user_type}</p>
              <p><strong>Interest:</strong> {selected.interest}</p>
              <p><strong>Message:</strong> {selected.message}</p>
              <p><strong>Created:</strong> {new Date(selected.created_at).toLocaleString()}</p>
              <p><strong>Updated:</strong> {new Date(selected.updated_at).toLocaleString()}</p>
            </div>

            <form onSubmit={updateStatus} className="admin-status-form">
              <label>Status</label>
              <select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button type="submit" className="btn small">Update status</button>
            </form>

            <div className="admin-actions">
              <button onClick={() => deleteEnquiry(selected.id)} className="btn small danger">Delete</button>
              <button onClick={() => setSelected(null)} className="btn small secondary">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard

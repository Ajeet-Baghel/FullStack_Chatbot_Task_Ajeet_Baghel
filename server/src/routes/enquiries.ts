import { Router } from 'express'
import pool from '../db.js'

const router = Router()

const validUserTypes = ['Student', 'Customer', 'Other']
const validStatuses = ['New', 'Contacted', 'In Progress', 'Closed']

const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const toEnquiry = (row: any) => ({
  id: row.id,
  name: escapeHtml(row.name),
  email: escapeHtml(row.email),
  phone: escapeHtml(row.phone),
  user_type: escapeHtml(row.user_type),
  interest: escapeHtml(row.interest),
  message: escapeHtml(row.message),
  status: row.status,
  created_at: row.created_at,
  updated_at: row.updated_at
})

const validate = (data: any, forUpdate = false): string => {
  const { name, email, phone, user_type, interest, message, status } = data
  if (!name || !email || !phone || !user_type || !interest || !message) {
    return 'All required fields must be filled.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Invalid email format.'
  }
  if (!/^\d{10}$/.test(phone)) {
    return 'Phone number must be 10 digits.'
  }
  if (!validUserTypes.includes(user_type)) {
    return 'Invalid user type.'
  }
  if (forUpdate && status && !validStatuses.includes(status)) {
    return 'Invalid status.'
  }
  return ''
}

router.get('/', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM enquiries ORDER BY created_at DESC')
    res.json(result.rows.map(toEnquiry))
  } catch (err) {
    console.error('GET /api/enquiries error:', (err as Error).message)
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM enquiries WHERE id = $1', [req.params.id])
    if (!result.rowCount) {
      return res.status(404).json({ message: 'Enquiry not found' })
    }
    res.json(toEnquiry(result.rows[0]))
  } catch (err) {
    console.error('GET /api/enquiries/:id error:', (err as Error).message)
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.post('/', async (req, res) => {
  const error = validate(req.body)
  if (error) {
    return res.status(400).json({ message: error })
  }
  const { name, email, phone, user_type, interest, message } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO enquiries (name, email, phone, user_type, interest, message) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, email, phone, user_type, interest, message]
    )
    res.status(201).json(toEnquiry(result.rows[0]))
  } catch (err) {
    console.error('POST /api/enquiries error:', (err as Error).message)
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.put('/:id', async (req, res) => {
  const error = validate(req.body, true)
  if (error) {
    return res.status(400).json({ message: error })
  }
  const { name, email, phone, user_type, interest, message, status } = req.body
  try {
    const result = await pool.query(
      'UPDATE enquiries SET name = $1, email = $2, phone = $3, user_type = $4, interest = $5, message = $6, status = $7, updated_at = NOW() WHERE id = $8 RETURNING *',
      [name, email, phone, user_type, interest, message, status || 'New', req.params.id]
    )
    if (!result.rowCount) {
      return res.status(404).json({ message: 'Enquiry not found' })
    }
    res.json(toEnquiry(result.rows[0]))
  } catch (err) {
    console.error('PUT /api/enquiries/:id error:', (err as Error).message)
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM enquiries WHERE id = $1 RETURNING *', [req.params.id])
    if (!result.rowCount) {
      return res.status(404).json({ message: 'Enquiry not found' })
    }
    res.json({ message: 'Enquiry deleted' })
  } catch (err) {
    console.error('DELETE /api/enquiries/:id error:', (err as Error).message)
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default router

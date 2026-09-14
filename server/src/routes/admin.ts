import { Router } from 'express'
import { clearAdminSession, hasAdminSession, setAdminSession, verifyAdminPassword } from '../auth.js'

const router = Router()

router.get('/session', (req, res) => {
  res.json({ authenticated: hasAdminSession(req) })
})

router.post('/login', (req, res) => {
  const password = typeof req.body?.password === 'string' ? req.body.password : ''
  if (!password) {
    return res.status(400).json({ message: 'Password is required' })
  }

  try {
    if (!verifyAdminPassword(password)) {
      return res.status(401).json({ message: 'Invalid password' })
    }
    setAdminSession(res)
    res.json({ authenticated: true })
  } catch (err) {
    console.error('POST /api/admin/login error:', (err as Error).message)
    res.status(500).json({ message: 'Admin authentication is not configured' })
  }
})

router.post('/logout', (_req, res) => {
  clearAdminSession(res)
  res.json({ authenticated: false })
})

export default router

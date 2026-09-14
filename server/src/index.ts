import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { testConnection } from './db.js'
import adminRoutes from './routes/admin.js'
import enquiryRoutes from './routes/enquiries.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim().replace(/\/$/, ''))
  .filter(Boolean)

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
      return
    }
    callback(new Error('Origin is not allowed by CORS'))
  },
  credentials: true
}))
app.use(express.json())

app.use('/api/admin', adminRoutes)
app.use('/api/enquiries', enquiryRoutes)

app.get('/api/health', async (_req, res) => {
  try {
    await testConnection()
    res.json({ status: 'ok', database: 'connected' })
  } catch {
    res.status(500).json({ status: 'error', database: 'disconnected' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

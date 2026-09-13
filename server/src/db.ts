import pg from 'pg'
import dotenv from 'dotenv'

const { Pool } = pg
dotenv.config()

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT) || 5432,
})

export async function testConnection(): Promise<void> {
  try {
    const client = await pool.connect()
    const res = await client.query('SELECT NOW()')
    console.log('PostgreSQL connected:', res.rows[0].now)
    client.release()
  } catch (err) {
    console.error('PostgreSQL connection failed:', (err as Error).message)
    throw err
  }
}

export default pool

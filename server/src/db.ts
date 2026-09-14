import pg from 'pg'
import dotenv from 'dotenv'

const { Pool } = pg
dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  user: process.env.DATABASE_URL ? undefined : process.env.PGUSER,
  host: process.env.DATABASE_URL ? undefined : process.env.PGHOST,
  database: process.env.DATABASE_URL ? undefined : process.env.PGDATABASE,
  password: process.env.DATABASE_URL ? undefined : process.env.PGPASSWORD,
  port: process.env.DATABASE_URL ? undefined : Number(process.env.PGPORT) || 5432,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined
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

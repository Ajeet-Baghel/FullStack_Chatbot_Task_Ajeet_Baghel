import { readFile } from 'node:fs/promises'
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

export async function initializeDatabase(): Promise<void> {
  const schemaUrl = new URL('../src/schema.sql', import.meta.url)
  const schema = await readFile(schemaUrl, 'utf8')
  await pool.query(schema)
  console.log('PostgreSQL schema initialized')
}

export async function testConnection(): Promise<void> {
  const client = await pool.connect()
  try {
    const res = await client.query('SELECT NOW()')
    console.log('PostgreSQL connected:', res.rows[0].now)
  } catch (err) {
    console.error('PostgreSQL connection failed:', err)
    throw err
  } finally {
    client.release()
  }
}

export default pool

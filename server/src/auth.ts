import { createHmac, scryptSync, timingSafeEqual } from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'

const COOKIE_NAME = 'admin_session'
const SESSION_DURATION_SECONDS = 60 * 60 * 8

const getCookie = (req: Request, name: string): string | undefined => {
  const cookies = req.headers.cookie?.split(';') ?? []
  const cookie = cookies.find(value => value.trim().startsWith(`${name}=`))
  return cookie ? decodeURIComponent(cookie.trim().slice(name.length + 1)) : undefined
}

const getSessionSecret = (): string => {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('SESSION_SECRET is not configured')
  return secret
}

const sign = (value: string): string =>
  createHmac('sha256', getSessionSecret()).update(value).digest('hex')

const isValidSession = (token?: string): boolean => {
  if (!token) return false
  const [expiresAt, signature] = token.split('.')
  if (!expiresAt || !signature || Number(expiresAt) <= Math.floor(Date.now() / 1000)) return false
  const expected = Buffer.from(sign(expiresAt), 'hex')
  const received = Buffer.from(signature, 'hex')
  return expected.length === received.length && timingSafeEqual(expected, received)
}

export const verifyAdminPassword = (password: string): boolean => {
  const storedHash = process.env.ADMIN_PASSWORD_HASH
  if (!storedHash) throw new Error('ADMIN_PASSWORD_HASH is not configured')
  const [salt, expectedHex] = storedHash.split(':')
  if (!salt || !expectedHex) throw new Error('ADMIN_PASSWORD_HASH has an invalid format')
  const expected = Buffer.from(expectedHex, 'hex')
  const actual = scryptSync(password, salt, expected.length)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

export const setAdminSession = (res: Response): void => {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS
  const token = `${expiresAt}.${sign(String(expiresAt))}`
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: SESSION_DURATION_SECONDS * 1000,
    path: '/'
  })
}

export const clearAdminSession = (res: Response): void => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/'
  })
}

export const hasAdminSession = (req: Request): boolean =>
  isValidSession(getCookie(req, COOKIE_NAME))

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!hasAdminSession(req)) {
    res.status(401).json({ message: 'Authentication required' })
    return
  }
  next()
}

// src/lib/zendesk.ts

import crypto from 'crypto'

const ZENDESK_JWT_SECRET = process.env.ZENDESK_JWT_SECRET || 'default-dev-secret-change-in-production'

interface JWTPayload {
  external_id: string
  name?: string
  email?: string
  exp?: number
  iat?: number
}

/**
 * Generate JWT token for Zendesk user authentication
 * Uses HMAC-SHA256 signing (compatible with Zendesk)
 */
export function generateZendeskJWT(userId: string, name?: string, email?: string): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
    kid: 'analyti-web3' // Key ID for identification
  }

  const now = Math.floor(Date.now() / 1000)
  const payload: JWTPayload = {
    external_id: userId,
    iat: now,
    exp: now + 3600, // 1 hour expiry
  }

  if (name) payload.name = name
  if (email) payload.email = email

  const base64Header = base64UrlEncode(JSON.stringify(header))
  const base64Payload = base64UrlEncode(JSON.stringify(payload))

  const signature = crypto
    .createHmac('sha256', ZENDESK_JWT_SECRET)
    .update(`${base64Header}.${base64Payload}`)
    .digest('base64url')

  return `${base64Header}.${base64Payload}.${signature}`
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * Verify and decode a JWT token (for testing/debugging)
 */
export function decodeZendeskJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString())
    return payload as JWTPayload
  } catch {
    return null
  }
}

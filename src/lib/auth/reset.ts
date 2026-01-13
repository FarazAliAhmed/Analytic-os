import crypto from 'crypto'
import { prisma } from '../prisma'

// Reset token configuration
const RESET_TOKEN_EXPIRY_HOURS = 1

/**
 * Generate a secure reset token
 */
function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Create a password reset record for an email
 */
export async function createPasswordResetToken(email: string): Promise<string> {
  const token = generateResetToken()
  const expires = new Date(
    Date.now() + RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000
  )

  // Delete any existing tokens for this email
  await prisma.passwordResetToken.deleteMany({
    where: { email },
  })

  // Create new token
  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  })

  return token
}

/**
 * Validate a reset token
 */
export async function validateResetToken(
  token: string
): Promise<{ valid: boolean; email?: string; error?: string }> {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  })

  if (!resetToken) {
    return { valid: false, error: 'Invalid reset link' }
  }

  if (resetToken.used) {
    return { valid: false, error: 'This link has already been used' }
  }

  if (new Date() > resetToken.expires) {
    return { valid: false, error: 'This link has expired' }
  }

  return { valid: true, email: resetToken.email }
}

/**
 * Mark a reset token as used
 */
export async function useResetToken(token: string): Promise<void> {
  await prisma.passwordResetToken.update({
    where: { token },
    data: { used: true },
  })
}

/**
 * Check if user can request password reset (rate limiting)
 */
export async function canRequestPasswordReset(
  email: string
): Promise<{ allowed: boolean; delay?: number }> {
  const lastRequest = await prisma.passwordResetToken.findFirst({
    where: { email },
    orderBy: { createdAt: 'desc' },
  })

  if (!lastRequest) {
    return { allowed: true }
  }

  // Check if 60 seconds have passed
  const sixtySecondsAgo = new Date(Date.now() - 60 * 1000)
  if (lastRequest.createdAt < sixtySecondsAgo) {
    return { allowed: true }
  }

  const delay = Math.ceil(
    (lastRequest.createdAt.getTime() - sixtySecondsAgo.getTime()) / 1000
  )

  return { allowed: false, delay }
}

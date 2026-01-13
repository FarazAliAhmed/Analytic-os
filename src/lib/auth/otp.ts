import speakeasy from 'speakeasy'
import { prisma } from '../prisma'

// OTP configuration
const OTP_DIGITS = 6
const OTP_WINDOW = 2 // Allow 2 time steps (20 minutes total)
const OTP_STEP_SECONDS = 600 // 10 minutes per step

/**
 * Generate a new OTP secret for a user
 */
export function generateOTPSecret(): string {
  return speakeasy.generateSecret({
    length: 20,
    name: 'AnalytiOS',
  }).base32
}

/**
 * Generate OTP from secret (for testing/development)
 */
export function generateOTP(secret: string): string {
  const token = speakeasy.totp({
    secret,
    encoding: 'base32',
    digits: OTP_DIGITS,
    step: OTP_STEP_SECONDS,
  })
  return token
}

/**
 * Verify OTP against stored secret
 */
export function verifyOTP(secret: string, token: string): boolean {
  const valid = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    digits: OTP_DIGITS,
    step: OTP_STEP_SECONDS,
    window: OTP_WINDOW,
  })
  return valid
}

/**
 * Store OTP verification token in database
 */
export async function createVerificationToken(
  email: string
): Promise<string> {
  const secret = generateOTPSecret()
  const token = generateOTP(secret)

  // Delete any existing tokens for this email
  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  })

  // Create new token (expires in 10 minutes)
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires: new Date(Date.now() + OTP_STEP_SECONDS * 1000),
    },
  })

  return token
}

/**
 * Verify and consume OTP token
 */
export async function verifyAndConsumeOTP(
  email: string,
  token: string
): Promise<boolean> {
  // Find the stored token
  const storedToken = await prisma.verificationToken.findFirst({
    where: {
      identifier: email,
    },
  })

  if (!storedToken) {
    return false
  }

  // Check if expired
  if (new Date() > storedToken.expires) {
    await prisma.verificationToken.delete({
      where: { id: storedToken.id },
    })
    return false
  }

  // Verify token matches
  if (storedToken.token !== token) {
    return false
  }

  // Delete the used token
  await prisma.verificationToken.delete({
    where: { id: storedToken.id },
  })

  return true
}

/**
 * Check if user can request OTP (rate limiting)
 * For testing: always return true (60-second delay disabled)
 */
export async function canRequestOTP(email: string): Promise<boolean> {
  // Always allow for testing
  return true
}

/**
 * Get remaining time until OTP can be resent (for testing: always 0)
 */
export async function getOTPResendDelay(email: string): Promise<number> {
  return 0
}

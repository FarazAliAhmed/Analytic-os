import bcrypt from 'bcryptjs'

const BCRYPT_ROUNDS = 12

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const hash = await bcrypt.hash(password, BCRYPT_ROUNDS)
  return hash
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const isValid = await bcrypt.compare(password, hash)
  return isValid
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Check if password needs rehashing (e.g., if bcrypt rounds increased)
 */
export async function needsRehash(hash: string): Promise<boolean> {
  return bcrypt.getRounds(hash) !== BCRYPT_ROUNDS
}

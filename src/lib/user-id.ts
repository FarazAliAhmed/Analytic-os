/**
 * Generate a unique alphanumeric user ID
 * Format: ANALYTI-XXXXXX (where X is random alphanumeric)
 */

/**
 * Generate a random alphanumeric string of specified length
 */
function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Generate a unique user ID in ANALYTI-XXXXXX format
 */
export function generateUserId(): string {
  const randomPart = generateRandomString(8)
  return `ANALYTI-${randomPart}`
}

/**
 * Check if a user ID is in valid format
 */
export function isValidUserId(userId: string): boolean {
  return /^ANALYTI-[A-Z0-9]{8}$/i.test(userId)
}

/**
 * Generate a unique alphanumeric user ID
 * Format: Random alphanumeric string (e.g., EWonZrNYsuoR7SAmUACPLdXhSMegaoZpicrgsCAdkeb2)
 * Length: 32 characters for uniqueness
 */

/**
 * Generate a random alphanumeric string of specified length
 * Uses both uppercase, lowercase letters and numbers for better uniqueness
 */
function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Generate a unique user ID as alphanumeric string
 * Length: 32 characters (can be adjusted for shorter IDs)
 */
export function generateUserId(): string {
  return generateRandomString(32)
}

/**
 * Check if a user ID is in valid format
 * Must be alphanumeric and 32 characters long
 */
export function isValidUserId(userId: string): boolean {
  return /^[A-Za-z0-9]{32}$/.test(userId)
}

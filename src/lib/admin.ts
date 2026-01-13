import { prisma } from './prisma'

/**
 * Check if a user has admin role
 * @param userId - The user's ID to check
 * @returns Promise<boolean> - True if user is an admin, false otherwise
 */
export async function isAdmin(userId: string): Promise<boolean> {
  if (!userId) {
    return false
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  })

  return user?.role === 'ADMIN'
}

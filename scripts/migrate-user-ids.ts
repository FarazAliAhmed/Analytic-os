import { PrismaClient } from '@/generated/prisma/client'
import { config } from 'dotenv'

// Load environment variables
config()

const prisma = new PrismaClient()

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
 * Length: 32 characters
 */
function generateUserId(): string {
  return generateRandomString(32)
}

/**
 * Check if userId is in old format (ANALYTI-XXXXXX)
 */
function isOldFormat(userId: string): boolean {
  return /^ANALYTI-[A-Z0-9]{8}$/i.test(userId)
}

async function migrateUserIds() {
  try {
    console.log('Starting User ID migration...\n')

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        userId: true,
        email: true,
      },
    })

    console.log(`Found ${users.length} users to check\n`)

    let migratedCount = 0
    const usedIds = new Set<string>()

    for (const user of users) {
      // Check if user has old format ID
      if (isOldFormat(user.userId)) {
        try {
          // Generate new unique ID
          let newUserId = generateUserId()
          
          // Ensure uniqueness
          while (usedIds.has(newUserId)) {
            newUserId = generateUserId()
          }
          usedIds.add(newUserId)

          // Update user
          await prisma.user.update({
            where: { id: user.id },
            data: { userId: newUserId },
          })

          console.log(`✓ Migrated: ${user.email}`)
          console.log(`  Old: ${user.userId}`)
          console.log(`  New: ${newUserId}`)
          console.log()

          migratedCount++
        } catch (error) {
          console.error(`✗ Failed to migrate ${user.email}:`, error)
          console.log()
        }
      } else {
        console.log(`✓ Skipped: ${user.email} (already new format: ${user.userId})`)
      }
    }

    console.log(`\n✅ Migration complete!`)
    console.log(`   Total users: ${users.length}`)
    console.log(`   Migrated: ${migratedCount}`)
    console.log(`   Skipped: ${users.length - migratedCount}`)
  } catch (error) {
    console.error('❌ Migration error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run migration
migrateUserIds()

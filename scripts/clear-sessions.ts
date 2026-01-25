import { prisma } from '../src/lib/prisma'

async function clearSessions() {
  try {
    console.log('=== Clearing All Sessions ===\n')

    const sessions = await prisma.session.deleteMany({})
    console.log(`✅ Deleted ${sessions.count} sessions`)

    console.log('\nAll sessions cleared. Please refresh your browser.')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearSessions()

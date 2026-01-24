import { prisma } from '../src/lib/prisma'

async function addLogosToTokens() {
  try {
    console.log('Adding logos to existing tokens...\n')

    const logoUpdates = [
      {
        symbol: 'FMY',
        logoUrl: 'https://ui-avatars.com/api/?name=FMY&background=4F46E5&color=fff&bold=true&size=128',
      },
      {
        symbol: 'ABMFB',
        logoUrl: 'https://ui-avatars.com/api/?name=ABMFB&background=7C3AED&color=fff&bold=true&size=128',
      },
      {
        symbol: 'FCMB',
        logoUrl: 'https://ui-avatars.com/api/?name=FCMB&background=2563EB&color=fff&bold=true&size=128',
      },
      {
        symbol: 'NOMBA',
        logoUrl: 'https://ui-avatars.com/api/?name=NOMBA&background=059669&color=fff&bold=true&size=128',
      },
      {
        symbol: 'OPAY',
        logoUrl: 'https://ui-avatars.com/api/?name=OPAY&background=DC2626&color=fff&bold=true&size=128',
      },
    ]

    for (const update of logoUpdates) {
      const token = await prisma.token.update({
        where: { symbol: update.symbol },
        data: { logoUrl: update.logoUrl }
      })
      
      console.log(`✅ Updated ${token.symbol} with logo`)
    }

    console.log('\n✅ All logos added successfully!')
  } catch (error) {
    console.error('❌ Error adding logos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addLogosToTokens()

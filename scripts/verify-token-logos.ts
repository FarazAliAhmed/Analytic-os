import { prisma } from '../src/lib/prisma'

async function verifyTokenLogos() {
  try {
    console.log('Verifying token logos...\n')

    const tokens = await prisma.token.findMany({
      select: {
        symbol: true,
        name: true,
        logoUrl: true,
      },
      orderBy: {
        symbol: 'asc'
      }
    })

    console.log(`Found ${tokens.length} tokens:\n`)

    tokens.forEach(token => {
      const hasLogo = token.logoUrl ? '✅' : '❌'
      console.log(`${hasLogo} ${token.symbol} - ${token.name}`)
      if (token.logoUrl) {
        console.log(`   Logo: ${token.logoUrl}`)
      }
      console.log('')
    })

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyTokenLogos()

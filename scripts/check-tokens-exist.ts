import { PrismaClient } from '@/generated/prisma/client'
import { config } from 'dotenv'

config()

const prisma = new PrismaClient()

async function checkTokens() {
  try {
    const tokens = await prisma.token.findMany({
      select: {
        id: true,
        symbol: true,
        name: true,
        price: true,
        isActive: true,
      },
    })

    console.log(`Found ${tokens.length} tokens in database:`)
    tokens.forEach((token) => {
      console.log(`- ${token.symbol} (${token.name}): ₦${token.price / 100} - Active: ${token.isActive}`)
    })

    if (tokens.length === 0) {
      console.log('\n⚠️  No tokens found in database!')
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkTokens()

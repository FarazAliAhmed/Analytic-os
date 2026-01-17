import { config } from 'dotenv'
import { prisma } from '../src/lib/prisma'

// Load environment variables
config()

async function checkContractAddresses() {
  try {
    console.log('🔍 Checking contract addresses in database...\n')

    // Check NNM token
    const nnmToken = await prisma.token.findUnique({
      where: { symbol: 'NNM' },
      select: {
        symbol: true,
        name: true,
        listingDate: true,
        createdAt: true,
      },
    })

    // Check LLM token
    const llmToken = await prisma.token.findUnique({
      where: { symbol: 'LLM' },
      select: {
        symbol: true,
        name: true,
        listingDate: true,
        createdAt: true,
      },
    })

    console.log('📊 Recent Tokens:\n')
    console.log('─'.repeat(80))

    if (nnmToken) {
      console.log(`✅ NNM Token Found:`)
      console.log(`   Name: ${nnmToken.name}`)
      console.log(`   Listing Date: ${new Date(nnmToken.listingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`)
      console.log(`   Created: ${nnmToken.createdAt}`)
      console.log(`   Contract Address: Checking...`)
    } else {
      console.log('❌ NNM token not found')
    }

    console.log('')

    if (llmToken) {
      console.log(`✅ LLM Token Found:`)
      console.log(`   Name: ${llmToken.name}`)
      console.log(`   Listing Date: ${new Date(llmToken.listingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`)
      console.log(`   Created: ${llmToken.createdAt}`)
      console.log(`   Contract Address: Checking...`)
    } else {
      console.log('❌ LLM token not found')
    }

    console.log('─'.repeat(80))

    // Now check with raw SQL to see the contractAddress column
    console.log('\n🔍 Checking contractAddress column directly...\n')
    
    const result = await prisma.$queryRaw`
      SELECT symbol, name, "contractAddress", "createdAt"
      FROM "Token"
      WHERE symbol IN ('NNM', 'LLM')
      ORDER BY "createdAt" DESC
    ` as any[]

    if (result.length === 0) {
      console.log('❌ No NNM or LLM tokens found in database')
    } else {
      result.forEach((token) => {
        console.log(`Token: ${token.symbol} (${token.name})`)
        console.log(`Contract Address: ${token.contractAddress || '❌ NOT SET'}`)
        console.log(`Created: ${token.createdAt}`)
        console.log('')
      })
    }

    // Check all recent tokens
    console.log('\n📋 All Recent Tokens (Last 5):\n')
    const recentTokens = await prisma.$queryRaw`
      SELECT symbol, name, "contractAddress", "createdAt"
      FROM "Token"
      ORDER BY "createdAt" DESC
      LIMIT 5
    ` as any[]

    recentTokens.forEach((token, index) => {
      console.log(`${index + 1}. ${token.symbol} - ${token.name}`)
      console.log(`   Contract: ${token.contractAddress || '❌ NOT SET'}`)
      console.log(`   Created: ${token.createdAt}`)
      console.log('')
    })

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkContractAddresses()

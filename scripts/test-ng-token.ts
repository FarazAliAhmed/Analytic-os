import { config } from 'dotenv'
import { prisma } from '../src/lib/prisma'

// Load environment variables
config()

async function testNGToken() {
  try {
    console.log('🔍 Checking NG token in database...\n')

    const ngToken = await prisma.$queryRaw`
      SELECT 
        symbol, 
        name, 
        price,
        "annualYield",
        volume,
        "transactionCount",
        "listingDate",
        "contractAddress",
        "createdAt"
      FROM "Token"
      WHERE symbol = 'NG'
    ` as any[]

    if (ngToken.length === 0) {
      console.log('❌ NG token not found in database')
      return
    }

    const token = ngToken[0]
    console.log('✅ NG Token Found!\n')
    console.log('─'.repeat(80))
    console.log(`Symbol: ${token.symbol}`)
    console.log(`Name: ${token.name}`)
    console.log(`Price: ₦${(token.price / 100).toLocaleString('en-NG')} (${token.price} kobo)`)
    console.log(`Annual Yield: ${token.annualYield}%`)
    console.log(`Volume: ₦${(token.volume / 100).toLocaleString('en-NG')} (${token.volume} kobo)`)
    console.log(`Transaction Count: ${token.transactionCount}`)
    console.log(`Market Cap (calculated): ₦${((token.price / 100) * (token.transactionCount || 1)).toLocaleString('en-NG')}`)
    console.log(`TSPv (calculated): ₦${((token.volume / 100) * 0.01).toLocaleString('en-NG')}`)
    console.log(`Date of Listing: ${new Date(token.listingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`)
    console.log(`Contract Address: ${token.contractAddress || 'NOT SET'}`)
    console.log(`Created: ${token.createdAt}`)
    console.log('─'.repeat(80))

    console.log('\n📊 What the API should return:\n')
    console.log(JSON.stringify({
      symbol: token.symbol,
      name: token.name,
      price: token.price,
      annualYield: Number(token.annualYield),
      volume: token.volume,
      transactionCount: token.transactionCount,
      listingDate: token.listingDate,
      contractAddress: token.contractAddress,
    }, null, 2))

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testNGToken()

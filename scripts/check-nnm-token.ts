import { config } from 'dotenv'
import { prisma } from '../src/lib/prisma'

// Load environment variables
config()

async function checkNNMToken() {
  try {
    console.log('🔍 Checking NNM token in database...\n')

    const nnmToken = await prisma.token.findUnique({
      where: { symbol: 'NNM' },
    })

    if (!nnmToken) {
      console.log('❌ NNM token not found in database!')
      return
    }

    console.log('✅ NNM Token Found!\n')
    console.log('─'.repeat(60))
    console.log(`ID: ${nnmToken.id}`)
    console.log(`Token ID: ${nnmToken.tokenId || 'Not set'}`)
    console.log(`Name: ${nnmToken.name}`)
    console.log(`Symbol: ${nnmToken.symbol}`)
    console.log(`Price: ₦${(nnmToken.price / 100).toLocaleString('en-NG')}`)
    console.log(`Annual Yield: ${nnmToken.annualYield}%`)
    console.log(`Volume: ₦${(nnmToken.volume / 100).toLocaleString('en-NG')}`)
    console.log(`Transaction Count: ${nnmToken.transactionCount}`)
    console.log(`Date of Listing: ${new Date(nnmToken.listingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`)
    console.log(`Contract Address: ${nnmToken.contractAddress || 'Not set'}`)
    console.log(`Investment Type: ${nnmToken.investmentType}`)
    console.log(`Payout Frequency: ${nnmToken.payoutFrequency}`)
    console.log(`Risk Level: ${nnmToken.riskLevel}`)
    console.log(`Industry: ${nnmToken.industry}`)
    console.log(`Employee Count: ${nnmToken.employeeCount}`)
    console.log(`Minimum Investment: ₦${(nnmToken.minimumInvestment / 100).toLocaleString('en-NG')}`)
    console.log(`Is Active: ${nnmToken.isActive}`)
    console.log(`Created At: ${nnmToken.createdAt}`)
    console.log('─'.repeat(60))

    // Check all tokens to see if there's confusion
    console.log('\n📊 All Active Tokens:\n')
    const allTokens = await prisma.token.findMany({
      where: { isActive: true },
      select: {
        symbol: true,
        name: true,
        listingDate: true,
        contractAddress: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    allTokens.forEach((token, index) => {
      console.log(`${index + 1}. ${token.symbol} - ${token.name}`)
      console.log(`   Listing: ${new Date(token.listingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`)
      console.log(`   Contract: ${token.contractAddress || 'Not set'}`)
      console.log('')
    })

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkNNMToken()

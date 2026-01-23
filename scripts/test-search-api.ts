import { prisma } from '@/lib/prisma'

async function testSearch() {
  console.log('🔍 Testing Search Functionality\n')

  // Test 1: Check if tokens exist
  console.log('1. Checking all tokens in database...')
  const allTokens = await prisma.token.findMany({
    select: {
      symbol: true,
      name: true,
      isActive: true
    }
  })
  console.log(`   Found ${allTokens.length} tokens:`)
  allTokens.forEach(t => console.log(`   - ${t.symbol} (${t.name}) - Active: ${t.isActive}`))

  // Test 2: Search for "sd"
  console.log('\n2. Searching for "sd"...')
  const sdResults = await prisma.token.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: 'sd', mode: 'insensitive' } },
        { symbol: { contains: 'sd', mode: 'insensitive' } },
        { industry: { contains: 'sd', mode: 'insensitive' } },
      ]
    }
  })
  console.log(`   Found ${sdResults.length} results:`)
  sdResults.forEach(t => console.log(`   - ${t.symbol} (${t.name})`))

  // Test 3: Check inactive tokens
  console.log('\n3. Checking inactive tokens...')
  const inactiveTokens = await prisma.token.findMany({
    where: { isActive: false },
    select: { symbol: true, name: true }
  })
  if (inactiveTokens.length > 0) {
    console.log(`   ⚠️  Found ${inactiveTokens.length} inactive tokens:`)
    inactiveTokens.forEach(t => console.log(`   - ${t.symbol} (${t.name})`))
  } else {
    console.log('   ✅ All tokens are active')
  }

  // Test 4: Activate all tokens
  console.log('\n4. Activating all tokens...')
  const result = await prisma.token.updateMany({
    where: { isActive: false },
    data: { isActive: true }
  })
  console.log(`   ✅ Activated ${result.count} tokens`)

  // Test 5: Search again
  console.log('\n5. Searching for "sd" again...')
  const sdResults2 = await prisma.token.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: 'sd', mode: 'insensitive' } },
        { symbol: { contains: 'sd', mode: 'insensitive' } },
        { industry: { contains: 'sd', mode: 'insensitive' } },
      ]
    }
  })
  console.log(`   Found ${sdResults2.length} results:`)
  sdResults2.forEach(t => console.log(`   - ${t.symbol} (${t.name})`))

  console.log('\n✅ Search test complete!')
}

testSearch()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
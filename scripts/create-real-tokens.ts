import { prisma } from '../src/lib/prisma'

async function createRealTokens() {
  try {
    console.log('Creating real tokens...\n')

    const tokens = [
      {
        symbol: 'FMY',
        name: 'Fairmoney Microfinance Bank Limited',
        price: 278000, // ₦2,780 in kobo
        annualYield: 18.00,
        industry: 'Banking',
        investmentType: 'Fixed income',
        riskLevel: 'Medium',
        payoutFrequency: 'Monthly',
        minimumInvestment: 150000, // ₦1,500 minimum
        employeeCount: 100,
        description: 'Fairmoney Microfinance Bank Limited offers fixed income investment opportunities with competitive yields.',
        listingDate: new Date('2026-01-18'),
        isActive: true,
        logoUrl: 'https://ui-avatars.com/api/?name=FMY&background=4F46E5&color=fff&bold=true&size=128',
      },
      {
        symbol: 'ABMFB',
        name: 'AB Microfinance Bank Limited',
        price: 380000, // ₦3,800 in kobo
        annualYield: 23.00,
        industry: 'Banking',
        investmentType: 'Fixed income',
        riskLevel: 'High',
        payoutFrequency: 'Monthly',
        minimumInvestment: 150000,
        employeeCount: 80,
        description: 'AB Microfinance Bank Limited provides high-yield fixed income investment products.',
        listingDate: new Date('2026-01-18'),
        isActive: true,
        logoUrl: 'https://ui-avatars.com/api/?name=ABMFB&background=7C3AED&color=fff&bold=true&size=128',
      },
      {
        symbol: 'FCMB',
        name: 'First City Monument Bank',
        price: 125000, // ₦1,250 in kobo
        annualYield: 15.00,
        industry: 'Banking',
        investmentType: 'Fixed income',
        riskLevel: 'Low',
        payoutFrequency: 'Monthly',
        minimumInvestment: 150000,
        employeeCount: 5000,
        description: 'First City Monument Bank is a leading commercial bank offering secure fixed income investments.',
        listingDate: new Date('2026-01-18'),
        isActive: true,
        logoUrl: 'https://ui-avatars.com/api/?name=FCMB&background=2563EB&color=fff&bold=true&size=128',
      },
      {
        symbol: 'NOMBA',
        name: 'Nomba MFB Limited',
        price: 168000, // ₦1,680 in kobo
        annualYield: 16.00,
        industry: 'Fintech',
        investmentType: 'Fixed income',
        riskLevel: 'Medium',
        payoutFrequency: 'Monthly',
        minimumInvestment: 150000,
        employeeCount: 200,
        description: 'Nomba MFB Limited is a fintech-focused microfinance bank providing innovative investment solutions.',
        listingDate: new Date('2026-01-18'),
        isActive: true,
        logoUrl: 'https://ui-avatars.com/api/?name=NOMBA&background=059669&color=fff&bold=true&size=128',
      },
      {
        symbol: 'OPAY',
        name: 'Opay Digital Service Limited',
        price: 108000, // ₦1,080 in kobo
        annualYield: 23.00,
        industry: 'Fintech',
        investmentType: 'Fixed income',
        riskLevel: 'Low',
        payoutFrequency: 'Monthly',
        minimumInvestment: 150000,
        employeeCount: 1000,
        description: 'Opay Digital Service Limited offers digital financial services with attractive fixed income returns.',
        listingDate: new Date('2026-01-18'),
        isActive: true,
        logoUrl: 'https://ui-avatars.com/api/?name=OPAY&background=DC2626&color=fff&bold=true&size=128',
      },
    ]

    for (const tokenData of tokens) {
      const token = await prisma.token.create({
        data: tokenData
      })
      
      console.log(`✅ Created: ${token.symbol} - ${token.name}`)
      console.log(`   Price: ₦${(token.price / 100).toLocaleString()}`)
      console.log(`   Yield: ${token.annualYield}%`)
      console.log(`   Industry: ${token.industry}`)
      console.log(`   Risk: ${token.riskLevel}`)
      console.log('')
    }

    console.log('✅ All 5 tokens created successfully!')
  } catch (error) {
    console.error('❌ Error creating tokens:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createRealTokens()

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface TokenResponse {
  id: string
  tokenId: string | null
  name: string
  symbol: string
  price: number
  annualYield: number
  industry: string
  payoutFrequency: string
  investmentType: string
  riskLevel: string
  listingDate: string
  closeDate: string | null
  logoUrl: string | null
  minimumInvestment: number
  employeeCount: number
  description: string | null
  volume: number
  transactionCount: number
}

function formatTokenResponse(token: any): TokenResponse {
  return {
    id: token.id,
    tokenId: token.tokenId,
    name: token.name,
    symbol: token.symbol,
    price: token.price,
    annualYield: Number(token.annualYield),
    industry: token.industry,
    payoutFrequency: token.payoutFrequency,
    investmentType: token.investmentType,
    riskLevel: token.riskLevel,
    listingDate: token.listingDate.toISOString(),
    closeDate: token.closeDate?.toISOString() || null,
    logoUrl: token.logoUrl || null,
    minimumInvestment: token.minimumInvestment,
    employeeCount: token.employeeCount,
    description: token.description || null,
    volume: token.volume || 0,
    transactionCount: token.transactionCount || 0,
  }
}

/**
 * GET /api/tokens - List all active tokens (public)
 */
export async function GET() {
  try {
    const tokens = await prisma.token.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      tokens: tokens.map(formatTokenResponse),
      count: tokens.length,
    })
  } catch (error) {
    console.error('List tokens error:', error)
    return NextResponse.json({ error: 'Failed to list tokens' }, { status: 500 })
  }
}

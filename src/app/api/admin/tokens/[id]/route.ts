import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const updateTokenSchema = z.object({
  name: z.string().min(1).optional(),
  price: z.number().min(1).optional(),
  annualYield: z.number().min(0).max(100).optional(),
  industry: z.string().min(1).optional(),
  payoutFrequency: z.string().min(1).optional(),
  investmentType: z.string().min(1).optional(),
  riskLevel: z.string().min(1).optional(),
  listingDate: z.string().optional().transform((str) => (str ? new Date(str) : undefined)),
  closeDate: z.string().optional().transform((str) => (str ? new Date(str) : null)),
  logoUrl: z.string().url().optional().or(z.literal('')),
  minimumInvestment: z.number().min(1).optional(),
  employeeCount: z.number().int().min(0).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  volume: z.number().int().min(0).optional(),
  transactionCount: z.number().int().min(0).optional(),
})

type UpdateTokenInput = z.infer<typeof updateTokenSchema>

function formatTokenResponse(token: any) {
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
    isActive: token.isActive,
    createdAt: token.createdAt.toISOString(),
  }
}

/**
 * GET /api/admin/tokens/[id] - Get single token (admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    // Dev bypass: skip auth in development
    if (!session?.user?.id && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const token = await prisma.token.findUnique({
      where: { id },
    })

    if (!token) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      token: formatTokenResponse(token),
    })
  } catch (error) {
    console.error('Get token error:', error)
    return NextResponse.json({ error: 'Failed to get token' }, { status: 500 })
  }
}

/**
 * PUT /api/admin/tokens/[id] - Update token (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    // Dev bypass: skip auth in development
    if (!session?.user?.id && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const data: UpdateTokenInput = updateTokenSchema.parse(body)

    const existing = await prisma.token.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 })
    }

    const token = await prisma.token.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.price && { price: data.price }),
        ...(data.annualYield !== undefined && { annualYield: data.annualYield }),
        ...(data.industry && { industry: data.industry }),
        ...(data.payoutFrequency && { payoutFrequency: data.payoutFrequency }),
        ...(data.investmentType && { investmentType: data.investmentType }),
        ...(data.riskLevel && { riskLevel: data.riskLevel }),
        ...(data.listingDate !== undefined && { listingDate: data.listingDate }),
        ...(data.closeDate !== undefined && { closeDate: data.closeDate }),
        ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl || null }),
        ...(data.minimumInvestment && { minimumInvestment: data.minimumInvestment }),
        ...(data.employeeCount && { employeeCount: data.employeeCount }),
        ...(data.description !== undefined && { description: data.description || null }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.volume !== undefined && { volume: data.volume }),
        ...(data.transactionCount !== undefined && { transactionCount: data.transactionCount }),
      },
    })

    return NextResponse.json({
      success: true,
      token: formatTokenResponse(token),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Update token error:', error)
    return NextResponse.json({ error: 'Failed to update token' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/tokens/[id] - Delete token (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    // Dev bypass: skip auth in development
    if (!session?.user?.id && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const existing = await prisma.token.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 })
    }

    // Soft delete - just mark as inactive
    await prisma.token.update({
      where: { id },
      data: { isActive: false },
    })

    return NextResponse.json({
      success: true,
      message: 'Token deactivated successfully',
    })
  } catch (error) {
    console.error('Delete token error:', error)
    return NextResponse.json({ error: 'Failed to delete token' }, { status: 500 })
  }
}

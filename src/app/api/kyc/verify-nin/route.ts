// src/app/api/kyc/verify-nin/route.ts
// QoreID NIN-only KYC verification endpoint

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { verifyNIN } from '@/lib/qoreid'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { nin, firstname, lastname } = await request.json()

    if (!nin || !firstname || !lastname) {
      return NextResponse.json(
        { error: 'NIN, first name and last name are required' },
        { status: 400 }
      )
    }

    if (!/^\d{11}$/.test(nin)) {
      return NextResponse.json(
        { error: 'NIN must be exactly 11 digits' },
        { status: 400 }
      )
    }

    // Check if already verified
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { kycStatus: true },
    })

    if (user?.kycStatus === 'verified') {
      return NextResponse.json({ success: true, message: 'Already verified' })
    }

    console.log(`[KYC-NIN] Verifying NIN for user ${session.user.id}`)

    // Call QoreID
    const result = await verifyNIN(nin, firstname, lastname)

    if (result.verified) {
      // Mark user as KYC verified in DB
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          kycStatus: 'verified',
          kycProvider: 'qoreid',
          kycVerifiedAt: new Date(),
          nin,
          idType: 'NIN',
          // Store name from NIN record if available
          ...(result.firstname && { firstName: result.firstname }),
          ...(result.lastname && { lastName: result.lastname }),
        },
      })

      // Notify user
      await prisma.notification.create({
        data: {
          userId: session.user.id,
          type: 'alert',
          title: 'Identity Verified',
          message: 'Your NIN has been verified successfully. You can now withdraw funds.',
        },
      })

      console.log(`[KYC-NIN] User ${session.user.id} verified successfully`)

      return NextResponse.json({
        success: true,
        verified: true,
        message: 'NIN verified successfully',
      })
    } else {
      // Update status to rejected
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          kycStatus: 'rejected',
          kycProvider: 'qoreid',
          kycRejectionReason: `NIN verification failed: ${result.rawStatus || 'no match'}`,
        },
      })

      console.log(`[KYC-NIN] Verification failed for user ${session.user.id}: ${result.rawStatus}`)

      return NextResponse.json(
        {
          success: false,
          verified: false,
          error: 'NIN could not be verified. Please check your details and try again.',
        },
        { status: 422 }
      )
    }
  } catch (error: any) {
    console.error('[KYC-NIN] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Verification failed. Please try again.' },
      { status: 500 }
    )
  }
}

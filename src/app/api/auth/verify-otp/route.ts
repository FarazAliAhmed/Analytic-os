import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyAndConsumeOTP } from '@/lib/auth/otp'

const verifyOTPSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  token: z.string().length(6, 'Please enter the 6-digit code'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, token } = verifyOTPSchema.parse(body)

    // Verify OTP
    const isValid = await verifyAndConsumeOTP(email, token)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code. Please try again.' },
        { status: 400 }
      )
    }

    // Mark email as verified
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    })

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

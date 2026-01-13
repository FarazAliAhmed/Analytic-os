import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createVerificationToken, canRequestOTP } from '@/lib/auth/otp'
import { sendOTPEmail } from '@/lib/auth/email'



// Rate limiting: max 10 OTP requests per hour per email (increased for testing)
const MAX_OTP_PER_HOUR = 10

const sendOTPSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = sendOTPSchema.parse(body)

    // Check rate limit
    const countLastHour = await prisma.verificationToken.count({
      where: {
        identifier: email,
        expires: {
          gt: new Date(),
        },
      },
    })

    if (countLastHour >= MAX_OTP_PER_HOUR) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Check if can request (60 second delay between requests)
    const canRequest = await canRequestOTP(email)
    if (!canRequest) {
      return NextResponse.json(
        { error: 'Please wait 60 seconds before requesting a new code' },
        { status: 429 }
      )
    }

    // Generate and store OTP
    const otp = await createVerificationToken(email)

    // Send OTP via email (skip in development for local testing)
    if (process.env.NODE_ENV !== 'development') {
      const emailSent = await sendOTPEmail(email, otp)
      if (!emailSent) {
        return NextResponse.json(
          { error: 'Failed to send verification code. Please try again.' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent',
      // In development, return OTP for testing
      ...(process.env.NODE_ENV === 'development' && { otp }),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

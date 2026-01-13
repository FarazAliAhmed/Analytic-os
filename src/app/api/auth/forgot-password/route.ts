import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import {
  createPasswordResetToken,
  canRequestPasswordReset,
} from '@/lib/auth/reset'
import { sendPasswordResetEmail } from '@/lib/auth/email'

// Rate limiting: max 3 reset requests per hour per email
const MAX_REQUESTS_PER_HOUR = 3

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = forgotPasswordSchema.parse(body)

    // Check if user exists with this email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal if email exists
      return NextResponse.json({
        success: true,
        message: 'If an account exists, a reset link has been sent',
      })
    }

    // Check rate limit
    const countLastHour = await prisma.passwordResetToken.count({
      where: {
        email,
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000),
        },
      },
    })

    if (countLastHour >= MAX_REQUESTS_PER_HOUR) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Check 60 second delay
    const { allowed, delay } = await canRequestPasswordReset(email)
    if (!allowed && delay) {
      return NextResponse.json(
        { error: `Please wait ${delay} seconds before requesting again` },
        { status: 429 }
      )
    }

    // Create reset token
    const token = await createPasswordResetToken(email)

    // Build reset link
    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`

    // Send reset email
    const emailSent = await sendPasswordResetEmail(email, resetLink)

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send reset link. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists, a reset link has been sent',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import {
  validateResetToken,
  useResetToken,
} from '@/lib/auth/reset'
import { hashPassword } from '@/lib/auth/password'
import { sendPasswordChangeConfirmation } from '@/lib/auth/email'



const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = resetPasswordSchema.parse(body)

    // Validate token
    const validation = await validateResetToken(data.token)

    if (!validation.valid || !validation.email) {
      return NextResponse.json(
        { error: validation.error || 'Invalid reset link' },
        { status: 400 }
      )
    }

    // Hash new password
    const passwordHash = await hashPassword(data.password)

    // Update user's password
    await prisma.user.update({
      where: { email: validation.email },
      data: { passwordHash },
    })

    // Mark token as used
    await useResetToken(data.token)

    // Invalidate all existing sessions (logout everywhere)
    await prisma.session.deleteMany({
      where: { user: { email: validation.email } },
    })

    // Send confirmation email
    sendPasswordChangeConfirmation(validation.email).catch(console.error)

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. You can now sign in with your new password.',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

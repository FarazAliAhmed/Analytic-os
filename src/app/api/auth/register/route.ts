import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth/password'
import { sendWelcomeEmail } from '@/lib/auth/email'
import { createReservedAccount } from '@/lib/monnify'
import { generateUserId } from '@/lib/user-id'

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['USER', 'INVESTOR', 'ADMIN']).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = registerSchema.parse(body)

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingEmail) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      )
    }

    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username: data.username },
    })

    if (existingUsername) {
      return NextResponse.json(
        { error: 'This username is already taken' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(data.password)

    // Generate unique user ID
    const userId = generateUserId()

    // Create user (auto-verified - OTP disabled temporarily)
    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        userId: userId,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || null,
        passwordHash,
        emailVerified: new Date(), // Auto-verify user
        role: data.role || 'USER',
      },
    })

    // Auto-create NGN wallet with Monnify reserved account
    let wallet = null
    try {
      const monnifyAccount = await createReservedAccount({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        reference: `WALLET_${user.id}_${Date.now()}`
      })

      wallet = await prisma.wallet.create({
        data: {
          userId: user.id,
          accountNumber: monnifyAccount.accountNumber,
          bankName: monnifyAccount.bankName,
          accountName: monnifyAccount.accountName,
          accountRef: monnifyAccount.accountReference,
          balance: 0
        }
      })
    } catch (walletError) {
      console.error('Failed to create wallet during registration:', walletError)
      // Don't fail registration if wallet creation fails
      // Wallet can be created later via /api/wallet/create
    }

    // Send welcome email (don't block on email failure)
    sendWelcomeEmail(data.email, data.firstName).catch(console.error)

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user.id,
        userId: user.userId,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      wallet: wallet ? {
        accountNumber: wallet.accountNumber,
        bankName: wallet.bankName,
        accountName: wallet.accountName
      } : null
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

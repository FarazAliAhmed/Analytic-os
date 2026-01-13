---
id: "004"
title: "NGN Wallet with Monnify Integration"
feature: "ngn-wallet"
stage: "tasks"
date: "2026-01-04"
branch: "004-ngn-wallet"
---

## Tasks Overview

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | 1-6 | Database schema and environment setup |
| 2 | 7-12 | API routes and wallet service |
| 3 | 13-18 | UI components (WalletInfo, FundModal) |
| 4 | 19-24 | Polling sync and webhook |
| 5 | 25-28 | Integration and testing |

---

## Phase 1: Database and Environment Setup

### Task 1: Add Prisma schema for Wallet and Transaction

**Files to create/modify:**
- `prisma/schema.prisma` - Add Wallet and Transaction models

**Prerequisites:**
- None

**Test cases:**
- [ ] Prisma generates correct schema
- [ ] Wallet model has: id, userId, accountNumber, bankName, accountName, accountRef, balance
- [ ] Transaction model has: id, walletId, type, amount, description, reference, status
- [ ] Unique constraints on userId, accountNumber, accountRef, reference

**Implementation:**

```prisma
// Add to prisma/schema.prisma

model Wallet {
  id             String   @id @default(uuid())
  userId         String   @unique
  accountNumber  String   @unique
  bankName       String
  accountName    String
  accountRef     String   @unique
  balance        Int      @default(0)  // in kobo
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  user           User     @relation(fields: [userId], references: [id])
  transactions   Transaction[]
}

model Transaction {
  id              String   @id @default(uuid())
  walletId        String
  type            CreditDebit
  amount          Int      // in kobo
  description     String
  reference       String   @unique
  monnifyRef      String?
  status          TxStatus @default(pending)
  createdAt       DateTime @default(now())

  wallet          Wallet   @relation(fields: [walletId], references: [id])
}

enum CreditDebit {
  credit
  debit
}

enum TxStatus {
  pending
  completed
  failed
}
```

**Acceptance criteria:**
- Schema validates with `npx prisma validate`
- `npx prisma generate` creates TypeScript types

---

### Task 2: Add Monnify environment variables

**Files to create/modify:**
- `.env.example` - Add Monnify keys
- `.env` - Add actual values (user to fill)

**Prerequisites:**
- Task 1 complete

**Test cases:**
- [ ] Environment variables are accessible in API routes
- [ ] Missing keys throw helpful error

**Implementation:**

```bash
# Add to .env.example and .env

# Monnify API Configuration
MONNIFY_API_KEY=your_api_key_here
MONNIFY_SECRET_KEY=your_secret_key_here
MONNIFY_CONTRACT_CODE=your_contract_code_here
MONNIFY_BASE_URL=https://api.monnify.com

# Webhook secret for signature validation
MONNIFY_WEBHOOK_SECRET=your_webhook_secret_here
```

**Acceptance criteria:**
- API routes can read `process.env.MONNIFY_API_KEY`
- Development server starts without errors

---

### Task 3: Create wallet service module

**Files to create/modify:**
- `src/lib/wallet-service.ts` - Core wallet business logic

**Prerequisites:**
- Task 1, Task 2 complete

**Test cases:**
- [ ] Service creates wallet for user
- [ ] Service credits wallet balance
- [ ] Service returns formatted balance

**Implementation:**

```typescript
// src/lib/wallet-service.ts

import { prisma } from '@/lib/prisma'
import type { CreditDebit, TxStatus } from '@prisma/client'

// Types
export interface CreateWalletParams {
  userId: string
  email: string
  name: string
}

export interface CreditWalletParams {
  walletId: string
  amount: number  // in kobo
  description: string
  reference: string
  monnifyRef: string
}

export interface WalletResult {
  success: boolean
  data?: any
  error?: string
}

// Create wallet for user (called on signup)
export async function createWallet(params: CreateWalletParams): Promise<WalletResult> {
  try {
    // Check if wallet already exists
    const existing = await prisma.wallet.findUnique({
      where: { userId: params.userId }
    })

    if (existing) {
      return { success: true, data: existing }
    }

    // Create wallet (account details from Monnify API)
    const monnifyAccount = await createMonnifyReservedAccount({
      email: params.email,
      name: params.name,
      reference: `WALLET_${params.userId}`
    })

    const wallet = await prisma.wallet.create({
      data: {
        userId: params.userId,
        accountNumber: monnifyAccount.accountNumber,
        bankName: monnifyAccount.bankName,
        accountName: monnifyAccount.accountName,
        accountRef: monnifyAccount.accountReference,
        balance: 0
      }
    })

    return { success: true, data: wallet }
  } catch (error) {
    console.error('createWallet error:', error)
    return { success: false, error: 'Failed to create wallet' }
  }
}

// Get wallet by user ID
export async function getWalletByUserId(userId: string) {
  return prisma.wallet.findUnique({
    where: { userId },
    include: { transactions: { orderBy: { createdAt: 'desc' }, take: 10 } }
  })
}

// Credit wallet (called when payment detected)
export async function creditWallet(params: CreditWalletParams): Promise<WalletResult> {
  try {
    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Check for duplicate reference
      const existing = await tx.transaction.findUnique({
        where: { reference: params.reference }
      })

      if (existing) {
        return { success: false, error: 'Duplicate transaction', data: existing }
      }

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          walletId: params.walletId,
          type: 'credit' as CreditDebit,
          amount: params.amount,
          description: params.description,
          reference: params.reference,
          monnifyRef: params.monnifyRef,
          status: 'completed' as TxStatus
        }
      })

      // Update wallet balance
      const wallet = await tx.wallet.update({
        where: { id: params.walletId },
        data: { balance: { increment: params.amount } }
      })

      return { success: true, data: { transaction, wallet } }
    })

    return result
  } catch (error) {
    console.error('creditWallet error:', error)
    return { success: false, error: 'Failed to credit wallet' }
  }
}

// Format balance for display (kobo to NGN)
export function formatKoboToNaira(kobo: number): string {
  const naira = kobo / 100
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(naira)
}

// Placeholder for Monnify API call
async function createMonnifyReservedAccount(params: { email: string, name: string, reference: string }) {
  // Will implement in Task 7
  return {
    accountNumber: '8098765432',
    bankName: 'Guaranty Trust Bank',
    accountName: 'ANALYTI INVESTMENT',
    accountReference: params.reference
  }
}
```

**Acceptance criteria:**
- `createWallet()` returns wallet with all fields
- `creditWallet()` increments balance atomically
- `formatKoboToNaira()` formats correctly (e.g., 1250000 → "₦12,500.00")

---

### Task 4: Add wallet types

**Files to create/modify:**
- `types/wallet.ts` - TypeScript types for wallet

**Prerequisites:**
- Task 1 complete

**Implementation:**

```typescript
// types/wallet.ts

export interface Wallet {
  id: string
  userId: string
  accountNumber: string
  bankName: string
  accountName: string
  accountRef: string
  balance: number  // in kobo
  createdAt: Date
  updatedAt: Date
}

export interface Transaction {
  id: string
  walletId: string
  type: 'credit' | 'debit'
  amount: number  // in kobo
  formattedAmount: string
  description: string
  reference: string
  monnifyRef?: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: Date
}

export interface WalletResponse {
  success: boolean
  data?: {
    wallet?: Wallet
    transactions?: Transaction[]
    balance?: number
    formattedBalance?: string
  }
  error?: string
}

export interface CreateWalletResponse {
  success: boolean
  data?: {
    accountNumber: string
    bankName: string
    accountName: string
  }
  error?: string
}
```

---

### Task 5: Run Prisma migration

**Files to create/modify:**
- Database (via Prisma)

**Prerequisites:**
- Task 1, Task 2 complete

**Test cases:**
- [ ] Migration creates Wallet and Transaction tables
- [ ] `npx prisma db push` succeeds

**Commands:**
```bash
npx prisma generate
npx prisma db push
```

**Acceptance criteria:**
- Tables created in database
- Prisma Studio shows new models

---

### Task 6: Create wallet utility functions

**Files to create/modify:**
- `src/lib/utils/wallet.ts` - Formatting helpers

**Prerequisites:**
- Task 4 complete

**Implementation:**

```typescript
// src/lib/utils/wallet.ts

// Convert kobo to NGN display
export function formatNaira(kobo: number): string {
  const naira = kobo / 100
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(naira)
}

// Convert NGN to kobo (for input)
export function parseNaira(naira: string): number {
  const num = parseFloat(naira.replace(/[^0-9.]/g, ''))
  return Math.round(num * 100)
}

// Format account number for display
export function formatAccountNumber(accountNumber: string): string {
  return accountNumber.replace(/(\d{3})(?=\d)/g, '$1 ')
}

// Generate display initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
```

---

## Phase 2: API Routes

### Task 7: Create Monnify API client

**Files to create/modify:**
- `src/lib/monnify.ts` - Monnify API integration

**Prerequisites:**
- Task 2, Task 3 complete

**Test cases:**
- [ ] API key authentication works
- [ ] Reserved account creation returns valid data

**Implementation:**

```typescript
// src/lib/monnify.ts

const MONNIFY_BASE_URL = process.env.MONNIFY_BASE_URL || 'https://api.monnify.com'
const MONNIFY_API_KEY = process.env.MONNIFY_API_KEY
const MONNIFY_SECRET_KEY = process.env.MONNIFY_SECRET_KEY
const MONNIFY_CONTRACT_CODE = process.env.MONNIFY_CONTRACT_CODE

interface MonnifyConfig {
  baseUrl: string
  apiKey: string
  secretKey: string
  contractCode: string
}

const config: MonnifyConfig = {
  baseUrl: MONNIFY_BASE_URL,
  apiKey: MONNIFY_API_KEY || '',
  secretKey: MONNIFY_SECRET_KEY || '',
  contractCode: MONNIFY_CONTRACT_CODE || ''
}

// Get authentication token
async function getAuthToken(): Promise<{ token: string; expiresAt: number }> {
  const response = await fetch(`${config.baseUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      apiKey: config.apiKey,
      secretKey: config.secretKey
    })
  })

  if (!response.ok) {
    throw new Error('Failed to authenticate with Monnify')
  }

  const data = await response.json()
  return {
    token: data.responseBody.accessToken,
    expiresAt: Date.now() + (data.responseBody.expiresIn * 1000)
  }
}

// Create reserved account for user
export async function createReservedAccount(params: {
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  reference: string
}): Promise<{
  accountNumber: string
  bankName: string
  accountName: string
  accountReference: string
}> {
  const { token } = await getAuthToken()

  const response = await fetch(`${config.baseUrl}/api/v2/bank-transfer/reserved-accounts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      accountReference: params.reference,
      accountName: `${params.firstName} ${params.lastName}`,
      email: params.email,
      phoneNumber: params.phoneNumber,
      contractCode: config.contractCode,
      availableBank: ['all']  // All available banks
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.responseMessage || 'Failed to create reserved account')
  }

  const data = await response.json()
  const account = data.responseBody.accounts[0]

  return {
    accountNumber: account.accountNumber,
    bankName: account.bankName,
    accountName: account.accountName,
    accountReference: data.responseBody.accountReference
  }
}

// Get transaction status
export async function getTransactionStatus(reference: string): Promise<{
  status: string
  amount: number
  paidBy: string
}> {
  const { token } = await getAuthToken()

  const response = await fetch(
    `${config.baseUrl}/api/v2/transactions/${reference}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  )

  if (!response.ok) {
    throw new Error('Failed to get transaction status')
  }

  const data = await response.json()
  return {
    status: data.responseBody.paymentStatus,
    amount: data.responseBody.amount,
    paidBy: data.responseBody.payerAccountNumber
  }
}

// Search for incoming transactions to account
export async function searchTransactions(params: {
  accountNumber: string
  fromDate: string
  toDate: string
}): Promise<Array<{
  reference: string
  amount: number
  paidBy: string
  paymentDate: string
}>> {
  const { token } = await getAuthToken()

  const response = await fetch(`${config.baseUrl}/api/v2/transactions/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      accountNumber: params.accountNumber,
      from: params.fromDate,
      to: params.toDate,
      page: 0,
      size: 50
    })
  })

  if (!response.ok) {
    return []  // Return empty array on error
  }

  const data = await response.json()
  return data.responseBody.content.map((tx: any) => ({
    reference: tx.transactionReference,
    amount: Math.round(tx.amount * 100),  // Convert to kobo
    paidBy: tx.payerAccountNumber,
    paymentDate: tx.paymentDate
  }))
}
```

**Acceptance criteria:**
- `createReservedAccount()` returns valid account details
- API calls handle errors gracefully

---

### Task 8: Create POST /api/wallet/create endpoint

**Files to create/modify:**
- `src/app/api/wallet/create/route.ts`

**Prerequisites:**
- Task 3, Task 7 complete

**Test cases:**
- [ ] Authenticated user can create wallet
- [ ] Unauthenticated request returns 401
- [ ] Duplicate wallet returns existing

**Implementation:**

```typescript
// src/app/api/wallet/create/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createReservedAccount } from '@/lib/monnify'
import { createWallet } from '@/lib/wallet-service'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const email = session.user.email || ''
    const name = session.user.name || 'User'

    // Split name for Monnify
    const nameParts = name.split(' ')
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ') || firstName

    // Check if wallet already exists
    const existingWallet = await prisma.wallet.findUnique({
      where: { userId }
    })

    if (existingWallet) {
      return NextResponse.json({
        success: true,
        data: {
          accountNumber: existingWallet.accountNumber,
          bankName: existingWallet.bankName,
          accountName: existingWallet.accountName
        }
      })
    }

    // Create Monnify reserved account
    const monnifyAccount = await createReservedAccount({
      email,
      firstName,
      lastName,
      phoneNumber: '+2348000000000',  // Placeholder
      reference: `WALLET_${userId}_${Date.now()}`
    })

    // Create wallet in database
    const wallet = await prisma.wallet.create({
      data: {
        userId,
        accountNumber: monnifyAccount.accountNumber,
        bankName: monnifyAccount.bankName,
        accountName: monnifyAccount.accountName,
        accountRef: monnifyAccount.accountReference,
        balance: 0
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        accountNumber: wallet.accountNumber,
        bankName: wallet.bankName,
        accountName: wallet.accountName
      }
    })
  } catch (error) {
    console.error('Wallet creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create wallet' },
      { status: 500 }
    )
  }
}
```

---

### Task 9: Create GET /api/wallet/balance endpoint

**Files to create/modify:**
- `src/app/api/wallet/balance/route.ts`

**Prerequisites:**
- Task 3 complete

**Test cases:**
- [ ] Returns current balance for authenticated user
- [ ] Returns 0 for new user without wallet

**Implementation:**

```typescript
// src/app/api/wallet/balance/route.ts

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatKoboToNaira } from '@/lib/wallet-service'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id }
    })

    if (!wallet) {
      return NextResponse.json({
        success: true,
        data: {
          balance: 0,
          formattedBalance: '₦0.00'
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        balance: wallet.balance,
        formattedBalance: formatKoboToNaira(wallet.balance)
      }
    })
  } catch (error) {
    console.error('Get balance error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get balance' },
      { status: 500 }
    )
  }
}
```

---

### Task 10: Create GET /api/wallet/transactions endpoint

**Files to create/modify:**
- `src/app/api/wallet/transactions/route.ts`

**Prerequisites:**
- Task 3 complete

**Test cases:**
- [ ] Returns transaction history
- [ ] Pagination works
- [ ] Empty array for new wallet

**Implementation:**

```typescript
// src/app/api/wallet/transactions/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatKoboToNaira } from '@/lib/wallet-service'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id }
    })

    if (!wallet) {
      return NextResponse.json({
        success: true,
        data: { transactions: [], pagination: { page, limit, total: 0 } }
      })
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: { walletId: wallet.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.transaction.count({ where: { walletId: wallet.id } })
    ])

    const formattedTransactions = transactions.map(tx => ({
      id: tx.id,
      type: tx.type,
      amount: tx.amount,
      formattedAmount: formatKoboToNaira(tx.amount),
      description: tx.description,
      reference: tx.reference,
      status: tx.status,
      createdAt: tx.createdAt.toISOString()
    }))

    return NextResponse.json({
      success: true,
      data: {
        transactions: formattedTransactions,
        pagination: { page, limit, total }
      }
    })
  } catch (error) {
    console.error('Get transactions error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get transactions' },
      { status: 500 }
    )
  }
}
```

---

### Task 11: Create GET /api/wallet/sync endpoint (polling)

**Files to create/modify:**
- `src/app/api/wallet/sync/route.ts`

**Prerequisites:**
- Task 7, Task 10 complete

**Test cases:**
- [ ] Detects new transactions from Monnify
- [ ] Credits wallet for new transactions
- [ ] Returns count of new transactions

**Implementation:**

```typescript
// src/app/api/wallet/sync/route.ts

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { searchTransactions } from '@/lib/monnify'
import { creditWallet, formatKoboToNaira } from '@/lib/wallet-service'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id }
    })

    if (!wallet) {
      return NextResponse.json({
        success: true,
        data: { newTransactions: 0, totalCredited: 0 }
      })
    }

    // Get last 24 hours of transactions from Monnify
    const now = new Date()
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const monnifyTransactions = await searchTransactions({
      accountNumber: wallet.accountNumber,
      fromDate: yesterday.toISOString(),
      toDate: now.toISOString()
    })

    let newTransactions = 0
    let totalCredited = 0

    for (const tx of monnifyTransactions) {
      // Check if we already processed this transaction
      const existing = await prisma.transaction.findUnique({
        where: { reference: tx.reference }
      })

      if (existing) {
        continue  // Skip already processed
      }

      // Credit the wallet
      const result = await creditWallet({
        walletId: wallet.id,
        amount: tx.amount,
        description: 'Wallet funding',
        reference: tx.reference,
        monnifyRef: tx.reference
      })

      if (result.success) {
        newTransactions++
        totalCredited += tx.amount
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        newTransactions,
        totalCredited,
        formattedTotal: formatKoboToNaira(totalCredited)
      }
    })
  } catch (error) {
    console.error('Wallet sync error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to sync wallet' },
      { status: 500 }
    )
  }
}
```

---

### Task 12: Create POST /api/webhooks/monnify endpoint

**Files to create/modify:**
- `src/app/api/webhooks/monnify/route.ts`

**Prerequisites:**
- Task 7 complete

**Test cases:**
- [ ] Validates webhook signature
- [ ] Credits wallet for valid payment
- [ ] Rejects duplicate transactions
- [ ] Returns 401 for invalid signature

**Implementation:**

```typescript
// src/app/api/webhooks/monnify/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { creditWallet } from '@/lib/wallet-service'
import crypto from 'crypto'

const WEBHOOK_SECRET = process.env.MONNIFY_WEBHOOK_SECRET

// Validate webhook signature
function validateSignature(request: NextRequest): boolean {
  const signature = request.headers.get('monnify-signature')

  if (!signature || !WEBHOOK_SECRET) {
    return false
  }

  const body = request.text ? await request.text() : ''
  const computedSignature = crypto
    .createHmac('sha512', WEBHOOK_SECRET)
    .update(body)
    .digest('hex')

  return signature === computedSignature
}

export async function POST(request: NextRequest) {
  try {
    // Validate signature
    if (!validateSignature(request)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Check event type
    if (body.eventType !== 'SUCCESSFUL_TRANSACTION') {
      return NextResponse.json({ success: true, message: 'Event ignored' })
    }

    const { transactionReference, amount, paidBy, paymentDescription } = body

    // Find wallet by account number
    const wallet = await prisma.wallet.findUnique({
      where: { accountNumber: paidBy }
    })

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      )
    }

    // Credit the wallet
    const result = await creditWallet({
      walletId: wallet.id,
      amount: Math.round(amount * 100),  // Convert to kobo
      description: paymentDescription || 'Wallet funding',
      reference: transactionReference,
      monnifyRef: transactionReference
    })

    if (!result.success) {
      console.error('Failed to credit wallet:', result.error)
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
```

---

## Phase 3: UI Components

### Task 13: Create WalletInfo component (NGN version)

**Files to create/modify:**
- `src/components/dashboard/WalletInfo.tsx`

**Prerequisites:**
- Task 4, Task 6 complete

**Test cases:**
- [ ] Displays NGN balance correctly
- [ ] Shows account details
- [ ] Copy button works
- [ ] Opens fund modal on click

**Implementation:**

```typescript
// src/components/dashboard/WalletInfo.tsx

'use client'

import { useState, useCallback } from 'react'
import { formatNaira } from '@/lib/utils/wallet'

interface WalletInfoProps {
  balance: number  // in kobo
  accountNumber: string
  bankName: string
  accountName: string
  onOpenFund: () => void
}

export function WalletInfo({
  balance,
  accountNumber,
  bankName,
  accountName,
  onOpenFund
}: WalletInfoProps) {
  const [copied, setCopied] = useState(false)

  const copyAccountNumber = useCallback(async () => {
    await navigator.clipboard.writeText(accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [accountNumber])

  const shareDetails = useCallback(() => {
    const text = `Bank: ${bankName}\nAccount: ${accountNumber}\nName: ${accountName}`
    if (navigator.share) {
      navigator.share({ title: 'Wallet Details', text })
    } else {
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [bankName, accountNumber, accountName])

  return (
    <div className="flex items-center gap-3 bg-[#23262F] rounded-xl px-4 py-2">
      {/* Balance */}
      <div className="text-right">
        <p className="text-xs text-gray-400">Wallet Balance</p>
        <p className="text-sm font-semibold text-white">
          {formatNaira(balance)}
        </p>
      </div>

      {/* Divider */}
      <div className="w-px h-8 bg-[#858B9A33]" />

      {/* Fund Button */}
      <button
        onClick={onOpenFund}
        className="px-3 py-1.5 bg-[#4459FF] hover:bg-[#3448EE] text-white text-xs font-medium rounded-lg transition-colors"
      >
        Fund +
      </button>

      {/* Profile Icon */}
      <button className="p-1.5 hover:bg-[#181A20] rounded-lg transition-colors">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </button>
    </div>
  )
}
```

---

### Task 14: Create FundWalletModal component

**Files to create/modify:**
- `src/components/dashboard/FundWalletModal.tsx`

**Prerequisites:**
- Task 6 complete

**Test cases:**
- [ ] Displays bank details correctly
- [ ] Copy button copies account number
- [ ] Share button works
- [ ] Shows funding instructions

**Implementation:**

```typescript
// src/components/dashboard/FundWalletModal.tsx

'use client'

import { useState, useCallback } from 'react'
import { formatAccountNumber } from '@/lib/utils/wallet'

interface FundWalletModalProps {
  open: boolean
  onClose: () => void
  accountNumber: string
  bankName: string
  accountName: string
}

export function FundWalletModal({
  open,
  onClose,
  accountNumber,
  bankName,
  accountName
}: FundWalletModalProps) {
  const [copied, setCopied] = useState<'account' | 'name' | null>(null)

  const copyToClipboard = useCallback(async (text: string, type: 'account' | 'name') => {
    await navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }, [])

  const shareDetails = useCallback(() => {
    const text = `Bank: ${bankName}\nAccount: ${accountNumber}\nName: ${accountName}`
    if (navigator.share) {
      navigator.share({ title: 'Wallet Details', text })
    } else {
      navigator.clipboard.writeText(text)
      setCopied('account')
      setTimeout(() => setCopied(null), 2000)
    }
  }, [bankName, accountNumber, accountName])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-[#23262F] rounded-2xl w-full max-w-md p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-[#181A20] rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <h2 className="text-xl font-bold text-white mb-2">Fund Wallet</h2>
        <p className="text-sm text-gray-400 mb-6">
          Transfer to this account and your wallet will be credited automatically
        </p>

        {/* Bank Details Card */}
        <div className="bg-[#181A20] rounded-xl p-4 space-y-4">
          {/* Bank Name */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Bank</span>
            <span className="text-sm text-white font-medium">{bankName}</span>
          </div>

          {/* Account Number */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Account Number</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-white font-mono">
                {formatAccountNumber(accountNumber)}
              </span>
              <button
                onClick={() => copyToClipboard(accountNumber, 'account')}
                className="p-1.5 hover:bg-[#23262F] rounded-lg transition-colors"
              >
                {copied === 'account' ? (
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Account Name */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Account Name</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-white font-medium">{accountName}</span>
              <button
                onClick={() => copyToClipboard(accountName, 'name')}
                className="p-1.5 hover:bg-[#23262F] rounded-lg transition-colors"
              >
                {copied === 'name' ? (
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Share Button */}
        <button
          onClick={shareDetails}
          className="w-full mt-4 py-3 bg-[#181A20] hover:bg-[#2A2F3A] text-gray-300 text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share Details
        </button>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-[#181A20] rounded-xl">
          <p className="text-xs text-gray-400">
            <span className="text-yellow-400 font-medium">Note:</span> Your wallet will be credited automatically once the transfer is confirmed. This usually takes a few seconds.
          </p>
        </div>
      </div>
    </div>
  )
}
```

---

### Task 15: Update Header to use NGN wallet

**Files to create/modify:**
- `src/common/Header.tsx`

**Prerequisites:**
- Task 13 complete

**Test cases:**
- [ ] Wallet balance displays in NGN
- [ ] Fund button opens modal
- [ ] Profile menu still works

**Implementation:**

```typescript
// Add to existing Header.tsx

import { useState, useRef, useCallback, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useAccount } from 'wagmi'
import { WalletInfo } from '@/components/dashboard/WalletInfo'
import { FundWalletModal } from '@/components/dashboard/FundWalletModal'
import { useWalletSession } from '@/hooks/useWalletSession'
import { formatNaira } from '@/lib/utils/wallet'

// In the component:
const [showFundModal, setShowFundModal] = useState(false)
const { data: wallet } = useSWR('/api/wallet/balance', fetcher)
const { data: walletDetails } = useSWR('/api/wallet/create', fetcher)

// Replace WalletInfo section:
{status === 'authenticated' && session?.user ? (
  <div className="flex items-center gap-2">
    {walletDetails?.data ? (
      <WalletInfo
        balance={wallet?.data?.balance || 0}
        accountNumber={walletDetails.data.accountNumber}
        bankName={walletDetails.data.bankName}
        accountName={walletDetails.data.accountName}
        onOpenFund={() => setShowFundModal(true)}
      />
    ) : (
      <button
        onClick={async () => {
          await fetch('/api/wallet/create', { method: 'POST' })
          mutate('/api/wallet/create')
        }}
        className="px-4 py-2 bg-[#4459FF] text-white text-sm rounded-lg"
      >
        Create Wallet
      </button>
    )}

    {/* Profile dropdown remains the same */}
  </div>
) : ...}

// Add modal at end:
{showFundModal && walletDetails?.data && (
  <FundWalletModal
    open={showFundModal}
    onClose={() => setShowFundModal(false)}
    accountNumber={walletDetails.data.accountNumber}
    bankName={walletDetails.data.bankName}
    accountName={walletDetails.data.accountName}
  />
)}
```

---

### Task 16: Create useWallet hook

**Files to create/modify:**
- `src/hooks/useWallet.ts`

**Prerequisites:**
- Task 4 complete

**Implementation:**

```typescript
// src/hooks/useWallet.ts

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useWallet() {
  const { data: balance, error: balanceError, mutate: mutateBalance } = useSWR(
    '/api/wallet/balance',
    fetcher
  )

  const { data: wallet, error: walletError, mutate: mutateWallet } = useSWR(
    '/api/wallet/create',
    fetcher
  )

  const { data: transactions, error: txError, mutate: mutateTx } = useSWR(
    '/api/wallet/transactions',
    fetcher
  )

  const createWallet = async () => {
    const res = await fetch('/api/wallet/create', { method: 'POST' })
    if (!res.ok) throw new Error('Failed to create wallet')
    await mutateWallet()
    await mutateBalance()
    return res.json()
  }

  const syncWallet = async () => {
    const res = await fetch('/api/wallet/sync', { method: 'GET' })
    if (!res.ok) throw new Error('Failed to sync wallet')
    await mutateBalance()
    await mutateTx()
    return res.json()
  }

  return {
    balance: balance?.data?.balance || 0,
    formattedBalance: balance?.data?.formattedBalance || '₦0.00',
    wallet: wallet?.data,
    transactions: transactions?.data?.transactions || [],
    isLoading: !balanceError && !walletError,
    isError: balanceError || walletError,
    createWallet,
    syncWallet
  }
}
```

---

## Phase 4: Integration and Polling

### Task 17: Add SWR for data fetching

**Files to create/modify:**
- `src/app/layout.tsx` - Add SWR provider (if needed)
- Install swr package

**Prerequisites:**
- Task 16 complete

**Commands:**
```bash
npm install swr
```

---

### Task 18: Create auto-sync hook

**Files to create/modify:**
- `src/hooks/useWalletSync.ts`

**Prerequisites:**
- Task 16, Task 17 complete

**Implementation:**

```typescript
// src/hooks/useWalletSync.ts

import { useEffect, useCallback } from 'react'
import { useWallet } from './useWallet'

export function useWalletSync(enabled: boolean = true) {
  const { syncWallet } = useWallet()

  const sync = useCallback(async () => {
    try {
      const result = await syncWallet()
      if (result.data?.newTransactions > 0) {
        console.log(`Wallet synced: +${result.data.newTransactions} transactions`)
      }
    } catch (error) {
      console.error('Wallet sync failed:', error)
    }
  }, [syncWallet])

  useEffect(() => {
    if (!enabled) return

    // Initial sync
    sync()

    // Poll every 60 seconds
    const interval = setInterval(sync, 60 * 1000)

    return () => clearInterval(interval)
  }, [enabled, sync])
}
```

---

### Task 19: Create TransactionHistory component

**Files to create/modify:**
- `src/components/dashboard/TransactionHistory.tsx`

**Prerequisites:**
- Task 16 complete

**Implementation:**

```typescript
// src/components/dashboard/TransactionHistory.tsx

'use client'

import { formatNaira } from '@/lib/utils/wallet'

interface Transaction {
  id: string
  type: 'credit' | 'debit'
  amount: number
  formattedAmount: string
  description: string
  reference: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
}

interface TransactionHistoryProps {
  transactions: Transaction[]
  loading?: boolean
}

export function TransactionHistory({ transactions, loading }: TransactionHistoryProps) {
  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-[#23262F] rounded-xl" />
        ))}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No transactions yet</p>
        <p className="text-sm text-gray-500 mt-1">Fund your wallet to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {transactions.map(tx => (
        <div
          key={tx.id}
          className="flex items-center justify-between p-4 bg-[#23262F] rounded-xl"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              tx.type === 'credit' ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'
            }`}>
              {tx.type === 'credit' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              )}
            </div>
            <div>
              <p className="text-sm text-white">{tx.description}</p>
              <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-sm font-medium ${tx.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
              {tx.type === 'credit' ? '+' : '-'}{tx.formattedAmount}
            </p>
            <p className="text-xs text-gray-500 uppercase">{tx.status}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
```

---

## Phase 5: Testing and Polish

### Task 20: Add unit tests for wallet service

**Files to create/modify:**
- `__tests__/lib/wallet-service.test.ts`

**Prerequisites:**
- Task 3 complete

**Test cases:**
- [ ] formatKoboToNaira converts correctly
- [ ] createWallet handles duplicates
- [ ] creditWallet prevents double credit

---

### Task 21: Add integration tests for API routes

**Files to create/modify:**
- `__tests__/api/wallet.test.ts`

**Prerequisites:**
- Tasks 8-12 complete

**Test cases:**
- [ ] POST /api/wallet/create returns 401 for unauthenticated
- [ ] GET /api/wallet/balance returns correct format
- [ ] GET /api/wallet/transactions paginates correctly

---

### Task 22: Update sign-up to auto-create wallet

**Files to create/modify:**
- `src/app/api/auth/register/route.ts` (if exists)
- `src/components/dashboard/SignUpModal.tsx`

**Prerequisites:**
- Task 8 complete

**Implementation:**

```typescript
// After successful registration in SignUpModal or register route:
const createWallet = async (userId: string, email: string, name: string) => {
  await fetch('/api/wallet/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, email, name })
  })
}
```

---

### Task 23: Add loading states to UI

**Files to create/modify:**
- `src/components/dashboard/WalletInfo.tsx`
- `src/components/dashboard/FundWalletModal.tsx`

**Prerequisites:**
- Tasks 13-15 complete

---

### Task 24: Test on localhost with Monnify sandbox

**Prerequisites:**
- All previous tasks complete

**Checklist:**
- [ ] Wallet creates with sandbox API
- [ ] Balance displays correctly
- [ ] Fund modal shows bank details
- [ ] Copy button works
- [ ] Polling detects transactions
- [ ] No console errors

---

## Task Dependencies

```
Task 1  ──────► Task 3 ──────► Task 4 ──────► Task 5 ──► Tasks 6-12
   │              │              │              │
   │              │              │              │
   ▼              ▼              ▼              ▼
Task 2         Tasks 7       Tasks 8-12     Phase 2 done
   │              │              │
   │              │              │
   ▼              ▼              ▼
Phase 1 done  Tasks 13-19 (can run in parallel)
                │
                │
                ▼
            Tasks 20-24
```

---

## Quick Reference

### Commands

```bash
# Install dependencies
npm install swr

# Database
npx prisma generate
npx prisma db push

# Testing
npm run test
npm run test:watch
```

### Environment Variables

```env
MONNIFY_API_KEY=
MONNIFY_SECRET_KEY=
MONNIFY_CONTRACT_CODE=
MONNIFY_BASE_URL=https://api.monnify.com
MONNIFY_WEBHOOK_SECRET=
```

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/wallet/create` | POST | Create/get wallet |
| `/api/wallet/balance` | GET | Get balance |
| `/api/wallet/transactions` | GET | Get history |
| `/api/wallet/sync` | GET | Poll for payments |
| `/api/webhooks/monnify` | POST | Receive webhooks |

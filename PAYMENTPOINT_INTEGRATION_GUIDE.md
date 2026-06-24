# PaymentPoint Integration Guide for XTes

## 📋 Overview

PaymentPoint is a Nigerian payment platform that allows businesses to accept payments from customers. Based on the documentation structure, it supports:
- Virtual Account creation
- Webhook notifications
- Authentication via API keys

---

## 🔑 Required Credentials

Before starting integration, you need to obtain these credentials from your PaymentPoint dashboard:

### 1. API Keys
- **Public Key** (for client-side operations)
- **Secret Key** (for server-side operations)
- **Merchant ID** (your unique merchant identifier)

### 2. Webhook Configuration
- **Webhook Secret** (for verifying webhook signatures)
- **Webhook URL** (your endpoint to receive payment notifications)

### 3. Environment
- **Test/Sandbox Keys** (for development)
- **Live/Production Keys** (for production)

---

## 📝 Where to Find Your Credentials

1. **Login to PaymentPoint Dashboard**
   - Go to: https://paymentpoint.co (or your merchant dashboard URL)
   - Login with your credentials

2. **Navigate to Settings/API Keys**
   - Look for "Settings" or "Developer" section
   - Find "API Keys" or "Credentials"
   - Copy your keys

3. **Webhook Configuration**
   - Find "Webhooks" or "Notifications" section
   - Set your webhook URL: `https://yourdomain.com/api/webhooks/paymentpoint`
   - Copy the webhook secret

---

## 🔧 Integration Steps

### Step 1: Environment Variables

Add these to your `.env` file:

```env
# PaymentPoint Configuration
PAYMENTPOINT_PUBLIC_KEY=your_public_key_here
PAYMENTPOINT_SECRET_KEY=your_secret_key_here
PAYMENTPOINT_MERCHANT_ID=your_merchant_id_here
PAYMENTPOINT_WEBHOOK_SECRET=your_webhook_secret_here
PAYMENTPOINT_BASE_URL=https://api.paymentpoint.co/v1  # or sandbox URL for testing
PAYMENTPOINT_ENVIRONMENT=sandbox  # or 'production'
```

---

### Step 2: Create PaymentPoint Client Library

**File**: `src/lib/paymentpoint.ts`

```typescript
import crypto from 'crypto'

interface PaymentPointConfig {
  publicKey: string
  secretKey: string
  merchantId: string
  baseUrl: string
  environment: 'sandbox' | 'production'
}

interface CreateVirtualAccountParams {
  email: string
  firstName: string
  lastName: string
  phone: string
  bvn?: string
  accountName?: string
}

interface VirtualAccountResponse {
  success: boolean
  data: {
    accountNumber: string
    accountName: string
    bankName: string
    bankCode: string
    reference: string
  }
  message?: string
}

class PaymentPointClient {
  private config: PaymentPointConfig

  constructor(config: PaymentPointConfig) {
    this.config = config
  }

  /**
   * Generate authorization header
   */
  private getAuthHeader(): string {
    return `Bearer ${this.config.secretKey}`
  }

  /**
   * Make API request
   */
  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`
    
    const headers: HeadersInit = {
      'Authorization': this.getAuthHeader(),
      'Content-Type': 'application/json',
      'X-Merchant-ID': this.config.merchantId,
    }

    const options: RequestInit = {
      method,
      headers,
    }

    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body)
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `PaymentPoint API error: ${response.status}`)
    }

    return data
  }

  /**
   * Create Virtual Account for a user
   */
  async createVirtualAccount(
    params: CreateVirtualAccountParams
  ): Promise<VirtualAccountResponse> {
    return this.request<VirtualAccountResponse>(
      '/virtual-accounts/create',
      'POST',
      {
        email: params.email,
        first_name: params.firstName,
        last_name: params.lastName,
        phone: params.phone,
        bvn: params.bvn,
        account_name: params.accountName || `${params.firstName} ${params.lastName}`,
        merchant_id: this.config.merchantId,
      }
    )
  }

  /**
   * Get Virtual Account details
   */
  async getVirtualAccount(reference: string): Promise<any> {
    return this.request(`/virtual-accounts/${reference}`, 'GET')
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
  ): boolean {
    const hash = crypto
      .createHmac('sha512', secret)
      .update(payload)
      .digest('hex')
    
    return hash === signature
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(reference: string): Promise<any> {
    return this.request(`/transactions/${reference}`, 'GET')
  }

  /**
   * Initiate withdrawal/payout
   */
  async initiateWithdrawal(params: {
    amount: number
    accountNumber: string
    bankCode: string
    narration: string
    reference: string
  }): Promise<any> {
    return this.request('/payouts/initiate', 'POST', params)
  }
}

// Export singleton instance
export const paymentPointClient = new PaymentPointClient({
  publicKey: process.env.PAYMENTPOINT_PUBLIC_KEY!,
  secretKey: process.env.PAYMENTPOINT_SECRET_KEY!,
  merchantId: process.env.PAYMENTPOINT_MERCHANT_ID!,
  baseUrl: process.env.PAYMENTPOINT_BASE_URL!,
  environment: (process.env.PAYMENTPOINT_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
})

export default PaymentPointClient
```

---

### Step 3: Create Virtual Account API Endpoint

**File**: `src/app/api/wallet/create-paymentpoint/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { paymentPointClient } from '@/lib/paymentpoint'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        bvn: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user already has a PaymentPoint wallet
    const existingWallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
    })

    if (existingWallet) {
      return NextResponse.json({
        success: true,
        wallet: {
          accountNumber: existingWallet.accountNumber,
          bankName: existingWallet.bankName,
          accountName: existingWallet.accountName,
        },
      })
    }

    // Create virtual account with PaymentPoint
    const virtualAccount = await paymentPointClient.createVirtualAccount({
      email: user.email!,
      firstName: user.firstName || 'User',
      lastName: user.lastName || 'Account',
      phone: user.phone || '',
      bvn: user.bvn || undefined,
    })

    if (!virtualAccount.success) {
      throw new Error(virtualAccount.message || 'Failed to create virtual account')
    }

    // Save wallet to database
    const wallet = await prisma.wallet.create({
      data: {
        userId: session.user.id,
        accountNumber: virtualAccount.data.accountNumber,
        bankName: virtualAccount.data.bankName,
        accountName: virtualAccount.data.accountName,
        accountRef: virtualAccount.data.reference,
        balance: 0,
      },
    })

    return NextResponse.json({
      success: true,
      wallet: {
        accountNumber: wallet.accountNumber,
        bankName: wallet.bankName,
        accountName: wallet.accountName,
      },
    })
  } catch (error: any) {
    console.error('[PAYMENTPOINT-CREATE] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create wallet' },
      { status: 500 }
    )
  }
}
```

---

### Step 4: Webhook Handler

**File**: `src/app/api/webhooks/paymentpoint/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { paymentPointClient } from '@/lib/paymentpoint'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-paymentpoint-signature') || ''
    const webhookSecret = process.env.PAYMENTPOINT_WEBHOOK_SECRET!

    // Verify webhook signature
    const isValid = paymentPointClient.verifyWebhookSignature(
      body,
      signature,
      webhookSecret
    )

    if (!isValid) {
      console.error('[PAYMENTPOINT-WEBHOOK] Invalid signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const payload = JSON.parse(body)

    console.log('[PAYMENTPOINT-WEBHOOK] Received:', payload)

    const {
      event,
      data: {
        reference,
        amount,
        accountNumber,
        status,
        customerEmail,
        transactionDate,
      },
    } = payload

    // Handle different event types
    switch (event) {
      case 'charge.success':
      case 'payment.successful':
        await handleSuccessfulPayment({
          reference,
          amount,
          accountNumber,
          customerEmail,
          transactionDate,
        })
        break

      case 'charge.failed':
      case 'payment.failed':
        await handleFailedPayment({
          reference,
          accountNumber,
        })
        break

      default:
        console.log('[PAYMENTPOINT-WEBHOOK] Unhandled event:', event)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[PAYMENTPOINT-WEBHOOK] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleSuccessfulPayment(params: {
  reference: string
  amount: number
  accountNumber: string
  customerEmail: string
  transactionDate: string
}) {
  const { reference, amount, accountNumber, customerEmail, transactionDate } = params

  // Find wallet by account number
  const wallet = await prisma.wallet.findFirst({
    where: { accountNumber },
    include: { user: true },
  })

  if (!wallet) {
    console.error('[PAYMENTPOINT-WEBHOOK] Wallet not found:', accountNumber)
    return
  }

  // Check if transaction already exists
  const existingTx = await prisma.transaction.findUnique({
    where: { reference },
  })

  if (existingTx) {
    console.log('[PAYMENTPOINT-WEBHOOK] Transaction already processed:', reference)
    return
  }

  // Convert amount to kobo (assuming amount is in Naira)
  const amountInKobo = Math.round(amount * 100)

  // Create transaction and update wallet balance
  await prisma.$transaction([
    prisma.transaction.create({
      data: {
        walletId: wallet.id,
        type: 'credit',
        amount: amountInKobo,
        description: `Wallet funding via PaymentPoint`,
        reference,
        monnifyRef: reference,
        status: 'completed',
      },
    }),
    prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: {
          increment: amountInKobo,
        },
      },
    }),
    prisma.notification.create({
      data: {
        userId: wallet.userId,
        type: 'transaction',
        title: 'Wallet Funded',
        message: `Your wallet has been credited with ₦${amount.toLocaleString()}`,
      },
    }),
  ])

  console.log('[PAYMENTPOINT-WEBHOOK] Payment processed successfully:', reference)
}

async function handleFailedPayment(params: {
  reference: string
  accountNumber: string
}) {
  const { reference, accountNumber } = params

  // Find wallet
  const wallet = await prisma.wallet.findFirst({
    where: { accountNumber },
  })

  if (!wallet) {
    return
  }

  // Create failed transaction record
  await prisma.transaction.create({
    data: {
      walletId: wallet.id,
      type: 'credit',
      amount: 0,
      description: `Failed payment`,
      reference,
      status: 'failed',
    },
  })

  console.log('[PAYMENTPOINT-WEBHOOK] Payment failed:', reference)
}
```

---

### Step 5: Update Wallet Service

**File**: `src/lib/wallet-service.ts` (add PaymentPoint support)

```typescript
// Add to existing wallet-service.ts

import { paymentPointClient } from './paymentpoint'

export async function createPaymentPointWallet(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      bvn: true,
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  // Create virtual account
  const virtualAccount = await paymentPointClient.createVirtualAccount({
    email: user.email!,
    firstName: user.firstName || 'User',
    lastName: user.lastName || 'Account',
    phone: user.phone || '',
    bvn: user.bvn || undefined,
  })

  if (!virtualAccount.success) {
    throw new Error('Failed to create PaymentPoint wallet')
  }

  // Save to database
  const wallet = await prisma.wallet.create({
    data: {
      userId,
      accountNumber: virtualAccount.data.accountNumber,
      bankName: virtualAccount.data.bankName,
      accountName: virtualAccount.data.accountName,
      accountRef: virtualAccount.data.reference,
      balance: 0,
    },
  })

  return wallet
}
```

---

## 📊 Testing

### Test Mode
1. Use sandbox/test API keys
2. Test virtual account creation
3. Test webhook reception
4. Test payment flow

### Test Credentials
- Use PaymentPoint test cards/accounts
- Check their documentation for test data

---

## 🔒 Security Checklist

- [ ] Store API keys in environment variables
- [ ] Never expose secret key to client-side
- [ ] Verify webhook signatures
- [ ] Use HTTPS for webhook URL
- [ ] Implement rate limiting
- [ ] Log all transactions
- [ ] Handle errors gracefully

---

## 📝 Next Steps

1. **Get Your Credentials**:
   - Login to PaymentPoint dashboard
   - Copy API keys
   - Copy merchant ID
   - Set up webhook URL

2. **Provide Me These Details**:
   ```
   PAYMENTPOINT_PUBLIC_KEY=pk_test_xxxxx
   PAYMENTPOINT_SECRET_KEY=sk_test_xxxxx
   PAYMENTPOINT_MERCHANT_ID=merchant_xxxxx
   PAYMENTPOINT_WEBHOOK_SECRET=whsec_xxxxx
   PAYMENTPOINT_BASE_URL=https://api.paymentpoint.co/v1
   ```

3. **I Will**:
   - Add the credentials to `.env`
   - Implement the integration
   - Test the flow
   - Deploy to production

---

## 📞 Support

If you encounter issues:
1. Check PaymentPoint documentation
2. Contact PaymentPoint support
3. Check webhook logs
4. Verify API keys are correct

---

## ⚠️ Important Notes

1. **BVN Requirement**: Some features may require BVN verification
2. **KYC**: Users may need to complete KYC for higher limits
3. **Transaction Limits**: Check PaymentPoint limits for your account
4. **Fees**: Confirm transaction fees with PaymentPoint
5. **Settlement**: Understand settlement cycles

---

## 🎯 What I Need From You

Please provide:

1. **API Keys** (from PaymentPoint dashboard):
   - Public Key
   - Secret Key
   - Merchant ID

2. **Webhook Secret** (for signature verification)

3. **Base URL** (API endpoint - sandbox or production)

4. **Any specific requirements**:
   - Custom account naming
   - Specific banks to use
   - Transaction limits
   - Special features needed

Once you provide these, I'll complete the integration!

---
id: "004"
title: "NGN Wallet with Monnify Integration"
feature: "ngn-wallet"
stage: "spec"
date: "2026-01-04"
branch: "004-ngn-wallet"
priority: "high"
model: "MiniMax-M2.1"
---

## Overview

Implement NGN (Naira) fiat-only wallet functionality using Monnify payment gateway integration. Users can fund their wallet via bank transfer to a dedicated virtual account and receive automatic credit. No crypto, no DeFi, no external wallet addresses.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Application Layer                            │
├─────────────────────────────────────────────────────────────────────┤
│  UI Components                    │  API Routes                      │
│  ├── Header.tsx                   │  ├── /api/wallet/create         │
│  ├── WalletInfo.tsx               │  ├── /api/wallet/balance        │
│  ├── FundWalletModal.tsx          │  ├── /api/wallet/transactions   │
│  └── TransactionHistory.tsx       │  ├── /api/wallet/sync           │
│                                   │  └── /api/webhooks/monnify      │
├─────────────────────────────────────────────────────────────────────┤
│                         Service Layer                                │
├─────────────────────────────────────────────────────────────────────┤
│  lib/wallet-service.ts            │  lib/monnify.ts                  │
│  ├── createWallet()               │  ├── getAuthToken()              │
│  ├── getWalletByUserId()          │  ├── createReservedAccount()     │
│  └── creditWallet()               │  ├── getTransactionStatus()      │
│                                   │  └── searchTransactions()        │
├─────────────────────────────────────────────────────────────────────┤
│                         Data Layer                                   │
├─────────────────────────────────────────────────────────────────────┤
│  Prisma Schema                    │  External Services               │
│  ├── User                         │  └── Monnify API                 │
│  ├── Wallet                       │     ├── Auth: POST /auth/login   │
│  └── Transaction                  │     ├── Create Account           │
│                                   │     ├── Get Transaction          │
│                                   │     └── Search Transactions      │
└─────────────────────────────────────────────────────────────────────┘
```

## User Stories

1. **As a user**, I want to see my NGN wallet balance displayed prominently after logging in
2. **As a user**, I want to click "Fund Wallet" to view my dedicated bank account details
3. **As a user**, when I transfer funds to the displayed account, I want my wallet to be credited automatically
4. **As a user**, I want to see my transaction history (credits/debits)
5. **As a user**, I want automatic synchronization to detect incoming payments

## Functional Requirements

### FR1: Wallet Creation
- System creates a Monnify reserved account for each user upon first login
- Account details stored in database: accountNumber, bankName, accountName, accountRef
- Balance initialized to 0 (kobo)

### FR2: Balance Display
- Balance stored in kobo (integer)
- Display formatted as NGN currency using Intl.NumberFormat
- Real-time updates via SWR polling

### FR3: Fund Wallet Flow
- User clicks "Fund +" button
- Modal displays bank details: bank name, account number, account name
- Copy button for account number
- Share button for sharing details
- Instructions: "Transfer to this account and your wallet will be credited automatically"

### FR4: Payment Detection (Dual Mechanism)
- **Primary**: Webhook from Monnify (instant)
- **Secondary**: Polling every 60 seconds via /api/wallet/sync

### FR5: Transaction History
- All wallet transactions recorded with type (credit/debit), amount, description, reference
- Pagination support for large transaction sets
- Status tracking: pending, completed, failed

### FR6: Idempotency
- Duplicate transaction references are rejected
- Database unique constraint on reference field
- Prevents double-credited wallets

## Monnify Integration Flow

### 1. Authentication
```
POST /api/v1/auth/login
Headers: Content-Type: application/json
Body: { apiKey, secretKey }
Response: { responseBody: { accessToken, expiresIn } }
```

### 2. Create Reserved Account
```
POST /api/v2/bank-transfer/reserved-accounts
Headers: Authorization: Bearer {token}
Body: {
  accountReference: "WALLET_{userId}_{timestamp}",
  accountName: "{firstName} {lastName}",
  email: "{userEmail}",
  phoneNumber: "{phone}",
  contractCode: "{CONTRACT_CODE}",
  availableBank: ["all"]
}
Response: {
  responseBody: {
    accountReference: "...",
    accounts: [{ accountNumber, bankName, accountName }]
  }
}
```

### 3. Webhook Event (SUCCESSFUL_TRANSACTION)
```
Headers: monnify-signature: {HMAC-SHA512}
Body: {
  eventType: "SUCCESSFUL_TRANSACTION",
  transactionReference: "MNFY_{ref}",
  amount: 50000.00,
  paidBy: "1234567890",
  paymentDescription: "Wallet funding"
}
```

## API Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/wallet/create` | POST | ✅ | Create/retrieve wallet for authenticated user |
| `/api/wallet/balance` | GET | ✅ | Get current wallet balance |
| `/api/wallet/transactions` | GET | ✅ | Get paginated transaction history |
| `/api/wallet/sync` | GET | ✅ | Manually sync with Monnify for missing transactions |
| `/api/webhooks/monnify` | POST | ❌ | Receive payment notifications from Monnify |

## Webhook Handling

### Security
- HMAC-SHA512 signature validation using MONNIFY_WEBHOOK_SECRET
- Reject requests with invalid signature (401)
- Log all webhook attempts for audit

### Processing Flow
```
1. Validate signature
2. Parse event body
3. Check eventType === "SUCCESSFUL_TRANSACTION"
4. Find wallet by accountNumber (paidBy)
5. Check idempotency (reference already exists?)
6. Credit wallet via transaction
7. Return 200 OK
```

### Error Handling
- Invalid signature → 401 Unauthorized
- Missing wallet → 404 Not Found
- Duplicate transaction → 200 OK (idempotent)
- Database error → 500 Internal Server Error

## Wallet Lifecycle

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Sign Up   │───▶│ First Login │───▶│ Create      │───▶│   Wallet    │
│             │    │             │    │ Monnify     │    │   Ready     │
└─────────────┘    │             │    │ Account     │    └─────────────┘
                   └─────────────┘    └─────────────┘          │
                                                                ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Transfer   │───▶│ Webhook/    │───▶│ Credit      │───▶│ Balance     │
│  Funds      │    │ Sync        │    │ Transaction │    │ Updated     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## Data Model (Prisma)

```prisma
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
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions   Transaction[]
}

model Transaction {
  id          String   @id @default(uuid())
  walletId    String
  type        CreditDebit
  amount      Int      // in kobo
  description String
  reference   String   @unique  // Monnify transaction reference
  monnifyRef  String?
  status      TxStatus @default(pending)
  createdAt   DateTime @default(now())
  wallet      Wallet   @relation(fields: [walletId], references: [id], onDelete: Cascade)
}
```

## Security Considerations

### Authentication & Authorization
- All wallet endpoints require valid JWT session via NextAuth v5
- Webhook endpoint is public but signature-validated

### Webhook Security
- HMAC-SHA512 signature validation mandatory
- Secret stored in environment variable (MONNIFY_WEBHOOK_SECRET)
- Regenerate secret periodically

### Idempotency
- Unique constraint on transaction.reference
- Check for existing reference before processing
- Prevents double-credits

### Input Validation
- Zod schema validation for all API inputs
- Type-safe Prisma queries
- Environment variable validation at startup

## Error Taxonomy

| Scenario | HTTP Status | Response |
|----------|-------------|----------|
| Unauthorized | 401 | `{ error: 'Unauthorized' }` |
| Wallet not found | 404 | `{ error: 'Wallet not found' }` |
| Invalid signature | 401 | `{ error: 'Invalid signature' }` |
| Duplicate transaction | 200 | `{ success: true, ... }` |
| Database error | 500 | `{ error: 'Internal server error' }` |

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"

# Monnify
MONNIFY_API_KEY=""
MONNIFY_SECRET_KEY=""
MONNIFY_CONTRACT_CODE=""
MONNIFY_BASE_URL="https://api.monnify.com"
MONNIFY_WEBHOOK_SECRET=""
```

## Non-Goals

- Crypto wallet functionality (explicitly removed)
- DeFi integrations
- External wallet address management
- Multiple currency support (NGN only)
- International transfers
- KYC bank account verification
- Withdrawal functionality (future scope)
- Peer-to-peer transfers

## Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| Next.js | 15 | App Router framework |
| NextAuth.js | v5 | Authentication |
| Prisma | latest | ORM for database |
| SWR | latest | Client-side data fetching |
| Zod | latest | Schema validation |

## Success Criteria

1. ✅ User can view wallet balance in NGN format
2. ✅ User can generate a dedicated virtual bank account
3. ✅ User can copy account details with one click
4. ✅ Wallet is credited automatically via webhook
5. ✅ Wallet is credited via fallback polling
6. ✅ User can view paginated transaction history
7. ✅ No duplicate credits (idempotency verified)
8. ✅ All wallet data protected by authentication

# Monnify Webhook & Withdrawal Specification

## Overview
Implement Monnify webhook handler for payment notifications and withdrawal (disbursement) functionality to enable users to transfer money from their wallet to bank accounts.

## User Stories
- As a user, when I receive money in my Monnify account, my wallet balance updates automatically
- As a user, I can withdraw money from my wallet to my bank account
- As a user, I can select from my saved bank accounts for withdrawal
- As a user, my account is identified by a unique alphanumeric user ID

## Functional Requirements

### 1. Webhook Handler (`/api/monnify/webhook`)
- Accept POST requests from Monnify
- Verify signature using SHA-512 HMAC with `MONNIFY_WEBHOOK_SECRET`
- Process event types:
  - `TRANSACTION_SUCCESS` / `TRANSACTION_FAILED`
  - `DISBURSEMENT_SUCCESS` / `DISBURSEMENT_FAILED`
  - `REFUND_SUCCESS` / `REFUND_FAILED`
- Update wallet balance on successful incoming payment
- Record transaction in database
- Return 200 OK immediately, process asynchronously

### 2. Withdrawal API (`/api/wallet/withdraw`)
- Validate user has sufficient balance
- Validate bank account (optional: verify account name)
- Initiate disbursement via Monnify API
- Record pending transaction
- Handle OTP requirement for large transfers
- Update balance after successful disbursement

### 3. Bank Account Management
- Add bank account (account number + bank code)
- Validate account name via Monnify API
- List saved bank accounts
- Delete bank account
- Set default account

### 4. Unique User ID Generation
- Generate alphanumeric user ID on registration
- Format: `ANALYTI-{8 random chars}` (e.g., `ANALYTI-X7K2MN9P`)
- Store in `userId` field in User model
- Display on profile for easy identification

## API Endpoints

### Webhook
```
POST /api/monnify/webhook
Content-Type: application/json
monnify-signature: {sha512 hash}
```

### Withdrawal
```
POST /api/wallet/withdraw
Body: { amount, bankAccountId,Narration? }
```

### Bank Accounts
```
GET /api/bank-accounts          - List user's bank accounts
POST /api/bank-accounts          - Add new bank account
DELETE /api/bankaccounts/{id}    - Delete bank account
GET /api/bank-accounts/verify    - Verify account number
```

## Database Updates

### Add to User Model
```prisma
model User {
  userId        String   @unique  // ANALYTI-XXXXXX format
  // ... existing fields
}
```

### New Model: BankAccount
```prisma
model BankAccount {
  id            String   @id @default(uuid())
  userId        String
  accountNumber String
  bankName      String
  bankCode      String
  accountName   String
  isDefault     Boolean  @default(false)
  createdAt     DateTime @default(now())

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, accountNumber])
}
```

## Environment Variables
```env
# Already exists
MONNIFY_WEBHOK_SECRET=""  # Generate: openssl rand -base64 32
```

## Security
- Verify `monnify-signature` header using HMAC-SHA512
- Whitelist Monnify IP: 35.242.133.146
- Idempotent webhook processing (track processed events)
- Validate webhook event type before processing

## Implementation Plan
1. Update Prisma schema with User.userId and BankAccount model
2. Create webhook handler with signature verification
3. Create withdrawal API endpoint
4. Create bank account CRUD endpoints
5. Create withdrawal UI modal
6. Generate userId on registration

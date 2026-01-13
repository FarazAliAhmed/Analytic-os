---
id: "0001"
title: "ngn-wallet-implementation"
stage: "green"
date: "2026-01-04"
surface: "agent"
model: "MiniMax-M2.1"
feature: "ngn-wallet"
branch: "004-ngn-wallet"
user: "User"
command: "sp.implement"
labels: ["implementation", "wallet", "ngn", "monnify", "green"]
links:
  spec: "specs/004-ngn-wallet/spec.md"
  plan: "specs/004-ngn-wallet/plan.md"
  tasks: "specs/004-ngn-wallet/tasks.md"
  adr: "null"
  pr: "null"
files:
  - "prisma/schema.prisma"
  - ".env.example"
  - ".env"
  - "src/lib/wallet-service.ts"
  - "src/lib/monnify.ts"
  - "src/lib/utils/wallet.ts"
  - "types/wallet.ts"
  - "src/app/api/wallet/create/route.ts"
  - "src/app/api/wallet/balance/route.ts"
  - "src/app/api/wallet/transactions/route.ts"
  - "src/app/api/wallet/sync/route.ts"
  - "src/app/api/webhooks/monnify/route.ts"
  - "src/hooks/useWallet.ts"
  - "src/hooks/useWalletSync.ts"
  - "src/components/dashboard/WalletInfo.tsx"
  - "src/components/dashboard/FundWalletModal.tsx"
  - "src/components/dashboard/TransactionHistory.tsx"
  - "src/common/Header.tsx"
tests:
  - "null"
---

## Prompt

Implement NGN wallet with Monnify integration following the SDD-RI workflow. User wants to replace crypto wallet with Naira wallet that integrates with Monnify for bank transfers. The implementation should use hybrid payment detection (webhook + polling fallback) for production reliability.

## Response snapshot

Successfully implemented NGN wallet feature with the following components:

1. **Database Schema** (`prisma/schema.prisma`):
   - Added `Wallet` model with userId, accountNumber, bankName, accountName, accountRef, balance (in kobo)
   - Added `Transaction` model with type, amount, description, reference, monnifyRef, status
   - Added `CreditDebit` and `TxStatus` enums
   - Updated User model with wallet relation

2. **Environment Variables** (`.env.example`, `.env`):
   - MONNIFY_API_KEY
   - MONNIFY_SECRET_KEY
   - MONNIFY_CONTRACT_CODE
   - MONNIFY_BASE_URL
   - MONNIFY_WEBHOOK_SECRET

3. **Core Services**:
   - `src/lib/wallet-service.ts` - createWallet, creditWallet, formatKoboToNaira
   - `src/lib/monnify.ts` - createReservedAccount, searchTransactions, getTransactionStatus
   - `src/lib/utils/wallet.ts` - formatNaira, parseNaira, formatAccountNumber, getInitials
   - `types/wallet.ts` - TypeScript interfaces

4. **API Routes**:
   - `POST /api/wallet/create` - Create Monnify reserved account
   - `GET /api/wallet/balance` - Get wallet balance
   - `GET /api/wallet/transactions` - Get transaction history
   - `GET /api/wallet/sync` - Polling endpoint for payments
   - `POST /api/webhooks/monnify` - Webhook for instant payment detection

5. **React Components**:
   - `src/components/dashboard/WalletInfo.tsx` - Balance display with Fund button
   - `src/components/dashboard/FundWalletModal.tsx` - Bank details with copy/share
   - `src/components/dashboard/TransactionHistory.tsx` - Transaction list

6. **Hooks**:
   - `src/hooks/useWallet.ts` - SWR hooks for wallet data fetching
   - `src/hooks/useWalletSync.ts` - Auto-sync every 60 seconds

7. **Updated Header** (`src/common/Header.tsx`):
   - Replaced crypto wallet with NGN wallet
   - Added Fund Wallet modal integration
   - Create Wallet button for users without wallet

## Outcome

- ✅ Phase 1-3 complete: Database, API routes, UI components
- ⚠️ Pending: Run `npm install swr` and `npx prisma generate && npx prisma db push`
- ⚠️ Pending: User needs to add Monnify API keys to .env

## Evaluation notes (flywheel)

- Failure modes observed: "null"
- Graders run and results (PASS/FAIL): "null"
- Prompt variant (if applicable): "null"
- Next experiment (smallest change to try): "null"

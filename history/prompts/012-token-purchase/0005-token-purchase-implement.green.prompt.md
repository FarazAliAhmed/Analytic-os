---
id: "0005"
title: "token-purchase-implement"
stage: "green"
date: "2026-01-06"
surface: "agent"
model: "MiniMax-M2.1"
feature: "012-token-purchase"
branch: "012-token-purchase"
user: "apple"
command: "Implement token purchase feature"
labels: ["token-purchase","implementation","green"]
links:
  spec: "specs/012-token-purchase/spec.md"
  plan: "specs/012-token-purchase/plan.md"
  tasks: "specs/012-token-purchase/tasks.md"
  ticket: "null"
  adr: "null"
  pr: "null"
files:
  - "prisma/schema.prisma"
  - "src/app/api/token/buy/route.ts"
  - "src/app/api/token/balance/route.ts"
  - "src/components/dashboard/BuyTokenModal.tsx"
  - "src/components/dashboard/token/OverviewCard.tsx"
  - "src/components/dashboard/token/Sidebar.tsx"
tests:
  - "null"
---

## Prompt

Execute implementation of token purchase feature. User enters Naira amount, clicks Buy, amount deducted from wallet, tokens credited. Price: N1,500 per token.

## Response snapshot

**Implemented Token Purchase Feature:**

1. **Prisma Models Added**:
   - `TokenHolding` - stores user's token quantity
   - `TokenPurchase` - records all purchases
   - `PurchaseStatus` enum
   - Updated User model with relations

2. **API Routes Created**:
   - `POST /api/token/buy` - Handles purchase with database transaction
   - `GET /api/token/balance` - Returns user's token holdings

3. **Components Created/Updated**:
   - `BuyTokenModal.tsx` - Full purchase modal with:
     - Naira amount input
     - Live token calculation (floor(amount / 1500))
     - Quick amount buttons (₦1,500, ₦3,000, ₦5,000, ₦10,000)
     - Success confirmation with new balances
   - `OverviewCard.tsx` - Updated with:
     - Token holdings display
     - Price changed to ₦1,500
     - Buy INV button
   - `Sidebar.tsx` - Fetches wallet balance and passes to OverviewCard

4. **Purchase Flow**:
   ```
   Wallet: N7,400
   User enters: N7,400
   System calculates: 4 tokens (floor(7400/1500))
   User clicks Buy
   System debits N7,400 from wallet
   System credits 4 tokens
   Show success confirmation
   ```

## Outcome

- Token purchase feature fully implemented
- TypeScript compiles without errors
- Ready to test on /dashboard/token page
- User can buy tokens with Naira from their wallet

## Files Created/Modified

- `prisma/schema.prisma` - Added TokenHolding, TokenPurchase, PurchaseStatus
- `src/app/api/token/buy/route.ts` - New API
- `src/app/api/token/balance/route.ts` - New API
- `src/components/dashboard/BuyTokenModal.tsx` - New component
- `src/components/dashboard/token/OverviewCard.tsx` - Updated
- `src/components/dashboard/token/Sidebar.tsx` - Updated

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Add purchase history page

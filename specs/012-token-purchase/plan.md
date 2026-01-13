# Implementation Plan: token-purchase

**Branch**: `012-token-purchase` | **Date**: 2026-01-06 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/012-token-purchase/spec.md`

## Summary

Implement token purchase functionality where users enter Naira amount to spend, tokens are calculated at N1,500 each, and the amount is deducted from their Naira wallet (Monnify). Remove all USDT references, use Naira throughout.

## Technical Context

**Language/Version**: TypeScript / Next.js 14
**Primary Dependencies**: Next.js App Router, Prisma, Tailwind CSS, Monnify
**Storage**: PostgreSQL (via Prisma)
**Testing**: Jest / React Testing Library
**Target Platform**: Web (responsive)
**Project Type**: Single project (Next.js web app)
**Performance Goals**: Purchase completion within 5 seconds
**Constraints**: N1,500 per token, user enters Naira amount, whole tokens only
**Scale/Scope**: All authenticated users with wallet balance

## Constitution Check

### Code Quality Gates
- ✅ Smallest viable change - adds purchase to existing token page
- ✅ No over-engineering - using existing wallet patterns
- ✅ No premature abstraction - inline validation, transaction safety

### Testing Gates
- Unit tests for purchase calculation
- Integration tests for wallet debit

### Performance Gates
- Purchase completion < 5 seconds
- Balance update < 1 second

### Security Gates
- Auth required for purchases
- Concurrent purchase protection (database transactions)
- Balance verification before debit

## Project Structure

### Documentation (this feature)

```text
specs/012-token-purchase/
├── plan.md              # This file
├── spec.md              # Feature specification
└── quickstart.md        # Testing scenarios
```

### Source Code (repository root)

```text
src/
├── app/api/token/
│   └── buy/route.ts     # Purchase tokens
├── prisma/
│   └── schema.prisma    # Add TokenHolding, TokenPurchase
├── components/dashboard/
│   └── BuyTokenModal.tsx # Purchase modal
└── app/dashboard/token/
    └── page.tsx         # Update with buy functionality
```

**Structure Decision**: Single Next.js project. Token purchase API at `/api/token/`, purchase modal in `components/dashboard/`, existing Monnify wallet infrastructure.

## Technical Design

### API Contract

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/token/buy | Purchase tokens with Naira amount |

### Request/Response

```typescript
// POST /api/token/buy
interface BuyTokenRequest {
  nairaAmount: number  // Amount in Naira to spend
}

interface BuyTokenResponse {
  success: boolean
  purchase?: {
    id: string
    nairaAmountSpent: number
    tokensReceived: number
    pricePerToken: number
    newTokenBalance: number
    newWalletBalance: number
  }
  error?: string
}
```

### Token Price & Calculation

- **Fixed Price**: N1,500 per token
- **User Input**: Naira amount to spend
- **Calculation**: `tokensReceived = floor(nairaAmount / 1500)`
- **Amount Deducted**: Exact naira amount entered

**Examples**:
- Enter N1,500 → 1 token, N1,500 deducted
- Enter N7,400 → 4 tokens, N7,400 deducted
- Enter N500 → 0 tokens (cannot buy), error shown

### Purchase Flow

1. User opens token page, sees price: N1,500/token
2. User enters Naira amount to spend (e.g., N7,400)
3. System displays preview:
   - Tokens to receive: 4
   - Amount to deduct: N7,400
4. User clicks "Buy"
5. System validates wallet balance ≥ N7,400
6. System debits N7,400 from wallet
7. System credits 4 tokens to user
8. System records transaction
9. System shows confirmation with new balances

### Component: BuyTokenModal

```
┌─────────────────────────────┐
│  Buy INV Token              │
├─────────────────────────────┤
│  Price: N1,500 per token    │
│                             │
│  Enter amount to spend:     │
│  ┌─────────────────────┐    │
│  │ N7,400             │    │
│  └─────────────────────┘    │
│                             │
│  You'll receive:            │
│  ┌─────────────────────┐    │
│  │ 4 INV              │    │
│  └─────────────────────┘    │
│                             │
│  [Cancel] [Buy N7,400]      │
└─────────────────────────────┘
```

## Phase 1: Data Model

### New Models

```prisma
model TokenHolding {
  id          String   @id @default(uuid())
  userId      String
  tokenId     String   @default("INV")
  quantity    Int      @default(0)  // Whole tokens
  averagePrice Decimal @default(1500) // N1,500
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, tokenId])
  @@index([userId])
}

model TokenPurchase {
  id              String   @id @default(uuid())
  userId          String
  tokenId         String   @default("INV")
  nairaAmountSpent Int     // In Naira (not kobo)
  tokensReceived  Int
  pricePerToken   Int      // N1,500 in kobo
  totalAmountKobo Int      // nairaAmountSpent * 100
  reference       String   @unique
  status          PurchaseStatus @default(pending)
  createdAt       DateTime @default(now())

  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, createdAt])
}

enum PurchaseStatus {
  pending
  completed
  failed
  refunded
}
```

## Phase 2: API Routes

### Buy Token API
- Create `/api/token/buy/route.ts`
- Validate nairaAmount ≥ 1500 (minimum purchase)
- Check wallet balance ≥ nairaAmount
- Use database transaction for atomicity:
  - Debit wallet balance (in kobo)
  - Credit token holdings
  - Create purchase record
- Return updated balances

## Phase 3: Components

### BuyTokenModal
- Input for Naira amount
- Live calculation of tokens to receive
- Display wallet balance
- Confirm/cancel buttons
- Success/error states
- Loading states

### Token Page Updates
- Display current token holdings
- Add "Buy" button to open modal
- Update price display to N1,500

## Quickstart Commands

```bash
# Test token purchase
# 1. Sign in and ensure wallet has N7,400+
# 2. Navigate to /dashboard/token
# 3. Click "Buy" button
# 4. Enter N7,400 in amount field
# 5. Verify "4 INV" shown as receive
# 6. Click Buy
# 7. Verify wallet decreased by N7,400
# 8. Verify token balance increased by 4
```

## Next Steps

1. Run `/sp.tasks` to generate detailed task list
2. Execute implementation
3. Test with Playwright

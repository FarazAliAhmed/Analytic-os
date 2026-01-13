# Implementation Plan: withdrawal-form

**Branch**: `011-withdrawal-form` | **Date**: 2026-01-05 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/011-withdrawal-form/spec.md`

## Summary

Add withdrawal form fields for account number and account name to the existing WithdrawModal. Users can enter bank details for transfers, save accounts for future use, and get validation feedback. Uses existing BankAccount model and Monnify API for verification.

## Technical Context

**Language/Version**: TypeScript / Next.js 14
**Primary Dependencies**: Next.js App Router, Prisma, Tailwind CSS, Monnify API
**Storage**: PostgreSQL (via Prisma), existing BankAccount model
**Testing**: Jest / React Testing Library
**Target Platform**: Web (responsive)
**Project Type**: Single project (Next.js web app)
**Performance Goals**: Form validation within 1 second, account verification within 2 seconds
**Constraints**: Nigerian bank format (10-digit account numbers), Monnify API for verification
**Scale/Scope**: All authenticated users with wallet balance

## Constitution Check

### Code Quality Gates
- ✅ Smallest viable change - adds form fields to existing WithdrawModal
- ✅ No over-engineering - using existing patterns (like notifications)
- ✅ No premature abstraction - inline validation, no extra state management

### Testing Gates
- Form validation unit tests
- Component tests for WithdrawModal updates

### Performance Gates
- Validation feedback within 1 second
- API verification within 2 seconds

### Security Gates
- Auth required for withdrawals
- Account verification via Monnify
- Input sanitization on all fields

## Project Structure

### Documentation (this feature)

```text
specs/011-withdrawal-form/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # N/A - using existing stack
├── data-model.md        # API contracts
├── quickstart.md        # Testing scenarios
└── contracts/           # API endpoints
```

### Source Code (repository root)

```text
src/
├── app/api/bank-accounts/
│   └── route.ts         # GET/POST bank accounts
├── components/dashboard/
│   └── WithdrawModal.tsx # Updated with bank form fields
├── hooks/
│   └── useWithdrawal.ts # Withdrawal form hook
└── lib/
    └── bank-validation.ts # Bank account validation
```

**Structure Decision**: Single Next.js project. Bank accounts API at `/api/bank-accounts`, updated WithdrawModal in `components/dashboard/`, validation utilities in `lib/`.

## Technical Design

### API Contract

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/bank-accounts | List user's saved bank accounts |
| POST | /api/bank-accounts | Add new bank account |
| DELETE | /api/bank-accounts/{id} | Delete saved bank account |
| GET | /api/bank-accounts/verify | Verify account number with bank |

### Request/Response

```typescript
// POST /api/bank-accounts
interface AddBankAccountRequest {
  accountNumber: string    // 10 digits
  accountName: string      // 3+ characters
  bankName: string
  bankCode: string
  isDefault?: boolean
}

// GET /api/bank-accounts
interface BankAccountResponse {
  id: string
  accountNumber: string
  accountName: string
  bankName: string
  bankCode: string
  isDefault: boolean
  createdAt: string
}

// GET /api/bank-accounts/verify?accountNumber=1234567890&bankCode=058
interface VerifyAccountResponse {
  valid: boolean
  accountName?: string
  accountNumber?: string
}
```

### Form Fields

1. **Account Number** - 10 digit numeric input with validation
2. **Account Name** - Text input (auto-filled from verification or manual)
3. **Bank Name** - Dropdown of Nigerian banks
4. **Save for future** - Checkbox option
5. **Validation** - Real-time inline errors

### Component Updates

**WithdrawModal Changes:**
- Add bank account selector (saved accounts)
- Add "Add new account" option
- Add account number input field
- Add account name input field
- Add bank selection dropdown
- Add verify button to validate account
- Add inline validation messages
- Add "Save for future" checkbox

## Phase 0: Research

**COMPLETED** - Using existing Monnify integration patterns from codebase.

## Phase 1: Design Artifacts

### Data Model
Uses existing BankAccount model:
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
  // Relations and indexes
}
```

### API Contracts
- `GET /api/bank-accounts` - List accounts
- `POST /api/bank-accounts` - Add account
- `DELETE /api/bank-accounts/{id}` - Delete account
- `GET /api/bank-accounts/verify` - Verify with bank

### Quickstart
1. Open WithdrawModal
2. Select saved account OR enter new details
3. Click "Verify" to validate account
4. Enter amount and submit
5. See confirmation and success message

## Implementation Tasks (Phase 2)

### Task 1: API Routes
- [ ] Update `/api/bank-accounts/route.ts` - GET/POST endpoints
- [ ] Add `/api/bank-accounts/verify/route.ts` - Account verification

### Task 2: Components
- [ ] Update `WithdrawModal.tsx` - Add bank form fields
- [ ] Create `BankAccountSelector.tsx` - Saved accounts dropdown
- [ ] Create `BankVerification.tsx` - Account verification UI

### Task 3: Hooks & Utilities
- [ ] Create `useWithdrawal.ts` - Form handling and validation
- [ ] Create `bank-validation.ts` - Input validation utilities
- [ ] Add Nigerian banks list

### Task 4: Integration
- [ ] Connect WithdrawModal to bank accounts API
- [ ] Add inline validation messages
- [ ] TypeScript verification

## Quickstart Commands

```bash
# Test withdrawal form
# 1. Sign in and navigate to dashboard
# 2. Click "Withdraw -" button
# 3. Select saved account or enter new details
# 4. Verify account with bank API
# 5. Enter amount and submit
# 6. Confirm withdrawal
```

## Next Steps

1. Run `/sp.tasks` to generate detailed task list
2. Execute implementation
3. Test with Playwright

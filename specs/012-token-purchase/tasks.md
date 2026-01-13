---

description: "Task list for token purchase feature implementation"

---

# Tasks: token-purchase

**Feature Branch**: `012-token-purchase` | **Date**: 2026-01-06
**Input**: Design documents from `/specs/012-token-purchase/`
**Prerequisites**: plan.md (required), spec.md (required)

## Summary

Implement token purchase functionality where users enter Naira amount to spend, tokens are calculated at N1,500 each, and the amount is deducted from their Naira wallet (Monnify). Remove all USDT references, use Naira throughout.

## User Stories

- **User Story 1 (P1)**: Purchase Tokens with Naira - Core purchase flow
- **User Story 2 (P2)**: View Token Holdings - Show user's tokens
- **User Story 3 (P3)**: View Purchase History - Transaction records

---

## Phase 1: Data Model (Prerequisite)

**Purpose**: Add TokenHolding and TokenPurchase models to Prisma schema

**CRITICAL**: This phase MUST complete before any user story can be tested

- [ ] T001 Add TokenHolding model in prisma/schema.prisma
- [ ] T002 Add TokenPurchase model in prisma/schema.prisma
- [ ] T003 Add PurchaseStatus enum in prisma/schema.prisma
- [ ] T004 Update User model with TokenHolding relation in prisma/schema.prisma
- [ ] T005 Run `npx prisma db push` to sync database

---

## Phase 2: User Story 1 - Purchase Tokens with Naira (Priority: P1)

**Goal**: Users can enter Naira amount and purchase tokens deducted from wallet

**Independent Test**: Open token page, enter N7,400, click Buy, verify wallet decreased by N7,400 and tokens increased by 4

### API Route for User Story 1

- [ ] T006 [P] [US1] Create `/api/token/buy/route.ts` - POST endpoint for purchasing tokens
- [ ] T007 [P] [US1] Add nairaAmount validation (≥ 1500, numeric)
- [ ] T008 [US1] Implement wallet balance check in API
- [ ] T009 [US1] Implement database transaction for atomic debit/credit
- [ ] T010 [US1] Create TokenPurchase record with reference
- [ ] T011 [US1] Return purchase confirmation with new balances

### Component for User Story 1

- [ ] T012 [P] [US1] Create `/src/components/dashboard/BuyTokenModal.tsx`
- [ ] T013 [US1] Add Naira amount input field
- [ ] T014 [US1] Add live calculation: tokens = floor(amount / 1500)
- [ ] T015 [US1] Display wallet balance in modal
- [ ] T016 [US1] Add confirm/cancel buttons
- [ ] T017 [US1] Add loading state during purchase
- [ ] T018 [US1] Add success/error handling

**Checkpoint**: User Story 1 complete - Token purchases work end-to-end

---

## Phase 3: User Story 2 - View Token Holdings (Priority: P2)

**Goal**: Display user's token balance on token page

**Independent Test**: View token page and verify token balance is shown

### API for User Story 2

- [ ] T019 [P] [US2] Create `/api/token/balance/route.ts` - GET endpoint for holdings
- [ ] T020 [US2] Return user's token quantity for "INV" token

### Component for User Story 2

- [ ] T021 [P] [US2] Update `/src/app/dashboard/token/page.tsx` to fetch and display holdings
- [ ] T022 [US2] Add token balance display (e.g., "5 INV")
- [ ] T023 [US2] Add "Buy" button to open BuyTokenModal

**Checkpoint**: User Story 2 complete - Users can see their token holdings

---

## Phase 4: User Story 3 - View Purchase History (Priority: P3)

**Goal**: Show list of past token purchases

**Independent Test**: Check purchase history and verify transactions are listed

### API for User Story 3

- [ ] T024 [P] [US3] Create `/api/token/history/route.ts` - GET endpoint for purchase history
- [ ] T025 [US3] Return list of purchases with date, amount, tokens received

### Component for User Story 3 (Optional - if UI exists)

- [ ] T026 [US3] Add purchase history section to token page or transactions tab

**Checkpoint**: User Story 3 complete - Purchase history visible

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T027 [P] Remove all USDT references and update to Naira in UI
- [ ] T028 [P] Add TypeScript types for token purchase responses
- [ ] T029 TypeScript verification - no compilation errors
- [ ] T030 Run build to verify no errors

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Data Model)**: No dependencies - MUST complete first
- **Phase 2 (US1)**: Depends on Phase 1 - Cannot test without models
- **Phase 3 (US2)**: Depends on Phase 1 - Can proceed in parallel with US1
- **Phase 4 (US3)**: Depends on Phase 1 - Can proceed in parallel
- **Phase 5 (Polish)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 1 - Core purchase flow
- **User Story 2 (P2)**: Can start after Phase 1 - Independent of US1
- **User Story 3 (P3)**: Can start after Phase 1 - Independent of US1/US2

### Parallel Opportunities

- Phase 1 tasks can run sequentially (schema changes required)
- T006, T012 can run in parallel (API and UI independent)
- Phase 3 can start while Phase 2 is in progress
- Phase 4 can start while Phase 3 is in progress

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Data Model (T001-T005)
2. Complete Phase 2: US1 (T006-T018)
3. **STOP and VALIDATE**: Test token purchase with N7,400
4. Deploy/demo if ready

### Incremental Delivery

1. Complete Phases 1-2 → MVP (purchase works)
2. Add Phase 3 → Users can see holdings
3. Add Phase 4 → Purchase history
4. Add Phase 5 → Polish and cleanup

---

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

---

## Task Summary

| Phase | Task Count | Description |
|-------|------------|-------------|
| Phase 1 | 5 | Data Model |
| Phase 2 (US1) | 13 | Purchase Tokens |
| Phase 3 (US2) | 5 | View Holdings |
| Phase 4 (US3) | 3 | Purchase History |
| Phase 5 | 4 | Polish |
| **Total** | **30** | |

### MVP Scope

- **Minimum**: Phase 1 + Phase 2 = 18 tasks
- **Testable**: Token purchases work, wallet debited, tokens credited

### Independent Test Criteria

- **US1**: Enter N7,400, click Buy, verify N7,400 deducted, 4 tokens received
- **US2**: View token page, verify "X INV" shown
- **US3**: View history, verify purchase transactions listed

---

## Notes

- [P] tasks = parallelizable (different files)
- [US1/US2/US3] = user story labels
- Token price fixed at N1,500 per token
- All amounts in Naira (convert to kobo for storage)

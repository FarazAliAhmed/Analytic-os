---

description: "Task list for withdrawal form feature implementation"

---

# Tasks: withdrawal-form

**Feature Branch**: `011-withdrawal-form` | **Date**: 2026-01-06
**Input**: Design documents from `/specs/011-withdrawal-form/`
**Prerequisites**: plan.md (required), spec.md (required)

## Summary

Add withdrawal form fields for account number and account name to the existing WithdrawModal. Users can enter bank details for transfers, save accounts for future use, and get validation feedback. Uses existing BankAccount model and Monnify API for verification.

## User Stories

- **User Story 1 (P1)**: Enter Bank Details for Withdrawal - Account number and name fields
- **User Story 2 (P2)**: Save Bank Account for Future Withdrawals - Save multiple accounts
- **User Story 3 (P2)**: Validate Bank Account Details - Format validation

---

## Phase 1: Setup (API Routes Foundation)

**Purpose**: Create the API endpoints that the WithdrawModal depends on

- [ ] T001 Create `/api/bank-accounts/route.ts` - GET endpoint to list user's saved bank accounts
- [ ] T002 Create `/api/bank-accounts/route.ts` - POST endpoint to add new bank account
- [ ] T003 Create `/api/bank-accounts/verify/route.ts` - POST endpoint for account verification via Monnify

---

## Phase 2: Foundational (Validation Utilities)

**Purpose**: Create validation utilities used by both API routes and UI components

- [ ] T004 Create `/src/lib/bank-validation.ts` - Account number format validation (10 digits)
- [ ] T005 Create `/src/lib/bank-validation.ts` - Account name validation (min 3 chars)
- [ ] T006 Create `/src/lib/monnify.ts` - Monnify API client for account verification

---

## Phase 3: User Story 1 - Enter Bank Details for Withdrawal (Priority: P1)

**Goal**: Users can enter account number and account name on withdrawal form

**Independent Test**: Open withdrawal modal and verify account number/name fields are present and can be filled

### Implementation for User Story 1

**Status**: The WithdrawModal component already has the UI implemented. These tasks complete the backend.

- [ ] T007 [US1] Verify GET `/api/bank-accounts` returns bank accounts in correct format
- [ ] T008 [US1] Verify POST `/api/bank-accounts` saves bank account with all fields
- [ ] T009 [US1] Verify account number input in WithdrawModal accepts only 10 digits
- [ ] T010 [US1] Verify account name displays as user types for verification

**Checkpoint**: User Story 1 complete - Users can enter bank details and complete withdrawal

---

## Phase 4: User Story 2 - Save Bank Account for Future Withdrawals (Priority: P2)

**Goal**: Users can save bank accounts and select them on future withdrawals

**Independent Test**: Enter bank details, complete withdrawal, then start new withdrawal and verify saved account appears

### Implementation for User Story 2

- [ ] T011 [US2] Add DELETE `/api/bank-accounts/{id}` endpoint to delete saved accounts
- [ ] T012 [US2] Add `isDefault` flag handling in POST endpoint
- [ ] T013 [US2] Update WithdrawModal to show saved accounts in dropdown
- [ ] T014 [US2] Update WithdrawModal to auto-fill when saved account selected

**Checkpoint**: User Story 2 complete - Saved accounts appear and can be selected

---

## Phase 5: User Story 3 - Validate Bank Account Details (Priority: P2)

**Goal**: System validates bank account details before submission

**Independent Test**: Enter invalid account numbers and verify error messages appear

### Implementation for User Story 3

- [ ] T015 [US3] Add inline validation errors for account number (not 10 digits)
- [ ] T016 [US3] Add inline validation errors for account name (empty or < 3 chars)
- [ ] T017 [US3] Enable submit button only when all fields are valid
- [ ] T018 [US3] Add special character handling for account name input

**Checkpoint**: User Story 3 complete - Validation errors display inline within 1 second

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T019 [P] Add loading states for account verification
- [ ] T020 [P] Add error boundary for API failures
- [ ] T021 [P] TypeScript verification - no type errors
- [ ] T022 [P] Run build to verify no errors

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - can start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 - Validation utilities need API structure
- **Phase 3 (US1)**: Depends on Phase 1 - API routes must exist
- **Phase 4 (US2)**: Depends on Phase 1 - Uses DELETE endpoint from setup
- **Phase 5 (US3)**: Depends on Phase 2 - Uses validation utilities
- **Phase 6 (Polish)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 1 - Core withdrawal flow
- **User Story 2 (P2)**: Can start after Phase 1 - Uses existing API patterns
- **User Story 3 (P2)**: Can start after Phase 2 - Depends on validation utilities

### Within Each User Story

- API routes before UI integration
- Validation before error handling
- Story complete before moving to next

### Parallel Opportunities

- Phases 1 and 2 can proceed in parallel (different files)
- T001, T002, T004 can run in parallel (different files)
- T011, T012 can run in parallel (different concerns)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: API Routes (T001, T002, T003)
2. Complete Phase 2: Validation (T004, T005, T006)
3. Complete Phase 3: User Story 1 (T007-T010)
4. **STOP and VALIDATE**: Test withdrawal with bank account
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Phases 1-2 → Foundation ready
2. Add Phase 3 (US1) → Test → Deploy/Demo (MVP!)
3. Add Phase 4 (US2) → Test → Deploy/Demo
4. Add Phase 5 (US3) → Test → Deploy/Demo
5. Add Phase 6 (Polish) → Final deployment

---

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

---

## Task Summary

| Phase | Task Count | Description |
|-------|------------|-------------|
| Phase 1 | 3 | API Routes |
| Phase 2 | 3 | Validation Utilities |
| Phase 3 (US1) | 4 | Enter Bank Details |
| Phase 4 (US2) | 4 | Save Bank Accounts |
| Phase 5 (US3) | 4 | Validation |
| Phase 6 | 4 | Polish |
| **Total** | **22** | |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story
- The WithdrawModal UI is already implemented - focus is on backend completion
- API endpoints must match what the frontend expects (from inspecting WithdrawModal)

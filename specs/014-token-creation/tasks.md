---

description: "Task list for token creation backend feature"

---

# Tasks: token-creation

**Feature Branch**: `014-token-creation` | **Date**: 2026-01-07

---

## Phase 1: Data Model (Prerequisite)

**Purpose**: Add Token model to Prisma schema

- [ ] T001 Add Token model in prisma/schema.prisma
- [ ] T002 Add isActive field and indexes
- [ ] T003 Run `npx prisma db push` to sync database

---

## Phase 2: Admin Authentication

**Purpose**: Ensure only admins can manage tokens

- [ ] T004 Add admin check in token API routes
- [ ] T005 Return 401 for non-admin users

---

## Phase 3: User Story 1 - Admin Creates Token (P1)

**Goal**: Admin can create tokens via API

### API Routes

- [ ] T006 [P] Create `/api/admin/tokens/route.ts` - GET list endpoint
- [ ] T007 [P] Create `/api/admin/tokens/route.ts` - POST create endpoint
- [ ] T008 [US1] Add validation for required fields
- [ ] T009 [US1] Add symbol uniqueness check
- [ ] T010 [US1] Return created token with 201 status

### Service Layer

- [ ] T011 [P] Create `/src/lib/token-service.ts` - Token business logic

**Checkpoint**: Admin can create tokens via POST /api/admin/tokens

---

## Phase 4: User Story 2 - Admin Updates Token (P2)

**Goal**: Admin can update token details

### API Routes

- [ ] T012 [P] Create `/api/admin/tokens/[id]/route.ts` - PUT update endpoint
- [ ] T013 [US2] Validate token exists before update
- [ ] T014 [US2] Return updated token

**Checkpoint**: Admin can update tokens via PUT /api/admin/tokens/[id]

---

## Phase 5: User Story 3 - Admin Deletes Token (P3)

**Goal**: Admin can delete tokens

### API Routes

- [ ] T015 [P] Add DELETE endpoint in `/api/admin/tokens/[id]/route.ts`
- [ ] T016 [US3] Soft delete (set isActive = false) instead of hard delete
- [ ] T017 [US3] Return success response

**Checkpoint**: Admin can delete tokens via DELETE /api/admin/tokens/[id]

---

## Phase 6: List Tokens

**Goal**: Anyone can list tokens (for public viewing)

- [ ] T018 [P] Update GET /api/admin/tokens to support public access
- [ ] T019 [P] Add filter by isActive = true for public
- [ ] T020 [P] Create GET /api/tokens (public endpoint without admin)

---

## Dependencies

- Phase 1 must complete before Phase 3+
- Phase 2 (auth) should complete with Phase 3

---

## Task Summary

| Phase | Task Count | Description |
|-------|------------|-------------|
| Phase 1 | 3 | Data Model |
| Phase 2 | 2 | Admin Auth |
| Phase 3 (US1) | 6 | Create Token |
| Phase 4 (US2) | 3 | Update Token |
| Phase 5 (US3) | 3 | Delete Token |
| Phase 6 | 3 | List Tokens |
| **Total** | **20** | |

---

## Quickstart Commands

```bash
# Test token creation (as admin)
curl -X POST http://localhost:3000/api/admin/tokens \
  -H "Content-Type: application/json" \
  -d '{
    "name": "PayStack Tech",
    "symbol": "PYSK",
    "price": 1500,
    "annualYield": 35,
    "industry": "Fintech",
    "payoutFrequency": "Monthly",
    "investmentType": "Debt-based",
    "riskLevel": "Low",
    "listingDate": "2026-01-07",
    "minimumInvestment": 1500,
    "employeeCount": 50
  }'

# List all tokens
curl http://localhost:3000/api/tokens
```

---

## Notes

- Admin UI will be added later
- Logo upload: Use URL for now, file upload later
- All prices stored in kobo for consistency

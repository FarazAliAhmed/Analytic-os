# Implementation Tasks: Admin Token Management CRUD

**Feature**: Admin Token Management CRUD
**Branch**: `021-admin-token-crud`
**Created**: 2026-01-11
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

## Task Summary

| Metric | Count |
|--------|-------|
| Total Tasks | 24 |
| Parallelizable Tasks | 8 |
| User Stories | 5 (US1-US5) |

## Dependency Graph

```
Phase 1 (Setup)
    │
    ▼
Phase 2 (Foundational)
    │
    ▼
Phase 3 (US1: View Tokens) ◄── Core dependency for all other stories
    │
    ├────────────────────────────────────────┐
    ▼                                        ▼
Phase 4 (US2: Add Token)            Phase 5 (US3: Edit Token)
    │                                        │
    │                                        │
    ▼                                        ▼
Phase 6 (US4: Toggle Status) ──────► Phase 8 (Polish)
    │
    ▼
Phase 7 (US5: Delete Token)
    │
    ▼
Phase 8 (Polish)
```

## Parallel Execution Opportunities

- **T001, T002, T003**: Can be created in parallel (different files, no dependencies)
- **T004, T005**: Can be created in parallel (different files)
- **T006, T007**: Can be created in parallel (different components)
- **T008 [P] [US1], T009 [P] [US1]**: Can be created in parallel (stats cards, table row)

---

## Phase 1: Setup

**Goal**: Create TypeScript types, API client, and TanStack Query hooks

- [ ] T001 Create TypeScript types in `src/types/admin.ts`
- [ ] T002 [P] Create API client functions in `src/lib/api/admin-tokens.ts`
- [ ] T003 [P] Create TanStack Query hooks in `src/lib/hooks/useAdminTokens.ts`

---

## Phase 2: Foundational

**Goal**: Set up React Query provider and basic page structure

- [ ] T004 Ensure QueryClientProvider wraps admin routes in `src/app/admin/layout.tsx`
- [ ] T005 [P] Create `src/app/admin/tokens/components/` directory structure

---

## Phase 3: User Story 1 - View and Manage Tokens

**Priority**: P1
**Goal**: Display token stats cards and data table with search functionality
**Independent Test**: Load tokens page, verify stats cards and table display all tokens from database

### Implementation

- [ ] T006 [P] Create TokenStats component in `src/app/admin/tokens/components/TokenStats.tsx`
- [ ] T007 [P] Create reusable AdminModal component in `src/components/admin/AdminModal.tsx`
- [ ] T008 [P] [US1] Create TokenTable component in `src/app/admin/tokens/components/TokenTable.tsx`
- [ ] T009 [P] [US1] Create search bar component in `src/app/admin/tokens/components/SearchBar.tsx`
- [ ] T010 [US1] Update `src/app/admin/tokens/page.tsx` to fetch tokens via TanStack Query and render TokenStats, SearchBar, and TokenTable

### Test Criteria

- [ ] TC1-1: Page loads within 2 seconds with all tokens displayed
- [ ] TC1-2: Stats cards show correct counts (total, active, volume)
- [ ] TC1-3: Search filters tokens by name or symbol in real-time
- [ ] TC1-4: Empty state shows when no tokens exist

---

## Phase 4: User Story 2 - Add New Token

**Priority**: P1
**Goal**: Create modal form for adding new tokens with validation
**Independent Test**: Click "Add New Token", fill form, submit, verify token appears in table

### Implementation

- [ ] T011 [P] [US2] Create TokenFormModal component in `src/app/admin/tokens/components/TokenFormModal.tsx`
- [ ] T012 [P] [US2] Implement Zod validation schema for token form
- [ ] T013 [US2] Integrate "Add New Token" button in page header to open modal
- [ ] T014 [US2] Handle form submission with success/error notifications

### Test Criteria

- [ ] TC2-1: Modal opens when clicking "Add New Token" button
- [ ] TC2-2: Form validation shows errors for missing/invalid fields
- [ ] TC2-3: Duplicate symbol shows API error message
- [ ] TC2-4: Token appears in table within 3 seconds of submission
- [ ] TC2-5: Success toast notification displays after creation

---

## Phase 5: User Story 3 - Edit Existing Token

**Priority**: P1
**Goal**: Edit modal pre-filled with token data, update via API
**Independent Test**: Click edit icon, modify values, save, verify changes persist

### Implementation

- [ ] T015 [P] [US3] Add edit action handler in TokenTable component
- [ ] T016 [P] [US3] Update TokenFormModal to support edit mode with pre-filled data
- [ ] T017 [US3] Connect edit form to PUT /api/admin/tokens/[id] endpoint

### Test Criteria

- [ ] TC3-1: Edit modal opens with pre-filled token data
- [ ] TC3-2: Changes reflect in table within 2 seconds of submission
- [ ] TC3-3: Validation errors show for invalid data
- [ ] TC3-4: Success toast notification displays after update

---

## Phase 6: User Story 4 - Toggle Token Status

**Priority**: P2
**Goal**: Toggle active/inactive status with API call
**Independent Test**: Click toggle, verify status changes and public visibility updates

### Implementation

- [ ] T018 [P] [US4] Add toggle action handler in TokenTable component
- [ ] T019 [US4] Connect toggle to PUT /api/admin/tokens/[id] with isActive field

### Test Criteria

- [ ] TC4-1: Active token toggles to inactive
- [ ] TC4-2: Inactive token toggles to active
- [ ] TC4-3: Table refreshes after toggle
- [ ] TC4-4: Success notification displays

---

## Phase 7: User Story 5 - Delete Token

**Priority**: P2
**Goal**: Delete confirmation dialog, soft delete via API
**Independent Test**: Click delete, confirm, verify token removed from table

### Implementation

- [ ] T020 [P] [US5] Create DeleteConfirmModal in `src/app/admin/tokens/components/DeleteConfirmModal.tsx`
- [ ] T021 [P] [US5] Add delete action handler in TokenTable component
- [ ] T022 [US5] Connect delete to DELETE /api/admin/tokens/[id] endpoint

### Test Criteria

- [ ] TC5-1: Confirmation dialog opens on delete click
- [ ] TC5-2: Token removed from table on confirm
- [ ] TC5-3: Cancel keeps token unchanged
- [ ] TC5-4: Success notification displays after deletion

---

## Phase 8: Polish & Cross-Cutting Concerns

**Goal**: Toast notifications, loading states, responsive design

### Implementation

- [ ] T023 [P] Create NotificationToast component in `src/components/admin/NotificationToast.tsx`
- [ ] T024 [P] Add loading skeletons/spinners for async operations

### Test Criteria

- [ ] PC-1: Loading states show during API operations
- [ ] PC-2: Error messages are user-friendly
- [ ] PC-3: Modal animations are smooth
- [ ] PC-4: Responsive design works on mobile/tablet/desktop

---

## Implementation Strategy

### MVP Scope (Recommended First)

**Phase 3 only (US1: View Tokens)**:
- T001: Create types
- T002: Create API client
- T003: Create hooks
- T004: Ensure QueryClientProvider
- T005: Create directory structure
- T006: TokenStats component
- T007: AdminModal component
- T008: TokenTable component
- T009: SearchBar component
- T010: Update page.tsx

**This delivers**: Admin can view tokens with stats, search, and table display

### Incremental Delivery

1. **Sprint 1**: View Tokens (US1) - Core read functionality
2. **Sprint 2**: Add Token (US2) - Create functionality
3. **Sprint 3**: Edit Token (US3) - Update functionality
4. **Sprint 4**: Toggle + Delete (US4, US5) - Status management
5. **Sprint 5**: Polish - UX improvements

---

## File Reference

### New Files to Create

| File | Phase | Story |
|------|-------|-------|
| `src/types/admin.ts` | 1 | - |
| `src/lib/api/admin-tokens.ts` | 1 | - |
| `src/lib/hooks/useAdminTokens.ts` | 1 | - |
| `src/app/admin/tokens/components/TokenStats.tsx` | 3 | US1 |
| `src/components/admin/AdminModal.tsx` | 3 | - |
| `src/app/admin/tokens/components/TokenTable.tsx` | 3 | US1 |
| `src/app/admin/tokens/components/SearchBar.tsx` | 3 | US1 |
| `src/app/admin/tokens/components/TokenFormModal.tsx` | 4 | US2 |
| `src/app/admin/tokens/components/DeleteConfirmModal.tsx` | 7 | US5 |
| `src/components/admin/NotificationToast.tsx` | 8 | - |

### Files to Modify

| File | Phase | Purpose |
|------|-------|---------|
| `src/app/admin/tokens/page.tsx` | 3 | Connect to API, render components |
| `src/app/admin/layout.tsx` | 2 | Ensure QueryClientProvider |

---

## Success Metrics

- **SC-001**: Page load < 2 seconds (US1)
- **SC-002**: Token creation < 3 seconds (US2)
- **SC-003**: Token edit < 2 seconds (US3)
- **SC-004**: 100% operations succeed when API available
- **SC-005**: Tokens visible to public users immediately
- **SC-006**: Clear validation error messages

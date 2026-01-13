# Tasks: Wallet Info Navbar

**Input**: Design documents from `/specs/002-wallet-info-navbar/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Not requested in feature specification

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Foundational (Setup Reference)

**Purpose**: Review existing components that will be modified

- [x] T001 Review existing SearchBar component in src/common/SearchBar.tsx
- [x] T002 Review existing Header component in src/common/Header.tsx
- [x] T003 Review FiltersDropdown for dropdown positioning patterns in src/components/dashboard/FiltersDropdown.tsx

---

## Phase 2: User Story 1 - Search Dropdown (Priority: P1) 🎯 MVP

**Goal**: Implement search dropdown that opens when clicking the search bar

**Independent Test**: Click on the search bar and verify a dropdown appears below it with mocked search results

### Implementation for User Story 1

- [x] T004 [P] [US1] Create SearchDropdown component in src/components/dashboard/SearchDropdown.tsx
- [x] T005 [US1] Add mock search results data to SearchDropdown (name, ticker, price, change)
- [x] T006 [US1] Implement click-outside to close dropdown in DashboardContainer.tsx
- [x] T007 [US1] Add Escape key handler to close dropdown
- [x] T008 [US1] Update SearchBar to accept onClick handler in src/common/SearchBar.tsx
- [x] T009 [US1] Connect SearchBar onClick to open SearchDropdown in DashboardContainer.tsx

**Checkpoint**: User Story 1 complete - clicking search bar opens dropdown with results

---

## Phase 3: User Story 2 - View Wallet Info (Priority: P1)

**Goal**: Display wallet address and balance in navbar for authenticated users

**Independent Test**: Log in and verify wallet address and balance are shown (no profile avatar)

### Implementation for User Story 2

- [x] T010 [P] [US2] Remove profile dropdown code from src/common/Header.tsx
- [x] T011 [US2] Add wallet info display section to Header.tsx with truncated address
- [x] T012 [US2] Add mock balance display ($12,450.00) to wallet info section
- [x] T013 [US2] Remove unused imports (useRef, useEffect, getInitials) from Header.tsx

**Checkpoint**: User Story 2 complete - authenticated users see wallet info instead of profile

---

## Phase 4: User Story 3 - Copy Wallet Address (Priority: P2)

**Goal**: Allow users to copy their wallet address to clipboard

**Independent Test**: Click copy button and verify address is copied, checkmark appears

### Implementation for User Story 3

- [x] T014 [US3] Add handleCopyAddress function using navigator.clipboard in src/common/Header.tsx
- [x] T015 [US3] Add copy button with clipboard icon in wallet info section
- [x] T016 [US3] Add visual feedback (checkmark) after successful copy with 2s timeout

**Checkpoint**: User Story 3 complete - copy button works with visual confirmation

---

## Phase 5: User Story 4 - Disconnect Wallet (Priority: P1)

**Goal**: Allow users to disconnect their wallet and sign out

**Independent Test**: Click disconnect button and verify user is logged out and redirected

### Implementation for User Story 4

- [x] T017 [US4] Add disconnect button with logout icon in wallet info section
- [x] T018 [US4] Connect disconnect button to existing signOut function from next-auth
- [x] T019 [US4] Verify redirect to landing page after disconnect

**Checkpoint**: User Story 4 complete - disconnect button signs out user

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T020 [P] Verify all props are typed correctly with TypeScript
- [x] T021 [P] Ensure dark theme colors match existing design (#181A20, #23262F)
- [x] T022 Verify responsive behavior on mobile devices
- [x] T023 Test all keyboard interactions (Escape to close dropdown)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: No dependencies - review existing code
- **User Story 1 (Phase 2)**: Depends on Foundational phase completion
- **User Story 2 (Phase 3)**: Depends on Foundational phase completion
- **User Story 3 (Phase 4)**: Depends on Foundational phase completion
- **User Story 4 (Phase 5)**: Depends on Foundational phase completion
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - independent of other stories
- **User Story 2 (P1)**: Can start after Foundational - independent of other stories
- **User Story 3 (P2)**: Can start after Foundational - independent of other stories
- **User Story 4 (P1)**: Can start after Foundational - independent of other stories

### Within Each User Story

- UI components before integration
- Story complete before moving to polish phase

### Parallel Opportunities

- User Stories 1, 2, 3, 4 can proceed in parallel after Foundational phase
- T004 and T005 (US1) can run in parallel
- T010 and T011 (US2) can run in parallel

---

## Parallel Example

```bash
# Launch User Story 1 and User Story 2 in parallel:
Task: "Create SearchDropdown component in src/components/dashboard/SearchDropdown.tsx"
Task: "Add wallet info display section to Header.tsx with truncated address"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Foundational (review)
2. Complete Phase 2: User Story 1 (Search Dropdown)
3. **STOP and VALIDATE**: Test search dropdown independently
4. Deploy/demo if ready

### Incremental Delivery

1. Complete Foundational → Review complete
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Polish phase → Final delivery

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently

# Tasks: Connect Wallet

**Input**: Design documents from `/specs/003-connect-wallet/`
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

- [x] T001 Review existing RainbowKit configuration in src/app/layout.tsx
- [x] T002 Review existing NextAuth session configuration in lib/auth.ts
- [x] T003 Review existing Header component in src/common/Header.tsx

---

## Phase 2: User Story 1 - Connect Wallet (Priority: P1) 🎯 MVP

**Goal**: Implement wallet connection using RainbowKit with "Connect Wallet" button

**Independent Test**: Click "Connect Wallet" button and verify wallet connection modal appears and connects successfully

### Implementation for User Story 1

- [x] T004 [P] [US1] Create useWalletSession hook in src/hooks/useWalletSession.ts to sync wagmi with NextAuth
- [x] T005 [P] [US1] Create WalletInfo component in src/components/dashboard/WalletInfo.tsx
- [x] T006 [US1] Create API route to save wallet address to session in src/app/api/auth/update-wallet/route.ts
- [x] T007 [US1] Add Connect Wallet button to Header.tsx using RainbowKit ConnectButton
- [x] T008 [US1] Integrate WalletInfo component in Header.tsx for connected users
- [x] T009 [US1] Handle wallet connection events and sync with session

**Checkpoint**: User Story 1 complete - clicking Connect Wallet opens RainbowKit modal and connects successfully

---

## Phase 3: User Story 2 - Disconnect Wallet (Priority: P1)

**Goal**: Allow users to disconnect their wallet from the platform

**Independent Test**: Click disconnect button and verify wallet is disconnected and Connect Wallet button appears

### Implementation for User Story 2

- [x] T010 [P] [US2] Add disconnect functionality to WalletInfo component with wagmi disconnect
- [x] T011 [US2] Add NextAuth signOut call on disconnect in src/hooks/useWalletSession.ts
- [x] T012 [US2] Verify session is cleared and UI updates correctly after disconnect

**Checkpoint**: User Story 2 complete - disconnect button works and returns to Connect Wallet state

---

## Phase 4: User Story 3 - View Connected Wallet Info (Priority: P2)

**Goal**: Display wallet address, balance, and copy functionality in navbar

**Independent Test**: After connecting, verify wallet info (address, balance, copy button) is displayed correctly

### Implementation for User Story 3

- [x] T013 [P] [US3] Implement formatAddress utility for truncating wallet addresses
- [x] T014 [US3] Add truncated wallet address display to WalletInfo component
- [x] T015 [US3] Add mock wallet balance display ($12,450.00) to WalletInfo component
- [x] T016 [US3] Add copy button with clipboard functionality to WalletInfo component
- [x] T017 [US3] Add visual feedback (checkmark) after successful copy with 2s timeout

**Checkpoint**: User Story 3 complete - wallet info displays correctly with copy functionality

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T018 [P] Verify all props are typed correctly with TypeScript
- [x] T019 [P] Ensure dark theme colors match existing design (#181A20, #23262F)
- [x] T020 Verify responsive behavior on mobile devices
- [x] T021 Test connection persistence on page refresh

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: No dependencies - review existing code
- **User Story 1 (Phase 2)**: Depends on Foundational phase completion
- **User Story 2 (Phase 3)**: Depends on Foundational phase completion, uses WalletInfo from US1
- **User Story 3 (Phase 4)**: Depends on Foundational phase completion, uses WalletInfo from US1
- **Polish (Phase 5)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - independent of other stories
- **User Story 2 (P1)**: Can start after Foundational - uses WalletInfo component from US1
- **User Story 3 (P2)**: Can start after Foundational - uses WalletInfo component from US1

### Within Each User Story

- Hooks before components
- Components before integration
- Story complete before moving to polish phase

### Parallel Opportunities

- User Stories 1, 2, 3 can proceed in parallel after Foundational phase
- T004 and T005 (US1) can run in parallel
- T010 and T011 (US2) can run in parallel
- T013, T014, T015, T016 (US3) can run in parallel

---

## Parallel Example

```bash
# Launch User Story 1 tasks in parallel:
Task: "Create useWalletSession hook in src/hooks/useWalletSession.ts"
Task: "Create WalletInfo component in src/components/dashboard/WalletInfo.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Foundational (review)
2. Complete Phase 2: User Story 1 (Connect Wallet)
3. **STOP and VALIDATE**: Test wallet connection independently
4. Deploy/demo if ready

### Incremental Delivery

1. Complete Foundational → Review complete
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Polish phase → Final delivery

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently

# Tasks: notification-system

**Input**: Design documents from `/specs/009-notifications/`
**Prerequisites**: plan.md (required), spec.md (required)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Database Schema)

**Purpose**: Update database schema for notifications

- [ ] T001 [P] Add Notification model to prisma/schema.prisma
- [ ] T002 Run yarn prisma generate

---

## Phase 2: Foundational (API Routes)

**Purpose**: Create API routes for notifications CRUD operations

**Independent Test**: API endpoints return proper JSON responses with auth

- [ ] T003 [P] Create GET /api/notifications route in src/app/api/notifications/route.ts
- [ ] T004 [P] Create POST /api/notifications route in src/app/api/notifications/route.ts
- [ ] T005 Create POST /api/notifications/mark-read route in src/app/api/notifications/mark-read/route.ts
- [ ] T006 Create GET /api/notifications/count route in src/app/api/notifications/count/route.ts

---

## Phase 3: User Story 1 - Notification UI Components (Priority: P1) MVP

**Goal**: Notification bell with count badge and dropdown with tabs

**Independent Test**: Click bell icon, dropdown opens with tabs and notification list

### Implementation for User Story 1

- [ ] T007 [P] [US1] Create NotificationBell component in src/components/dashboard/NotificationBell.tsx
- [ ] T008 [US1] Create NotificationDropdown component in src/components/dashboard/NotificationDropdown.tsx
- [ ] T009 [US1] Add NotificationBell to Header in src/common/Header.tsx

---

## Phase 4: User Story 2 - Tab Filtering (Priority: P2)

**Goal**: Filter notifications by type (All | Alert | Transactions)

**Independent Test**: Clicking "Alert" tab shows only alert notifications

### Implementation for User Story 2

- [ ] T010 [US2] Add tab filtering logic to NotificationDropdown in src/components/dashboard/NotificationDropdown.tsx
- [ ] T011 [US2] Add API support for type filtering in src/app/api/notifications/route.ts

---

## Phase 5: User Story 3 - Unread Indicators (Priority: P3)

**Goal**: Red dot for unread notifications and count badge

**Independent Test**: Unread notifications show red dot, bell shows count badge

### Implementation for User Story 3

- [ ] T012 [US3] Add unread dot rendering in NotificationDropdown
- [ ] T013 [US3] Implement mark as read on click functionality
- [ ] T014 [US3] Connect unread count API to NotificationBell badge

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validation and cleanup

- [ ] T015 Run TypeScript verification with npx tsc --noEmit
- [ ] T016 Verify build with npm run build

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational (Phase 2) - No other dependencies
- **User Story 2 (P2)**: Depends on Foundational (Phase 2) - Uses US1 components
- **User Story 3 (P3)**: Depends on Foundational (Phase 2) - Uses US1 components

### Within Each User Story

- API routes before components
- Core components before integration
- Story complete before moving to next priority

---

## Parallel Opportunities

- Phase 1 tasks can run in parallel (T001, T002)
- Phase 2 tasks marked [P] can run in parallel (T003, T004)
- User stories can proceed in parallel once Foundational is complete

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test notification bell and dropdown independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational
2. Add User Story 1 → Test → MVP!
3. Add User Story 2 → Test
4. Add User Story 3 → Test

---

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 16 |
| User Story 1 | 3 tasks |
| User Story 2 | 2 tasks |
| User Story 3 | 3 tasks |
| Parallelizable Tasks | 5 |

# Implementation Plan: notification-system

**Feature Branch**: `009-notification-system`
**Created**: 2026-01-05
**Status**: Planning

## Technical Context

### Scope
- **In Scope**:
  - NotificationBell component with count badge
  - NotificationDropdown with tabs (All | Alert | Transactions)
  - Red dot for unread notifications
  - Transaction-style design
  - API routes for notifications CRUD

- **Out of Scope**:
  - Push notifications
  - Email notifications
  - Notification settings/preferences

### Dependencies
- Prisma (existing)
- NextAuth session (existing)
- Tailwind CSS (existing)

### Key Decisions
| Area | Decision | Rationale |
|------|----------|-----------|
| State Management | React local state | Simple, no need for global store |
| API Pattern | REST endpoints | Consistent with existing API |
| Pagination | Cursor-based | Better performance for large datasets |

---

## Constitution Check

### Code Quality
- ✅ Smallest viable change - focused on notification feature only
- ✅ No over-engineering - using existing patterns
- ✅ No premature abstraction - components created as needed

### Testing
- Unit tests for API routes
- Component tests for UI

### Performance
- Efficient database queries with indexes
- Lazy loading of notifications

### Security
- Auth required for all endpoints
- User can only access own notifications

---

## Gates

| Gate | Status | Notes |
|------|--------|-------|
| Schema validated | ✅ | Notification model with indexes |
| API contracts defined | ✅ | REST endpoints defined |
| UI components specified | ✅ | Bell and Dropdown components |
| Security review | ✅ | Auth on all endpoints |

---

## Phase 0: Research

**Completed**: No unknowns - using existing stack patterns

---

## Phase 1: Design

### Data Model (from spec)
```prisma
model Notification {
  id        String           @id @default(uuid())
  userId    String
  type      NotificationType
  title     String
  message   String
  isRead    Boolean          @default(false)
  metadata  Json?
  createdAt DateTime         @default(now())
  user      User             @relation(...)
  @@index([userId, createdAt])
  @@index([userId, isRead])
}

enum NotificationType {
  alert
  transaction
}
```

### API Contracts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/notifications | List notifications (with type filter) |
| POST | /api/notifications | Create notification |
| POST | /api/notifications/mark-read | Mark single/all as read |
| GET | /api/notifications/count | Get unread count |

### Components
- `NotificationBell` - Bell icon with badge
- `NotificationDropdown` - Dropdown with tabs and list

---

## Phase 2: Implementation Tasks

### Task 1: Database Schema
- [ ] Update Prisma schema with Notification model
- [ ] Run `prisma generate`

### Task 2: API Routes
- [ ] Create `src/app/api/notifications/route.ts` (GET, POST)
- [ ] Create `src/app/api/notifications/mark-read/route.ts`
- [ ] Create `src/app/api/notifications/count/route.ts`

### Task 3: Components
- [ ] Create `NotificationBell.tsx`
- [ ] Create `NotificationDropdown.tsx`

### Task 4: Integration
- [ ] Update Header.tsx to use NotificationBell
- [ ] TypeScript verification

---

## Quickstart

```bash
# 1. Update schema
npx prisma migrate dev --name add_notifications

# 2. Verify TypeScript
npx tsc --noEmit
```

## Next Steps
1. Review plan
2. Run `/sp.tasks` to generate tasks.md
3. Execute implementation

# Notifications System Specification

## Overview
Implement a notification system with tabs for filtering (All | Alert | Transactions), red dot indicators for unread notifications, and a notification count badge on the bell icon.

## User Stories
- As a user, I see all notifications in a list with tabs for filtering
- As a user, I can see which notifications are unread via red dots
- As a user, I see a notification count badge on the bell icon
- As a user, clicking a notification marks it as read (removes red dot)

## Functional Requirements

### Notification Types
1. **Alert** - System alerts, security notifications, updates
2. **Transaction** - Payment confirmations, wallet activity, transfers

### Tabs
- **All** - Shows all notifications (both Alert and Transaction)
- **Alert** - Shows only alert-type notifications
- **Transactions** - Shows only transaction notifications

### UI Components
1. **Notification Bell Icon**
   - Shows notification count badge (red circle with number)
   - Click to open dropdown panel

2. **Notification Dropdown Panel**
   - Tabs: All | Alert | Transactions
   - List of notifications with red dot for unread
   - Each notification shows:
     - Type icon (alert or transaction)
     - Title
     - Description
     - Timestamp
     - Red dot for unread status
   - Scrollable content area

3. **Notification Item Design**
   - Background color for unread vs read
   - Red dot indicator on left side (unread only)
   - Transaction-style design with icons and details
   - Mark as read on click

### Database Schema
```prisma
model Notification {
  id          String   @id @default(uuid())
  userId      String
  type        NotificationType
  title       String
  message     String
  isRead      Boolean  @default(false)
  metadata    Json?    // Additional data (transaction details, etc.)
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, createdAt])
  @@index([userId, isRead])
}

enum NotificationType {
  alert
  transaction
}
```

### API Endpoints
- `GET /api/notifications` - Get user's notifications (with pagination and filtering)
- `POST /api/notifications/mark-read/{id}` - Mark single notification as read
- `POST /api/notifications/mark-all-read` - Mark all as read
- `GET /api/notifications/count` - Get unread count

### Notification Creation
- Auto-create notifications for:
  - Wallet transactions (deposit, withdrawal)
  - System updates
  - Security alerts
  - Account changes

## Implementation Plan
1. Update Prisma schema with Notification model
2. Create notification API routes
3. Create notification bell component with badge
4. Create notification dropdown with tabs
5. Add notification item styling
6. Integrate into dashboard header

# Implementation Tasks

## Task 1: Database Schema & Admin Auth
- [x] Add `UserRole` enum (USER, ADMIN) to `prisma/schema.prisma`
- [x] Add `role` field to User model with default USER
- [x] Run `npx prisma migrate dev` to apply migration
- [x] Set initial admin user via SQL or Prisma Studio
- [x] Create `src/lib/admin.ts` with `isAdmin(userId: string)` helper
- [x] Create `src/app/api/admin/verify/route.ts` to check admin role
- [x] Update `middleware.ts` to protect `/admin/*` routes
- [x] Redirect non-admins to `/dashboard`

## Task 2: Admin Layout & Components
- [x] Create `src/app/admin/layout.tsx` with admin-specific layout
- [x] Create `src/components/admin/AdminSidebar.tsx`
- [x] Create `src/components/admin/AdminHeader.tsx` with search and notifications
- [x] Add navigation: Dashboard, Transactions, Tokens, Users, Settings
- [x] Add "Admin Version 1.0.0" footer
- [x] Create `src/components/admin/StatsCard.tsx`
- [x] Implement green/red styling for positive/negative changes
- [x] Add icon support

## Task 3: Admin Stats & Chart APIs
- [x] Create `src/app/api/admin/stats/route.ts`
- [x] Query User count with month-over-month change
- [x] Query Transaction + TokenPurchase counts
- [x] Add placeholder values for airdrops and yields
- [x] Create `src/app/api/admin/chart-data/route.ts`
- [x] Aggregate transactions by day/week/month
- [x] Return date and volume arrays

## Task 4: Chart & Wallet Components
- [x] Create `src/components/admin/TransactionVolumeChart.tsx`
- [x] Implement area chart with recharts
- [x] Add Daily/Weekly/Monthly toggle buttons
- [x] Format Y-axis as currency (₦)
- [x] Create `src/components/admin/OrbitsWalletCard.tsx`
- [x] Display truncated wallet address with copy button
- [x] Show balance and token holdings

## Task 5: Wallet & Transactions APIs
- [x] Create `src/app/api/admin/wallet/route.ts`
- [x] Return platform wallet from env config
- [x] Create `src/app/api/admin/transactions/route.ts`
- [x] Combine Transaction and TokenPurchase records
- [x] Add pagination support
- [x] Add type and status filters

## Task 6: Recent Transactions Table
- [x] 6. Implement Recent Transactions Table component with all features
  - [x] 6.1 Create `src/components/admin/RecentTransactionsTable.tsx` with table structure
    - Display columns: ID, User, Amount, Type, Status, Date, Action
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  - [x] 6.2 Add status badges with color coding
    - Green badge for "Completed" status
    - Yellow badge for "Pending" status
    - Red badge for "Failed" status
    - _Requirements: 5.6, 5.7_
  - [x] 6.3 Add "View All" button and action icons
    - "View All" button linking to full transactions page
    - Eye icon for viewing transaction details
    - _Requirements: 5.8, 5.9_

## Task 7: Admin Dashboard & Sub-Pages
- [x] 7. Build Admin Dashboard pages and integrate all components
  - [x] 7.1 Create `src/app/admin/page.tsx` with redirect to dashboard
    - Redirect to `/admin/dashboard`
    - _Requirements: 1.1_
  - [x] 7.2 Create `src/app/admin/dashboard/page.tsx` with full dashboard layout
    - Integrate StatsCards (4 cards in grid: Total Users, Total Transactions, Airdrops Distributed, Total Yields Paid)
    - Integrate TransactionVolumeChart with period toggle
    - Integrate OrbitsWalletCard with wallet details
    - Integrate RecentTransactionsTable
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 4.1, 4.2, 4.3, 4.4, 5.1_
  - [x] 7.3 Create `src/app/admin/transactions/page.tsx`
    - Full transactions list with filters
    - _Requirements: 7.2_
  - [x] 7.4 Create `src/app/admin/tokens/page.tsx`
    - Token management page placeholder
    - _Requirements: 1.1_
  - [x] 7.5 Create `src/app/admin/users/page.tsx`
    - User management page placeholder
    - _Requirements: 1.1_
  - [x] 7.6 Create `src/app/admin/settings/page.tsx`
    - Admin settings page placeholder
    - _Requirements: 1.1_

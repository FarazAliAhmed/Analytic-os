# Design Document

## Overview

The Admin Dashboard is a separate administrative interface for AnalyticaOS platform management. It follows the existing Next.js App Router architecture with a dedicated `/admin` route group, separate layout, and admin-specific components.

## Architecture

### Route Structure
```
src/app/admin/
├── layout.tsx              # Admin layout with AdminSidebar
├── page.tsx                # Dashboard overview (redirects to /admin/dashboard)
├── dashboard/
│   └── page.tsx            # Main dashboard with stats, chart, wallet, transactions
├── transactions/
│   └── page.tsx            # Full transactions list with filters
├── tokens/
│   └── page.tsx            # Token management
├── users/
│   └── page.tsx            # User management
└── settings/
    └── page.tsx            # Admin settings
```

### API Structure
```
src/app/api/admin/
├── stats/route.ts          # GET - Platform statistics
├── transactions/route.ts   # GET - Paginated transactions
├── chart-data/route.ts     # GET - Transaction volume chart data
└── wallet/route.ts         # GET - Platform wallet info
```

## Components

### AdminSidebar
Location: `src/components/admin/AdminSidebar.tsx`

Props: `{ isOpen?: boolean; onClose?: () => void }`

Navigation items:
- Dashboard (`/admin/dashboard`)
- Transactions (`/admin/transactions`)
- Tokens (`/admin/tokens`)
- Users (`/admin/users`)
- Settings (`/admin/settings`)

Footer: "Admin Version 1.0.0"

### StatsCard
Location: `src/components/admin/StatsCard.tsx`

Props:
```typescript
interface StatsCardProps {
  title: string
  value: string | number
  subtitle: string
  change: number        // Percentage change
  icon?: React.ReactNode
}
```

### TransactionVolumeChart
Location: `src/components/admin/TransactionVolumeChart.tsx`

Props:
```typescript
interface ChartProps {
  data: { date: string; volume: number }[]
  period: 'daily' | 'weekly' | 'monthly'
  onPeriodChange: (period: 'daily' | 'weekly' | 'monthly') => void
}
```

Uses: recharts library (already in project)

### OrbitsWalletCard
Location: `src/components/admin/OrbitsWalletCard.tsx`

Props:
```typescript
interface WalletCardProps {
  address: string
  balance: number
  tokens: { name: string; symbol: string; value: number }[]
}
```

### RecentTransactionsTable
Location: `src/components/admin/RecentTransactionsTable.tsx`

Props:
```typescript
interface Transaction {
  id: string
  userId: string
  userEmail: string
  amount: number
  type: 'Purchase' | 'Yield' | 'Transfer'
  status: 'Completed' | 'Pending' | 'Failed'
  date: string
}

interface TableProps {
  transactions: Transaction[]
  onViewAll: () => void
}
```

## Data Models

### Admin Stats Response
```typescript
interface AdminStats {
  totalUsers: number
  totalUsersChange: number      // % vs last month
  totalTransactions: number
  totalTransactionsChange: number
  airdropsDistributed: number   // In Naira
  airdropsChange: number
  totalYieldsPaid: number       // In Naira
  yieldsChange: number
}
```

### Chart Data Response
```typescript
interface ChartDataPoint {
  date: string
  volume: number
}

interface ChartDataResponse {
  data: ChartDataPoint[]
  period: 'daily' | 'weekly' | 'monthly'
}
```

## Authentication

### Admin Role in Database
Add `role` field to User model for backend sync:

```prisma
enum UserRole {
  USER
  ADMIN
}

model User {
  // ... existing fields
  role  UserRole @default(USER)
}
```

### Admin Role Check
1. User's `role` field is checked from database
2. Middleware protects `/admin/*` routes
3. API endpoints verify admin role before returning data

### Helper Function
Create `src/lib/admin.ts`:
```typescript
export async function isAdmin(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: viserId },
    select: { role: true }
  })
  return user?.role === 'ADMIN'
}
```

### Middleware Update
Update `middleware.ts` to add admin route protection:
```typescript
const isOnAdmin = pathname.startsWith('/admin')

if (isOnAdmin) {
  // Check session exists
  // API call to verify admin role
  // Redirect non-admins to dashboard
}
```

### Making a User Admin
Run Prisma query or create admin API:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

## API Endpoints

### GET /api/admin/stats
Returns platform statistics aggregated from:
- User count from `User` table
- Transaction count from `Transaction` + `TokenPurchase` tables
- Airdrops from future `Airdrop` table (placeholder for now)
- Yields from future `YieldPayment` table (placeholder for now)

### GET /api/admin/transactions
Query params: `page`, `limit`, `type`, `status`
Returns paginated list combining `Transaction` and `TokenPurchase` records

### GET /api/admin/chart-data
Query params: `period` (daily|weekly|monthly)
Returns aggregated transaction volumes by date

### GET /api/admin/wallet
Returns platform wallet configuration from environment variables

## Styling

Uses existing Tailwind CSS configuration with:
- Dark theme (bg-secondary, text-white)
- Card styling consistent with existing dashboard
- Green/red colors for positive/negative changes
- Status badges: green (Completed), yellow (Pending), red (Failed)

## Dependencies

No new dependencies required. Uses:
- recharts (existing)
- react-icons (existing)
- Tailwind CSS (existing)
- Prisma (existing)

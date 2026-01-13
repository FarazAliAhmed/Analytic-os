# Admin Card Styling - Tasks

## Phase 1: Create Reusable Components

### Task 1.1: Create AdminCard Component
```typescript
// src/components/admin/AdminCard.tsx
interface AdminCardProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  action?: React.ReactNode
}

export default function AdminCard({ title, subtitle, children, className, action }: AdminCardProps) {
  return (
    <div className={`bg-[#23262F] rounded-xl border border-[#858B9A33] p-5 ${className || ''}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && (
            <div>
              {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  )
}
```

**Acceptance Criteria:**
- [ ] Component accepts title, subtitle, children, action props
- [ ] Uses `bg-[#23262F] rounded-xl border border-[#858B9A33]` styling
- [ ] Header section with optional action slot
- [ ] Exports component properly

---

### Task 1.2: Create AdminTable Component
```typescript
// src/components/admin/AdminTable.tsx
interface AdminTableProps {
  columns: { key: string; label: string }[]
  children: React.ReactNode
  className?: string
}

export default function AdminTable({ columns, children, className }: AdminTableProps) {
  return (
    <div className={`bg-[#23262F] rounded-xl border border-[#858B9A33] ${className || ''}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#858B9A33]">
              {columns.map((col) => (
                <th key={col.key} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#858B9A33]">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

**Acceptance Criteria:**
- [ ] Component accepts columns array and children
- [ ] Uses `bg-[#23262F] rounded-xl border border-[#858B9A33]` container
- [ ] Table header uses `text-xs font-medium text-gray-500 uppercase tracking-wider`
- [ ] Body uses `divide-y divide-[#858B9A33]`

---

### Task 1.3: Create AdminStatsCard Component
```typescript
// src/components/admin/AdminStatsCard.tsx
interface AdminStatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  change?: number
  icon: React.ReactNode
  className?: string
}

export default function AdminStatsCard({ title, value, subtitle, change, icon, className }: AdminStatsCardProps) {
  return (
    <div className={`bg-[#23262F] rounded-xl p-5 ${className || ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="w-10 h-10 bg-[#4459FF]/10 rounded-lg flex items-center justify-center text-[#4459FF]">
          {icon}
        </div>
      </div>
      {change !== undefined && (
        <div className="mt-3 flex items-center gap-1">
          <span className={`text-xs font-medium ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
          <span className="text-xs text-gray-500">vs last month</span>
        </div>
      )}
    </div>
  )
}
```

**Acceptance Criteria:**
- [ ] Component accepts title, value, subtitle, change, icon props
- [ ] Uses `bg-[#23262F] rounded-xl p-5` styling
- [ ] Shows change indicator with color coding
- [ ] Icon container uses `bg-[#4459FF]/10` styling

---

### Task 1.4: Create AdminButton Component
```typescript
// src/components/admin/AdminButton.tsx
interface AdminButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export default function AdminButton({ variant = 'primary', size = 'md', children, onClick, className, disabled }: AdminButtonProps) {
  const variants = {
    primary: 'bg-[#4459FF] text-white hover:bg-[#3348EE]',
    secondary: 'bg-[#23262F] text-white hover:bg-[#1A1D24] border border-[#858B9A33]',
    danger: 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-base'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className || ''}`}
    >
      {children}
    </button>
  )
}
```

**Acceptance Criteria:**
- [ ] Component accepts variant (primary/secondary/danger), size, children
- [ ] Primary uses `bg-[#4459FF] text-white hover:bg-[#3348EE]`
- [ ] Secondary uses `bg-[#23262F] text-white border border-[#858B9A33]`
- [ ] Includes disabled state

---

## Phase 2: Update Admin Pages

### Task 2.1: Update AdminTokensPage
**Acceptance Criteria:**
- [ ] Replace table container with AdminTable component
- [ ] Add AdminStatsCard components at top for token metrics
- [ ] Replace buttons with AdminButton component
- [ ] Consistent spacing and layout

### Task 2.2: Update AdminUsersPage
**Acceptance Criteria:**
- [ ] Replace table container with AdminTable component
- [ ] Add AdminStatsCard components at top for user metrics
- [ ] Replace buttons with AdminButton component
- [ ] Consistent spacing and layout

### Task 2.3: Update AdminTransactionsPage
**Acceptance Criteria:**
- [ ] Replace table container with AdminTable component
- [ ] Add AdminStatsCard components for transaction metrics
- [ ] Replace buttons with AdminButton component
- [ ] Filter panel uses consistent styling

### Task 2.4: Update AdminSettingsPage
**Acceptance Criteria:**
- [ ] Replace card containers with AdminCard component
- [ ] Replace buttons with AdminButton component
- [ ] Toggle switches use consistent styling
- [ ] Form inputs use consistent styling

---

## Testing Tasks

### Task 3.1: Visual Consistency Check
- [ ] Compare all pages side by side
- [ ] Verify card styling matches dashboard
- [ ] Verify button styling matches
- [ ] Verify table styling matches

### Task 3.2: Responsive Check
- [ ] Test on mobile (breakpoints < 768px)
- [ ] Test on tablet (768px - 1024px)
- [ ] Test on desktop (> 1024px)
- [ ] Verify grid layouts adapt correctly

---

## Files Reference

### Created Files
1. `src/components/admin/AdminCard.tsx`
2. `src/components/admin/AdminTable.tsx`
3. `src/components/admin/AdminStatsCard.tsx`
4. `src/components/admin/AdminButton.tsx`

### Modified Files
1. `src/app/admin/tokens/page.tsx`
2. `src/app/admin/users/page.tsx`
3. `src/app/admin/transactions/page.tsx`
4. `src/app/admin/settings/page.tsx`

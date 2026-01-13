# Admin Card Styling Standardization

## User Story
As a user, I want all admin pages to have consistent card styling so the dashboard looks professional and cohesive.

## Current State Analysis

### Main Dashboard (`/admin/dashboard`)
Uses consistent card styling:
- Cards: `bg-[#23262F] rounded-xl border border-[#858B9A33]`
- Stats cards with icons and change indicators
- Loading skeletons: `bg-[#23262F] rounded-xl`
- Tables: `bg-[#23262F] rounded-xl border border-[#858B9A33]`

### Other Pages (Need Standardization)
1. `/admin/tokens` - Uses tables, needs consistent stats cards
2. `/admin/users` - Uses tables, needs consistent stats cards
3. `/admin/transactions` - Uses tables with pagination
4. `/admin/settings` - Uses cards with form inputs

## Requirements

### Functional Requirements
1. **Unified Card Component**: Create reusable `AdminCard` component
2. **Unified StatsCard**: Ensure consistency across all pages
3. **Table Styling**: Consistent table container and row styling
4. **Loading States**: Consistent skeleton patterns
5. **Button Styling**: Consistent primary/secondary buttons

### Styling Pattern

#### Card Container
```tsx
// Standard card pattern
<div className="bg-[#23262F] rounded-xl border border-[#858B9A33] p-5">
  {/* content */}
</div>
```

#### Table Container
```tsx
// Standard table pattern
<div className="bg-[#23262F] rounded-xl border border-[#858B9A33]">
  <table className="w-full">
    <thead>
      <tr className="border-b border-[#858B9A33]">
        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
          {/* header */}
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-[#858B9A33]">
      {/* rows */}
    </tbody>
  </table>
</div>
```

#### Stats Card
```tsx
// Stats card pattern from dashboard
<div className="bg-[#23262F] rounded-xl p-5">
  {/* icon, title, value, subtitle, change */}
</div>
```

#### Search Input
```tsx
// Search input pattern
<input
  className="w-full pl-10 pr-4 py-2 bg-[#23262F] border border-[#858B9A33] rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#4459FF]"
/>
```

#### Primary Button
```tsx
<button className="flex items-center gap-2 px-4 py-2 bg-[#4459FF] text-white rounded-lg hover:bg-[#3348EE] transition-colors text-sm font-medium">
  {/* content */}
</button>
```

### Pages to Update

| Page | Current State | Updates Needed |
|------|--------------|----------------|
| `/admin/dashboard` | ✅ Complete | Document pattern |
| `/admin/tokens` | ⚠️ Partial | Add stats cards, standardize table |
| `/admin/users` | ⚠️ Partial | Add stats cards, standardize table |
| `/admin/transactions` | ⚠️ Partial | Add stats cards, standardize filters |
| `/admin/settings` | ⚠️ Partial | Use AdminCard component |

### Components to Create

1. **`AdminCard`** - Reusable card wrapper
2. **`AdminTable`** - Reusable table container
3. **`AdminStatsCard`** - Reusable stats card (if different from existing)
4. **`AdminButton`** - Reusable button component

### Acceptance Criteria
- [ ] All pages use consistent card styling (`bg-[#23262F] rounded-xl border border-[#858B9A33]`)
- [ ] All tables use consistent table container styling
- [ ] All search inputs use consistent input styling
- [ ] All primary buttons use consistent button styling
- [ ] Loading states are consistent across pages
- [ ] Empty states are consistent across pages

### Out of Scope
- Changes to sidebar navigation
- Changes to header styling
- Color theme changes
- Responsive layout changes (already implemented)

# Mobile Component Structure

## Visual Layout

```
┌─────────────────────────────────────┐
│  MobileHeader                       │  ← Sticky (z-40)
│  [Logo] [Search] [Explore]          │
├─────────────────────────────────────┤
│  MobileStatsBar                     │  ← Sticky (z-30)
│  24H VOLUME    |    24H TXNS        │
├─────────────────────────────────────┤
│  MobileFilters                      │  ← Sticky (z-20)
│  [24H] [Trending] [Top] [Gainers]   │
│  [5M] [1H] [6H] [24H]               │
├─────────────────────────────────────┤
│  Token List Header                  │  ← Sticky (z-10)
│  TOKEN          PRICE      VOLUME   │
├─────────────────────────────────────┤
│                                     │
│  MobileTokenRow                     │
│  [Icon] SYMBOL / Name               │
│         6h • 102,815 txns           │
│                      $0.41  +2.58%  │
│                              $19.4M │
├─────────────────────────────────────┤
│  MobileTokenRow                     │
│  [Icon] SYMBOL / Name               │
│         1d • 52,533 txns            │
│                      $0.01  -5.41%  │
│                              $12.4M │
├─────────────────────────────────────┤
│  MobileTokenRow                     │
│  ...                                │
│                                     │
│                                     │
│  (Scrollable Content)               │
│                                     │
│                                     │
│                                     │
│                                     │
├─────────────────────────────────────┤
│  Wallet Balance Bar                 │  ← Fixed Bottom
│  Balance: ₦50,000                   │
│           [Fund +] [Withdraw]       │
├─────────────────────────────────────┤
│  MobileBottomNav                    │  ← Fixed Bottom (z-40)
│  [Home] [Portfolio] [+] [Account]   │
└─────────────────────────────────────┘
```

## Component Hierarchy

```
MobileDashboardContainer
├── MobileHeader
│   ├── Logo
│   ├── Search Button → Opens SearchModal
│   ├── Notification Bell (if authenticated)
│   └── Explore Button → Opens MobileExploreMenu
│
├── MobileStatsBar
│   ├── 24H Volume Display
│   └── 24H Transactions Display
│
├── MobileFilters
│   ├── Category Filters (24H, Trending, Top, Gainers)
│   └── Time Filters (5M, 1H, 6H, 24H)
│
├── Token List
│   ├── Table Header (Sticky)
│   └── MobileTokenRow[] (Multiple)
│       ├── Token Icon
│       ├── Symbol & Name
│       ├── Age & Transaction Count
│       ├── Price & Change
│       └── Volume
│
├── MobileExploreMenu (Conditional)
│   ├── Header with Close Button
│   ├── Search Input
│   ├── User Profile (if authenticated)
│   ├── Navigation Links
│   │   ├── Watchlist
│   │   ├── Portfolio
│   │   ├── List Startup
│   │   ├── Settings
│   │   └── Sign Out
│   └── Social Links
│
├── SearchModal (Conditional)
│   └── Search functionality
│
└── MobileBottomNav
    ├── Wallet Balance Bar (if authenticated)
    │   ├── Balance Display
    │   ├── Fund Button → Opens FundWalletModal
    │   └── Withdraw Button → Opens WithdrawModal
    └── Navigation Tabs
        ├── Home
        ├── Portfolio
        ├── List (Elevated)
        ├── Account
        └── More
```

## Z-Index Layers

```
Layer 50: MobileExploreMenu (Full-screen overlay)
Layer 40: MobileHeader, MobileBottomNav (Fixed navigation)
Layer 30: MobileStatsBar (Sticky stats)
Layer 20: MobileFilters (Sticky filters)
Layer 10: Token List Header (Sticky table header)
Layer 0:  Token List Content (Scrollable)
```

## Sticky Positioning

```
Top Stack (from top to bottom):
┌─────────────────────────────────────┐
│ MobileHeader (top: 0, z-40)         │ ← 57px height
├─────────────────────────────────────┤
│ MobileStatsBar (top: 57px, z-30)    │ ← 72px height
├─────────────────────────────────────┤
│ MobileFilters (top: 129px, z-20)    │ ← 72px height
├─────────────────────────────────────┤
│ Table Header (top: 201px, z-10)     │ ← 40px height
└─────────────────────────────────────┘

Bottom Stack:
┌─────────────────────────────────────┐
│ Wallet Bar (bottom: 72px)           │ ← 48px height
├─────────────────────────────────────┤
│ MobileBottomNav (bottom: 0, z-40)   │ ← 72px height
└─────────────────────────────────────┘
```

## State Management

```
MobileDashboardContainer State:
├── showExplore: boolean
├── showSearch: boolean
├── activeFilter: string ('24h' | 'trending' | 'top' | 'gainers')
├── activeTime: string ('5M' | '1H' | '6H' | '24H')
├── tokens: Token[]
└── loading: boolean

MobileBottomNav State:
├── showFundModal: boolean
└── showWithdrawModal: boolean

MobileHeader State:
├── showSignIn: boolean
└── showSignUp: boolean
```

## Data Flow

```
API Endpoints:
├── /api/tokens
│   └── Fetches all tokens with metadata
│
├── /api/tokens/yield-payouts?period={period}
│   └── Fetches yield data for time period
│
└── /api/tokens/period-volume?period={period}
    └── Fetches volume data for time period

Component Data Flow:
1. MobileDashboardContainer fetches tokens on mount
2. Tokens passed to MobileTokenRow components
3. MobileStatsBar calculates totals from tokens
4. User interactions update local state
5. Navigation triggers route changes
6. Modals handle wallet operations
```

## Interaction Patterns

### Navigation
- Tap token row → Navigate to token detail page
- Tap bottom nav item → Navigate to section
- Tap explore button → Open full-screen menu
- Tap search button → Open search modal

### Wallet Operations
- Tap Fund button → Open fund modal with account details
- Tap Withdraw button → Open withdrawal form
- Balance updates automatically via polling

### Filtering
- Tap category filter → Update token list
- Tap time filter → Update data period
- Filters persist during session

### Menu
- Tap explore → Slide down menu
- Tap backdrop → Close menu
- Tap menu item → Navigate and close
- Tap close button → Close menu

## Responsive Breakpoints

```
Mobile:  < 768px  → MobileDashboardContainer
Tablet:  ≥ 768px  → DashboardContainer (Desktop)
Desktop: ≥ 1024px → DashboardContainer (Desktop)
```

## Performance Considerations

### Optimizations
- Virtual scrolling for 100+ tokens (future)
- Memoized token rows to prevent re-renders
- Debounced search input
- Lazy loading of modals
- Optimistic UI updates

### Loading States
- Skeleton screens for initial load
- Shimmer effects on placeholders
- Spinner for wallet operations
- Progressive enhancement

## Accessibility

### Keyboard Navigation
- Tab through interactive elements
- Enter/Space to activate buttons
- Escape to close modals/menus

### Screen Readers
- ARIA labels on icon buttons
- Semantic HTML structure
- Focus management in modals
- Status announcements

### Touch Targets
- Minimum 44x44px tap areas
- Adequate spacing between elements
- Visual feedback on touch
- No hover-dependent interactions

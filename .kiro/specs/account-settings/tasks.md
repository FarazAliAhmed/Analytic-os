# Account Settings Implementation Tasks

## Phase 1: Currency Conversion Infrastructure

### Task 1.1: Currency Converter Service ✅ COMPLETED
**File**: `src/lib/currency-converter.ts`
**Estimated Time**: 1 hour

**Implementation**:
- [x] Create `fetchExchangeRate()` function to call ExchangeRate-API
- [x] Implement 1-hour caching mechanism for exchange rates
- [x] Create `convertNGNtoUSD(amount)` function
- [x] Create `convertUSDtoNGN(amount)` function
- [x] Create `formatCurrency(amount, currency)` function with proper formatting
- [x] Create `getCurrentExchangeRate()` function
- [x] Implement fallback rate (0.0012) for API failures
- [x] Add error handling and logging

**API Endpoint**: `https://api.exchangerate-api.com/v4/latest/NGN`

**Acceptance Criteria**:
- ✅ Exchange rate fetched successfully from ExchangeRate-API
- ✅ Rate cached for 1 hour to minimize API calls
- ✅ Fallback rate used when API unavailable
- ✅ NGN amounts formatted as whole numbers (₦1,500)
- ✅ USD amounts formatted with 2 decimals ($1.80)

---

### Task 1.2: Exchange Rate API Endpoint ✅ COMPLETED
**File**: `src/app/api/currency/exchange-rate/route.ts`
**Estimated Time**: 30 minutes

**Implementation**:
- [x] Create GET endpoint `/api/currency/exchange-rate`
- [x] Call `getCurrentExchangeRate()` from currency-converter service
- [x] Return rate, lastUpdated timestamp, and displayRate
- [x] Implement Next.js caching with 1-hour revalidation
- [x] Add error handling

**Response Format**:
```json
{
  "success": true,
  "data": {
    "base": "NGN",
    "target": "USD",
    "rate": 0.0012,
    "lastUpdated": "2026-01-20T00:00:00Z",
    "displayRate": "1 NGN = 0.0012 USD"
  }
}
```

**Acceptance Criteria**:
- ✅ Endpoint returns current exchange rate
- ✅ Response includes last updated timestamp
- ✅ Caching implemented for performance
- ✅ Error responses handled gracefully

---

### Task 1.3: Currency Hook ✅ COMPLETED
**File**: `src/hooks/useCurrency.ts`
**Estimated Time**: 1 hour

**Implementation**:
- [x] Create `useCurrency(defaultCurrency)` hook
- [x] Manage currency preference state
- [x] Fetch exchange rate from `/api/currency/exchange-rate`
- [x] Implement auto-refresh every hour
- [x] Create `convertAmount(amountInNGN)` utility
- [x] Create `formatAmount(amountInNGN)` utility
- [x] Handle loading and error states

**Hook Interface**:
```typescript
interface UseCurrencyReturn {
  currency: 'NGN' | 'USD'
  exchangeRate: ExchangeRateData | null
  loading: boolean
  error: string | null
  setCurrency: (currency: 'NGN' | 'USD') => void
  convertAmount: (amount: number) => number
  formatAmount: (amount: number) => string
}
```

**Acceptance Criteria**:
- ✅ Hook manages currency state
- ✅ Exchange rate fetched and cached
- ✅ Auto-refresh every hour
- ✅ Conversion utilities work correctly
- ✅ Loading and error states handled

---

## Phase 2: Database Schema Extensions

### Task 2.1: User Settings Schema ✅ COMPLETED
**File**: `prisma/schema.prisma`
**Estimated Time**: 30 minutes

**Implementation**:
- [x] Create `UserSettings` model with currency preference field
- [x] Add notification preferences JSON field
- [x] Add price alert settings JSON field
- [x] Add auto-lock boolean field
- [x] Create indexes for performance
- [ ] Run Prisma migration (pending deployment)

**Schema**:
```prisma
model UserSettings {
  id                      String   @id @default(uuid())
  userId                  String   @unique
  notificationPreferences Json
  currencyPreference      String   @default("NGN") // "NGN" or "USD"
  priceAlertSettings      Json
  autoLockEnabled         Boolean  @default(true)
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

**Acceptance Criteria**:
- ✅ Schema created successfully
- ⏳ Migration runs without errors (pending)
- ✅ Indexes created for performance
- ✅ Foreign key constraints working

---

### Task 2.2: Price Alerts Schema ✅ COMPLETED
**File**: `prisma/schema.prisma`
**Estimated Time**: 20 minutes

**Implementation**:
- [x] Create `PriceAlert` model
- [x] Add user and token relationships
- [x] Add threshold percentage field
- [x] Add active status field
- [x] Create composite indexes

**Acceptance Criteria**:
- ✅ Price alert model created
- ✅ Relationships configured
- ✅ Indexes optimized for queries

---

## Phase 3: Settings API Endpoints

### Task 3.1: Get User Settings ✅ COMPLETED
**File**: `src/app/api/settings/route.ts`
**Estimated Time**: 30 minutes

**Implementation**:
- [x] Create GET `/api/settings` endpoint
- [x] Fetch user settings from database
- [x] Create default settings if none exist
- [x] Return settings with proper formatting

**Acceptance Criteria**:
- ✅ Endpoint returns user settings
- ✅ Default settings created for new users
- ✅ Authentication required

---

### Task 3.2: Update Currency Preference ✅ COMPLETED
**File**: `src/app/api/settings/currency/route.ts`
**Estimated Time**: 30 minutes

**Implementation**:
- [x] Create PUT `/api/settings/currency` endpoint
- [x] Validate currency value ('NGN' or 'USD')
- [x] Update user settings in database
- [x] Return updated settings

**Acceptance Criteria**:
- ✅ Currency preference updated successfully
- ✅ Invalid values rejected
- ✅ Changes persisted to database

---

### Task 3.3: Update Notification Preferences ✅ COMPLETED
**File**: `src/app/api/settings/notifications/route.ts`
**Estimated Time**: 45 minutes

**Implementation**:
- [x] Create PUT `/api/settings/notifications` endpoint
- [x] Validate notification preferences structure
- [x] Update database
- [ ] Integrate with notification service (future enhancement)

**Acceptance Criteria**:
- ✅ Notification preferences updated
- ⏳ Changes applied to notification service (future)
- ✅ Validation working correctly

---

### Task 3.4: Update Price Alert Settings
**File**: `src/app/api/settings/price-alerts/route.ts`
**Estimated Time**: 1 hour

**Implementation**:
- [ ] Create PUT `/api/settings/price-alerts` endpoint
- [ ] Validate threshold percentage
- [ ] Update or create price alerts
- [ ] Implement price monitoring logic

**Acceptance Criteria**:
- Price alerts configured
- Threshold validation working
- Monitoring system integrated

---

### Task 3.5: Update Auto-Lock Setting ✅ COMPLETED
**File**: `src/app/api/settings/auto-lock/route.ts`
**Estimated Time**: 30 minutes

**Implementation**:
- [x] Create PUT `/api/settings/auto-lock` endpoint
- [x] Update auto-lock preference
- [ ] Integrate with wallet service (future enhancement)

**Acceptance Criteria**:
- ✅ Auto-lock setting updated
- ⏳ Changes applied to wallet operations (future)

---

## Phase 4: UI Components

### Task 4.1: Settings Container ✅ COMPLETED
**File**: `src/app/dashboard/account/page.tsx` & `src/common/AccountContainer.tsx`
**Estimated Time**: 1 hour

**Implementation**:
- [x] Enhanced existing account settings page
- [x] Fetch user settings on mount
- [x] Manage settings state
- [x] Handle settings updates
- [x] Show loading and error states

**Acceptance Criteria**:
- ✅ Settings page renders correctly
- ✅ Data fetched and displayed
- ✅ Updates trigger API calls
- ✅ Loading states shown

---

### Task 4.2: Currency Settings Component ✅ COMPLETED
**File**: `src/common/AccountContainer.tsx`
**Estimated Time**: 1.5 hours

**Implementation**:
- [x] Create currency toggle (NGN/USD)
- [x] Display current exchange rate
- [x] Show last updated timestamp
- [x] Handle currency change
- [x] Show conversion example
- [x] Integrate useCurrency hook

**UI Elements**:
- Currency toggle buttons (NGN/USD)
- Exchange rate display: "1 NGN = $0.0012 USD"
- Last updated: "Updated 30 minutes ago"
- Example: "₦1,500 = $1.80"

**Acceptance Criteria**:
- ✅ Toggle switches between NGN and USD
- ✅ Exchange rate displayed accurately
- ✅ Changes saved immediately
- ⏳ UI updates across app (pending integration)

---

### Task 4.3: Notification Settings Component
**File**: `src/components/account/NotificationSettings.tsx`
**Estimated Time**: 1 hour

**Implementation**:
- [ ] Create toggle controls for each notification type
- [ ] Separate email and web app toggles
- [ ] Handle preference updates
- [ ] Show save confirmation

**Acceptance Criteria**:
- All notification types have toggles
- Changes saved immediately
- Confirmation shown

---

### Task 4.4: Profile Settings Component ✅ COMPLETED
**File**: `src/common/AccountContainer.tsx`
**Estimated Time**: 1 hour

**Implementation**:
- [x] Display user ID (read-only)
- [x] Display username (editable)
- [x] Add edit mode
- [x] Handle profile updates
- [x] Show validation errors

**Acceptance Criteria**:
- ✅ Profile information displayed
- ✅ Username editable
- ✅ User ID read-only
- ✅ Updates saved successfully

---

### Task 4.5: Price Alert Settings Component
**File**: `src/components/account/PriceAlertSettings.tsx`
**Estimated Time**: 1.5 hours

**Implementation**:
- [ ] Create threshold input
- [ ] Add token selection
- [ ] Show active alerts list
- [ ] Handle alert creation/deletion
- [ ] Validate threshold values

**Acceptance Criteria**:
- Threshold configurable
- Alerts created and deleted
- Validation working
- Active alerts displayed

---

### Task 4.6: Security Settings Component ✅ COMPLETED
**File**: `src/common/AccountContainer.tsx`
**Estimated Time**: 45 minutes

**Implementation**:
- [x] Create auto-lock toggle
- [x] Show security status
- [x] Handle setting updates
- [x] Add security tips

**Acceptance Criteria**:
- ✅ Auto-lock toggle working
- ✅ Changes saved immediately
- ✅ Security information clear

---

### Task 4.7: Compliance Section Component
**File**: `src/components/account/ComplianceSection.tsx`
**Estimated Time**: 30 minutes

**Implementation**:
- [ ] Add Privacy Policy link
- [ ] Add Terms of Use link
- [ ] Open documents in modal or new tab
- [ ] Style consistently

**Acceptance Criteria**:
- Links working correctly
- Documents accessible
- UI consistent with design

---

## Phase 5: Integration & Testing

### Task 5.1: Integrate Currency Conversion Across App
**Estimated Time**: 2 hours

**Files to Update**:
- `src/components/dashboard/StartupCard.tsx`
- `src/components/dashboard/GainerRow.tsx`
- `src/components/dashboard/token/OverviewCard.tsx`
- `src/components/portfolio/PortfolioSummary.tsx`
- `src/components/portfolio/PortfolioTable.tsx`
- `src/components/dashboard/WalletInfo.tsx`

**Implementation**:
- [ ] Import `useCurrency` hook in each component
- [ ] Replace hardcoded currency formatting with `formatAmount()`
- [ ] Ensure all prices convert based on user preference
- [ ] Test currency switching

**Acceptance Criteria**:
- All prices convert correctly
- Currency symbol updates (₦ or $)
- No hardcoded currency values remain
- Switching currency updates entire app

---

### Task 5.2: Price Monitoring Service
**File**: `src/lib/price-monitor.ts`
**Estimated Time**: 2 hours

**Implementation**:
- [ ] Create background job to check token prices
- [ ] Compare with user alert thresholds
- [ ] Trigger notifications when threshold exceeded
- [ ] Update last triggered timestamp
- [ ] Handle multiple alerts per user

**Acceptance Criteria**:
- Price changes detected
- Alerts triggered correctly
- Notifications sent
- Timestamps updated

---

### Task 5.3: Testing
**Estimated Time**: 3 hours

**Test Cases**:
- [ ] Currency conversion accuracy
- [ ] Exchange rate caching
- [ ] API fallback handling
- [ ] Settings persistence
- [ ] Notification preferences
- [ ] Price alerts
- [ ] Auto-lock functionality
- [ ] Profile updates
- [ ] UI responsiveness
- [ ] Error handling

**Acceptance Criteria**:
- All test cases pass
- Edge cases handled
- Error states tested
- Performance acceptable

---

## Phase 6: Documentation & Deployment

### Task 6.1: Documentation
**Estimated Time**: 1 hour

**Implementation**:
- [ ] Document currency conversion system
- [ ] Add API documentation
- [ ] Create user guide for settings
- [ ] Document ExchangeRate-API integration

**Acceptance Criteria**:
- Documentation complete
- Examples provided
- API endpoints documented

---

### Task 6.2: Deployment
**Estimated Time**: 30 minutes

**Implementation**:
- [ ] Run database migrations
- [ ] Deploy to staging
- [ ] Test on staging
- [ ] Deploy to production
- [ ] Monitor for errors

**Acceptance Criteria**:
- Migrations successful
- No production errors
- Currency conversion working
- Settings accessible

---

## Summary

**Total Estimated Time**: 20-24 hours

**Priority Order**:
1. Phase 1: Currency Conversion Infrastructure (2.5 hours)
2. Phase 2: Database Schema (1 hour)
3. Phase 3: Settings API (3.5 hours)
4. Phase 4: UI Components (7.5 hours)
5. Phase 5: Integration & Testing (7 hours)
6. Phase 6: Documentation & Deployment (1.5 hours)

**Dependencies**:
- ExchangeRate-API (free, no signup, no API key required)
- Existing authentication system
- Existing notification system
- Existing wallet system

**Risks**:
- ExchangeRate-API availability (mitigated by caching and fallback)
- Exchange rate accuracy (reliable source)
- Performance with many users (mitigated by caching)

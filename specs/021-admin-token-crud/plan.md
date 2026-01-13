# Implementation Plan: Admin Token Management CRUD

**Branch**: `021-admin-token-crud` | **Date**: 2026-01-11 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/021-admin-token-crud/spec.md`

## Summary

Implement full CRUD operations for the admin token management page with real API integration. The API routes already exist (`/api/admin/tokens` and `/api/admin/tokens/[id]`), so the focus is on frontend integration with TanStack Query, proper state management, and modal-based forms for create/edit operations. Tokens created by admins will automatically be visible to public users through the existing public API.

## Technical Context

**Language/Version**: TypeScript 5 (strict mode)
**Primary Dependencies**: Next.js 15 (App Router), React 19, TanStack Query 5, Tailwind CSS 4
**Storage**: PostgreSQL with Prisma ORM (already configured)
**Testing**: Jest with React Testing Library
**Target Platform**: Web (desktop + mobile)
**Project Type**: Single web application (Next.js)
**Performance Goals**: Page load < 2s, API operations < 500ms, smooth modal transitions
**Constraints**: Must match existing admin design system, use Zod for form validation
**Scale/Scope**: Admin-only functionality with public token visibility

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Requirement | Status | Notes |
|-------------|--------|-------|
| TypeScript strict mode | ✅ Pass | Using existing codebase TS config |
| Zod for runtime validation | ✅ Pass | Already in use for API validation |
| TanStack Query for server state | ✅ Pass | Will use `useQuery` and `useMutation` |
| Dark theme by default | ✅ Pass | Following existing admin theme |
| Loading states for async ops | ✅ Pass | Will implement skeletons/spinners |
| User-friendly error messages | ✅ Pass | Will implement toast notifications |
| Responsive design | ✅ Pass | Mobile-friendly tables and modals |

## Project Structure

### Documentation (this feature)

```text
specs/021-admin-token-crud/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (not needed - APIs exist)
├── data-model.md        # Phase 1 output (Prisma already has Token model)
├── quickstart.md        # Phase 1 output (component structure)
├── contracts/           # Phase 1 output (API contracts already defined)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
src/
├── app/admin/tokens/
│   ├── page.tsx         # Main token management page (update)
│   └── components/
│       ├── TokenTable.tsx      # Table component for tokens
│       ├── TokenStats.tsx      # Stats cards component
│       ├── TokenFormModal.tsx  # Create/edit modal form
│       └── DeleteConfirmModal.tsx # Delete confirmation dialog
├── components/admin/           # Shared admin components
│   ├── AdminModal.tsx          # Reusable modal wrapper
│   └── NotificationToast.tsx   # Toast notifications
├── lib/
│   ├── api/
│   │   └── admin-tokens.ts     # API client functions
│   └── hooks/
│       └── useAdminTokens.ts   # TanStack Query hooks
├── types/
│   └── admin.ts                # TypeScript types for tokens
└── app/api/tokens/             # Public API (already exists)
```

**Structure Decision**: Feature-specific components in `src/app/admin/tokens/components/` following existing admin pattern. API client in `src/lib/api/` following existing codebase conventions.

## Complexity Tracking

> No constitution violations requiring justification. All requirements satisfied with existing stack.

---

## Phase 1: Design & Contracts

### Existing API Contracts

The API routes are already implemented. Here's the contract summary:

**GET /api/admin/tokens**
```json
{
  "success": true,
  "tokens": [
    {
      "id": "uuid",
      "tokenId": "PYSK-001",
      "name": "Paystack Token",
      "symbol": "PYSK",
      "price": 8500,
      "annualYield": 12.5,
      "industry": "FinTech",
      "payoutFrequency": "Monthly",
      "investmentType": "Equity",
      "riskLevel": "Medium",
      "listingDate": "2025-01-15T00:00:00Z",
      "closeDate": null,
      "logoUrl": "https://...",
      "minimumInvestment": 50000,
      "employeeCount": 250,
      "description": "...",
      "volume": 1250000,
      "transactionCount": 45,
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

**POST /api/admin/tokens**
- Body: Token creation fields (name, symbol, price, annualYield, industry, payoutFrequency, investmentType, riskLevel, listingDate, minimumInvestment, employeeCount, description, logoUrl, closeDate)
- Returns: Created token with 201 status
- Errors: 400 (validation), 409 (duplicate symbol)

**PUT /api/admin/tokens/[id]**
- Body: Partial update fields
- Returns: Updated token
- Errors: 400 (validation), 404 (not found)

**DELETE /api/admin/tokens/[id]**
- Action: Soft delete (sets isActive to false)
- Returns: Success message
- Errors: 404 (not found)

### Data Model (Prisma)

The Token model already exists in `prisma/schema.prisma`:

```prisma
model Token {
  id               String   @id @default(uuid())
  tokenId          String?  @unique
  name             String
  symbol           String   @unique
  price            Int
  annualYield      Decimal  @db.Decimal(5, 2)
  industry         String
  payoutFrequency  String
  investmentType   String
  riskLevel        String
  listingDate      DateTime
  closeDate        DateTime?
  logoUrl          String?
  minimumInvestment Int
  employeeCount    Int
  description      String?  @db.Text
  volume           Int      @default(0)
  transactionCount Int      @default(0)
  isActive         Boolean  @default(true)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  @@index([symbol])
  @@index([industry])
  @@index([isActive])
  @@index([tokenId])
}
```

### Frontend TypeScript Types

```typescript
interface Token {
  id: string
  tokenId: string | null
  name: string
  symbol: string
  price: number
  annualYield: number
  industry: string
  payoutFrequency: string
  investmentType: string
  riskLevel: string
  listingDate: string
  closeDate: string | null
  logoUrl: string | null
  minimumInvestment: number
  employeeCount: number
  description: string | null
  volume: number
  transactionCount: number
  isActive: boolean
  createdAt: string
}

interface TokenFormData {
  name: string
  symbol: string
  price: number
  annualYield: number
  industry: string
  payoutFrequency: string
  investmentType: string
  riskLevel: string
  listingDate: string
  closeDate?: string
  logoUrl?: string
  minimumInvestment: number
  employeeCount: number
  description?: string
}

interface TokenStats {
  totalTokens: number
  activeTokens: number
  totalVolume: number
}
```

### Component Architecture

```
AdminTokensPage
├── TokenStats (3 stat cards)
├── SearchBar (flexbox input with icon)
├── TokenTable
│   └── rows with actions: Edit, Toggle, Delete
├── TokenFormModal (create/edit)
│   └── form with Zod validation
└── DeleteConfirmModal
```

### Quickstart: Implementation Order

1. **Setup Types**: Create `src/types/admin.ts` with Token and form types
2. **API Client**: Create `src/lib/api/admin-tokens.ts` with fetch functions
3. **TanStack Query Hooks**: Create `src/lib/hooks/useAdminTokens.ts`
4. **Update Page**: Refactor `src/app/admin/tokens/page.tsx` to use React Query
5. **TokenFormModal**: Create modal component with form validation
6. **DeleteConfirmModal**: Create confirmation dialog
7. **Testing**: Verify all CRUD operations work with existing API

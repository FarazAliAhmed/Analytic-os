# Implementation Plan: token-creation

**Branch**: `014-token-creation` | **Date**: 2026-01-07 | **Spec**: [spec.md](spec.md)

## Summary

Backend API for admin to create, update, delete, and list tokens. Frontend admin UI to be added later.

## Technical Context

**Language/Version**: TypeScript / Next.js 14
**Primary Dependencies**: Next.js App Router, Prisma, Tailwind CSS
**Storage**: PostgreSQL (via Prisma)
**Target Platform**: Backend API only (admin UI later)

## Project Structure

```text
src/
├── app/api/admin/tokens/
│   ├── route.ts         # GET (list), POST (create)
│   └── [id]/
│       └── route.ts     # GET (single), PUT (update), DELETE
├── prisma/
│   └── schema.prisma    # Add Token model
└── lib/
    └── token-service.ts # Token business logic
```

## Technical Design

### API Contract

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/tokens | List all tokens |
| POST | /api/admin/tokens | Create new token |
| GET | /api/admin/tokens/[id] | Get single token |
| PUT | /api/admin/tokens/[id] | Update token |
| DELETE | /api/admin/tokens/[id] | Delete token |

### Request/Response

```typescript
// POST /api/admin/tokens
interface CreateTokenRequest {
  name: string
  symbol: string
  price: number  // NGN
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

interface TokenResponse {
  id: string
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
  createdAt: string
}
```

### Data Model

```prisma
model Token {
  id              String   @id @default(uuid())
  name            String
  symbol          String   @unique
  price           Int      // in kobo (e.g., 150000 = ₦1,500)
  annualYield     Decimal  @db.Decimal(5, 2)
  industry        String
  payoutFrequency String
  investmentType  String
  riskLevel       String
  listingDate     DateTime
  closeDate       DateTime?
  logoUrl         String?
  minimumInvestment Int    // in kobo
  employeeCount   Int
  description     String?  @db.Text
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([symbol])
  @@index([industry])
}
```

## Implementation Steps

### Phase 1: Data Model
- Add Token model to schema
- Run prisma db push

### Phase 2: API Routes
- Create GET /api/admin/tokens (list)
- Create POST /api/admin/tokens (create)
- Create GET /api/admin/tokens/[id] (single)
- Create PUT /api/admin/tokens/[id] (update)
- Create DELETE /api/admin/tokens/[id] (delete)

### Phase 3: Admin Auth
- Add admin role check middleware

---

*To proceed to tasks, run `/sp.tasks`*

# Implementation Plan: search-integration

**Branch**: `010-search-integration` | **Date**: 2026-01-05 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/010-search-integration/spec.md`

## Summary

Connect the search bar on the dashboard to the backend API for real-time search functionality. Users can search startups/companies/tokens by name with real-time suggestions, filter by categories (industry, market cap, yield), and see recent search history.

## Technical Context

**Language/Version**: TypeScript / Next.js 14
**Primary Dependencies**: Next.js App Router, Prisma, Tailwind CSS
**Storage**: PostgreSQL (via Prisma), existing startup/company data
**Testing**: Jest / React Testing Library
**Target Platform**: Web (responsive)
**Project Type**: Single project (Next.js web app)
**Performance Goals**: Search results within 2 seconds
**Constraints**: Real-time search with debouncing, handle backend unavailability
**Scale/Scope**: Dashboard search for 100+ startups/companies

## Constitution Check

### Code Quality Gates
- ✅ Smallest viable change - search integrated into existing dashboard
- ✅ No over-engineering - using existing patterns (like notifications)
- ✅ No premature abstraction - components created as needed

### Testing Gates
- Unit tests for search hook
- Component tests for search dropdown

### Performance Gates
- API response < 2 seconds
- Debounced input to reduce API calls

### Security Gates
- Auth not required for basic search
- Rate limiting on API endpoint

## Project Structure

### Documentation (this feature)

```text
specs/010-search-integration/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # N/A - using existing stack
├── data-model.md        # API contracts
├── quickstart.md        # Testing scenarios
└── contracts/           # API endpoints
```

### Source Code (repository root)

```text
src/
├── app/api/search/
│   └── route.ts         # Search API endpoint
├── components/dashboard/
│   ├── SearchBar.tsx    # Search input component
│   └── SearchDropdown.tsx # Results dropdown
├── hooks/
│   └── useSearch.ts     # Search hook with debounce
└── lib/
    └── search.ts        # Search utilities
```

**Structure Decision**: Single Next.js project using App Router. Search API at `/api/search`, components in `components/dashboard/`, reusable hook in `hooks/`.

## Technical Design

### API Contract

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/search | Search startups/companies with query and filters |
| GET | /api/search/recent | Get recent searches (auth required) |
| DELETE | /api/search/recent | Clear recent searches (auth required) |

### Request/Response

```typescript
// GET /api/search?q=tesla&industry=fintech&limit=10
interface SearchRequest {
  q?: string           // search query
  industry?: string    // filter by industry
  minPrice?: number    // filter by price range
  maxPrice?: number
  minMarketCap?: number
  maxMarketCap?: number
  minYield?: number
  maxYield?: number
  limit?: number       // default 10
}

interface SearchResult {
  id: string
  name: string
  symbol: string
  price: number
  industry: string
  marketCap: number
  annualYield: number
  logo?: string
}
```

### Components

1. **SearchBar** - Input field with search icon
2. **SearchDropdown** - Results dropdown with tabs for All/Results/Filters
3. **useSearch** - Custom hook with debouncing (300ms)

## Phase 0: Research

**COMPLETED** - Using existing Next.js + Prisma stack patterns from codebase.

## Phase 1: Design Artifacts

### Data Model
Search uses existing Startup/Company entities in the database. No new models needed.

### API Contracts
- `GET /api/search` - Search with query params
- `GET /api/search/recent` - Recent searches (auth)
- `DELETE /api/search/recent` - Clear history (auth)

### Quickstart
1. Type in search bar → results appear after 300ms debounce
2. Click result → navigate to detail page
3. Apply filters → results update
4. Sign in → see recent searches

## Implementation Tasks (Phase 2)

### Task 1: API Routes
- [ ] Create `/api/search/route.ts` - Search endpoint
- [ ] Create `/api/search/recent/route.ts` - Recent searches

### Task 2: Components
- [ ] Create `SearchBar.tsx` - Search input
- [ ] Create `SearchDropdown.tsx` - Results display
- [ ] Update `Header.tsx` to use SearchBar

### Task 3: Hooks
- [ ] Create `useSearch.ts` - Debounced search hook

### Task 4: Integration
- [ ] Connect to existing SearchBar location in dashboard
- [ ] TypeScript verification

## Quickstart Commands

```bash
# Test search functionality
# 1. Navigate to dashboard
# 2. Type "PYSK" in search bar
# 3. Verify results appear in < 2 seconds
# 4. Click result to navigate to detail
# 5. Sign in, perform search, verify in recent history
```

## Next Steps

1. Run `/sp.tasks` to generate detailed task list
2. Execute implementation
3. Test with Playwright

---
id: "0001"
title: "Watchlist Feature Implementation"
stage: "green"
date_iso: "2026-01-07"
surface: "agent"
model: "MiniMax-M2.1"
feature: "watchlist"
branch: "011-withdrawal-form"
user: "let impmlemt thsi on wher we have portpflo all token and wishtlist using specfpluys"
command: "let impmlemt thsi on wher we have portpflo all token and wishtlist using specfpluys"
labels:
  - "watchlist"
  - "spec-driven-development"
  - "fullstack"
  - "portfolio"
links:
  spec: "specs/016-watchlist/spec.md"
  plan: "specs/016-watchlist/plan.md"
  tasks: "specs/016-watchlist/tasks.md"
files_yaml: |
  - specs/016-watchlist/spec.md
  - specs/016-watchlist/plan.md
  - specs/016-watchlist/tasks.md
  - src/app/api/watchlist/route.ts (GET, POST)
  - src/app/api/watchlist/[tokenId]/route.ts (DELETE)
  - src/app/api/watchlist/ids/route.ts (GET token IDs)
  - src/app/api/watchlist/count/route.ts (GET count)
  - src/components/watchlist/WatchlistButton.tsx
  - src/components/portfolio/PortfolioHoldings.tsx (updated)
  - src/components/portfolio/PortfolioTable.tsx (updated)
tests_yaml: |
  - curl -X POST http://localhost:3000/api/watchlist -d '{"tokenId":"..."}'
  - curl http://localhost:3000/api/watchlist
  - curl http://localhost:3000/api/watchlist/ids
  - curl http://localhost:3000/api/watchlist/count
  - curl -X DELETE http://localhost:3000/api/watchlist/TOKEN_ID
---

# Prompt Text

let impmlemt thsi on wher we have portpflo all token and wishtlist using specfpluys

# Response Text

Implemented Watchlist feature using SpecifyPlus workflow:

1. **Created design artifacts:**
   - `specs/016-watchlist/spec.md` - Feature specification
   - `specs/016-watchlist/plan.md` - Architecture decisions
   - `specs/016-watchlist/tasks.md` - Implementation task list

2. **Backend implemented (reusing existing Wishlist Prisma model):**
   - `GET /api/watchlist` - List all watchlist items with token details
   - `POST /api/watchlist` - Add token to watchlist
   - `DELETE /api/watchlist/[tokenId]` - Remove from watchlist
   - `GET /api/watchlist/ids` - Lightweight endpoint for batch checking
   - `GET /api/watchlist/count` - Get watchlist count

3. **Frontend implemented:**
   - `WatchlistButton` component with star icon toggle and optimistic updates
   - `PortfolioHoldings` - Updated to fetch watchlist IDs and filter holdings
   - `PortfolioTable` - Updated to accept holdings data and show watchlist status
   - All Tokens / Watchlist tabs with dynamic counts
   - Yellow indicator on tokens in watchlist

4. **Test commands:**
```bash
# Add token to watchlist
curl -X POST http://localhost:3000/api/watchlist \
  -H "Content-Type: application/json" \
  -d '{"tokenId":"TOKEN_ID"}'

# Get all watchlist items
curl http://localhost:3000/api/watchlist

# Get token IDs only
curl http://localhost:3000/api/watchlist/ids

# Get count
curl http://localhost:3000/api/watchlist/count

# Remove from watchlist
curl -X DELETE http://localhost:3000/api/watchlist/TOKEN_ID
```

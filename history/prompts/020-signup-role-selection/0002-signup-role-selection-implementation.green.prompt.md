---
id: "0001"
title: "Signup Role Selection Implementation"
stage: "green"
date: "2026-01-11"
surface: "agent"
model: "MiniMax-M2.1"
feature: "signup-role-selection"
branch: "011-withdrawal-form"
user: "when i sign up i should have option in dropdown to signup as admin or user as we already passing role so use that role exactly also for user give me good role name"
command: "ok"
labels: ["signup", "role", "admin", "implementation"]
links:
  spec: "specs/020-signup-role-selection/spec.md"
  plan: "specs/020-signup-role-selection/plan.md"
  tasks: "specs/020-signup-role-selection/tasks.md"
  ticket: null
  adr: null
  pr: null
files:
  - prisma/schema.prisma (updated: USER -> INVESTOR)
  - src/app/api/auth/register/route.ts (added role field)
  - src/components/dashboard/SignUpModal.tsx (added role selection UI)
tests: []
---

## Prompt

when i sign up i should have option in dropdown to signup as admin or user as we already passing role so use that role exactly also for user give me good role name

## Response snapshot

Approved spec and implemented signup role selection:

**Database Changes (prisma/schema.prisma):**
- Updated UserRole enum: `USER, ADMIN` → `INVESTOR, ADMIN`
- Default role: `USER` → `INVESTOR`

**API Changes (src/app/api/auth/register/route.ts):**
- Added `role: z.enum(['INVESTOR', 'ADMIN']).optional()` to validation
- Added `role: data.role || 'INVESTOR'` to user creation

**UI Changes (src/components/dashboard/SignUpModal.tsx):**
- Added role state: `useState<'INVESTOR' | 'ADMIN'>('INVESTOR')`
- Added role selection UI with two card buttons before password field
- Passes role to registration API
- Resets role on form close

**UI Design:**
```
┌─────────────────────────────────────┐
│  Account Type                       │
├─────────────────────────────────────┤
│  ┌─────────┐    ┌─────────┐        │
│  │Investor │    │  Admin  │        │
│  │Access   │    │ Manage  │        │
│  │invest...│    │ plat... │        │
│  └─────────┘    └─────────┘        │
└─────────────────────────────────────┘
```

## Outcome

- ✅ Impact: Users can now select account type (Investor/Admin) during signup
- 🧪 Tests: Manual verification pending
- 📁 Files: 3 files modified
- 🔁 Next prompts: Run `npm run dev` to test
- 🧠 Reflection: Good role naming (INVESTOR) improves clarity

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Pending browser testing
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Add admin approval workflow for admin accounts

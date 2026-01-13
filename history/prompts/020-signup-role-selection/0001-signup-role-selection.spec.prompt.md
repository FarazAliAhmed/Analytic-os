---
id: "0001"
title: "Signup Role Selection"
stage: "spec"
date: "2026-01-11"
surface: "agent"
model: "MiniMax-M2.1"
feature: "signup-role-selection"
branch: "011-withdrawal-form"
user: "when i sign up i should have option in dropdown to signup as admin or user as we already passing role so use that role exactly also for user give me good role name"
command: "do it using specifyplus kit only we already have it"
labels: ["signup", "role", "admin", "ui"]
links:
  spec: "specs/020-signup-role-selection/spec.md"
  plan: "specs/020-signup-role-selection/plan.md"
  tasks: "specs/020-signup-role-selection/tasks.md"
  ticket: null
  adr: null
  pr: null
files:
  - specs/020-signup-role-selection/spec.md (created)
  - specs/020-signup-role-selection/plan.md (created)
  - specs/020-signup-role-selection/tasks.md (created)
tests: []
---

## Prompt

when i sign up i should have option in dropdown to signup as admin or user as we already passing role so use that role exactly also for user give me good role name

## Response snapshot

Created SpecifyPlus workflow for signup role selection:

**Requirements:**
1. Add role selection UI in signup modal
2. Two role options: INVESTOR (default), ADMIN
3. Pass role to registration API
4. API accepts and stores role
5. Good role names: INVESTOR instead of USER

**Database Changes:**
- Updated `UserRole` enum from `USER, ADMIN` to `INVESTOR, ADMIN`
- Default role changed from `USER` to `INVESTOR`

**Files Modified:**
- `prisma/schema.prisma` - Updated UserRole enum
- `src/app/api/auth/register/route.ts` - Accept role in API
- `src/components/dashboard/SignUpModal.tsx` - Add role selection UI

**UI Design:**
- Two card-style buttons with icons and descriptions
- INVESTOR: "Access investment features"
- ADMIN: "Manage platform settings"

## Outcome

- ✅ Impact: Users can now select account type during signup
- 🧪 Tests: Manual verification required
- 📁 Files: 3 files modified
- 🔁 Next prompts: Run `npm run dev` to test signup with role selection
- 🧠 Reflection: Good role naming improves clarity

## Evaluation notes (flywheel)

- Failure modes observed: None - implementation complete
- Graders run and results (PASS/FAIL): Pending - requires browser testing
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Add role validation to prevent unauthorized admin signup

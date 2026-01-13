---
id: "0001"
title: "Admin Card Styling Spec"
stage: "spec"
date: "2026-01-11"
surface: "agent"
model: "MiniMax-M2.1"
feature: "admin-card-styling"
branch: "011-withdrawal-form"
user: "i recenlty implment a admin dashbord i setup it now i need your exptersie i want you follow my main dahsbord admin page stlying and apply to all other sidebar page as well see i am using what card stlying apply it to other page card as well dashrbdo card is already waht i want so do it using specifyplus"
command: "follow my main dahsbord admin page stlying and apply to all other sidebar page"
labels: ["admin", "styling", "components"]
links:
  spec: "specs/019-admin-card-styling/spec.md"
  plan: "specs/019-admin-card-styling/plan.md"
  tasks: "specs/019-admin-card-styling/tasks.md"
  ticket: null
  adr: null
  pr: null
files:
  - specs/019-admin-card-styling/spec.md (created)
  - specs/019-admin-card-styling/plan.md (created)
  - specs/019-admin-card-styling/tasks.md (created)
tests: []
---

## Prompt

i recenlty implment a admin dashbord i setup it now i need your exptersie i want you follow my main dahsbord admin page stlying and apply to all other sidebar page as well see i am using what card stlying apply it to other page card as well dashrbdo card is already waht i want so do it using specifyplus

## Response snapshot

Created SpecifyPlus workflow for admin card styling standardization:

1. **Analyzed existing admin pages:**
   - `/admin/dashboard` - main reference with consistent styling
   - `/admin/tokens` - needs standardization
   - `/admin/users` - needs standardization
   - `/admin/transactions` - needs standardization
   - `/admin/settings` - needs standardization

2. **Identified styling pattern:**
   - Cards: `bg-[#23262F] rounded-xl border border-[#858B9A33]`
   - Tables: `bg-[#23262F] rounded-xl border border-[#858B9A33]`
   - Stats cards: `bg-[#23262F] rounded-xl p-5`
   - Buttons: `bg-[#4459FF] text-white rounded-lg hover:bg-[#3348EE]`
   - Search inputs: `bg-[#23262F] border border-[#858B9A33] rounded-lg`

3. **Created artifacts:**
   - `specs/019-admin-card-styling/spec.md` - requirements and current state
   - `specs/019-admin-card-styling/plan.md` - implementation plan
   - `specs/019-admin-card-styling/tasks.md` - 4 phases with testable tasks

4. **Component strategy:**
   - Create reusable AdminCard, AdminTable, AdminStatsCard, AdminButton
   - Update all admin pages to use consistent components

## Outcome

- ✅ Impact: Standardized styling across all admin pages
- 🧪 Tests: Manual visual verification required
- 📁 Files: 3 spec files created
- 🔁 Next prompts: Execute Phase 1 (create components), Phase 2-4 (update pages)
- 🧠 Reflection: Created comprehensive spec with reusable component approach

## Evaluation notes (flywheel)

- Failure modes observed: None - analysis complete
- Graders run and results (PASS/FAIL): N/A - planning phase
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Create AdminCard component first

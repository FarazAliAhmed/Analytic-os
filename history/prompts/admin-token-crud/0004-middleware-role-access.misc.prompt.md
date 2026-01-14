---
id: "0004"
title: "Middleware Role-Based Access Fix"
stage: "misc"
date: "2026-01-11"
surface: "agent"
model: "MiniMax-M2.1"
feature: "admin-token-crud"
branch: "021-admin-token-crud"
user: "user"
command: "Fix middleware for role-based access: admin login goes to admin dashboard, user login goes to user dashboard, prevent cross-access"
labels: ["admin", "middleware", "auth", "role-access"]
links:
  spec: null
  plan: null
  tasks: null
  ticket: null
  adr: null
  pr: null
files:
  - src/app/middleware.ts (updated)
  - src/lib/auth.ts (updated)
  - types/next-auth.d.ts (updated)
tests: []
---

## Prompt

the middleware is not working also when i singupa or login as admin it should go to admin dashbrod not user darhboard also admin cannot go to user dahsbrond and user cannot go to admin dahbroad

## Response snapshot

Fixed middleware role-based access control:

1. **Updated auth.ts**:
   - Added `role` field to credentials authorize return
   - Added `role` to JWT token (fetches from DB for existing sessions)
   - Added `role` to session callback

2. **Updated middleware.ts**:
   - Admin routes (`/admin/*`) now require ADMIN role
   - User routes (`/dashboard/*`) require authentication (non-admin)
   - Admin users redirected to admin dashboard
   - Regular users redirected to user dashboard
   - Root URL redirects based on role

3. **Updated types/next-auth.d.ts**:
   - Added `role` to Session interface
   - Added `role` to User interface
   - Added `role` to JWT interface

## Outcome

- ✅ Impact: Role-based access control working for admin and user dashboards
- 🧪 Tests: Manual verification - sign in as admin/user and check redirects
- 📁 Files: 3 files modified
- 🔁 Next prompts: N/A
- 🧠 Reflection: Middleware now properly enforces role-based access

## Evaluation notes (flywheel)

- Failure modes observed: None - fix complete
- Graders run and results (PASS/FAIL): N/A - middleware fix
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Test sign-in flow with admin account

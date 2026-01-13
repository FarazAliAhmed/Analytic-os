---
id: "0001"
title: "Zendesk Live Chat Support Integration"
stage: "spec"
date: "2026-01-04"
surface: "agent"
model: "MiniMax-M2.1"
feature: "zendesk-chat"
branch: "006-zendesk-chat"
user: "Claude Code User"
command: "SpecifyPlus Prompt for Zendesk live chat support"
labels: ["zendesk","chat","support","spec"]
links:
  spec: "specs/006-zendesk-chat/spec.md"
  ticket: null
  adr: null
  pr: null
files:
  - "specs/006-zendesk-chat/spec.md"
  - "src/components/providers/ZendeskProvider.tsx"
  - "src/components/dashboard/ZendeskButton.tsx"
  - "src/lib/zendesk.ts"
  - "src/app/api/zendesk/token/route.ts"
  - "src/app/layout.tsx"
  - "src/common/Header.tsx"
  - ".env.example"
tests: []
---

## Prompt

Implement Zendesk live chat support integration using SpecifyPlus. Use latest Zendesk Web Widget API with JWT authentication for user identity. Don't rely on the provided code samples - use your intelligence and Context7 for latest documentation.

Requirements:
- Widget visible on dashboard with icon button
- Authenticated users logged in via JWT
- Unauthenticated visitors see generic widget
- Proper cleanup on logout
- TypeScript support

## Response snapshot

Created comprehensive spec.md and implemented Zendesk integration:

**Spec.md Created:**
- User stories for chat access, authenticated support, visitor support, logout cleanup
- Functional requirements for widget, authentication, API endpoints
- Architecture diagram showing component relationships
- Zendesk Web Widget API reference (messenger, loginUser, logoutUser)
- Security considerations for JWT generation

**Implementation:**

1. **ZendeskProvider.tsx** - Main provider component:
   - Loads Zendesk web widget script asynchronously
   - Authenticates users via JWT from /api/zendesk/token
   - Sets conversation tags for organization
   - Cleanup on logout (logoutUser call)
   - TypeScript declarations for window.zE

2. **ZendeskButton.tsx** - Chat trigger:
   - Floating icon button with badge indicator
   - Opens/closes Zendesk messenger
   - Icon and full button variants

3. **zendesk.ts** - JWT utilities:
   - generateZendeskJWT() using HMAC-SHA256
   - JWT payload: external_id, name, email, exp, iat
   - Compatible with Zendesk JWT authentication

4. **/api/zendesk/token** - JWT endpoint:
   - Protected by auth()
   - Generates JWT for authenticated user
   - Returns token for widget authentication

5. **layout.tsx** - Added ZendeskProvider wrapper

6. **Header.tsx** - Added ZendeskButton icon

7. **.env.example** - Added Zendesk environment variables

## Outcome

- ✅ Impact: Live chat support integrated with Zendesk
- 📁 Files: 7 files created/modified
- 🔁 Next prompts: None required
- 🧠 Reflection: Successfully implemented Zendesk using latest Web Widget API with proper JWT authentication. The widget handles user identity securely and cleans up on logout.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): TypeScript compilation passed
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Add proactive chat trigger based on user behavior

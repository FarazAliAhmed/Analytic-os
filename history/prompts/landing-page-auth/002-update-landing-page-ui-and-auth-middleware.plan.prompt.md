---
id: "002"
title: "Update Landing Page UI and Add Auth Middleware"
stage: "plan"
date_iso: "2026-01-03"
surface: "agent"
model: "MiniMax-M2.1"
feature: "landing-page-auth"
branch: "001-landing-page-auth"
user: "Claude Code User"
command: "sp.plan"
labels: ["landing-page", "ui-update", "auth", "middleware", "planning"]
links: {"spec": "specs/001-landing-page-auth/spec.md", "plan": "specs/001-landing-page-auth/plan.md"}
files_modified:
  - "specs/001-landing-page-auth/plan.md"
tests_run: []
---

## Prompt Text

sp.plan branch="001-landing-page-auth"

## Response Summary

Created implementation plan for landing page UI updates and auth middleware:

**Plan File**: `specs/001-landing-page-auth/plan.md`

**Key Deliverables**:
1. **Landing Page Components**:
   - `HeroSection.tsx` - Modern hero with dark theme, #4459FF accents, animated SVG background
   - `AnimatedSVG.tsx` - CSS-based floating/pulsing SVG animations
   - `GlassCard.tsx` - Glassmorphism cards with backdrop blur

2. **Header Modifications**:
   - Remove "Go to Dashboard" button
   - Add "Join Us" Register button (opens SignUpModal)
   - Keep existing Sign In button

3. **Auth Middleware** (`src/app/middleware.ts`):
   - Protect all /dashboard routes
   - Validate NextAuth session
   - Redirect unauthenticated users to homepage with error

**Technical Stack**:
- TypeScript 5, Next.js 15, Tailwind CSS 4
- NextAuth.js for session management
- CSS animations (300-500ms transitions)

**Constitution Check**: All gates PASS

**Next Step**: Run `/sp.tasks` to generate implementation tasks

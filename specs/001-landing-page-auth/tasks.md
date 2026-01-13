# Implementation Tasks: Update Landing Page UI and Add Auth Middleware

**Feature Branch**: `001-landing-page-auth`
**Created**: 2026-01-03
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Overview

| Metric | Value |
|--------|-------|
| Total Tasks | 14 |
| User Stories | 4 (US1, US2, US3, US4) |
| MVP Scope | US1 + US3 (core landing page + auth protection) |

## Dependency Graph

```
Phase 1: Setup
    ↓
Phase 2: Foundational (middleware, CSS animations)
    ↓
    ├──────────────────────────────────────┐
    ↓                                      ↓
Phase 3: US1                              Phase 4: US2
(Modern Landing)                         (Register Button)
    ↓                                      ↓
Phase 5: US3                              Phase 6: US4
(Auth Middleware)                        (Sign In Button)
```

## Parallel Execution Opportunities

- **US1 components** (HeroSection, AnimatedSVG, GlassCard) can be developed in parallel
- **US2 and US3** are independent of each other
- **US4** can be developed in parallel with US3 (different button in Header)

---

## Phase 1: Setup

**Goal**: Prepare project structure and animation utilities

### Tasks

- [ ] T001 Create components directory structure at src/components/landing/
- [ ] T002 [P] Create animation utilities in src/lib/animations.ts (fadeIn, scale, pulse keyframes)
- [ ] T003 [P] Create glassmorphism CSS utilities in src/app/globals.css

---

## Phase 2: Foundational

**Goal**: Implement middleware and base utilities needed for all user stories

### Independent Test Criteria
- Middleware blocks unauthorized access to /dashboard
- Animation utilities are importable and work correctly

### Tasks

- [ ] T004 Create auth middleware at src/app/middleware.ts to protect /dashboard routes
- [ ] T005 [P] Import and export animation utilities from src/lib/animations.ts

---

## Phase 3: User Story 1 - Modern Landing Page Experience

**Goal**: Create landing page with modern UI, animations, and glassmorphism effects

**Priority**: P1  
**Independent Test**: Load landing page and verify visual design, animations, and glassmorphism effects

### Acceptance Scenarios

1. Landing page shows modern dark theme with #4459FF accent and glassmorphism
2. Smooth animations on scroll/interaction
3. Button hover effects with scale and color transitions

### Tasks

- [ ] T006 [P] [US1] Create AnimatedSVG.tsx component in src/components/landing/AnimatedSVG.tsx
- [ ] T007 [P] [US1] Create GlassCard.tsx component in src/components/landing/GlassCard.tsx
- [ ] T008 [P] [US1] Create HeroSection.tsx in src/components/landing/HeroSection.tsx with dark theme, #4459FF accents, animated background
- [ ] T009 [US1] Update src/app/page.tsx to use HeroSection component

### Validation

- Load http://localhost:3000 and verify modern dark design
- Check animations trigger on scroll and hover
- Verify glassmorphism effects on UI elements

---

## Phase 4: User Story 2 - Registration Flow from Landing Page

**Goal**: Replace Dashboard button with Register button that opens sign-up modal

**Priority**: P1  
**Independent Test**: Click Register button and verify sign-up modal opens

### Acceptance Scenarios

1. Register button visible in navigation
2. Clicking Register opens sign-up modal
3. No "Go to Dashboard" button visible

### Tasks

- [ ] T010 [US2] Modify src/common/Header.tsx to remove "Go to Dashboard" button
- [ ] T011 [US2] Add "Join Us" Register button in Header that opens SignUpModal

### Validation

- Click Register button and verify sign-up modal opens
- Verify no Dashboard button in navigation

---

## Phase 5: User Story 3 - Dashboard Access Protection

**Goal**: Block unauthorized users from accessing /dashboard routes

**Priority**: P1  
**Independent Test**: Access /dashboard without login, verify redirect to homepage with error

### Acceptance Scenarios

1. Unauthenticated user redirected to homepage with error message
2. Authenticated user can access /dashboard normally
3. No errors for authorized access

### Tasks

- [ ] T012 [US3] Implement middleware.ts to check NextAuth session and redirect unauthenticated users

### Validation

- Navigate to http://localhost:3000/dashboard while logged out
- Verify redirect to homepage with "unauthorized" error
- Sign in and verify dashboard is accessible

---

## Phase 6: User Story 4 - Sign In Access

**Goal**: Keep existing Sign In button functionality

**Priority**: P2  
**Independent Test**: Click Sign In button and verify sign-in modal opens

### Acceptance Scenarios

1. Sign In button visible in navigation
2. Clicking Sign In opens sign-in modal

### Tasks

- [ ] T013 [US4] Verify Sign In button exists in Header and opens SignInModal

### Validation

- Click Sign In button and verify sign-in modal opens

---

## Phase 7: Polish & Cross-Cutting

**Goal**: Final improvements and testing

### Tasks

- [ ] T014 Verify all animations complete within 300-500ms
- [ ] T015 Test performance: landing page loads under 3 seconds

---

## Summary by User Story

| User Story | Tasks | Description |
|------------|-------|-------------|
| US1 | T006-T009 | Modern landing page with animations |
| US2 | T010-T011 | Register button replacement |
| US3 | T012 | Auth middleware protection |
| US4 | T013 | Sign In button verification |
| Setup | T001-T003 | Project structure |
| Foundational | T004-T005 | Middleware + utilities |
| Polish | T014-T015 | Final testing |

## Implementation Strategy

### MVP (Minimum Viable Product)
- **US1 + US3**: Core landing page + auth middleware
- This delivers: modern UI, protected dashboard

### Incremental Delivery
1. **First**: US3 (middleware) - security critical
2. **Second**: US1 (landing page) - visual impact
3. **Third**: US2 (register button) - registration flow
4. **Fourth**: US4 (sign in) - existing functionality verification
5. **Final**: Polish phase

## Notes

- All tasks follow the project's TypeScript 5 strict mode requirements
- Tailwind CSS 4 for styling with custom animation utilities
- NextAuth.js for authentication (existing setup)
- Manual testing for UI/UX, automated tests for middleware behavior

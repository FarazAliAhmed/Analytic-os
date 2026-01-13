# Implementation Plan: Update Landing Page UI and Add Auth Middleware

**Branch**: `001-landing-page-auth` | **Date**: 2026-01-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-landing-page-auth/spec.md`

## Summary

This feature updates the landing page with a modern UI including animations, SVG graphics, and glassmorphism effects, replaces the "Go to Dashboard" button with a "Join Us" Register button, and implements Next.js middleware to protect dashboard routes from unauthenticated access.

**Technical Approach**:
- Update homepage hero section with modern dark theme and #4459FF accents
- Add CSS-based animations and SVG visual elements
- Modify Header component to show Register instead of Dashboard button
- Implement Next.js middleware for /dashboard route protection using NextAuth session validation

## Technical Context

**Language/Version**: TypeScript 5 (strict mode)
**Primary Dependencies**: Next.js 15 (App Router), React 19, Tailwind CSS 4, NextAuth.js, TanStack Query 5
**Storage**: N/A (frontend + middleware only, uses existing PostgreSQL via NextAuth)
**Testing**: Jest + React Testing Library (existing test setup)
**Target Platform**: Web (desktop + mobile browsers)
**Project Type**: Single project (Next.js App Router)
**Performance Goals**: LCP < 2.5s, animation transitions 300-500ms, API response < 200ms
**Constraints**: Must use existing authentication system, must maintain accessibility
**Scale/Scope**: Landing page only, middleware for all /dashboard routes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| TypeScript strict mode | PASS | Project uses TypeScript 5 |
| Tailwind CSS 4 | PASS | Project uses Tailwind CSS |
| NextAuth.js authentication | PASS | Existing NextAuth setup |
| Performance targets (LCP < 2.5s) | PASS | Animations optimized, lazy loading |
| User-friendly error messages | PASS | Toast notifications for auth errors |
| Dark theme default | PASS | Landing page uses dark theme |

## Project Structure

### Documentation (this feature)

```text
specs/001-landing-page-auth/
├── plan.md              # This file (/sp.plan command output)
├── spec.md              # Feature specification
├── data-model.md        # N/A - no new data entities
├── quickstart.md        # N/A - no new API endpoints
└── contracts/           # N/A - no new API contracts
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── page.tsx                    # Landing page (hero section updates)
│   ├── layout.tsx                  # Root layout (fonts, providers)
│   ├── middleware.ts               # NEW - Auth middleware for dashboard
│   └── dashboard/                  # Protected routes
├── components/
│   ├── landing/                    # NEW - Landing page components
│   │   ├── HeroSection.tsx
│   │   ├── AnimatedSVG.tsx
│   │   └── GlassCard.tsx
│   └── dashboard/                  # Existing dashboard components
├── common/
│   └── Header.tsx                  # Modify - Replace Dashboard button
├── lib/
│   └── auth.ts                     # Existing - NextAuth config
```

**Structure Decision**: Feature uses existing Next.js App Router structure. New landing page components go in `components/landing/`. Auth middleware added at `src/app/middleware.ts`.

## Phase 0: Research

**No research needed** - All requirements are clear:
- CSS animations for smooth transitions (documented in spec)
- Glassmorphism using CSS backdrop-filter (standard technique)
- NextAuth session validation in middleware (existing pattern)

## Phase 1: Design

### Data Model

**N/A** - No new data entities. Feature uses existing User Session entity from NextAuth.

### API Contracts

**N/A** - No new API endpoints. Middleware uses existing NextAuth `/api/auth/session` endpoint.

### Component Design

#### 1. HeroSection.tsx
- Modern hero with dark theme (#0A0A0A background)
- #4459FF accent color for CTAs
- Animated background elements (SVG)
- Glassmorphism cards for features

#### 2. AnimatedSVG.tsx
- CSS keyframe animations
- Floating, pulsing, or gradient SVG elements
- Performance-optimized (transform-only animations)

#### 3. GlassCard.tsx
- Backdrop blur effect
- Semi-transparent background
- Border with subtle glow

#### 4. Header.tsx Modifications
- Remove "Go to Dashboard" button
- Add "Join Us" Register button (opens SignUpModal)
- Keep existing Sign In button

#### 5. middleware.ts
- Match all /dashboard routes
- Check NextAuth session via `auth()` function
- Redirect unauthenticated users to `/` with error
- Allow authenticated users through

## Phase 2: Implementation Notes

### Key Implementation Details

1. **Animation CSS**:
   ```css
   @keyframes fadeIn {
     from { opacity: 0; transform: translateY(10px); }
     to { opacity: 1; transform: translateY(0); }
   }
   .animate-fade-in { animation: fadeIn 0.5s ease-out; }
   ```

2. **Glassmorphism CSS**:
   ```css
   .glass {
     background: rgba(255, 255, 255, 0.05);
     backdrop-filter: blur(10px);
     border: 1px solid rgba(255, 255, 255, 0.1);
   }
   ```

3. **Middleware Pattern**:
   ```typescript
   import { auth } from '@/lib/auth'
   import { NextResponse } from 'next/server'

   export default auth((req) => {
     if (!req.auth && req.nextUrl.pathname.startsWith('/dashboard')) {
       return NextResponse.redirect(new URL('/?error=unauthorized', req.nextUrl))
     }
   })

   export const config = {
     matcher: ['/dashboard/:path*']
   }
   ```

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |

## Risks and Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Animation performance on low-end devices | Medium | Use CSS transforms, test on mobile |
| Middleware blocking legitimate users | High | Test thoroughly, add bypass for specific routes if needed |
| Glassmorphism not visible on all browsers | Low | Graceful degradation to solid backgrounds |

## Next Steps

- Run `/sp.tasks` to generate implementation tasks
- Implement landing page components (HeroSection, AnimatedSVG, GlassCard)
- Modify Header.tsx to replace Dashboard button
- Implement middleware.ts for route protection
- Test all user flows

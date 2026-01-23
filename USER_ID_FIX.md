# User ID Field Fix

## Problem
The User ID field in Account Settings was showing empty even though users have a `userId` in the database (format: `ANALYTI-XXXXXX`).

## Root Cause
The `userId` field was not being included in the NextAuth session. The JWT and session callbacks were missing the `userId` field.

## Solution Applied

### 1. Updated JWT Callback (`src/lib/auth.ts`)
Added `userId` to the token when user signs in:
```typescript
async jwt({ token, user, account, trigger, session }) {
  if (user) {
    token.id = user.id
    token.userId = (user as any).userId  // ← ADDED
    token.username = (user as any).username
    // ... other fields
  }
}
```

### 2. Updated Session Callback (`src/lib/auth.ts`)
Added `userId` to the session user object:
```typescript
async session({ session, token }) {
  if (token && session.user) {
    session.user.id = token.id as string
    session.user.userId = token.userId as string | null  // ← ADDED
    session.user.name = token.username as string
    // ... other fields
  }
}
```

### 3. Updated TypeScript Types (`types/next-auth.d.ts`)
Added `userId` to the type definitions:
```typescript
interface Session {
  user: {
    id: string
    userId: string | null  // ← ADDED
    username: string | null
    // ... other fields
  }
}

interface User {
  id: string
  userId?: string | null  // ← ADDED
  // ... other fields
}

interface JWT {
  id: string
  userId?: string | null  // ← ADDED
  // ... other fields
}
```

## Expected Behavior After Fix

### Before Fix:
- User ID field: **Empty** ❌
- Display: Just shows blank input field

### After Fix:
- User ID field: **ANALYTI-XXXXXX** ✅
- Display: Shows the unique user identifier
- Field is disabled (read-only)
- Helper text: "Your unique user identifier"

## Deployment Instructions

```bash
# Commit and push the fix
git add .
git commit -m "Fix User ID field in account settings"
git push origin main
```

## Testing After Deployment

1. **Sign out and sign back in** (to get new session with userId)
2. **Go to Account Settings**
3. **Check User ID field** - Should show format like `ANALYTI-123456`

## Important Note

**Users need to sign out and sign back in** for the fix to take effect because:
- The session is cached in JWT token
- New fields are only added when creating a new session
- Existing sessions won't have the `userId` field until they re-authenticate

## Alternative: Force Session Refresh

If you don't want users to sign out, you can force a session refresh by calling:
```typescript
await updateSession()
```

But this won't work for this case because the JWT token itself needs to be regenerated with the new field.

## Files Modified

- `src/lib/auth.ts` - Added userId to JWT and session callbacks
- `types/next-auth.d.ts` - Added userId to TypeScript types

## Verification

After deployment and re-login, the User ID field should display the user's unique identifier in the format `ANALYTI-XXXXXX`.
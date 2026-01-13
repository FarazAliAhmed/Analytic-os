# Signup Role Selection - Tasks

## Task 1: Update SignUpModal with Role Selection

**File:** `src/components/dashboard/SignUpModal.tsx`

**Acceptance Criteria:**
- [ ] Add role state: `const [role, setRole] = useState<'INVESTOR' | 'ADMIN'>('INVESTOR')`
- [ ] Add role selection UI before password field
- [ ] Pass role in registration API call
- [ ] Visual: Two card options with icons and descriptions

**UI Code:**
```tsx
<div className="mb-4">
  <label className="block text-sm text-gray-400 mb-2">Account Type</label>
  <div className="grid grid-cols-2 gap-3">
    <button
      type="button"
      onClick={() => setRole('INVESTOR')}
      className={`p-4 rounded-lg border transition-all ${
        role === 'INVESTOR'
          ? 'bg-[#4459FF]/10 border-[#4459FF] text-white'
          : 'bg-[#1A1A1A] border-[#23262F] text-gray-400 hover:border-[#4459FF]'
      }`}
    >
      <div className="text-lg font-medium">Investor</div>
      <div className="text-xs mt-1 opacity-70">Access investment features</div>
    </button>
    <button
      type="button"
      onClick={() => setRole('ADMIN')}
      className={`p-4 rounded-lg border transition-all ${
        role === 'ADMIN'
          ? 'bg-[#4459FF]/10 border-[#4459FF] text-white'
          : 'bg-[#1A1A1A] border-[#23262F] text-gray-400 hover:border-[#4459FF]'
      }`}
    >
      <div className="text-lg font-medium">Admin</div>
      <div className="text-xs mt-1 opacity-70">Manage platform settings</div>
    </button>
  </div>
</div>
```

**API Call Update:**
```tsx
body: JSON.stringify({
  firstName,
  lastName,
  username,
  phone,
  email,
  password,
  role,
}),
```

---

## Task 2: Update Registration API

**File:** `src/app/api/auth/register/route.ts`

**Acceptance Criteria:**
- [ ] Accept role in request body
- [ ] Validate role is 'INVESTOR' or 'ADMIN'
- [ ] Store role in user creation

**Code Changes:**
```typescript
// Add to interface
interface RegisterRequest {
  firstName: string
  lastName: string
  username: string
  phone?: string
  email: string
  password: string
  role?: 'INVESTOR' | 'ADMIN'  // Add this
}

// In handler
const role = data.role || 'INVESTOR'

// In prisma create
data: {
  // ... existing fields
  role,  // Add this
}
```

---

## Task 3: Verify Database Schema

**Check:** `prisma/schema.prisma` has role field

```prisma
model User {
  // ... existing fields
  role String @default("INVESTOR")
}
```

---

## Files Reference

### Created Files
- None (modifying existing)

### Modified Files
1. `src/components/dashboard/SignUpModal.tsx`
2. `src/app/api/auth/register/route.ts`

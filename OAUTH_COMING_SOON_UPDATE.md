# OAuth Coming Soon Update

## Changes Made

Updated both SignInModal and SignUpModal to show "Coming Soon" notification for Facebook and Twitter/X OAuth buttons.

## Files Modified

1. ✅ `src/components/dashboard/SignInModal.tsx`
2. ✅ `src/components/dashboard/SignUpModal.tsx`

## Implementation Details

### Added State Management
```typescript
const [showComingSoon, setShowComingSoon] = useState(false)
const [comingSoonProvider, setComingSoonProvider] = useState('')
```

### Added Handler Function
```typescript
const handleComingSoon = (provider: string) => {
  setComingSoonProvider(provider)
  setShowComingSoon(true)
  setTimeout(() => setShowComingSoon(false), 2000)
}
```

### Updated Buttons
Changed from:
```typescript
onClick={() => signIn('facebook', { callbackUrl: '/dashboard' })}
onClick={() => signIn('twitter', { callbackUrl: '/dashboard' })}
```

To:
```typescript
onClick={() => handleComingSoon('Facebook')}
onClick={() => handleComingSoon('Twitter/X')}
```

### Added Notification UI
```typescript
{showComingSoon && (
  <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm animate-fadeIn">
    🚀 {comingSoonProvider} sign-in coming soon!
  </div>
)}
```

## User Experience

When users click on Facebook or Twitter/X buttons:
1. A blue notification appears with "🚀 [Provider] sign-in coming soon!"
2. The notification fades in smoothly (using existing fadeIn animation)
3. After 2 seconds, the notification automatically disappears
4. Google OAuth remains fully functional

## Active OAuth Providers

- ✅ **Google** - Fully functional
- 🚧 **Facebook** - Coming soon notification
- 🚧 **Twitter/X** - Coming soon notification

## Benefits

- Clear communication to users about unavailable features
- Maintains clean UI without removing buttons
- Easy to enable later by changing onClick handler back to signIn()
- Consistent experience across both sign-in and sign-up modals

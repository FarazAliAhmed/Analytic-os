# Zendesk Live Chat Integration Guide

Complete guide to integrate Zendesk Web Widget (live chat) into your Next.js application.

---

## Prerequisites

1. Zendesk account (free trial available at https://www.zendesk.com)
2. Next.js application
3. Environment variables setup

---

## Step 1: Get Zendesk Web Widget Key

1. Go to [Zendesk Admin Center](https://admin.zendesk.com)
2. Navigate to **Channels** → **Messaging and social** → **Messaging**
3. Click **Add channel** → **Web Widget**
4. Copy your **Web Widget Key** (looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

---

## Step 2: Set Environment Variables

Add to your `.env` file:

```bash
# Zendesk Web Widget Key (public - can be exposed to client)
NEXT_PUBLIC_ZENDESK_KEY="your-widget-key-here"

# JWT Secret for authenticated users (keep secret)
ZENDESK_JWT_SECRET="your-jwt-secret-here"
```

Generate JWT secret:
```bash
openssl rand -base64 32
```

---

## Step 3: Create Zendesk Provider Component

Create `src/components/providers/ZendeskProvider.tsx`:

```typescript
'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

export default function ZendeskProvider() {
  const { data: session } = useSession()

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_ZENDESK_KEY

    if (!key) {
      console.warn('Zendesk key not configured')
      return
    }

    // Load Zendesk script
    const script = document.createElement('script')
    script.id = 'ze-snippet'
    script.src = `https://static.zdassets.com/ekr/snippet.js?key=${key}`
    script.async = true
    document.body.appendChild(script)

    // Configure Zendesk when loaded
    script.onload = () => {
      if (typeof window.zE !== 'undefined') {
        // Set user info if logged in
        if (session?.user) {
          window.zE('messenger', 'loginUser', function(callback: any) {
            fetch('/api/zendesk/token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: session.user.name || session.user.email,
                email: session.user.email,
              })
            })
            .then(res => res.json())
            .then(data => callback(data.token))
            .catch(() => callback(null))
          })
        }

        // Customize widget
        window.zE('messenger', 'set', {
          locale: 'en-US',
          color: '#4459FF', // Your brand color
        })
      }
    }

    return () => {
      // Cleanup
      const existingScript = document.getElementById('ze-snippet')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [session])

  return null
}
```

---

## Step 4: Create JWT Token API Route

Create `src/app/api/zendesk/token/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const ZENDESK_JWT_SECRET = process.env.ZENDESK_JWT_SECRET

export async function POST(request: NextRequest) {
  try {
    if (!ZENDESK_JWT_SECRET) {
      return NextResponse.json(
        { error: 'Zendesk JWT secret not configured' },
        { status: 500 }
      )
    }

    const { name, email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Generate JWT token for Zendesk
    const token = jwt.sign(
      {
        name: name || email,
        email: email,
        external_id: email, // Unique user identifier
      },
      ZENDESK_JWT_SECRET,
      {
        algorithm: 'HS256',
      }
    )

    return NextResponse.json({ token })
  } catch (error) {
    console.error('Zendesk token error:', error)
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    )
  }
}
```

---

## Step 5: Add to Root Layout

Update `src/app/layout.tsx`:

```typescript
import ZendeskProvider from '@/components/providers/ZendeskProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <ZendeskProvider />
        </AuthProvider>
      </body>
    </html>
  )
}
```

---

## Step 6: Install Dependencies

```bash
npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken
```

---

## Step 7: Configure Zendesk Dashboard

1. Go to **Admin Center** → **Channels** → **Messaging**
2. Enable **Authenticated visitors** (if using JWT)
3. Add your **JWT Secret** in Zendesk settings
4. Customize widget appearance:
   - Brand color
   - Welcome message
   - Business hours
   - Automated responses

---

## Step 8: Customize Widget (Optional)

Add custom controls in your app:

```typescript
// Open chat programmatically
window.zE('messenger', 'open')

// Close chat
window.zE('messenger', 'close')

// Show/hide widget
window.zE('messenger', 'show')
window.zE('messenger', 'hide')

// Set custom fields
window.zE('messenger', 'set', {
  conversationFields: [
    { id: 'user_type', value: 'premium' }
  ]
})
```

---

## TypeScript Declarations

Create `types/zendesk.d.ts`:

```typescript
interface Window {
  zE?: (module: string, action: string, ...args: any[]) => void
}
```

---

## Testing

1. **Development**: Widget appears in bottom-right corner
2. **Test chat**: Send a message to yourself
3. **Check Zendesk**: Messages appear in your Zendesk dashboard
4. **Authenticated users**: User info pre-fills in chat

---

## Troubleshooting

### Widget not appearing
- Check `NEXT_PUBLIC_ZENDESK_KEY` is set
- Verify key is correct in Zendesk dashboard
- Check browser console for errors

### JWT authentication failing
- Verify `ZENDESK_JWT_SECRET` matches Zendesk settings
- Check API route is accessible
- Ensure secret is base64 encoded

### Widget styling issues
- Use `window.zE('messenger', 'set', {...})` to customize
- Check CSS conflicts with your app styles

---

## Production Checklist

- [ ] Environment variables set in Vercel
- [ ] JWT secret configured in Zendesk
- [ ] Widget tested with authenticated users
- [ ] Business hours configured
- [ ] Automated responses set up
- [ ] Team members added to Zendesk
- [ ] Notification emails configured

---

## Additional Features

### Trigger chat from button
```typescript
<button onClick={() => window.zE?.('messenger', 'open')}>
  Contact Support
</button>
```

### Hide widget on specific pages
```typescript
useEffect(() => {
  if (pathname === '/checkout') {
    window.zE?.('messenger', 'hide')
  }
}, [pathname])
```

### Track events
```typescript
window.zE?.('messenger', 'on', 'open', () => {
  console.log('Chat opened')
})
```

---

## Resources

- [Zendesk Web Widget Documentation](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/)
- [JWT Authentication Guide](https://support.zendesk.com/hc/en-us/articles/4408836180634)
- [Widget Customization](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/web/sdk_api_reference/)

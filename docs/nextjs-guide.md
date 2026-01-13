# Next.js 15 Best Practices Guide

A comprehensive guide for building production-ready Next.js applications using the App Router.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Server vs Client Components](#server-vs-client-components)
3. [Data Fetching](#data-fetching)
4. [Rendering Strategies](#rendering-strategies)
5. [Server Actions](#server-actions)
6. [Middleware & Authentication](#middleware--authentication)
7. [Route Handlers](#route-handlers)
8. [Advanced Routing](#advanced-routing)
9. [Forms & Validation](#forms--validation)
10. [Database Integration](#database-integration)
11. [Performance Optimization](#performance-optimization)
12. [Streaming & Real-time](#streaming--real-time)

---

## Project Structure

```
next-app/
├── app/
│   ├── layout.tsx          # Root layout (HTML structure)
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   ├── api/                # API routes
│   │   └── route.ts
│   ├── (marketing)/        # Route group (doesn't affect URL)
│   │   └── about/
│   │       └── page.tsx
│   └── [dynamic]/          # Dynamic routes
│       └── page.tsx
├── middleware.ts           # Next.js middleware
├── next.config.ts          # Next.js configuration
└── public/                 # Static assets
```

### Basic Layout & Page

```typescript
// app/page.tsx
export default function Page() {
  return <h1>Hello, Next.js!</h1>;
}

// app/layout.tsx
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

---

## Server vs Client Components

| Feature | Server Components (Default) | Client Components |
|---------|----------------------------|-------------------|
| Render location | Server | Browser |
| Bundle size | Smaller | Full React bundle |
| Database access | Direct | Via API/actions |
| Hooks | None | All hooks supported |
| Event handlers | No | Yes |
| Directives | None | `'use client'` |

### Server Component (Default)

```typescript
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts');
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### Client Component

```typescript
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### Composition Pattern

```typescript
// app/posts/[id]/page.tsx - Server Component
import LikeButton from './LikeButton';

export default async function PostPage({ params }) {
  const post = await fetchPost(params.id);

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <LikeButton postId={params.id} />
    </article>
  );
}

// app/posts/[id]/LikeButton.tsx - Client Component
'use client';

import { useState } from 'react';

export default function LikeButton({ postId }) {
  const [liked, setLiked] = useState(false);
  return (
    <button onClick={() => setLiked(!liked)}>
      {liked ? '❤️' : '🤍'}
    </button>
  );
}
```

---

## Data Fetching

### Fetch with Caching

```typescript
// Cache forever (static)
await fetch('https://api.example.com/data', {
  next: { revalidate: false }
});

// Dynamic - no cache
await fetch('https://api.example.com/data', {
  cache: 'no-store'
});

// Revalidate every hour
await fetch('https://api.example.com/data', {
  next: { revalidate: 3600 }
});

// On-demand revalidation with tags
await fetch('https://api.example.com/data', {
  next: { tags: ['posts'] }
});
```

### On-Demand Revalidation

```typescript
// app/api/revalidate/route.ts
import { revalidateTag, revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const tag = request.nextUrl.searchParams.get('tag');

  // Revalidate specific tag
  revalidateTag(tag!);

  // OR revalidate specific path
  revalidatePath('/posts');

  return Response.json({ revalidated: true });
}
```

### Request Memoization

```typescript
// Same fetch called multiple times - only executes once per request
async function getData() {
  const res = await fetch('https://api.example.com/data');
  return res.json();
}

export default async function Page() {
  const data1 = await getData();
  const data2 = await getData(); // Returns cached result
  return <div>{data1 === data2 ? 'Cached!' : 'Different'}</div>;
}
```

### React Cache for Database Queries

```typescript
import { cache } from 'react';
import { db, posts, eq } from '@/lib/db';

export const getPost = cache(async (id: string) => {
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, parseInt(id)),
  });
  return post;
});
```

### unstable_cache for ORM

```typescript
import { unstable_cache } from 'next/cache';

const getCachedPosts = unstable_cache(
  async () => {
    return await db.select().from(posts);
  },
  ['posts'],
  { revalidate: 3600, tags: ['posts'] }
);
```

---

## Rendering Strategies

### Static Site Generation (SSG)

```typescript
// app/blog/[slug]/page.tsx
export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  const posts = await fetchPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export default async function BlogPage({ params }) {
  const post = await fetchPost(params.slug);
  return <article>{post.content}</article>;
}
```

### Server-Side Rendering (SSR)

```typescript
export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    cache: 'no-store',
  }).then(r => r.json());
  return <div>{data}</div>;
}
```

### Incremental Static Regeneration (ISR)

```typescript
export const revalidate = 60; // Re-generate page every 60 seconds

export default async function Page({ params }) {
  const post = await fetchPost(params.id);
  return <article>{post.content}</article>;
}
```

### Partial Prerendering (PPR)

```typescript
import { Suspense } from 'react';
import StaticHeader from './StaticHeader';
import DynamicContent from './DynamicContent';

export default function Page() {
  return (
    <div>
      <StaticHeader /> {/* Pre-rendered at build */}
      <Suspense fallback={<LoadingSkeleton />}>
        <DynamicContent /> {/* Streams on request */}
      </Suspense>
    </div>
  );
}
```

Enable in `next.config.ts`:

```typescript
const nextConfig = {
  experimental: {
    ppr: 'incremental',
  },
};
```

---

## Server Actions

### Basic Server Action

```typescript
// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const title = formData.get('title');
  const content = formData.get('content');

  await db.post.create({
    data: { title, content }
  });

  revalidatePath('/posts');
  return { success: true };
}
```

### Server Action with Zod Validation

```typescript
// app/actions.ts
'use server';

import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function createUser(
  prevState: { errors?: Record<string, string[]> },
  formData: FormData
) {
  const validated = schema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors
    };
  }

  await db.user.create({ data: validated.data });
  return { success: true };
}
```

### Form with useActionState

```typescript
// app/signup/form.tsx
'use client';

import { useActionState } from 'react';
import { createUser } from '@/app/actions';

const initialState = { errors: null };

export function SignupForm() {
  const [state, formAction, pending] = useActionState(
    createUser,
    initialState
  );

  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      {state?.errors?.email && (
        <p>{state.errors.email}</p>
      )}
      <input name="password" type="password" required />
      {state?.errors?.password && (
        <p>{state.errors.password}</p>
      )}
      <button disabled={pending}>
        {pending ? 'Creating...' : 'Sign Up'}
      </button>
    </form>
  );
}
```

### useFormStatus for Button State

```typescript
'use client';
import { useFormStatus } from 'react-dom';

export function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}
```

### Optimistic Updates

```typescript
'use client';

import { useOptimistic } from 'react';

export default function LikeButton({ postId, initialLikes }) {
  const [likes, addLike] = useOptimistic(
    initialLikes,
    (state, newLike) => state + 1
  );

  async function like() {
    addLike(1);
    await likePost(postId);
  }

  return (
    <button onClick={like}>
      ❤️ {likes}
    </button>
  );
}
```

---

## Middleware & Authentication

### Basic Middleware

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard', '/profile'];
const publicRoutes = ['/login', '/signup', '/'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtected = protectedRoutes.includes(path);
  const isPublic = publicRoutes.includes(path);

  const session = request.cookies.get('session')?.value;

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isPublic && session && !path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### JWT Verification in Middleware

```typescript
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (token) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );
      request.headers.set('x-user-id', payload.userId);
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}
```

### Secure Route Handler

```typescript
import { verifySession } from '@/app/lib/dal';

export async function GET() {
  const session = await verifySession();

  if (!session) {
    return new Response(null, { status: 401 });
  }

  if (session.user.role !== 'admin') {
    return new Response(null, { status: 403 });
  }

  return Response.json({ data: 'secret' });
}
```

---

## Route Handlers

### Basic Route Handler

```typescript
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ posts: [] });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ post: body }, { status: 201 });
}
```

### Dynamic Route Handler

```typescript
// app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const post = await fetchPost(params.id);
  return NextResponse.json(post);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const updated = await updatePost(params.id, body);
  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await deletePost(params.id);
  return NextResponse.json({ success: true });
}
```

### Request Methods

```typescript
export async function handler(request: NextRequest) {
  // Access methods
  console.log(request.method);
  console.log(request.url);

  // Access headers
  const contentType = request.headers.get('content-type');

  // Access cookies
  const token = request.cookies.get('token');

  // Parse body
  const json = await request.json();
  const formData = await request.formData();
  const text = await request.text();

  return NextResponse.json({ received: true });
}
```

---

## Advanced Routing

### Dynamic Routes

```
app/
  posts/
    [id]/          # /posts/123 → params.id = '123'
      page.tsx
    [...slug]/     # /docs/a/b → params.slug = ['a', 'b']
      page.tsx
    [[...slug]]/   # Optional: /docs OR /docs/a/b
      page.tsx
```

```typescript
// app/posts/[id]/page.tsx
export default function PostPage({ params }: { params: { id: string } }) {
  return <h1>Post {params.id}</h1>;
}

// app/docs/[...slug]/page.tsx
export default function DocsPage({ params }: { params: { slug: string[] } }) {
  return <h1>Docs: /{params.slug.join('/')}</h1>;
}
```

### Route Groups

```
app/
  (marketing)/
    about/page.tsx     # /about
    contact/page.tsx   # /contact
  (dashboard)/
    analytics/page.tsx # /analytics
    settings/page.tsx  # /settings
```

Route groups `(name)` organize layouts without affecting URLs.

### Parallel Routes

```
app/
  dashboard/
    @sidebar/
      page.tsx
    @content/
      page.tsx
    layout.tsx
    page.tsx
```

```typescript
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  sidebar,
  content,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <div className="dashboard">
      <aside>{sidebar}</aside>
      <main>{content}</main>
    </div>
  );
}
```

### Intercepting Routes (Modals)

```
app/
  photos/
    page.tsx              # Gallery
    [id]/
      page.tsx            # Photo page /photos/123
    (.)/[id]/             # Intercepted /photos/123
      @modal/
        page.tsx          # Modal overlay
      default.tsx         # Return null
```

```typescript
// app/photos/(.)/[id]/@modal/page.tsx
export default function PhotoModal({ params }) {
  return (
    <dialog open>
      <Photo id={params.id} />
    </dialog>
  );
}

// app/photos/[id]/default.tsx
export default function Default() {
  return null; // Hide main content when modal is active
}
```

---

## Forms & Validation

### Zod Schema Validation

```typescript
// lib/definitions.ts
import { z } from 'zod';

export const SignupFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
});

export type FormState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string;
};
```

### Complete Form with Validation

```typescript
// app/signup/form.tsx
'use client';

import { useActionState } from 'react';
import { signup } from '@/app/actions';
import { SignupFormSchema } from '@/lib/definitions';

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, {});

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="John Doe"
        />
        {state?.errors?.name && (
          <p>{state.errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
        />
        {state?.errors?.email && (
          <p>{state.errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
        />
        {state?.errors?.password && (
          <ul>
            {state.errors.password.map(error => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}
      </div>

      <button disabled={pending} type="submit">
        {pending ? 'Creating account...' : 'Sign Up'}
      </button>
    </form>
  );
}
```

---

## Database Integration

### Direct Query in Server Component

```typescript
import { db, posts } from '@/lib/db';

export default async function Page() {
  const allPosts = await db.select().from(posts);
  return (
    <ul>
      {allPosts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### Connection Pooling with Prisma

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

### Drizzle ORM Example

```typescript
// lib/db.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { posts } from './schema';

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });

// Use in Server Component
import { db, posts } from '@/lib/db';

export default async function Page() {
  const allPosts = await db.select().from(posts);
  return <div>{allPosts.length} posts</div>;
}
```

---

## Performance Optimization

### Dynamic Imports

```typescript
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const DynamicChart = dynamic(
  () => import('@/components/Chart'),
  {
    loading: () => <p>Loading chart...</p>,
    ssr: false, // Disable SSR for client-only
  }
);

export default function Dashboard() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={() => setShowChart(true)}>
        Load Chart
      </button>
      {showChart && <DynamicChart />}
    </div>
  );
}
```

### Image Optimization

```typescript
import Image from 'next/image';

export default function Page() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero image"
      width={1200}
      height={600}
      priority // Preload above-the-fold
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  );
}
```

### Font Optimization

```typescript
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

### Bundle Analysis

```bash
ANALYZE=true npm run build
```

### Optimize Package Imports

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@mui/material',
      'date-fns',
    ],
  },
};
```

---

## Streaming & Real-time

### Streaming with Suspense

```typescript
import { Suspense } from 'react';
import { getSlowData } from '@/lib/data';

export default function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<Skeleton />}>
        <SlowComponent />
      </Suspense>
    </div>
  );
}

async function SlowComponent() {
  const data = await getSlowData(); // Takes time
  return <ExpensiveComponent data={data} />;
}
```

### Server-Sent Events (SSE)

```typescript
// app/api/stream/route.ts
export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < 10; i++) {
        controller.enqueue(encoder.encode(`data: ${i}\n\n`));
        await new Promise(r => setTimeout(r, 1000));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-store',
    },
  });
}
```

### LLM Streaming Response

```typescript
import { openai } from '@ai-sdk/openai';
import { StreamingTextResponse, streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
  });

  return new StreamingTextResponse(result.toAIStream());
}
```

### Custom Streaming

```typescript
function iteratorToStream(iterator: AsyncIterator<Uint8Array>) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

export async function GET() {
  async function* generate() {
    yield new TextEncoder().encode('<p>Step 1</p>');
    await new Promise(r => setTimeout(r, 500));
    yield new TextEncoder().encode('<p>Step 2</p>');
  }

  const stream = iteratorToStream(generate());
  return new Response(stream);
}
```

---

## Error & Loading States

### Loading UI

```typescript
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="skeleton">
      <div className="skeleton-header" />
      <div className="skeleton-content" />
    </div>
  );
}
```

### Error Boundary

```typescript
// app/dashboard/error.tsx
'use client';

export default function Error({
  error,
  reset
}: {
  error: Error;
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

### Not Found

```typescript
// app/posts/[id]/page.tsx
import { notFound } from 'next/navigation';

export default async function PostPage({ params }) {
  const post = await fetchPost(params.id);

  if (!post) {
    notFound();
  }

  return <article>{post.content}</article>;
}

// app/not-found.tsx
export default function NotFound() {
  return <h1>Page not found</h1>;
}
```

### Unauthorized

```typescript
import { unauthorized } from 'next/navigation';

export async function GET() {
  const session = await verifySession();

  if (!session) {
    unauthorized();
  }

  return Response.json({ data: 'secret' });
}

// app/unauthorized.tsx
export default function Unauthorized() {
  return <h1>401 - Unauthorized</h1>;
}
```

---

## Cookie & Header Management

### Server Components

```typescript
import { cookies, headers } from 'next/headers';

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session');

  const headerStore = await headers();
  const userAgent = headerStore.get('user-agent');

  return <div>Token: {token?.value}</div>;
}
```

### Setting Cookies

```typescript
// app/api/login/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();

  const response = NextResponse.json({ success: true });
  response.cookies.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });

  return response;
}
```

### Deleting Cookies

```typescript
const response = NextResponse.json({ success: true });
response.cookies.delete('session');
return response;
```

---

## Quick Reference

| Pattern | Key API | Location |
|---------|---------|----------|
| Data Fetching | `fetch(url, { next: { revalidate } })` | Server Components |
| Server Actions | `'use server'` | app/actions.ts |
| Middleware | `middleware.ts` | Root or src/ |
| Dynamic Routes | `[param]`, `[...slug]` | app/[param]/page.tsx |
| Parallel Routes | `@slot/` | app/@slot/page.tsx |
| Intercepting Routes | `(.)[id]/` | app/(.)[id]/page.tsx |
| Revalidation | `revalidateTag()`, `revalidatePath()` | Server Actions |
| Cookies | `cookies()` | Server Components/Actions |
| Headers | `headers()` | Server Components/Actions |
| Error Boundary | `error.tsx` | Route segment |
| Loading UI | `loading.tsx` | Route segment |
| Not Found | `not-found.tsx` | Route segment |

---

## Sources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js GitHub](https://github.com/vercel/next.js)

---

*Last updated: 2026-01-03*

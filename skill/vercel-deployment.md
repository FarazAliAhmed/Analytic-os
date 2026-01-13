---
inclusion: manual
---

# Vercel Deployment Skill

A reusable guide for deploying frontend applications and full-stack Next.js + Prisma apps to Vercel.

## Prerequisites

- GitHub account with your code pushed
- Vercel account (free at https://vercel.com)
- Your project's environment variables ready
- For Prisma: A serverless-compatible database (Neon, PlanetScale, Supabase)

---

# Part 1: Frontend-Only Deployment

## Step 1: Prepare Your Project

### For Next.js Projects
```bash
npm run build  # Test locally first
```

### For React/Vite Projects
```bash
npm run build  # Test locally first
```

### Required Files
- `package.json` with `build` script
- `.gitignore` (exclude node_modules, .env.local)

## Step 2: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/REPO.git
git branch -M main
git push -u origin main
```

## Step 3: Import to Vercel

1. Go to https://vercel.com → Sign in with GitHub
2. Click "Add New..." → "Project"
3. Import your repository
4. Configure:

| Setting | Value |
|---------|-------|
| Framework Preset | Auto-detected |
| Root Directory | `.` or `frontend` (if monorepo) |
| Build Command | `npm run build` |

## Step 4: Environment Variables

```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## Step 5: Deploy

Click "Deploy" → Wait 2-3 min → Get your URL!

---

# Part 2: Full-Stack Next.js + Prisma Deployment

Deploy both frontend AND backend API routes together on Vercel.

## Project Structure

```
your-app/
├── app/
│   ├── page.tsx              # Frontend pages
│   ├── layout.tsx
│   └── api/                   # Backend API routes
│       ├── users/
│       │   └── route.ts
│       ├── tasks/
│       │   └── route.ts
│       └── auth/
│           └── [...nextauth]/route.ts
├── prisma/
│   └── schema.prisma          # Database schema
├── lib/
│   └── prisma.ts              # Prisma client
├── package.json
└── .env
```

## Step 1: Setup Prisma for Serverless

### prisma/schema.prisma
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  tasks     Task[]
  createdAt DateTime @default(now())
}

model Task {
  id        String   @id @default(cuid())
  title     String
  completed Boolean  @default(false)
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}
```

### lib/prisma.ts (Singleton for Serverless)
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

## Step 2: Configure package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    "next": "^14.0.0",
    "@prisma/client": "^5.0.0"
  },
  "devDependencies": {
    "prisma": "^5.0.0"
  }
}
```

**Important**: `postinstall` ensures Prisma client is generated on Vercel.

## Step 3: Create API Routes

### app/api/tasks/route.ts
```typescript
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET all tasks
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  
  const tasks = await prisma.task.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { createdAt: 'desc' }
  })
  
  return NextResponse.json(tasks)
}

// POST create task
export async function POST(request: NextRequest) {
  const body = await request.json()
  
  const task = await prisma.task.create({
    data: {
      title: body.title,
      userId: body.userId
    }
  })
  
  return NextResponse.json(task, { status: 201 })
}
```

### app/api/tasks/[id]/route.ts
```typescript
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET single task
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const task = await prisma.task.findUnique({
    where: { id: params.id }
  })
  
  if (!task) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  
  return NextResponse.json(task)
}

// PATCH update task
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json()
  
  const task = await prisma.task.update({
    where: { id: params.id },
    data: body
  })
  
  return NextResponse.json(task)
}

// DELETE task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.task.delete({
    where: { id: params.id }
  })
  
  return NextResponse.json({ success: true })
}
```

## Step 4: Setup Database (Neon Recommended)

1. Go to https://neon.tech → Sign up (free)
2. Create a new project
3. Copy the connection string:
```
postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
```

## Step 5: Run Migrations Locally

```bash
# Set DATABASE_URL in .env
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed database
npx prisma db seed
```

## Step 6: Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables:

```
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
NEXTAUTH_SECRET=your-secret-here  # if using auth
NEXTAUTH_URL=https://your-app.vercel.app
```

4. Deploy!

## Step 7: Run Production Migrations

After first deploy, run migrations against production DB:

```bash
# Option 1: Use Vercel CLI
vercel env pull .env.production.local
npx prisma migrate deploy

# Option 2: Direct connection
DATABASE_URL="your-production-url" npx prisma migrate deploy
```

---

# Database Options for Vercel

| Provider | Type | Free Tier | Best For |
|----------|------|-----------|----------|
| **Neon** | PostgreSQL | 0.5GB | Most projects |
| **PlanetScale** | MySQL | 5GB | High scale |
| **Supabase** | PostgreSQL | 500MB | Auth + DB |
| **Vercel Postgres** | PostgreSQL | 256MB | Simple setup |

## Neon Setup (Recommended)
```
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/db?sslmode=require"
```

## PlanetScale Setup
```prisma
datasource db {
  provider     = "mysql"
  url          = env("DATABASE_URL")
  relationMode = "prisma"  // Required for PlanetScale
}
```

---



## Cron Jobs in vercel.json
```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 0 * * *"
    }
  ]
}
```

---

# Troubleshooting

## Prisma: "Cannot find module '.prisma/client'"
- Ensure `postinstall` script exists in package.json
- Add `prisma generate` to build command

## Database Connection Errors
- Check DATABASE_URL is set in Vercel env vars
- Ensure `?sslmode=require` is in connection string
- Verify IP allowlist on database provider

## API Routes 504 Timeout
- Free tier: 10s limit
- Pro tier: 60s limit
- Solution: Optimize queries or use background jobs

## Prisma: "Too many connections"
- Use connection pooling (Neon has built-in)
- Use Prisma singleton pattern (lib/prisma.ts)

---

# Automatic Deployments

Every push to main auto-deploys:
```bash
git add .
git commit -m "Add feature"
git push origin main
# Vercel deploys automatically!
```

---

# Checklist

## Frontend Only
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported
- [ ] Environment variables set
- [ ] Deployment successful

## Full-Stack with Prisma
- [ ] Prisma schema defined
- [ ] lib/prisma.ts singleton created
- [ ] postinstall script in package.json
- [ ] Database created (Neon/PlanetScale)
- [ ] DATABASE_URL set in Vercel
- [ ] Migrations run on production
- [ ] API routes working
- [ ] Frontend calling API correctly

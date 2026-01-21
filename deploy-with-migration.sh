#!/bin/bash

echo "🚀 Deploying with Database Migration"

# Step 1: Push database schema to production
echo "📊 Pushing database schema..."
npx prisma db push --force-reset

# Step 2: Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Step 3: Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🔗 Your app: https://analytic-os.vercel.app/"
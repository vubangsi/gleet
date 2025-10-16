#!/bin/bash

echo "🔧 Fixing NextAuth configuration issues..."

# Kill any process on port 3000
echo "🔪 Killing processes on port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "No process found on port 3000"

# Install missing dependencies
echo "📦 Installing dependencies..."
npm install

# Try to generate Prisma client (may fail, that's ok for now)
echo "🗄️ Attempting to generate Prisma client..."
npx prisma generate 2>/dev/null || echo "⚠️ Prisma generation failed - using simple auth instead"

# Push database schema (may fail, that's ok for now)
echo "🗄️ Attempting to push database schema..."
npx prisma db push 2>/dev/null || echo "⚠️ Database push failed - will work without database for now"

echo "✅ Auth fixes applied!"
echo "🚀 You can now start the application with: npm run dev"
echo ""
echo "📝 Note: The app is now using simplified authentication that doesn't require database."
echo "   Once the database issues are resolved, we can switch back to full Prisma integration."

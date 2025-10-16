#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Checking application status...${NC}"
echo ""

# Check if port 3000 is in use
echo -e "${BLUE}🌐 Port Status:${NC}"
if lsof -ti:3000 > /dev/null; then
    PID=$(lsof -ti:3000)
    echo -e "  ${YELLOW}⚠️ Port 3000 is in use by process $PID${NC}"
else
    echo -e "  ${GREEN}✅ Port 3000 is available${NC}"
fi

# Check if node_modules exists
echo -e "${BLUE}📦 Dependencies:${NC}"
if [ -d "node_modules" ]; then
    echo -e "  ${GREEN}✅ node_modules directory exists${NC}"
else
    echo -e "  ${RED}❌ node_modules directory missing${NC}"
fi

# Check if .env exists
echo -e "${BLUE}🔧 Configuration:${NC}"
if [ -f ".env" ]; then
    echo -e "  ${GREEN}✅ .env file exists${NC}"
else
    echo -e "  ${RED}❌ .env file missing${NC}"
fi

# Check Prisma status
echo -e "${BLUE}🗄️ Database:${NC}"
if [ -f "node_modules/.prisma/client/index.js" ]; then
    echo -e "  ${GREEN}✅ Prisma client generated${NC}"
else
    echo -e "  ${YELLOW}⚠️ Prisma client not generated${NC}"
fi

if [ -f "prisma/dev.db" ]; then
    echo -e "  ${GREEN}✅ SQLite database file exists${NC}"
else
    echo -e "  ${YELLOW}⚠️ SQLite database file missing${NC}"
fi

# Check key files
echo -e "${BLUE}📁 Key Files:${NC}"
files=(
    "src/app/api/auth/[...nextauth]/route.ts"
    "src/app/api/auth/register-simple/route.ts"
    "src/lib/auth-simple.ts"
    "src/app/page.tsx"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ${GREEN}✅ $file${NC}"
    else
        echo -e "  ${RED}❌ $file${NC}"
    fi
done

echo ""
echo -e "${BLUE}💡 Recommendations:${NC}"

if [ ! -d "node_modules" ]; then
    echo -e "  ${YELLOW}📦 Run: npm install${NC}"
fi

if [ ! -f ".env" ]; then
    echo -e "  ${YELLOW}🔧 Run: ./fix-all-issues.sh${NC}"
fi

if lsof -ti:3000 > /dev/null; then
    echo -e "  ${YELLOW}🔪 Kill port 3000: lsof -ti:3000 | xargs kill -9${NC}"
fi

echo ""
echo -e "${BLUE}🚀 To start the application:${NC}"
echo -e "  ${GREEN}npm run dev${NC}"

#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Port to check and kill
PORT=3000

echo -e "${BLUE}🚀 Starting Gleet Application...${NC}"

# Function to kill process on port
kill_port() {
    local port=$1
    echo -e "${YELLOW}🔍 Checking for processes on port $port...${NC}"
    
    # Find process ID using port
    PID=$(lsof -ti:$port)
    
    if [ ! -z "$PID" ]; then
        echo -e "${RED}⚠️  Found process $PID running on port $port${NC}"
        echo -e "${YELLOW}🔪 Killing process $PID...${NC}"
        kill -9 $PID
        sleep 2
        
        # Verify process is killed
        if lsof -ti:$port > /dev/null; then
            echo -e "${RED}❌ Failed to kill process on port $port${NC}"
            exit 1
        else
            echo -e "${GREEN}✅ Successfully killed process on port $port${NC}"
        fi
    else
        echo -e "${GREEN}✅ No process found on port $port${NC}"
    fi
}

# Function to check if dependencies are installed
check_dependencies() {
    echo -e "${YELLOW}📦 Checking dependencies...${NC}"
    
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📥 Installing dependencies...${NC}"
        npm install
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ Failed to install dependencies${NC}"
            exit 1
        fi
    else
        echo -e "${GREEN}✅ Dependencies already installed${NC}"
    fi
}

# Function to setup database
setup_database() {
    echo -e "${YELLOW}🗄️  Setting up database...${NC}"
    
    # Generate Prisma client
    echo -e "${BLUE}🔧 Generating Prisma client...${NC}"
    npm run db:generate
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to generate Prisma client${NC}"
        echo -e "${YELLOW}⚠️  Continuing with simplified mode...${NC}"
        return 1
    fi
    echo -e "${GREEN}✅ Prisma client generated successfully${NC}"
    
    # Push database schema
    echo -e "${BLUE}🔧 Pushing database schema...${NC}"
    npm run db:push
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to push database schema${NC}"
        echo -e "${YELLOW}⚠️  Continuing with simplified mode...${NC}"
        return 1
    fi
    echo -e "${GREEN}✅ Database schema pushed successfully${NC}"
    
    # Seed database if needed
    if [ ! -f "prisma/dev.db" ] || [ ! -s "prisma/dev.db" ]; then
        echo -e "${BLUE}🌱 Seeding database...${NC}"
        npm run db:seed
        if [ $? -ne 0 ]; then
            echo -e "${YELLOW}⚠️  Database seeding failed - continuing without seed data${NC}"
        else
            echo -e "${GREEN}✅ Database seeded successfully${NC}"
        fi
    else
        echo -e "${GREEN}✅ Database already exists and seeded${NC}"
    fi
    
    return 0
}

# Function to start the application
start_app() {
    echo -e "${GREEN}🚀 Starting the development server...${NC}"
    echo -e "${BLUE}📱 Application will be available at: http://localhost:$PORT${NC}"
    echo -e "${YELLOW}⏹️  Press Ctrl+C to stop the server${NC}"
    echo ""
    
    # Start the Next.js development server
    npm run dev
}

# Main execution
main() {
    # Kill any existing process on the port
    kill_port $PORT
    
    # Check and install dependencies
    check_dependencies
    
    # Setup database
    echo ""
    if setup_database; then
        echo -e "${GREEN}✅ Database setup completed successfully${NC}"
        echo -e "${BLUE}🔄 Switching to full Prisma-integrated mode${NC}"
        
        # Switch to full authentication mode
        node scripts/switch-auth-mode.js full
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Switched to full authentication mode${NC}"
            echo -e "${YELLOW}📝 Note: Full database integration active${NC}"
        else
            echo -e "${YELLOW}⚠️  Failed to switch auth mode - using current configuration${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Database setup failed - using simplified mode${NC}"
        echo -e "${BLUE}🔄 Ensuring simplified authentication mode${NC}"
        
        # Switch to simplified authentication mode
        node scripts/switch-auth-mode.js simplified
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Switched to simplified authentication mode${NC}"
            echo -e "${YELLOW}📝 Note: Registration and auth will be simulated${NC}"
        else
            echo -e "${YELLOW}⚠️  Failed to switch auth mode - using current configuration${NC}"
        fi
    fi
    
    echo ""
    # Start the application
    start_app
}

# Handle script interruption
trap 'echo -e "\n${YELLOW}🛑 Shutting down...${NC}"; kill_port $PORT; exit 0' INT TERM

# Run main function
main

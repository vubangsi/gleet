@echo off
echo 🚀 Starting Gleet Application...

REM Kill any process on port 3000
echo 🔍 Checking for processes on port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do (
    echo ⚠️ Found process %%a running on port 3000
    echo 🔪 Killing process %%a...
    taskkill /f /pid %%a >nul 2>&1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📥 Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo ✅ Dependencies already installed
)

REM Setup database
echo 🗄️ Setting up database...
echo 🔧 Generating Prisma client...
call npm run db:generate

echo 🔧 Pushing database schema...
call npm run db:push

REM Seed database if it doesn't exist or is empty
if not exist "prisma\dev.db" (
    echo 🌱 Seeding database...
    call npm run db:seed
) else (
    echo ✅ Database already exists
)

REM Start the application
echo 🚀 Starting the development server...
echo 📱 Application will be available at: http://localhost:3000
echo ⏹️ Press Ctrl+C to stop the server
echo.

npm run dev

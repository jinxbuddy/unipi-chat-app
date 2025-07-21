@echo off
echo UniPi Chat - Setup Script
echo =========================

echo Checking if Node.js is installed...
where node >nul 2>nul
if %errorlevel% == 0 (
    echo ✅ Node.js is installed
    node --version
    npm --version
    echo.
    echo Installing dependencies...
    npm install
    if %errorlevel% == 0 (
        echo ✅ Frontend dependencies installed
        echo Installing server dependencies...
        cd server
        npm install
        if %errorlevel% == 0 (
            echo ✅ Server dependencies installed
            cd ..
            echo.
            echo 🚀 Setup complete! Starting development server...
            echo.
            echo Frontend: http://localhost:3000
            echo Backend:  http://localhost:3001
            echo.
            npm run dev:full
        ) else (
            echo ❌ Failed to install server dependencies
            cd ..
        )
    ) else (
        echo ❌ Failed to install frontend dependencies
    )
) else (
    echo ❌ Node.js is not installed
    echo.
    echo Please install Node.js first:
    echo 1. Go to https://nodejs.org/
    echo 2. Download and install the LTS version
    echo 3. Restart this script
    echo.
    echo Alternative quick install with winget:
    echo   winget install OpenJS.NodeJS
    echo.
    pause
)

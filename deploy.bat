@echo off
echo 🚀 UniPi Chat Deployment Script - Windows
echo ========================================

echo Step 1: Checking requirements...

:: Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed. Please install Git first.
    echo Download from: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo ✅ Git is available

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed.
    pause
    exit /b 1
)
echo ✅ Node.js is available

echo.
echo Choose deployment option:
echo 1. Deploy Frontend to Vercel
echo 2. Deploy Backend to Heroku
echo 3. Deploy Both
echo 4. Show manual instructions
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto deploy_frontend
if "%choice%"=="2" goto deploy_backend
if "%choice%"=="3" goto deploy_both
if "%choice%"=="4" goto show_instructions
goto end

:deploy_frontend
echo.
echo 🌐 Deploying Frontend to Vercel...
echo Installing Vercel CLI...
npm install -g vercel

echo.
echo Starting deployment...
echo Please login to Vercel when prompted.
vercel --prod

echo ✅ Frontend deployment completed!
goto end

:deploy_backend
echo.
echo 🖥️ Deploying Backend to Heroku...
echo.
echo Please follow these manual steps:
echo 1. Install Heroku CLI from: https://devcenter.heroku.com/articles/heroku-cli
echo 2. Run: heroku login
echo 3. Run: heroku create your-app-name
echo 4. Run: git subtree push --prefix server heroku main
goto end

:deploy_both
call :deploy_frontend
call :deploy_backend
goto end

:show_instructions
echo.
echo 📋 Manual Deployment Instructions:
echo.
echo FRONTEND (Vercel):
echo 1. Create account at https://vercel.com
echo 2. Connect your GitHub repository
echo 3. Import project and deploy
echo.
echo BACKEND (Heroku):
echo 1. Create account at https://heroku.com
echo 2. Install Heroku CLI
echo 3. Create new app
echo 4. Deploy server folder
echo.
echo ALTERNATIVE PLATFORMS:
echo - Railway: https://railway.app
echo - Render: https://render.com
echo - Netlify: https://netlify.com (frontend only)
echo.

:end
echo.
echo 🎉 Deployment process completed!
echo.
echo Next steps:
echo 1. Configure environment variables
echo 2. Set up email service
echo 3. Test your deployed app
echo 4. Share with UniPi students!
echo.
pause

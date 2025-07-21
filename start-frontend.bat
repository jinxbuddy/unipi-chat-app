@echo off
echo Starting UniPi Chat Frontend...
echo.
echo Adding Node.js to PATH...
set PATH=%PATH%;C:\Program Files\nodejs

echo Starting frontend development server...
echo Frontend will be available at: http://localhost:3000
echo.

cd /d "%~dp0"
npm run dev

pause

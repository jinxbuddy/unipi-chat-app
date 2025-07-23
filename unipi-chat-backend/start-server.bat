@echo off
echo Starting UniPi Chat Backend Server...
echo.
echo Adding Node.js to PATH...
set PATH=%PATH%;C:\Program Files\nodejs

echo Starting server on port 3001...
echo Backend will be available at: http://localhost:3001
echo API Health check: http://localhost:3001/api/health
echo.

cd /d "%~dp0"
node index.js

pause

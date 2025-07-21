# UniPi Chat - Setup Script for PowerShell
Write-Host "UniPi Chat - Setup Script" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking if Node.js is installed..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>$null
    $npmVersion = npm --version 2>$null
    
    if ($nodeVersion -and $npmVersion) {
        Write-Host "✅ Node.js is installed" -ForegroundColor Green
        Write-Host "   Node.js: $nodeVersion" -ForegroundColor Gray
        Write-Host "   npm: $npmVersion" -ForegroundColor Gray
        Write-Host ""
        
        # Install frontend dependencies
        Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
        npm install
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
            
            # Install server dependencies
            Write-Host "Installing server dependencies..." -ForegroundColor Yellow
            Set-Location server
            npm install
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Server dependencies installed" -ForegroundColor Green
                Set-Location ..
                Write-Host ""
                Write-Host "🚀 Setup complete! You can now start the development server with:" -ForegroundColor Green
                Write-Host ""
                Write-Host "   npm run dev:full" -ForegroundColor Cyan
                Write-Host ""
                Write-Host "This will start:" -ForegroundColor Gray
                Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Gray
                Write-Host "   Backend:  http://localhost:3001" -ForegroundColor Gray
                Write-Host ""
                
                # Ask if user wants to start now
                $start = Read-Host "Would you like to start the development server now? (y/n)"
                if ($start -eq "y" -or $start -eq "Y") {
                    npm run dev:full
                }
            } else {
                Write-Host "❌ Failed to install server dependencies" -ForegroundColor Red
                Set-Location ..
            }
        } else {
            Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "❌ Node.js is not installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js first:" -ForegroundColor Yellow
    Write-Host "1. Go to https://nodejs.org/" -ForegroundColor Gray
    Write-Host "2. Download and install the LTS version" -ForegroundColor Gray
    Write-Host "3. Restart PowerShell and run this script again" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Alternative quick install options:" -ForegroundColor Yellow
    Write-Host "• Windows Package Manager: winget install OpenJS.NodeJS" -ForegroundColor Gray
    Write-Host "• Chocolatey: choco install nodejs" -ForegroundColor Gray
    Write-Host ""
    Read-Host "Press Enter to exit"
}

# 🚀 UniPi Chat Setup Guide

## Prerequisites Installation

Since Node.js/npm is not installed on your system, you'll need to install it first.

### Option 1: Install Node.js (Recommended)

1. **Download Node.js**:
   - Go to https://nodejs.org/
   - Download the LTS version (recommended)
   - Run the installer and follow the setup wizard

2. **Verify Installation**:
   ```powershell
   node --version
   npm --version
   ```

3. **Install Dependencies**:
   ```powershell
   npm install
   cd server
   npm install
   cd ..
   ```

4. **Start the Application**:
   ```powershell
   npm run dev:full
   ```

### Option 2: Using Package Managers

#### Using Chocolatey (Windows Package Manager)
```powershell
# Install Chocolatey first (if not installed)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Node.js
choco install nodejs
```

#### Using Windows Package Manager (winget)
```powershell
winget install OpenJS.NodeJS
```

### Option 3: Portable Version (No Installation)

1. Download Node.js portable version
2. Extract to a folder (e.g., C:\nodejs)
3. Add to PATH temporarily:
   ```powershell
   $env:PATH += ";C:\nodejs"
   ```

## 🎯 Quick Start After Node.js Installation

1. **Install Frontend Dependencies**:
   ```powershell
   npm install
   ```

2. **Install Backend Dependencies**:
   ```powershell
   cd server
   npm install
   cd ..
   ```

3. **Start Development Environment**:
   ```powershell
   npm run dev:full
   ```

   This starts both:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## 🔧 Alternative: Manual Setup

If you prefer to start services separately:

### Terminal 1 (Frontend):
```powershell
npm run dev
```

### Terminal 2 (Backend):
```powershell
npm run server
```

## 🌐 Access the Application

Once running, open your browser and go to:
- **Frontend**: http://localhost:3000
- **API Health Check**: http://localhost:3001/api/health

## 🎓 Testing with University Email

For development/testing purposes:
1. Use any email ending with @studenti.unipi.it
2. The verification code will be logged in the server console
3. In development mode, the API also returns the code in the response

Example test email: `mario.rossi@studenti.unipi.it`

## 🛠️ Troubleshooting

### Port Already in Use
If ports 3000 or 3001 are busy:
```powershell
# Check what's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Permission Issues
Run PowerShell as Administrator if you encounter permission errors.

### Firewall Warnings
Windows may ask for firewall permissions - allow Node.js for local development.

## 📋 Project Structure

```
unipi-chat/
├── src/                    # Frontend React components
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   └── types/            # TypeScript definitions
├── server/               # Backend Node.js server
│   ├── index.js          # Main server file
│   └── package.json      # Server dependencies
├── package.json          # Frontend dependencies
└── README.md            # This file
```

## 🔒 Security Notes

- Email verification is enforced server-side
- All video/audio is encrypted via WebRTC
- No personal data is permanently stored
- Anonymous names are randomly generated
- Sessions are ephemeral and cleaned up automatically

## 🎯 Features Overview

✅ **Email Verification**: @studenti.unipi.it only
✅ **Anonymous Chat**: Random student names
✅ **Video/Audio**: WebRTC peer-to-peer
✅ **Matchmaking**: Automatic student pairing
✅ **Safety Features**: Report, skip, end chat
✅ **Mobile Friendly**: Responsive design
✅ **Privacy First**: GDPR compliant

Ready to connect University of Pisa students! 🎓

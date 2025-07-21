# Quick Deployment Guide for UniPi Chat App

## Frontend Deployment (Vercel) - FREE & EASY

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (recommended)

### Step 2: Deploy Frontend
```bash
npx vercel login
npx vercel --prod
```

When prompted:
- Project name: `unipi-chat` (or whatever you prefer)
- Directory: `.` (current directory)
- Want to override settings: `N`

### Step 3: Get Your Frontend URL
After deployment, you'll get a URL like: `https://unipi-chat-abc123.vercel.app`

## Backend Deployment Options

### Option A: Railway (Recommended - Easy)
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project → Deploy from GitHub repo
4. Connect your repository
5. Set environment variables:
   - `NODE_ENV=production`
   - `PORT=3001`
   - `FRONTEND_URL=https://your-vercel-url.vercel.app`

### Option B: Render (Free Tier)
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Create new Web Service
4. Connect GitHub repository
5. Settings:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`

### Option C: Heroku (Requires Credit Card)
```bash
npm install -g heroku
heroku login
heroku create unipi-chat-backend
git subtree push --prefix=server heroku main
```

## Environment Variables Needed

### Frontend (.env.local):
```
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
```

### Backend:
```
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend-url.vercel.app
SENDGRID_API_KEY=your_sendgrid_key (optional)
EMAIL_FROM=noreply@yourdomain.com
```

## Final Steps
1. Update frontend environment variable with backend URL
2. Update backend CORS settings with frontend URL
3. Test the deployment
4. Share with UniPi students!

## Troubleshooting
- If CORS errors: Check FRONTEND_URL in backend environment
- If email not working: Set up SendGrid account (free tier available)
- If video not working: Add STUN server configuration

Your app will be live at: `https://your-app-name.vercel.app`

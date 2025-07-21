# Deployment Guide: UniPi Chat

## 🌐 Frontend Deployment (Vercel)

### Step 1: Prepare for Deployment
1. Create a GitHub repository
2. Push your code to GitHub
3. Sign up at https://vercel.com

### Step 2: Deploy Frontend
1. Connect your GitHub account to Vercel
2. Import your repository
3. Configure build settings:
   - Framework: Next.js
   - Build command: `npm run build`
   - Output directory: `.next`

### Step 3: Environment Variables
Add these in Vercel dashboard:
```
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.herokuapp.com
NEXT_PUBLIC_STUN_SERVERS=stun:stun.l.google.com:19302
```

### Vercel Configuration File
Create `vercel.json` in project root:
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

## 🖥️ Backend Deployment Options

### Option A: Heroku (Easy)
1. Install Heroku CLI
2. Create Heroku app
3. Deploy server folder

### Option B: Railway (Modern)
1. Connect GitHub to Railway
2. Deploy server automatically

### Option C: Render (Free Tier)
1. Connect GitHub to Render
2. Deploy as Node.js service

## 📧 Email Service Setup

For production, replace the demo email verification with real email service:

### Using SendGrid:
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: email,
  from: 'noreply@yourapp.com',
  subject: 'UniPi Chat Verification Code',
  html: `Your verification code is: <strong>${code}</strong>`
};

await sgMail.send(msg);
```

### Using Nodemailer + Gmail:
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

## 🔒 Production Security

### Environment Variables:
```bash
# Backend (.env)
NODE_ENV=production
PORT=3001
CLIENT_URL=https://your-frontend.vercel.app
SENDGRID_API_KEY=your_sendgrid_key
EMAIL_FROM=noreply@yourapp.com

# Frontend (.env.local)
NEXT_PUBLIC_SOCKET_URL=https://your-backend.herokuapp.com
```

### Additional Security:
1. Enable HTTPS (automatic on Vercel/Heroku)
2. Configure CORS for production domains
3. Add rate limiting
4. Use database for user storage (MongoDB Atlas)

## 💾 Database Setup (Optional)

### MongoDB Atlas (Free):
```javascript
const mongoose = require('mongoose');

// User schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false },
  anonymousName: String,
  createdAt: { type: Date, default: Date.now }
});
```

## 🏗️ Custom Domain (Optional)

### For Frontend (Vercel):
1. Buy domain (Namecheap, GoDaddy)
2. Add custom domain in Vercel
3. Configure DNS records

### SSL Certificate:
- Automatic with Vercel/Heroku
- Free Let's Encrypt certificates

## 📊 Monitoring & Analytics

### Error Tracking:
- Sentry for error monitoring
- LogRocket for user sessions

### Analytics:
- Google Analytics
- Vercel Analytics

## 🚀 Quick Deploy Commands

### Frontend (Vercel):
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Backend (Heroku):
```bash
npm install -g heroku
heroku login
heroku create unipi-chat-backend
git subtree push --prefix server heroku main
```

## 📱 Mobile App (Future)

Convert to mobile app using:
- React Native
- Expo
- Capacitor (for existing web app)

## 🎯 Launch Checklist

- [ ] Frontend deployed on Vercel
- [ ] Backend deployed on Heroku/Railway
- [ ] Email service configured
- [ ] Environment variables set
- [ ] SSL certificates active
- [ ] Domain configured (optional)
- [ ] Error monitoring setup
- [ ] University approval (if needed)

## 💡 Cost Estimates

### Free Tier:
- Vercel: Free (hobby)
- Heroku: Free tier discontinued, $7/month minimum
- Railway: $5/month
- Render: Free tier available
- MongoDB Atlas: Free 512MB

### Paid Features:
- Custom domain: $10-15/year
- SendGrid: Free 100 emails/day
- Premium monitoring: $20-50/month

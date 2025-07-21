#!/bin/bash

# UniPi Chat Backend Deployment Script for Railway

echo "🚀 Deploying UniPi Chat Backend to Railway..."

# Set environment variables
echo "📋 Setting environment variables..."
npx @railway/cli variables set NODE_ENV=production
npx @railway/cli variables set PORT=3001
npx @railway/cli variables set FRONTEND_URL=https://unipi-chat-nt1obgw00-jinxbuddys-projects.vercel.app
npx @railway/cli variables set CLIENT_URL=https://unipi-chat-nt1obgw00-jinxbuddys-projects.vercel.app

# Deploy the backend
echo "🔨 Building and deploying..."
npx @railway/cli up --service backend

echo "✅ Backend deployment complete!"
echo "🔗 Your backend will be available at: [Railway will provide URL]"

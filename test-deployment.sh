#!/bin/bash

# UniPi Chat App - Quick Test Script

echo "🧪 Testing UniPi Chat App Deployment..."

echo "📡 Testing Backend Health..."
curl -s https://unipi-chat-app-production.up.railway.app/health || echo "❌ Backend not responding"

echo ""
echo "🌐 Testing Frontend..."
curl -s -I https://unipi-chat-nt1obgw00-jinxbuddys-projects.vercel.app | head -1

echo ""
echo "✅ Test complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Add NEXT_PUBLIC_SOCKET_URL to Vercel"
echo "2. Add CORS URLs to Railway"
echo "3. Redeploy frontend"
echo "4. Test with @studenti.unipi.it email"

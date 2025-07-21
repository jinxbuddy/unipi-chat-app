# Push UniPi Chat App to GitHub

## Step 1: Create GitHub Repository

1. **Go to [github.com](https://github.com)** and sign in
2. **Click the "+" icon** in the top right → "New repository"
3. **Repository settings:**
   - Repository name: `unipi-chat-app`
   - Description: `Anonymous video chat app for University of Pisa students`
   - Set to **Public** (so you can deploy easily)
   - ✅ Add a README file: **UNCHECK THIS** (we already have one)
   - ✅ Add .gitignore: **UNCHECK THIS** (we already have one)
4. **Click "Create repository"**

## Step 2: Push Your Code

After creating the repository, GitHub will show you commands. Use these in your terminal:

```bash
# Add the GitHub repository as remote origin
git remote add origin https://github.com/YOUR_USERNAME/unipi-chat-app.git

# Push your code to GitHub
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME`** with your actual GitHub username!

## Step 3: Verify Upload

- Go to your repository page: `https://github.com/YOUR_USERNAME/unipi-chat-app`
- You should see all your files including:
  - `src/` folder with components
  - `server/` folder with backend code
  - `package.json`, `README.md`, etc.

## Step 4: Deploy from GitHub

Once your code is on GitHub, you can easily deploy:

### Frontend (Vercel):
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import from GitHub → Select your `unipi-chat-app` repository
4. Deploy! ✨

### Backend (Railway):
1. Go to [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"
3. Select your `unipi-chat-app` repository
4. Set environment variables and deploy! 🚀

## Quick Commands Summary:

```bash
# 1. Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/unipi-chat-app.git

# 2. Push to GitHub
git branch -M main
git push -u origin main

# 3. Check status
git status
```

Your app will be ready to deploy from GitHub! 🎉

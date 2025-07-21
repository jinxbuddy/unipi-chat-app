#!/bin/bash

echo "🚀 UniPi Chat Deployment Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Installing deployment tools...${NC}"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}Git is not installed. Please install Git first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Git is available${NC}"

# Check if user wants to deploy frontend
echo -e "${YELLOW}Do you want to deploy the frontend to Vercel? (y/n)${NC}"
read -p "" deploy_frontend

if [ "$deploy_frontend" = "y" ]; then
    echo -e "${BLUE}Installing Vercel CLI...${NC}"
    npm install -g vercel
    
    echo -e "${BLUE}Deploying frontend...${NC}"
    echo -e "${YELLOW}Please login to Vercel when prompted${NC}"
    vercel --prod
    
    echo -e "${GREEN}✅ Frontend deployment initiated${NC}"
fi

# Check if user wants to deploy backend
echo -e "${YELLOW}Do you want to deploy the backend to Heroku? (y/n)${NC}"
read -p "" deploy_backend

if [ "$deploy_backend" = "y" ]; then
    echo -e "${BLUE}Installing Heroku CLI...${NC}"
    # Instructions for Heroku CLI installation
    echo -e "${YELLOW}Please install Heroku CLI from: https://devcenter.heroku.com/articles/heroku-cli${NC}"
    echo -e "${YELLOW}Then run: heroku login${NC}"
    echo -e "${YELLOW}Create app: heroku create your-app-name${NC}"
    echo -e "${YELLOW}Deploy: git subtree push --prefix server heroku main${NC}"
fi

echo -e "${GREEN}🎉 Deployment script completed!${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. Configure environment variables in your hosting platforms"
echo -e "2. Set up email service (SendGrid/Nodemailer)"
echo -e "3. Test the deployed application"
echo -e "4. Share with University of Pisa students!"

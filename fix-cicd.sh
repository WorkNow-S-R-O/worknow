#!/bin/bash

# Quick CI/CD Fix Script
# This script helps fix common CI/CD issues

set -e

echo "🔧 WorkNow CI/CD Fix Script"
echo "============================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_error "Not in a git repository. Please run this script from the project root."
    exit 1
fi

print_status "Fixing CI/CD pipeline issues..."

# 1. Test local builds first
print_status "1. Testing local Docker builds..."

if docker build -f docker/Dockerfile.frontend -t worknow-frontend:test .; then
    print_success "Frontend Docker build successful"
else
    print_error "Frontend Docker build failed"
    exit 1
fi

if docker build -f docker/Dockerfile.backend -t worknow-backend:test .; then
    print_success "Backend Docker build successful"
else
    print_error "Backend Docker build failed"
    exit 1
fi

if docker build -f docker/Dockerfile.prod -t worknow:test .; then
    print_success "Production Docker build successful"
else
    print_error "Production Docker build failed"
    exit 1
fi

# 2. Test application locally
print_status "2. Testing application locally..."

if npm ci; then
    print_success "Dependencies installed"
else
    print_error "Failed to install dependencies"
    exit 1
fi

if npm run build; then
    print_success "Application build successful"
else
    print_error "Application build failed"
    exit 1
fi

# 3. Create a test commit to trigger workflows
print_status "3. Creating test commit to trigger workflows..."

# Create a small change
echo "// CI/CD fix test - $(date)" >> apps/client/src/App.jsx

# Commit the changes
git add .
git commit -m "fix: test CI/CD pipeline fixes" || print_warning "No changes to commit"

# Push to trigger workflows
git push origin HEAD || print_warning "Failed to push (may need to set upstream)"

print_success "Test commit created and pushed"

# 4. Check workflow status
if command -v gh &> /dev/null; then
    print_status "4. Checking workflow status..."
    
    if gh auth status &> /dev/null; then
        print_status "Recent workflow runs:"
        gh run list --limit 5
        
        print_status "Available workflows:"
        gh workflow list
    else
        print_warning "GitHub CLI not authenticated. Run: gh auth login"
    fi
else
    print_warning "GitHub CLI not installed. Install from: https://cli.github.com/"
fi

print_success "CI/CD fix script completed!"
print_status "Check GitHub Actions tab to see if workflows are now working."
print_status "If issues persist, check the workflow logs for specific error messages."

echo ""
print_status "Next steps:"
echo "1. Go to GitHub → Actions tab"
echo "2. Check if workflows are running successfully"
echo "3. If still failing, check the logs for specific errors"
echo "4. The simplified docker-simple.yml workflow should work better"

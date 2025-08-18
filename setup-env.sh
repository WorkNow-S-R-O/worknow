#!/bin/bash

echo "🚀 Setting up WorkNow environment variables..."

# Check if root .env file exists
if [ -f ".env" ]; then
    echo "⚠️  Root .env already exists. Backing up to .env.backup"
    cp .env .env.backup
fi

# Copy example file to root directory
cp docker/env.example .env

echo "✅ Environment file created: .env"
echo ""
echo "📝 Please edit .env and fill in your actual values:"
echo "   - Database credentials"
echo "   - Clerk API keys (REQUIRED for frontend authentication)"
echo "   - Stripe API keys"
echo "   - Email credentials (Gmail or Resend)"
echo "   - AWS S3 credentials (if using file uploads)"
echo "   - OpenAI API key (if using AI features)"
echo ""
echo "🔑 For Clerk (REQUIRED for frontend to work):"
echo "   - Get API keys from https://dashboard.clerk.com"
echo "   - Set VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key"
echo "   - Set CLERK_SECRET_KEY=sk_test_your_actual_key"
echo ""
echo "🔑 For Resend (optional):"
echo "   - Get API key from https://resend.com"
echo "   - Set RESEND_API_KEY=re_your_actual_key"
echo ""
echo "🔑 For OpenAI (optional):"
echo "   - Get API key from https://platform.openai.com"
echo "   - Set OPENAI_API_KEY=sk-your_actual_key"
echo ""
echo "📧 For Gmail:"
echo "   - Use app password, not regular password"
echo "   - Enable 2FA on your Google account first"
echo ""
echo "🚀 After editing, start Docker with:"
echo "   docker-compose -f docker/docker-compose.dev.yml up --build"

#!/bin/bash

# WorkNow Docker Environment Setup Script
# This script helps you set up the required environment variables for Docker

echo "🚀 WorkNow Docker Environment Setup"
echo "=================================="

# Check if .env file exists
if [ -f "../.env" ]; then
    echo "✅ .env file found in root directory"
    echo "📝 Please ensure the following variables are set with real values:"
else
    echo "❌ .env file not found in root directory"
    echo "📝 Creating .env file from template..."
    cp env.example ../.env
    echo "✅ .env file created from template"
fi

echo ""
echo "🔑 REQUIRED ENVIRONMENT VARIABLES:"
echo "=================================="
echo ""
echo "📱 CLERK AUTHENTICATION (CRITICAL):"
echo "   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_clerk_key"
echo "   CLERK_SECRET_KEY=sk_test_your_actual_clerk_secret"
echo "   WEBHOOK_SECRET=whsec_your_actual_webhook_secret"
echo ""
echo "💳 STRIPE PAYMENT:"
echo "   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_stripe_key"
echo "   STRIPE_SECRET_KEY=sk_test_your_actual_stripe_secret"
echo "   STRIPE_WEBHOOK_SECRET=whsec_your_actual_stripe_webhook"
echo ""
echo "📧 EMAIL CONFIGURATION:"
echo "   EMAIL_USER=your_actual_email@gmail.com"
echo "   EMAIL_PASS=your_actual_app_password"
echo ""
echo "☁️ AWS S3 (Optional):"
echo "   AWS_ACCESS_KEY_ID=your_actual_aws_key"
echo "   AWS_SECRET_ACCESS_KEY=your_actual_aws_secret"
echo "   AWS_REGION=us-east-1"
echo "   AWS_S3_BUCKET=your_actual_bucket_name"
echo ""
echo "🗄️ DATABASE:"
echo "   DATABASE_URL=postgresql://postgres@host.docker.internal:5432/worknow"
echo "   (This is automatically set for Docker)"
echo ""
echo "📋 NEXT STEPS:"
echo "=============="
echo "1. Edit the .env file in the root directory"
echo "2. Replace placeholder values with your actual API keys"
echo "3. Run: docker-compose -f docker/docker-compose.dev.yml --env-file .env up -d"
echo "4. Access the app at: http://localhost:3000"
echo ""
echo "🔍 TROUBLESHOOTING:"
echo "=================="
echo "• If you see 'invalid publishableKey' errors, check VITE_CLERK_PUBLISHABLE_KEY"
echo "• If authentication fails, verify CLERK_SECRET_KEY"
echo "• If payments don't work, check STRIPE_SECRET_KEY"
echo "• Check container logs: docker-compose -f docker/docker-compose.dev.yml logs -f"
echo "• CRITICAL: Always use --env-file .env when starting Docker Compose"
echo ""
echo "📚 DOCUMENTATION:"
echo "================="
echo "• Docker README: docker/README.md"
echo "• Environment template: docker/env.example"
echo "• Clerk Dashboard: https://dashboard.clerk.com"
echo "• Stripe Dashboard: https://dashboard.stripe.com"
echo ""

# Check if running in Docker
if [ -f /.dockerenv ]; then
    echo "🐳 Running inside Docker container"
    echo "⚠️  Make sure environment variables are properly set in docker-compose.yml"
else
    echo "💻 Running on host machine"
    echo "✅ You can now edit the .env file and start Docker"
fi

echo ""
echo "🎯 Quick Start Commands:"
echo "========================"
echo "cd docker"
echo "docker-compose -f docker-compose.dev.yml --env-file ../.env up -d"
echo "docker-compose -f docker-compose.dev.yml logs -f worknow-dev"
echo ""
echo "⚠️  IMPORTANT: Always use --env-file ../.env when starting containers!"

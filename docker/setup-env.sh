#!/bin/bash

echo "🔧 WorkNow Docker Environment Setup"
echo "==================================="
echo ""

# Check if .env file exists
if [ -f "../.env" ]; then
    echo "✅ .env file already exists"
    echo "   Current environment variables:"
    echo ""
    grep -E "^(VITE_CLERK_PUBLISHABLE_KEY|CLERK_SECRET_KEY|WEBHOOK_SECRET|DATABASE_URL)=" ../.env || echo "   ⚠️  Some required variables are missing"
else
    echo "📝 Creating .env file..."
    cat > ../.env << EOF
# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@db:5432/worknow"

# Clerk Authentication (REPLACE WITH YOUR ACTUAL KEYS)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here
CLERK_SECRET_KEY=sk_test_your_clerk_secret_here
WEBHOOK_SECRET=whsec_your_webhook_secret_here

# API Configuration
VITE_API_URL=http://localhost:3001

# AWS S3 Configuration (REPLACE WITH YOUR ACTUAL KEYS)
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_S3_BUCKET_NAME=your_s3_bucket_name
AWS_REGION=us-east-1

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# Stripe Configuration (REPLACE WITH YOUR ACTUAL KEYS)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# Environment
NODE_ENV=development
EOF
    echo "✅ Created .env file"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Edit the .env file with your actual values"
echo "2. Make sure you have the following services configured:"
echo "   - Clerk Authentication (https://clerk.com/)"
echo "   - AWS S3 (for file uploads)"
echo "   - Stripe (for payments)"
echo "3. Run 'docker compose up --build' to start the application"
echo ""
echo "⚠️  Important:"
echo "- Never commit your .env file to version control"
echo "- Keep your API keys secure"
echo "- Use different credentials for development and production"
echo ""
echo "🎉 Setup complete! Edit your .env file and start the containers!" 
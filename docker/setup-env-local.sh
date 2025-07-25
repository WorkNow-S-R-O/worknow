#!/bin/bash

echo "🔧 WorkNow Frontend Environment Setup (.env.local)"
echo "=================================================="
echo ""

# Check if .env.local file exists
if [ -f "../.env.local" ]; then
    echo "✅ .env.local file already exists"
    echo "   Current frontend environment variables:"
    echo ""
    grep -E "^(VITE_CLERK_PUBLISHABLE_KEY|VITE_API_URL|VITE_STRIPE_PUBLISHABLE_KEY)=" ../.env.local || echo "   ⚠️  Some required VITE variables are missing"
else
    echo "📝 Creating .env.local file..."
    cat > ../.env.local << EOF
# Frontend Environment Variables (Vite)
# These are required for the React app to work properly

# Clerk Authentication (REPLACE WITH YOUR ACTUAL KEY)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here

# API Configuration
VITE_API_URL=http://localhost:3001

# Stripe Configuration (REPLACE WITH YOUR ACTUAL KEY)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here
EOF
    echo "✅ Created .env.local file"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Edit the .env.local file with your actual Clerk and Stripe keys"
echo "2. Get your Clerk Publishable Key from: https://clerk.com/"
echo "3. Get your Stripe Publishable Key from: https://stripe.com/"
echo "4. Restart the Docker containers after updating the keys"
echo ""
echo "⚠️  Important:"
echo "- The .env.local file is for frontend environment variables (VITE_*)"
echo "- The .env file is for backend environment variables"
echo "- Never commit .env.local to version control"
echo ""
echo "🎉 Frontend environment setup complete!" 
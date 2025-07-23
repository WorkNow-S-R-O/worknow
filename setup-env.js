#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 WorkNow Environment Setup');
console.log('============================\n');

const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists!');
  console.log('   If you want to create a new one, please delete the existing .env file first.\n');
  process.exit(0);
}

// Create .env.example if it doesn't exist
const envTemplate = `# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/worknow"

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here
CLERK_SECRET_KEY=sk_test_your_clerk_secret_here
WEBHOOK_SECRET=whsec_your_webhook_secret_here

# AWS S3 Configuration (Required for S3 uploads)
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_S3_BUCKET_NAME=your_s3_bucket_name
AWS_REGION=us-east-1

# API Configuration
VITE_API_URL=http://localhost:3001

# Email Configuration (if using Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# Stripe Configuration (if using payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# Environment
NODE_ENV=development
`;

if (!fs.existsSync(envExamplePath)) {
  fs.writeFileSync(envExamplePath, envTemplate);
  console.log('✅ Created .env.example file');
}

// Create .env file
fs.writeFileSync(envPath, envTemplate);
console.log('✅ Created .env file with template values');

console.log('\n📋 Next Steps:');
console.log('1. Edit the .env file with your actual values');
console.log('2. For S3 uploads, you need:');
console.log('   - AWS_ACCESS_KEY_ID');
console.log('   - AWS_SECRET_ACCESS_KEY');
console.log('   - AWS_S3_BUCKET_NAME');
console.log('3. See SETUP_GUIDE.md for detailed instructions');
console.log('4. Run "npm run dev" to start the development server');

console.log('\n🔗 Useful Links:');
console.log('- AWS S3 Setup: https://aws.amazon.com/s3/');
console.log('- Clerk Authentication: https://clerk.com/');
console.log('- PostgreSQL: https://www.postgresql.org/');

console.log('\n⚠️  Important:');
console.log('- Never commit your .env file to version control');
console.log('- Keep your AWS credentials secure');
console.log('- Use different credentials for development and production');

console.log('\n🎉 Setup complete! Edit your .env file and start developing!'); 
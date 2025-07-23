# WorkNow Setup Guide

## Quick Fix for Current Issues

### 1. Port Conflict Fix ✅
The port conflict has been fixed by updating Vite to use port 5173 instead of 3000.

### 2. Environment Variables Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
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
```

## Required Environment Variables for S3 Uploads

The following variables are **required** for S3 upload functionality:

```env
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_S3_BUCKET_NAME=your_s3_bucket_name
AWS_REGION=us-east-1  # optional, defaults to us-east-1
```

## How to Get AWS S3 Credentials

1. **Create an AWS Account** (if you don't have one)
2. **Create an S3 Bucket**:
   - Go to AWS S3 Console
   - Click "Create bucket"
   - Choose a unique name
   - Select your preferred region
   - Configure as needed (public access, etc.)

3. **Create IAM User**:
   - Go to AWS IAM Console
   - Create a new user
   - Attach the `AmazonS3FullAccess` policy (or create a custom policy)
   - Generate access keys

4. **Configure Bucket Permissions**:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }
   ```

## Running the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database
```bash
npm run prisma:push
```

### 3. Start Development Server
```bash
npm run dev
```

The application will now run on:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## Testing S3 Uploads

1. **Navigate to the test page**: http://localhost:5173/s3-test
2. **Select an image file**
3. **Test the upload functionality**

## Troubleshooting

### Port Issues
If you still get port conflicts:
- Kill any processes using ports 3001 or 5173
- Restart the development server

### S3 Configuration Issues
If S3 uploads don't work:
1. Verify all AWS environment variables are set
2. Check AWS credentials are correct
3. Ensure S3 bucket exists and is accessible
4. Verify bucket permissions allow public read access

### Database Issues
If database connection fails:
1. Ensure PostgreSQL is running
2. Verify DATABASE_URL is correct
3. Run `npm run prisma:push` to sync schema

## Development Workflow

1. **Start the server**: `npm run dev`
2. **Frontend development**: http://localhost:5173
3. **API testing**: http://localhost:3001/api/test-server
4. **S3 upload testing**: http://localhost:5173/s3-test

## Production Deployment

For production, ensure:
- All environment variables are properly set
- S3 bucket is configured for production use
- Database is properly configured
- SSL certificates are in place
- Proper security measures are implemented 
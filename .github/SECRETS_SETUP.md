# GitHub Secrets Setup Guide

This document outlines all the GitHub secrets required for the WorkNow CI/CD pipeline.

## Required Secrets

### Production Environment

- `PRODUCTION_HOST` - Production server hostname/IP
- `PRODUCTION_USER` - SSH username for production server
- `PRODUCTION_SSH_KEY` - Private SSH key for production server access
- `PRODUCTION_URL` - Production application URL (e.g., https://worknow.co.il)
- `DATABASE_URL` - Production PostgreSQL connection string
- `DATABASE_PASSWORD` - Production database password
- `DATABASE_HOST` - Production database host
- `DATABASE_USER` - Production database username
- `DATABASE_NAME` - Production database name

### Staging Environment

- `STAGING_HOST` - Staging server hostname/IP
- `STAGING_USER` - SSH username for staging server
- `STAGING_SSH_KEY` - Private SSH key for staging server access
- `STAGING_URL` - Staging application URL
- `STAGING_DATABASE_URL` - Staging PostgreSQL connection string
- `STAGING_REDIS_URL` - Staging Redis connection string
- `STAGING_CLERK_SECRET_KEY` - Clerk secret key for staging
- `STAGING_WEBHOOK_SECRET` - Clerk webhook secret for staging
- `STAGING_STRIPE_SECRET_KEY` - Stripe test secret key
- `STAGING_EMAIL_USER` - Test email username
- `STAGING_EMAIL_PASS` - Test email password
- `STAGING_VITE_CLERK_PUBLISHABLE_KEY` - Clerk publishable key for staging
- `STAGING_VITE_API_URL` - Staging API URL
- `STAGING_VITE_STRIPE_PUBLISHABLE_KEY` - Stripe test publishable key

### Application Secrets

- `CLERK_SECRET_KEY` - Production Clerk secret key
- `WEBHOOK_SECRET` - Production Clerk webhook secret
- `STRIPE_SECRET_KEY` - Production Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Production Stripe webhook secret
- `EMAIL_USER` - Production email username
- `EMAIL_PASS` - Production email password
- `VITE_CLERK_PUBLISHABLE_KEY` - Production Clerk publishable key
- `VITE_API_URL` - Production API URL
- `VITE_STRIPE_PUBLISHABLE_KEY` - Production Stripe publishable key

### Monitoring & Notifications

- `SLACK_WEBHOOK_URL` - Slack webhook for notifications
- `BACKUP_BUCKET` - S3 bucket name for database backups
- `AWS_ACCESS_KEY_ID` - AWS access key for S3
- `AWS_SECRET_ACCESS_KEY` - AWS secret key for S3

### AWS Frontend Deployment

- `AWS_REGION` - AWS region (e.g., us-east-1)
- `CLOUDFRONT_DISTRIBUTION_ID` - CloudFront distribution ID for cache invalidation
- `S3_BUCKET_NAME` - S3 bucket name for frontend deployment (e.g., worknow-frontend)

### Container Registry

- `GITHUB_TOKEN` - Automatically provided by GitHub Actions
- `QLTY_COVERAGE_TOKEN` - Qlty coverage reporting token

## How to Add Secrets

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each secret with the exact name listed above
5. Save the secret

## Environment-Specific Secrets

### Production Environment

Create a GitHub environment called "production" and add these secrets:

- All production-specific secrets
- Database credentials
- Server access credentials

### Staging Environment

Create a GitHub environment called "staging" and add these secrets:

- All staging-specific secrets
- Test database credentials
- Staging server access credentials

## Security Best Practices

1. **Never commit secrets to code**
2. **Use different secrets for each environment**
3. **Rotate secrets regularly**
4. **Use least-privilege access**
5. **Monitor secret usage**
6. **Use environment protection rules**

## Testing Secrets

You can test if secrets are properly configured by running the workflow manually:

```bash
# Test production deployment
gh workflow run deploy-production.yml --ref master

# Test staging deployment
gh workflow run deploy-staging.yml --ref develop
```

## Troubleshooting

### Common Issues

1. **SSH Key Issues**

   - Ensure the SSH key has proper permissions (600)
   - Test SSH connection manually: `ssh -i key user@host`

2. **Database Connection Issues**

   - Verify DATABASE_URL format
   - Check firewall rules
   - Ensure database is accessible from GitHub Actions

3. **Docker Registry Issues**
   - Verify GITHUB_TOKEN has proper permissions
   - Check if repository is public or private

### Debug Commands

```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1;"

# Test Redis connection
redis-cli -u $REDIS_URL ping

# Test SSH connection
ssh -i ~/.ssh/key user@host "echo 'Connection successful'"
```

## Secret Rotation Schedule

- **Monthly**: Application secrets (Clerk, Stripe)
- **Quarterly**: Database passwords
- **Annually**: SSH keys
- **As needed**: Email credentials

## Emergency Procedures

### If Secrets Are Compromised

1. Immediately rotate the compromised secret
2. Update all environments
3. Review access logs
4. Notify team members
5. Update documentation

### Backup Access

Always maintain backup access methods:

- Multiple SSH keys
- Alternative database access
- Emergency contact procedures

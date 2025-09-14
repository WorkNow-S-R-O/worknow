# CI/CD Pipeline Testing Guide

This guide will help you test the complete CI/CD pipeline for WorkNow.

## Prerequisites

Before testing, ensure you have:

1. **GitHub Repository** with the new workflow files
2. **GitHub Secrets** configured (see SECRETS_SETUP.md)
3. **GitHub Environments** set up (production, staging)
4. **Test Servers** (optional for full testing)

## Testing Levels

### Level 1: Basic Workflow Testing (No Servers Required)

#### 1.1 Test Node.js CI Pipeline

```bash
# Create a test branch
git checkout -b test-ci-pipeline

# Make a small change (add a comment to any file)
echo "// Test CI pipeline" >> apps/client/src/App.jsx

# Commit and push
git add .
git commit -m "test: trigger CI pipeline"
git push origin test-ci-pipeline

# Create a PR to master
gh pr create --title "Test CI Pipeline" --body "Testing the CI pipeline"
```

**Expected Results:**

- ✅ Node.js CI workflow runs
- ✅ Tests pass across Node.js versions (18.x, 20.x, 22.x)
- ✅ Docker build workflow runs
- ✅ DevSkim security scan runs
- ✅ Coverage report generates

#### 1.2 Test Docker Build Pipeline

```bash
# Push to master to trigger Docker builds
git checkout master
git merge test-ci-pipeline
git push origin master
```

**Expected Results:**

- ✅ Optimized Docker build workflow runs
- ✅ Multi-stage builds complete
- ✅ Images pushed to GitHub Container Registry
- ✅ Security scans pass

### Level 2: Staging Environment Testing

#### 2.1 Test Staging Deployment

```bash
# Create a develop branch
git checkout -b develop

# Make changes
echo "// Test staging deployment" >> apps/api/index.js

# Commit and push
git add .
git commit -m "test: staging deployment"
git push origin develop
```

**Expected Results:**

- ✅ Staging deployment workflow runs
- ✅ Staging environment is created
- ✅ Health checks pass

#### 2.2 Test PR Environment

```bash
# Create a feature branch
git checkout -b feature/test-pr-environment

# Make changes
echo "// Test PR environment" >> apps/client/src/components/JobCard.jsx

# Commit and push
git add .
git commit -m "test: PR environment"
git push origin feature/test-pr-environment

# Create PR
gh pr create --title "Test PR Environment" --body "Testing PR-specific staging environment"
```

**Expected Results:**

- ✅ PR-specific staging environment created
- ✅ PR comment with staging URL
- ✅ Environment accessible and functional

### Level 3: Production Deployment Testing

#### 3.1 Test Production Deployment (Manual)

```bash
# Ensure you're on master with latest changes
git checkout master
git pull origin master

# Trigger production deployment manually
gh workflow run deploy-production.yml --ref master
```

**Expected Results:**

- ✅ Production deployment workflow runs
- ✅ Database migration executes
- ✅ Production environment updates
- ✅ Health checks pass
- ✅ Slack notification sent

#### 3.2 Test Database Migration

```bash
# Make a schema change
# Edit prisma/schema.prisma - add a test field
echo "  testField String? // Test migration" >> prisma/schema.prisma

# Generate migration
npx prisma migrate dev --name test-migration

# Commit and push
git add .
git commit -m "test: database migration"
git push origin master
```

**Expected Results:**

- ✅ Database migration workflow runs
- ✅ Database backup created
- ✅ Migration applied successfully
- ✅ Data integrity checks pass

### Level 4: Monitoring and Alerting Testing

#### 4.1 Test Health Checks

```bash
# Trigger monitoring workflow manually
gh workflow run monitoring.yml
```

**Expected Results:**

- ✅ Health check workflow runs
- ✅ All health endpoints respond
- ✅ Performance metrics collected
- ✅ Security scan completes

#### 4.2 Test Alerting

```bash
# Simulate a failure (optional - be careful!)
# You can temporarily break a health endpoint to test alerts
```

**Expected Results:**

- ✅ Slack notifications sent
- ✅ Monitoring summary generated

## Local Testing Commands

### Test Docker Builds Locally

```bash
# Test frontend build
npm run docker:build:frontend

# Test backend build
npm run docker:build:backend

# Test full production build
npm run docker:build

# Test staging environment
npm run docker:run:staging
```

### Test Application Health

```bash
# Start the application
npm run dev

# Test health endpoint
npm run health:check

# Test in another terminal
curl -f http://localhost:3001/api/health
```

### Test Database Operations

```bash
# Test database connection
npm run prisma:studio

# Test migration
npm run prisma:migrate:dev

# Test backup
npm run db:backup
```

## GitHub Actions Testing

### View Workflow Runs

1. Go to your GitHub repository
2. Click on "Actions" tab
3. Select the workflow you want to check
4. View the logs and results

### Manual Workflow Triggers

```bash
# Trigger specific workflows manually
gh workflow run node.js.yml
gh workflow run docker-image.yml
gh workflow run deploy-staging.yml
gh workflow run monitoring.yml
```

### Workflow Status Check

```bash
# Check workflow status
gh run list

# View specific run
gh run view <run-id>

# Download logs
gh run download <run-id>
```

## Troubleshooting Common Issues

### Issue 1: Workflow Not Triggering

**Symptoms:** Workflow doesn't run after push
**Solutions:**

- Check branch names match workflow triggers
- Verify workflow files are in `.github/workflows/`
- Check for syntax errors in workflow files

### Issue 2: Docker Build Failures

**Symptoms:** Docker build fails
**Solutions:**

- Check Dockerfile syntax
- Verify all required files exist
- Check build context

### Issue 3: Secret Not Found

**Symptoms:** Workflow fails with "secret not found"
**Solutions:**

- Verify secrets are added to GitHub repository
- Check secret names match workflow requirements
- Ensure secrets are added to correct environment

### Issue 4: Database Connection Issues

**Symptoms:** Database operations fail
**Solutions:**

- Verify DATABASE_URL format
- Check database server accessibility
- Verify credentials

## Testing Checklist

### Basic CI/CD Testing

- [ ] Node.js CI pipeline runs successfully
- [ ] Docker builds complete without errors
- [ ] Security scans pass
- [ ] Coverage reports generate
- [ ] Changelog updates automatically

### Staging Environment Testing

- [ ] Staging deployment works
- [ ] PR environments are created
- [ ] Staging health checks pass
- [ ] PR comments include staging URLs
- [ ] Environment cleanup works

### Production Deployment Testing

- [ ] Production deployment succeeds
- [ ] Database migrations work
- [ ] Health checks pass
- [ ] Rollback mechanism works
- [ ] Monitoring alerts function

### Monitoring and Alerting Testing

- [ ] Health checks run on schedule
- [ ] Performance monitoring works
- [ ] Security scanning completes
- [ ] Slack notifications are sent
- [ ] Resource monitoring functions

## Advanced Testing Scenarios

### Load Testing

```bash
# Install artillery for load testing
npm install -g artillery

# Create load test
cat > load-test.yml << EOF
config:
  target: 'http://localhost:3001'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Health check"
    requests:
      - get:
          url: "/api/health"
EOF

# Run load test
artillery run load-test.yml
```

### Security Testing

```bash
# Run security audit
npm audit

# Check for vulnerabilities
npm audit --audit-level=high

# Test container security
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  wagoodman/dive:latest worknow:latest
```

### Performance Testing

```bash
# Test response times
curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:3001/api/health"

# Monitor resource usage
docker stats worknow-app --no-stream
```

## Success Criteria

Your CI/CD pipeline is working correctly if:

1. **All workflows run without errors**
2. **Tests pass consistently**
3. **Docker builds complete successfully**
4. **Deployments work reliably**
5. **Health checks pass**
6. **Monitoring functions properly**
7. **Alerts are sent when needed**
8. **Rollbacks work in emergencies**

## 4. Test AWS S3 Frontend Deployment

### Prerequisites

- AWS credentials configured in GitHub secrets
- S3 bucket `worknow-frontend` exists
- CloudFront distribution configured (optional)

### Manual Trigger

1. Go to Actions → "Deploy Frontend to AWS S3"
2. Click "Run workflow"
3. Select branch: `master`
4. Click "Run workflow"

### Expected Results

- ✅ Build and test passes
- ✅ Frontend builds with production environment variables
- ✅ AWS credentials configured
- ✅ Files uploaded to S3 bucket
- ✅ CloudFront cache invalidated (if configured)
- ✅ Slack notification sent

### Verify Deployment

```bash
# Check S3 bucket contents
aws s3 ls s3://worknow-frontend --recursive

# Test website
curl -I https://worknow.co.il
```

## Next Steps After Testing

Once testing is complete:

1. **Document any issues found**
2. **Update workflows based on test results**
3. **Configure production servers**
4. **Set up monitoring dashboards**
5. **Train team on new processes**
6. **Schedule regular pipeline reviews**

## Support

If you encounter issues during testing:

1. Check the workflow logs in GitHub Actions
2. Review the troubleshooting section above
3. Check the SECRETS_SETUP.md for configuration issues
4. Refer to the CICD_SUMMARY.md for architecture details

Remember: Start with Level 1 testing (no servers required) and gradually move to more complex scenarios as you gain confidence in the pipeline.

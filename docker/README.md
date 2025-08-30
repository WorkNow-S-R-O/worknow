 # WorkNow Docker Setup

This directory contains Docker configurations for running the WorkNow application in both development and production environments.

## Quick Start

### Development Environment

1. **Run the setup script to configure environment:**
   ```bash
   cd docker
   ./setup-env.sh
   ```

2. **Edit the environment variables in `.env` file with your actual values**
   **⚠️ CRITICAL: Replace placeholder Clerk API keys with real values**

3. **Start development environment (IMPORTANT: Use --env-file):**
   ```bash
   # From the root directory (where .env is located)
   docker-compose -f docker/docker-compose.dev.yml --env-file .env up -d
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Prisma Studio: http://localhost:5555
   - PostgreSQL: localhost:5433
   - Redis: localhost:6380

### Production Environment

1. **Copy environment file:**
   ```bash
   cp env.example .env
   ```

2. **Edit the environment variables in `.env` file with your production values**

3. **Set up SSL certificates:**
   ```bash
   mkdir -p nginx/ssl
   # Copy your SSL certificates to nginx/ssl/
   # - worknow.co.il.crt
   # - worknow.co.il.key
   ```

4. **Start production environment:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

5. **Access the application:**
   - Application: https://worknow.co.il (or your domain)
   - Health check: https://worknow.co.il/health

## File Structure

```
docker/
├── Dockerfile.prod          # Production Dockerfile
├── Dockerfile.dev           # Development Dockerfile
├── docker-compose.prod.yml  # Production services
├── docker-compose.dev.yml   # Development services
├── docker-compose.override.yml # Local development overrides
├── setup-env.sh            # Environment setup script
├── nginx/
│   └── nginx.conf          # Nginx configuration
├── init-db.sql             # Database initialization
├── env.example             # Environment variables template
└── README.md               # This file
```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `POSTGRES_PASSWORD` | PostgreSQL password | `your_secure_password` |
| `REDIS_PASSWORD` | Redis password | `your_secure_password` |
| `CLERK_SECRET_KEY` | Clerk secret key | `sk_test_...` |
| `WEBHOOK_SECRET` | Clerk webhook secret | `whsec_...` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_...` |
| `EMAIL_USER` | Email username | `your_email@gmail.com` |
| `EMAIL_PASS` | Email password/app password | `your_app_password` |
| `AWS_ACCESS_KEY_ID` | AWS access key | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | `...` |
| `AWS_REGION` | AWS region | `us-east-1` |
| `AWS_S3_BUCKET` | S3 bucket name | `your-bucket-name` |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | `pk_test_...` |
| `VITE_API_URL` | API URL | `https://worknow.co.il` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_...` |

## Commands

### Development

```bash
# Start development environment (CRITICAL: Use --env-file)
docker-compose -f docker/docker-compose.dev.yml --env-file .env up -d

# View logs
docker-compose -f docker/docker-compose.dev.yml logs -f

# Stop development environment
docker-compose -f docker/docker-compose.dev.yml down

# Rebuild development environment
docker-compose -f docker/docker-compose.dev.yml --env-file .env up -d --build

# Access container shell
docker exec -it worknow-app-dev sh
```

### Production

```bash
# Start production environment
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop production environment
docker-compose -f docker-compose.prod.yml down

# Rebuild production environment
docker-compose -f docker-compose.prod.yml up -d --build

# Scale services
docker-compose -f docker-compose.prod.yml up -d --scale worknow=3
```

### Database Operations

```bash
# Run database migrations
docker exec -it worknow-app-dev npx prisma db push

# Generate Prisma client
docker exec -it worknow-app-dev npx prisma generate

# Open Prisma Studio
# Access http://localhost:5555 in your browser

# Backup database
docker exec -it worknow-postgres-dev pg_dump -U worknow_dev worknow_dev > backup.sql

# Restore database
docker exec -i worknow-postgres-dev psql -U worknow_dev worknow_dev < backup.sql
```

## Services

### Development Services

- **worknow-dev**: Main application with hot reloading
- **postgres-dev**: PostgreSQL database (port 5433)
- **redis-dev**: Redis cache (port 6380)
- **prisma-studio**: Database management UI (port 5555)

### Production Services

- **worknow**: Main application
- **nginx**: Reverse proxy with SSL
- **postgres**: PostgreSQL database
- **redis**: Redis cache

## SSL Configuration

For production, you need to:

1. **Obtain SSL certificates** for your domain
2. **Place certificates** in `nginx/ssl/`:
   - `worknow.co.il.crt` (certificate)
   - `worknow.co.il.key` (private key)
3. **Update nginx.conf** with your domain name
4. **Configure DNS** to point to your server

## Monitoring

### Health Checks

All services include health checks:

```bash
# Check service health
docker-compose -f docker-compose.prod.yml ps

# View health check logs
docker inspect worknow-app | grep Health -A 10
```

### Logs

```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs

# View specific service logs
docker-compose -f docker-compose.prod.yml logs worknow

# Follow logs in real-time
docker-compose -f docker-compose.prod.yml logs -f
```

## Troubleshooting

### Common Issues

#### 1. Clerk API Key Errors (Most Common)
**Error**: `@clerk/clerk-react: The publishableKey passed to Clerk is invalid`

**Solution**:
1. Check that `.env` file exists in root directory
2. Verify `VITE_CLERK_PUBLISHABLE_KEY` is set to a real Clerk key (not placeholder)
3. Ensure the key starts with `pk_test_` or `pk_live_`
4. **CRITICAL**: Use `--env-file .env` when starting Docker Compose
5. Restart Docker containers after updating `.env`

**Debug Steps**:
```bash
# Check environment variables in container
docker exec -it worknow-app-dev env | grep CLERK

# Check .env file exists
ls -la ../.env

# View container logs
docker-compose -f docker/docker-compose.dev.yml logs -f worknow-dev

# Verify environment variables are loaded
docker-compose -f docker/docker-compose.dev.yml --env-file .env config | grep VITE_CLERK_PUBLISHABLE_KEY
```

#### 2. Port Conflicts
**Error**: `Port is already in use`

**Solution**:
- Make sure ports 3000, 3001, 5432, 6379 are available
- Stop other services using these ports
- Use different ports in docker-compose.yml if needed

#### 3. Permission Issues
**Error**: `Permission denied` or `EACCES`

**Solution**:
- Ensure proper file permissions for volumes
- Check that the user running Docker has access to the project directory

#### 4. Environment Variables Not Loading
**Error**: Variables showing as `undefined` or placeholder values

**Solution**:
1. Verify `.env` file is in the root directory (not in docker/ subdirectory)
2. **CRITICAL**: Use `--env-file .env` when starting Docker Compose
3. Restart containers after making changes
4. Use the setup script: `./setup-env.sh`

### Debug Commands

```bash
# Check container status
docker ps -a

# View container logs
docker logs worknow-app-dev

# Access container shell
docker exec -it worknow-app-dev sh

# Check network connectivity
docker exec -it worknow-app-dev ping redis-dev

# Verify environment variables
docker exec -it worknow-app-dev env | grep VITE_CLERK_PUBLISHABLE_KEY

# Check if .env file is being loaded
docker exec -it worknow-app-dev cat /app/.env

# Verify Docker Compose configuration with environment variables
docker-compose -f docker/docker-compose.dev.yml --env-file .env config
```

### Quick Fixes

```bash
# Stop all containers
docker-compose -f docker/docker-compose.dev.yml down

# Remove containers and volumes
docker-compose -f docker/docker-compose.dev.yml down -v

# Rebuild and start with environment variables
docker-compose -f docker/docker-compose.dev.yml --env-file .env up -d --build

# Check logs immediately
docker-compose -f docker/docker-compose.dev.yml logs -f worknow-dev
```

## Performance Optimization

### Production Optimizations

1. **Resource limits**: Set memory and CPU limits in docker-compose
2. **Caching**: Use Redis for session and data caching
3. **CDN**: Configure CDN for static assets
4. **Load balancing**: Use multiple application instances

### Development Optimizations

1. **Volume mounts**: Use volume mounts for hot reloading
2. **Node modules**: Exclude node_modules from volume mounts
3. **Build cache**: Use Docker build cache effectively

## Security

### Best Practices

1. **Use strong passwords** for databases and Redis
2. **Keep secrets in environment variables**
3. **Regular security updates** for base images
4. **Network isolation** between services
5. **SSL/TLS encryption** for production

### Security Headers

The Nginx configuration includes security headers:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Content-Security-Policy

## Backup and Recovery

### Database Backup

```bash
# Create backup
docker exec -it worknow-postgres pg_dump -U worknow worknow > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker exec -i worknow-postgres psql -U worknow worknow < backup.sql
```

### Volume Backup

```bash
# Backup volumes
docker run --rm -v worknow_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .

# Restore volumes
docker run --rm -v worknow_postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres_backup.tar.gz -C /data
```

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review container logs
3. Verify environment configuration
4. Check service health status
5. Run the setup script: `./setup-env.sh`
6. **Remember to use `--env-file .env` when starting containers** 
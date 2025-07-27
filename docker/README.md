 # WorkNow Docker Setup

This directory contains Docker configurations for running the WorkNow application in both development and production environments.

## Quick Start

### Development Environment

1. **Copy environment file:**
   ```bash
   cp env.example .env
   ```

2. **Edit the environment variables in `.env` file with your actual values**

3. **Start development environment:**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
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
   # - worknowjob.com.crt
   # - worknowjob.com.key
   ```

4. **Start production environment:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

5. **Access the application:**
   - Application: https://worknowjob.com (or your domain)
   - Health check: https://worknowjob.com/health

## File Structure

```
docker/
├── Dockerfile.prod          # Production Dockerfile
├── Dockerfile.dev           # Development Dockerfile
├── docker-compose.prod.yml  # Production services
├── docker-compose.dev.yml   # Development services
├── docker-compose.override.yml # Local development overrides
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
| `VITE_API_URL` | API URL | `https://worknowjob.com` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_...` |

## Commands

### Development

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop development environment
docker-compose -f docker-compose.dev.yml down

# Rebuild development environment
docker-compose -f docker-compose.dev.yml up -d --build

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
- **postgres**: PostgreSQL database
- **redis**: Redis cache
- **nginx**: Reverse proxy with SSL

## SSL Configuration

For production, you need to:

1. **Obtain SSL certificates** for your domain
2. **Place certificates** in `nginx/ssl/`:
   - `worknowjob.com.crt` (certificate)
   - `worknowjob.com.key` (private key)
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

1. **Port conflicts**: Make sure ports 3000, 3001, 5432, 6379 are available
2. **Permission issues**: Ensure proper file permissions for volumes
3. **Environment variables**: Verify all required variables are set
4. **SSL certificates**: Check certificate paths and permissions

### Debug Commands

```bash
# Check container status
docker ps -a

# View container logs
docker logs worknow-app-dev

# Access container shell
docker exec -it worknow-app-dev sh

# Check network connectivity
docker exec -it worknow-app-dev ping postgres-dev

# Verify environment variables
docker exec -it worknow-app-dev env | grep DATABASE_URL
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
1. Check the troubleshooting section
2. Review container logs
3. Verify environment configuration
4. Check service health status 
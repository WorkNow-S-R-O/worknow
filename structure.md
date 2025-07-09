# WorkNow Project Structure

## Root Directory
- `package.json` - Main package configuration
- `package-lock.json` - Locked dependencies
- `vite.config.js` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `tsconfig.json` - TypeScript configuration
- `tsconfig.server.json` - Server TypeScript configuration
- `Dockerfile` - Production Docker configuration
- `Dockerfile.dev` - Development Docker configuration
- `docker-compose.yml` - Docker Compose configuration

## Apps Directory
### apps/client/
- `index.html` - Main HTML entry point
- `src/` - React application source code
- `dist/` - Built frontend assets

### apps/api/
- `index.js` - Main server entry point
- `cron-jobs.js` - Automated task scheduling
- `controllers/` - Request handlers
- `routes/` - API route definitions
- `services/` - Business logic layer
- `middlewares/` - Express middlewares
- `utils/` - Utility functions
- `config/` - Configuration files

## Other Directories
- `libs/` - Shared utility libraries
- `prisma/` - Database schema and migrations
- `public/` - Static assets and locales
- `tests/` - Test files
- `tools/` - Development and utility scripts 
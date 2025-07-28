# WorkNow Project Structure

## Root Directory
- `package.json` - Main package configuration
- `package-lock.json` - Locked dependencies
- `vite.config.js` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `tsconfig.json` - TypeScript configuration
- `tsconfig.server.json` - Server TypeScript configuration
- `docker-compose.yml` - Docker Compose configuration (UPDATED to reference docker/Dockerfile.dev, include environment variables, support .env.local, and add memory limits)
- `setup-env.js` - Environment setup script
- `.env.local` - Frontend environment variables (VITE_*) (NEW)

## Docker Directory
- `docker/Dockerfile.prod` - Production Dockerfile with multi-stage build
- `docker/Dockerfile.dev` - Development Dockerfile with hot reloading
- `docker/docker-compose.prod.yml` - Production services (PostgreSQL, Redis, Nginx)
- `docker/docker-compose.dev.yml` - Development services with Prisma Studio
- `docker/docker-compose.override.yml` - Local development overrides
- `docker/nginx/nginx.conf` - Nginx reverse proxy configuration
- `docker/init-db.sql` - Database initialization script
- `docker/env.example` - Environment variables template
- `docker/.dockerignore` - Docker build exclusions
- `docker/README.md` - Docker setup and usage documentation

## GitHub Workflows
- `.github/workflows/docker-image.yml` - Docker CI/CD workflow (UPDATED to reference docker/Dockerfile)

## Apps Directory
### apps/client/
- `index.html` - Main HTML entry point
      - `src/` - React application source code
      - `components/` - Reusable UI components
          - `Navbar.jsx` - Navigation panel (UPDATED to hide mail icon when user is not logged in)
          - `JobCard.jsx` - Job card component (UPDATED with new premium color, image display, debugging, fixed glance animation to only show during upload, uses ImageModal component, and FIXED null imageUrl prop issue by conditionally rendering ImageModal)
    - `UserJobs.jsx` - User job listings component (UPDATED with new premium color, image display, debugging, fixed glance animation to only show during upload, loading progress, authentication token handling for delete and boost operations, uses ImageModal component, and FIXED null imageUrl prop issue by conditionally rendering ImageModal)
      - `UserProfile.jsx` - User profile component (UPDATED with loading progress)
      - `PremiumPage.jsx` - Premium pricing page (UPDATED with user sync and test mode price IDs)
      - `ui/ImageUpload.jsx` - Image upload component (UPDATED with useEffect for prop changes and S3 image deletion functionality)
      - `ui/ImageModal.jsx` - Reusable image modal component for displaying images in modal (UPDATED to handle null/undefined imageUrl values and made imageUrl prop optional)
      - `ui/ProgressBar.jsx` - Progress bar component for loading states (NEW)
      - `ui/SeekerFilterModal.jsx` - Filter modal component for seekers with city, category, employment, documentType, languages (array), gender, and demanded status filters matching AddSeekerModal parameters (FIXED with proper state management, array handling for languages, and missing translation keys)
      - `form/JobForm.jsx` - Job creation form (UPDATED with image upload, loading progress, submit button with loading state, and publish button text)
      - `form/EditJobForm.jsx` - Job editing form (UPDATED with authentication token handling and user authorization)
      - `form/JobFormFields.jsx` - Job form fields (UPDATED with image upload field and loading state for submit button)
      - `form/EditJobForm.jsx` - Job editing form (UPDATED with image upload, loading progress, and submit button with loading state)
      - `form/EditJobFields.jsx` - Job edit form fields (UPDATED with image upload field)
    - `contexts/ImageUploadContext.jsx` - Image upload context (NEW)
    - `contexts/LoadingContext.jsx` - Loading state management context (NEW)
          - `hooks/` - Custom React hooks
        - `useUpdateJobs.js` - Job update hooks (UPDATED with imageUrl support and loading progress)
        - `useUserSync.js` - User synchronization hook (NEW)
        - `useLoadingProgress.js` - Loading progress management hook (NEW)
        - `useJobs.js` - Job fetching hook (UPDATED with loading progress)
        - `useSeekers.js` - Seeker data management with filtering and pagination
        - `useFetchCategories.js` - Category data fetching
        - `useFetchCities.js` - City data fetching
    - `pages/` - Application pages
      - `Seekers.jsx` - Job seekers listing page (UPDATED with comprehensive filtering system matching AddSeekerModal parameters, loading progress, React Helmet for SEO, and FIXED array handling for languages filter)
      - `SeekerDetails.jsx` - Seeker details page (UPDATED with loading progress, fixed API URL for logged out users, and React Helmet for SEO)
    - `store/` - State management stores
      - `filterStore.js` - Job filtering state management
      - `seekerFilterStore.js` - Seeker filtering state management with city, category, employment, documentType, languages (array), gender, and demanded status filters matching AddSeekerModal parameters (FIXED with proper array initialization for languages)
      - `languageStore.ts` - Language state management
    - `index.css` - Global styles (UPDATED with new premium color scheme)
- `dist/` - Built frontend assets

### apps/api/
      - `index.js` - Main server entry point (UPDATED with upload routes, CORS configuration, static image serving, test endpoints, database debugging, production static file serving, security headers, proper route ordering, API error handling, improved CSP for development, static file serving for development mode, fixed route order for API endpoints, and Redis health check and cache management endpoints)
- `cron-jobs.js` - Automated task scheduling
- `controllers/` - Request handlers
  - `messages.js` - Messages controller (UPDATED with reduced logging to prevent spam)
  - `jobsController.js` - Jobs controller (UPDATED with proper user authentication and clerkUserId extraction for create, update, and delete operations)
  - `seekerController.js` - Seekers controller (UPDATED with comprehensive filtering support for city, category, employment, documentType, languages (array), gender, and demanded status matching AddSeekerModal parameters and FIXED array handling for languages from query parameters)
- `routes/` - API route definitions
        - `upload.js` - Image upload routes (UPDATED with full URL generation and debugging)
        - `jobs.js` - Job routes (UPDATED with authentication middleware and proper user extraction)
- `services/` - Business logic layer
  - `jobCreateService.js` - Job creation service (UPDATED with image support and debugging)
  - `editFormService.js` - Job editing service (UPDATED with image support and user authorization check)
  - `jobDeleteService.js` - Job deletion service (UPDATED with user authorization check and S3 image cleanup)
  - `getJobService.js` - Job fetching service (UPDATED with user and imageUrl support and debugging)
  - `getJobById.js` - Job fetching service (UPDATED with user and imageUrl support)
  - `jobService.js` - Job service (UPDATED with Redis caching, pagination, and cache invalidation)
  - `aiJobTitleService.js` - AI-powered job title generation service (NEW)
  - `userService.js` - User service (UPDATED with reduced logging)
  - `redisService.js` - Redis caching and session management service (NEW)
  - `seekerService.js` - Seeker service (UPDATED with comprehensive filtering and pagination support matching AddSeekerModal parameters and FIXED array handling for languages with hasSome Prisma operator)
- `middlewares/` - Express middlewares
  - `auth.js` - Authentication middleware (UPDATED with JWT token decoding and user extraction for development)
  - `cache.js` - Redis caching and rate limiting middleware (NEW)
- `utils/` - Utility functions
  - `testAITitleGeneration.js` - AI job title generation test suite (NEW)
  - `updateJobsWithAITitles.js` - AI-powered job title update script (NEW)
  - `showCurrentJobTitles.js` - Job title display and analysis script (NEW)
  - `upload.js` - File upload configuration (NEW)
- `config/` - Configuration files

## Other Directories
- `libs/` - Shared utility libraries
- `prisma/` - Database schema and migrations
  - `public/` - Static assets and locales
    - `locales/` - Translation files
          - `ru/translation.json` - Russian translations (UPDATED with note premium message, publish button text, publishing loading state, image deletion messages, seeker filter translations matching AddSeekerModal parameters, and FIXED missing translation keys for city, choose_city, and seekers_description)
    - `en/translation.json` - English translations (UPDATED with note premium message, publish button text, publishing loading state, image deletion messages, seeker filter translations matching AddSeekerModal parameters, and FIXED missing translation keys for city, choose_city, and seekers_description)
    - `he/translation.json` - Hebrew translations (UPDATED with note premium message, publish button text, publishing loading state, image deletion messages, seeker filter translations matching AddSeekerModal parameters, and FIXED missing translation keys for city, choose_city, and seekers_description)
    - `ar/translation.json` - Arabic translations (UPDATED with note premium message, publish button text, publishing loading state, image deletion messages, seeker filter translations matching AddSeekerModal parameters, and FIXED missing translation keys for city, choose_city, and seekers_description)
- `tests/` - Test files
- `tools/` - Development and utility scripts 
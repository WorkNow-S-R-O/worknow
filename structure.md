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
    - `components/` - Reusable UI components
          - `JobCard.jsx` - Job card component (UPDATED with new premium color, image display, debugging, and fixed glance animation to only show during upload)
    - `UserJobs.jsx` - User job listings component (UPDATED with new premium color, image display, debugging, and fixed glance animation to only show during upload)
      - `PremiumPage.jsx` - Premium pricing page (UPDATED with user sync and test mode price IDs)
      - `ui/ImageUpload.jsx` - Image upload component (UPDATED with useEffect for prop changes)
      - `form/JobForm.jsx` - Job creation form (UPDATED with image upload)
      - `form/JobFormFields.jsx` - Job form fields (UPDATED with image upload field)
      - `form/EditJobForm.jsx` - Job editing form (UPDATED with image upload)
      - `form/EditJobFields.jsx` - Job edit form fields (UPDATED with image upload field)
    - `contexts/ImageUploadContext.jsx` - Image upload context (NEW)
    - `hooks/` - Custom React hooks
      - `useUpdateJobs.js` - Job update hooks (UPDATED with imageUrl support)
      - `useUserSync.js` - User synchronization hook (NEW)
    - `index.css` - Global styles (UPDATED with new premium color scheme)
- `dist/` - Built frontend assets

### apps/api/
      - `index.js` - Main server entry point (UPDATED with upload routes, CORS configuration, static image serving, test endpoints, database debugging, production static file serving, security headers, proper route ordering, and API error handling)
- `cron-jobs.js` - Automated task scheduling
- `controllers/` - Request handlers
- `routes/` - API route definitions
        - `upload.js` - Image upload routes (UPDATED with full URL generation and debugging)
- `services/` - Business logic layer
  - `jobCreateService.js` - Job creation service (UPDATED with image support and debugging)
  - `editFormService.js` - Job editing service (UPDATED with image support)
  - `getJobService.js` - Job fetching service (UPDATED with user and imageUrl support and debugging)
  - `getJobById.js` - Job fetching service (UPDATED with user and imageUrl support)
- `middlewares/` - Express middlewares
  - `auth.js` - Authentication middleware (UPDATED with requireAuth function)
- `utils/` - Utility functions
  - `upload.js` - File upload configuration (NEW)
- `config/` - Configuration files

## Other Directories
- `libs/` - Shared utility libraries
- `prisma/` - Database schema and migrations
  - `public/` - Static assets and locales
    - `locales/` - Translation files
      - `ru/translation.json` - Russian translations (UPDATED with note premium message)
      - `en/translation.json` - English translations (UPDATED with note premium message)
      - `he/translation.json` - Hebrew translations (UPDATED with note premium message)
      - `ar/translation.json` - Arabic translations (UPDATED with note premium message)
- `tests/` - Test files
- `tools/` - Development and utility scripts 
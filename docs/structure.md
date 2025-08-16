# WorkNow Project Structure

## Root Directory
- package.json - Main project configuration
- vite.config.js - Vite build configuration
- tailwind.config.js - Tailwind CSS configuration
- tsconfig.json - TypeScript configuration
- jest.config.cjs - Jest testing configuration
- README.md - Project documentation
- structure.md - Project file structure documentation

## Configuration
- config/imageModeration.config.js - Image moderation system configuration

## Documentation
- docs/CANDIDATE_NOTIFICATIONS.md - Candidate notification system documentation
- docs/IMAGE_MODERATION_CONFIG.md - Image moderation configuration guide

## Tests Directory
- tests/setup.js - Test setup and global mocks
- tests/home-page-sorting.test.jsx - Home page sorting functionality tests
- tests/newsletter.test.jsx - Newsletter functionality tests
- tests/job-posting.test.jsx - Job posting functionality tests
- tests/seekers-functionality.test.jsx - Job seekers functionality tests
- tests/job-editing.test.jsx - Job editing functionality tests
- tests/job-form.test.jsx - JobForm component unit tests

## Apps Directory
### API (Backend)
- apps/api/index.js - Main server entry point
- apps/api/config/clerkConfig.js - Clerk authentication configuration
- apps/api/controllers/ - Request handlers
  - jobController.js - Job management
  - userController.js - User management
  - payments.js - Payment processing
  - messages.js - Messaging system
  - webhookController.js - Webhook handlers
  - seekerController.js - Seeker management
- apps/api/routes/ - API route definitions
  - jobs.js - Job endpoints
  - users.js - User endpoints
  - payments.js - Payment endpoints
  - webhook.js - Webhook endpoints
  - seekers.js - Seeker endpoints
- apps/api/services/ - Business logic layer
  - jobService.js - Job business logic
  - userService.js - User business logic
  - webhookService.js - Webhook processing
  - seekerService.js - Seeker business logic with city translation
  - cityService.js - City data service with translations
  - candidateNotificationService.js - Candidate notification service for newsletter subscribers
  - imageModerationService.js - Configurable image content moderation service
- apps/api/middlewares/ - Express middlewares
  - auth.js - Authentication middleware
  - validation.js - Input validation
- apps/api/utils/ - Utility functions
  - mailer.js - Email utilities
  - telegram.js - Telegram integration
  - stripe.js - Stripe utilities
  - badWordsList.js - Content filtering
  - napcep.js - City data utilities

### Client (Frontend)
- apps/client/index.html - Main HTML file
- apps/client/src/App.jsx - Main React application
- apps/client/src/main.jsx - React entry point
- apps/client/src/pages/ - Page components
  - Home.jsx - Landing page
  - SeekerDetails.jsx - Individual seeker details (clean component using translation helpers)
  - Seekers.jsx - Seekers listing
  - CreateNewAd.jsx - Job creation
  - MyAds.jsx - User's job listings
  - UserProfile.jsx - User profile
  - PremiumPage.jsx - Premium features
  - NewsletterSubscription.jsx - Newsletter subscription with full internationalization
- apps/client/src/components/ - Reusable components
  - JobCard.jsx - Job listing card
  - JobList.jsx - Job listings container
  - JobForm.jsx - Job creation/editing form
  - Navbar.jsx - Navigation panel
  - UserProfile.jsx - User profile component
  - UserJobs.jsx - User job listings with comprehensive translations (date, city, timer)
  - form/ - Form components
    - AddSeekerModal.jsx - Seeker addition modal with Arabic instead of Ukrainian language option
    - EditJobFields.jsx - Pre-populated edit fields
    - JobForm.jsx - Job creation/editing form
    - JobFormFields.jsx - Individual form field components
    - JobFormSchema.js - Form validation schema
  - ui/ - UI components
  - routes/ - Routing components
- apps/client/src/hooks/ - Custom React hooks
  - useJobs.js - Job data management
  - useUpdateJobs.js - Job modification
  - useFetchCategories.js - Category data
  - useFetchCities.js - City data
  - useSeekers.js - Seeker data
  - useUserSync.js - User synchronization
- apps/client/src/store/ - State management (Zustand)
  - filterStore.js - Job filtering state
  - languageStore.ts - Internationalization state
  - seekerFilterStore.js - Seeker filtering state
- apps/client/src/utils/ - Utility functions
  - translationHelpers.js - Translation helper functions for field labels
- apps/client/src/css/ - Stylesheets
  - seeker-details-mobile.css - Mobile styles for seeker details
  - ripple.css - Loading animation styles
- apps/client/src/contexts/ - React contexts
  - ImageUploadContext.jsx - Image upload context
  - LoadingContext.jsx - Loading state context

## Public Directory
- public/images/ - Static images
  - jobs/ - Job-related images
  - logo.svg - Application logo
  - premium.png - Premium features image
- public/locales/ - Translation files (fully internationalized with comprehensive field translations including cities, dates, and timers)
  - ru/translation.json - Russian translations (includes comprehensive employment, category, language, document, city, date, and timer translations)
  - en/translation.json - English translations (includes comprehensive employment, category, language, document, city, date, and timer translations)
  - he/translation.json - Hebrew translations (includes comprehensive employment, category, language, document, city, date, and timer translations)
  - ar/translation.json - Arabic translations (includes comprehensive employment, category, language, document, city, date, and timer translations)

## Prisma Directory
- prisma/schema.prisma - Database schema
- prisma/migrations/ - Database migrations
- prisma/seed.js - Database seeding

## Docker Directory
- docker/Dockerfile.dev - Development Dockerfile with hot reloading
- docker/Dockerfile.prod - Production Dockerfile
- docker/docker-compose.dev.yml - Development services configuration
- docker/docker-compose.prod.yml - Production services configuration
- docker/docker-compose.override.yml - Local development overrides
- docker/setup-env.sh - Environment setup script for Docker configuration
- docker/env.example - Environment variables template
- docker/README.md - Docker setup and troubleshooting documentation
- docker/nginx/ - Nginx configuration for production
- docker/init-db.sql - Database initialization script

## Tools Directory
- tools/ - Development and testing tools
  - test-candidate-notifications.js - Test script for candidate notification system
  - test-moderation-modes.js - Test script for image moderation modes
  - check-existing-images.js - Script to check existing images for moderation violations

## Tests Directory
- tests/ - Test files
  - __snapshots__/ - Jest snapshots
  - setup.jsx - Vitest test setup and mocks
  - job-posting.test.jsx - Job posting functionality tests
  - job-editing.test.jsx - Job editing and updating tests
  - home-page-sorting.test.jsx - Home page sorting and filtering tests
  - seekers-functionality.test.jsx - Seekers functionality tests
  - newsletter.test.jsx - Newsletter functionality tests
  - premium-page.test.js - Premium page tests
  - user-header.test.js - User header tests 
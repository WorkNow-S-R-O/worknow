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
- apps/client/src/App.jsx - Main React application (migrated to Intlayer)
- apps/client/src/main.jsx - React entry point
- apps/client/src/content/ - Intlayer content files
  - home.content.tsx - Home page translations
  - jobListing.content.tsx - Job listing component translations
  - common.content.tsx - Common UI element translations
  - navbar.content.tsx - Navigation component translations
  - jobCard.content.tsx - Job card component translations
  - jobForm.content.tsx - Job form component translations
  - jobFormFields.content.tsx - Job form fields translations
  - premiumPage.content.tsx - Premium page translations
  - userJobs.content.tsx - User jobs component translations
  - seekers.content.tsx - Seekers page translations
  - imageUpload.content.tsx - Image upload context translations
  - premiumButton.content.tsx - Premium button component translations
  - button.content.tsx - Button component translations
  - verificationModal.content.tsx - Verification modal translations
  - mailDropdown.content.tsx - Mail dropdown component translations
  - translationHelpers.content.tsx - Translation helper utilities translations
  - cityDropdown.content.tsx - City dropdown component translations
  - newsletterModal.content.tsx - Newsletter modal component translations
  - newsletterAdmin.content.tsx - Newsletter admin component translations
  - seekerFilterModal.content.tsx - Seeker filter modal component translations
  - imageUploadComponent.content.tsx - Image upload component translations
  - addSeekerModal.content.tsx - Add seeker modal component translations
  - editJobFields.content.tsx - Edit job fields component translations
  - createNewAd.content.tsx - Create new advertisement page translations
  - editJobForm.content.tsx - Edit job form component translations
  - notFoundPage.content.tsx - 404 not found page translations
- apps/client/src/pages/ - Page components
  - Home.jsx - Landing page (migrated to Intlayer)
  - SeekerDetails.jsx - Individual seeker details (clean component using translation helpers)
  - Seekers.jsx - Seekers listing with newsletter subscription status indicator (migrated to Intlayer)
  - CreateNewAd.jsx - Job creation (migrated to Intlayer)
  - MyAds.jsx - User's job listings
  - UserProfile.jsx - User profile
  - PremiumPage.jsx - Premium features with dynamic pricing (200₪ for new users, 100₪ for Pro users) and badges (Recommended for Pro, Best results for Deluxe), recruiter community feature removed, Facebook autoposting icon updated to lightning bolt
  - NewsletterSubscription.jsx - Newsletter subscription with full internationalization and simplified subscription status banner
  - NotFoundPage.jsx - 404 not found page (migrated to Intlayer)
- apps/client/src/components/ - Reusable components
  - JobCard.jsx - Job listing card (migrated to Intlayer)
  - JobList.jsx - Job listings container
  - JobForm.jsx - Job creation/editing form (migrated to Intlayer)
  - Navbar.jsx - Navigation panel (migrated to Intlayer)
  - UserProfile.jsx - User profile component
  - UserJobs.jsx - User job listings with comprehensive translations (migrated to Intlayer)
  - PremiumPage.jsx - Premium features page (migrated to Intlayer)
  - form/ - Form components
    - AddSeekerModal.jsx - Seeker addition modal with Arabic instead of Ukrainian language option (migrated to Intlayer)
    - EditJobFields.jsx - Pre-populated edit fields (migrated to Intlayer)
    - EditJobForm.jsx - Job editing form (migrated to Intlayer)
    - JobForm.jsx - Job creation/editing form
    - JobFormFields.jsx - Individual form field components (migrated to Intlayer)
    - JobFormSchema.js - Form validation schema
  - ui/ - UI components
    - premium-button.jsx - Premium upgrade button (migrated to Intlayer)
    - button.jsx - Main action button component (migrated to Intlayer)
    - VerificationModal.jsx - Email verification modal (migrated to Intlayer)
    - JobFilterModal.jsx - Job filtering modal (migrated to Intlayer)
    - MailDropdown.jsx - Mail dropdown component (migrated to Intlayer)
    - city-dropwdown.jsx - City selection dropdown (migrated to Intlayer)
    - NewsletterModal.jsx - Newsletter subscription modal (migrated to Intlayer)
    - NewsletterAdmin.jsx - Newsletter administration (migrated to Intlayer)
    - SeekerFilterModal.jsx - Seeker filtering modal (migrated to Intlayer)
    - ImageUpload.jsx - Image upload component (migrated to Intlayer)
  - routes/ - Routing components
- apps/client/src/hooks/ - Custom React hooks
  - useJobs.js - Job data management
  - useUpdateJobs.js - Job modification
  - useFetchCategories.js - Category data
  - useFetchCities.js - City data
  - useSeekers.js - Seeker data
  - useUserSync.js - User synchronization
  - useI18nHTMLAttributes.tsx - Intlayer HTML attributes hook
- apps/client/src/store/ - State management (Zustand)
  - filterStore.js - Job filtering state
  - languageStore.ts - Legacy internationalization state (being migrated to Intlayer)
  - seekerFilterStore.js - Seeker filtering state
- apps/client/src/utils/ - Utility functions
  - translationHelpers.js - Translation helper functions for field labels (migrated to Intlayer)
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
- public/locales/ - Translation files (legacy i18next translations - being migrated to Intlayer)
  - ru/translation.json - Russian translations (includes comprehensive employment, category, language, document, city, date, timer, and dynamic premium pricing translations)
  - en/translation.json - English translations (includes comprehensive employment, category, language, document, city, date, timer, and dynamic premium pricing translations)
  - he/translation.json - Hebrew translations (includes comprehensive employment, category, language, document, city, date, timer, and dynamic premium pricing translations)
  - ar/translation.json - Arabic translations (includes comprehensive employment, category, language, document, city, date, timer, and dynamic premium pricing translations)

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
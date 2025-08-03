# WorkNow Project Structure

## Root Directory
- `package.json` - Main package configuration
- `package-lock.json` - Locked dependencies
- `vite.config.js` - Vite build configuration (UPDATED with proper proxy configuration for development)
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `tsconfig.json` - TypeScript configuration
- `tsconfig.server.json` - Server TypeScript configuration
- `docker-compose.yml` - Docker Compose configuration (UPDATED to reference docker/Dockerfile.dev, include environment variables, support .env.local, and add memory limits)
- `setup-env.js` - Environment setup script (UPDATED with correct VITE_API_URL for development)
- `.env.local` - Frontend environment variables (VITE_*) (UPDATED with VITE_API_URL=http://localhost:3000)
- `.env` - Backend environment variables (UPDATED with correct CLERK_SECRET_KEY)
- `structure.md` - This file (UPDATED with current working state)

## Apps Directory

### API (Backend)
- `apps/api/index.js` - Main server entry point (UPDATED with proper environment variable loading and CORS configuration)
- `apps/api/config/clerkConfig.js` - Clerk authentication configuration (UPDATED with correct environment variable names)
  - `apps/api/controllers/` - Request handlers
    - `userController.js` - User management (UPDATED with proper error handling)
    - `usersController.js` - User sync and management (UPDATED with improved error handling)
    - `jobController.js` - Job management
    - `seekerController.js` - Job seekers management
    - `categoryController.js` - Categories management
    - `cityController.js` - Cities management
    - `payments.js` - Payment processing
    - `messages.js` - Messaging system
    - `webhookController.js` - Webhook handlers
    - `newsletterController.js` - Newsletter subscription and email sending (UPDATED with improved unsubscribe functionality and email verification)
- `apps/api/routes/` - API route definitions
  - `users.js` - User endpoints (UPDATED - removed duplicate userSync routes)
  - `jobs.js` - Job endpoints
  - `seekers.js` - Seeker endpoints
  - `categories.js` - Category endpoints
  - `cities.js` - City endpoints
  - `payments.js` - Payment endpoints
  - `messages.js` - Message endpoints
  - `webhook.js` - Webhook endpoints
  - `upload.js` - File upload endpoints
  - `s3Upload.js` - S3 upload endpoints
  - `newsletter.js` - Newsletter subscription and email endpoints (UPDATED with improved state management)
  - `apps/api/services/` - Business logic layer
    - `userService.js` - User business logic (UPDATED with improved error handling and logging)
    - `jobService.js` - Job business logic
    - `seekerService.js` - Seeker business logic
    - `cityService.js` - City business logic
    - `createJobService.js` - Job creation logic
    - `editFormService.js` - Form editing logic
    - `getJobService.js` - Job retrieval logic
    - `getUserByClerkService.js` - User retrieval logic
    - `jobBoostService.js` - Job boosting logic
    - `jobCreateService.js` - Job creation logic
    - `jobDeleteService.js` - Job deletion logic
    - `redisService.js` - Redis caching service
    - `s3UploadService.js` - S3 upload service
    - `imageModerationService.js` - Image moderation service using AWS Rekognition (NEW)
    - `updateUserService.js` - User update logic
    - `webhookService.js` - Webhook processing logic
    - `aiJobTitleService.js` - AI job title generation service (UPDATED with exponential backoff rate limit handling)
    - `notificationService.js` - Candidate notification service (NEW)
    - `snsService.js` - AWS SNS email verification service (NEW)
- `apps/api/middlewares/` - Express middlewares
  - `auth.js` - Authentication middleware
  - `validation.js` - Input validation
  - `cache.js` - Caching middleware
- `apps/api/utils/` - Utility functions
  - `mailer.js` - Email utilities
  - `telegram.js` - Telegram integration
  - `stripe.js` - Stripe utilities
  - `badWordsList.js` - Content filtering
  - `cron-jobs.js` - Automated task scheduling
  - `s3Upload.js` - S3 upload utilities
  - `upload.js` - File upload utilities
  - `toastUtils.js` - Toast notification utilities
  - `attachJobsToUsers.js` - Job attachment utilities
  - `fakeUsers.js` - Test user generation
  - `napcep.js` - Additional utilities (UPDATED with improved rate limit handling)
  - `showCurrentJobTitles.js` - Job title utilities
  - `testAITitleGeneration.js` - AI title generation testing
  - `updateJobsWithAITitles.js` - Job title updates
  - `formService.js` - Form processing utilities
  - `jobService.js` - Job service utilities
  - `editFormService.js` - Form editing utilities
  - `test-rate-limit.js` - Rate limit handling test script (NEW)
  - `test-candidate-notifications.js` - Candidate notification test script (NEW)
  - `test-newsletter-functionality.js` - Newsletter functionality test script (NEW)
  - `test-newsletter-ui.js` - Newsletter UI flow test script (NEW)
  - `test-image-moderation.js` - Image moderation test script (NEW)
  - `test-button-text.js` - Button text change test script (NEW)
  - `test-button-behavior.js` - Button behavior test script (NEW)

### Client (Frontend)
- `apps/client/index.html` - Main HTML file
- `apps/client/src/` - Source code
  - `App.jsx` - Main application component
  - `main.jsx` - Application entry point
  - `index.css` - Global styles
  - `18n.ts` - Internationalization configuration
  - `components/` - Reusable UI components
    - `Navbar.jsx` - Navigation component
    - `Footer.jsx` - Footer component
    - `JobCard.jsx` - Job listing card (UPDATED with improved error handling)
    - `JobList.jsx` - Job listings container
    - `JobListing.jsx` - Job listing page
    - `UserHeader.jsx` - User header component
    - `UserJobs.jsx` - User jobs component
    - `UserProfile.jsx` - User profile component
    - `PremiumPage.jsx` - Premium features page
    - `BillingPage.jsx` - Billing management page
    - `CancelSubscription.jsx` - Subscription cancellation
    - `SupportPage.jsx` - Support page (UPDATED with modern design, hero section, multiple contact methods, FAQ section, and professional styling)
    - `SurveyWidget.jsx` - Survey component
    - `PaginationControl.jsx` - Pagination component
    - `form/` - Form components
      - `JobForm.jsx` - Job creation/editing form
      - `JobFormFields.jsx` - Job form fields
      - `EditJobFields.jsx` - Edit job fields
      - `EditJobForm.jsx` - Edit job form
      - `AddSeekerModal.jsx` - Add seeker modal
      - `JobFormSchema.js` - Form validation schema
    - `routes/` - Route components
      - `ProtectedRoute.jsx` - Protected route wrapper
    - `ui/` - UI components
      - `button.jsx` - Button component
      - `city-dropwdown.jsx` - City dropdown (UPDATED with improved error handling)
      - `FilterIcon.jsx` - Filter icon
      - `ImageModal.jsx` - Image modal
      - `ImageUpload.jsx` - Image upload
      - `JobFilterModal.jsx` - Job filter modal
      - `MailDropdown.jsx` - Mail dropdown
      - `premium-button.jsx` - Premium button
      - `ProgressBar.jsx` - Progress bar
      - `SeekerFilterModal.jsx` - Seeker filter modal
      - `NewsletterModal.jsx` - Newsletter subscription modal (UPDATED with improved subscription state management, field disabling, unsubscribe functionality, and email verification)
      - `VerificationModal.jsx` - Email verification modal for newsletter subscription (NEW)
      - `spinner.tsx` - Loading spinner
      - `index.ts` - UI components index
  - `contexts/` - React contexts
    - `ImageUploadContext.jsx` - Image upload context (UPDATED with correct API URL)
    - `LoadingContext.jsx` - Loading context
  - `hooks/` - Custom React hooks
    - `useJobs.js` - Job data management
    - `useUpdateJobs.js` - Job modification operations
    - `useFetchCategories.js` - Category data fetching
    - `useFetchCities.js` - City data fetching
    - `useSeekers.js` - Seeker data management
    - `useUserSync.js` - User synchronization (UPDATED with improved error handling)
    - `useLoadingProgress.js` - Loading progress management
  - `pages/` - Application pages
    - `Home.jsx` - Home page
    - `CreateNewAd.jsx` - Create advertisement page
    - `MyAds.jsx` - My advertisements page
    - `Seekers.jsx` - Job seekers page
    - `SeekerDetails.jsx` - Seeker details page
    - `Success.jsx` - Success page
    - `Cancel.jsx` - Cancel page
    - `AccessDenied.jsx` - Access denied page
    - `NotFoundPage.jsx` - 404 page
    - `NewsletterSubscription.jsx` - Newsletter subscription page (UPDATED with email verification integration)
  - `store/` - State management (Zustand)
    - `languageStore.ts` - Language state management
    - `filterStore.js` - Filter state management
    - `seekerFilterStore.js` - Seeker filter state management
  - `css/` - Stylesheets
    - Bootstrap CSS files
    - Custom CSS files
    - Animation CSS files
    - `seekers-mobile.css` - Seekers page mobile styles

## Public Directory
- `public/images/` - Static images
  - `logo.svg` - Application logo
  - `worknow-logo.jpg` - WorkNow logo
  - `premium.png` - Premium features image
  - `worker.png` - Worker image
  - `hammer.png` - Hammer image
  - `padlock.jpg` - Padlock image
  - `404.jpg` - 404 page image
  - `vite.svg` - Vite logo
  - `jobs/` - Job-related images
- `public/locales/` - Translation files
  - `ru/translation.json` - Russian translations
  - `en/translation.json` - English translations
  - `he/translation.json` - Hebrew translations
  - `ar/translation.json` - Arabic translations
- `public/sitemap*.xml` - SEO sitemap files

## Database
- `prisma/` - Database schema and migrations
  - `schema.prisma` - Database schema definition (UPDATED with NewsletterSubscriber model)
  - `migrations/` - Database migration files
  - `seed.js` - Database seeding script
  - `create-seeker-table.sql` - Seeker table creation script

## Configuration Files
- `jest.config.cjs` - Jest testing configuration
- `jest.setup.js` - Jest setup configuration
- `eslint.config.js` - ESLint configuration
- `eslintrc.js` - ESLint configuration
- `components.json` - Component configuration

## Documentation
- `README.md` - Project documentation
- `CHANGELOG.md` - Change log
- `LICENSE` - License file
- `SECURITY.md` - Security documentation
- `SETUP_GUIDE.md` - Setup guide
- `FRONTEND_S3_INTEGRATION.md` - S3 integration documentation
- `JOB_TITLE_GENERATION_INTEGRATION.md` - AI job title generation documentation
- `AI_JOB_TITLE_GENERATION.md` - AI job title generation documentation
- `IMAGE_MODERATION_GUIDE.md` - Image moderation implementation guide (NEW)

## Tools and Scripts
- `tools/` - Development tools
  - `broadcast-example.js` - Broadcast example
  - `fix-job-categories.js` - Job category fixes
  - `make-admin.js` - Admin user creation
  - `test-sns-verification.js` - SNS email verification test script (NEW)
- `tests/` - Test files
  - `user-header.test.js` - User header tests
  - `__snapshots__/` - Test snapshots
- `redis-demo.js` - Redis demonstration
- `test-job-creation.js` - Job creation testing
- `test-s3-upload.js` - S3 upload testing

## Docker Configuration
- `docker/` - Docker configuration
  - `Dockerfile.dev` - Development Dockerfile
  - `Dockerfile.prod` - Production Dockerfile
  - `docker-compose.dev.yml` - Development Docker Compose
  - `docker-compose.prod.yml` - Production Docker Compose
  - `docker-compose.override.yml` - Docker Compose override
  - `env.example` - Environment variables example
  - `init-db.sql` - Database initialization
  - `nginx/nginx.conf` - Nginx configuration
  - `README.md` - Docker documentation
  - `uploads/` - Upload directory

## Current Status: ✅ WORKING

### ✅ Issues Fixed:
1. **CORS Errors** - Fixed by updating `VITE_API_URL` to use proxy
2. **Backend Environment Variables** - Fixed by loading `.env.local` first and updating `.env` with correct keys
3. **NODE_ENV Configuration** - Changed from production to development
4. **Vite Proxy Configuration** - Updated with proper settings
5. **Error Handling** - Added comprehensive error handling in components
6. **API Proxy** - All API endpoints now work correctly through the proxy
7. **User Sync Issues** - Fixed by correcting environment variable loading order and API key configuration
8. **Duplicate Routes** - Removed conflicting user sync routes
9. **SeekerFilterModal UI** - Updated modal to be wider and more rectangular with better layout
10. **Rate Limit Handling** - Fixed AI job title generation with exponential backoff retry logic (NEW)
11. **NewsletterModal State Management** - Improved subscription state handling with proper field disabling and unsubscribe functionality (NEW)
12. **Email Verification System** - Implemented AWS SNS-based email verification for newsletter subscription with integration into NewsletterSubscription page (NEW)

### ✅ Verified Working:
- ✅ Frontend server: `http://localhost:3000`
- ✅ Backend server: `http://localhost:3001`
- ✅ API proxy: All endpoints working through proxy
- ✅ User sync: Clerk API integration working
- ✅ Database: User creation and retrieval working
- ✅ Environment variables: All properly loaded
- ✅ CORS: Cross-origin requests working
- ✅ Error handling: Comprehensive error handling implemented
- ✅ SeekerFilterModal: Wider modal with improved two-column layout for desktop
- ✅ AI Job Title Generation: Rate limit handling with exponential backoff (NEW)
- ✅ NewsletterModal: Improved subscription state management with field disabling, unsubscribe functionality, and email verification (NEW)
- ✅ NewsletterSubscription Page: Integrated email verification flow with AWS SNS (NEW)
- ✅ VerificationModal: Email verification modal with timer, resend functionality, and proper error handling (NEW)
- ✅ SNS Service: AWS SNS integration for email verification with code generation and validation (NEW)

### 🧪 Tested Endpoints:
- ✅ `/api/health` - Health check
- ✅ `/api/test-server` - Server test
- ✅ `/api/test-clerk-api` - Clerk API test
- ✅ `/api/users/sync-user` - User synchronization
- ✅ `/api/users/:clerkUserId` - User retrieval
- ✅ `/api/cities` - Cities data
- ✅ `/api/categories` - Categories data
- ✅ `/api/seekers` - Job seekers data
- ✅ `/api/newsletter/*` - Newsletter subscription endpoints (NEW)
- ✅ `/api/newsletter/send-verification` - Send verification code endpoint (NEW)
- ✅ `/api/newsletter/verify-code` - Verify code endpoint (NEW)

### 🔧 Key Fixes Applied:
1. **Environment Variables**: Fixed loading order and corrected API keys
2. **Proxy Configuration**: Updated Vite proxy settings for proper API routing
3. **Error Handling**: Added comprehensive error handling in frontend components
4. **Route Conflicts**: Removed duplicate user sync routes
5. **API Integration**: Fixed Clerk API integration with proper authentication
6. **UI Improvements**: Enhanced SeekerFilterModal with wider layout and better organization
7. **Rate Limit Handling**: Implemented exponential backoff retry logic for AI job title generation (NEW)
8. **NewsletterModal Improvements**: Enhanced subscription state management with proper field disabling, unsubscribe functionality, and email verification (NEW)
9. **Email Verification System**: Implemented AWS SNS-based email verification with code generation, validation, expiration handling, and integration into NewsletterSubscription page (NEW)

### 🎨 Recent UI Updates:
- **SeekerFilterModal**: 
  - Increased width from 550px to 800px
  - Increased height from 600px to 700px
  - Added responsive max-width/max-height constraints
  - Implemented two-column grid layout for desktop
  - Maintained single-column layout for mobile
  - Better organized form fields for improved usability
- **PremiumPage**: 
  - Fixed authentication logic to prevent showing "Active" status when logged out
  - Improved button state management for different user authentication states
  - Cleaned up unused state variables and imports
  - Fixed Enterprise plan pricing and price ID configuration
  - Corrected Pro plan to use proper price ID instead of undefined
  - Fixed Enterprise button logic to properly show "Active" status when user has premiumDeluxe
  - Fixed payment error by using existing working price ID for Enterprise plan
  - Added fallback mechanism for invalid price IDs in Stripe
  - Improved error handling and logging for payment processing
  - Updated Enterprise plan to use dynamic price IDs based on user subscription status
  - Fixed category display issue in SeekerFilterModal by correcting property mapping
  - Fixed Enterprise payment error by using correct test mode price IDs:
    - Enterprise (199₪): price_1RqXuoCOLiDbHvw1LLew4Mo8
    - Enterprise Upgrade (100₪): price_1RqXveCOLiDbHvw18RQxj2g6
    - Pro (99₪): price_1Qt63NCOLiDbHvw13PRhpenX
  - Fixed backend logic to correctly set premiumDeluxe flag for Enterprise plans only
  - Added user data refresh mechanism after successful payment to ensure UI updates correctly
  - Fixed button logic to properly handle logged out users and prevent showing "Active" status when not authenticated
  - Fixed undefined isActive values by ensuring boolean conversion and proper loading state handling
  - Fixed infinite loading loop after payment by removing fromSuccess parameter and adding proper checks
  - Added protection against empty dbUser objects to prevent logic errors
  - Added comprehensive debugging logs to track user state and subscription logic
  - Added manual refresh button for debugging user data issues
  - Added comprehensive payment debugging to track price ID recognition and user updates
  - Added debugging to useUserSync hook to track user data fetching and syncing issues
  - Fixed state synchronization issue by adding forced re-rendering when dbUser changes
  - Added automatic refresh detection for fromSuccess parameter with URL cleanup
  - Added stale data detection for debugging user data synchronization issues
  - Cleaned up all debugging logs from frontend and backend components
  - Fixed Free plan button behavior to show "Активен" when user is logged in
  - Improved plan status logic with proper user authentication checks
  - Added comprehensive test suite for PremiumPage component in tests/premium-page.test.js
  - Fixed button rendering logic for all plan types (Free, Pro, Enterprise)
  - Added better error handling for invalid price IDs in payment processing
- **NewsletterSubscription Page**: 
  - Converted from modal to full page layout for better space utilization (NEW)
  - Improved subscription state management with proper field disabling
  - Enhanced unsubscribe functionality with proper data deletion from database
  - Added pre-filling of form fields when user is already subscribed
  - Improved button states and loading indicators
  - Better error handling and user feedback
  - Proper state reset functionality
  - Added filter preferences for candidate notifications
  - Users can now specify which types of candidates they want to receive emails about
  - Filter options include: cities, categories, employment types, languages, gender, document types, and demanded status
  - Two-column layout with basic info on left and filter preferences on right
  - Multiple selection support for all filter categories
  - Responsive design with proper mobile layout
- **Seekers Page**: 
  - Newsletter button now changes color based on subscription status
  - Green button when user is already subscribed
  - Blue (primary) button when user is not subscribed
  - Automatic subscription status checking for logged-in users

### 🤖 AI Job Title Generation Improvements (NEW):
- **Rate Limit Handling**: Implemented exponential backoff retry logic
- **Error Recovery**: Automatic fallback to rule-based title generation
- **Request Throttling**: Added delays between API calls to prevent rate limits
- **Comprehensive Logging**: Detailed error tracking and success metrics
- **Test Script**: Created test-rate-limit.js for verifying rate limit handling
- **Batch Processing**: Improved batch generation with better error handling
- **Confidence Scoring**: Enhanced confidence calculation for AI-generated titles
- **Fallback System**: Robust fallback to keyword-based title generation

### 📧 NewsletterModal Improvements (NEW):
- **Subscription State Management**: Proper handling of subscribed/unsubscribed states
- **Field Disabling**: All form fields disabled when user is already subscribed
- **Unsubscribe Functionality**: Grey button becomes unsubscribe button that deletes user data
- **Pre-filling**: Form fields pre-filled with existing subscriber data
- **Loading States**: Proper loading indicators for subscribe/unsubscribe actions
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **State Reset**: Proper state reset when user unsubscribes or resets form

The project is now fully functional with all major issues resolved, improved UI, robust rate limit handling for AI features, and enhanced newsletter subscription functionality with filter preferences for candidate notifications! 
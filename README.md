# WorkNow – Job Search Platform for Israel 💼

WorkNow is a modern, full-featured job search platform designed for the Israeli market. It connects employers and job seekers, supporting multilingualism (Russian, English, Hebrew, Arabic), premium features, and seamless integration with external services like Stripe, Clerk, and Telegram.

![CleanShot 2025-09-09 at 17 46 13](https://github.com/user-attachments/assets/e16e4645-26d3-4c80-8794-a2aa2a5ca2de)


[![Maintainability](https://qlty.sh/gh/symonbaikov/projects/worknow/maintainability.svg)](https://qlty.sh/gh/symonbaikov/projects/worknow)
[![Code Coverage](https://qlty.sh/gh/symonbaikov/projects/worknow/coverage.svg)](https://qlty.sh/gh/symonbaikov/projects/worknow)

## 🚀 CI/CD Status

[![Node.js CI](https://github.com/symonbaikov/worknow/actions/workflows/node.js.yml/badge.svg)](https://github.com/symonbaikov/worknow/actions/workflows/node.js.yml)
[![Coverage Report](https://github.com/symonbaikov/worknow/actions/workflows/coverage.yml/badge.svg)](https://github.com/symonbaikov/worknow/actions/workflows/coverage.yml)
[![Update Changelog](https://github.com/symonbaikov/worknow/actions/workflows/changelog.yml/badge.svg)](https://github.com/symonbaikov/worknow/actions/workflows/changelog.yml)
[![Docker Image](https://github.com/symonbaikov/worknow/actions/workflows/docker-image.yml/badge.svg)](https://github.com/symonbaikov/worknow/actions/workflows/docker-image.yml)
[![DevSkim Security](https://github.com/symonbaikov/worknow/actions/workflows/devskim.yml/badge.svg)](https://github.com/symonbaikov/worknow/actions/workflows/devskim.yml)
---

## ✨ Features

- **Authentication via Clerk** (social login, JWT, MFA)
- **Job posting and management** for employers
- **Job seeker profiles** and search
- **Premium access** (job boosting, hidden contacts, extra features)
- **Admin panel** (manage users, jobs, seekers)
- **Internationalization with Intlayer** (Russian, English, Ukranian, Hebrew, Arabic; RTL support)
- **Telegram bot notifications**
- **Stripe payments & subscriptions**
- **SEO optimization** (OpenGraph, Schema.org, meta tags)
- **Responsive design** (mobile-first, Bootstrap + Tailwind)
- **Automated tasks** (cron jobs for premium, notifications)
- **Content moderation** (bad words filter)
- **Newsletter subscription system**
- **Image upload and moderation**
- **Candidate notification system**

---

## 🛠️ Technology Stack

### Frontend
- React 18, Vite, React Router DOM 7
- Tailwind CSS, Bootstrap 5, Bootstrap Icons, Lucide React
- Zustand (state), React Hook Form, Zod (validation)
- Intlayer (internationalization), React Hot Toast, React Helmet Async
- TypeScript support

### Backend
- Node.js, Express.js
- Prisma ORM, PostgreSQL
- Clerk (authentication & user management)
- Stripe (payments & subscriptions)
- Nodemailer (email), Telegram Bot API (notifications)
- Winston (logging), Node-cron (task scheduling)
- Redis for caching
- AWS S3 for file storage
- OpenAI integration for AI features

### Integrations
- Clerk, Stripe, Supabase, Telegram, Intlayer, OpenAI, AWS S3

---

## 📦 Installation & Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/MostOfLuck/job-listing.git
   cd job-listing
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment variables:**
   - Copy `docker/env.example` to `docker/.env` and fill in your database, Clerk, Stripe, and email credentials.
4. **Setup the database:**
   ```sh
   npx prisma db push
   npx prisma generate
   # Or, to apply migrations:
   npx prisma migrate dev
   ```
5. **(Optional) Generate test data:**
   ```sh
   node apps/api/utils/napcep.js
   ```
6. **Run the project locally:**
   ```sh
   npm run dev
   ```

---

## 🐳 Running Locally with Docker

You can run the entire WorkNow platform locally using Docker and Docker Compose. This is the recommended way to ensure all services (backend, frontend, database) work together seamlessly.

### Prerequisites
- [Docker](https://www.docker.com/get-started) installed
- [Docker Compose](https://docs.docker.com/compose/) (if not included with Docker Desktop)

### 1. Configure Environment Variables
**IMPORTANT**: The Docker Compose configuration reads from the root `.env` file, not from `docker/.env`.

```bash
# Run the setup script to create environment files
cd docker
./setup-env.sh

# This will create:
# - ../.env (root directory - used by Docker Compose)
# - docker/.env (docker directory - for reference)
```

Then edit the root `.env` file (in the project root directory) and fill in your credentials:
- Database credentials
- Clerk API keys (REQUIRED for frontend authentication)
- Stripe API keys
- Email credentials (Gmail or Resend)
- AWS S3 credentials (if using file uploads)
- OpenAI API key (if using AI features)

### 2. Build and Start the Services
From the project root, run:
```sh
# Build and start all services (frontend, backend, database)
docker-compose -f docker/docker-compose.dev.yml up --build
```

**Note**: The `env_file: ../.env` directive in the Docker Compose file automatically loads all environment variables from the root `.env` file.

### 3. Access the Application
- **Frontend:** Open [http://localhost:3000](http://localhost:3000)
- **Backend API:** Accessible at [http://localhost:3001](http://localhost:3001)
- **Postgres Database:** Exposed on port 5432 (see `docker/docker-compose.dev.yml` for credentials)

### 4. Stopping the Services
To stop all running containers:
```sh
docker-compose -f docker/docker-compose.dev.yml down
```

### 5. Useful Docker Commands
```sh
# View logs
docker-compose -f docker/docker-compose.dev.yml logs -f

# Rebuild specific service
docker-compose -f docker/docker-compose.dev.yml up --build worknow-dev

# Access database
docker exec -it worknow-db psql -U postgres -d worknow
```

### 6. Troubleshooting
- **Frontend authentication errors**: Make sure `VITE_CLERK_PUBLISHABLE_KEY` is set correctly in the root `.env` file
- **Backend startup errors**: Check that all required environment variables are set in the root `.env` file
- **Email service errors**: Ensure either `EMAIL_USER`/`EMAIL_PASS` (Gmail) or `RESEND_API_KEY` is configured

---

## 🖥️ Running Locally Without Docker

You can also run WorkNow directly on your machine without Docker. This is useful for development and debugging.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [PostgreSQL](https://www.postgresql.org/) (running locally or accessible remotely)
- [Redis](https://redis.io/) (optional, for caching)

### 1. Configure Environment Variables
- Copy `docker/env.example` to `.env` and fill in your credentials (database, Clerk, Stripe, email, etc).
- Make sure your PostgreSQL server is running and the credentials match your `.env`.

### 2. Install Dependencies
```sh
npm install
```

### 3. Install the missing Puppeteer dependencies
```sh
npx puppeteer browsers install chrome
```

### 4. Set Up the Database
```sh
npx prisma db push
npx prisma generate
# Or, to apply migrations:
npx prisma migrate dev
```

### 5. (Optional) Seed Test Data
```sh
node prisma/seed.js
```

### 6. Run the Application
In one terminal, start the backend and frontend together:
```sh
npm run dev
```
- This will start both the backend (on [http://localhost:3001](http://localhost:3001)) and the frontend (on [http://localhost:3000](http://localhost:3000)).

**Alternatively, you can run them separately:**
- **Backend:**
  ```sh
  npm run build:server && node apps/api/index.js
  ```
- **Frontend:**
  ```sh
  npm run build:server && vite
  ```

### 6. Useful Tips
- If you change the Prisma schema, re-run `npx prisma generate`.
- Logs and errors will appear in your terminal.
- Make sure your database is running before starting the app.
- For TypeScript compilation, use `npm run build:server`.

---

## 🗂 Project Structure

```
worknow/
├── apps/
│   ├── api/                    # Backend (Express, controllers, routes, services)
│   │   ├── controllers/        # Request handlers
│   │   ├── routes/            # API route definitions
│   │   ├── services/          # Business logic layer
│   │   ├── middlewares/       # Express middlewares
│   │   ├── utils/             # Utility functions
│   │   └── index.js           # Main server entry point
│   └── client/                # Frontend (React, components, pages, hooks, store)
│       ├── components/        # Reusable UI components
│       ├── pages/             # Page components
│       ├── hooks/             # Custom React hooks
│       ├── store/             # Zustand state stores
│       ├── contexts/          # React contexts
│       └── css/               # Stylesheets
├── libs/                      # Shared utility libraries
├── prisma/                    # Prisma schema, migrations, seed scripts
├── public/                    # Static files, images, locales
│   ├── images/                # Application images
│   └── locales/               # Intlayer translations
├── tests/                     # Test files
├── tools/                     # Development and utility scripts
├── docker/                    # Docker configuration files
│   ├── Dockerfile.dev         # Development Dockerfile
│   ├── Dockerfile.prod        # Production Dockerfile
│   ├── docker-compose.dev.yml # Development compose
│   ├── docker-compose.prod.yml # Production compose
│   └── env.example            # Environment variables template
├── config/                    # Configuration files
├── package.json               # Project metadata and scripts
└── README.md                  # Project documentation
```

---

## 🔌 API Endpoints

### Job Management
- `GET /api/jobs` – List job postings (with filters, pagination)
- `POST /api/jobs` – Create a new job (auth required)
- `PUT /api/jobs/:id` – Update a job (auth, owner only)
- `DELETE /api/jobs/:id` – Delete a job (auth, owner only)
- `POST /api/jobs/:id/boost` – Boost a job (premium only)

### User Management
- `GET /api/users` – Get user profile (auth required)
- `

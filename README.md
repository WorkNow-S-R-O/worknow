# WorkNow – Job Search Platform for Israel 🚀

WorkNow is a modern, full-featured job search platform designed for the Israeli market. It connects employers and job seekers, supporting multilingualism (Russian, English, Hebrew, Arabic), premium features, and seamless integration with external services like Stripe, Clerk, and Telegram.

![WorkNow](./public/images/worknow-logo.jpg)

---

## ✨ Features

- **Authentication via Clerk** (social login, JWT, MFA)
- **Job posting and management** for employers
- **Job seeker profiles** and search
- **Premium access** (job boosting, hidden contacts, extra features)
- **Admin panel** (manage users, jobs, seekers)
- **Internationalization** (Russian, English, Hebrew, Arabic; RTL support)
- **Telegram bot notifications**
- **Stripe payments & subscriptions**
- **SEO optimization** (OpenGraph, Schema.org, meta tags)
- **Responsive design** (mobile-first, Bootstrap + Tailwind)
- **Automated tasks** (cron jobs for premium, notifications)
- **Content moderation** (bad words filter)
- **AI-powered job title generation**
- **Newsletter subscription system**
- **Image upload and moderation**
- **Candidate notification system**

---

## 🛠️ Technology Stack

### Frontend
- React 18, Vite, React Router DOM 7
- Tailwind CSS, Bootstrap 5, Bootstrap Icons, Lucide React
- Zustand (state), React Hook Form, Zod (validation)
- i18next (internationalization), React Hot Toast, React Helmet Async
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
- Clerk, Stripe, Supabase, Telegram, i18next, OpenAI, AWS S3

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
- Copy `docker/env.example` to `docker/.env` and fill in your credentials (database, Clerk, Stripe, email, etc).
- Make sure all required variables are set for both backend and frontend.

### 2. Build and Start the Services
From the project root, run:
```sh
# Development environment
docker-compose -f docker/docker-compose.dev.yml up --build

# Production environment
docker-compose -f docker/docker-compose.prod.yml up --build

# Production test environment
docker-compose -f docker/docker-compose.prod.test.yml up --build
```

### 3. Access the Application
- **Frontend:** Open [http://localhost:3000](http://localhost:3000)
- **Backend API:** Accessible at [http://localhost:3001](http://localhost:3001)
- **Postgres Database:** Exposed on port 5432 (see `docker/docker-compose.yml` for credentials)

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
docker-compose -f docker/docker-compose.dev.yml up --build api

# Access database
docker exec -it worknow-db psql -U postgres -d worknow
```

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

### 3. Set Up the Database
```sh
npx prisma db push
npx prisma generate
# Or, to apply migrations:
npx prisma migrate dev
```

### 4. (Optional) Seed Test Data
```sh
node prisma/seed.js
```

### 5. Run the Application
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
│   └── locales/               # Translation files (ru, en, he, ar)
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
- `PUT /api/users` – Update user profile (auth required)
- `POST /api/users/sync` – Sync user data with Clerk

### Job Seekers
- `GET /api/seekers` – List job seekers (with filters, pagination)
- `POST /api/seekers` – Create a seeker profile
- `GET /api/seekers/:id` – Get seeker details

### Payments
- `POST /api/payments/create-checkout-session` – Stripe checkout (auth required)
- `POST /api/payments/cancel-subscription` – Cancel premium (auth required)
- `POST /api/payments/cancel-auto-renewal` – Disable auto-renewal (auth required)

### Other Services
- `GET /api/messages` – Get user messages (auth required)
- `POST /api/messages` – Send message (admin only)
- `GET /api/categories` – Get job categories
- `GET /api/cities` – Get cities
- `POST /webhook` – Handle external webhooks (Stripe, Clerk)

---

## ⏰ Automated Tasks (Cron Jobs)

- **Daily job ranking check**: Notifies users if their jobs drop in ranking
- **Hourly premium expiration check**: Disables expired premium subscriptions
- **Automated email notifications**: For premium, job status, and system events
- **Candidate notification system**: Automated job matching and notifications
- **Newsletter management**: Automated newsletter processing and delivery

---

## 🛡️ Security & Performance

- JWT authentication (Clerk)
- Role-based access control (admin, premium, regular)
- Input validation (Zod, Prisma)
- SQL injection protection (Prisma)
- CORS, rate limiting, and content filtering
- HTTPS-ready, environment-based configuration
- Code splitting, caching, and lazy loading for frontend performance
- Image moderation and content filtering
- Redis caching for improved performance

---

## 🌍 Internationalization

- 4 languages: Russian, English, Hebrew, Arabic
- Automatic language detection and manual switching
- RTL support for Hebrew and Arabic
- Translation files in `public/locales/`
- Dynamic content localization

---

## 🧪 Testing

- Jest testing framework
- React Testing Library for component tests
- Test coverage for components, hooks, and utilities
- Mock implementations for external services

---

## 🚀 Deployment

### Environment Variables
Required environment variables for production:
```env
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=sk_...
VITE_CLERK_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
WEBHOOK_SECRET=whsec_...
EMAIL_USER=...
EMAIL_PASS=...
OPENAI_API_KEY=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=...
AWS_S3_BUCKET=...
```

### Build Commands
```sh
# Build for production
npm run build

# Build server only
npm run build:server

# Start production server
npm start
```

---

## 📬 Contacts & Support

- Telegram: [@worknowjob](https://t.me/WORKNOW_JOBS)
- Email: worknow.notifications@gmail.com

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
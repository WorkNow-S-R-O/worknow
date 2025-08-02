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

---

## 🛠️ Technology Stack

### Frontend
- React 18, Vite, React Router DOM 7
- Tailwind CSS, Bootstrap 5, Bootstrap Icons, Lucide React
- Zustand (state), React Hook Form, Zod (validation)
- i18next (internationalization), React Hot Toast, React Helmet Async

### Backend
- Node.js, Express.js
- Prisma ORM, PostgreSQL
- Clerk (authentication & user management)
- Stripe (payments & subscriptions)
- Nodemailer (email), Telegram Bot API (notifications)
- Winston (logging), Node-cron (task scheduling)

### Integrations
- Clerk, Stripe, Supabase, Telegram, i18next

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
   - Copy `.env.example` to `.env` and fill in your database, Clerk, Stripe, and email credentials.
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
   npm start
   ```

---

## 🐳 Running Locally with Docker

You can run the entire WorkNow platform locally using Docker and Docker Compose. This is the recommended way to ensure all services (backend, frontend, database) work together seamlessly.

### Prerequisites
- [Docker](https://www.docker.com/get-started) installed
- [Docker Compose](https://docs.docker.com/compose/) (if not included with Docker Desktop)

### 1. Configure Environment Variables
- Copy `.env.example` to `.env` and fill in your credentials (database, Clerk, Stripe, email, etc).
- Make sure all required variables are set for both backend and frontend.

### 2. Build and Start the Services
From the project root, run:
```sh
# Build and start all services (frontend, backend, database)
docker-compose up --build
```
- This will build the Docker images and start the containers as defined in `docker-compose.yml`.

### 3. Access the Application
- **Frontend:** Open [http://localhost:3000](http://localhost:3000)
- **Backend API:** Accessible at [http://localhost:3001](http://localhost:3001)
- **Postgres Database:** Exposed on port 5432 (see `docker-compose.yml` for credentials)

### 4. Stopping the Services
To stop all running containers:
```sh
docker-compose down
```

- `GET /api/jobs` – List job postings (with filters, pagination)
- `POST /api/jobs` – Create a new job (auth required)
- `PUT /api/jobs/:id` – Update a job (auth, owner only)
- `DELETE /api/jobs/:id` – Delete a job (auth, owner only)
- `POST /api/jobs/:id/boost` – Boost a job (premium only)
- `GET /api/seekers` – List job seekers (with filters, pagination)
- `POST /api/seekers` – Create a seeker profile
- `GET /api/seekers/:id` – Get seeker details
- `GET /api/users` – Get user profile (auth required)
- `PUT /api/users` – Update user profile (auth required)
- `POST /api/payments/create-checkout-session` – Stripe checkout (auth required)
- `POST /api/payments/cancel-subscription` – Cancel premium (auth required)
- `POST /api/payments/cancel-auto-renewal` – Disable auto-renewal (auth required)
- `GET /api/messages` – Get user messages (auth required)
- `POST /api/messages` – Send message (admin only)
- `POST /webhook` – Handle external webhooks (Stripe, Clerk)

---

## 🖥️ Running Locally Without Docker

You can also run WorkNow directly on your machine without Docker. This is useful for development and debugging.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [PostgreSQL](https://www.postgresql.org/) (running locally or accessible remotely)

### 1. Configure Environment Variables
- Copy `.env.example` to `.env` and fill in your credentials (database, Clerk, Stripe, email, etc).
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
  node apps/api/index.js
  ```
- **Frontend:**
  ```sh
  vite --config vite.config.js
  ```

### 6. Useful Tips
- If you change the Prisma schema, re-run `npx prisma generate`.
- Logs and errors will appear in your terminal.
- Make sure your database is running before starting the app.

---

## 🗂 Project Structure

```
worknow/
├── apps/
│   ├── api/         # Backend (Express, controllers, routes, services)
│   └── client/      # Frontend (React, components, pages, hooks, store)
├── libs/            # Shared utility libraries
├── prisma/          # Prisma schema, migrations, seed scripts
├── public/          # Static files, images, locales
├── tests/           # Test files
├── tools/           # Development and utility scripts
├── Dockerfile       # Docker build instructions
├── docker-compose.yml # Multi-service orchestration
├── package.json     # Project metadata and scripts
└── README.md        # Project documentation
```


## ⏰ Automated Tasks (Cron Jobs)

- **Daily job ranking check**: Notifies users if their jobs drop in ranking
- **Hourly premium expiration check**: Disables expired premium subscriptions
- **Automated email notifications**: For premium, job status, and system events

---

## 🛡️ Security & Performance

- JWT authentication (Clerk)
- Role-based access control (admin, premium, regular)
- Input validation (Zod, Prisma)
- SQL injection protection (Prisma)
- CORS, rate limiting, and content filtering
- HTTPS-ready, environment-based configuration
- Code splitting, caching, and lazy loading for frontend performance

---

## 🌍 Internationalization

- 4 languages: Russian, English, Hebrew, Arabic
- Automatic language detection and manual switching
- RTL support for Hebrew and Arabic
- Translation files in `public/locales/`

---
### 5. Useful Tips
- If you change dependencies or Dockerfile, re-run with `--build`.
- Database migrations are handled automatically on container startup (see Dockerfile and compose setup).
- Logs for each service can be viewed with `docker-compose logs -f`.

## 📬 Contacts & Support

- Telegram: [@worknowjob](https://t.me/WORKNOW_JOBS)
- Email: worknow.notifications@gmail.com
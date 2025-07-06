# WorkNow – Job Search Platform for Israel 🚀

WorkNow is a modern, full-featured job search platform designed for the Israeli market. It connects employers and job seekers, supporting multilingualism (Russian, English, Hebrew, Arabic), premium features, and seamless integration with external services like Stripe, Clerk, and Telegram.

![WorkNow](./screenshots/WorkNow.png)

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
   node server/utils/napcep.js
   ```
6. **Run the project locally:**
   ```sh
   npm start
   ```

---

## 🗂 Project Structure

```
worknow/
├── src/         # Frontend (React, components, pages, hooks, store)
├── server/      # Backend (controllers, routes, services, utils)
├── prisma/      # Prisma schema, migrations, seed scripts
├── public/      # Static files, images, locales
├── screenshots/ # Screenshots for documentation
└── docs/        # Project documentation
```

---

## 🔒 Roles & Permissions

- **Administrators**: Full access to admin panel, user/job/seeker management
- **Premium users**: Access to hidden contacts, job boosting, extra features
- **Regular users**: Can browse jobs and seekers, but some data is hidden

---

## 🔗 Main API Endpoints

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

## 📸 Screenshots

![Main page](./screenshots/CleanShot%202025-06-13%20at%2017.38.47@2x.png)

---

## 📬 Contacts & Support

- Telegram: [@worknowjob](https://t.me/WORKNOW_JOBS)
- Email: worknow.notifications@gmail.com

---

## 📜 License

This project is licensed under the MIT License. See the LICENSE file for more details.

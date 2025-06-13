# WorkNow - Job Listing Platform  🚀

WorkNow is a platform that helps employers find employees and job seekers find work. It allows users to post job listings, browse job offers, and contact employers.

![WorkNow](./screenshots/WorkNow.png)

---

## ✨ Features

- ✅ Authentication via Clerk
- ✅ Job posting for employers
- ✅ Browsing job listings
- ✅ Support for English and Russian languages
- ✅ Telegram bot notifications
- ✅ SEO optimization and OpenGraph meta tags
- ✅ **Job Seekers tab**: browse and manage job seekers (admin only)
- ✅ **Premium access**: unlocks hidden contacts and extra features
- ✅ **Admin panel**: add/edit job seekers (access by login/password or Google account)

---

## 📦 Installation

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
   - Copy `.env.example` to `.env` and fill in your database and Clerk credentials.
4. **Setup the database:**
   ```sh
   npx prisma db push
   npx prisma generate
   ```
   Or, if you want to apply migrations:
   ```sh
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

- `src/` — frontend React components, pages, hooks, store
- `server/` — backend controllers, routes, services, utils
- `prisma/` — Prisma schema, migrations, seed scripts
- `public/` — static files, images, locales
- `screenshots/` — screenshots for documentation

---

## 🔒 Access & Roles

- **Admin panel**: Only accessible by admin (login/password or Google account: `worknow.notifications@gmail.com`)
- **Premium users**: See hidden contacts of job seekers and extra features
- **Regular users**: Can browse jobs and seekers, but contacts are hidden

---

## 📸 Screenshots

![Main page](./screenshots/CleanShot%202025-06-13%20at%2017.38.47@2x.png)

---

## 🔗 API Endpoints

- Get job listings: `GET /users/user-jobs/:clerkUserId`
- Get user profile: `GET /users/:clerkUserId`
- Get seekers: `GET /seekers` (admin: `POST /seekers`)

---

## 🛠️ Technologies Used

- React, Vite, Clerk, Prisma ORM, PostgreSQL, Node.js, Express, Bootstrap, i18next

---

## 📬 Contacts & Support

- Telegram: [@worknowjob](https://t.me/WORKNOW_JOBS)
- Email: worknow.notifications@gmail.com

---

## 📜 License

This project is licensed under the MIT License. See the LICENSE file for more details.

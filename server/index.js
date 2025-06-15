/* eslint-disable no-undef */
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url"
import paymentRoutes from './routes/payments.js';
import { cancelAutoRenewal } from './controllers/payments.js';
import './cron-jobs.js';
import jobsRoutes from './routes/jobs.js';
import citiesRoutes from './routes/cities.js';
import boostJob from './routes/jobs.js';
import usersRoutes from './routes/users.js';
import webhookRoutes from './routes/webhook.js';
import userSyncRoutes from './routes/userSync.js';
import userRoutes from './routes/users.js';
import seekersRoutes from './routes/seekers.js';

import { WEBHOOK_SECRET, CLERK_SECRET_KEY } from './config/clerkConfig.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Проверяем важные переменные окружения
if (!process.env.DATABASE_URL) {
  console.error('❌ Missing DATABASE_URL!');
  process.exit(1);
}

if (!process.env.VITE_API_URL) {
  console.error('❌ Missing VITE_API_URL!');
  process.exit(1);
}

if (!WEBHOOK_SECRET) {
  console.error('❌ Missing Clerk Webhook Secret!');
  process.exit(1);
}

if (!CLERK_SECRET_KEY) {
  console.error('❌ Missing Clerk API Secret Key!');
  process.exit(1);
}

app.use(cors());
app.use(express.json({
  verify: (req, res, buf) => { req.rawBody = buf.toString(); }
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Раздача статических файлов фронта
app.use(express.static(path.join(__dirname, "../dist")));

app.use('/api/payments', paymentRoutes);
app.use('/api/cities', citiesRoutes);
app.use('/:id/boost', boostJob);
app.use('/api/users', usersRoutes);
app.use('/webhook', webhookRoutes);
app.use('/api/users', userSyncRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/seekers', seekersRoutes);

// React Router должен отдавать index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

// Обработчик ошибок (защита от падения)
app.use((err, req, res, next) => {
  console.error("❌ Ошибка на сервере:", err);
  res.status(500).json({ error: "Внутренняя ошибка сервера" });
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

app.post('/api/payments/cancel-auto-renewal', cancelAutoRenewal);

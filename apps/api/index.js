/* eslint-disable no-undef */
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url"
import paymentRoutes from './routes/payments.js';
import jobsRoutes from './routes/jobs.js';
import citiesRoutes from './routes/cities.js';
import { boostJob } from './controllers/jobsController.js';
import usersRoutes from './routes/users.js';
import webhookRoutes from './routes/webhook.js';
import userSyncRoutes from './routes/userSync.js';
import seekersRoutes from './routes/seekers.js';
import categoriesRoutes from './routes/categories.js';
import messagesRoutes from './routes/messages.js';
import uploadRoutes from './routes/upload.js';
import s3UploadRoutes from './routes/s3Upload.js';

import { WEBHOOK_SECRET, CLERK_SECRET_KEY } from './config/clerkConfig.js';
import { disableExpiredPremiums } from './utils/cron-jobs.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Проверяем важные переменные окружения
if (!process.env.DATABASE_URL) {
  console.error('❌ Missing DATABASE_URL!');
  process.exit(1);
}

// Note: VITE_API_URL is a frontend environment variable, not needed on backend

if (!WEBHOOK_SECRET) {
  console.error('❌ Missing Clerk Webhook Secret!');
  process.exit(1);
}

if (!CLERK_SECRET_KEY) {
  console.error('❌ Missing Clerk API Secret Key!');
  process.exit(1);
}

// CORS configuration to support credentials
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://worknowjob.com', 'https://www.worknowjob.com']
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept']
}));
app.use(express.json({
  verify: (req, res, buf) => { req.rawBody = buf.toString(); }
}));

// Security headers for production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://clerk.worknowjob.com https://cdn.jsdelivr.net blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com https://clerk.worknowjob.com; frame-src https://js.stripe.com https://clerk.worknowjob.com; worker-src 'self' blob:;"
    );
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Раздача статических файлов изображений
app.use('/images', express.static(path.join(__dirname, "../../public/images")));

// --- РЕГИСТРАЦИЯ МАРШРУТОВ ---
app.use('/api/payments', paymentRoutes);
app.use('/api/cities', citiesRoutes);
app.post('/api/jobs/:id/boost', boostJob);
app.use('/api/users', usersRoutes);
app.use('/api/users', userSyncRoutes);
app.use('/webhook', webhookRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/seekers', seekersRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/s3-upload', s3UploadRoutes);

// Serve static files from the React build (AFTER API routes)
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React build directory
  app.use(express.static(path.join(__dirname, '../../dist')));
  
  // Handle React routing, return all requests to React app (LAST)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
}

// Тестовый endpoint для проверки сервера (NEW)
app.get('/api/test-server', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Тестовый endpoint для проверки создания job с imageUrl
app.post('/api/test-create-job', async (req, res) => {
  try {
    console.log('🔍 Test endpoint - Request body:', req.body);
    const { createJobService } = await import('./services/jobCreateService.js');
    const result = await createJobService(req.body);
    console.log('🔍 Test endpoint - Result:', result);
    res.json(result);
  } catch (error) {
    console.error('🔍 Test endpoint - Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ВРЕМЕННЫЙ route для ручного теста сброса премиума
app.get('/api/test-disable-premium', async (req, res) => {
  await disableExpiredPremiums();
  res.json({ success: true });
});

// API error handler - handle 404 for API routes
app.use('/api/*', (req, res) => {
  console.error(`❌ API route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: "API endpoint not found" });
});

// Обработчик ошибок (защита от падения)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => { // next обязателен для error-handling middleware
  console.error("❌ Ошибка на сервере:", err);
  res.status(500).json({ error: "Внутренняя ошибка сервера" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

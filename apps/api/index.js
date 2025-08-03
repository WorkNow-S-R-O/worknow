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

import seekersRoutes from './routes/seekers.js';
import categoriesRoutes from './routes/categories.js';
import messagesRoutes from './routes/messages.js';
import uploadRoutes from './routes/upload.js';
import s3UploadRoutes from './routes/s3Upload.js';
import newsletterRoutes from './routes/newsletter.js';
import redisService from './services/redisService.js';

import { WEBHOOK_SECRET, CLERK_SECRET_KEY } from './config/clerkConfig.js';
import { disableExpiredPremiums } from './utils/cron-jobs.js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Проверяем важные переменные окружения
if (!process.env.DATABASE_URL) {
  console.error('❌ Missing DATABASE_URL!');
  process.exit(1);
}

// Note: VITE_API_URL is a frontend environment variable, not needed on backend

console.log('🔍 Index.js - WEBHOOK_SECRET available:', !!WEBHOOK_SECRET);
console.log('🔍 Index.js - WEBHOOK_SECRET value:', WEBHOOK_SECRET);
// Temporarily comment out the webhook secret check for debugging
// if (!WEBHOOK_SECRET) {
//   console.error('❌ Missing Clerk Webhook Secret!');
//   process.exit(1);
// }

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
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://clerk.worknowjob.com https://*.clerk.accounts.dev https://cdn.jsdelivr.net https://widget.survicate.com blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com https://clerk.worknowjob.com https://*.clerk.accounts.dev; frame-src https://js.stripe.com https://clerk.worknowjob.com https://*.clerk.accounts.dev; worker-src 'self' blob:;"
    );
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
} else {
  // More permissive CSP for development
  app.use((req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http: blob:; style-src 'self' 'unsafe-inline' https: http:; font-src 'self' https: http:; img-src 'self' data: https: http:; connect-src 'self' https: http:; frame-src https: http:; worker-src 'self' blob:;"
    );
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
app.use('/webhook', webhookRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/seekers', seekersRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/s3-upload', s3UploadRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Health check endpoint for Docker
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Redis health check endpoint
app.get('/api/redis/health', async (req, res) => {
  try {
    const redisHealth = await redisService.healthCheck();
    res.status(200).json({
      status: 'healthy',
      redis: redisHealth,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Cache management endpoints
app.get('/api/redis/cache/stats', async (req, res) => {
  try {
    const keys = await redisService.redis.keys('*');
    const jobKeys = await redisService.redis.keys('jobs:*');
    const sessionKeys = await redisService.redis.keys('session:*');
    
    res.json({
      totalKeys: keys.length,
      jobCacheKeys: jobKeys.length,
      sessionKeys: sessionKeys.length,
      memory: await redisService.redis.info('memory'),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/redis/cache/clear', async (req, res) => {
  try {
    await redisService.redis.flushall();
    res.json({ 
      message: 'All cache cleared successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/redis/cache/jobs', async (req, res) => {
  try {
    await redisService.invalidateJobsCache();
    res.json({ 
      message: 'Job cache cleared successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Тестовый endpoint для проверки сервера (NEW)
app.get('/api/test-server', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    clerkKeyAvailable: !!process.env.CLERK_SECRET_KEY,
    clerkKeyLength: process.env.CLERK_SECRET_KEY ? process.env.CLERK_SECRET_KEY.length : 0
  });
});

// Тестовый endpoint для проверки базы данных
app.get('/api/test-database', async (req, res) => {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    // Test basic database connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection test result:', result);
    
    // Test NewsletterVerification table
    try {
      const verificationCount = await prisma.newsletterVerification.count();
      console.log('✅ NewsletterVerification table accessible, count:', verificationCount);
    } catch (error) {
      console.error('❌ NewsletterVerification table error:', error);
    }
    
    await prisma.$disconnect();
    
    res.json({
      success: true,
      message: 'Database connection test successful',
      result: result
    });
  } catch (error) {
    console.error('❌ Database test error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection test failed',
      error: error.message
    });
  }
});

// Тестовый endpoint для проверки Clerk API
app.get('/api/test-clerk-api', async (req, res) => {
  try {
    const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
    console.log('🔍 Test endpoint - CLERK_SECRET_KEY available:', !!CLERK_SECRET_KEY);
    console.log('🔍 Test endpoint - CLERK_SECRET_KEY length:', CLERK_SECRET_KEY ? CLERK_SECRET_KEY.length : 0);
    
    const response = await fetch('https://api.clerk.com/v1/users/user_2tnxLkEalopDLnUWMFiSJAPCBKJ', {
      headers: {
        'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('🔍 Test endpoint - Clerk API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Test endpoint - Clerk API error:', response.status, errorText);
      return res.status(500).json({ error: `Clerk API error: ${response.status} ${response.statusText}`, details: errorText });
    }
    
    const userData = await response.json();
    res.json({ 
      success: true, 
      user: {
        id: userData.id,
        email: userData.email_addresses?.[0]?.email_address,
        firstName: userData.first_name,
        lastName: userData.last_name
      }
    });
  } catch (error) {
    console.error('❌ Test endpoint - Error:', error);
    res.status(500).json({ error: 'Test failed', details: error.message });
  }
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

// Serve static files from the React build (AFTER API routes)
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React build directory
  app.use(express.static(path.join(__dirname, '../../dist')));
  
  // Handle React routing, return all requests to React app (LAST)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
} else {
  // In development, only serve API routes and let Vite handle frontend
  // Don't serve static files or handle React routing in development
  console.log('🔧 Development mode: Frontend served by Vite dev server');
}

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

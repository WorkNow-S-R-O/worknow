import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import paymentRoutes from './routes/payments.js';
import jobsRoutes from './routes/jobs.js';
import citiesRoutes from './routes/cities.js';
import usersRoutes from './routes/users.js';
import webhookRoutes from './routes/webhook.js';
import userSyncRoutes from './routes/userSync.js';
import { WEBHOOK_SECRET, CLERK_SECRET_KEY } from './config/clerkConfig.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({
  verify: (req, res, buf) => { req.rawBody = buf.toString(); }
}));

// Регистрация маршрутов (по 1 разу!)
app.use('/api/jobs', jobsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/cities', citiesRoutes);
app.use('/api/users', usersRoutes);
app.use('/webhook', webhookRoutes);
app.use('/api/user-sync', userSyncRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Проверка наличия секретных ключей
if (!WEBHOOK_SECRET) {
  console.error("❌ Missing Clerk Webhook Secret!");
  process.exit(1);
}

if (!CLERK_SECRET_KEY) {
  console.error("❌ Missing Clerk API Secret Key!");
  process.exit(1);
}

// Маршрут для отмены подписки
import { cancelAutoRenewal } from './controllers/payments.js';
app.post('/api/payments/cancel-auto-renewal', cancelAutoRenewal);

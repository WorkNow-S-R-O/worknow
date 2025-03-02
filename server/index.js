/* eslint-disable no-undef */
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import paymentRoutes from './routes/payments.js';
import { cancelAutoRenewal } from './controllers/payments.js';
import './cron-jobs.js';
import jobsRoutes from './routes/jobs.js';
import citiesRoutes from './routes/cities.js';
import getJobs from './routes/jobs.js';
import boostJob from './routes/jobs.js';
import usersRoutes from './routes/users.js';
import webhookRoutes from './routes/webhook.js';
import userSyncRoutes from './routes/userSync.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({
  verify: (req, res, buf) => { req.rawBody = buf.toString(); }
}));

app.use('/api/jobs', jobsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/cities', citiesRoutes);
app.use('/', getJobs);
app.use('/:id/boost', boostJob);
app.use('/api/users', usersRoutes);
app.use('/webhook', webhookRoutes);
app.use('/api/users', userSyncRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/user', userRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

if (!WEBHOOK_SECRET) {
  console.error('❌ Missing Clerk Webhook Secret!');
  process.exit(1);
}

if (!CLERK_SECRET_KEY) {
  console.error('❌ Missing Clerk API Secret Key!');
  process.exit(1);
}

app.post('/api/payments/cancel-auto-renewal', cancelAutoRenewal);
/* eslint-disable no-undef */
import express from 'express';
import { Webhook } from 'svix';
import dotenv from 'dotenv';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';
import paymentRoutes from './routes/payments.js';
import { checkLowRankedJobs } from './cron-jobs.js';
import { cancelAutoRenewal } from './controllers/payments.js';
import './cron-jobs.js';
import jobsRoutes from './routes/jobs.js';
import citiesRoutes from './routes/cities.js';
import getJobs from './routes/jobs.js';
import boostJob from './routes/jobs.js';
import usersRoutes from './routes/users.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
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

// Вебхук для Clerk
app.post('/webhook/clerk', async (req, res) => {
  const svix_id = req.headers['svix-id'];
  const svix_timestamp = req.headers['svix-timestamp'];
  const svix_signature = req.headers['svix-signature'];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: 'Missing Svix headers' });
  }

  const body = req.rawBody;

  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    const evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });

    const userId = evt.data.id;

    if (evt.type === 'user.created' || evt.type === 'user.updated') {
      const email_addresses = evt.data.email_addresses;
      const first_name = evt.data.first_name;
      const last_name = evt.data.last_name;
      const image_url = evt.data.image_url;

      await prisma.user.upsert({
        where: { clerkUserId: userId },
        update: {
          email: email_addresses[0].email_address,
          firstName: first_name || null,
          lastName: last_name || null,
          imageUrl: image_url || null,
        },
        create: {
          clerkUserId: userId,
          email: email_addresses[0].email_address,
          firstName: first_name || null,
          lastName: last_name || null,
          imageUrl: image_url || null,
        },
      });
    }

    if (evt.type === 'user.deleted') {
      await prisma.user.delete({
        where: { clerkUserId: userId },
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: 'Webhook verification failed' });
  }
});

// Синхронизация пользователя
app.post('/sync-user', async (req, res) => {
  const { clerkUserId } = req.body;

  if (!clerkUserId) {
    return res.status(400).json({ error: 'Missing Clerk user ID' });
  }

  try {
    let user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      const response = await fetch(`https://api.clerk.com/v1/users/${clerkUserId}`, {
        headers: {
          'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const clerkUser = await response.json();

      user = await prisma.user.create({
        data: {
          clerkUserId: clerkUser.id,
          email: clerkUser.email_addresses[0]?.email_address || null,
          firstName: clerkUser.first_name || null,
          lastName: clerkUser.last_name || null,
          imageUrl: clerkUser.image_url || null
        }
      });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync user' });
  }
});


// Получение объявлений конкретного пользователя с пагинацией
app.get('/api/user-jobs/:clerkUserId', async (req, res) => {
  const { clerkUserId } = req.params;
  const { page = 1, limit = 5 } = req.query;

  const pageInt = parseInt(page);
  const limitInt = parseInt(limit);
  const skip = (pageInt - 1) * limitInt;

  try {
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const jobs = await prisma.job.findMany({
      where: { userId: user.id },
      include: {
        city: true,
        user: true
      }, 
      skip,
      take: limitInt,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalJobs = await prisma.job.count({
      where: { userId: user.id },
    });

    res.status(200).json({
      jobs,
      totalJobs,
      totalPages: Math.ceil(totalJobs / limitInt),
      currentPage: pageInt,
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения объявлений пользователя', details: error.message });
  }
});

// Получение одного объявления по ID
app.get('/api/jobs/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) },
      include: {
        city: true,
      },
    });

    if (!job) {
      return res.status(404).json({ error: 'Объявление не найдено' });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error('Ошибка получения объявления:', error.message);
    res.status(500).json({ error: 'Ошибка получения объявления', details: error.message });
  }
});

app.get('/api/user/:clerkUserId', async (req, res) => {
  const { clerkUserId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      console.log(`Пользователь с clerkUserId ${clerkUserId} не найден`);
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Ошибка получения данных пользователя:', error.message);
    res.status(500).json({ error: 'Ошибка получения данных пользователя', details: error.message });
  }
});


app.get('/api/test-cron', async (req, res) => {
  try {
    console.log("🔄 Запуск тестовой проверки...");
    await checkLowRankedJobs();
    res.status(200).json({ message: 'Тестовое уведомление отправлено!' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при тестировании cron-задачи', details: error.message });
  }
});





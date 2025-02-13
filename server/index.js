/* eslint-disable no-undef */
import express from 'express';
import { Webhook } from 'svix';
import dotenv from 'dotenv';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({
  verify: (req, res, buf) => { req.rawBody = buf.toString(); }
}));

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

// Города
app.get('/api/cities', async (req, res) => {
  try {
    const cities = await prisma.city.findMany();
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения городов', details: error.message });
  }
});

// CRUD для объявлений

// Получение всех объявлений
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      include: { city: true, user: true },
    });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения объявлений', details: error.message });
  }
});

// Создание объявления
app.post('/api/jobs', async (req, res) => {
  const { title, salary, cityId, phone, description, userId } = req.body;

  try {
    const job = await prisma.job.create({
      data: {
        title,
        salary,
        phone,
        description,
        city: { connect: { id: parseInt(cityId) } },
        user: { connect: { clerkUserId: userId } },
      },
      include: {
        city: true,
        user: true,
      }
    });

    res.status(201).json(job);
  } catch (error) {
    console.error('Ошибка создания объявления:', error);
    res.status(500).json({ error: 'Ошибка создания объявления', details: error.message });
  }
});

// Обновление объявления
app.put('/api/jobs/:id', async (req, res) => {
  const { id } = req.params;
  const { title, salary, cityId, phone, description } = req.body;

  try {
    const job = await prisma.job.update({
      where: { id: parseInt(id) },
      data: {
        title,
        salary,
        phone,
        description,
        city: { connect: { id: parseInt(cityId) } },
      },
      include: { city: true, user: true }
    });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления объявления', details: error.message });
  }
});

// Удаление объявления
app.delete('/api/jobs/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.job.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: 'Объявление удалено' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка удаления объявления', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

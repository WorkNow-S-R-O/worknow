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

// Подключаем JSON-парсер и сохраняем rawBody для Svix
app.use(express.json({
  verify: (req, res, buf) => { req.rawBody = buf.toString(); }
}));

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY; // Добавляем секретный ключ для API Clerk

if (!WEBHOOK_SECRET) {
  console.error('❌ Missing Clerk Webhook Secret!');
  process.exit(1);
}

if (!CLERK_SECRET_KEY) {
  console.error('❌ Missing Clerk API Secret Key!');
  process.exit(1);
}

// 📌 Вебхук для обработки событий Clerk
app.post('/webhook/clerk', async (req, res) => {
  console.log('📩 Received headers:', req.headers);

  const svix_id = req.headers['svix-id'];
  const svix_timestamp = req.headers['svix-timestamp'];
  const svix_signature = req.headers['svix-signature'];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('❌ Missing Svix headers!');
    return res.status(400).json({ error: 'Missing Svix headers' });
  }

  const body = req.rawBody; // Используем оригинальное тело запроса

  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    console.log('🔑 Webhook Secret:', WEBHOOK_SECRET);
    console.log('📦 Raw Body:', body);

    const evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });

    console.log('✅ Verified event:', JSON.stringify(evt, null, 2));

    // Получаем ID пользователя
    const userId = evt.data.id;

    if (evt.type === 'user.created' || evt.type === 'user.updated') {
      const email_addresses = evt.data.email_addresses;
      const first_name = evt.data.first_name;
      const last_name = evt.data.last_name;
      const image_url = evt.data.image_url;

      if (!userId || !email_addresses || email_addresses.length === 0) {
        console.error('❌ Invalid user data:', evt.data);
        return res.status(400).json({ error: 'Invalid user data' });
      }

      try {
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

        console.log(`✅ User ${userId} created/updated.`);
      } catch (error) {
        console.error(`❌ Error upserting user ${userId}:`, error);
        return res.status(500).json({ error: "Database error" });
      }
    }

    if (evt.type === 'user.deleted') {
      console.log(`🗑 Attempting to delete user ${userId}...`);

      try {
        // Проверяем, есть ли пользователь перед удалением
        const existingUser = await prisma.user.findUnique({
          where: { clerkUserId: userId },
        });

        console.log('🔎 Found user in DB:', existingUser);

        if (!existingUser) {
          console.log(`⚠️ User ${userId} not found. Skipping delete.`);
          return res.status(200).json({ message: "User not found, skipping delete." });
        }

        // Удаляем пользователя
        await prisma.user.delete({
          where: { clerkUserId: userId },
        });

        console.log(`✅ User ${userId} deleted.`);
      } catch (error) {
        console.error(`❌ Error deleting user ${userId}:`, error);
        return res.status(500).json({ error: "Database error" });
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    res.status(400).json({ error: 'Webhook verification failed' });
  }
});

// 📌 API-роут для синхронизации пользователя при логине
app.post('/sync-user', async (req, res) => {
  const { clerkUserId } = req.body;

  if (!clerkUserId) {
    return res.status(400).json({ error: 'Missing Clerk user ID' });
  }

  console.log(`🔄 Syncing user ${clerkUserId}...`);

  try {
    let user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      // Запрашиваем данные пользователя через Clerk API
      const response = await fetch(`https://api.clerk.com/v1/users/${clerkUserId}`, {
        headers: {
          'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Clerk API error: ${response.statusText}`);
      }

      const clerkUser = await response.json();

      // Добавляем пользователя в базу
      user = await prisma.user.create({
        data: {
          clerkUserId: clerkUser.id,
          email: clerkUser.email_addresses[0]?.email_address || null,
          firstName: clerkUser.first_name || null,
          lastName: clerkUser.last_name || null,
          imageUrl: clerkUser.image_url || null
        }
      });

      console.log(`✅ User ${clerkUserId} added to database.`);
    } else {
      console.log(`✅ User ${clerkUserId} already exists.`);
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('❌ Error syncing user:', error);
    res.status(500).json({ error: 'Failed to sync user' });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

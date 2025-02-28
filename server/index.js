/* eslint-disable no-undef */
import express from 'express';
import { Webhook } from 'svix';
import dotenv from 'dotenv';
import {Filter} from "bad-words";
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';
import paymentRoutes from './routes/payments.js';
import { checkLowRankedJobs } from './cron-jobs.js';
import { cancelAutoRenewal } from './controllers/payments.js';
import stringSimilarity from "string-similarity";
import badWordsList from './utils/badWordsList.js';
import './cron-jobs.js';
import { sendUpdatedJobListToTelegram } from './utils/telegram.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({
  verify: (req, res, buf) => { req.rawBody = buf.toString(); }
}));

const filter = new Filter()

app.use('/api/payments', paymentRoutes);

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

/// Проверяем текст на непристойные слова
const containsBadWords = (text) => {
  if (!text) return false;
  
  const words = text.toLowerCase().split(/\s+/);
  
  // Проверяем, содержит ли текст русские маты или английские
  return words.some((word) => badWordsList.includes(word) || filter.isProfane(word));
};

// Проверяем текст на наличие ссылок
const containsLinks = (text) => {
  if (!text) return false;
  const urlPattern = /(https?:\/\/|www\.)[^\s]+/gi;
  return urlPattern.test(text);
};

// Максимальное количество вакансий на пользователя
const MAX_JOBS_PER_USER = 10;

// Создание объявления
app.post('/api/jobs', async (req, res) => {
  const { title, salary, cityId, phone, description, userId } = req.body;

  console.log('Получены данные для создания объявления:', {
    title,
    salary,
    cityId,
    phone,
    description,
    userId,
  });

  let errors = [];

  // Проверяем маты
  if (containsBadWords(title)) errors.push("Заголовок содержит нецензурные слова.");
  if (containsBadWords(description)) errors.push("Описание содержит нецензурные слова.");

  // Проверяем ссылки
  if (containsLinks(title)) errors.push("Заголовок содержит запрещенные ссылки.");
  if (containsLinks(description)) errors.push("Описание содержит запрещенные ссылки.");

  // Логируем ошибки, если они есть
  if (errors.length > 0) {
    console.log("🚨 Ошибки при публикации объявления:", errors);
    return res.status(400).json({
      success: false,
      message: "❗ Объявление не может быть опубликовано из-за следующих ошибок:",
      errors
    });
  }

  // Проверяем, существует ли пользователь с указанным clerkUserId
  let existingUser;
  try {
    existingUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        jobs: {
          orderBy: { createdAt: 'desc' },
          take: 1, // Берём только последнюю вакансию
        },
      },
    });
    console.log('Результат поиска пользователя:', existingUser);

    if (!existingUser) {
      console.error(`Пользователь с clerkUserId "${userId}" не найден в базе данных.`);
      return res.status(400).json({
        error: 'Пользователь не найден',
        details: `Не найден пользователь с clerkUserId "${userId}" в базе данных.`,
      });
    }

// Проверяем дубликаты по заголовку и описанию
const existingJobs = await prisma.job.findMany({
  where: { userId: existingUser.id },
  select: { title: true, description: true },
});

const isDuplicate = existingJobs.some(job =>
  stringSimilarity.compareTwoStrings(job.title, title) > 0.9 &&
  stringSimilarity.compareTwoStrings(job.description, description) > 0.9
);

if (isDuplicate) {
  return res.status(400).json({ error: "Ваше объявление похоже на уже существующее. Измените заголовок или описание." });
}



    // ✅ Проверяем количество вакансий у пользователя
    const jobCount = await prisma.job.count({
      where: { userId: existingUser.id },
    });

    if (jobCount >= MAX_JOBS_PER_USER) {
      console.warn(`[Job Limit] Пользователь ${userId} достиг лимита в ${MAX_JOBS_PER_USER} вакансий.`);
      return res.status(400).json({
        error: `Вы уже разместили ${MAX_JOBS_PER_USER} объявлений. Удалите одно из них, прежде чем создать новое.`,
      });
    }


        // Проверяем время последней публикации объявления
        if (existingUser.jobs.length > 0) {
          const lastJob = existingUser.jobs[0];
          const now = new Date();
          const lastJobTime = new Date(lastJob.createdAt);
          const timeDiff = (now - lastJobTime) / 1000; // разница в секундах
    
          if (timeDiff < 180) { // 3 минуты = 180 секунд
            const timeLeft = 180 - timeDiff;
            const minutesLeft = Math.floor(timeLeft / 60);
            const secondsLeft = Math.floor(timeLeft % 60);
    
            console.warn(`[Rate Limit] Попытка публикации до истечения 3 минут. Осталось ${minutesLeft}м ${secondsLeft}с.`);
            return res.status(400).json({
              error: `Вы сможете опубликовать новое объявление через ${minutesLeft}м ${secondsLeft}с.`,
            });
          }
        }   } catch (userError) {
          console.error('Ошибка при проверке пользователя:', userError.message);
          return res.status(500).json({
            error: 'Ошибка проверки пользователя',
            details: userError.message,
          });
        }


  try {
    const job = await prisma.job.create({
      data: {
        title,
        salary,
        phone,
        description,
        city: { connect: { id: parseInt(cityId) } },
        // Используем найденное поле id, а не clerkUserId
        user: { connect: { id: existingUser.id } },
      },
      include: {
        city: true,
        user: true,
      },
    });

    console.log('Объявление успешно создано:', job);
    res.status(201).json(job);
  } catch (error) {
    console.error('Ошибка создания объявления:', error.message);
    console.error(error.stack);
    res.status(500).json({ error: 'Ошибка создания объявления', details: error.message });
  }
});



// Обновление объявления
app.put('/api/jobs/:id', async (req, res) => {
  const { id } = req.params;
  const { title, salary, cityId, phone, description } = req.body;

  let errors = [];

  // Проверяем маты
  if (containsBadWords(title)) errors.push("Заголовок содержит нецензурные слова.");
  if (containsBadWords(description)) errors.push("Описание содержит нецензурные слова.");

  // Проверяем ссылки
  if (containsLinks(title)) errors.push("Заголовок содержит запрещенные ссылки.");
  if (containsLinks(description)) errors.push("Описание содержит запрещенные ссылки.");

  // Логируем ошибки, если они есть
  if (errors.length > 0) {
    console.log("🚨 Ошибки при редактировании объявления:", errors);
    return res.status(400).json({
      success: false,
      message: "❗ Объявление не может быть обновлено из-за следующих ошибок:",
      errors
    });
  }

  try {
    // Находим объявление с пользователем
    const existingJob = await prisma.job.findUnique({
      where: { id: parseInt(id) },
      include: { user: true },
    });

    if (!existingJob) {
      return res.status(404).json({ error: 'Объявление не найдено' });
    }

    // Обновляем объявление
    const updatedJob = await prisma.job.update({
      where: { id: parseInt(id) },
      data: {
        title,
        salary,
        phone,
        description,
        city: { connect: { id: parseInt(cityId) } },
      },
      include: { city: true, user: true },
    });

    // 🔥 Если у пользователя премиум – отправляем обновленный список вакансий
    if (updatedJob.user.isPremium) {
      const userJobs = await prisma.job.findMany({
        where: { userId: updatedJob.user.id },
        include: { city: true },
      });

      await sendUpdatedJobListToTelegram(updatedJob.user, userJobs);
    }

    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления объявления', details: error.message });
  }
});


// Удаление объявления
app.delete('/api/jobs/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // 🔹 Находим объявление перед удалением
    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) },
      include: { user: true },
    });

    if (!job) {
      return res.status(404).json({ error: 'Объявление не найдено' });
    }

    // Удаляем объявление
    await prisma.job.delete({
      where: { id: parseInt(id) },
    });

    // 🔥 Если пользователь премиум – отправляем обновленный список
    if (job.user.isPremium) {
      const userJobs = await prisma.job.findMany({
        where: { userId: job.user.id },
        include: { city: true },
      });

      await sendUpdatedJobListToTelegram(job.user, userJobs);
    }

    res.status(200).json({ message: 'Объявление удалено' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка удаления объявления', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Получение всех объявлений
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        city: true,
        user: true,
      },
      orderBy: [
        {
          user: {
            isPremium: 'desc',  // Premium пользователи выше всех
          },
        },
        {
          boostedAt: 'desc',    // Затем по boostedAt
        },
        {
          createdAt: 'desc',    // Затем по дате создания
        },
      ],
    });

    res.status(200).json(jobs);
  } catch (error) {
    console.error('Ошибка получения объявлений:', error.message);
    res.status(500).json({ error: 'Ошибка получения объявлений', details: error.message });
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

// Поднятие вакансии вверх
app.post('/api/jobs/:id/boost', async (req, res) => {
  const { id } = req.params;
  console.log(`[Boost] Запрос на поднятие объявления с ID: ${id}`);

  try {
    // Получаем вакансию вместе с пользователем
    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) },
      include: { user: true },
    });

    if (!job) {
      console.error(`[Boost] Объявление с ID ${id} не найдено.`);
      return res.status(404).json({ error: 'Объявление не найдено' });
    }

    const ONE_DAY = 24 * 60 * 60 * 1000; // 24 часа в миллисекундах
    const now = new Date();
    const user = job.user;

    if (!user) {
      console.error(`[Boost] Пользователь не найден.`);
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Если объявление уже было поднято, проверяем таймер (даже если у пользователя премиум)
    if (job.boostedAt) {
      const lastBoostTime = new Date(job.boostedAt);
      const timeSinceBoost = now - lastBoostTime;

      if (timeSinceBoost < ONE_DAY) {
        // Рассчитываем оставшееся время
        const timeLeft = ONE_DAY - timeSinceBoost;
        const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

        console.warn(`[Boost] Попытка повторного поднятия до истечения суток. Осталось ${hoursLeft}ч ${minutesLeft}м.`);
        return res.status(400).json({ 
          error: `Вы сможете поднять вакансию через ${hoursLeft} ч ${minutesLeft} м.` 
        });
      }
    }

    // 🔥 Если таймер истек или премиум только что куплен – поднимаем вакансию
    const boostedJob = await prisma.job.update({
      where: { id: parseInt(id) },
      data: { boostedAt: now },
    });

    console.log(`[Boost] Объявление успешно поднято:`, boostedJob);
    res.status(200).json(boostedJob);
  } catch (error) {
    console.error('[Boost] Ошибка на сервере:', error);
    res.status(500).json({ error: 'Ошибка поднятия вакансии', details: error.message });
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





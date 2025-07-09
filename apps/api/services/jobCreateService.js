import stringSimilarity from "string-similarity";
import { containsBadWords, containsLinks } from '../middlewares/validation.js';
import { sendNewJobNotificationToTelegram } from '../utils/telegram.js';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const MAX_JOBS_PER_USER = 10;

export const createJobService = async ({ title, salary, cityId, categoryId, phone, description, userId, shuttle, meals }) => {
  let errors = [];

  // Валидация на запрещенные слова и ссылки
  if (containsBadWords(title)) errors.push("Заголовок содержит нецензурные слова.");
  if (containsBadWords(description)) errors.push("Описание содержит нецензурные слова.");
  if (containsLinks(title)) errors.push("Заголовок содержит запрещенные ссылки.");
  if (containsLinks(description)) errors.push("Описание содержит запрещенные ссылки.");
  
  if (errors.length > 0) return { errors };

  // Поиск пользователя
  const existingUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: { jobs: { orderBy: { createdAt: 'desc' }, take: 1 } },
  });

  if (!existingUser) return { error: 'Пользователь не найден' };

  // Проверка на дублирование вакансий
  const existingJobs = await prisma.job.findMany({
    where: { userId: existingUser.id },
    select: { title: true, description: true }
  });

  const isDuplicate = existingJobs.some(job =>
    stringSimilarity.compareTwoStrings(job.title, title) > 0.9 &&
    stringSimilarity.compareTwoStrings(job.description, description) > 0.9
  );

  if (isDuplicate) return { error: "Ваше объявление похоже на уже существующее. Измените заголовок или описание." };

  // Проверка на количество объявлений
  const jobCount = await prisma.job.count({ where: { userId: existingUser.id } });

  if (jobCount >= MAX_JOBS_PER_USER) {
    return { error: `Вы уже разместили ${MAX_JOBS_PER_USER} объявлений.` };
  }

  // Создание новой вакансии
  const job = await prisma.job.create({
    data: {
      title,
      salary,
      phone,
      description,
      shuttle,
      meals,
      city: { connect: { id: parseInt(cityId) } },
      category: { connect: { id: parseInt(categoryId) } },
      user: { connect: { id: existingUser.id } }
    },
    include: { city: true, user: true, category: true },
  });

  // Если пользователь премиум — отправляем уведомление в Telegram
  if (existingUser.isPremium) {
    await sendNewJobNotificationToTelegram(existingUser, job);
  }

  return { job };
};

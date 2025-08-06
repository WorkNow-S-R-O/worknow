import stringSimilarity from "string-similarity";
import { containsBadWords, containsLinks } from '../middlewares/validation.js';
import { sendNewJobNotificationToTelegram } from '../utils/telegram.js';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const MAX_JOBS_FREE_USER = 5;
const MAX_JOBS_PREMIUM_USER = 10;

export const createJobService = async ({ title, salary, cityId, categoryId, phone, description, userId, shuttle, meals, imageUrl }) => {
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

  // Проверка на количество объявлений в зависимости от статуса подписки
  const jobCount = await prisma.job.count({ where: { userId: existingUser.id } });
  
  // Определяем лимит в зависимости от статуса подписки
  const isPremium = existingUser.isPremium || existingUser.premiumDeluxe;
  const maxJobs = isPremium ? MAX_JOBS_PREMIUM_USER : MAX_JOBS_FREE_USER;
  
  if (jobCount >= maxJobs) {
    if (isPremium) {
      return { error: `Вы уже разместили ${MAX_JOBS_PREMIUM_USER} объявлений.` };
    } else {
      return { 
        error: `Вы уже разместили ${MAX_JOBS_FREE_USER} объявлений. Для размещения большего количества объявлений перейдите на Premium тариф.`,
        upgradeRequired: true 
      };
    }
  }

  console.log('🔍 createJobService - Creating job with imageUrl:', imageUrl);
  console.log('🔍 createJobService - Full data object:', {
    title,
    salary,
    phone,
    description,
    shuttle,
    meals,
    imageUrl,
    cityId,
    categoryId,
    userId
  });
  
  // Создание новой вакансии
  const job = await prisma.job.create({
    data: {
      title,
      salary,
      phone,
      description,
      shuttle,
      meals,
      imageUrl,
      city: { connect: { id: parseInt(cityId) } },
      category: { connect: { id: parseInt(categoryId) } },
      user: { connect: { id: existingUser.id } }
    },
    include: { city: true, user: true, category: true },
  });

  console.log('🔍 createJobService - Job created successfully:', {
    id: job.id,
    title: job.title,
    imageUrl: job.imageUrl
  });

  // Если пользователь премиум — отправляем уведомление в Telegram
  if (existingUser.isPremium) {
    await sendNewJobNotificationToTelegram(existingUser, job);
  }

  return { job };
};

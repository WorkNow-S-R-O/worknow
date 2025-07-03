import { PrismaClient } from '@prisma/client';
import { containsBadWords, containsLinks } from '../middlewares/validation.js';
import { sendUpdatedJobListToTelegram } from '../utils/telegram.js';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export const updateJobService = async (id, data) => {
  let errors = [];
  const { title, salary, cityId, phone, description, categoryId, shuttle, meals, imageUrl, removeImage } = data;
  if (containsBadWords(title)) errors.push("Заголовок содержит нецензурные слова.");
  if (containsBadWords(description)) errors.push("Описание содержит нецензурные слова.");
  if (containsLinks(title)) errors.push("Заголовок содержит запрещенные ссылки.");
  if (containsLinks(description)) errors.push("Описание содержит запрещенные ссылки.");
  if (errors.length > 0) return { errors };

  try {
    const existingJob = await prisma.job.findUnique({ where: { id: parseInt(id) }, include: { user: true } });
    if (!existingJob) return { error: 'Объявление не найдено' };

    let newImageUrl = existingJob.imageUrl;
    if (removeImage === '1' || imageUrl) {
      if (existingJob.imageUrl) {
        const filePath = path.join(process.cwd(), 'public', existingJob.imageUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        newImageUrl = null;
      }
    }
    if (imageUrl) {
      newImageUrl = imageUrl;
    }

    const updatedJob = await prisma.job.update({
      where: { id: parseInt(id) },
      data: { 
        title, 
        salary, 
        phone, 
        description, 
        city: { connect: { id: parseInt(cityId) } },
        category: { connect: { id: parseInt(categoryId) } },
        shuttle,
        meals,
        imageUrl: newImageUrl,
      },
      include: { city: true, user: true, category: true },
    });

    if (updatedJob.user.isPremium) {
      const userJobs = await prisma.job.findMany({ where: { userId: updatedJob.user.id }, include: { city: true } });
      await sendUpdatedJobListToTelegram(updatedJob.user, userJobs);
    }
    return { updatedJob };
  } catch (error) {
    return { error: 'Ошибка обновления объявления', details: error.message };
  }
};
import { PrismaClient } from '@prisma/client';
import { sendUpdatedJobListToTelegram } from '../utils/telegram.js';

const prisma = new PrismaClient();

export const deleteJobService = async (id) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) },
      include: { user: true },
    });
    if (!job) return { error: 'Объявление не найдено' };

    await prisma.job.delete({ where: { id: parseInt(id) } });

    if (job.user.isPremium) {
      const userJobs = await prisma.job.findMany({ where: { userId: job.user.id }, include: { city: true } });
      await sendUpdatedJobListToTelegram(job.user, userJobs);
    }

    return {};
  } catch (error) {
    return { error: 'Ошибка удаления объявления', details: error.message };
  }
};
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getJobsService = async () => {
  try {
    const jobs = await prisma.job.findMany({
      include: { city: true, user: true, category: { include: { translations: true } } },
      orderBy: [
        { user: { isPremium: 'desc' } },
        { boostedAt: { sort: 'desc', nulls: 'last' } },
        { createdAt: 'desc' }
      ]
    });
    
    return { jobs };
  } catch (error) {
    return { error: 'Ошибка получения объявлений', details: error.message };
  }
};
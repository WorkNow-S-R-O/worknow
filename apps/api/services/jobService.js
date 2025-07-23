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
    
    console.log('🔍 getJobsService - Jobs with images:', jobs.map(job => ({
      id: job.id,
      title: job.title,
      imageUrl: job.imageUrl,
      hasImageUrl: !!job.imageUrl
    })));
    
    return { jobs };
  } catch (error) {
    return { error: 'Ошибка получения объявлений', details: error.message };
  }
};
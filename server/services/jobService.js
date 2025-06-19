import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getJobsService = async (filters = {}) => {
  try {
    // Формируем условия фильтрации
    const where = {};
    
    // Фильтр по зарплате
    if (filters.salary) {
      where.salary = {
        gte: String(filters.salary) // Больше или равно указанной зарплате
      };
    }

    // Фильтр по категории
    if (filters.categoryId) {
      where.categoryId = parseInt(filters.categoryId);
    }

    const jobs = await prisma.job.findMany({
      where,
      include: { city: true, user: true, category: true },
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

export const getUserJobsService = async (clerkUserId, query) => {
    const { page = 1, limit = 5 } = query;
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const skip = (pageInt - 1) * limitInt;
  
    try {
      const user = await prisma.user.findUnique({ where: { clerkUserId } });
      if (!user) return { error: 'Пользователь не найден' };
  
      const jobs = await prisma.job.findMany({
        where: { userId: user.id },
        include: { city: true, user: true, category: true },
        skip,
        take: limitInt,
        orderBy: { createdAt: 'desc' },
      });
  
      const totalJobs = await prisma.job.count({ where: { userId: user.id } });
  
      return {
        jobs,
        totalJobs,
        totalPages: Math.ceil(totalJobs / limitInt),
        currentPage: pageInt,
      };
    } catch (error) {
      return { error: 'Ошибка получения объявлений пользователя', details: error.message };
    }
  };
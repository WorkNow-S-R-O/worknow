import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getJobByIdService = async (id) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) },
      include: { city: true },
    });

    if (!job) {
      return { error: 'Объявление не найдено' };
    }

    return { job };
  } catch (error) {
    return { error: 'Ошибка получения объявления', details: error.message };
  }
};

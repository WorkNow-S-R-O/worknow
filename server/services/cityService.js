import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCitiesService = async () => {
  try {
    const cities = await prisma.city.findMany();
    return { cities };
  } catch (error) {
    return { error: 'Ошибка получения городов', details: error.message };
  }
};
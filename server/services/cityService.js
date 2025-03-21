import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCitiesService = async () => {
  try {
    const cities = await prisma.city.findMany();
    
    return { cities };
  } catch (error) {
    console.error("❌ Ошибка при получении городов:", error);
    return { error: "Ошибка сервера при получении городов" };
  }
};

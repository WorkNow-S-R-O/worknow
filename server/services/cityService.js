import prisma from '../prismaClient.js';

export const getCitiesService = async () => {
  try {
    console.log("📌 Запрашиваем города из БД...");
    
    const cities = await prisma.city.findMany();
    
    console.log("📌 Города из БД:", cities); // ✅ Логируем полученные данные
    
    return { cities };
  } catch (error) {
    console.error("❌ Ошибка при получении городов:", error);
    return { error: "Ошибка сервера при получении городов" };
  }
};

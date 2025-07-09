import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export const getCitiesService = async (lang = 'ru') => {
  try {
    const cities = await prisma.city.findMany({
      include: {
        translations: {
          where: { lang }
        }
      }
    });
    // Возвращаем только нужный перевод для каждого города
    const result = cities.map(city => ({
      id: city.id,
      name: city.translations[0]?.name || city.name
    }));
    return { cities: result };
  } catch (error) {
    console.error("❌ Ошибка при получении городов:", error);
    return { error: "Ошибка сервера при получении городов" };
  }
};

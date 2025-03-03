import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getJobByIdService = async (id) => {
  try {
    console.log("ID, который пришел в сервис:", id); // Логируем id

    if (!id || isNaN(id)) {
      throw new Error("ID вакансии не передан или имеет неверный формат");
    }

    const job = await prisma.job.findUnique({
      where: { id: Number(id) }, // Преобразуем id в число
      include: { city: true },
    });

    if (!job) {
      return { error: "Объявление не найдено" };
    }

    return { job };
  } catch (error) {
    console.error("Ошибка в getJobByIdService:", error);
    return { error: "Ошибка получения объявления", details: error.message };
  }
};

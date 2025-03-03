import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getJobByIdService = async (id) => {
  try {
    if (!id) {
      throw new Error("ID вакансии не передан");
    }

    const job = await prisma.job.findUnique({
      where: { id: Number(id) }, // Приводим id к числу
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

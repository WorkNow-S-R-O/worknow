import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export const getJobByIdService = async (id) => {
  try {
    return await prisma.job.findUnique({
      where: { id: parseInt(id) },
      include: {
        city: true,
        category: true,
      },
    });
  } catch (error) {
    console.error('Ошибка в getJobByIdService:', error.message);
    throw new Error('Ошибка получения объявления');
  }
};

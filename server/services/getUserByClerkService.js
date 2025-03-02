import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUserByClerkIdService = async (clerkUserId) => {
  try {
    return await prisma.user.findUnique({
      where: { clerkUserId },
    });
  } catch (error) {
    console.error('Ошибка в getUserByClerkIdService:', error.message);
    throw new Error('Ошибка получения данных пользователя');
  }
};

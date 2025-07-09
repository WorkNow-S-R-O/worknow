import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();
const ONE_DAY = 24 * 60 * 60 * 1000;

export const boostJobService = async (id) => {
  try {
    const job = await prisma.job.findUnique({ where: { id: parseInt(id) }, include: { user: true } });
    if (!job) return { error: 'Объявление не найдено' };
    if (!job.user) return { error: 'Пользователь не найден' };

    const now = new Date();
    if (job.boostedAt) {
      const lastBoostTime = new Date(job.boostedAt);
      const timeSinceBoost = now - lastBoostTime;
      if (timeSinceBoost < ONE_DAY) {
        const timeLeft = ONE_DAY - timeSinceBoost;
        const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        return { error: `Вы сможете поднять вакансию через ${hoursLeft} ч ${minutesLeft} м.` };
      }
    }

    const boostedJob = await prisma.job.update({ where: { id: parseInt(id) }, data: { boostedAt: now } });
    return { boostedJob };
  } catch (error) {
    return { error: 'Ошибка поднятия вакансии', details: error.message };
  }
};

import { PrismaClient } from '@prisma/client';
import { createFakeUser } from './fakeUsers.js';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

/**
 * Функция для распределения вакансий среди фейковых пользователей
 */
export const assignJobsToFakeUsers = async (jobs) => {
    console.log('🔄 Привязываем вакансии к фейковым пользователям...');
  
    for (let job of jobs) {
      try {
        let fakeUser = await prisma.user.findFirst({
          where: { clerkUserId: { startsWith: 'user_' } },
          orderBy: { jobs: { _count: 'asc' } }, // Балансируем вакансии
          include: { jobs: true }
        });
  
        if (!fakeUser) {
          fakeUser = await createFakeUser();
        }
  
        await prisma.job.create({
          data: {
            title: job.title,
            salary: String(job.salary),
            description: job.description,
            phone: faker.phone.number('+972 ###-###-####'),
            city: { connectOrCreate: { where: { name: job.city }, create: { name: job.city } } },
            user: { connect: { id: fakeUser.id } },
            createdAt: new Date(),
          },
        });
  
        console.log(`✅ Вакансия "${job.title}" привязана к ${fakeUser.email}`);
      } catch (error) {
        console.error(`❌ Ошибка при привязке вакансии "${job.title}":`, error.message);
      }
    }
  };
  
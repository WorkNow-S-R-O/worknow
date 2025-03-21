import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Функция создания фейкового пользователя
 */
export const createFakeUser = async () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName });
  const imageUrl = faker.image.avatar();
  const clerkUserId = `fake_${faker.string.uuid()}`;

  const user = await prisma.user.create({
    data: {
      clerkUserId,
      firstName,
      lastName,
      email,
      imageUrl,
    },
  });

  console.log(`✅ Фейковый пользователь создан: ${email}`);
  return user;
};

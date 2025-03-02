import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const processClerkWebhookService = async (evt) => {
  const userId = evt.data.id;

  try {
    if (evt.type === 'user.created' || evt.type === 'user.updated') {
      const { email_addresses, first_name, last_name, image_url } = evt.data;

      await prisma.user.upsert({
        where: { clerkUserId: userId },
        update: {
          email: email_addresses[0].email_address,
          firstName: first_name || null,
          lastName: last_name || null,
          imageUrl: image_url || null,
        },
        create: {
          clerkUserId: userId,
          email: email_addresses[0].email_address,
          firstName: first_name || null,
          lastName: last_name || null,
          imageUrl: image_url || null,
        },
      });
    }

    if (evt.type === 'user.deleted') {
      await prisma.user.delete({
        where: { clerkUserId: userId },
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Ошибка обработки вебхука:', error);
    return { error: 'Ошибка обработки вебхука', details: error.message };
  }
};

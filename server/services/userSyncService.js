import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

export const syncUserService = async (clerkUserId) => {
  try {
    // Получаем актуальные данные из Clerk
    const response = await fetch(`https://api.clerk.com/v1/users/${clerkUserId}`, {
      headers: {
        'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return { error: `Ошибка Clerk API: ${response.status} ${response.statusText}` };
    }

    const clerkUser = await response.json();

    // Обновляем или создаём пользователя в базе
    const user = await prisma.user.upsert({
      where: { clerkUserId },
      update: {
        email: clerkUser.email_addresses[0]?.email_address || null,
        firstName: clerkUser.first_name || null,
        lastName: clerkUser.last_name || null,
        imageUrl: clerkUser.image_url || null
      },
      create: {
        clerkUserId: clerkUser.id,
        email: clerkUser.email_addresses[0]?.email_address || null,
        firstName: clerkUser.first_name || null,
        lastName: clerkUser.last_name || null,
        imageUrl: clerkUser.image_url || null
      }
    });

    return { success: true, user };
  } catch (error) {
    console.error('Ошибка синхронизации пользователя:', error);
    return { error: 'Failed to sync user', details: error.message };
  }
};

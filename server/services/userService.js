import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { Webhook } from 'svix';

dotenv.config();
const prisma = new PrismaClient();
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

export const syncUserService = async (clerkUserId) => {
  if (!clerkUserId) return { error: 'Missing Clerk user ID' };
  try {
    let user = await prisma.user.findUnique({ where: { clerkUserId } });
    if (!user) {
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
      user = await prisma.user.create({
        data: {
          clerkUserId: clerkUser.id,
          email: clerkUser.email_addresses[0]?.email_address || null,
          firstName: clerkUser.first_name || null,
          lastName: clerkUser.last_name || null,
          imageUrl: clerkUser.image_url || null
        }
      });
    }
    return { success: true, user };
  } catch (error) {
    return { error: 'Failed to sync user', details: error.message };
  }
};

export const getUserByClerkIdService = async (clerkUserId) => {
  try {
    const user = await prisma.user.findUnique({ where: { clerkUserId } });
    if (!user) return { error: 'Пользователь не найден' };
    return { user };
  } catch (error) {
    return { error: 'Ошибка получения пользователя', details: error.message };
  }
};

export const getUserJobsService = async (clerkUserId, query) => {
  const { page = 1, limit = 5 } = query;
  const pageInt = parseInt(page);
  const limitInt = parseInt(limit);
  const skip = (pageInt - 1) * limitInt;

  try {
    const user = await prisma.user.findUnique({ where: { clerkUserId } });
    if (!user) return { error: 'Пользователь не найден' };
    const jobs = await prisma.job.findMany({
      where: { userId: user.id },
      include: { city: true, user: true },
      skip,
      take: limitInt,
      orderBy: { createdAt: 'desc' },
    });
    const totalJobs = await prisma.job.count({ where: { userId: user.id } });
    return { jobs, totalJobs, totalPages: Math.ceil(totalJobs / limitInt), currentPage: pageInt };
  } catch (error) {
    return { error: 'Ошибка получения объявлений пользователя', details: error.message };
  }
};

// Обработка Clerk Webhook
export const handleClerkWebhookService = async (req) => {
  const svix_id = req.headers['svix-id'];
  const svix_timestamp = req.headers['svix-timestamp'];
  const svix_signature = req.headers['svix-signature'];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return { error: 'Missing Svix headers' };
  }

  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    const evt = wh.verify(req.rawBody, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });

    const userId = evt.data.id;

    if (evt.type === 'user.created' || evt.type === 'user.updated') {
      const email_addresses = evt.data.email_addresses;
      const first_name = evt.data.first_name;
      const last_name = evt.data.last_name;
      const image_url = evt.data.image_url;

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
    return { error: 'Webhook verification failed' };
  }
};

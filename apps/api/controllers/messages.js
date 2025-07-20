import { PrismaClient } from '@prisma/client';
import { sendEmail } from '../utils/mailer.js';
// import nodemailer from 'nodemailer'; // Для реальной отправки email

const prisma = new PrismaClient();

// Создать сообщение (и отправить email)
export const createMessage = async (req, res) => {
  try {
    const { clerkUserId, title, body, type = 'system', fromAdminId } = req.body;
    if (!clerkUserId || !title || !body) {
      return res.status(400).json({ error: 'clerkUserId, title и body обязательны' });
    }
    // Создаём сообщение в базе
    const message = await prisma.message.create({
      data: { clerkUserId, title, body, type, fromAdminId },
    });
    // Получаем email пользователя
    const user = await prisma.user.findUnique({ where: { clerkUserId } });
    if (user && user.email) {
      // Отправляем email через nodemailer
      try {
        await sendEmail(user.email, title, `<h2>${title}</h2><p>${body}</p>`);
      } catch (e) {
        console.error('Ошибка отправки email:', e);
      }
    }
    return res.json({ success: true, message });
  } catch (error) {
    console.error('Ошибка создания сообщения:', error);
    return res.status(500).json({ error: 'Ошибка создания сообщения' });
  }
};

// Получить все сообщения пользователя (по clerkUserId)
export const getUserMessages = async (req, res) => {
  try {
    const { clerkUserId } = req.query;
    console.log('clerkUserId из запроса:', clerkUserId);
    if (!clerkUserId) return res.status(400).json({ error: 'clerkUserId обязателен' });
    const messages = await prisma.message.findMany({
      where: { clerkUserId },
      orderBy: { createdAt: 'desc' },
    });
    console.log('Сообщения из базы:', messages);
    return res.json({ messages });
  } catch (error) {
    console.error('Ошибка получения сообщений:', error);
    return res.status(500).json({ error: 'Ошибка получения сообщений' });
  }
};

// Отметить сообщение как прочитанное
export const markMessageRead = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await prisma.message.update({
      where: { id },
      data: { isRead: true },
    });
    return res.json({ success: true, message });
  } catch (error) {
    console.error('Ошибка отметки сообщения как прочитанного:', error);
    return res.status(500).json({ error: 'Ошибка отметки сообщения' });
  }
};

// Массовая рассылка сообщений и email
export const broadcastMessage = async (req, res) => {
  try {
    const { title, body, clerkUserIds } = req.body;
    if (!title || !body) {
      return res.status(400).json({ error: 'title и body обязательны' });
    }
    
    let users;
    if (Array.isArray(clerkUserIds) && clerkUserIds.length > 0) {
      users = await prisma.user.findMany({ where: { clerkUserId: { in: clerkUserIds } } });
    } else {
      users = await prisma.user.findMany();
    }
    let sent = 0;
    for (const user of users) {
      await prisma.message.create({
        data: {
          clerkUserId: user.clerkUserId,
          title,
          body,
          type: 'admin',
        }
      });
      if (user.email) {
        try {
          await sendEmail(user.email, title, body);
        } catch (e) {
          console.error('Ошибка отправки email:', e);
        }
      }
      sent++;
    }
    return res.json({ success: true, count: sent });
  } catch (error) {
    console.error('Ошибка рассылки:', error);
    return res.status(500).json({ error: 'Ошибка рассылки' });
  }
};

// Заготовка для отправки email (реализовать через nodemailer)
// async function sendEmail(to, subject, text) {
//   // ...
// } 
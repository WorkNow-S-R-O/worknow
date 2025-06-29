import { PrismaClient } from '@prisma/client';
import { sendEmail } from '../utils/mailer.js';
// import nodemailer from 'nodemailer'; // Для реальной отправки email

const prisma = new PrismaClient();

// Создать сообщение (и отправить email)
export const createMessage = async (req, res) => {
  try {
    const { userId, title, body, type = 'system', fromAdminId } = req.body;
    if (!userId || !title || !body) {
      return res.status(400).json({ error: 'userId, title и body обязательны' });
    }
    // Создаём сообщение в базе
    const message = await prisma.message.create({
      data: { userId, title, body, type, fromAdminId },
    });
    // Получаем email пользователя
    const user = await prisma.user.findUnique({ where: { id: userId } });
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

// Получить все сообщения пользователя (по userId)
export const getUserMessages = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId обязателен' });
    const messages = await prisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
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

// Заготовка для отправки email (реализовать через nodemailer)
// async function sendEmail(to, subject, text) {
//   // ...
// } 
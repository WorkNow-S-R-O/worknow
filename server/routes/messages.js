import { Router } from 'express';
import { createMessage, getUserMessages, markMessageRead } from '../controllers/messages.js';

const router = Router();

// Создать сообщение (автоматически или админом)
router.post('/', createMessage);
// Получить все сообщения пользователя
router.get('/', getUserMessages);
// Отметить сообщение как прочитанное
router.patch('/:id/read', markMessageRead);

export default router; 
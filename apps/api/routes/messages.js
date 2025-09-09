import { Router } from 'express';
import {
	createMessage,
	getUserMessages,
	markMessageRead,
	broadcastMessage,
	deleteMessage,
} from '../controllers/messages.js';
import { requireAdmin } from '../middlewares/auth.js';

const router = Router();

// Получить сообщения пользователя (через query-параметр userId)
router.get('/', getUserMessages);
// Получить сообщения пользователя по path-параметру
router.get('/user/:userId', getUserMessages);

// Создать новое сообщение
router.post('/', createMessage);

// Отметить сообщение как прочитанное
router.patch('/:id/read', markMessageRead);

// Удалить сообщение
router.delete('/:id', deleteMessage);

// Отправить массовое сообщение (только для админов)
router.post('/broadcast', requireAdmin, broadcastMessage);

export default router;

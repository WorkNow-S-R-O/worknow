import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

// Middleware для проверки админских прав
export const requireAdmin = async (req, res, next) => {
  try {
    // Получаем userId из заголовка или токена (зависит от вашей аутентификации)
    const userId = req.headers['user-id'] || req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Не авторизован' });
    }

    // Проверяем, является ли пользователь админом
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isAdmin: true }
    });

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Доступ запрещен. Требуются права администратора.' });
    }

    next();
  } catch (error) {
    console.error('Ошибка проверки админских прав:', error);
    return res.status(500).json({ error: 'Ошибка проверки прав доступа' });
  }
};
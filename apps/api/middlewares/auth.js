import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

// Middleware для проверки аутентификации
export const requireAuth = async (req, res, next) => {
  try {
    // Получаем токен из заголовка Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // For now, allow the request to proceed if a token is present
    // TODO: Implement proper Clerk token verification
    console.log('Auth middleware: Token received:', token.substring(0, 10) + '...');
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Authentication error' });
  }
};

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
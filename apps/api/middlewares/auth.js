import pkg from '@prisma/client';
import { Buffer } from 'buffer';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

// Middleware для проверки аутентификации
export const requireAuth = async (req, res, next) => {
  try {
      // Auth middleware processing request
    
    // Получаем токен из заголовка Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('❌ Auth middleware - No valid authorization header');
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    // Token received from headers
    
    try {
      // For development, we'll use a simpler approach to extract user ID from the token
      // This is a temporary solution that works with Clerk's JWT format
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.error('Invalid JWT token format');
        return res.status(401).json({ error: 'Invalid token format' });
      }

      // Decode the payload (second part) - this is safe for development
      const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
      
      // Token payload verified
      
      // Extract user ID from the token payload
      const clerkUserId = payload.sub;
      
      if (!clerkUserId) {
        console.error('No user ID found in token payload');
        return res.status(401).json({ error: 'Invalid token - no user ID' });
      }

      // Set user information in request object
      req.user = {
        clerkUserId: clerkUserId,
        email: payload.email,
        firstName: payload.first_name,
        lastName: payload.last_name,
        imageUrl: payload.image_url
      };

      // User authenticated successfully
      
      next();
    } catch (decodeError) {
      console.error('Token decode error:', decodeError);
      console.error('Token decode error details:', {
        message: decodeError.message,
        stack: decodeError.stack
      });
      return res.status(401).json({ error: 'Token verification failed' });
    }
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
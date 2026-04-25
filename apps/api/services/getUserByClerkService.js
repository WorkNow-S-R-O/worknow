import prisma from '../lib/prisma.js';


export const getUserByClerkIdService = async (clerkUserId) => {
	try {
		return await prisma.user.findUnique({
			where: { clerkUserId },
		});
	} catch (error) {
		console.error('Ошибка в getUserByClerkIdService:', error.message);
		throw new Error('Ошибка получения данных пользователя');
	}
};

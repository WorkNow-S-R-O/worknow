import prisma from '../lib/prisma.js';


export const getUserByClerkIdService = async (clerkUserId) => {
	try {
		const user = await prisma.user.findUnique({
			where: { clerkUserId },
		});

		if (!user) {
			return { error: 'Пользователь не найден' };
		}

		return { user };
	} catch (error) {
		return {
			error: 'Ошибка получения данных пользователя',
			details: error.message,
		};
	}
};

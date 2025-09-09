import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getJobByIdService = async (id) => {
	try {
		if (!id || isNaN(id)) {
			throw new Error('ID вакансии не передан или имеет неверный формат');
		}

		const job = await prisma.job.findUnique({
			where: { id: Number(id) }, // Преобразуем id в число
			include: {
				city: true,
				category: true,
				user: {
					select: {
						id: true,
						isPremium: true,
						firstName: true,
						lastName: true,
						clerkUserId: true,
					},
				},
			},
		});

		if (!job) {
			return { error: 'Объявление не найдено' };
		}

		console.log('🔍 getJobByIdService - Job with imageUrl:', {
			id: job.id,
			title: job.title,
			imageUrl: job.imageUrl,
			hasImageUrl: !!job.imageUrl,
		});

		return { job };
	} catch (error) {
		console.error('Ошибка в getJobByIdService:', error);
		return { error: 'Ошибка получения объявления', details: error.message };
	}
};

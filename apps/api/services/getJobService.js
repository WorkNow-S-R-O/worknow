import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getJobByIdService = async (id) => {
	try {
		console.log('🔍 getJobByIdService - Fetching job with ID:', id);

		const job = await prisma.job.findUnique({
			where: { id: parseInt(id) },
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

		console.log('🔍 getJobByIdService - Job found:', {
			id: job?.id,
			title: job?.title,
			imageUrl: job?.imageUrl,
			hasImageUrl: !!job?.imageUrl,
		});

		return job;
	} catch (error) {
		console.error('Ошибка в getJobByIdService:', error.message);
		throw new Error('Ошибка получения объявления');
	}
};

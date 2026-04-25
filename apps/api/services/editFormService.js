import prisma from '../lib/prisma.js';
import { containsBadWords, containsLinks } from '../middlewares/validation.js';
import { sendUpdatedJobListToTelegram } from '../utils/telegram.js';


export const updateJobService = async (
	id,
	{
		title,
		salary,
		cityId,
		phone,
		description,
		categoryId,
		shuttle,
		meals,
		imageUrl,
		userId,
	},
) => {
	let errors = [];
	if (containsBadWords(title))
		errors.push('Заголовок содержит нецензурные слова.');
	if (containsBadWords(description))
		errors.push('Описание содержит нецензурные слова.');
	if (containsLinks(title))
		errors.push('Заголовок содержит запрещенные ссылки.');
	if (containsLinks(description))
		errors.push('Описание содержит запрещенные ссылки.');
	if (errors.length > 0) return { errors };

	try {
		const existingJob = await prisma.job.findUnique({
			where: { id: parseInt(id) },
			include: { user: true },
		});
		if (!existingJob) return { error: 'Объявление не найдено' };

		// Check if the authenticated user owns this job
		if (existingJob.user.clerkUserId !== userId) {
			return { error: 'У вас нет прав для редактирования этого объявления' };
		}

		console.log('🔍 updateJobService - Updating job with imageUrl:', imageUrl);
		console.log('🔍 updateJobService - Full update data:', {
			title,
			salary,
			phone,
			description,
			imageUrl,
			cityId,
			categoryId,
			shuttle,
			meals,
		});

		const updatedJob = await prisma.job.update({
			where: { id: parseInt(id) },
			data: {
				title,
				salary,
				phone,
				description,
				imageUrl, // Add imageUrl to the update data
				city: { connect: { id: parseInt(cityId) } },
				category: { connect: { id: parseInt(categoryId) } },
				shuttle,
				meals,
			},
			include: { city: true, user: true, category: true },
		});

		if (updatedJob.user.isPremium) {
			const userJobs = await prisma.job.findMany({
				where: { userId: updatedJob.user.id },
				include: { city: true },
			});
			await sendUpdatedJobListToTelegram(updatedJob.user, userJobs);
		}
		return { updatedJob };
	} catch (error) {
		return { error: 'Ошибка обновления объявления', details: error.message };
	}
};

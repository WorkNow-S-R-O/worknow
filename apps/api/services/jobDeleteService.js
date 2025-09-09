import { PrismaClient } from '@prisma/client';
import { sendUpdatedJobListToTelegram } from '../utils/telegram.js';
import { deleteFromS3 } from '../utils/s3Upload.js';

const prisma = new PrismaClient();

export const deleteJobService = async (id, userId) => {
	try {
		const job = await prisma.job.findUnique({
			where: { id: parseInt(id) },
			include: { user: true },
		});
		if (!job) return { error: 'Объявление не найдено' };

		// Check if the authenticated user owns this job
		if (job.user.clerkUserId !== userId) {
			return { error: 'У вас нет прав для удаления этого объявления' };
		}

		// Delete image from S3 if it exists
		if (job.imageUrl) {
			try {
				// Deleting image from S3
				const imageDeleted = await deleteFromS3(job.imageUrl);
				if (imageDeleted) {
					// Image deleted from S3 successfully
				} else {
					console.warn(
						'⚠️ deleteJobService - Failed to delete image from S3, but continuing with job deletion',
					);
				}
			} catch (imageError) {
				console.error(
					'❌ deleteJobService - Error deleting image from S3:',
					imageError,
				);
				// Continue with job deletion even if image deletion fails
			}
		}

		// Delete the job from database
		await prisma.job.delete({ where: { id: parseInt(id) } });

		if (job.user.isPremium) {
			const userJobs = await prisma.job.findMany({
				where: { userId: job.user.id },
				include: { city: true },
			});
			await sendUpdatedJobListToTelegram(job.user, userJobs);
		}

		return {};
	} catch (error) {
		return { error: 'Ошибка удаления объявления', details: error.message };
	}
};

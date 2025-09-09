import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config({ path: '.env.local' });
dotenv.config();

const prisma = new PrismaClient();
// eslint-disable-next-line no-undef
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

console.log(
	'🔍 UserSyncService - CLERK_SECRET_KEY available:',
	!!CLERK_SECRET_KEY,
);

export const syncUserService = async (clerkUserId) => {
	try {
		console.log(
			'🔍 UserSyncService - Starting sync for clerkUserId:',
			clerkUserId,
		);

		if (!CLERK_SECRET_KEY) {
			console.error('❌ UserSyncService - CLERK_SECRET_KEY is missing');
			return { error: 'Clerk secret key is not configured' };
		}

		// Получаем актуальные данные из Clerk
		console.log('🔍 UserSyncService - Fetching user data from Clerk API...');
		const response = await fetch(
			`https://api.clerk.com/v1/users/${clerkUserId}`,
			{
				headers: {
					Authorization: `Bearer ${CLERK_SECRET_KEY}`,
					'Content-Type': 'application/json',
				},
			},
		);

		console.log(
			'🔍 UserSyncService - Clerk API response status:',
			response.status,
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.error(
				'❌ UserSyncService - Clerk API error:',
				response.status,
				errorText,
			);
			return {
				error: `Ошибка Clerk API: ${response.status} ${response.statusText}`,
			};
		}

		const clerkUser = await response.json();
		console.log('🔍 UserSyncService - Clerk user data received:', {
			id: clerkUser.id,
			email: clerkUser.email_addresses?.[0]?.email_address,
			firstName: clerkUser.first_name,
			lastName: clerkUser.last_name,
		});

		// Обновляем или создаём пользователя в базе
		console.log('🔍 UserSyncService - Upserting user in database...');
		const user = await prisma.user.upsert({
			where: { clerkUserId },
			update: {
				email: clerkUser.email_addresses[0]?.email_address || null,
				firstName: clerkUser.first_name || null,
				lastName: clerkUser.last_name || null,
				imageUrl: clerkUser.image_url || null,
			},
			create: {
				clerkUserId: clerkUser.id,
				email: clerkUser.email_addresses[0]?.email_address || null,
				firstName: clerkUser.first_name || null,
				lastName: clerkUser.last_name || null,
				imageUrl: clerkUser.image_url || null,
			},
		});

		console.log('✅ UserSyncService - User synced successfully:', user.id);
		return { success: true, user };
	} catch (error) {
		console.error('❌ UserSyncService - Error syncing user:', error);
		return { error: 'Failed to sync user', details: error.message };
	}
};

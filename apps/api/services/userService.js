/* eslint-disable no-undef */
import prisma from '../lib/prisma.js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { Webhook } from 'svix';

dotenv.config({ path: '.env.local' });
dotenv.config();
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

console.log('🔍 UserService - CLERK_SECRET_KEY available:', !!CLERK_SECRET_KEY);
console.log(
	'🔍 UserService - CLERK_SECRET_KEY length:',
	CLERK_SECRET_KEY ? CLERK_SECRET_KEY.length : 0,
);

export const syncUserService = async (clerkUserId) => {
	if (!clerkUserId) return { error: 'Missing Clerk user ID' };

	try {
		console.log('🔍 UserService - Starting sync for clerkUserId:', clerkUserId);

		if (!CLERK_SECRET_KEY) {
			console.error('❌ UserService - CLERK_SECRET_KEY is missing');
			return { error: 'Clerk secret key is not configured' };
		}

		let user = await prisma.user.findUnique({ where: { clerkUserId } });

		if (!user) {
			console.log(
				'🔍 UserService - User not found in DB, fetching from Clerk...',
			);

			console.log(
				'🔍 UserService - Making API call to Clerk with key:',
				CLERK_SECRET_KEY.substring(0, 10) + '...',
			);

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
				'🔍 UserService - Clerk API response status:',
				response.status,
			);

			if (!response.ok) {
				const errorText = await response.text();
				console.error(
					'❌ UserService - Clerk API error:',
					response.status,
					errorText,
				);
				return {
					error: `Ошибка Clerk API: ${response.status} ${response.statusText}`,
				};
			}

			const clerkUser = await response.json();
			console.log('🔍 UserService - Clerk user data received:', {
				id: clerkUser.id,
				email: clerkUser.email_addresses?.[0]?.email_address,
				firstName: clerkUser.first_name,
				lastName: clerkUser.last_name,
			});

			user = await prisma.user.upsert({
				where: { clerkUserId: clerkUser.id }, // ✅ Add this
				update: {
					// ✅ Add this section
					email: clerkUser.email_addresses[0]?.email_address || null,
					firstName: clerkUser.first_name || null,
					lastName: clerkUser.last_name || null,
					imageUrl: clerkUser.image_url || null,
				},
				create: {
					// ✅ Add this section
					clerkUserId: clerkUser.id,
					email: clerkUser.email_addresses[0]?.email_address || null,
					firstName: clerkUser.first_name || null,
					lastName: clerkUser.last_name || null,
					imageUrl: clerkUser.image_url || null,
				},
			});

			console.log('✅ UserService - User created successfully:', user.id);
		} else {
			console.log('✅ UserService - User found in DB:', user.id);
		}

		return { success: true, user };
	} catch (error) {
		console.error('❌ UserService - Error syncing user:', error);
		return { error: 'Failed to sync user', details: error.message };
	}
};

export const getUserByClerkIdService = async (clerkUserId) => {
	try {
		const user = await prisma.user.findUnique({ where: { clerkUserId } });
		if (!user) return { error: 'Пользователь не найден' };
		return { user };
	} catch (error) {
		return { error: 'Ошибка получения пользователя', details: error.message };
	}
};

export const getUserJobsService = async (clerkUserId, query) => {
	const { page = 1, limit = 5 } = query;
	const pageInt = parseInt(page);
	const limitInt = parseInt(limit);
	const skip = (pageInt - 1) * limitInt;

	try {
		let user = await prisma.user.findUnique({ where: { clerkUserId } });

		if (!user) {
			const syncResult = await syncUserService(clerkUserId);
			if (syncResult.error) {
				return {
					error: 'Ошибка синхронизации пользователя',
					details: syncResult.error,
				};
			}
			user = syncResult.user;
		}

		const jobs = await prisma.job.findMany({
			where: { userId: user.id },
			include: {
				city: true,
				user: true,
				category: { include: { translations: true } },
			},
			skip,
			take: limitInt,
			orderBy: { createdAt: 'desc' },
		});

		const totalJobs = await prisma.job.count({ where: { userId: user.id } });

		return {
			jobs,
			totalJobs,
			totalPages: Math.ceil(totalJobs / limitInt),
			currentPage: pageInt,
		};
	} catch (error) {
		console.error('❌ Ошибка получения объявлений пользователя:', error);
		return { error: 'Ошибка сервера', details: error.message };
	}
};

// Обработка Clerk Webhook
export const handleClerkWebhookService = async (req) => {
	const svix_id = req.headers['svix-id'];
	const svix_timestamp = req.headers['svix-timestamp'];
	const svix_signature = req.headers['svix-signature'];

	if (!svix_id || !svix_timestamp || !svix_signature) {
		return { error: 'Missing Svix headers' };
	}

	try {
		const wh = new Webhook(WEBHOOK_SECRET);
		const evt = wh.verify(req.rawBody, {
			'svix-id': svix_id,
			'svix-timestamp': svix_timestamp,
			'svix-signature': svix_signature,
		});

		const userId = evt.data.id;

		if (evt.type === 'user.created' || evt.type === 'user.updated') {
			const email_addresses = evt.data.email_addresses;
			const first_name = evt.data.first_name;
			const last_name = evt.data.last_name;
			const image_url = evt.data.image_url;

			await prisma.user.upsert({
				where: { clerkUserId: userId },
				update: {
					email: email_addresses[0].email_address,
					firstName: first_name || null,
					lastName: last_name || null,
					imageUrl: image_url || null,
				},
				create: {
					clerkUserId: userId,
					email: email_addresses[0].email_address,
					firstName: first_name || null,
					lastName: last_name || null,
					imageUrl: image_url || null,
				},
			});
		}

		if (evt.type === 'user.deleted') {
			await prisma.user.delete({
				where: { clerkUserId: userId },
			});
		}

		return { success: true };
	} catch (err) {
		console.error('Webhook verification failed', err);
		return { error: 'Webhook verification failed' };
	}
};

import prisma from '../lib/prisma.js';
import stringSimilarity from 'string-similarity';
import redisService from './redisService.js';
import { containsBadWords, containsLinks } from '../middlewares/validation.js';
import { sendNewJobNotificationToTelegram } from '../utils/telegram.js';


const MAX_JOBS_FREE_USER = 5;
const MAX_JOBS_PREMIUM_USER = 10;

export const getJobsService = async (filters = {}) => {
	const {
		category,
		city,
		salary,
		shuttle,
		meals,
		page = 1,
		limit = 20,
	} = filters;

	try {
		const where = {};
		if (category) where.categoryId = parseInt(category);
		if (city) where.cityId = parseInt(city);
		if (shuttle) where.shuttle = true;
		if (meals) where.meals = true;

		const skip = (page - 1) * limit;

		const total = await prisma.job.count({ where });

		const jobs = await prisma.job.findMany({
			where,
			include: {
				city: true,
				user: true,
				category: { include: { translations: true } },
			},
			orderBy: [
				{ user: { isPremium: 'desc' } },
				{ boostedAt: { sort: 'desc', nulls: 'last' } },
				{ createdAt: 'desc' },
			],
			skip,
			take: limit,
		});

		let filteredJobs = jobs;
		if (salary) {
			const minSalary = parseInt(salary);
			filteredJobs = jobs.filter((job) => {
				const salaryMatch = job.salary.match(/(\d+)/);
				if (salaryMatch) {
					const jobSalary = parseInt(salaryMatch[1]);
					return jobSalary >= minSalary;
				}
				return false;
			});
		}

		return {
			jobs: filteredJobs,
			pagination: {
				page: parseInt(page),
				limit: parseInt(limit),
				total: total,
				pages: Math.ceil(total / limit),
			},
		};
	} catch (error) {
		console.error('❌ Error fetching jobs:', error);
		return { error: 'Ошибка получения объявлений', details: error.message };
	}
};

export const getJobByIdService = async (id) => {
	try {
		if (!id || isNaN(id)) {
			throw new Error('ID вакансии не передан или имеет неверный формат');
		}

		const cacheKey = `job:${id}`;
		const cachedJob = await redisService.get(cacheKey);

		if (cachedJob) {
			return cachedJob;
		}

		const job = await prisma.job.findUnique({
			where: { id: Number(id) },
			include: {
				city: true,
				category: { include: { translations: true } },
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

		await redisService.set(cacheKey, { job }, 600);

		return { job };
	} catch (error) {
		console.error('❌ Error fetching job:', error);
		return { error: 'Ошибка получения объявления', details: error.message };
	}
};

export const createJobService = async ({
	title,
	salary,
	cityId,
	categoryId,
	phone,
	description,
	userId,
	shuttle,
	meals,
	imageUrl,
}) => {
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

	const existingUser = await prisma.user.findUnique({
		where: { clerkUserId: userId },
		include: { jobs: { orderBy: { createdAt: 'desc' }, take: 1 } },
	});

	if (!existingUser) return { error: 'Пользователь не найден' };

	const existingJobs = await prisma.job.findMany({
		where: { userId: existingUser.id },
		select: { title: true, description: true },
	});

	const isDuplicate = existingJobs.some(
		(job) =>
			stringSimilarity.compareTwoStrings(job.title, title) > 0.9 &&
			stringSimilarity.compareTwoStrings(job.description, description) > 0.9,
	);

	if (isDuplicate)
		return {
			error:
				'Ваше объявление похоже на уже существующее. Измените заголовок или описание.',
		};

	const jobCount = await prisma.job.count({
		where: { userId: existingUser.id },
	});

	const isPremium = existingUser.isPremium || existingUser.premiumDeluxe;
	const maxJobs = isPremium ? MAX_JOBS_PREMIUM_USER : MAX_JOBS_FREE_USER;

	if (jobCount >= maxJobs) {
		if (isPremium) {
			return {
				error: `Вы уже разместили ${MAX_JOBS_PREMIUM_USER} объявлений.`,
			};
		}
		return {
			error: `Вы уже разместили ${MAX_JOBS_FREE_USER} объявлений. Для размещения большего количества объявлений перейдите на Premium тариф.`,
			upgradeRequired: true,
		};
	}

	const job = await prisma.job.create({
		data: {
			title,
			salary,
			phone,
			description,
			shuttle,
			meals,
			imageUrl,
			city: { connect: { id: parseInt(cityId) } },
			category: { connect: { id: parseInt(categoryId) } },
			user: { connect: { id: existingUser.id } },
		},
		include: { city: true, user: true, category: true },
	});

	await redisService.invalidateJobsCache();

	if (existingUser.isPremium) {
		await sendNewJobNotificationToTelegram(existingUser, job);
	}

	return { job };
};

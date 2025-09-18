import { vi } from 'vitest';

// Mock Prisma client
export const mockPrisma = {
	user: {
		findUnique: vi.fn(),
	},
	job: {
		findMany: vi.fn(),
		count: vi.fn(),
		create: vi.fn(),
	},
};

// Mock job creation data
export const mockJobCreationData = {
	validJobData: {
		title: 'Software Developer',
		salary: '120000',
		cityId: '1',
		categoryId: '2',
		phone: '123-456-7890',
		description: 'Develop and maintain software applications.',
		userId: 'clerk_user123',
		shuttle: true,
		meals: false,
		imageUrl: 'https://example.com/job-image.jpg',
	},
	
	jobDataWithBadWords: {
		title: 'Software Developer with bad words',
		salary: '120000',
		cityId: '1',
		categoryId: '2',
		phone: '123-456-7890',
		description: 'Develop and maintain software applications with inappropriate content.',
		userId: 'clerk_user123',
		shuttle: true,
		meals: false,
		imageUrl: 'https://example.com/job-image.jpg',
	},
	
	jobDataWithLinks: {
		title: 'Software Developer - Visit our website',
		salary: '120000',
		cityId: '1',
		categoryId: '2',
		phone: '123-456-7890',
		description: 'Develop and maintain software applications. Check out https://example.com for more info.',
		userId: 'clerk_user123',
		shuttle: true,
		meals: false,
		imageUrl: 'https://example.com/job-image.jpg',
	},
	
	jobDataWithoutImage: {
		title: 'Marketing Manager',
		salary: '80000',
		cityId: '2',
		categoryId: '3',
		phone: '098-765-4321',
		description: 'Manage marketing campaigns.',
		userId: 'clerk_user456',
		shuttle: false,
		meals: true,
		imageUrl: null,
	},
	
	jobDataWithMinimalFields: {
		title: 'Designer',
		salary: '75000',
		cityId: '3',
		categoryId: '4',
		phone: '111-222-3333',
		description: 'Create visual concepts.',
		userId: 'clerk_user789',
		shuttle: null,
		meals: null,
		imageUrl: undefined,
	},
};

// Mock user data
export const mockUserData = {
	freeUser: {
		id: 'user123',
		email: 'free@example.com',
		clerkUserId: 'clerk_user123',
		firstName: 'John',
		lastName: 'Doe',
		isPremium: false,
		premiumDeluxe: false,
		jobs: [],
	},
	
	premiumUser: {
		id: 'user456',
		email: 'premium@example.com',
		clerkUserId: 'clerk_user456',
		firstName: 'Jane',
		lastName: 'Smith',
		isPremium: true,
		premiumDeluxe: false,
		jobs: [],
	},
	
	premiumDeluxeUser: {
		id: 'user789',
		email: 'premiumdeluxe@example.com',
		clerkUserId: 'clerk_user789',
		firstName: 'Bob',
		lastName: 'Johnson',
		isPremium: false,
		premiumDeluxe: true,
		jobs: [],
	},
	
	userAtFreeLimit: {
		id: 'user_limit',
		email: 'limit@example.com',
		clerkUserId: 'clerk_user_limit',
		firstName: 'Limit',
		lastName: 'User',
		isPremium: false,
		premiumDeluxe: false,
		jobs: [
			{ id: 1, title: 'Job 1', createdAt: new Date('2024-01-01') },
			{ id: 2, title: 'Job 2', createdAt: new Date('2024-01-02') },
			{ id: 3, title: 'Job 3', createdAt: new Date('2024-01-03') },
			{ id: 4, title: 'Job 4', createdAt: new Date('2024-01-04') },
			{ id: 5, title: 'Job 5', createdAt: new Date('2024-01-05') },
		],
	},
	
	userAtPremiumLimit: {
		id: 'user_premium_limit',
		email: 'premiumlimit@example.com',
		clerkUserId: 'clerk_user_premium_limit',
		firstName: 'Premium',
		lastName: 'Limit',
		isPremium: true,
		premiumDeluxe: false,
		jobs: Array.from({ length: 10 }, (_, i) => ({
			id: i + 1,
			title: `Premium Job ${i + 1}`,
			createdAt: new Date(`2024-01-${String(i + 1).padStart(2, '0')}`),
		})),
	},
	
	userWithDuplicateJobs: {
		id: 'user_duplicate',
		email: 'duplicate@example.com',
		clerkUserId: 'clerk_user_duplicate',
		firstName: 'Duplicate',
		lastName: 'User',
		isPremium: false,
		premiumDeluxe: false,
		jobs: [],
	},
	
	nonexistentUser: null,
};

// Mock existing jobs for duplicate detection
export const mockExistingJobs = {
	similarJobs: [
		{
			title: 'Software Developer',
			description: 'Develop and maintain software applications.',
		},
		{
			title: 'Senior Software Developer',
			description: 'Develop and maintain complex software applications.',
		},
	],
	
	differentJobs: [
		{
			title: 'Marketing Manager',
			description: 'Manage marketing campaigns.',
		},
		{
			title: 'Designer',
			description: 'Create visual concepts.',
		},
	],
	
	emptyJobs: [],
};

// Mock job limits
export const mockJobLimits = {
	MAX_JOBS_FREE_USER: 5,
	MAX_JOBS_PREMIUM_USER: 10,
};

// Mock created job
export const mockCreatedJob = {
	id: 1,
	title: 'Software Developer',
	salary: '120000',
	phone: '123-456-7890',
	description: 'Develop and maintain software applications.',
	shuttle: true,
	meals: false,
	imageUrl: 'https://example.com/job-image.jpg',
	city: {
		id: 1,
		name: 'Tel Aviv',
	},
	category: {
		id: 2,
		name: 'IT',
	},
	user: {
		id: 'user123',
		email: 'free@example.com',
		clerkUserId: 'clerk_user123',
		firstName: 'John',
		lastName: 'Doe',
		isPremium: false,
		premiumDeluxe: false,
	},
	createdAt: new Date('2024-01-01T12:00:00Z'),
};

// Mock string similarity results
export const mockStringSimilarity = {
	highSimilarity: 0.95,
	mediumSimilarity: 0.7,
	lowSimilarity: 0.3,
	identical: 1.0,
	different: 0.0,
};

// Mock validation functions
export const mockValidationFunctions = {
	containsBadWords: vi.fn(),
	containsLinks: vi.fn(),
};

// Mock Telegram notification function
export const mockTelegramNotification = {
	sendNewJobNotificationToTelegram: vi.fn(),
};

// Mock errors
export const mockErrors = {
	databaseError: new Error('Database connection failed'),
	prismaError: new Error('Prisma query failed'),
	timeoutError: new Error('Request timeout'),
	validationError: new Error('Validation failed'),
	permissionError: new Error('Access denied'),
	networkError: new Error('Network error'),
};

// Mock error messages
export const mockErrorMessages = {
	userNotFound: 'Пользователь не найден',
	duplicateJob: 'Ваше объявление похоже на уже существующее. Измените заголовок или описание.',
	freeUserLimit: 'Вы уже разместили 5 объявлений. Для размещения большего количества объявлений перейдите на Premium тариф.',
	premiumUserLimit: 'Вы уже разместили 10 объявлений.',
	badWordsTitle: 'Заголовок содержит нецензурные слова.',
	badWordsDescription: 'Описание содержит нецензурные слова.',
	linksTitle: 'Заголовок содержит запрещенные ссылки.',
	linksDescription: 'Описание содержит запрещенные ссылки.',
};

// Mock success messages
export const mockSuccessMessages = {
	jobCreated: 'Job created successfully',
};

// Mock console logging data
export const mockConsoleLogData = {
	creatingJob: '🔍 createJobService - Creating job with imageUrl:',
	fullDataObject: '🔍 createJobService - Full data object:',
	jobCreatedSuccessfully: '🔍 createJobService - Job created successfully:',
};

// Mock service responses
export const mockServiceResponses = {
	success: {
		job: mockCreatedJob,
	},
	
	validationErrors: {
		errors: [
			'Заголовок содержит нецензурные слова.',
			'Описание содержит запрещенные ссылки.',
		],
	},
	
	userNotFound: {
		error: mockErrorMessages.userNotFound,
	},
	
	duplicateJob: {
		error: mockErrorMessages.duplicateJob,
	},
	
	freeUserLimit: {
		error: mockErrorMessages.freeUserLimit,
		upgradeRequired: true,
	},
	
	premiumUserLimit: {
		error: mockErrorMessages.premiumUserLimit,
	},
};

// Mock Prisma query options
export const mockPrismaQueryOptions = {
	findUnique: {
		where: { clerkUserId: 'clerk_user123' },
		include: { jobs: { orderBy: { createdAt: 'desc' }, take: 1 } },
	},
	
	findMany: {
		where: { userId: 'user123' },
		select: { title: true, description: true },
	},
	
	count: {
		where: { userId: 'user123' },
	},
	
	create: {
		data: {
			title: 'Software Developer',
			salary: '120000',
			phone: '123-456-7890',
			description: 'Develop and maintain software applications.',
			shuttle: true,
			meals: false,
			imageUrl: 'https://example.com/job-image.jpg',
			city: { connect: { id: 1 } },
			category: { connect: { id: 2 } },
			user: { connect: { id: 'user123' } },
		},
		include: { city: true, user: true, category: true },
	},
};

// Mock data type conversions
export const mockDataConversions = {
	parseInt: {
		cityId: 1,
		categoryId: 2,
	},
	
	boolean: {
		shuttle: true,
		meals: false,
	},
	
	string: {
		title: 'Software Developer',
		salary: '120000',
		phone: '123-456-7890',
		description: 'Develop and maintain software applications.',
	},
};

// Reset mocks before each test
export const resetJobCreateMocks = () => {
	mockPrisma.user.findUnique.mockClear();
	mockPrisma.job.findMany.mockClear();
	mockPrisma.job.count.mockClear();
	mockPrisma.job.create.mockClear();
	mockValidationFunctions.containsBadWords.mockClear();
	mockValidationFunctions.containsLinks.mockClear();
	mockTelegramNotification.sendNewJobNotificationToTelegram.mockClear();
	vi.clearAllMocks();
};

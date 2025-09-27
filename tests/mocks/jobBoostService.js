import { vi } from 'vitest';

// Mock Prisma client
export const mockPrisma = {
	job: {
		findUnique: vi.fn(),
		update: vi.fn(),
	},
};

// Mock job data
export const mockJobData = {
	validJob: {
		id: 1,
		title: 'Software Developer',
		description: 'Develop and maintain software applications.',
		salary: 120000,
		cityId: 1,
		categoryId: 2,
		userId: 'user123',
		phone: '123-456-7890',
		status: 'ACTIVE',
		boostedAt: null,
		user: {
			id: 'user123',
			email: 'user@example.com',
			clerkUserId: 'clerk_user123',
			firstName: 'John',
			lastName: 'Doe',
			isPremium: true,
		},
	},

	jobWithRecentBoost: {
		id: 2,
		title: 'Marketing Manager',
		description: 'Manage marketing campaigns.',
		salary: 80000,
		cityId: 2,
		categoryId: 3,
		userId: 'user456',
		phone: '098-765-4321',
		status: 'ACTIVE',
		boostedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
		user: {
			id: 'user456',
			email: 'marketing@example.com',
			clerkUserId: 'clerk_user456',
			firstName: 'Jane',
			lastName: 'Smith',
			isPremium: true,
		},
	},

	jobWithOldBoost: {
		id: 3,
		title: 'Designer',
		description: 'Create visual concepts.',
		salary: 75000,
		cityId: 3,
		categoryId: 4,
		userId: 'user789',
		phone: '111-222-3333',
		status: 'ACTIVE',
		boostedAt: new Date(Date.now() - 25 * 60 * 60 * 1000), // 25 hours ago
		user: {
			id: 'user789',
			email: 'designer@example.com',
			clerkUserId: 'clerk_user789',
			firstName: 'Bob',
			lastName: 'Johnson',
			isPremium: true,
		},
	},

	jobWithoutUser: {
		id: 4,
		title: 'Orphaned Job',
		description: 'This job has no user.',
		salary: 50000,
		cityId: 4,
		categoryId: 5,
		userId: 'nonexistent_user',
		phone: '444-555-6666',
		status: 'ACTIVE',
		boostedAt: null,
		user: null,
	},

	nullJob: null,
};

// Mock boosted job result
export const mockBoostedJob = {
	id: 1,
	title: 'Software Developer',
	description: 'Develop and maintain software applications.',
	salary: 120000,
	cityId: 1,
	categoryId: 2,
	userId: 'user123',
	phone: '123-456-7890',
	status: 'ACTIVE',
	boostedAt: new Date('2024-01-01T12:00:00Z'),
};

// Mock time constants
export const mockTimeConstants = {
	ONE_DAY: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
	ONE_HOUR: 60 * 60 * 1000, // 1 hour in milliseconds
	ONE_MINUTE: 60 * 1000, // 1 minute in milliseconds
};

// Mock time scenarios
export const mockTimeScenarios = {
	justBoosted: {
		boostedAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
		expectedHoursLeft: 23,
		expectedMinutesLeft: 55,
	},

	oneHourAgo: {
		boostedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
		expectedHoursLeft: 23,
		expectedMinutesLeft: 0,
	},

	twelveHoursAgo: {
		boostedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
		expectedHoursLeft: 12,
		expectedMinutesLeft: 0,
	},

	twentyThreeHoursAgo: {
		boostedAt: new Date(Date.now() - 23 * 60 * 60 * 1000), // 23 hours ago
		expectedHoursLeft: 1,
		expectedMinutesLeft: 0,
	},

	twentyThreeHoursThirtyMinutesAgo: {
		boostedAt: new Date(Date.now() - (23 * 60 * 60 + 30 * 60) * 1000), // 23 hours 30 minutes ago
		expectedHoursLeft: 0,
		expectedMinutesLeft: 30,
	},

	moreThanOneDayAgo: {
		boostedAt: new Date(Date.now() - 25 * 60 * 60 * 1000), // 25 hours ago
		expectedHoursLeft: 0,
		expectedMinutesLeft: 0,
	},
};

// Mock job IDs
export const mockJobIds = {
	validIds: {
		string: '1',
		number: 1,
		largeNumber: 999999,
	},

	invalidIds: {
		null: null,
		undefined: undefined,
		empty: '',
		zero: 0,
		negative: -1,
		nonNumeric: 'abc',
		float: 1.5,
		boolean: true,
		object: {},
		array: [],
	},
};

// Mock Prisma query options
export const mockPrismaQueryOptions = {
	findUnique: {
		where: { id: 1 },
		include: { user: true },
	},

	update: {
		where: { id: 1 },
		data: { boostedAt: expect.any(Date) },
	},
};

// Mock errors
export const mockErrors = {
	databaseError: new Error('Database connection failed'),
	prismaError: new Error('Prisma query failed'),
	timeoutError: new Error('Request timeout'),
	validationError: new Error('Invalid job ID'),
	permissionError: new Error('Access denied'),
	networkError: new Error('Network error'),
};

// Mock error messages
export const mockErrorMessages = {
	jobNotFound: 'Объявление не найдено',
	userNotFound: 'Пользователь не найден',
	boostError: 'Ошибка поднятия вакансии',
};

// Mock success messages
export const mockSuccessMessages = {
	boostedSuccessfully: 'Job boosted successfully',
};

// Mock console logging data
export const mockConsoleLogData = {
	errorMessage: 'Error boosting job:',
	successMessage: 'Job boosted successfully:',
	cooldownMessage: 'Job boost cooldown active:',
};

// Mock boost cooldown messages
export const mockCooldownMessages = {
	oneHourLeft: 'Вы сможете поднять вакансию через 1 ч 0 м.',
	twelveHoursLeft: 'Вы сможете поднять вакансию через 12 ч 0 м.',
	thirtyMinutesLeft: 'Вы сможете поднять вакансию через 0 ч 30 м.',
	oneMinuteLeft: 'Вы сможете поднять вакансию через 0 ч 1 м.',
};

// Mock service responses
export const mockServiceResponses = {
	success: {
		boostedJob: mockBoostedJob,
	},

	jobNotFound: {
		error: mockErrorMessages.jobNotFound,
	},

	userNotFound: {
		error: mockErrorMessages.userNotFound,
	},

	cooldownActive: {
		error: mockCooldownMessages.oneHourLeft,
	},

	databaseError: {
		error: mockErrorMessages.boostError,
		details: 'Database connection failed',
	},
};

// Reset mocks before each test
export const resetJobBoostMocks = () => {
	mockPrisma.job.findUnique.mockClear();
	mockPrisma.job.update.mockClear();
	vi.clearAllMocks();
};

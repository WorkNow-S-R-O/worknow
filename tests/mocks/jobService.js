import { vi } from 'vitest';

// Mock Prisma client
export const mockPrisma = {
	job: {
		count: vi.fn(),
		findMany: vi.fn(),
		findUnique: vi.fn(),
		create: vi.fn(),
	},
};

// Mock Redis service
export const mockRedisService = {
	get: vi.fn(),
	set: vi.fn(),
	invalidateJobsCache: vi.fn(),
};

// Mock job filters
export const mockJobFilters = {
	noFilters: {},
	
	withCategory: {
		category: '1',
		page: 1,
		limit: 20,
	},
	
	withCity: {
		city: '2',
		page: 1,
		limit: 20,
	},
	
	withSalary: {
		salary: '50',
		page: 1,
		limit: 20,
	},
	
	withShuttle: {
		shuttle: true,
		page: 1,
		limit: 20,
	},
	
	withMeals: {
		meals: true,
		page: 1,
		limit: 20,
	},
	
	withAllFilters: {
		category: '1',
		city: '2',
		salary: '50',
		shuttle: true,
		meals: true,
		page: 1,
		limit: 20,
	},
	
	withPagination: {
		page: 2,
		limit: 10,
	},
	
	withCustomLimit: {
		page: 1,
		limit: 50,
	},
	
	withInvalidFilters: {
		category: 'invalid',
		city: 'invalid',
		salary: 'invalid',
		page: 0,
		limit: -1,
	},
};

// Mock job data
export const mockJobData = {
	jobWithAllFields: {
		id: 1,
		title: 'Software Developer',
		description: 'Develop and maintain software applications.',
		salary: '120 шек/час',
		cityId: 1,
		categoryId: 2,
		userId: 'user123',
		phone: '123-456-7890',
		status: 'ACTIVE',
		shuttle: true,
		meals: false,
		imageUrl: 'https://example.com/job-image.jpg',
		boostedAt: new Date('2024-01-01T12:00:00Z'),
		createdAt: new Date('2024-01-01T10:00:00Z'),
		city: {
			id: 1,
			name: 'Tel Aviv',
		},
		user: {
			id: 'user123',
			email: 'user@example.com',
			clerkUserId: 'clerk_user123',
			firstName: 'John',
			lastName: 'Doe',
			isPremium: true,
			premiumDeluxe: false,
		},
		category: {
			id: 2,
			name: 'IT',
			translations: [
				{ lang: 'ru', name: 'IT' },
				{ lang: 'en', name: 'Information Technology' },
			],
		},
	},
	
	jobWithMinimalFields: {
		id: 2,
		title: 'Marketing Manager',
		description: 'Manage marketing campaigns.',
		salary: '80 шек/час',
		cityId: 2,
		categoryId: 3,
		userId: 'user456',
		phone: '098-765-4321',
		status: 'ACTIVE',
		shuttle: false,
		meals: true,
		imageUrl: null,
		boostedAt: null,
		createdAt: new Date('2024-01-02T10:00:00Z'),
		city: {
			id: 2,
			name: 'Jerusalem',
		},
		user: {
			id: 'user456',
			email: 'marketing@example.com',
			clerkUserId: 'clerk_user456',
			firstName: 'Jane',
			lastName: 'Smith',
			isPremium: false,
			premiumDeluxe: false,
		},
		category: {
			id: 3,
			name: 'Marketing',
			translations: [
				{ lang: 'ru', name: 'Маркетинг' },
				{ lang: 'en', name: 'Marketing' },
			],
		},
	},
	
	jobWithHighSalary: {
		id: 3,
		title: 'Senior Developer',
		description: 'Lead development team.',
		salary: '150 шек/час',
		cityId: 3,
		categoryId: 2,
		userId: 'user789',
		phone: '111-222-3333',
		status: 'ACTIVE',
		shuttle: true,
		meals: true,
		imageUrl: 'https://example.com/senior-dev.jpg',
		boostedAt: new Date('2024-01-03T12:00:00Z'),
		createdAt: new Date('2024-01-03T10:00:00Z'),
		city: {
			id: 3,
			name: 'Haifa',
		},
		user: {
			id: 'user789',
			email: 'senior@example.com',
			clerkUserId: 'clerk_user789',
			firstName: 'Bob',
			lastName: 'Johnson',
			isPremium: true,
			premiumDeluxe: true,
		},
		category: {
			id: 2,
			name: 'IT',
			translations: [
				{ lang: 'ru', name: 'IT' },
				{ lang: 'en', name: 'Information Technology' },
			],
		},
	},
	
	jobWithLowSalary: {
		id: 4,
		title: 'Junior Developer',
		description: 'Entry level development work.',
		salary: '30 шек/час',
		cityId: 1,
		categoryId: 2,
		userId: 'user101',
		phone: '444-555-6666',
		status: 'ACTIVE',
		shuttle: false,
		meals: false,
		imageUrl: null,
		boostedAt: null,
		createdAt: new Date('2024-01-04T10:00:00Z'),
		city: {
			id: 1,
			name: 'Tel Aviv',
		},
		user: {
			id: 'user101',
			email: 'junior@example.com',
			clerkUserId: 'clerk_user101',
			firstName: 'Alice',
			lastName: 'Brown',
			isPremium: false,
			premiumDeluxe: false,
		},
		category: {
			id: 2,
			name: 'IT',
			translations: [
				{ lang: 'ru', name: 'IT' },
				{ lang: 'en', name: 'Information Technology' },
			],
		},
	},
	
	jobWithSpecialSalary: {
		id: 5,
		title: 'Designer',
		description: 'Create visual concepts.',
		salary: '45-60 шек/час',
		cityId: 2,
		categoryId: 4,
		userId: 'user202',
		phone: '777-888-9999',
		status: 'ACTIVE',
		shuttle: true,
		meals: true,
		imageUrl: 'https://example.com/designer.jpg',
		boostedAt: null,
		createdAt: new Date('2024-01-05T10:00:00Z'),
		city: {
			id: 2,
			name: 'Jerusalem',
		},
		user: {
			id: 'user202',
			email: 'designer@example.com',
			clerkUserId: 'clerk_user202',
			firstName: 'Charlie',
			lastName: 'Wilson',
			isPremium: false,
			premiumDeluxe: false,
		},
		category: {
			id: 4,
			name: 'Design',
			translations: [
				{ lang: 'ru', name: 'Дизайн' },
				{ lang: 'en', name: 'Design' },
			],
		},
	},
	
	nullJob: null,
};

// Mock job arrays for different scenarios
export const mockJobArrays = {
	emptyJobs: [],
	
	singleJob: [mockJobData.jobWithAllFields],
	
	multipleJobs: [
		mockJobData.jobWithAllFields,
		mockJobData.jobWithMinimalFields,
		mockJobData.jobWithHighSalary,
		mockJobData.jobWithLowSalary,
		mockJobData.jobWithSpecialSalary,
	],
	
	jobsWithPremiumFirst: [
		mockJobData.jobWithHighSalary, // Premium user
		mockJobData.jobWithAllFields, // Premium user
		mockJobData.jobWithMinimalFields, // Free user
		mockJobData.jobWithLowSalary, // Free user
	],
	
	jobsWithBoostedFirst: [
		mockJobData.jobWithAllFields, // Has boostedAt
		mockJobData.jobWithHighSalary, // Has boostedAt
		mockJobData.jobWithMinimalFields, // No boostedAt
		mockJobData.jobWithLowSalary, // No boostedAt
	],
	
	jobsFilteredBySalary: [
		mockJobData.jobWithHighSalary, // 150 шек/час
		mockJobData.jobWithAllFields, // 120 шек/час
		mockJobData.jobWithSpecialSalary, // 45-60 шек/час (takes 45)
	],
};

// Mock pagination data
export const mockPaginationData = {
	totalCount: 100,
	page1Limit20: {
		page: 1,
		limit: 20,
		total: 100,
		pages: 5,
	},
	
	page2Limit10: {
		page: 2,
		limit: 10,
		total: 100,
		pages: 10,
	},
	
	page3Limit50: {
		page: 3,
		limit: 50,
		total: 100,
		pages: 2,
	},
	
	emptyResults: {
		page: 1,
		limit: 20,
		total: 0,
		pages: 0,
	},
};

// Mock Redis cache data
export const mockRedisCacheData = {
	cachedJobs: {
		jobs: mockJobArrays.multipleJobs,
		pagination: mockPaginationData.page1Limit20,
	},
	
	cachedJob: {
		job: mockJobData.jobWithAllFields,
	},
	
	cacheKeys: {
		jobs: 'jobs:all:all:all:all:all:1:20',
		jobById: 'job:1',
	},
	
	cacheExpiration: {
		jobs: 300, // 5 minutes
		jobById: 600, // 10 minutes
	},
};

// Mock salary filtering data
export const mockSalaryFilteringData = {
	salaryPatterns: {
		singleNumber: '120 шек/час',
		range: '45-60 шек/час',
		withText: 'от 50 шек/час',
		invalid: 'invalid salary',
		empty: '',
	},
	
	salaryExtractions: {
		singleNumber: 120,
		range: 45,
		withText: 50,
		invalid: null,
		empty: null,
	},
	
	filterResults: {
		minSalary50: [
			mockJobData.jobWithHighSalary, // 150
			mockJobData.jobWithAllFields, // 120
			mockJobData.jobWithSpecialSalary, // 45-60 (takes 45)
		],
		minSalary100: [
			mockJobData.jobWithHighSalary, // 150
			mockJobData.jobWithAllFields, // 120
		],
		minSalary200: [], // No jobs meet this criteria
	},
};

// Mock Prisma query options
export const mockPrismaQueryOptions = {
	count: {
		where: {},
	},
	
	findMany: {
		where: {},
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
		skip: 0,
		take: 20,
	},
	
	findUnique: {
		where: { id: 1 },
		include: {
			city: true,
			user: true,
			category: { include: { translations: true } },
		},
	},
	
	create: {
		data: {},
		include: {
			city: true,
			user: true,
			category: { include: { translations: true } },
		},
	},
};

// Mock errors
export const mockErrors = {
	databaseError: new Error('Database connection failed'),
	prismaError: new Error('Prisma query failed'),
	timeoutError: new Error('Request timeout'),
	validationError: new Error('Validation failed'),
	permissionError: new Error('Access denied'),
	networkError: new Error('Network error'),
	redisError: new Error('Redis connection failed'),
	cacheError: new Error('Cache operation failed'),
};

// Mock error messages
export const mockErrorMessages = {
	jobsError: 'Ошибка получения объявлений',
	jobError: 'Ошибка получения объявления',
	jobNotFound: 'Вакансия не найдена',
	createError: 'Ошибка создания объявления',
};

// Mock success messages
export const mockSuccessMessages = {
	jobsRetrieved: 'Jobs retrieved successfully',
	jobRetrieved: 'Job retrieved successfully',
	jobCreated: 'Job created successfully',
	cacheHit: 'Data served from cache',
	cacheSet: 'Data cached successfully',
	cacheInvalidated: 'Cache invalidated successfully',
};

// Mock console logging data
export const mockConsoleLogData = {
	jobsError: '❌ Error fetching jobs:',
	jobError: '❌ Error fetching job:',
	createError: '❌ Error creating job:',
	cacheHit: 'Jobs served from Redis cache',
	cacheSet: 'Jobs cached in Redis for 5 minutes',
	jobCacheHit: 'Job served from Redis cache',
	jobCacheSet: 'Job cached in Redis for 10 minutes',
	cacheInvalidated: 'Job caches invalidated after new job creation',
};

// Mock service responses
export const mockServiceResponses = {
	jobsSuccess: {
		jobs: mockJobArrays.multipleJobs,
		pagination: mockPaginationData.page1Limit20,
	},
	
	jobSuccess: {
		job: mockJobData.jobWithAllFields,
	},
	
	jobsError: {
		error: mockErrorMessages.jobsError,
		details: 'Database connection failed',
	},
	
	jobError: {
		error: mockErrorMessages.jobError,
		details: 'Database connection failed',
	},
	
	jobNotFound: {
		error: mockErrorMessages.jobNotFound,
	},
	
	createSuccess: mockJobData.jobWithAllFields,
};

// Mock data type conversions
export const mockDataConversions = {
	parseInt: {
		category: 1,
		city: 2,
		salary: 50,
		page: 1,
		limit: 20,
	},
	
	boolean: {
		shuttle: true,
		meals: false,
	},
	
	string: {
		title: 'Software Developer',
		salary: '120 шек/час',
		description: 'Develop and maintain software applications.',
	},
};

// Mock job ordering logic
export const mockJobOrderingLogic = {
	premiumFirst: (jobs) => {
		return jobs.sort((a, b) => {
			if (a.user.isPremium && !b.user.isPremium) return -1;
			if (!a.user.isPremium && b.user.isPremium) return 1;
			return 0;
		});
	},
	
	boostedFirst: (jobs) => {
		return jobs.sort((a, b) => {
			if (a.boostedAt && !b.boostedAt) return -1;
			if (!a.boostedAt && b.boostedAt) return 1;
			return 0;
		});
	},
	
	createdAtDesc: (jobs) => {
		return jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
	},
};

// Mock salary extraction logic
export const mockSalaryExtractionLogic = {
	extractSalary: (salaryString) => {
		const match = salaryString.match(/(\d+)/);
		return match ? parseInt(match[1]) : null;
	},
	
	filterBySalary: (jobs, minSalary) => {
		return jobs.filter((job) => {
			const salaryMatch = job.salary.match(/(\d+)/);
			if (salaryMatch) {
				const jobSalary = parseInt(salaryMatch[1]);
				return jobSalary >= minSalary;
			}
			return false;
		});
	},
};

// Reset mocks before each test
export const resetJobServiceMocks = () => {
	mockPrisma.job.count.mockClear();
	mockPrisma.job.findMany.mockClear();
	mockPrisma.job.findUnique.mockClear();
	mockPrisma.job.create.mockClear();
	mockRedisService.get.mockClear();
	mockRedisService.set.mockClear();
	mockRedisService.invalidateJobsCache.mockClear();
	vi.clearAllMocks();
};

import { vi } from 'vitest';

// Mock Prisma client
export const mockPrisma = {
	job: {
		findUnique: vi.fn(),
		delete: vi.fn(),
		findMany: vi.fn(),
	},
};

// Mock job data
export const mockJobData = {
	jobWithImage: {
		id: 1,
		title: 'Software Developer',
		description: 'Develop and maintain software applications.',
		salary: '120000',
		cityId: 1,
		categoryId: 2,
		userId: 'user123',
		phone: '123-456-7890',
		status: 'ACTIVE',
		imageUrl: 'https://s3.amazonaws.com/bucket/job-image.jpg',
		user: {
			id: 'user123',
			email: 'user@example.com',
			clerkUserId: 'clerk_user123',
			firstName: 'John',
			lastName: 'Doe',
			isPremium: true,
			premiumDeluxe: false,
		},
	},

	jobWithoutImage: {
		id: 2,
		title: 'Marketing Manager',
		description: 'Manage marketing campaigns.',
		salary: '80000',
		cityId: 2,
		categoryId: 3,
		userId: 'user456',
		phone: '098-765-4321',
		status: 'ACTIVE',
		imageUrl: null,
		user: {
			id: 'user456',
			email: 'marketing@example.com',
			clerkUserId: 'clerk_user456',
			firstName: 'Jane',
			lastName: 'Smith',
			isPremium: false,
			premiumDeluxe: false,
		},
	},

	jobWithUndefinedImage: {
		id: 3,
		title: 'Designer',
		description: 'Create visual concepts.',
		salary: '75000',
		cityId: 3,
		categoryId: 4,
		userId: 'user789',
		phone: '111-222-3333',
		status: 'ACTIVE',
		imageUrl: undefined,
		user: {
			id: 'user789',
			email: 'designer@example.com',
			clerkUserId: 'clerk_user789',
			firstName: 'Bob',
			lastName: 'Johnson',
			isPremium: false,
			premiumDeluxe: true,
		},
	},

	jobWithEmptyImage: {
		id: 4,
		title: 'Manager',
		description: 'Manage team and projects.',
		salary: '90000',
		cityId: 4,
		categoryId: 5,
		userId: 'user101',
		phone: '444-555-6666',
		status: 'ACTIVE',
		imageUrl: '',
		user: {
			id: 'user101',
			email: 'manager@example.com',
			clerkUserId: 'clerk_user101',
			firstName: 'Alice',
			lastName: 'Brown',
			isPremium: true,
			premiumDeluxe: false,
		},
	},

	jobOwnedByDifferentUser: {
		id: 5,
		title: 'Unauthorized Job',
		description: 'This job belongs to another user.',
		salary: '60000',
		cityId: 5,
		categoryId: 6,
		userId: 'user999',
		phone: '777-888-9999',
		status: 'ACTIVE',
		imageUrl: 'https://s3.amazonaws.com/bucket/unauthorized-image.jpg',
		user: {
			id: 'user999',
			email: 'other@example.com',
			clerkUserId: 'clerk_user999',
			firstName: 'Other',
			lastName: 'User',
			isPremium: false,
			premiumDeluxe: false,
		},
	},

	nullJob: null,
};

// Mock user IDs
export const mockUserIds = {
	validUserIds: {
		owner: 'clerk_user123',
		different: 'clerk_user456',
		premium: 'clerk_user789',
		premiumDeluxe: 'clerk_user101',
	},

	invalidUserIds: {
		null: null,
		undefined: undefined,
		empty: '',
		whitespace: '   ',
		nonString: 123,
		boolean: true,
		object: {},
		array: [],
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

// Mock S3 operations
export const mockS3Operations = {
	deleteFromS3: vi.fn(),
};

// Mock S3 responses
export const mockS3Responses = {
	success: true,
	failure: false,
	error: new Error('S3 deletion failed'),
};

// Mock Telegram notification function
export const mockTelegramNotification = {
	sendUpdatedJobListToTelegram: vi.fn(),
};

// Mock user jobs for Telegram notification
export const mockUserJobs = [
	{
		id: 1,
		title: 'Software Developer',
		description: 'Develop and maintain software applications.',
		salary: '120000',
		cityId: 1,
		categoryId: 2,
		userId: 'user123',
		phone: '123-456-7890',
		status: 'ACTIVE',
		imageUrl: 'https://s3.amazonaws.com/bucket/job-image.jpg',
		city: {
			id: 1,
			name: 'Tel Aviv',
		},
	},
	{
		id: 2,
		title: 'Marketing Manager',
		description: 'Manage marketing campaigns.',
		salary: '80000',
		cityId: 2,
		categoryId: 3,
		userId: 'user123',
		phone: '098-765-4321',
		status: 'ACTIVE',
		imageUrl: null,
		city: {
			id: 2,
			name: 'Jerusalem',
		},
	},
];

// Mock errors
export const mockErrors = {
	databaseError: new Error('Database connection failed'),
	prismaError: new Error('Prisma query failed'),
	timeoutError: new Error('Request timeout'),
	validationError: new Error('Validation failed'),
	permissionError: new Error('Access denied'),
	networkError: new Error('Network error'),
	s3Error: new Error('S3 operation failed'),
	telegramError: new Error('Telegram notification failed'),
};

// Mock error messages
export const mockErrorMessages = {
	jobNotFound: 'Объявление не найдено',
	unauthorized: 'У вас нет прав для удаления этого объявления',
	deleteError: 'Ошибка удаления объявления',
};

// Mock success messages
export const mockSuccessMessages = {
	jobDeleted: 'Job deleted successfully',
	imageDeleted: 'Image deleted from S3 successfully',
	telegramSent: 'Telegram notification sent successfully',
};

// Mock console logging data
export const mockConsoleLogData = {
	s3DeletionWarning:
		'⚠️ deleteJobService - Failed to delete image from S3, but continuing with job deletion',
	s3DeletionError: '❌ deleteJobService - Error deleting image from S3:',
};

// Mock service responses
export const mockServiceResponses = {
	success: {},

	jobNotFound: {
		error: mockErrorMessages.jobNotFound,
	},

	unauthorized: {
		error: mockErrorMessages.unauthorized,
	},

	deleteError: {
		error: mockErrorMessages.deleteError,
		details: 'Database connection failed',
	},
};

// Mock Prisma query options
export const mockPrismaQueryOptions = {
	findUnique: {
		where: { id: 1 },
		include: { user: true },
	},

	delete: {
		where: { id: 1 },
	},

	findMany: {
		where: { userId: 'user123' },
		include: { city: true },
	},
};

// Mock data type conversions
export const mockDataConversions = {
	parseInt: {
		jobId: 1,
	},

	boolean: {
		hasImage: true,
		noImage: false,
	},

	string: {
		imageUrl: 'https://s3.amazonaws.com/bucket/job-image.jpg',
		emptyImageUrl: '',
	},
};

// Mock authorization logic
export const mockAuthorizationLogic = {
	checkOwnership: (jobUserId, requestUserId) => {
		return jobUserId === requestUserId;
	},

	isAuthorized: (job, userId) => {
		return job.user.clerkUserId === userId;
	},
};

// Mock S3 image URLs
export const mockS3ImageUrls = {
	validUrl: 'https://s3.amazonaws.com/bucket/job-image.jpg',
	invalidUrl: 'not-a-valid-url',
	emptyUrl: '',
	nullUrl: null,
	undefinedUrl: undefined,
};

// Reset mocks before each test
export const resetJobDeleteMocks = () => {
	mockPrisma.job.findUnique.mockClear();
	mockPrisma.job.delete.mockClear();
	mockPrisma.job.findMany.mockClear();
	mockS3Operations.deleteFromS3.mockClear();
	mockTelegramNotification.sendUpdatedJobListToTelegram.mockClear();
	vi.clearAllMocks();
};

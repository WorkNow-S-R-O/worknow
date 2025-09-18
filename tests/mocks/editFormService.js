import { vi } from 'vitest';

// Mock Prisma client
export const mockPrisma = {
	job: {
		findUnique: vi.fn(),
		update: vi.fn(),
		findMany: vi.fn(),
	},
};

// Mock validation functions
export const mockValidation = {
	containsBadWords: vi.fn(),
	containsLinks: vi.fn(),
};

// Mock Telegram utility
export const mockTelegram = {
	sendUpdatedJobListToTelegram: vi.fn(),
};

// Mock data for testing
export const mockJobData = {
	validUpdateData: {
		title: 'Updated Software Developer Position',
		salary: '6000',
		cityId: '2',
		phone: '+972-50-987-6543',
		description: 'Looking for an experienced software developer with React skills',
		categoryId: '3',
		shuttle: true,
		meals: false,
		imageUrl: 'https://example.com/image.jpg',
		userId: 'user-123',
	},
	
	updateDataWithStringNumbers: {
		title: 'Marketing Manager Position',
		salary: '7000',
		cityId: '1',
		phone: '+972-52-111-2222',
		description: 'Marketing position in Tel Aviv',
		categoryId: '4',
		shuttle: false,
		meals: true,
		imageUrl: 'https://example.com/marketing.jpg',
		userId: 'user-456',
	},
	
	updateDataWithNumericValues: {
		title: 'Designer Position',
		salary: 5500,
		cityId: 3,
		phone: '+972-54-333-4444',
		description: 'UI/UX Designer position',
		categoryId: 5,
		shuttle: true,
		meals: true,
		imageUrl: 'https://example.com/designer.jpg',
		userId: 'user-789',
	},
	
	dataWithBadWords: {
		title: 'F***ing Great Job',
		salary: '5000',
		cityId: '1',
		phone: '+972-50-123-4567',
		description: 'This is a sh**ty job description',
		categoryId: '2',
		shuttle: false,
		meals: false,
		imageUrl: '',
		userId: 'user-123',
	},
	
	dataWithLinks: {
		title: 'Check out this job at https://spam.com',
		salary: '5000',
		cityId: '1',
		phone: '+972-50-123-4567',
		description: 'Visit our website at http://malicious-site.com for more info',
		categoryId: '2',
		shuttle: false,
		meals: false,
		imageUrl: '',
		userId: 'user-123',
	},
	
	invalidJobId: {
		title: 'Valid Job Title',
		salary: '5000',
		cityId: '1',
		phone: '+972-50-123-4567',
		description: 'Valid job description',
		categoryId: '2',
		shuttle: false,
		meals: false,
		imageUrl: '',
		userId: 'user-123',
	},
	
	unauthorizedUpdate: {
		title: 'Unauthorized Update',
		salary: '5000',
		cityId: '1',
		phone: '+972-50-123-4567',
		description: 'Trying to update someone else job',
		categoryId: '2',
		shuttle: false,
		meals: false,
		imageUrl: '',
		userId: 'different-user-456',
	},
};

// Mock existing job from database
export const mockExistingJob = {
	id: 1,
	title: 'Original Job Title',
	salary: 5000,
	cityId: 1,
	phone: '+972-50-123-4567',
	description: 'Original job description',
	categoryId: 2,
	shuttle: false,
	meals: false,
	imageUrl: null,
	userId: 'user-123',
	user: {
		id: 'user-123',
		clerkUserId: 'user-123',
		isPremium: false,
		firstName: 'John',
		lastName: 'Doe',
		email: 'john@example.com',
	},
	city: {
		id: 1,
		name: 'Tel Aviv',
	},
	category: {
		id: 2,
		name: 'Technology',
	},
};

// Mock existing job with premium user
export const mockExistingJobPremium = {
	id: 1,
	title: 'Original Job Title',
	salary: 5000,
	cityId: 1,
	phone: '+972-50-123-4567',
	description: 'Original job description',
	categoryId: 2,
	shuttle: false,
	meals: false,
	imageUrl: null,
	userId: 'user-123',
	user: {
		id: 'user-123',
		clerkUserId: 'user-123',
		isPremium: true,
		firstName: 'John',
		lastName: 'Doe',
		email: 'john@example.com',
	},
	city: {
		id: 1,
		name: 'Tel Aviv',
	},
	category: {
		id: 2,
		name: 'Technology',
	},
};

// Mock updated job response
export const mockUpdatedJob = {
	id: 1,
	title: 'Updated Software Developer Position',
	salary: 6000,
	cityId: 2,
	phone: '+972-50-987-6543',
	description: 'Looking for an experienced software developer with React skills',
	categoryId: 3,
	shuttle: true,
	meals: false,
	imageUrl: 'https://example.com/image.jpg',
	userId: 'user-123',
	city: {
		id: 2,
		name: 'Jerusalem',
	},
	user: {
		id: 'user-123',
		clerkUserId: 'user-123',
		isPremium: false,
		firstName: 'John',
		lastName: 'Doe',
		email: 'john@example.com',
	},
	category: {
		id: 3,
		name: 'Software Development',
	},
	createdAt: new Date('2024-01-01T10:00:00Z'),
	updatedAt: new Date('2024-01-01T12:00:00Z'),
};

// Mock user jobs for premium users
export const mockUserJobs = [
	{
		id: 1,
		title: 'Updated Software Developer Position',
		salary: 6000,
		cityId: 2,
		phone: '+972-50-987-6543',
		description: 'Looking for an experienced software developer with React skills',
		categoryId: 3,
		shuttle: true,
		meals: false,
		imageUrl: 'https://example.com/image.jpg',
		userId: 'user-123',
		city: {
			id: 2,
			name: 'Jerusalem',
		},
	},
	{
		id: 2,
		title: 'Another Job',
		salary: 5000,
		cityId: 1,
		phone: '+972-50-123-4567',
		description: 'Another job description',
		categoryId: 2,
		shuttle: false,
		meals: true,
		imageUrl: null,
		userId: 'user-123',
		city: {
			id: 1,
			name: 'Tel Aviv',
		},
	},
];

// Mock errors
export const mockPrismaError = new Error('Database connection failed');
export const mockValidationError = new Error('Validation failed');
export const mockTelegramError = new Error('Telegram API error');

// Reset mocks before each test
export const resetEditFormMocks = () => {
	mockPrisma.job.findUnique.mockClear();
	mockPrisma.job.update.mockClear();
	mockPrisma.job.findMany.mockClear();
	mockValidation.containsBadWords.mockClear();
	mockValidation.containsLinks.mockClear();
	mockTelegram.sendUpdatedJobListToTelegram.mockClear();
	vi.clearAllMocks();
};

import { vi } from 'vitest';

// Mock Prisma client
export const mockPrisma = {
	job: {
		create: vi.fn(),
	},
};

// Mock data for testing
export const mockJobData = {
	validJobData: {
		title: 'Software Developer',
		description: 'Looking for an experienced software developer',
		salary: '5000',
		cityId: '1',
		categoryId: '2',
		userId: 'user-123',
		phone: '+972-50-123-4567',
	},
	
	jobDataWithStringNumbers: {
		title: 'Marketing Manager',
		description: 'Marketing position in Tel Aviv',
		salary: '6000',
		cityId: '3',
		categoryId: '4',
		userId: 'user-456',
		phone: '+972-52-987-6543',
	},
	
	jobDataWithNumericValues: {
		title: 'Designer',
		description: 'UI/UX Designer position',
		salary: 4500,
		cityId: 2,
		categoryId: 5,
		userId: 'user-789',
		phone: '+972-54-555-1234',
	},
	
	invalidJobData: {
		title: '',
		description: '',
		salary: 'invalid',
		cityId: 'invalid',
		categoryId: 'invalid',
		userId: '',
		phone: '',
	},
	
	jobDataMissingFields: {
		title: 'Incomplete Job',
		// Missing required fields
	},
};

// Mock successful job creation response
export const mockCreatedJob = {
	id: 1,
	title: 'Software Developer',
	description: 'Looking for an experienced software developer',
	salary: 5000,
	cityId: 1,
	categoryId: 2,
	userId: 'user-123',
	phone: '+972-50-123-4567',
	status: 'ACTIVE',
	city: {
		id: 1,
		name: 'Tel Aviv',
	},
	category: {
		id: 2,
		name: 'Technology',
	},
	createdAt: new Date('2024-01-01T10:00:00Z'),
	updatedAt: new Date('2024-01-01T10:00:00Z'),
};

// Mock Prisma error
export const mockPrismaError = new Error('Database connection failed');

// Reset mocks before each test
export const resetCreateJobMocks = () => {
	mockPrisma.job.create.mockClear();
	vi.clearAllMocks();
};

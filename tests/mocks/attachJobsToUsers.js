import { vi } from 'vitest';

// Mock PrismaClient
export const mockPrisma = {
	user: {
		findFirst: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
	},
	job: {
		create: vi.fn(),
		findMany: vi.fn(),
		findUnique: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
	},
	city: {
		findUnique: vi.fn(),
		create: vi.fn(),
	},
};

// Mock fake user creation function
export const mockCreateFakeUser = vi.fn();

// Mock faker
export const mockFaker = {
	phone: {
		number: vi.fn(),
	},
	person: {
		firstName: vi.fn(),
		lastName: vi.fn(),
	},
	internet: {
		email: vi.fn(),
	},
};

// Mock console methods
export const mockConsole = {
	log: vi.fn(),
	error: vi.fn(),
	warn: vi.fn(),
	info: vi.fn(),
};

// Mock job data
export const mockJobData = {
	validJob: {
		title: 'Software Developer',
		salary: 50000,
		description: 'Looking for experienced developer',
		city: 'Tel Aviv',
	},
	jobWithStringSalary: {
		title: 'Designer',
		salary: '40000-60000',
		description: 'Looking for creative designer',
		city: 'Jerusalem',
	},
	jobWithNumericSalary: {
		title: 'Manager',
		salary: 70000,
		description: 'Looking for project manager',
		city: 'Haifa',
	},
	jobWithSpecialCharacters: {
		title: 'Developer & Designer',
		salary: 55000,
		description: 'Looking for developer/designer hybrid',
		city: 'Ramat Gan',
	},
	jobList: [
		{
			title: 'Software Developer',
			salary: 50000,
			description: 'Looking for experienced developer',
			city: 'Tel Aviv',
		},
		{
			title: 'Designer',
			salary: '40000-60000',
			description: 'Looking for creative designer',
			city: 'Jerusalem',
		},
		{
			title: 'Manager',
			salary: 70000,
			description: 'Looking for project manager',
			city: 'Haifa',
		},
	],
	emptyJobList: [],
	singleJob: [
		{
			title: 'Single Job',
			salary: 45000,
			description: 'Just one job',
			city: 'Eilat',
		},
	],
};

// Mock user data
export const mockUserData = {
	existingFakeUser: {
		id: 'user_123',
		clerkUserId: 'user_123',
		email: 'fake@example.com',
		firstName: 'Fake',
		lastName: 'User',
		jobs: [],
	},
	userWithJobs: {
		id: 'user_456',
		clerkUserId: 'user_456',
		email: 'userwithjobs@example.com',
		firstName: 'User',
		lastName: 'WithJobs',
		jobs: [
			{
				id: 1,
				title: 'Existing Job',
				salary: '30000',
				description: 'Existing job description',
			},
		],
	},
	userWithMultipleJobs: {
		id: 'user_789',
		clerkUserId: 'user_789',
		email: 'userwithmultiplejobs@example.com',
		firstName: 'User',
		lastName: 'WithMultipleJobs',
		jobs: [
			{
				id: 1,
				title: 'Job 1',
				salary: '30000',
				description: 'First job',
			},
			{
				id: 2,
				title: 'Job 2',
				salary: '35000',
				description: 'Second job',
			},
		],
	},
	newFakeUser: {
		id: 'user_new',
		clerkUserId: 'user_new',
		email: 'newfake@example.com',
		firstName: 'New',
		lastName: 'Fake',
		jobs: [],
	},
};

// Mock city data
export const mockCityData = {
	existingCity: {
		id: 1,
		name: 'Tel Aviv',
	},
	newCity: {
		id: 2,
		name: 'Jerusalem',
	},
	cityList: [
		{ id: 1, name: 'Tel Aviv' },
		{ id: 2, name: 'Jerusalem' },
		{ id: 3, name: 'Haifa' },
	],
};

// Mock created job data
export const mockCreatedJobData = {
	successfulJobCreation: {
		id: 1,
		title: 'Software Developer',
		salary: '50000',
		description: 'Looking for experienced developer',
		phone: '+972 123-456-789',
		cityId: 1,
		userId: 'user_123',
		createdAt: new Date('2024-01-01'),
	},
	jobWithStringSalary: {
		id: 2,
		title: 'Designer',
		salary: '40000-60000',
		description: 'Looking for creative designer',
		phone: '+972 987-654-321',
		cityId: 2,
		userId: 'user_456',
		createdAt: new Date('2024-01-02'),
	},
};

// Mock errors
export const mockErrors = {
	databaseError: new Error('Database connection failed'),
	userNotFound: new Error('User not found'),
	jobCreationError: new Error('Failed to create job'),
	cityCreationError: new Error('Failed to create city'),
	fakeUserCreationError: new Error('Failed to create fake user'),
	prismaError: new Error('Prisma error'),
	validationError: new Error('Validation error'),
	networkError: new Error('Network timeout'),
};

// Mock service responses
export const mockServiceResponses = {
	successfulJobCreation: mockCreatedJobData.successfulJobCreation,
	successfulFakeUserCreation: mockUserData.newFakeUser,
	successfulCityCreation: mockCityData.newCity,
	successfulUserLookup: mockUserData.existingFakeUser,
};

// Mock Prisma operations logic
export const mockPrismaOperationsLogic = {
	findFirstUser: async (where, include) => {
		if (where.clerkUserId.startsWith === 'user_') {
			return mockUserData.existingFakeUser;
		}
		return null;
	},
	createJob: async (data) => {
		if (!data.title || !data.salary) {
			throw mockErrors.jobCreationError;
		}
		return mockServiceResponses.successfulJobCreation;
	},
	createCity: async (data) => {
		if (!data.name) {
			throw mockErrors.cityCreationError;
		}
		return mockServiceResponses.successfulCityCreation;
	},
	connectOrCreateCity: async (where, create) => {
		if (where.name === 'Tel Aviv') {
			return { connect: { id: 1 } };
		}
		return { create: create };
	},
};

// Mock fake user creation logic
export const mockFakeUserCreationLogic = {
	createFakeUser: async () => {
		return mockServiceResponses.successfulFakeUserCreation;
	},
};

// Mock faker logic
export const mockFakerLogic = {
	generatePhoneNumber: () => '+972 123-456-789',
	generateFirstName: () => 'John',
	generateLastName: () => 'Doe',
	generateEmail: () => 'john.doe@example.com',
};

// Mock controller logic
export const mockControllerLogic = {
	processAssignJobsToFakeUsers: async (jobs) => {
		for (let job of jobs) {
			try {
				let fakeUser = await mockPrisma.user.findFirst({
					where: { clerkUserId: { startsWith: 'user_' } },
					orderBy: { jobs: { _count: 'asc' } },
					include: { jobs: true },
				});

				if (!fakeUser) {
					fakeUser = await mockCreateFakeUser();
				}

				await mockPrisma.job.create({
					data: {
						title: job.title,
						salary: String(job.salary),
						description: job.description,
						phone: mockFaker.phone.number('+972 ###-###-####'),
						city: {
							connectOrCreate: {
								where: { name: job.city },
								create: { name: job.city },
							},
						},
						user: { connect: { id: fakeUser.id } },
						createdAt: new Date(),
					},
				});
			} catch (error) {
				console.error(
					`❌ Ошибка при привязке вакансии "${job.title}":`,
					error.message,
				);
			}
		}
	},
};

// Mock request/response logic
export const mockRequestResponseLogic = {
	buildJobData: (title, salary, description, city) => ({
		title,
		salary,
		description,
		city,
	}),
	validateJobData: (job) => {
		return !!(job.title && job.salary && job.description && job.city);
	},
};

// Reset all mocks
export const resetAllMocks = () => {
	vi.clearAllMocks();
	mockPrisma.user.findFirst.mockClear();
	mockPrisma.user.create.mockClear();
	mockPrisma.job.create.mockClear();
	mockPrisma.city.create.mockClear();
	mockCreateFakeUser.mockClear();
	mockFaker.phone.number.mockClear();
	mockConsole.log.mockClear();
	mockConsole.error.mockClear();
	mockConsole.warn.mockClear();
	mockConsole.info.mockClear();
};

// Mock the dependencies
vi.mock('@prisma/client', () => ({
	PrismaClient: vi.fn(() => mockPrisma),
}));

vi.mock('../../utils/fakeUsers.js', () => ({
	createFakeUser: mockCreateFakeUser,
}));

vi.mock('@faker-js/faker', () => ({
	faker: mockFaker,
}));

// Mock console
Object.assign(console, mockConsole);

// Setup mock implementations
mockFaker.phone.number.mockReturnValue('+972 123-456-789');
mockCreateFakeUser.mockResolvedValue(mockUserData.newFakeUser);
mockPrisma.user.findFirst.mockResolvedValue(mockUserData.existingFakeUser);
mockPrisma.job.create.mockResolvedValue(
	mockCreatedJobData.successfulJobCreation,
);

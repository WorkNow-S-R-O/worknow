import { vi } from 'vitest';

// Mock Prisma client
export const mockPrisma = {
	job: {
		findUnique: vi.fn(),
	},
};

// Mock data for testing
export const mockJobData = {
	validJobIds: {
		string: '123',
		numeric: 123,
		zero: '0',
		large: '999999',
	},

	invalidJobIds: {
		null: null,
		undefined: undefined,
		empty: '',
		nonNumeric: 'abc',
		negative: '-1',
		float: '123.45',
		boolean: true,
		object: {},
		array: [],
	},

	jobWithImage: {
		id: 123,
		title: 'Software Developer Position',
		salary: 6000,
		cityId: 2,
		phone: '+972-50-987-6543',
		description:
			'Looking for an experienced software developer with React skills',
		categoryId: 3,
		shuttle: true,
		meals: false,
		imageUrl: 'https://example.com/image.jpg',
		userId: 'user-123',
		city: {
			id: 2,
			name: 'Jerusalem',
		},
		category: {
			id: 3,
			name: 'Software Development',
		},
		user: {
			id: 'user-123',
			isPremium: true,
			firstName: 'John',
			lastName: 'Doe',
			clerkUserId: 'user-123',
		},
		createdAt: new Date('2024-01-01T10:00:00Z'),
		updatedAt: new Date('2024-01-01T12:00:00Z'),
	},

	jobWithoutImage: {
		id: 456,
		title: 'Marketing Manager Position',
		salary: 5000,
		cityId: 1,
		phone: '+972-52-111-2222',
		description: 'Marketing position in Tel Aviv',
		categoryId: 4,
		shuttle: false,
		meals: true,
		imageUrl: null,
		userId: 'user-456',
		city: {
			id: 1,
			name: 'Tel Aviv',
		},
		category: {
			id: 4,
			name: 'Marketing',
		},
		user: {
			id: 'user-456',
			isPremium: false,
			firstName: 'Jane',
			lastName: 'Smith',
			clerkUserId: 'user-456',
		},
		createdAt: new Date('2024-01-02T09:00:00Z'),
		updatedAt: new Date('2024-01-02T11:00:00Z'),
	},

	jobWithEmptyImageUrl: {
		id: 789,
		title: 'Designer Position',
		salary: 5500,
		cityId: 3,
		phone: '+972-54-333-4444',
		description: 'UI/UX Designer position',
		categoryId: 5,
		shuttle: true,
		meals: true,
		imageUrl: '',
		userId: 'user-789',
		city: {
			id: 3,
			name: 'Haifa',
		},
		category: {
			id: 5,
			name: 'Design',
		},
		user: {
			id: 'user-789',
			isPremium: true,
			firstName: 'Bob',
			lastName: 'Johnson',
			clerkUserId: 'user-789',
		},
		createdAt: new Date('2024-01-03T08:00:00Z'),
		updatedAt: new Date('2024-01-03T10:00:00Z'),
	},

	jobWithMinimalUserData: {
		id: 999,
		title: 'Test Job',
		salary: 4000,
		cityId: 1,
		phone: '+972-50-999-8888',
		description: 'Test job description',
		categoryId: 1,
		shuttle: false,
		meals: false,
		imageUrl: null,
		userId: 'user-999',
		city: {
			id: 1,
			name: 'Tel Aviv',
		},
		category: {
			id: 1,
			name: 'General',
		},
		user: {
			id: 'user-999',
			isPremium: false,
			firstName: null,
			lastName: null,
			clerkUserId: 'user-999',
		},
		createdAt: new Date('2024-01-04T07:00:00Z'),
		updatedAt: new Date('2024-01-04T09:00:00Z'),
	},

	nullJob: null,
};

// Mock Prisma query options
export const mockPrismaQueryOptions = {
	where: { id: 123 },
	include: {
		city: true,
		category: true,
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
};

// Mock errors
export const mockPrismaError = new Error('Database connection failed');
export const mockNotFoundError = new Error('Job not found');
export const mockParseError = new Error('Invalid ID format');

// Mock console logging data
export const mockConsoleLogData = {
	fetchingJob: {
		id: '123',
	},
	jobFoundWithImage: {
		id: 123,
		title: 'Software Developer Position',
		imageUrl: 'https://example.com/image.jpg',
		hasImageUrl: true,
	},
	jobFoundWithoutImage: {
		id: 456,
		title: 'Marketing Manager Position',
		imageUrl: null,
		hasImageUrl: false,
	},
	jobFoundEmptyImage: {
		id: 789,
		title: 'Designer Position',
		imageUrl: '',
		hasImageUrl: false,
	},
	jobNotFound: {
		id: undefined,
		title: undefined,
		imageUrl: undefined,
		hasImageUrl: false,
	},
};

// Reset mocks before each test
export const resetGetJobMocks = () => {
	mockPrisma.job.findUnique.mockClear();
	vi.clearAllMocks();
};

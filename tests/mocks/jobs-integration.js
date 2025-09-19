import { vi } from 'vitest';

// Mock services
export const mockCreateJobService = vi.fn();
export const mockUpdateJobService = vi.fn();
export const mockDeleteJobService = vi.fn();
export const mockGetJobsService = vi.fn();
export const mockGetJobByIdService = vi.fn();
export const mockBoostJobService = vi.fn();

// Mock service modules
vi.mock('../../apps/api/services/jobCreateService.js', () => ({
	createJobService: mockCreateJobService,
}));

vi.mock('../../apps/api/services/editFormService.js', () => ({
	updateJobService: mockUpdateJobService,
}));

vi.mock('../../apps/api/services/jobDeleteService.js', () => ({
	deleteJobService: mockDeleteJobService,
}));

vi.mock('../../apps/api/services/jobService.js', () => ({
	getJobsService: mockGetJobsService,
}));

vi.mock('../../apps/api/services/getJobById.js', () => ({
	getJobByIdService: mockGetJobByIdService,
}));

vi.mock('../../apps/api/services/jobBoostService.js', () => ({
	boostJobService: mockBoostJobService,
}));

// Mock auth middleware
export const mockRequireAuth = vi.fn((req, res, next) => {
	// Check if authorization header exists and is valid
	const authHeader = req.headers.authorization;
	
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ error: 'No authorization token provided' });
	}
	
	const token = authHeader.substring(7);
	
	// Check for invalid tokens
	if (token === 'invalid.token.here') {
		return res.status(401).json({ error: 'Token verification failed' });
	}
	
	if (token === 'malformed') {
		return res.status(401).json({ error: 'Invalid token format' });
	}
	
	if (token === 'invalid.token.here' || !token.includes('.')) {
		return res.status(401).json({ error: 'Token verification failed' });
	}
	
	// Valid token - set user
	req.user = {
		clerkUserId: 'user_123456789',
		email: 'test@example.com',
		firstName: 'John',
		lastName: 'Doe',
		imageUrl: 'https://example.com/avatar.jpg',
	};
	next();
});

vi.mock('../../apps/api/middlewares/auth.js', () => ({
	requireAuth: mockRequireAuth,
}));

// Mock data
export const mockJobData = {
	id: 1,
	title: 'Software Developer',
	salary: '50000',
	phone: '+972501234567',
	description: 'Looking for an experienced software developer',
	cityId: 1,
	userId: 'user_123456789',
	categoryId: 1,
	shuttle: true,
	meals: false,
	imageUrl: 'https://example.com/job-image.jpg',
	createdAt: '2024-01-01T00:00:00.000Z',
	updatedAt: '2024-01-01T00:00:00.000Z',
	city: {
		id: 1,
		name: 'Tel Aviv',
		translations: [
			{ lang: 'ru', name: 'Тель-Авив' },
			{ lang: 'en', name: 'Tel Aviv' },
			{ lang: 'he', name: 'תל אביב' },
		],
	},
	category: {
		id: 1,
		name: 'IT',
		translations: [
			{ lang: 'ru', name: 'IT' },
			{ lang: 'en', name: 'Information Technology' },
			{ lang: 'he', name: 'טכנולוגיית מידע' },
		],
	},
	user: {
		id: 'user_123456789',
		email: 'test@example.com',
		firstName: 'John',
		lastName: 'Doe',
	},
};

export const mockJobsList = [
	{
		id: 1,
		title: 'Software Developer',
		salary: '50000',
		phone: '+972501234567',
		description: 'Looking for an experienced software developer',
		cityId: 1,
		userId: 'user_123456789',
		categoryId: 1,
		shuttle: true,
		meals: false,
		imageUrl: 'https://example.com/job-image.jpg',
		createdAt: '2024-01-01T00:00:00.000Z',
		city: {
			id: 1,
			name: 'Tel Aviv',
			translations: [
				{ lang: 'ru', name: 'Тель-Авив' },
				{ lang: 'en', name: 'Tel Aviv' },
			],
		},
		category: {
			id: 1,
			name: 'IT',
			translations: [
				{ lang: 'ru', name: 'IT' },
				{ lang: 'en', name: 'Information Technology' },
			],
		},
	},
	{
		id: 2,
		title: 'Marketing Manager',
		salary: '40000',
		phone: '+972501234568',
		description: 'Looking for a marketing manager',
		cityId: 2,
		userId: 'user_123456790',
		categoryId: 2,
		shuttle: false,
		meals: true,
		imageUrl: null,
		createdAt: '2024-01-02T00:00:00.000Z',
		city: {
			id: 2,
			name: 'Jerusalem',
			translations: [
				{ lang: 'ru', name: 'Иерусалим' },
				{ lang: 'en', name: 'Jerusalem' },
			],
		},
		category: {
			id: 2,
			name: 'Marketing',
			translations: [
				{ lang: 'ru', name: 'Маркетинг' },
				{ lang: 'en', name: 'Marketing' },
			],
		},
	},
];

export const mockPagination = {
	currentPage: 1,
	totalPages: 5,
	totalItems: 50,
	itemsPerPage: 10,
	hasNextPage: true,
	hasPrevPage: false,
};

export const mockServiceResponses = {
	createJobSuccess: {
		job: mockJobData,
	},
	createJobError: {
		error: 'Job creation failed',
	},
	createJobValidationError: {
		errors: {
			title: 'Title is required',
			salary: 'Salary must be a number',
		},
	},
	updateJobSuccess: {
		updatedJob: { ...mockJobData, title: 'Updated Software Developer' },
	},
	updateJobError: {
		error: 'Job update failed',
	},
	deleteJobSuccess: {
		message: 'Job deleted successfully',
	},
	deleteJobError: {
		error: 'Job deletion failed',
	},
	getJobsSuccess: {
		jobs: mockJobsList,
		pagination: mockPagination,
	},
	getJobsError: {
		error: 'Failed to fetch jobs',
	},
	getJobByIdSuccess: {
		job: mockJobData,
	},
	getJobByIdError: {
		error: 'Job not found',
	},
	boostJobSuccess: {
		boostedJob: { ...mockJobData, boostedAt: '2024-01-01T00:00:00.000Z' },
	},
	boostJobError: {
		error: 'Job boost failed',
	},
};

export const mockErrors = {
	validationError: 'Validation failed',
	notFoundError: 'Job not found',
	unauthorizedError: 'Unauthorized access',
	forbiddenError: 'Access forbidden',
	serverError: 'Internal server error',
	networkError: 'Network error',
	timeoutError: 'Request timeout',
};

export const mockAuthTokens = {
	validToken: 'Bearer valid.jwt.token',
	invalidToken: 'Bearer invalid.token.here',
	expiredToken: 'Bearer expired.token.here',
	malformedToken: 'Bearer malformed',
	noBearerToken: 'invalid.token.here',
};

// Reset mocks function
export const resetJobsMocks = () => {
	mockCreateJobService.mockClear();
	mockUpdateJobService.mockClear();
	mockDeleteJobService.mockClear();
	mockGetJobsService.mockClear();
	mockGetJobByIdService.mockClear();
	mockBoostJobService.mockClear();
	mockRequireAuth.mockClear();
	vi.clearAllMocks();
};

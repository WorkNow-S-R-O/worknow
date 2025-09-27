import { vi } from 'vitest';

// Mock seeker service functions
export const mockGetAllSeekers = vi.fn();
export const mockCreateSeeker = vi.fn();
export const mockGetSeekerBySlug = vi.fn();
export const mockDeleteSeeker = vi.fn();
export const mockGetSeekerById = vi.fn();

// Mock user service
export const mockGetUserByClerkIdService = vi.fn();

// Mock candidate notification service
export const mockCheckAndSendNewCandidatesNotification = vi.fn();

// Mock console methods
export const mockConsole = {
	log: vi.fn(),
	error: vi.fn(),
	warn: vi.fn(),
	info: vi.fn(),
};

// Mock request and response objects
export const mockRequest = (body = {}, params = {}, query = {}) => ({
	body,
	params,
	query,
});

export const mockResponse = () => {
	const res = {
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
		send: vi.fn().mockReturnThis(),
	};
	return res;
};

// Mock seeker data
export const mockSeekerData = {
	validSeeker: {
		id: 1,
		name: 'John Doe',
		contact: '+972501234567',
		city: 'Tel Aviv',
		description: 'Experienced developer',
		slug: 'john-doe',
		isActive: true,
		isDemanded: false,
		gender: 'Male',
		facebook: 'https://facebook.com/johndoe',
		languages: ['English', 'Hebrew'],
		nativeLanguage: 'English',
		employment: 'Full-time',
		category: 'IT',
		documents: 'Passport, Work permit',
		note: 'Available immediately',
		announcement: 'Looking for software development position',
		documentType: 'Passport',
		createdAt: new Date('2024-01-01'),
	},
	premiumSeeker: {
		id: 2,
		name: 'Jane Smith',
		contact: '+972509876543',
		city: 'Jerusalem',
		description: 'Senior designer',
		slug: 'jane-smith',
		isActive: true,
		isDemanded: true,
		gender: 'Female',
		facebook: 'https://facebook.com/janesmith',
		languages: ['Hebrew', 'Russian'],
		nativeLanguage: 'Hebrew',
		employment: 'Part-time',
		category: 'Design',
		documents: 'ID, Visa',
		note: 'Flexible schedule',
		announcement: 'UI/UX designer available',
		documentType: 'ID',
		createdAt: new Date('2024-01-02'),
	},
	seekerWithMultipleLanguages: {
		id: 3,
		name: 'Ahmed Hassan',
		contact: '+972501111111',
		city: 'Haifa',
		description: 'Multilingual translator',
		slug: 'ahmed-hassan',
		isActive: true,
		isDemanded: false,
		gender: 'Male',
		facebook: null,
		languages: ['Arabic', 'Hebrew', 'English', 'French'],
		nativeLanguage: 'Arabic',
		employment: 'Contract',
		category: 'Translation',
		documents: 'Passport, Work permit',
		note: 'Certified translator',
		announcement: 'Professional translation services',
		documentType: 'Passport',
		createdAt: new Date('2024-01-03'),
	},
	seekerList: [
		{
			id: 1,
			name: 'John Doe',
			contact: '+972501234567',
			city: 'Tel Aviv',
			description: 'Experienced developer',
			slug: 'john-doe',
			isActive: true,
			isDemanded: false,
		},
		{
			id: 2,
			name: 'Jane Smith',
			contact: '+972509876543',
			city: 'Jerusalem',
			description: 'Senior designer',
			slug: 'jane-smith',
			isActive: true,
			isDemanded: true,
		},
		{
			id: 3,
			name: 'Ahmed Hassan',
			contact: '+972501111111',
			city: 'Haifa',
			description: 'Multilingual translator',
			slug: 'ahmed-hassan',
			isActive: true,
			isDemanded: false,
		},
	],
	paginatedSeekers: {
		seekers: [
			{
				id: 1,
				name: 'John Doe',
				contact: '+972501234567',
				city: 'Tel Aviv',
				description: 'Experienced developer',
				slug: 'john-doe',
				isActive: true,
				isDemanded: false,
			},
			{
				id: 2,
				name: 'Jane Smith',
				contact: '+972509876543',
				city: 'Jerusalem',
				description: 'Senior designer',
				slug: 'jane-smith',
				isActive: true,
				isDemanded: true,
			},
		],
		total: 2,
		page: 1,
		limit: 10,
		totalPages: 1,
	},
};

// Mock user data
export const mockUserData = {
	regularUser: {
		id: 'user_123',
		clerkUserId: 'user_123',
		email: 'user@example.com',
		firstName: 'John',
		lastName: 'Doe',
		isPremium: false,
		isPremiumDeluxe: false,
		createdAt: new Date('2024-01-01'),
	},
	premiumUser: {
		id: 'user_456',
		clerkUserId: 'user_456',
		email: 'premium@example.com',
		firstName: 'Jane',
		lastName: 'Smith',
		isPremium: true,
		isPremiumDeluxe: false,
		createdAt: new Date('2024-01-01'),
	},
	premiumDeluxeUser: {
		id: 'user_789',
		clerkUserId: 'user_789',
		email: 'deluxe@example.com',
		firstName: 'Bob',
		lastName: 'Johnson',
		isPremium: true,
		isPremiumDeluxe: true,
		createdAt: new Date('2024-01-01'),
	},
};

// Mock seeker creation data
export const mockSeekerCreationData = {
	validSeekerData: {
		name: 'New Candidate',
		contact: '+972501234567',
		city: 'Tel Aviv',
		description: 'Looking for opportunities',
		gender: 'Male',
		isDemanded: false,
		facebook: 'https://facebook.com/newcandidate',
		languages: ['English', 'Hebrew'],
		nativeLanguage: 'English',
		category: 'IT',
		employment: 'Full-time',
		documents: 'Passport',
		announcement: 'Available for work',
		note: 'Ready to start immediately',
		documentType: 'Passport',
	},
	minimalSeekerData: {
		name: 'Minimal Candidate',
		contact: '+972501234567',
		city: 'Jerusalem',
		description: 'Basic info',
	},
	seekerWithArrayLanguages: {
		name: 'Array Languages Candidate',
		contact: '+972501234567',
		city: 'Haifa',
		description: 'Multiple languages',
		languages: ['Hebrew', 'English', 'Arabic'],
	},
	seekerWithSingleLanguage: {
		name: 'Single Language Candidate',
		contact: '+972501234567',
		city: 'Tel Aviv',
		description: 'One language',
		languages: 'Hebrew',
	},
};

// Mock errors
export const mockErrors = {
	seekerNotFound: new Error('Seeker not found'),
	databaseError: new Error('Database connection failed'),
	validationError: new Error('Invalid input data'),
	serviceError: new Error('Service unavailable'),
	notificationError: new Error('Notification service failed'),
};

// Mock service responses
export const mockServiceResponses = {
	successfulSeekerCreation: {
		id: 4,
		name: 'New Candidate',
		contact: '+972501234567',
		city: 'Tel Aviv',
		description: 'Looking for opportunities',
		slug: 'new-candidate',
		isActive: true,
		isDemanded: false,
		createdAt: new Date('2024-01-04'),
	},
	successfulSeekerList: mockSeekerData.seekerList,
	successfulPaginatedSeekers: mockSeekerData.paginatedSeekers,
	successfulSeekerBySlug: mockSeekerData.validSeeker,
	successfulSeekerById: mockSeekerData.validSeeker,
	successfulDeletion: { success: true },
	successfulUserLookup: mockUserData.premiumUser,
	successfulNotification: { success: true, sent: 5 },
};

// Mock seeker service logic
export const mockSeekerServiceLogic = {
	getAllSeekers: async (query) => {
		if (query.page && query.limit) {
			return mockServiceResponses.successfulPaginatedSeekers;
		}
		return mockServiceResponses.successfulSeekerList;
	},
	createSeeker: async (seekerData) => {
		if (!seekerData.name || !seekerData.contact) {
			throw mockErrors.validationError;
		}
		return mockServiceResponses.successfulSeekerCreation;
	},
	getSeekerBySlug: async (slug) => {
		if (slug === 'invalid-slug') {
			return null;
		}
		return mockServiceResponses.successfulSeekerBySlug;
	},
	deleteSeeker: async (id) => {
		if (isNaN(Number(id))) {
			throw mockErrors.validationError;
		}
		return mockServiceResponses.successfulDeletion;
	},
	getSeekerById: async (id) => {
		if (isNaN(id)) {
			throw mockErrors.validationError;
		}
		if (id === 999) {
			return null;
		}
		return mockServiceResponses.successfulSeekerById;
	},
};

// Mock user service logic
export const mockUserServiceLogic = {
	getUserByClerkIdService: async (clerkUserId) => {
		if (!clerkUserId) {
			return null;
		}
		if (clerkUserId === 'user_456') {
			return mockUserData.premiumUser;
		}
		if (clerkUserId === 'user_789') {
			return mockUserData.premiumDeluxeUser;
		}
		return mockUserData.regularUser;
	},
};

// Mock candidate notification logic
export const mockCandidateNotificationLogic = {
	checkAndSendNewCandidatesNotification: async () => {
		// Simulate notification process
		return mockServiceResponses.successfulNotification;
	},
};

// Mock controller logic
export const mockControllerLogic = {
	processGetSeekers: async (req, res) => {
		try {
			// Handle languages array from query parameters
			const query = { ...req.query };
			if (req.query.languages) {
				// If languages is already an array, use it as is
				if (Array.isArray(req.query.languages)) {
					query.languages = req.query.languages;
				} else {
					// If it's a single value, convert to array
					query.languages = [req.query.languages];
				}
			}

			// Add language parameter for city translation
			query.lang = req.query.lang || 'ru';

			const data = await mockGetAllSeekers(query);
			res.json(data);
		} catch (error) {
			console.error('❌ Error getting seekers:', error);
			res.status(500).json({ error: 'Ошибка получения соискателей' });
		}
	},
	processAddSeeker: async (req, res) => {
		try {
			const {
				name,
				contact,
				city,
				description,
				gender,
				isDemanded,
				facebook,
				languages,
				nativeLanguage,
				category,
				employment,
				documents,
				announcement,
				note,
				documentType,
			} = req.body;
			const seekerData = {
				name,
				contact,
				city,
				description,
				gender,
				isDemanded,
				facebook,
				languages,
				nativeLanguage,
				category,
				employment,
				documents,
				announcement,
				note,
				documentType,
			};
			const seeker = await mockCreateSeeker(seekerData);

			// Trigger new candidates notification check after adding new candidate
			try {
				await mockCheckAndSendNewCandidatesNotification();
			} catch (newsletterError) {
				console.error(
					'❌ Error triggering notification after adding candidate:',
					newsletterError,
				);
				// Don't fail the candidate creation if notification fails
			}

			res.status(201).json(seeker);
		} catch (e) {
			console.error('Ошибка при добавлении соискателя:', e);
			res.status(500).json({ error: 'Ошибка добавления соискателя' });
		}
	},
	processGetSeekerBySlug: async (req, res) => {
		try {
			const seeker = await mockGetSeekerBySlug(req.params.slug);
			if (!seeker) return res.status(404).json({ error: 'not found' });
			res.json(seeker);
		} catch {
			res.status(500).json({ error: 'Ошибка получения соискателя' });
		}
	},
	processDeleteSeeker: async (req, res) => {
		try {
			await mockDeleteSeeker(req.params.id);
			res.json({ success: true });
		} catch {
			res.status(500).json({ error: 'Ошибка удаления соискателя' });
		}
	},
	processGetSeekerById: async (req, res) => {
		try {
			const id = Number(req.params.id);
			if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
			const seeker = await mockGetSeekerById(id);
			if (!seeker) return res.status(404).json({ error: 'not found' });
			let isPremium = false;
			const clerkUserId = req.query.clerkUserId;
			if (clerkUserId) {
				const user = await mockGetUserByClerkIdService(clerkUserId);
				isPremium = !!user?.isPremium;
			}
			res.json({ ...seeker, isPremium });
		} catch (e) {
			console.error('Ошибка получения соискателя по id:', e);
			res.status(500).json({ error: 'Ошибка получения соискателя' });
		}
	},
};

// Mock request/response logic
export const mockRequestResponseLogic = {
	buildRequest: (body = {}, params = {}, query = {}) => ({
		body,
		params,
		query,
	}),
	buildResponse: () => {
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn().mockReturnThis(),
			send: vi.fn().mockReturnThis(),
		};
		return res;
	},
	validateControllerInput: (req) => {
		// Basic validation logic
		return !!(req.body || req.query || req.params);
	},
};

// Reset all mocks
export const resetAllMocks = () => {
	vi.clearAllMocks();
	mockGetAllSeekers.mockClear();
	mockCreateSeeker.mockClear();
	mockGetSeekerBySlug.mockClear();
	mockDeleteSeeker.mockClear();
	mockGetSeekerById.mockClear();
	mockGetUserByClerkIdService.mockClear();
	mockCheckAndSendNewCandidatesNotification.mockClear();
	mockConsole.log.mockClear();
	mockConsole.error.mockClear();
	mockConsole.warn.mockClear();
	mockConsole.info.mockClear();
};

// Mock the services
vi.mock('../../services/seekerService.js', () => ({
	getAllSeekers: mockGetAllSeekers,
	createSeeker: mockCreateSeeker,
	getSeekerBySlug: mockGetSeekerBySlug,
	deleteSeeker: mockDeleteSeeker,
	getSeekerById: mockGetSeekerById,
}));

vi.mock('../../services/getUserByClerkService.js', () => ({
	getUserByClerkIdService: mockGetUserByClerkIdService,
}));

vi.mock('../../services/candidateNotificationService.js', () => ({
	checkAndSendNewCandidatesNotification:
		mockCheckAndSendNewCandidatesNotification,
}));

// Mock console
Object.assign(console, mockConsole);

import { vi } from 'vitest';

// Mock Prisma Client
export const mockPrismaInstance = {
	seeker: {
		findMany: vi.fn(),
		findUnique: vi.fn(),
		create: vi.fn(),
		delete: vi.fn(),
		count: vi.fn(),
	},
	city: {
		findFirst: vi.fn(),
	},
};

vi.mock('@prisma/client', () => ({
	PrismaClient: vi.fn(() => mockPrismaInstance),
}));

// Mock services
export const mockGetAllSeekers = vi.fn();
export const mockCreateSeeker = vi.fn();
export const mockGetSeekerBySlug = vi.fn();
export const mockDeleteSeeker = vi.fn();
export const mockGetSeekerById = vi.fn();
export const mockGetUserByClerkIdService = vi.fn();
export const mockCheckAndSendNewCandidatesNotification = vi.fn();
export const mockSendSingleCandidateNotification = vi.fn();

// Mock service modules
vi.mock('../../apps/api/services/seekerService.js', () => ({
	getAllSeekers: mockGetAllSeekers,
	createSeeker: mockCreateSeeker,
	getSeekerBySlug: mockGetSeekerBySlug,
	deleteSeeker: mockDeleteSeeker,
	getSeekerById: mockGetSeekerById,
}));

vi.mock('../../apps/api/services/getUserByClerkService.js', () => ({
	getUserByClerkIdService: mockGetUserByClerkIdService,
}));

vi.mock('../../apps/api/services/candidateNotificationService.js', () => ({
	checkAndSendNewCandidatesNotification: mockCheckAndSendNewCandidatesNotification,
}));

vi.mock('../../apps/api/services/notificationService.js', () => ({
	sendSingleCandidateNotification: mockSendSingleCandidateNotification,
}));

// Mock data
export const mockSeekerData = {
	id: 1,
	name: 'John Doe',
	contact: '+1234567890',
	city: 'Tel Aviv',
	description: 'Experienced software developer',
	gender: 'Male',
	isDemanded: true,
	facebook: 'https://facebook.com/johndoe',
	languages: ['English', 'Hebrew'],
	nativeLanguage: 'English',
	category: 'IT',
	employment: 'Full-time',
	documents: 'Passport',
	announcement: 'Looking for opportunities',
	note: 'Available immediately',
	documentType: 'Passport',
	slug: 'john-doe-experienced-software-developer',
	isActive: true,
	createdAt: '2024-01-01T00:00:00.000Z',
};

export const mockSeekerListResponse = {
	seekers: [mockSeekerData],
	pagination: {
		currentPage: 1,
		totalPages: 1,
		totalCount: 1,
		hasNextPage: false,
		hasPrevPage: false,
	},
};

export const mockUserData = {
	id: 'user_123456789',
	clerkUserId: 'clerk_123456789',
	email: 'test@example.com',
	firstName: 'John',
	lastName: 'Doe',
	isPremium: true,
};

export const mockServiceResponses = {
	getSeekersSuccess: mockSeekerListResponse,
	createSeekerSuccess: mockSeekerData,
	getSeekerBySlugSuccess: mockSeekerData,
	getSeekerByIdSuccess: { ...mockSeekerData, isPremium: true },
	deleteSeekerSuccess: { success: true },
};

export const mockErrors = {
	getSeekersError: 'Ошибка получения соискателей',
	createSeekerError: 'Ошибка добавления соискателя',
	getSeekerBySlugError: 'Ошибка получения соискателя',
	deleteSeekerError: 'Ошибка удаления соискателя',
	getSeekerByIdError: 'Ошибка получения соискателя',
	notFound: 'not found',
	invalidId: 'Invalid id',
};

// Reset mocks function
export const resetSeekersMocks = () => {
	mockPrismaInstance.seeker.findMany.mockClear();
	mockPrismaInstance.seeker.findUnique.mockClear();
	mockPrismaInstance.seeker.create.mockClear();
	mockPrismaInstance.seeker.delete.mockClear();
	mockPrismaInstance.seeker.count.mockClear();
	mockPrismaInstance.city.findFirst.mockClear();
	mockGetAllSeekers.mockClear();
	mockCreateSeeker.mockClear();
	mockGetSeekerBySlug.mockClear();
	mockDeleteSeeker.mockClear();
	mockGetSeekerById.mockClear();
	mockGetUserByClerkIdService.mockClear();
	mockCheckAndSendNewCandidatesNotification.mockClear();
	mockSendSingleCandidateNotification.mockClear();
	
	vi.clearAllMocks();
};

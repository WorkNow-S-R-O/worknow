import { vi } from 'vitest';

// Mock Prisma client
export const mockPrisma = {
	city: {
		findFirst: vi.fn(),
	},
	seeker: {
		count: vi.fn(),
		findMany: vi.fn(),
		create: vi.fn(),
		findUnique: vi.fn(),
		delete: vi.fn(),
	},
};

// Mock notification service
export const mockNotificationService = {
	sendSingleCandidateNotification: vi.fn(),
};

// Mock console methods
export const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
export const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

// Mock city data
export const mockCityData = {
	telAviv: {
		id: 1,
		name: 'Tel Aviv',
		translations: [
			{ lang: 'ru', name: 'Тель-Авив' },
			{ lang: 'he', name: 'תל אביב' },
			{ lang: 'en', name: 'Tel Aviv' },
			{ lang: 'ar', name: 'تل أبيب' },
		],
	},
	jerusalem: {
		id: 2,
		name: 'Jerusalem',
		translations: [
			{ lang: 'ru', name: 'Иерусалим' },
			{ lang: 'he', name: 'ירושלים' },
			{ lang: 'en', name: 'Jerusalem' },
			{ lang: 'ar', name: 'القدس' },
		],
	},
	haifa: {
		id: 3,
		name: 'Haifa',
		translations: [
			{ lang: 'ru', name: 'Хайфа' },
			{ lang: 'he', name: 'חיפה' },
			{ lang: 'en', name: 'Haifa' },
			{ lang: 'ar', name: 'حيفا' },
		],
	},
	cityWithoutTranslation: {
		id: 4,
		name: 'Beersheba',
		translations: [],
	},
	cityWithPartialTranslation: {
		id: 5,
		name: 'Eilat',
		translations: [
			{ lang: 'ru', name: 'Эйлат' },
		],
	},
};

// Mock seeker data
export const mockSeekerData = {
	validSeeker: {
		id: 1,
		name: 'John Doe',
		contact: 'john@example.com',
		city: 'Tel Aviv',
		description: 'Experienced software developer with 5 years of experience in web development.',
		gender: 'Male',
		isDemanded: true,
		facebook: 'https://facebook.com/johndoe',
		languages: ['English', 'Hebrew', 'Russian'],
		nativeLanguage: 'English',
		category: 'IT',
		employment: 'Full-time',
		documents: 'Work permit, passport',
		announcement: 'Looking for software development position',
		note: 'Available immediately',
		documentType: 'Work permit',
		slug: 'john-doe-experienced-software-developer',
		isActive: true,
		createdAt: new Date('2024-01-15T10:00:00Z'),
	},
	
	anotherSeeker: {
		id: 2,
		name: 'Jane Smith',
		contact: 'jane@example.com',
		city: 'Jerusalem',
		description: 'Marketing specialist with expertise in digital marketing and social media.',
		gender: 'Female',
		isDemanded: false,
		facebook: 'https://facebook.com/janesmith',
		languages: ['English', 'Hebrew'],
		nativeLanguage: 'Hebrew',
		category: 'Marketing',
		employment: 'Part-time',
		documents: 'Passport',
		announcement: 'Seeking marketing opportunities',
		note: 'Flexible schedule',
		documentType: 'Passport',
		slug: 'jane-smith-marketing-specialist',
		isActive: true,
		createdAt: new Date('2024-01-14T14:30:00Z'),
	},
	
	seekerWithSpecialChars: {
		id: 3,
		name: 'José García',
		contact: 'jose@example.com',
		city: 'Haifa',
		description: 'Chef with international experience in fine dining restaurants.',
		gender: 'Male',
		isDemanded: true,
		facebook: null,
		languages: ['Spanish', 'English', 'Hebrew'],
		nativeLanguage: 'Spanish',
		category: 'Hospitality',
		employment: 'Full-time',
		documents: 'Work permit, culinary certificate',
		announcement: 'Looking for head chef position',
		note: 'Available for evening shifts',
		documentType: 'Work permit',
		slug: 'jose-garcia-chef-with-international',
		isActive: true,
		createdAt: new Date('2024-01-13T09:15:00Z'),
	},
	
	inactiveSeeker: {
		id: 4,
		name: 'Inactive User',
		contact: 'inactive@example.com',
		city: 'Tel Aviv',
		description: 'This seeker is inactive.',
		gender: 'Other',
		isDemanded: false,
		facebook: null,
		languages: ['English'],
		nativeLanguage: 'English',
		category: 'Other',
		employment: 'Full-time',
		documents: 'Passport',
		announcement: 'Not looking',
		note: 'Inactive',
		documentType: 'Passport',
		slug: 'inactive-user-this-seeker-is',
		isActive: false,
		createdAt: new Date('2024-01-12T16:45:00Z'),
	},
	
	seekerWithMinimalData: {
		id: 5,
		name: 'Minimal User',
		contact: 'minimal@example.com',
		city: 'Beersheba',
		description: 'Minimal data seeker.',
		gender: null,
		isDemanded: null,
		facebook: null,
		languages: [],
		nativeLanguage: null,
		category: null,
		employment: null,
		documents: null,
		announcement: null,
		note: null,
		documentType: null,
		slug: 'minimal-user-minimal-data-seeker',
		isActive: true,
		createdAt: new Date('2024-01-11T12:00:00Z'),
	},
};

// Mock seeker creation data
export const mockSeekerCreationData = {
	validSeekerData: {
		name: 'New Seeker',
		contact: 'new@example.com',
		city: 'Tel Aviv',
		description: 'New seeker looking for opportunities.',
		gender: 'Male',
		isDemanded: true,
		facebook: 'https://facebook.com/newseeker',
		languages: ['English', 'Hebrew'],
		nativeLanguage: 'English',
		category: 'IT',
		employment: 'Full-time',
		documents: 'Work permit',
		announcement: 'Looking for IT position',
		note: 'Available immediately',
		documentType: 'Work permit',
	},
	
	seekerDataWithSpecialChars: {
		name: 'José María',
		contact: 'jose@example.com',
		city: 'Jerusalem',
		description: 'Chef with international experience.\nSpecializes in Mediterranean cuisine.',
		gender: 'Male',
		isDemanded: false,
		facebook: null,
		languages: ['Spanish', 'English'],
		nativeLanguage: 'Spanish',
		category: 'Hospitality',
		employment: 'Part-time',
		documents: 'Passport',
		announcement: 'Looking for chef position',
		note: 'Flexible schedule',
		documentType: 'Passport',
	},
	
	seekerDataWithMinimalFields: {
		name: 'Minimal Seeker',
		contact: 'minimal@example.com',
		city: 'Haifa',
		description: 'Minimal data.',
		// Other fields are optional
	},
	
	seekerDataWithEmptyArrays: {
		name: 'Empty Arrays Seeker',
		contact: 'empty@example.com',
		city: 'Tel Aviv',
		description: 'Seeker with empty arrays.',
		languages: [],
		gender: 'Other',
		isDemanded: false,
	},
};

// Mock query parameters
export const mockQueryParameters = {
	basicQuery: {
		page: 1,
		limit: 10,
		lang: 'ru',
	},
	
	queryWithFilters: {
		page: 2,
		limit: 5,
		city: 'Tel Aviv',
		category: 'IT',
		employment: 'Full-time',
		documentType: 'Work permit',
		languages: ['English', 'Hebrew'],
		gender: 'Male',
		isDemanded: 'true',
		lang: 'en',
	},
	
	queryWithStringFilters: {
		page: 1,
		limit: 20,
		city: 'Jerusalem',
		category: 'Marketing',
		employment: 'Part-time',
		documentType: 'Passport',
		languages: ['Hebrew'],
		gender: 'Female',
		isDemanded: 'false',
		lang: 'he',
	},
	
	queryWithArrayLanguages: {
		page: 1,
		limit: 15,
		languages: ['English', 'Russian', 'Hebrew'],
		lang: 'ru',
	},
	
	queryWithEmptyFilters: {
		page: 1,
		limit: 10,
		city: '',
		category: '',
		employment: '',
		documentType: '',
		languages: [],
		gender: '',
		isDemanded: '',
		lang: 'en',
	},
	
	queryWithInvalidPage: {
		page: 'invalid',
		limit: 'invalid',
		lang: 'ru',
	},
	
	queryWithLargePage: {
		page: 1000,
		limit: 100,
		lang: 'ru',
	},
};

// Mock pagination data
export const mockPaginationData = {
	firstPage: {
		currentPage: 1,
		totalPages: 5,
		totalCount: 50,
		hasNextPage: true,
		hasPrevPage: false,
	},
	
	middlePage: {
		currentPage: 3,
		totalPages: 5,
		totalCount: 50,
		hasNextPage: true,
		hasPrevPage: true,
	},
	
	lastPage: {
		currentPage: 5,
		totalPages: 5,
		totalCount: 50,
		hasNextPage: false,
		hasPrevPage: true,
	},
	
	singlePage: {
		currentPage: 1,
		totalPages: 1,
		totalCount: 5,
		hasNextPage: false,
		hasPrevPage: false,
	},
	
	emptyPage: {
		currentPage: 1,
		totalPages: 0,
		totalCount: 0,
		hasNextPage: false,
		hasPrevPage: false,
	},
};

// Mock where clause data
export const mockWhereClauseData = {
	basicWhereClause: {
		isActive: true,
	},
	
	whereClauseWithCity: {
		isActive: true,
		city: 'Tel Aviv',
	},
	
	whereClauseWithCategory: {
		isActive: true,
		category: 'IT',
	},
	
	whereClauseWithEmployment: {
		isActive: true,
		employment: 'Full-time',
	},
	
	whereClauseWithDocumentType: {
		isActive: true,
		documentType: 'Work permit',
	},
	
	whereClauseWithLanguages: {
		isActive: true,
		languages: {
			hasSome: ['English', 'Hebrew'],
		},
	},
	
	whereClauseWithGender: {
		isActive: true,
		gender: 'Male',
	},
	
	whereClauseWithIsDemanded: {
		isActive: true,
		isDemanded: true,
	},
	
	whereClauseWithAllFilters: {
		isActive: true,
		city: 'Tel Aviv',
		category: 'IT',
		employment: 'Full-time',
		documentType: 'Work permit',
		languages: {
			hasSome: ['English', 'Hebrew'],
		},
		gender: 'Male',
		isDemanded: true,
	},
};

// Mock slug generation data
export const mockSlugGenerationData = {
	basicName: {
		name: 'John Doe',
		description: 'Software developer',
		expectedSlug: 'john-doe-software-developer',
	},
	
	nameWithSpecialChars: {
		name: 'José María García',
		description: 'Chef with international experience',
		expectedSlug: 'jos-mar-a-garc-a-chef-with-international-experience',
	},
	
	nameWithNumbers: {
		name: 'User123',
		description: 'Test description',
		expectedSlug: 'user123-test-description',
	},
	
	nameWithMultipleLines: {
		name: 'Multi Line',
		description: 'First line\nSecond line\nThird line',
		expectedSlug: 'multi-line-first-line-second-line-third-line',
	},
	
	nameWithSpecialCharacters: {
		name: 'Special!@#$%^&*()',
		description: 'Description with symbols',
		expectedSlug: 'special-description-with-symbols',
	},
	
	nameWithSpaces: {
		name: '  User  with  spaces  ',
		description: '  Description  with  spaces  ',
		expectedSlug: 'user-with-spaces-description-with-spaces',
	},
	
	nameWithCyrillic: {
		name: 'Иван Петров',
		description: 'Разработчик программного обеспечения',
		expectedSlug: 'иван-петров-разработчик-программного-обеспечения',
	},
	
	nameWithHebrew: {
		name: 'יוסי כהן',
		description: 'מפתח תוכנה',
		expectedSlug: 'יוסי-כהן-מפתח-תוכנה',
	},
};

// Mock city translation data
export const mockCityTranslationData = {
	telAvivTranslations: {
		ru: 'Тель-Авив',
		he: 'תל אביב',
		en: 'Tel Aviv',
		ar: 'تل أبيب',
	},
	
	jerusalemTranslations: {
		ru: 'Иерусалим',
		he: 'ירושלים',
		en: 'Jerusalem',
		ar: 'القدس',
	},
	
	haifaTranslations: {
		ru: 'Хайфа',
		he: 'חיפה',
		en: 'Haifa',
		ar: 'حيفا',
	},
	
	beershebaTranslations: {
		ru: 'Беэр-Шева',
		he: 'באר שבע',
		en: 'Beersheba',
		ar: 'بئر السبع',
	},
};

// Mock errors
export const mockErrors = {
	databaseError: new Error('Database connection failed'),
	cityNotFound: new Error('City not found'),
	seekerNotFound: new Error('Seeker not found'),
	invalidId: new Error('Invalid ID format'),
	notificationError: new Error('Notification service failed'),
	translationError: new Error('Translation service failed'),
	slugGenerationError: new Error('Slug generation failed'),
	prismaError: new Error('Prisma operation failed'),
	networkError: new Error('Network connection failed'),
	timeoutError: new Error('Operation timeout'),
};

// Mock error messages
export const mockErrorMessages = {
	databaseError: 'Database connection failed',
	cityNotFound: 'City not found',
	seekerNotFound: 'Seeker not found',
	invalidId: 'Invalid ID format',
	notificationError: 'Notification service failed',
	translationError: 'Translation service failed',
	slugGenerationError: 'Slug generation failed',
	prismaError: 'Prisma operation failed',
	networkError: 'Network connection failed',
	timeoutError: 'Operation timeout',
};

// Mock success messages
export const mockSuccessMessages = {
	seekersRetrieved: 'Seekers retrieved successfully',
	seekerCreated: 'Seeker created successfully',
	seekerRetrieved: 'Seeker retrieved successfully',
	seekerDeleted: 'Seeker deleted successfully',
	cityTranslated: 'City name translated successfully',
	slugGenerated: 'Slug generated successfully',
	notificationSent: 'Notification sent successfully',
	filtersApplied: 'Filters applied successfully',
	paginationCalculated: 'Pagination calculated successfully',
};

// Mock console log data
export const mockConsoleLogData = {
	serviceProcessingQuery: 'Service processing query',
	cityFilterApplied: 'City filter applied',
	categoryFilterApplied: 'Category filter applied',
	employmentFilterApplied: 'Employment filter applied',
	documentTypeFilterApplied: 'Document type filter applied',
	languagesFilterApplied: 'Languages filter applied',
	genderFilterApplied: 'Gender filter applied',
	isDemandedFilterApplied: 'IsDemanded filter applied',
	seekersRetrieved: 'Seekers retrieved successfully',
	notificationFailed: '❌ Failed to send notification for new candidate:',
	errorTranslatingCity: 'Error translating city name:',
};

// Mock service responses
export const mockServiceResponses = {
	getAllSeekersSuccess: {
		seekers: [
			{
				...mockSeekerData.validSeeker,
				city: 'Тель-Авив',
			},
			{
				...mockSeekerData.anotherSeeker,
				city: 'Иерусалим',
			},
		],
		pagination: mockPaginationData.firstPage,
	},
	
	createSeekerSuccess: mockSeekerData.validSeeker,
	
	getSeekerBySlugSuccess: mockSeekerData.validSeeker,
	
	getSeekerByIdSuccess: mockSeekerData.validSeeker,
	
	deleteSeekerSuccess: mockSeekerData.validSeeker,
	
	translateCityNameSuccess: 'Тель-Авив',
	
	generateSlugSuccess: 'john-doe-software-developer',
};

// Mock data type conversions
export const mockDataConversions = {
	string: {
		name: 'John Doe',
		contact: 'john@example.com',
		city: 'Tel Aviv',
		description: 'Software developer',
		gender: 'Male',
		category: 'IT',
		employment: 'Full-time',
		documentType: 'Work permit',
		slug: 'john-doe-software-developer',
	},
	
	number: {
		id: 1,
		page: 1,
		limit: 10,
		totalCount: 50,
		totalPages: 5,
		currentPage: 1,
		skip: 0,
		take: 10,
	},
	
	boolean: {
		isActive: true,
		isDemanded: true,
		hasNextPage: true,
		hasPrevPage: false,
	},
	
	array: {
		languages: ['English', 'Hebrew', 'Russian'],
		translations: [
			{ lang: 'ru', name: 'Тель-Авив' },
			{ lang: 'he', name: 'תל אביב' },
		],
	},
	
	object: {
		seeker: mockSeekerData.validSeeker,
		city: mockCityData.telAviv,
		pagination: mockPaginationData.firstPage,
		whereClause: mockWhereClauseData.basicWhereClause,
	},
};

// Mock filtering logic
export const mockFilteringLogic = {
	buildWhereClause: (filters) => {
		const whereClause = { isActive: true };
		
		if (filters.city) whereClause.city = filters.city;
		if (filters.category) whereClause.category = filters.category;
		if (filters.employment) whereClause.employment = filters.employment;
		if (filters.documentType) whereClause.documentType = filters.documentType;
		if (filters.languages && Array.isArray(filters.languages) && filters.languages.length > 0) {
			whereClause.languages = { hasSome: filters.languages };
		}
		if (filters.gender) whereClause.gender = filters.gender;
		if (filters.isDemanded !== undefined) {
			whereClause.isDemanded = filters.isDemanded === 'true' || filters.isDemanded === true;
		}
		
		return whereClause;
	},
	
	applyFilters: (seekers, filters) => {
		return seekers.filter(seeker => {
			if (filters.city && seeker.city !== filters.city) return false;
			if (filters.category && seeker.category !== filters.category) return false;
			if (filters.employment && seeker.employment !== filters.employment) return false;
			if (filters.documentType && seeker.documentType !== filters.documentType) return false;
			if (filters.languages && Array.isArray(filters.languages) && filters.languages.length > 0) {
				const hasLanguage = filters.languages.some(lang => seeker.languages.includes(lang));
				if (!hasLanguage) return false;
			}
			if (filters.gender && seeker.gender !== filters.gender) return false;
			if (filters.isDemanded !== undefined) {
				const isDemanded = filters.isDemanded === 'true' || filters.isDemanded === true;
				if (seeker.isDemanded !== isDemanded) return false;
			}
			return true;
		});
	},
};

// Mock pagination logic
export const mockPaginationLogic = {
	calculatePagination: (page, limit, totalCount) => {
		const currentPage = parseInt(page);
		const itemsPerPage = parseInt(limit);
		const totalPages = Math.ceil(totalCount / itemsPerPage);
		const skip = (currentPage - 1) * itemsPerPage;
		const take = itemsPerPage;
		
		return {
			currentPage,
			totalPages,
			totalCount,
			hasNextPage: currentPage < totalPages,
			hasPrevPage: currentPage > 1,
			skip,
			take,
		};
	},
	
	validatePagination: (page, limit) => {
		const currentPage = parseInt(page);
		const itemsPerPage = parseInt(limit);
		
		return {
			page: isNaN(currentPage) || currentPage < 1 ? 1 : currentPage,
			limit: isNaN(itemsPerPage) || itemsPerPage < 1 ? 10 : itemsPerPage,
		};
	},
};

// Mock slug generation logic
export const mockSlugGenerationLogic = {
	generateSlug: (name, description) => {
		return (name + '-' + description.split('\\n')[0])
			.toLowerCase()
			.replace(/[^a-zа-я0-9]+/gi, '-')
			.replace(/^-+|-+$/g, '');
	},
	
	validateSlug: (slug) => {
		return typeof slug === 'string' && slug.length > 0 && /^[a-zа-я0-9-]+$/.test(slug);
	},
	
	normalizeSlug: (slug) => {
		return slug
			.toLowerCase()
			.replace(/[^a-zа-я0-9-]/g, '-')
			.replace(/-+/g, '-')
			.replace(/^-+|-+$/g, '');
	},
};

// Mock city translation logic
export const mockCityTranslationLogic = {
	translateCityName: async (cityName, lang = 'ru') => {
		const translations = {
			'Tel Aviv': {
				ru: 'Тель-Авив',
				he: 'תל אביב',
				en: 'Tel Aviv',
				ar: 'تل أبيب',
			},
			'Jerusalem': {
				ru: 'Иерусалим',
				he: 'ירושלים',
				en: 'Jerusalem',
				ar: 'القدس',
			},
			'Haifa': {
				ru: 'Хайфа',
				he: 'חיפה',
				en: 'Haifa',
				ar: 'حيفا',
			},
		};
		
		return translations[cityName]?.[lang] || cityName;
	},
	
	getAvailableLanguages: () => {
		return ['ru', 'he', 'en', 'ar'];
	},
	
	isValidLanguage: (lang) => {
		return ['ru', 'he', 'en', 'ar'].includes(lang);
	},
};

// Mock notification logic
export const mockNotificationLogic = {
	sendNotification: async (seeker) => {
		// Mock notification sending
		return true;
	},
	
	handleNotificationError: (error) => {
		console.error('❌ Failed to send notification for new candidate:', error);
		// Don't fail the seeker creation if notification fails
	},
	
	validateSeekerForNotification: (seeker) => {
		return !!(seeker && seeker.id && seeker.name && seeker.contact);
	},
};

// Reset mocks before each test
export const resetSeekerServiceMocks = () => {
	mockPrisma.city.findFirst.mockClear();
	mockPrisma.seeker.count.mockClear();
	mockPrisma.seeker.findMany.mockClear();
	mockPrisma.seeker.create.mockClear();
	mockPrisma.seeker.findUnique.mockClear();
	mockPrisma.seeker.delete.mockClear();
	mockNotificationService.sendSingleCandidateNotification.mockClear();
	mockConsoleLog.mockClear();
	mockConsoleError.mockClear();
	vi.clearAllMocks();
};

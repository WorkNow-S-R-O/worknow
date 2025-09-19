import { vi } from 'vitest';

// Mock Prisma client
export const mockPrisma = {
	category: {
		findMany: vi.fn(),
	},
};

// Mock console methods
export const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
export const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

// Mock request and response objects
export const mockRequest = {
	query: {
		lang: 'ru',
	},
};

export const mockResponse = {
	json: vi.fn(),
	status: vi.fn().mockReturnThis(),
};

// Mock category data
export const mockCategoryData = {
	categoriesWithTranslations: [
		{
			id: 1,
			name: 'IT',
			translations: [
				{ lang: 'ru', name: 'IT' },
				{ lang: 'en', name: 'Information Technology' },
				{ lang: 'he', name: 'טכנולוגיית מידע' },
				{ lang: 'ar', name: 'تكنولوجيا المعلومات' },
			],
		},
		{
			id: 2,
			name: 'Marketing',
			translations: [
				{ lang: 'ru', name: 'Маркетинг' },
				{ lang: 'en', name: 'Marketing' },
				{ lang: 'he', name: 'שיווק' },
				{ lang: 'ar', name: 'تسويق' },
			],
		},
		{
			id: 3,
			name: 'Sales',
			translations: [
				{ lang: 'ru', name: 'Продажи' },
				{ lang: 'en', name: 'Sales' },
				{ lang: 'he', name: 'מכירות' },
				{ lang: 'ar', name: 'مبيعات' },
			],
		},
		{
			id: 4,
			name: 'Design',
			translations: [
				{ lang: 'ru', name: 'Дизайн' },
				{ lang: 'en', name: 'Design' },
				{ lang: 'he', name: 'עיצוב' },
				{ lang: 'ar', name: 'تصميم' },
			],
		},
		{
			id: 5,
			name: 'Finance',
			translations: [
				{ lang: 'ru', name: 'Финансы' },
				{ lang: 'en', name: 'Finance' },
				{ lang: 'he', name: 'כספים' },
				{ lang: 'ar', name: 'مالية' },
			],
		},
	],
	
	categoriesWithPartialTranslations: [
		{
			id: 1,
			name: 'IT',
			translations: [
				{ lang: 'ru', name: 'IT' },
				{ lang: 'en', name: 'Information Technology' },
				// Missing he and ar translations
			],
		},
		{
			id: 2,
			name: 'Marketing',
			translations: [
				{ lang: 'en', name: 'Marketing' },
				{ lang: 'he', name: 'שיווק' },
				// Missing ru and ar translations
			],
		},
	],
	
	categoriesWithNoTranslations: [
		{
			id: 1,
			name: 'IT',
			translations: [],
		},
		{
			id: 2,
			name: 'Marketing',
			translations: [],
		},
	],
	
	categoriesWithNullTranslations: [
		{
			id: 1,
			name: 'IT',
			translations: null,
		},
		{
			id: 2,
			name: 'Marketing',
			translations: undefined,
		},
	],
	
	singleCategory: {
		id: 1,
		name: 'IT',
		translations: [
			{ lang: 'ru', name: 'IT' },
			{ lang: 'en', name: 'Information Technology' },
			{ lang: 'he', name: 'טכנולוגיית מידע' },
			{ lang: 'ar', name: 'تكنولوجيا المعلومات' },
		],
	},
	
	emptyCategories: [],
};

// Mock processed category data
export const mockProcessedCategoryData = {
	russianCategories: [
		{ id: 1, label: 'IT' },
		{ id: 2, label: 'Маркетинг' },
		{ id: 3, label: 'Продажи' },
		{ id: 4, label: 'Дизайн' },
		{ id: 5, label: 'Финансы' },
	],
	
	englishCategories: [
		{ id: 1, label: 'Information Technology' },
		{ id: 2, label: 'Marketing' },
		{ id: 3, label: 'Sales' },
		{ id: 4, label: 'Design' },
		{ id: 5, label: 'Finance' },
	],
	
	hebrewCategories: [
		{ id: 1, label: 'טכנולוגיית מידע' },
		{ id: 2, label: 'שיווק' },
		{ id: 3, label: 'מכירות' },
		{ id: 4, label: 'עיצוב' },
		{ id: 5, label: 'כספים' },
	],
	
	arabicCategories: [
		{ id: 1, label: 'تكنولوجيا المعلومات' },
		{ id: 2, label: 'تسويق' },
		{ id: 3, label: 'مبيعات' },
		{ id: 4, label: 'تصميم' },
		{ id: 5, label: 'مالية' },
	],
	
	categoriesWithFallback: [
		{ id: 1, label: 'IT' }, // Falls back to original name
		{ id: 2, label: 'Marketing' }, // Falls back to original name
	],
	
	emptyProcessedCategories: [],
};

// Mock service responses
export const mockServiceResponses = {
	successResponse: {
		categories: mockProcessedCategoryData.russianCategories,
		status: 200,
	},
	
	errorResponse: {
		error: 'Ошибка при получении категорий',
		status: 500,
	},
	
	emptyResponse: {
		categories: [],
		status: 200,
	},
};

// Mock errors
export const mockErrors = {
	databaseError: new Error('Database connection failed'),
	categoryNotFoundError: new Error('Categories not found'),
	translationError: new Error('Translation processing failed'),
	queryError: new Error('Query execution failed'),
	networkError: new Error('Network error'),
	timeoutError: new Error('Operation timeout'),
	validationError: new Error('Validation failed'),
	permissionError: new Error('Permission denied'),
	serverError: new Error('Internal server error'),
	unknownError: new Error('Unknown error occurred'),
};

// Mock error messages
export const mockErrorMessages = {
	databaseError: 'Database connection failed',
	categoryNotFoundError: 'Categories not found',
	translationError: 'Translation processing failed',
	queryError: 'Query execution failed',
	networkError: 'Network error',
	timeoutError: 'Operation timeout',
	validationError: 'Validation failed',
	permissionError: 'Permission denied',
	serverError: 'Internal server error',
	unknownError: 'Unknown error occurred',
	categoryErrorRussian: 'Ошибка при получении категорий',
};

// Mock success messages
export const mockSuccessMessages = {
	categoriesRetrieved: 'Categories retrieved successfully',
	translationApplied: 'Translation applied successfully',
	fallbackUsed: 'Fallback to original name used',
	operationCompleted: 'Operation completed successfully',
	categoriesProcessed: 'Categories processed successfully',
};

// Mock console log data
export const mockConsoleLogData = {
	categoryError: 'Ошибка при получении категорий:',
	categoriesRetrieved: 'Categories retrieved successfully',
	translationApplied: 'Translation applied successfully',
	fallbackUsed: 'Fallback to original name used',
	queryExecuted: 'Query executed successfully',
	responseSent: 'Response sent successfully',
};

// Mock data type conversions
export const mockDataConversions = {
	string: {
		lang: 'ru',
		categoryName: 'IT',
		translationName: 'IT',
		errorMessage: 'Ошибка при получении категорий',
	},
	
	number: {
		categoryId: 1,
		statusCode: 200,
		errorStatusCode: 500,
	},
	
	boolean: {
		hasTranslation: true,
		isEmpty: false,
		hasError: false,
		success: true,
	},
	
	object: {
		category: mockCategoryData.singleCategory,
		response: mockServiceResponses.successResponse,
		error: mockErrors.databaseError,
		translation: { lang: 'ru', name: 'IT' },
	},
	
	array: {
		categories: mockCategoryData.categoriesWithTranslations,
		translations: mockCategoryData.singleCategory.translations,
		processedCategories: mockProcessedCategoryData.russianCategories,
	},
	
	null: {
		translation: null,
		category: null,
		error: null,
	},
};

// Mock category processing logic
export const mockCategoryProcessingLogic = {
	processCategories: (categories, lang = 'ru') => {
		return categories.map((category) => {
			const translation = category.translations?.find((t) => t.lang === lang);
			return {
				id: category.id,
				label: translation?.name || category.name,
			};
		});
	},
	
	findTranslation: (translations, lang) => {
		return translations?.find((t) => t.lang === lang);
	},
	
	getFallbackName: (category) => {
		return category.name;
	},
	
	buildCategoryResponse: (categories) => {
		return categories.map((category) => ({
			id: category.id,
			label: category.label,
		}));
	},
	
	handleCategoryError: (error) => {
		return {
			error: 'Ошибка при получении категорий',
			details: error.message,
		};
	},
	
	handleCategorySuccess: (categories) => {
		return categories;
	},
	
	validateLanguage: (lang) => {
		return ['ru', 'en', 'he', 'ar'].includes(lang);
	},
	
	getDefaultLanguage: () => {
		return 'ru';
	},
	
	sortCategories: (categories) => {
		return categories.sort((a, b) => a.name.localeCompare(b.name));
	},
	
	filterCategories: (categories, filter) => {
		return categories.filter((category) => 
			category.name.toLowerCase().includes(filter.toLowerCase())
		);
	},
};

// Mock database operations logic
export const mockDatabaseOperationsLogic = {
	buildCategoryQuery: () => {
		return {
			orderBy: { name: 'asc' },
			include: { translations: true },
		};
	},
	
	executeCategoryQuery: async (prisma) => {
		return await prisma.category.findMany({
			orderBy: { name: 'asc' },
			include: { translations: true },
		});
	},
	
	handleDatabaseError: (error) => {
		return {
			error: 'Ошибка при получении категорий',
			details: error.message,
		};
	},
	
	handleDatabaseSuccess: (categories) => {
		return categories;
	},
	
	validateDatabaseResult: (result) => {
		return Array.isArray(result);
	},
	
	processDatabaseResult: (result) => {
		return result;
	},
};

// Mock translation logic
export const mockTranslationLogic = {
	applyTranslation: (category, lang) => {
		const translation = category.translations?.find((t) => t.lang === lang);
		return {
			id: category.id,
			label: translation?.name || category.name,
		};
	},
	
	hasTranslation: (category, lang) => {
		return category.translations?.some((t) => t.lang === lang);
	},
	
	getTranslation: (translations, lang) => {
		return translations?.find((t) => t.lang === lang);
	},
	
	getFallbackTranslation: (category) => {
		return category.name;
	},
	
	processTranslations: (categories, lang) => {
		return categories.map((category) => {
			const translation = category.translations?.find((t) => t.lang === lang);
			return {
				id: category.id,
				label: translation?.name || category.name,
			};
		});
	},
	
	validateLanguage: (lang) => {
		return ['ru', 'en', 'he', 'ar'].includes(lang);
	},
	
	getSupportedLanguages: () => {
		return ['ru', 'en', 'he', 'ar'];
	},
	
	handleTranslationError: (error) => {
		return {
			error: 'Translation processing failed',
			details: error.message,
		};
	},
};

// Mock request/response logic
export const mockRequestResponseLogic = {
	buildRequest: (query = {}) => {
		return {
			query: {
				lang: 'ru',
				...query,
			},
		};
	},
	
	buildResponse: () => {
		return {
			json: vi.fn(),
			status: vi.fn().mockReturnThis(),
		};
	},
	
	handleSuccessResponse: (res, data) => {
		res.json(data);
	},
	
	handleErrorResponse: (res, error, statusCode = 500) => {
		res.status(statusCode).json({ error: error.message });
	},
	
	validateRequest: (req) => {
		return !!(req && req.query);
	},
	
	extractLanguage: (req) => {
		return req.query.lang || 'ru';
	},
	
	handleRequestError: (error) => {
		return {
			error: 'Request processing failed',
			details: error.message,
		};
	},
};

// Reset mocks before each test
export const resetCategoryControllerMocks = () => {
	mockPrisma.category.findMany.mockClear();
	mockConsoleLog.mockClear();
	mockConsoleError.mockClear();
	mockResponse.json.mockClear();
	mockResponse.status.mockClear();
	vi.clearAllMocks();
};

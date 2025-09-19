import { vi } from 'vitest';

// Mock cityService
export const mockCityService = {
	getCitiesService: vi.fn(),
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

// Mock city data
export const mockCityData = {
	citiesWithTranslations: [
		{
			id: 1,
			name: 'Tel Aviv',
			translations: [
				{ lang: 'ru', name: 'Тель-Авив' },
				{ lang: 'en', name: 'Tel Aviv' },
				{ lang: 'he', name: 'תל אביב' },
				{ lang: 'ar', name: 'تل أبيب' },
			],
		},
		{
			id: 2,
			name: 'Jerusalem',
			translations: [
				{ lang: 'ru', name: 'Иерусалим' },
				{ lang: 'en', name: 'Jerusalem' },
				{ lang: 'he', name: 'ירושלים' },
				{ lang: 'ar', name: 'القدس' },
			],
		},
		{
			id: 3,
			name: 'Haifa',
			translations: [
				{ lang: 'ru', name: 'Хайфа' },
				{ lang: 'en', name: 'Haifa' },
				{ lang: 'he', name: 'חיפה' },
				{ lang: 'ar', name: 'حيفا' },
			],
		},
		{
			id: 4,
			name: 'Beer Sheva',
			translations: [
				{ lang: 'ru', name: 'Беэр-Шева' },
				{ lang: 'en', name: 'Beer Sheva' },
				{ lang: 'he', name: 'באר שבע' },
				{ lang: 'ar', name: 'بئر السبع' },
			],
		},
		{
			id: 5,
			name: 'Eilat',
			translations: [
				{ lang: 'ru', name: 'Эйлат' },
				{ lang: 'en', name: 'Eilat' },
				{ lang: 'he', name: 'אילת' },
				{ lang: 'ar', name: 'إيلات' },
			],
		},
	],
	
	citiesWithPartialTranslations: [
		{
			id: 1,
			name: 'Tel Aviv',
			translations: [
				{ lang: 'ru', name: 'Тель-Авив' },
				{ lang: 'en', name: 'Tel Aviv' },
				// Missing he and ar translations
			],
		},
		{
			id: 2,
			name: 'Jerusalem',
			translations: [
				{ lang: 'en', name: 'Jerusalem' },
				{ lang: 'he', name: 'ירושלים' },
				// Missing ru and ar translations
			],
		},
	],
	
	citiesWithNoTranslations: [
		{
			id: 1,
			name: 'Tel Aviv',
			translations: [],
		},
		{
			id: 2,
			name: 'Jerusalem',
			translations: [],
		},
	],
	
	citiesWithNullTranslations: [
		{
			id: 1,
			name: 'Tel Aviv',
			translations: null,
		},
		{
			id: 2,
			name: 'Jerusalem',
			translations: undefined,
		},
	],
	
	singleCity: {
		id: 1,
		name: 'Tel Aviv',
		translations: [
			{ lang: 'ru', name: 'Тель-Авив' },
			{ lang: 'en', name: 'Tel Aviv' },
			{ lang: 'he', name: 'תל אביב' },
			{ lang: 'ar', name: 'تل أبيب' },
		],
	},
	
	emptyCities: [],
};

// Mock processed city data
export const mockProcessedCityData = {
	russianCities: [
		{ id: 1, name: 'Тель-Авив' },
		{ id: 2, name: 'Иерусалим' },
		{ id: 3, name: 'Хайфа' },
		{ id: 4, name: 'Беэр-Шева' },
		{ id: 5, name: 'Эйлат' },
	],
	
	englishCities: [
		{ id: 1, name: 'Tel Aviv' },
		{ id: 2, name: 'Jerusalem' },
		{ id: 3, name: 'Haifa' },
		{ id: 4, name: 'Beer Sheva' },
		{ id: 5, name: 'Eilat' },
	],
	
	hebrewCities: [
		{ id: 1, name: 'תל אביב' },
		{ id: 2, name: 'ירושלים' },
		{ id: 3, name: 'חיפה' },
		{ id: 4, name: 'באר שבע' },
		{ id: 5, name: 'אילת' },
	],
	
	arabicCities: [
		{ id: 1, name: 'تل أبيب' },
		{ id: 2, name: 'القدس' },
		{ id: 3, name: 'حيفا' },
		{ id: 4, name: 'بئر السبع' },
		{ id: 5, name: 'إيلات' },
	],
	
	citiesWithFallback: [
		{ id: 1, name: 'Tel Aviv' }, // Falls back to original name
		{ id: 2, name: 'Jerusalem' }, // Falls back to original name
	],
	
	emptyProcessedCities: [],
};

// Mock service responses
export const mockServiceResponses = {
	successResponse: {
		cities: mockProcessedCityData.russianCities,
		status: 200,
	},
	
	errorResponse: {
		error: 'Ошибка сервера при получении городов',
		status: 500,
	},
	
	emptyResponse: {
		cities: [],
		status: 200,
	},
	
	partialErrorResponse: {
		error: 'Partial error in city service',
		status: 500,
	},
	
	networkErrorResponse: {
		error: 'Network error occurred',
		status: 500,
	},
};

// Mock errors
export const mockErrors = {
	cityServiceError: new Error('City service failed'),
	databaseError: new Error('Database connection failed'),
	cityNotFoundError: new Error('Cities not found'),
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
	cityServiceError: 'City service failed',
	databaseError: 'Database connection failed',
	cityNotFoundError: 'Cities not found',
	translationError: 'Translation processing failed',
	queryError: 'Query execution failed',
	networkError: 'Network error',
	timeoutError: 'Operation timeout',
	validationError: 'Validation failed',
	permissionError: 'Permission denied',
	serverError: 'Internal server error',
	unknownError: 'Unknown error occurred',
	cityErrorRussian: 'Ошибка сервера при получении городов',
	cityControllerError: '❌ Ошибка в getCitiesService:',
};

// Mock success messages
export const mockSuccessMessages = {
	citiesRetrieved: 'Cities retrieved successfully',
	translationApplied: 'Translation applied successfully',
	fallbackUsed: 'Fallback to original name used',
	operationCompleted: 'Operation completed successfully',
	citiesProcessed: 'Cities processed successfully',
	responseSent: 'Response sent successfully',
};

// Mock console log data
export const mockConsoleLogData = {
	cityControllerError: '❌ Ошибка в getCitiesService:',
	citiesRetrieved: 'Cities retrieved successfully',
	translationApplied: 'Translation applied successfully',
	fallbackUsed: 'Fallback to original name used',
	queryExecuted: 'Query executed successfully',
	responseSent: 'Response sent successfully',
	serviceCalled: 'City service called successfully',
};

// Mock data type conversions
export const mockDataConversions = {
	string: {
		lang: 'ru',
		cityName: 'Tel Aviv',
		translationName: 'Тель-Авив',
		errorMessage: 'Ошибка сервера при получении городов',
	},
	
	number: {
		cityId: 1,
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
		city: mockCityData.singleCity,
		response: mockServiceResponses.successResponse,
		error: mockErrors.cityServiceError,
		translation: { lang: 'ru', name: 'Тель-Авив' },
	},
	
	array: {
		cities: mockCityData.citiesWithTranslations,
		translations: mockCityData.singleCity.translations,
		processedCities: mockProcessedCityData.russianCities,
	},
	
	null: {
		translation: null,
		city: null,
		error: null,
	},
};

// Mock city processing logic
export const mockCityProcessingLogic = {
	processCities: (cities, lang = 'ru') => {
		return cities.map((city) => {
			const translation = city.translations?.find((t) => t.lang === lang);
			return {
				id: city.id,
				name: translation?.name || city.name,
			};
		});
	},
	
	findTranslation: (translations, lang) => {
		return translations?.find((t) => t.lang === lang);
	},
	
	getFallbackName: (city) => {
		return city.name;
	},
	
	buildCityResponse: (cities) => {
		return cities.map((city) => ({
			id: city.id,
			name: city.name,
		}));
	},
	
	handleCityError: (error) => {
		return {
			error: 'Ошибка сервера при получении городов',
			details: error.message,
		};
	},
	
	handleCitySuccess: (cities) => {
		return cities;
	},
	
	validateLanguage: (lang) => {
		return ['ru', 'en', 'he', 'ar'].includes(lang);
	},
	
	getDefaultLanguage: () => {
		return 'ru';
	},
	
	sortCities: (cities) => {
		return cities.sort((a, b) => a.name.localeCompare(b.name));
	},
	
	filterCities: (cities, filter) => {
		return cities.filter((city) => 
			city.name.toLowerCase().includes(filter.toLowerCase())
		);
	},
};

// Mock service integration logic
export const mockServiceIntegrationLogic = {
	callCityService: async (lang) => {
		return await mockCityService.getCitiesService(lang);
	},
	
	handleServiceResponse: (result) => {
		if (result.error) {
			return {
				success: false,
				error: result.error,
			};
		}
		return {
			success: true,
			cities: result.cities,
		};
	},
	
	handleServiceError: (error) => {
		return {
			success: false,
			error: error.message,
		};
	},
	
	validateServiceResult: (result) => {
		return result !== null && result !== undefined;
	},
	
	processServiceResult: (result) => {
		return result;
	},
	
	handleServiceSuccess: (result) => {
		return result.cities;
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
	
	handleSuccessResponse: (res, data, statusCode = 200) => {
		res.status(statusCode).json(data);
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
	
	logError: (error) => {
		console.error('❌ Ошибка в getCitiesService:', error);
	},
};

// Mock controller logic
export const mockControllerLogic = {
	processGetCitiesRequest: async (req, res) => {
		const lang = req.query.lang || 'ru';
		const result = await mockCityService.getCitiesService(lang);

		if (result.error) {
			console.error('❌ Ошибка в getCitiesService:', result.error);
			return res.status(500).json({ error: result.error });
		}

		res.status(200).json(result.cities);
	},
	
	handleControllerError: (error, res) => {
		console.error('❌ Ошибка в getCitiesService:', error);
		return res.status(500).json({ error: typeof error === 'string' ? error : error.message });
	},
	
	handleControllerSuccess: (cities, res) => {
		return res.status(200).json(cities);
	},
	
	validateControllerInput: (req) => {
		return !!(req && req.query);
	},
	
	processControllerResponse: (result, res) => {
		if (result.error) {
			return mockControllerLogic.handleControllerError(result.error, res);
		}
		return mockControllerLogic.handleControllerSuccess(result.cities, res);
	},
};

// Reset mocks before each test
export const resetCityControllerMocks = () => {
	mockCityService.getCitiesService.mockClear();
	mockConsoleLog.mockClear();
	mockConsoleError.mockClear();
	mockResponse.json.mockClear();
	mockResponse.status.mockClear();
	vi.clearAllMocks();
};

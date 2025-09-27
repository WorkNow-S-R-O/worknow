import { vi } from 'vitest';

// Mock city service
export const mockGetCitiesService = vi.fn();

// Mock categories controller
export const mockGetCategories = vi.fn();

// Mock city service module
vi.mock('../../apps/api/services/cityService.js', () => ({
	getCitiesService: mockGetCitiesService,
}));

// Mock categories controller module
vi.mock('../../apps/api/controllers/categoryController.js', () => ({
	getCategories: mockGetCategories,
}));

// Mock data
export const mockCitiesData = [
	{
		id: 1,
		name: 'Тель-Авив',
		translations: [
			{ lang: 'ru', name: 'Тель-Авив' },
			{ lang: 'en', name: 'Tel Aviv' },
			{ lang: 'he', name: 'תל אביב' },
			{ lang: 'ar', name: 'تل أبيب' },
		],
	},
	{
		id: 2,
		name: 'Иерусалим',
		translations: [
			{ lang: 'ru', name: 'Иерусалим' },
			{ lang: 'en', name: 'Jerusalem' },
			{ lang: 'he', name: 'ירושלים' },
			{ lang: 'ar', name: 'القدس' },
		],
	},
	{
		id: 3,
		name: 'Хайфа',
		translations: [
			{ lang: 'ru', name: 'Хайфа' },
			{ lang: 'en', name: 'Haifa' },
			{ lang: 'he', name: 'חיפה' },
			{ lang: 'ar', name: 'حيفا' },
		],
	},
	{
		id: 4,
		name: 'Беэр-Шева',
		translations: [
			{ lang: 'ru', name: 'Беэр-Шева' },
			{ lang: 'en', name: 'Beer Sheva' },
			{ lang: 'he', name: 'באר שבע' },
			{ lang: 'ar', name: 'بئر السبع' },
		],
	},
	{
		id: 5,
		name: 'Нетания',
		translations: [
			{ lang: 'ru', name: 'Нетания' },
			{ lang: 'en', name: 'Netanya' },
			{ lang: 'he', name: 'נתניה' },
			{ lang: 'ar', name: 'نتانيا' },
		],
	},
];

export const mockCitiesWithPartialTranslations = [
	{
		id: 1,
		name: 'Тель-Авив',
		translations: [
			{ lang: 'ru', name: 'Тель-Авив' },
			{ lang: 'en', name: 'Tel Aviv' },
			// Missing he and ar translations
		],
	},
	{
		id: 2,
		name: 'Иерусалим',
		translations: [
			{ lang: 'en', name: 'Jerusalem' },
			{ lang: 'he', name: 'ירושלים' },
			// Missing ru and ar translations
		],
	},
];

export const mockCitiesWithNoTranslations = [
	{
		id: 1,
		name: 'Тель-Авив',
		translations: [],
	},
	{
		id: 2,
		name: 'Иерусалим',
		translations: [],
	},
];

export const mockCitiesWithNullTranslations = [
	{
		id: 1,
		name: 'Тель-Авив',
		translations: null,
	},
	{
		id: 2,
		name: 'Иерусалим',
		translations: undefined,
	},
];

export const mockCitiesWithMalformedTranslations = [
	{
		id: 1,
		name: 'Тель-Авив',
		translations: [
			{ lang: 'ru' }, // Missing name property
			{ name: 'Tel Aviv' }, // Missing lang property
			{ lang: 'en', name: 'Tel Aviv' }, // Valid translation
		],
	},
];

export const mockCitiesWithLongNames = [
	{
		id: 1,
		name: 'A'.repeat(1000), // Very long name
		translations: [{ lang: 'ru', name: 'Очень длинное название города' }],
	},
];

export const mockCitiesWithSpecialChars = [
	{
		id: 1,
		name: 'Беэр-Шева',
		translations: [{ lang: 'ru', name: 'Беэр-Шева' }],
	},
	{
		id: 2,
		name: 'Рамле/Лод',
		translations: [{ lang: 'ru', name: 'Рамле/Лод' }],
	},
];

// Service response mocks
export const mockServiceResponses = {
	successRussian: {
		cities: [
			{ id: 1, name: 'Тель-Авив' },
			{ id: 2, name: 'Иерусалим' },
			{ id: 3, name: 'Хайфа' },
			{ id: 4, name: 'Беэр-Шева' },
			{ id: 5, name: 'Нетания' },
		],
	},
	successEnglish: {
		cities: [
			{ id: 1, name: 'Tel Aviv' },
			{ id: 2, name: 'Jerusalem' },
			{ id: 3, name: 'Haifa' },
			{ id: 4, name: 'Beer Sheva' },
			{ id: 5, name: 'Netanya' },
		],
	},
	successHebrew: {
		cities: [
			{ id: 1, name: 'תל אביב' },
			{ id: 2, name: 'ירושלים' },
			{ id: 3, name: 'חיפה' },
			{ id: 4, name: 'באר שבע' },
			{ id: 5, name: 'נתניה' },
		],
	},
	successArabic: {
		cities: [
			{ id: 1, name: 'تل أبيب' },
			{ id: 2, name: 'القدس' },
			{ id: 3, name: 'حيفا' },
			{ id: 4, name: 'بئر السبع' },
			{ id: 5, name: 'نتانيا' },
		],
	},
	empty: {
		cities: [],
	},
	error: {
		error: 'Ошибка сервера при получении городов',
	},
};

// Mock errors
export const mockErrors = {
	databaseError: 'Database connection failed',
	serviceError: 'Service error occurred',
	timeoutError: 'Operation timeout',
	unexpectedError: 'Unexpected error occurred',
};

// Categories mock data
export const mockCategoriesData = [
	{ id: 1, label: 'IT' },
	{ id: 2, label: 'Маркетинг' },
	{ id: 3, label: 'Продажи' },
	{ id: 4, label: 'Дизайн' },
	{ id: 5, label: 'Финансы' },
];

// Reset mocks function
export const resetCitiesMocks = () => {
	mockGetCitiesService.mockClear();
	mockGetCategories.mockClear();
	vi.clearAllMocks();
};

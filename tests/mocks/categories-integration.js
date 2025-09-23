import { vi } from 'vitest';

// Mock Prisma client
export const mockFindMany = vi.fn();
export const mockPrismaInstance = {
	category: {
		findMany: mockFindMany,
	},
};

// Mock Prisma client constructor
vi.mock('@prisma/client', () => ({
	PrismaClient: vi.fn(() => mockPrismaInstance),
}));

// Mock data
export const mockCategoriesData = [
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
];

export const mockCategoriesWithPartialTranslations = [
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
];

export const mockCategoriesWithNoTranslations = [
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
];

export const mockCategoriesWithNullTranslations = [
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
];

export const mockCategoriesWithMalformedTranslations = [
	{
		id: 1,
		name: 'IT',
		translations: [
			{ lang: 'ru' }, // Missing name property
			{ name: 'Information Technology' }, // Missing lang property
			{ lang: 'en', name: 'Information Technology' }, // Valid translation
		],
	},
];

export const mockCategoriesWithLongNames = [
	{
		id: 1,
		name: 'A'.repeat(1000), // Very long name
		translations: [
			{ lang: 'ru', name: 'Очень длинное название категории' },
		],
	},
];

export const mockCategoriesWithSpecialChars = [
	{
		id: 1,
		name: 'IT & Software',
		translations: [
			{ lang: 'ru', name: 'IT и программное обеспечение' },
		],
	},
	{
		id: 2,
		name: 'Sales/Marketing',
		translations: [
			{ lang: 'ru', name: 'Продажи/Маркетинг' },
		],
	},
];

// Mock errors
export const mockErrors = {
	databaseError: new Error('Database connection failed'),
	queryError: new Error('Query execution failed'),
	timeoutError: new Error('Operation timeout'),
	unexpectedError: new Error('Unexpected error occurred'),
};

// Reset mocks function
export const resetCategoriesMocks = () => {
	mockFindMany.mockClear();
	vi.clearAllMocks();
};


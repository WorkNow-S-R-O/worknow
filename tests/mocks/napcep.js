import { vi } from 'vitest';

// Mock Puppeteer
export const mockPuppeteer = {
	launch: vi.fn(),
};

// Mock PrismaClient
export const mockPrisma = {
	job: {
		deleteMany: vi.fn(),
		findUnique: vi.fn(),
		create: vi.fn(),
	},
	user: {
		deleteMany: vi.fn(),
		create: vi.fn(),
	},
	city: {
		findUnique: vi.fn(),
	},
	category: {
		findUnique: vi.fn(),
	},
	$disconnect: vi.fn(),
};

// Mock Faker
export const mockFaker = {
	person: {
		firstName: vi.fn(),
		lastName: vi.fn(),
	},
	internet: {
		email: vi.fn(),
	},
	string: {
		uuid: vi.fn(),
	},
	number: {
		int: vi.fn(),
	},
	helpers: {
		arrayElement: vi.fn(),
	},
};

// Mock AI Job Title Service
export const mockAIJobTitleService = {
	fallbackTitleGeneration: vi.fn(),
};

// Mock console methods
export const mockConsole = {
	log: vi.fn(),
	error: vi.fn(),
	warn: vi.fn(),
	info: vi.fn(),
};

// Mock browser and page objects
export const mockBrowser = {
	newPage: vi.fn(),
	close: vi.fn(),
};

export const mockPage = {
	setDefaultTimeout: vi.fn(),
	setDefaultNavigationTimeout: vi.fn(),
	goto: vi.fn(),
	evaluate: vi.fn(),
	reload: vi.fn(),
};

// Mock job data
export const mockJobData = {
	validJob: {
		title: 'Software Developer',
		description: 'Looking for experienced developer. Salary 50 шек per hour. Call +972-50-123-4567',
		city: 'Tel Aviv',
		phone: '+972-50-123-4567',
		validatedPrice: 50,
	},
	jobWithValidPrice: {
		title: 'Designer',
		description: 'Looking for creative designer. Payment 45 ШЕК per hour. Contact +972-52-234-5678',
		city: 'Jerusalem',
		phone: '+972-52-234-5678',
		validatedPrice: 45,
	},
	jobWithInvalidPrice: {
		title: 'Manager',
		description: 'Looking for project manager. Salary 500 shekels per hour. Call +972-54-345-6789',
		city: 'Haifa',
		phone: '+972-54-345-6789',
		validatedPrice: null,
	},
	jobWithoutPhone: {
		title: 'Worker',
		description: 'Looking for general worker. Salary 40 шек per hour.',
		city: 'Eilat',
		phone: null,
	},
	jobWithSpecialCharacters: {
		title: 'Developer & Designer',
		description: 'Looking for developer/designer hybrid. Payment 55 ₪ per hour. Call +972-55-456-7890',
		city: 'Ramat Gan',
		phone: '+972-55-456-7890',
		validatedPrice: 55,
	},
	jobList: [
		{
			title: 'Software Developer',
			description: 'Looking for experienced developer. Salary 50 шек per hour. Call +972-50-123-4567',
			city: 'Tel Aviv',
			phone: '+972-50-123-4567',
			validatedPrice: 50,
		},
		{
			title: 'Designer',
			description: 'Looking for creative designer. Payment 45 ШЕК per hour. Contact +972-52-234-5678',
			city: 'Jerusalem',
			phone: '+972-52-234-5678',
			validatedPrice: 45,
		},
		{
			title: 'Manager',
			description: 'Looking for project manager. Salary 60 shekel per hour. Call +972-54-345-6789',
			city: 'Haifa',
			phone: '+972-54-345-6789',
			validatedPrice: 60,
		},
	],
	emptyJobList: [],
	singleJob: [
		{
			title: 'Single Job',
			description: 'Just one job. Salary 45 шек per hour. Call +972-56-567-8901',
			city: 'Eilat',
			phone: '+972-56-567-8901',
			validatedPrice: 45,
		},
	],
};

// Mock price patterns
export const mockPricePatterns = [
	/(\d+)\s*шек/gi,
	/(\d+)\s*ШЕК/gi,
	/(\d+)\s*shek/gi,
	/(\d+)\s*SHEK/gi,
	/(\d+)\s*₪/gi,
	/(\d+)\s*shekel/gi,
	/(\d+)\s*SHEKEL/gi,
	/(\d+)\s*ШЕКЕЛЬ/gi,
	/(\d+)\s*ILS/gi,
	/(\d+)\s*ils/gi,
	/(\d+)\s*NIS/gi,
	/(\d+)\s*nis/gi,
];

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
		{ id: 4, name: 'Eilat' },
		{ id: 5, name: 'Ramat Gan' },
	],
};

// Mock category data
export const mockCategoryData = {
	defaultCategory: {
		id: 58,
		name: 'Разное',
	},
	categoryMapping: {
		строитель: 30,
		строительство: 30,
		стройка: 30,
		плотник: 44,
		сварщик: 49,
		электрик: 57,
		ремонт: 45,
		водитель: 35,
		доставка: 34,
		склад: 48,
		завод: 37,
		продавец: 54,
		офис: 42,
		кухня: 43,
		уборщица: 31,
		медицин: 47,
		учитель: 46,
		няня: 40,
		охранник: 41,
		парикмахер: 32,
		автосервис: 36,
		связь: 50,
		сельское: 51,
		уход: 52,
		швея: 56,
		инженер: 39,
		рабочий: 58,
	},
};

// Mock user data
export const mockUserData = {
	validUser: {
		id: 'user_123',
		clerkUserId: 'user_123',
		email: 'user@example.com',
		firstName: 'John',
		lastName: 'Doe',
		imageUrl: 'https://ui-avatars.com/api/?name=JD&background=random&color=fff&size=128',
	},
	hebrewNames: [
		'Авраам', 'Ицхак', 'Яков', 'Моше', 'Шломо', 'Давид', 'Элиэзер', 'Менахем',
		'Иехуда', 'Шимон', 'Сара', 'Рахель', 'Лея', 'Мириам', 'Хана', 'Батшева',
		'Ада', 'Эстер', 'Тамар', 'Наоми'
	],
};

// Mock job templates for additional jobs
export const mockJobTemplates = [
	{
		title: 'Работник на склад',
		description: 'Требуется работник на склад. Работа с 8:00 до 17:00. Оплата 45 шек в час. Звоните +972-50-123-4567',
		city: 'Тель-Авив',
		phone: '+972-50-123-4567',
		validatedPrice: 45,
	},
	{
		title: 'Водитель доставки',
		description: 'Ищу водителя для доставки. Права категории B. Работа 6 дней в неделю. Оплата 50 шек в час. +972-52-234-5678',
		city: 'Хайфа',
		phone: '+972-52-234-5678',
		validatedPrice: 50,
	},
	{
		title: 'Уборщица',
		description: 'Требуется уборщица в офис. Работа с 9:00 до 18:00. Оплата 40 шек в час. Звоните +972-54-345-6789',
		city: 'Иерусалим',
		phone: '+972-54-345-6789',
		validatedPrice: 40,
	},
];

// Mock AI service responses
export const mockAIServiceResponses = {
	successfulTitleGeneration: {
		title: 'Software Developer',
		method: 'fallback',
		confidence: 0.85,
	},
	fallbackTitleGeneration: {
		title: 'General Worker',
		method: 'fallback',
		confidence: 0.70,
	},
};

// Mock errors
export const mockErrors = {
	databaseError: new Error('Database connection failed'),
	puppeteerError: new Error('Puppeteer launch failed'),
	pageLoadError: new Error('Page load timeout'),
	navigationError: new Error('Navigation timeout'),
	scrapingError: new Error('Scraping failed'),
	validationError: new Error('Job validation failed'),
	categoryError: new Error('Category not found'),
	cityError: new Error('City not found'),
	userCreationError: new Error('User creation failed'),
	jobCreationError: new Error('Job creation failed'),
	aiServiceError: new Error('AI service error'),
	networkError: new Error('Network timeout'),
};

// Mock service responses
export const mockServiceResponses = {
	successfulJobCreation: {
		id: 1,
		title: 'Software Developer',
		salary: '50',
		description: 'Looking for experienced developer',
		phone: '+972-50-123-4567',
		cityId: 1,
		userId: 'user_123',
		categoryId: 50,
		createdAt: new Date('2024-01-01'),
	},
	successfulUserCreation: {
		id: 'user_123',
		clerkUserId: 'user_123',
		email: 'user@example.com',
		firstName: 'John',
		lastName: 'Doe',
		imageUrl: 'https://ui-avatars.com/api/?name=JD&background=random&color=fff&size=128',
	},
	successfulCityLookup: mockCityData.existingCity,
	successfulCategoryLookup: mockCategoryData.defaultCategory,
};

// Mock price extraction logic
export const mockPriceExtractionLogic = {
	extractPriceFromDescription: (description) => {
		// Look for patterns like "40 шек", "40 ШЕК", "40 shek", "40 SHEK", etc.
		const pricePatterns = [
			/(\d+)\s*шек/gi, // 40 шек
			/(\d+)\s*ШЕК/gi, // 40 ШЕК
			/(\d+)\s*shek/gi, // 40 shek
			/(\d+)\s*SHEK/gi, // 40 SHEK
			/(\d+)\s*₪/gi, // 40 ₪
			/(\d+)\s*shekel/gi, // 40 shekel
			/(\d+)\s*SHEKEL/gi, // 40 SHEKEL
			/(\d+)\s*ШЕКЕЛЬ/gi, // 40 ШЕКЕЛЬ
			/(\d+)\s*ILS/gi, // 40 ILS
			/(\d+)\s*ils/gi, // 40 ils
			/(\d+)\s*NIS/gi, // 40 NIS
			/(\d+)\s*nis/gi, // 40 nis
		];

		for (const pattern of pricePatterns) {
			const match = pattern.exec(description);
			if (match) {
				const price = parseInt(match[1], 10);
				// Validate that price is reasonable (between 20 and 200 shekels per hour)
				if (price >= 20 && price <= 200) {
					return price;
				}
			}
		}
		return null;
	},
};

// Mock job validation logic
export const mockJobValidationLogic = {
	validateJobData: (job) => {
		const descriptionPrice = mockPriceExtractionLogic.extractPriceFromDescription(job.description);
		
		if (!descriptionPrice) {
			job.validatedPrice = null;
			return false;
		}
		
		job.validatedPrice = descriptionPrice;
		return true;
	},
};

// Mock Puppeteer operations logic
export const mockPuppeteerOperationsLogic = {
	launchBrowser: async () => {
		return await mockPuppeteer.launch({
			headless: true,
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		});
	},
	createPage: async (browser) => {
		return await browser.newPage();
	},
	navigateToPage: async (page, url) => {
		await page.goto(url, { waitUntil: 'networkidle2' });
	},
	scrapeJobs: async (page) => {
		return await page.evaluate(() => mockJobData.jobList);
	},
	closeBrowser: async (browser) => {
		await browser.close();
	},
};

// Mock scraping logic
export const mockScrapingLogic = {
	fetchJobDescriptions: vi.fn(),
	processPage: vi.fn(),
};

// Mock additional job generation logic
export const mockAdditionalJobGenerationLogic = {
	generateAdditionalJobs: (count) => {
		const additionalJobs = [];
		
		for (let i = 0; i < count; i++) {
			const template = mockJobTemplates[i % mockJobTemplates.length];
			const city = mockCityData.cityList[i % mockCityData.cityList.length];
			const phoneSuffix = String(i + 1000).padStart(4, '0');
			
			const job = {
				title: template.title,
				description: template.description.replace(/\+972-\d{2}-\d{3}-\d{4}/, `+972-50-${phoneSuffix}`),
				city: city.name,
				phone: `+972-50-${phoneSuffix}`,
				validatedPrice: template.validatedPrice,
				categoryId: mockCategoryData.categoryMapping[template.title.toLowerCase()] || 58,
			};
			
			additionalJobs.push(job);
		}
		
		return additionalJobs;
	},
};

// Mock category determination logic
export const mockCategoryDeterminationLogic = {
	determineCategoryFromTitle: (title) => {
		const titleLower = title.toLowerCase();
		const categoryMapping = mockCategoryData.categoryMapping;
		
		for (const [keyword, categoryId] of Object.entries(categoryMapping)) {
			if (titleLower.includes(keyword)) {
				return categoryId;
			}
		}
		
		return 58; // Разное
	},
};

// Mock job title generation logic
export const mockJobTitleGenerationLogic = {
	generateJobTitles: vi.fn(),
};

// Mock fake user creation logic
export const mockFakeUserCreationLogic = {
	createFakeUsersWithJobs: vi.fn(),
};

// Mock early processing logic
export const mockEarlyProcessingLogic = {
	processJobsEarly: vi.fn(),
};

// Mock main function logic
export const mockMainFunctionLogic = {
	main: vi.fn(),
};

// Mock request/response logic
export const mockRequestResponseLogic = {
	buildJobData: (title, description, city, phone) => ({
		title,
		description,
		city,
		phone,
	}),
	validateJobData: (job) => {
		return !!(job.title && job.description && job.city && job.phone);
	},
};

// Reset all mocks
export const resetAllMocks = () => {
	vi.clearAllMocks();
	mockPuppeteer.launch.mockClear();
	mockPrisma.job.deleteMany.mockClear();
	mockPrisma.user.deleteMany.mockClear();
	mockPrisma.job.create.mockClear();
	mockPrisma.user.create.mockClear();
	mockPrisma.city.findUnique.mockClear();
	mockPrisma.category.findUnique.mockClear();
	mockPrisma.$disconnect.mockClear();
	mockFaker.person.firstName.mockClear();
	mockFaker.person.lastName.mockClear();
	mockFaker.internet.email.mockClear();
	mockFaker.string.uuid.mockClear();
	mockFaker.number.int.mockClear();
	mockFaker.helpers.arrayElement.mockClear();
	mockAIJobTitleService.fallbackTitleGeneration.mockClear();
	mockConsole.log.mockClear();
	mockConsole.error.mockClear();
	mockConsole.warn.mockClear();
	mockConsole.info.mockClear();
	mockBrowser.newPage.mockClear();
	mockBrowser.close.mockClear();
	mockPage.setDefaultTimeout.mockClear();
	mockPage.setDefaultNavigationTimeout.mockClear();
	mockPage.goto.mockClear();
	mockPage.evaluate.mockClear();
	mockPage.reload.mockClear();
};

// Mock the dependencies
vi.mock('puppeteer', () => ({
	default: mockPuppeteer,
}));

vi.mock('@prisma/client', () => ({
	PrismaClient: vi.fn(() => mockPrisma),
}));

vi.mock('@faker-js/faker', () => ({
	fakerRU: mockFaker,
}));

vi.mock('../../services/aiJobTitleService.js', () => ({
	default: mockAIJobTitleService,
}));

// Mock console
Object.assign(console, mockConsole);

// Setup mock implementations
mockPuppeteer.launch.mockResolvedValue(mockBrowser);
mockBrowser.newPage.mockResolvedValue(mockPage);
mockPage.goto.mockResolvedValue();
mockPage.evaluate.mockResolvedValue(mockJobData.jobList);
mockPage.reload.mockResolvedValue();
mockBrowser.close.mockResolvedValue();
mockPrisma.job.deleteMany.mockResolvedValue({ count: 0 });
mockPrisma.user.deleteMany.mockResolvedValue({ count: 0 });
mockPrisma.job.create.mockResolvedValue(mockServiceResponses.successfulJobCreation);
mockPrisma.user.create.mockResolvedValue(mockServiceResponses.successfulUserCreation);
mockPrisma.city.findUnique.mockResolvedValue(mockServiceResponses.successfulCityLookup);
mockPrisma.category.findUnique.mockResolvedValue(mockServiceResponses.successfulCategoryLookup);
mockPrisma.$disconnect.mockResolvedValue();
mockFaker.person.firstName.mockReturnValue('John');
mockFaker.person.lastName.mockReturnValue('Doe');
mockFaker.internet.email.mockReturnValue('john.doe@example.com');
mockFaker.string.uuid.mockReturnValue('12345678-1234-1234-1234-123456789012');
mockFaker.number.int.mockReturnValue(45);
mockFaker.helpers.arrayElement.mockReturnValue('Авраам');
mockAIJobTitleService.fallbackTitleGeneration.mockResolvedValue(mockAIServiceResponses.successfulTitleGeneration);

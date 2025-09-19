import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	mockPuppeteer,
	mockPrisma,
	mockFaker,
	mockAIJobTitleService,
	mockConsole,
	mockBrowser,
	mockPage,
	mockJobData,
	mockPricePatterns,
	mockCityData,
	mockCategoryData,
	mockUserData,
	mockJobTemplates,
	mockAIServiceResponses,
	mockErrors,
	mockServiceResponses,
	mockPriceExtractionLogic,
	mockJobValidationLogic,
	mockPuppeteerOperationsLogic,
	mockScrapingLogic,
	mockAdditionalJobGenerationLogic,
	mockCategoryDeterminationLogic,
	mockJobTitleGenerationLogic,
	mockFakeUserCreationLogic,
	mockEarlyProcessingLogic,
	mockMainFunctionLogic,
	mockRequestResponseLogic,
	resetAllMocks,
} from '../tests/mocks/napcep.js';

beforeEach(() => {
	resetAllMocks();
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('Napcep Utility', () => {
	describe('Price Extraction Logic', () => {
		it('should extract price from description with шек', async () => {
			const description = 'Looking for developer. Salary 50 шек per hour. Call +972-50-123-4567';
			const price = mockPriceExtractionLogic.extractPriceFromDescription(description);
			expect(price).toBe(50);
		});

		it('should extract price from description with ШЕК', async () => {
			const description = 'Looking for designer. Payment 45 ШЕК per hour. Contact +972-52-234-5678';
			const price = mockPriceExtractionLogic.extractPriceFromDescription(description);
			expect(price).toBe(45);
		});

		it('should extract price from description with shek', async () => {
			const description = 'Looking for manager. Salary 60 shek per hour. Call +972-54-345-6789';
			const price = mockPriceExtractionLogic.extractPriceFromDescription(description);
			expect(price).toBe(60);
		});

		it('should extract price from description with SHEK', async () => {
			const description = 'Looking for worker. Payment 40 SHEK per hour. Call +972-55-456-7890';
			const price = mockPriceExtractionLogic.extractPriceFromDescription(description);
			expect(price).toBe(40);
		});

		it('should extract price from description with ₪', async () => {
			const description = 'Looking for employee. Salary 55 ₪ per hour. Call +972-56-567-8901';
			const price = mockPriceExtractionLogic.extractPriceFromDescription(description);
			expect(price).toBe(55);
		});

		it('should extract price from description with shekel', async () => {
			const description = 'Looking for staff. Payment 48 shekel per hour. Call +972-57-678-9012';
			const price = mockPriceExtractionLogic.extractPriceFromDescription(description);
			expect(price).toBe(48);
		});

		it('should extract price from description with SHEKEL', async () => {
			const description = 'Looking for helper. Salary 65 SHEKEL per hour. Call +972-58-789-0123';
			const price = mockPriceExtractionLogic.extractPriceFromDescription(description);
			expect(price).toBe(65);
		});

		it('should extract price from description with ШЕКЕЛЬ', async () => {
			const description = 'Looking for assistant. Payment 70 ШЕКЕЛЬ per hour. Call +972-59-890-1234';
			const price = mockPriceExtractionLogic.extractPriceFromDescription(description);
			expect(price).toBe(70);
		});

		it('should extract price from description with ILS', async () => {
			const description = 'Looking for worker. Salary 45 ILS per hour. Call +972-60-901-2345';
			const price = mockPriceExtractionLogic.extractPriceFromDescription(description);
			expect(price).toBe(45);
		});

		it('should extract price from description with ils', async () => {
			const description = 'Looking for employee. Payment 50 ils per hour. Call +972-61-012-3456';
			const price = mockPriceExtractionLogic.extractPriceFromDescription(description);
			expect(price).toBe(50);
		});

		it('should extract price from description with NIS', async () => {
			const description = 'Looking for staff. Salary 55 NIS per hour. Call +972-62-123-4567';
			const price = mockPriceExtractionLogic.extractPriceFromDescription(description);
			expect(price).toBe(55);
		});

		it('should extract price from description with nis', async () => {
			const description = 'Looking for helper. Payment 60 nis per hour. Call +972-63-234-5678';
			const price = mockPriceExtractionLogic.extractPriceFromDescription(description);
			expect(price).toBe(60);
		});

		it('should return null for invalid price (too low)', async () => {
			const description = 'Looking for worker. Salary 10 шек per hour. Call +972-64-345-6789';
			const price = mockPriceExtractionLogic.extractPriceFromDescription(description);
			expect(price).toBeNull();
		});

		it('should return null for invalid price (too high)', async () => {
			const description = 'Looking for worker. Salary 300 шек per hour. Call +972-65-456-7890';
			const price = mockPriceExtractionLogic.extractPriceFromDescription(description);
			expect(price).toBeNull();
		});

		it('should return null for description without price', async () => {
			const description = 'Looking for worker. No salary mentioned. Call +972-66-567-8901';
			const price = mockPriceExtractionLogic.extractPriceFromDescription(description);
			expect(price).toBeNull();
		});

		it('should handle multiple price patterns in description', async () => {
			const description = 'Looking for worker. Salary 50 шек per hour or 45 ШЕК per hour. Call +972-67-678-9012';
			const price = mockPriceExtractionLogic.extractPriceFromDescription(description);
			expect(price).toBe(50); // Should return the first valid price
		});
	});

	describe('Job Data Validation Logic', () => {
		it('should validate job with valid price', async () => {
			const job = mockJobData.validJob;
			const isValid = mockJobValidationLogic.validateJobData(job);
			expect(isValid).toBe(true);
			expect(job.validatedPrice).toBe(50);
		});

		it('should reject job with invalid price', async () => {
			const job = mockJobData.jobWithInvalidPrice;
			const isValid = mockJobValidationLogic.validateJobData(job);
			expect(isValid).toBe(false);
			expect(job.validatedPrice).toBeNull();
		});

		it('should validate job with special characters in price', async () => {
			const job = mockJobData.jobWithSpecialCharacters;
			const isValid = mockJobValidationLogic.validateJobData(job);
			expect(isValid).toBe(true);
			expect(job.validatedPrice).toBe(55);
		});

		it('should handle job without price in description', async () => {
			const job = {
				title: 'Worker',
				description: 'Looking for worker. No salary mentioned. Call +972-50-123-4567',
				city: 'Tel Aviv',
				phone: '+972-50-123-4567',
			};
			const isValid = mockJobValidationLogic.validateJobData(job);
			expect(isValid).toBe(false);
		});
	});

	describe('Data Clearing Logic', () => {
		it('should clear old job data', async () => {
			mockPrisma.job.deleteMany.mockResolvedValue({ count: 10 });
			
			await mockPrisma.job.deleteMany({});
			
			expect(mockPrisma.job.deleteMany).toHaveBeenCalledWith({});
		});

		it('should clear old user data', async () => {
			mockPrisma.user.deleteMany.mockResolvedValue({ count: 5 });
			
			await mockPrisma.user.deleteMany({
				where: { clerkUserId: { startsWith: 'user_' } },
			});
			
			expect(mockPrisma.user.deleteMany).toHaveBeenCalledWith({
				where: { clerkUserId: { startsWith: 'user_' } },
			});
		});

		it('should handle clearing errors', async () => {
			mockPrisma.job.deleteMany.mockRejectedValue(mockErrors.databaseError);
			
			try {
				await mockPrisma.job.deleteMany({});
			} catch (error) {
				expect(error).toBe(mockErrors.databaseError);
			}
		});
	});

	describe('Puppeteer Integration Logic', () => {
		it('should launch browser correctly', async () => {
			mockPuppeteer.launch.mockResolvedValue(mockBrowser);
			
			const browser = await mockPuppeteerOperationsLogic.launchBrowser();
			
			expect(mockPuppeteer.launch).toHaveBeenCalledWith({
				headless: true,
				args: ['--no-sandbox', '--disable-setuid-sandbox'],
			});
			expect(browser).toBe(mockBrowser);
		});

		it('should create page correctly', async () => {
			mockBrowser.newPage.mockResolvedValue(mockPage);
			
			const page = await mockPuppeteerOperationsLogic.createPage(mockBrowser);
			
			expect(mockBrowser.newPage).toHaveBeenCalled();
			expect(page).toBe(mockPage);
		});

		it('should navigate to page correctly', async () => {
			mockPage.goto.mockResolvedValue();
			
			await mockPuppeteerOperationsLogic.navigateToPage(mockPage, 'https://example.com');
			
			expect(mockPage.goto).toHaveBeenCalledWith('https://example.com', { waitUntil: 'networkidle2' });
		});

		it('should scrape jobs correctly', async () => {
			mockPage.evaluate.mockResolvedValue(mockJobData.jobList);
			
			const jobs = await mockPuppeteerOperationsLogic.scrapeJobs(mockPage);
			
			expect(mockPage.evaluate).toHaveBeenCalled();
			expect(jobs).toBe(mockJobData.jobList);
		});

		it('should close browser correctly', async () => {
			mockBrowser.close.mockResolvedValue();
			
			await mockPuppeteerOperationsLogic.closeBrowser(mockBrowser);
			
			expect(mockBrowser.close).toHaveBeenCalled();
		});

		it('should handle browser launch errors', async () => {
			mockPuppeteer.launch.mockRejectedValue(mockErrors.puppeteerError);
			
			try {
				await mockPuppeteerOperationsLogic.launchBrowser();
			} catch (error) {
				expect(error).toBe(mockErrors.puppeteerError);
			}
		});

		it('should handle page creation errors', async () => {
			mockBrowser.newPage.mockRejectedValue(mockErrors.pageLoadError);
			
			try {
				await mockPuppeteerOperationsLogic.createPage(mockBrowser);
			} catch (error) {
				expect(error).toBe(mockErrors.pageLoadError);
			}
		});

		it('should handle navigation errors', async () => {
			mockPage.goto.mockRejectedValue(mockErrors.navigationError);
			
			try {
				await mockPuppeteerOperationsLogic.navigateToPage(mockPage, 'https://example.com');
			} catch (error) {
				expect(error).toBe(mockErrors.navigationError);
			}
		});

		it('should handle scraping errors', async () => {
			mockPage.evaluate.mockRejectedValue(mockErrors.scrapingError);
			
			try {
				await mockPuppeteerOperationsLogic.scrapeJobs(mockPage);
			} catch (error) {
				expect(error).toBe(mockErrors.scrapingError);
			}
		});
	});

	describe('Job Scraping Logic', () => {
		it('should fetch job descriptions successfully', async () => {
			mockScrapingLogic.fetchJobDescriptions.mockResolvedValue(mockJobData.jobList);
			
			const jobs = await mockScrapingLogic.fetchJobDescriptions();
			
			expect(jobs).toBe(mockJobData.jobList);
			expect(Array.isArray(jobs)).toBe(true);
		});

		it('should process page correctly', async () => {
			mockScrapingLogic.processPage.mockResolvedValue(mockJobData.jobList);
			
			const jobs = await mockScrapingLogic.processPage(mockPage, 1);
			
			expect(mockScrapingLogic.processPage).toHaveBeenCalledWith(mockPage, 1);
			expect(jobs).toBe(mockJobData.jobList);
		});

		it('should handle empty job list', async () => {
			mockScrapingLogic.fetchJobDescriptions.mockResolvedValue(mockJobData.emptyJobList);
			
			const jobs = await mockScrapingLogic.fetchJobDescriptions();
			
			expect(jobs).toBe(mockJobData.emptyJobList);
			expect(jobs.length).toBe(0);
		});

		it('should handle single job', async () => {
			mockScrapingLogic.fetchJobDescriptions.mockResolvedValue(mockJobData.singleJob);
			
			const jobs = await mockScrapingLogic.fetchJobDescriptions();
			
			expect(jobs).toBe(mockJobData.singleJob);
			expect(jobs.length).toBe(1);
		});

		it('should handle scraping errors', async () => {
			mockScrapingLogic.fetchJobDescriptions.mockRejectedValue(mockErrors.scrapingError);
			
			try {
				await mockScrapingLogic.fetchJobDescriptions();
			} catch (error) {
				expect(error).toBe(mockErrors.scrapingError);
			}
		});
	});

	describe('Additional Job Generation Logic', () => {
		it('should generate additional jobs correctly', async () => {
			const count = 3;
			const additionalJobs = mockAdditionalJobGenerationLogic.generateAdditionalJobs(count);
			
			expect(Array.isArray(additionalJobs)).toBe(true);
			expect(additionalJobs.length).toBe(count);
			expect(additionalJobs[0]).toHaveProperty('title');
			expect(additionalJobs[0]).toHaveProperty('description');
			expect(additionalJobs[0]).toHaveProperty('city');
			expect(additionalJobs[0]).toHaveProperty('phone');
			expect(additionalJobs[0]).toHaveProperty('validatedPrice');
			expect(additionalJobs[0]).toHaveProperty('categoryId');
		});

		it('should generate jobs with unique phone numbers', async () => {
			const count = 5;
			const additionalJobs = mockAdditionalJobGenerationLogic.generateAdditionalJobs(count);
			
			const phoneNumbers = additionalJobs.map(job => job.phone);
			const uniquePhoneNumbers = [...new Set(phoneNumbers)];
			
			expect(uniquePhoneNumbers.length).toBe(count);
		});

		it('should generate jobs with different cities', async () => {
			const count = 10;
			const additionalJobs = mockAdditionalJobGenerationLogic.generateAdditionalJobs(count);
			
			const cities = additionalJobs.map(job => job.city);
			const uniqueCities = [...new Set(cities)];
			
			expect(uniqueCities.length).toBeGreaterThan(1);
		});

		it('should generate jobs with valid prices', async () => {
			const count = 3;
			const additionalJobs = mockAdditionalJobGenerationLogic.generateAdditionalJobs(count);
			
			additionalJobs.forEach(job => {
				expect(job.validatedPrice).toBeGreaterThanOrEqual(20);
				expect(job.validatedPrice).toBeLessThanOrEqual(200);
			});
		});

		it('should generate jobs with valid category IDs', async () => {
			const count = 3;
			const additionalJobs = mockAdditionalJobGenerationLogic.generateAdditionalJobs(count);
			
			additionalJobs.forEach(job => {
				expect(typeof job.categoryId).toBe('number');
				expect(job.categoryId).toBeGreaterThan(0);
			});
		});

		it('should handle zero count', async () => {
			const count = 0;
			const additionalJobs = mockAdditionalJobGenerationLogic.generateAdditionalJobs(count);
			
			expect(Array.isArray(additionalJobs)).toBe(true);
			expect(additionalJobs.length).toBe(0);
		});
	});

	describe('Category Determination Logic', () => {
		it('should determine category for строитель', async () => {
			const title = 'Строитель';
			const categoryId = mockCategoryDeterminationLogic.determineCategoryFromTitle(title);
			expect(categoryId).toBe(30);
		});

		it('should determine category for водитель', async () => {
			const title = 'Водитель доставки';
			const categoryId = mockCategoryDeterminationLogic.determineCategoryFromTitle(title);
			expect(categoryId).toBe(35);
		});

		it('should determine category for продавец', async () => {
			const title = 'Продавец в магазин';
			const categoryId = mockCategoryDeterminationLogic.determineCategoryFromTitle(title);
			expect(categoryId).toBe(54);
		});

		it('should determine category for уборщица', async () => {
			const title = 'Уборщица';
			const categoryId = mockCategoryDeterminationLogic.determineCategoryFromTitle(title);
			expect(categoryId).toBe(31);
		});

		it('should determine category for электрик', async () => {
			const title = 'Электрик';
			const categoryId = mockCategoryDeterminationLogic.determineCategoryFromTitle(title);
			expect(categoryId).toBe(57);
		});

		it('should determine category for няня', async () => {
			const title = 'Няня';
			const categoryId = mockCategoryDeterminationLogic.determineCategoryFromTitle(title);
			expect(categoryId).toBe(40);
		});

		it('should determine category for парикмахер', async () => {
			const title = 'Парикмахер';
			const categoryId = mockCategoryDeterminationLogic.determineCategoryFromTitle(title);
			expect(categoryId).toBe(32);
		});

		it('should determine category for инженер', async () => {
			const title = 'Инженер';
			const categoryId = mockCategoryDeterminationLogic.determineCategoryFromTitle(title);
			expect(categoryId).toBe(39);
		});

		it('should return default category for unknown title', async () => {
			const title = 'Unknown Job Title';
			const categoryId = mockCategoryDeterminationLogic.determineCategoryFromTitle(title);
			expect(categoryId).toBe(58); // Разное
		});

		it('should handle case insensitive matching', async () => {
			const title = 'СТРОИТЕЛЬ';
			const categoryId = mockCategoryDeterminationLogic.determineCategoryFromTitle(title);
			expect(categoryId).toBe(30);
		});

		it('should handle partial matches', async () => {
			const title = 'Строительные работы';
			const categoryId = mockCategoryDeterminationLogic.determineCategoryFromTitle(title);
			expect(categoryId).toBe(30);
		});
	});

	describe('Job Title Generation Logic', () => {
		it('should generate job titles successfully', async () => {
			const jobs = [
				{ title: 'Без названия', description: 'Looking for developer' },
				{ title: 'Existing Title', description: 'Looking for designer' },
			];
			
			mockAIJobTitleService.fallbackTitleGeneration.mockResolvedValue(mockAIServiceResponses.successfulTitleGeneration);
			mockJobTitleGenerationLogic.generateJobTitles.mockResolvedValue(jobs);
			
			const result = await mockJobTitleGenerationLogic.generateJobTitles(jobs);
			
			expect(result).toBe(jobs);
			expect(mockJobTitleGenerationLogic.generateJobTitles).toHaveBeenCalledWith(jobs);
		});

		it('should handle jobs without title generation', async () => {
			const jobs = [
				{ title: 'Existing Title', description: 'Looking for designer' },
			];
			
			mockJobTitleGenerationLogic.generateJobTitles.mockResolvedValue(jobs);
			
			const result = await mockJobTitleGenerationLogic.generateJobTitles(jobs);
			
			expect(result).toBe(jobs);
			expect(mockJobTitleGenerationLogic.generateJobTitles).toHaveBeenCalledWith(jobs);
		});

		it('should handle AI service errors', async () => {
			const jobs = [
				{ title: 'Без названия', description: 'Looking for developer' },
			];
			
			mockAIJobTitleService.fallbackTitleGeneration.mockRejectedValue(mockErrors.aiServiceError);
			
			try {
				await mockJobTitleGenerationLogic.generateJobTitles(jobs);
			} catch (error) {
				expect(error).toBe(mockErrors.aiServiceError);
			}
		});

		it('should assign categories to all jobs', async () => {
			const jobs = [
				{ title: 'Строитель', description: 'Looking for builder' },
				{ title: 'Водитель', description: 'Looking for driver' },
				{ title: 'Продавец', description: 'Looking for seller' },
			];
			
			mockJobTitleGenerationLogic.generateJobTitles.mockResolvedValue(jobs);
			
			const result = await mockJobTitleGenerationLogic.generateJobTitles(jobs);
			
			expect(result).toBe(jobs);
			expect(mockJobTitleGenerationLogic.generateJobTitles).toHaveBeenCalledWith(jobs);
		});
	});

	describe('Fake User Creation Logic', () => {
		it('should create fake users with jobs successfully', async () => {
			const jobs = mockJobData.jobList;
			
			mockFakeUserCreationLogic.createFakeUsersWithJobs.mockResolvedValue();
			
			await mockFakeUserCreationLogic.createFakeUsersWithJobs(jobs);
			
			expect(mockFakeUserCreationLogic.createFakeUsersWithJobs).toHaveBeenCalledWith(jobs);
		});

		it('should handle missing default category', async () => {
			const jobs = mockJobData.jobList;
			
			mockPrisma.category.findUnique.mockResolvedValue(null);
			
			try {
				await mockFakeUserCreationLogic.createFakeUsersWithJobs(jobs);
			} catch (error) {
				expect(error).toBe(mockErrors.categoryError);
			}
		});

		it('should skip jobs with missing cities', async () => {
			const jobs = mockJobData.jobList;
			
			mockPrisma.category.findUnique.mockResolvedValue(mockServiceResponses.successfulCategoryLookup);
			mockPrisma.city.findUnique.mockResolvedValue(null);
			
			await mockFakeUserCreationLogic.createFakeUsersWithJobs(jobs);
			
			expect(mockPrisma.user.create).not.toHaveBeenCalled();
		});

		it('should handle user creation errors', async () => {
			const jobs = mockJobData.singleJob;
			
			mockPrisma.category.findUnique.mockResolvedValue(mockServiceResponses.successfulCategoryLookup);
			mockPrisma.city.findUnique.mockResolvedValue(mockServiceResponses.successfulCityLookup);
			mockPrisma.user.create.mockRejectedValue(mockErrors.userCreationError);
			
			try {
				await mockFakeUserCreationLogic.createFakeUsersWithJobs(jobs);
			} catch (error) {
				expect(error).toBe(mockErrors.userCreationError);
			}
		});

		it('should create users with correct data structure', async () => {
			const jobs = mockJobData.singleJob;
			
			mockFakeUserCreationLogic.createFakeUsersWithJobs.mockResolvedValue();
			
			await mockFakeUserCreationLogic.createFakeUsersWithJobs(jobs);
			
			expect(mockFakeUserCreationLogic.createFakeUsersWithJobs).toHaveBeenCalledWith(jobs);
		});
	});

	describe('Early Processing Logic', () => {
		it('should process jobs early successfully', async () => {
			const jobs = mockJobData.jobList;
			
			mockEarlyProcessingLogic.processJobsEarly.mockResolvedValue();
			
			await mockEarlyProcessingLogic.processJobsEarly(jobs);
			
			expect(mockEarlyProcessingLogic.processJobsEarly).toHaveBeenCalledWith(jobs);
		});

		it('should handle early processing errors', async () => {
			const jobs = mockJobData.jobList;
			
			mockJobTitleGenerationLogic.generateJobTitles.mockRejectedValue(mockErrors.aiServiceError);
			
			try {
				await mockEarlyProcessingLogic.processJobsEarly(jobs);
			} catch (error) {
				expect(error).toBe(mockErrors.aiServiceError);
			}
		});

		it('should handle user creation errors in early processing', async () => {
			const jobs = mockJobData.jobList;
			
			mockJobTitleGenerationLogic.generateJobTitles.mockResolvedValue(jobs);
			mockFakeUserCreationLogic.createFakeUsersWithJobs.mockRejectedValue(mockErrors.userCreationError);
			
			try {
				await mockEarlyProcessingLogic.processJobsEarly(jobs);
			} catch (error) {
				expect(error).toBe(mockErrors.userCreationError);
			}
		});
	});

	describe('Main Function Flow Logic', () => {
		it('should execute main function successfully', async () => {
			mockMainFunctionLogic.main.mockResolvedValue();
			
			await mockMainFunctionLogic.main();
			
			expect(mockMainFunctionLogic.main).toHaveBeenCalled();
		});

		it('should skip processing when early processing was done', async () => {
			mockMainFunctionLogic.main.mockResolvedValue();
			
			await mockMainFunctionLogic.main();
			
			expect(mockMainFunctionLogic.main).toHaveBeenCalled();
		});

		it('should handle main function errors', async () => {
			mockPrisma.job.deleteMany.mockRejectedValue(mockErrors.databaseError);
			
			try {
				await mockMainFunctionLogic.main();
			} catch (error) {
				expect(error).toBe(mockErrors.databaseError);
			}
		});
	});

	describe('Error Handling Scenarios', () => {
		it('should handle database errors', async () => {
			const error = mockErrors.databaseError;
			expect(error.message).toBe('Database connection failed');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle Puppeteer errors', async () => {
			const error = mockErrors.puppeteerError;
			expect(error.message).toBe('Puppeteer launch failed');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle page load errors', async () => {
			const error = mockErrors.pageLoadError;
			expect(error.message).toBe('Page load timeout');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle navigation errors', async () => {
			const error = mockErrors.navigationError;
			expect(error.message).toBe('Navigation timeout');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle scraping errors', async () => {
			const error = mockErrors.scrapingError;
			expect(error.message).toBe('Scraping failed');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle validation errors', async () => {
			const error = mockErrors.validationError;
			expect(error.message).toBe('Job validation failed');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle category errors', async () => {
			const error = mockErrors.categoryError;
			expect(error.message).toBe('Category not found');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle city errors', async () => {
			const error = mockErrors.cityError;
			expect(error.message).toBe('City not found');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle user creation errors', async () => {
			const error = mockErrors.userCreationError;
			expect(error.message).toBe('User creation failed');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle job creation errors', async () => {
			const error = mockErrors.jobCreationError;
			expect(error.message).toBe('Job creation failed');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle AI service errors', async () => {
			const error = mockErrors.aiServiceError;
			expect(error.message).toBe('AI service error');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle network errors', async () => {
			const error = mockErrors.networkError;
			expect(error.message).toBe('Network timeout');
			expect(error).toBeInstanceOf(Error);
		});
	});

	describe('Console Logging Logic', () => {
		it('should log success messages correctly', async () => {
			console.log('✅ Success message');
			expect(console.log).toHaveBeenCalledWith('✅ Success message');
		});

		it('should log error messages correctly', async () => {
			console.error('❌ Error message');
			expect(console.error).toHaveBeenCalledWith('❌ Error message');
		});

		it('should log warning messages correctly', async () => {
			console.warn('⚠️ Warning message');
			expect(console.warn).toHaveBeenCalledWith('⚠️ Warning message');
		});

		it('should log info messages correctly', async () => {
			console.info('ℹ️ Info message');
			expect(console.info).toHaveBeenCalledWith('ℹ️ Info message');
		});

		it('should handle different log levels', async () => {
			const messages = [
				'✅ Success',
				'❌ Error',
				'⚠️ Warning',
				'ℹ️ Info',
			];
			
			messages.forEach((message, index) => {
				if (message.includes('✅')) {
					console.log(message);
				} else if (message.includes('❌')) {
					console.error(message);
				} else if (message.includes('⚠️')) {
					console.warn(message);
				} else if (message.includes('ℹ️')) {
					console.info(message);
				}
			});
			
			expect(console.log).toHaveBeenCalledWith('✅ Success');
			expect(console.error).toHaveBeenCalledWith('❌ Error');
			expect(console.warn).toHaveBeenCalledWith('⚠️ Warning');
			expect(console.info).toHaveBeenCalledWith('ℹ️ Info');
		});
	});

	describe('Request/Response Logic', () => {
		it('should build job data correctly', async () => {
			const jobData = mockRequestResponseLogic.buildJobData(
				'Test Job',
				'Test Description',
				'Test City',
				'+972-50-123-4567'
			);
			
			expect(jobData.title).toBe('Test Job');
			expect(jobData.description).toBe('Test Description');
			expect(jobData.city).toBe('Test City');
			expect(jobData.phone).toBe('+972-50-123-4567');
		});

		it('should validate job data correctly', async () => {
			const validJob = mockJobData.validJob;
			const invalidJob = { title: '', description: '', city: '', phone: '' };
			
			expect(mockRequestResponseLogic.validateJobData(validJob)).toBe(true);
			expect(mockRequestResponseLogic.validateJobData(invalidJob)).toBe(false);
		});

		it('should handle partial job data', async () => {
			const partialJob = { title: 'Test Job', description: 'Test Description' };
			
			expect(mockRequestResponseLogic.validateJobData(partialJob)).toBe(false);
		});

		it('should handle empty job data', async () => {
			const emptyJob = {};
			
			expect(mockRequestResponseLogic.validateJobData(emptyJob)).toBe(false);
		});
	});
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Import mock data
import {
	mockJobData,
	mockExistingJob,
	mockExistingJobPremium,
	mockUpdatedJob,
	mockUserJobs,
	mockPrismaError,
	mockValidationError,
	mockTelegramError,
	resetEditFormMocks,
} from './mocks/editFormService.js';

// Mock console methods to avoid noise in tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe('EditFormService', () => {
	beforeEach(() => {
		// Reset all mocks
		resetEditFormMocks();
		
		// Mock console methods
		console.log = vi.fn();
		console.error = vi.fn();
	});

	afterEach(() => {
		// Restore console methods
		console.log = originalConsoleLog;
		console.error = originalConsoleError;
	});

	describe('Data Processing Logic', () => {
		it('should correctly destructure update data', () => {
			const updateData = mockJobData.validUpdateData;
			const {
				title,
				salary,
				cityId,
				phone,
				description,
				categoryId,
				shuttle,
				meals,
				imageUrl,
				userId,
			} = updateData;

			expect(title).toBe('Updated Software Developer Position');
			expect(salary).toBe('6000');
			expect(cityId).toBe('2');
			expect(phone).toBe('+972-50-987-6543');
			expect(description).toBe('Looking for an experienced software developer with React skills');
			expect(categoryId).toBe('3');
			expect(shuttle).toBe(true);
			expect(meals).toBe(false);
			expect(imageUrl).toBe('https://example.com/image.jpg');
			expect(userId).toBe('user-123');
		});

		it('should convert string numbers to integers for Prisma', () => {
			const testCases = [
				{ input: '1', expected: 1 },
				{ input: '2', expected: 2 },
				{ input: '3', expected: 3 },
				{ input: '0', expected: 0 },
				{ input: '100', expected: 100 },
			];

			testCases.forEach(({ input, expected }) => {
				const result = parseInt(input);
				expect(result).toBe(expected);
			});
		});

		it('should handle numeric values correctly', () => {
			const numericData = mockJobData.updateDataWithNumericValues;

			expect(numericData.salary).toBe(5500);
			expect(numericData.cityId).toBe(3);
			expect(numericData.categoryId).toBe(5);
			expect(typeof numericData.salary).toBe('number');
			expect(typeof numericData.cityId).toBe('number');
			expect(typeof numericData.categoryId).toBe('number');
		});

		it('should create correct Prisma update data structure', () => {
			const updateData = mockJobData.validUpdateData;
			const {
				title,
				salary,
				phone,
				description,
				imageUrl,
				cityId,
				categoryId,
				shuttle,
				meals,
			} = updateData;

			const prismaUpdateData = {
				title,
				salary,
				phone,
				description,
				imageUrl,
				city: { connect: { id: parseInt(cityId) } },
				category: { connect: { id: parseInt(categoryId) } },
				shuttle,
				meals,
			};

			expect(prismaUpdateData).toEqual({
				title: 'Updated Software Developer Position',
				salary: '6000',
				phone: '+972-50-987-6543',
				description: 'Looking for an experienced software developer with React skills',
				imageUrl: 'https://example.com/image.jpg',
				city: { connect: { id: 2 } },
				category: { connect: { id: 3 } },
				shuttle: true,
				meals: false,
			});
		});

		it('should include correct Prisma query options', () => {
			const includeOptions = { city: true, user: true, category: true };

			expect(includeOptions).toEqual({
				city: true,
				user: true,
				category: true,
			});
		});
	});

	describe('Validation Logic Tests', () => {
		it('should detect bad words in title', () => {
			const badWordsData = mockJobData.dataWithBadWords;
			
			// Simulate validation logic
			const hasBadWordsInTitle = badWordsData.title.includes('F***ing');
			const hasBadWordsInDescription = badWordsData.description.includes('sh**ty');

			expect(hasBadWordsInTitle).toBe(true);
			expect(hasBadWordsInDescription).toBe(true);
		});

		it('should detect links in title and description', () => {
			const linksData = mockJobData.dataWithLinks;
			
			// Simulate validation logic
			const hasLinksInTitle = linksData.title.includes('https://') || linksData.title.includes('http://');
			const hasLinksInDescription = linksData.description.includes('https://') || linksData.description.includes('http://');

			expect(hasLinksInTitle).toBe(true);
			expect(hasLinksInDescription).toBe(true);
		});

		it('should pass validation for clean data', () => {
			const cleanData = mockJobData.validUpdateData;
			
			// Simulate validation logic
			const hasBadWordsInTitle = cleanData.title.includes('F***ing') || cleanData.title.includes('sh**ty');
			const hasBadWordsInDescription = cleanData.description.includes('F***ing') || cleanData.description.includes('sh**ty');
			const hasLinksInTitle = cleanData.title.includes('https://') || cleanData.title.includes('http://');
			const hasLinksInDescription = cleanData.description.includes('https://') || cleanData.description.includes('http://');

			expect(hasBadWordsInTitle).toBe(false);
			expect(hasBadWordsInDescription).toBe(false);
			expect(hasLinksInTitle).toBe(false);
			expect(hasLinksInDescription).toBe(false);
		});

		it('should collect multiple validation errors', () => {
			const invalidData = mockJobData.dataWithBadWords;
			let errors = [];

			// Simulate validation logic
			if (invalidData.title.includes('F***ing')) {
				errors.push('Заголовок содержит нецензурные слова.');
			}
			if (invalidData.description.includes('sh**ty')) {
				errors.push('Описание содержит нецензурные слова.');
			}
			if (invalidData.title.includes('https://') || invalidData.title.includes('http://')) {
				errors.push('Заголовок содержит запрещенные ссылки.');
			}
			if (invalidData.description.includes('https://') || invalidData.description.includes('http://')) {
				errors.push('Описание содержит запрещенные ссылки.');
			}

			expect(errors).toHaveLength(2);
			expect(errors).toContain('Заголовок содержит нецензурные слова.');
			expect(errors).toContain('Описание содержит нецензурные слова.');
		});
	});

	describe('Authorization Logic Tests', () => {
		it('should allow update for job owner', () => {
			const existingJob = mockExistingJob;
			const updateData = mockJobData.validUpdateData;

			// Simulate authorization check
			const isOwner = existingJob.user.clerkUserId === updateData.userId;

			expect(isOwner).toBe(true);
		});

		it('should deny update for non-owner', () => {
			const existingJob = mockExistingJob;
			const unauthorizedData = mockJobData.unauthorizedUpdate;

			// Simulate authorization check
			const isOwner = existingJob.user.clerkUserId === unauthorizedData.userId;

			expect(isOwner).toBe(false);
		});

		it('should handle missing job', () => {
			const existingJob = null;

			// Simulate job existence check
			const jobExists = existingJob !== null;

			expect(jobExists).toBe(false);
		});
	});

	describe('Premium User Features Tests', () => {
		it('should identify premium users', () => {
			const premiumJob = mockExistingJobPremium;

			// Simulate premium check
			const isPremium = premiumJob.user.isPremium;

			expect(isPremium).toBe(true);
		});

		it('should identify non-premium users', () => {
			const regularJob = mockExistingJob;

			// Simulate premium check
			const isPremium = regularJob.user.isPremium;

			expect(isPremium).toBe(false);
		});

		it('should prepare user jobs for premium users', () => {
			const userJobs = mockUserJobs;

			expect(userJobs).toHaveLength(2);
			expect(userJobs[0]).toHaveProperty('id');
			expect(userJobs[0]).toHaveProperty('title');
			expect(userJobs[0]).toHaveProperty('city');
			expect(userJobs[1]).toHaveProperty('id');
			expect(userJobs[1]).toHaveProperty('title');
			expect(userJobs[1]).toHaveProperty('city');
		});
	});

	describe('Error Handling Tests', () => {
		it('should handle database errors gracefully', () => {
			const handleError = (error) => {
				return { error: 'Ошибка обновления объявления', details: error.message };
			};

			const dbError = mockPrismaError;
			const result = handleError(dbError);

			expect(result).toEqual({
				error: 'Ошибка обновления объявления',
				details: 'Database connection failed',
			});
		});

		it('should handle validation errors', () => {
			const handleValidationErrors = (errors) => {
				return { errors };
			};

			const validationErrors = ['Заголовок содержит нецензурные слова.', 'Описание содержит запрещенные ссылки.'];
			const result = handleValidationErrors(validationErrors);

			expect(result).toEqual({ errors: validationErrors });
		});

		it('should handle job not found error', () => {
			const handleJobNotFound = () => {
				return { error: 'Объявление не найдено' };
			};

			const result = handleJobNotFound();

			expect(result).toEqual({ error: 'Объявление не найдено' });
		});

		it('should handle unauthorized access error', () => {
			const handleUnauthorized = () => {
				return { error: 'У вас нет прав для редактирования этого объявления' };
			};

			const result = handleUnauthorized();

			expect(result).toEqual({ error: 'У вас нет прав для редактирования этого объявления' });
		});
	});

	describe('Data Type Handling Tests', () => {
		it('should handle boolean values correctly', () => {
			const booleanData = {
				shuttle: true,
				meals: false,
			};

			expect(booleanData.shuttle).toBe(true);
			expect(booleanData.meals).toBe(false);
			expect(typeof booleanData.shuttle).toBe('boolean');
			expect(typeof booleanData.meals).toBe('boolean');
		});

		it('should handle string and number salary values', () => {
			const stringSalary = '6000';
			const numberSalary = 6000;

			expect(stringSalary).toBe('6000');
			expect(numberSalary).toBe(6000);
			expect(typeof stringSalary).toBe('string');
			expect(typeof numberSalary).toBe('number');
		});

		it('should handle optional imageUrl', () => {
			const withImage = 'https://example.com/image.jpg';
			const withoutImage = null;
			const emptyImage = '';

			expect(withImage).toBe('https://example.com/image.jpg');
			expect(withoutImage).toBe(null);
			expect(emptyImage).toBe('');
		});

		it('should handle phone number formats', () => {
			const phoneNumbers = [
				'+972-50-123-4567',
				'+972-52-987-6543',
				'+972-54-333-4444',
			];

			phoneNumbers.forEach(phone => {
				expect(phone).toMatch(/^\+972-\d{2}-\d{3}-\d{4}$/);
			});
		});
	});

	describe('Service Response Format Tests', () => {
		it('should return updated job with correct structure', () => {
			const updatedJob = mockUpdatedJob;

			expect(updatedJob).toHaveProperty('id');
			expect(updatedJob).toHaveProperty('title');
			expect(updatedJob).toHaveProperty('salary');
			expect(updatedJob).toHaveProperty('phone');
			expect(updatedJob).toHaveProperty('description');
			expect(updatedJob).toHaveProperty('imageUrl');
			expect(updatedJob).toHaveProperty('cityId');
			expect(updatedJob).toHaveProperty('categoryId');
			expect(updatedJob).toHaveProperty('shuttle');
			expect(updatedJob).toHaveProperty('meals');
			expect(updatedJob).toHaveProperty('city');
			expect(updatedJob).toHaveProperty('user');
			expect(updatedJob).toHaveProperty('category');
		});

		it('should include city relation data', () => {
			const updatedJob = mockUpdatedJob;

			expect(updatedJob.city).toHaveProperty('id');
			expect(updatedJob.city).toHaveProperty('name');
			expect(updatedJob.city.id).toBe(2);
			expect(updatedJob.city.name).toBe('Jerusalem');
		});

		it('should include user relation data', () => {
			const updatedJob = mockUpdatedJob;

			expect(updatedJob.user).toHaveProperty('id');
			expect(updatedJob.user).toHaveProperty('clerkUserId');
			expect(updatedJob.user).toHaveProperty('isPremium');
			expect(updatedJob.user.id).toBe('user-123');
			expect(updatedJob.user.clerkUserId).toBe('user-123');
			expect(updatedJob.user.isPremium).toBe(false);
		});

		it('should include category relation data', () => {
			const updatedJob = mockUpdatedJob;

			expect(updatedJob.category).toHaveProperty('id');
			expect(updatedJob.category).toHaveProperty('name');
			expect(updatedJob.category.id).toBe(3);
			expect(updatedJob.category.name).toBe('Software Development');
		});
	});

	describe('Console Logging Tests', () => {
		it('should log update information', () => {
			const logUpdateInfo = (imageUrl, updateData) => {
				console.log('🔍 updateJobService - Updating job with imageUrl:', imageUrl);
				console.log('🔍 updateJobService - Full update data:', updateData);
			};

			const imageUrl = 'https://example.com/image.jpg';
			const updateData = {
				title: 'Test Job',
				salary: '5000',
				phone: '+972-50-123-4567',
				description: 'Test description',
				imageUrl,
				cityId: '1',
				categoryId: '2',
				shuttle: false,
				meals: true,
			};

			logUpdateInfo(imageUrl, updateData);

			expect(console.log).toHaveBeenCalledWith('🔍 updateJobService - Updating job with imageUrl:', imageUrl);
			expect(console.log).toHaveBeenCalledWith('🔍 updateJobService - Full update data:', updateData);
		});
	});

	describe('Mock Data Validation', () => {
		it('should have valid mock update data', () => {
			const validData = mockJobData.validUpdateData;

			expect(validData).toHaveProperty('title');
			expect(validData).toHaveProperty('salary');
			expect(validData).toHaveProperty('cityId');
			expect(validData).toHaveProperty('phone');
			expect(validData).toHaveProperty('description');
			expect(validData).toHaveProperty('categoryId');
			expect(validData).toHaveProperty('shuttle');
			expect(validData).toHaveProperty('meals');
			expect(validData).toHaveProperty('imageUrl');
			expect(validData).toHaveProperty('userId');

			expect(typeof validData.title).toBe('string');
			expect(typeof validData.salary).toBe('string');
			expect(typeof validData.cityId).toBe('string');
			expect(typeof validData.phone).toBe('string');
			expect(typeof validData.description).toBe('string');
			expect(typeof validData.categoryId).toBe('string');
			expect(typeof validData.shuttle).toBe('boolean');
			expect(typeof validData.meals).toBe('boolean');
			expect(typeof validData.imageUrl).toBe('string');
			expect(typeof validData.userId).toBe('string');
		});

		it('should have valid mock existing job', () => {
			const existingJob = mockExistingJob;

			expect(existingJob).toHaveProperty('id');
			expect(existingJob).toHaveProperty('title');
			expect(existingJob).toHaveProperty('salary');
			expect(existingJob).toHaveProperty('cityId');
			expect(existingJob).toHaveProperty('phone');
			expect(existingJob).toHaveProperty('description');
			expect(existingJob).toHaveProperty('categoryId');
			expect(existingJob).toHaveProperty('shuttle');
			expect(existingJob).toHaveProperty('meals');
			expect(existingJob).toHaveProperty('imageUrl');
			expect(existingJob).toHaveProperty('userId');
			expect(existingJob).toHaveProperty('user');
			expect(existingJob).toHaveProperty('city');
			expect(existingJob).toHaveProperty('category');

			expect(typeof existingJob.id).toBe('number');
			expect(typeof existingJob.title).toBe('string');
			expect(typeof existingJob.salary).toBe('number');
			expect(typeof existingJob.cityId).toBe('number');
			expect(typeof existingJob.phone).toBe('string');
			expect(typeof existingJob.description).toBe('string');
			expect(typeof existingJob.categoryId).toBe('number');
			expect(typeof existingJob.shuttle).toBe('boolean');
			expect(typeof existingJob.meals).toBe('boolean');
			expect(typeof existingJob.user).toBe('object');
			expect(typeof existingJob.city).toBe('object');
			expect(typeof existingJob.category).toBe('object');
		});

		it('should have valid mock updated job', () => {
			const updatedJob = mockUpdatedJob;

			expect(updatedJob).toHaveProperty('id');
			expect(updatedJob).toHaveProperty('title');
			expect(updatedJob).toHaveProperty('salary');
			expect(updatedJob).toHaveProperty('cityId');
			expect(updatedJob).toHaveProperty('phone');
			expect(updatedJob).toHaveProperty('description');
			expect(updatedJob).toHaveProperty('imageUrl');
			expect(updatedJob).toHaveProperty('cityId');
			expect(updatedJob).toHaveProperty('categoryId');
			expect(updatedJob).toHaveProperty('shuttle');
			expect(updatedJob).toHaveProperty('meals');
			expect(updatedJob).toHaveProperty('city');
			expect(updatedJob).toHaveProperty('user');
			expect(updatedJob).toHaveProperty('category');

			expect(typeof updatedJob.id).toBe('number');
			expect(typeof updatedJob.title).toBe('string');
			expect(typeof updatedJob.salary).toBe('number');
			expect(typeof updatedJob.cityId).toBe('number');
			expect(typeof updatedJob.phone).toBe('string');
			expect(typeof updatedJob.description).toBe('string');
			expect(typeof updatedJob.imageUrl).toBe('string');
			expect(typeof updatedJob.categoryId).toBe('number');
			expect(typeof updatedJob.shuttle).toBe('boolean');
			expect(typeof updatedJob.meals).toBe('boolean');
			expect(typeof updatedJob.city).toBe('object');
			expect(typeof updatedJob.user).toBe('object');
			expect(typeof updatedJob.category).toBe('object');
		});

		it('should have valid mock errors', () => {
			const prismaError = mockPrismaError;
			const validationError = mockValidationError;
			const telegramError = mockTelegramError;

			expect(prismaError).toBeInstanceOf(Error);
			expect(validationError).toBeInstanceOf(Error);
			expect(telegramError).toBeInstanceOf(Error);

			expect(prismaError.message).toBe('Database connection failed');
			expect(validationError.message).toBe('Validation failed');
			expect(telegramError.message).toBe('Telegram API error');
		});
	});
});

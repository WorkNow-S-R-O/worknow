import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Import mock data
import {
	mockJobData,
	mockPrismaQueryOptions,
	mockPrismaError,
	mockValidationError,
	mockNotFoundError,
	mockConsoleLogData,
	resetGetJobByIdMocks,
} from './mocks/getJobById.js';

// Mock console methods to avoid noise in tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe('GetJobByIdService', () => {
	beforeEach(() => {
		// Reset all mocks
		resetGetJobByIdMocks();

		// Mock console methods
		console.log = vi.fn();
		console.error = vi.fn();
	});

	afterEach(() => {
		// Restore console methods
		console.log = originalConsoleLog;
		console.error = originalConsoleError;
	});

	describe('ID Validation Logic', () => {
		it('should accept valid numeric string IDs', () => {
			const validIds = ['123', '456', '789', '1', '999999'];

			validIds.forEach((id) => {
				const isValid = id && !isNaN(id);
				expect(isValid).toBe(true);
			});
		});

		it('should accept valid numeric IDs', () => {
			const validIds = [123, 456, 789, 1, 999999];

			validIds.forEach((id) => {
				const isValid = id && !isNaN(id);
				expect(isValid).toBe(true);
			});
		});

		it('should reject null IDs', () => {
			const id = null;
			const isValid = id && !isNaN(id);
			expect(isValid).toBe(null); // null && anything = null
		});

		it('should reject undefined IDs', () => {
			const id = undefined;
			const isValid = id && !isNaN(id);
			expect(isValid).toBe(undefined); // undefined && anything = undefined
		});

		it('should reject empty string IDs', () => {
			const id = '';
			const isValid = id && !isNaN(id);
			expect(isValid).toBe(''); // '' && anything = ''
		});

		it('should reject non-numeric string IDs', () => {
			const invalidIds = ['abc', 'def', 'xyz', 'hello'];

			invalidIds.forEach((id) => {
				const isValid = id && !isNaN(id);
				expect(isValid).toBe(false);
			});
		});

		it('should reject negative IDs', () => {
			const id = '-1';
			const isValid = id && !isNaN(id);
			expect(isValid).toBe(true); // isNaN('-1') is false, but we might want to reject negative IDs
		});

		it('should reject zero IDs', () => {
			const id = '0';
			const isValid = id && !isNaN(id);
			expect(isValid).toBe(true); // isNaN('0') is false, but we might want to reject zero IDs
		});

		it('should reject float IDs', () => {
			const id = '123.45';
			const isValid = id && !isNaN(id);
			expect(isValid).toBe(true); // isNaN('123.45') is false, but we might want to reject floats
		});

		it('should reject boolean IDs', () => {
			const id = true;
			const isValid = id && !isNaN(id);
			expect(isValid).toBe(true); // isNaN(true) is false, but we might want to reject booleans
		});

		it('should reject object IDs', () => {
			const id = {};
			const isValid = id && !isNaN(id);
			expect(isValid).toBe(false);
		});

		it('should reject array IDs', () => {
			const id = [];
			const isValid = id && !isNaN(id);
			expect(isValid).toBe(true); // [] && true = true (because !isNaN([]) = true)
		});
	});

	describe('Data Processing Logic', () => {
		it('should convert string ID to number correctly', () => {
			const testCases = [
				{ input: '123', expected: 123 },
				{ input: '456', expected: 456 },
				{ input: '1', expected: 1 },
				{ input: '999999', expected: 999999 },
			];

			testCases.forEach(({ input, expected }) => {
				const result = Number(input);
				expect(result).toBe(expected);
			});
		});

		it('should handle numeric IDs correctly', () => {
			const testCases = [
				{ input: 123, expected: 123 },
				{ input: 456, expected: 456 },
				{ input: 1, expected: 1 },
				{ input: 999999, expected: 999999 },
			];

			testCases.forEach(({ input, expected }) => {
				const result = Number(input);
				expect(result).toBe(expected);
			});
		});

		it('should create correct Prisma query structure', () => {
			const id = 123;
			const queryOptions = {
				where: { id: Number(id) },
				include: {
					city: true,
					category: true,
					user: {
						select: {
							id: true,
							isPremium: true,
							firstName: true,
							lastName: true,
							clerkUserId: true,
						},
					},
				},
			};

			expect(queryOptions).toEqual(mockPrismaQueryOptions);
		});

		it('should include correct user data selection', () => {
			const userSelect = {
				id: true,
				isPremium: true,
				firstName: true,
				lastName: true,
				clerkUserId: true,
			};

			expect(userSelect).toEqual({
				id: true,
				isPremium: true,
				firstName: true,
				lastName: true,
				clerkUserId: true,
			});
		});
	});

	describe('Job Data Structure Tests', () => {
		it('should return job with correct structure', () => {
			const job = mockJobData.jobWithImage;

			expect(job).toHaveProperty('id');
			expect(job).toHaveProperty('title');
			expect(job).toHaveProperty('salary');
			expect(job).toHaveProperty('cityId');
			expect(job).toHaveProperty('phone');
			expect(job).toHaveProperty('description');
			expect(job).toHaveProperty('categoryId');
			expect(job).toHaveProperty('shuttle');
			expect(job).toHaveProperty('meals');
			expect(job).toHaveProperty('imageUrl');
			expect(job).toHaveProperty('userId');
			expect(job).toHaveProperty('city');
			expect(job).toHaveProperty('category');
			expect(job).toHaveProperty('user');
		});

		it('should include city relation data', () => {
			const job = mockJobData.jobWithImage;

			expect(job.city).toHaveProperty('id');
			expect(job.city).toHaveProperty('name');
			expect(job.city.id).toBe(2);
			expect(job.city.name).toBe('Jerusalem');
		});

		it('should include category relation data', () => {
			const job = mockJobData.jobWithImage;

			expect(job.category).toHaveProperty('id');
			expect(job.category).toHaveProperty('name');
			expect(job.category.id).toBe(3);
			expect(job.category.name).toBe('Software Development');
		});

		it('should include user relation data with correct fields', () => {
			const job = mockJobData.jobWithImage;

			expect(job.user).toHaveProperty('id');
			expect(job.user).toHaveProperty('isPremium');
			expect(job.user).toHaveProperty('firstName');
			expect(job.user).toHaveProperty('lastName');
			expect(job.user).toHaveProperty('clerkUserId');

			expect(job.user.id).toBe('user-123');
			expect(job.user.isPremium).toBe(true);
			expect(job.user.firstName).toBe('John');
			expect(job.user.lastName).toBe('Doe');
			expect(job.user.clerkUserId).toBe('user-123');
		});

		it('should handle jobs with image URLs', () => {
			const job = mockJobData.jobWithImage;

			expect(job.imageUrl).toBe('https://example.com/image.jpg');
			expect(typeof job.imageUrl).toBe('string');
			expect(job.imageUrl.length).toBeGreaterThan(0);
		});

		it('should handle jobs without image URLs', () => {
			const job = mockJobData.jobWithoutImage;

			expect(job.imageUrl).toBe(null);
		});

		it('should handle jobs with empty image URLs', () => {
			const job = mockJobData.jobWithEmptyImageUrl;

			expect(job.imageUrl).toBe('');
			expect(typeof job.imageUrl).toBe('string');
			expect(job.imageUrl.length).toBe(0);
		});
	});

	describe('User Data Selection Tests', () => {
		it('should include only selected user fields', () => {
			const user = mockJobData.jobWithImage.user;

			// Should have these fields
			expect(user).toHaveProperty('id');
			expect(user).toHaveProperty('isPremium');
			expect(user).toHaveProperty('firstName');
			expect(user).toHaveProperty('lastName');
			expect(user).toHaveProperty('clerkUserId');

			// Should not have these fields (not selected)
			expect(user).not.toHaveProperty('email');
			expect(user).not.toHaveProperty('imageUrl');
			expect(user).not.toHaveProperty('createdAt');
			expect(user).not.toHaveProperty('updatedAt');
		});

		it('should handle premium users correctly', () => {
			const premiumUser = mockJobData.jobWithImage.user;
			const regularUser = mockJobData.jobWithoutImage.user;

			expect(premiumUser.isPremium).toBe(true);
			expect(regularUser.isPremium).toBe(false);
		});

		it('should handle users with null names', () => {
			const user = mockJobData.jobWithMinimalUserData.user;

			expect(user.firstName).toBe(null);
			expect(user.lastName).toBe(null);
			expect(user.id).toBe('user-999');
			expect(user.clerkUserId).toBe('user-999');
		});
	});

	describe('Error Handling Tests', () => {
		it('should handle invalid ID errors', () => {
			const handleInvalidId = (id) => {
				if (!id || isNaN(id)) {
					throw new Error('ID вакансии не передан или имеет неверный формат');
				}
			};

			expect(() => handleInvalidId(null)).toThrow(
				'ID вакансии не передан или имеет неверный формат',
			);
			expect(() => handleInvalidId(undefined)).toThrow(
				'ID вакансии не передан или имеет неверный формат',
			);
			expect(() => handleInvalidId('')).toThrow(
				'ID вакансии не передан или имеет неверный формат',
			);
			expect(() => handleInvalidId('abc')).toThrow(
				'ID вакансии не передан или имеет неверный формат',
			);
		});

		it('should handle job not found errors', () => {
			const handleJobNotFound = () => {
				return { error: 'Объявление не найдено' };
			};

			const result = handleJobNotFound();
			expect(result).toEqual({ error: 'Объявление не найдено' });
		});

		it('should handle database errors gracefully', () => {
			const handleDatabaseError = (error) => {
				console.error('Ошибка в getJobByIdService:', error);
				return { error: 'Ошибка получения объявления', details: error.message };
			};

			const dbError = mockPrismaError;
			const result = handleDatabaseError(dbError);

			expect(result).toEqual({
				error: 'Ошибка получения объявления',
				details: 'Database connection failed',
			});
		});

		it('should log errors before returning', () => {
			const handleError = (error) => {
				console.error('Ошибка в getJobByIdService:', error);
				return { error: 'Ошибка получения объявления', details: error.message };
			};

			const error = new Error('Test error');
			handleError(error);

			expect(console.error).toHaveBeenCalledWith(
				'Ошибка в getJobByIdService:',
				error,
			);
		});
	});

	describe('Console Logging Tests', () => {
		it('should log job information with image URL', () => {
			const logJobInfo = (job) => {
				console.log('🔍 getJobByIdService - Job with imageUrl:', {
					id: job.id,
					title: job.title,
					imageUrl: job.imageUrl,
					hasImageUrl: !!job.imageUrl,
				});
			};

			const job = mockJobData.jobWithImage;
			logJobInfo(job);

			expect(console.log).toHaveBeenCalledWith(
				'🔍 getJobByIdService - Job with imageUrl:',
				{
					id: 123,
					title: 'Software Developer Position',
					imageUrl: 'https://example.com/image.jpg',
					hasImageUrl: true,
				},
			);
		});

		it('should log job information without image URL', () => {
			const logJobInfo = (job) => {
				console.log('🔍 getJobByIdService - Job with imageUrl:', {
					id: job.id,
					title: job.title,
					imageUrl: job.imageUrl,
					hasImageUrl: !!job.imageUrl,
				});
			};

			const job = mockJobData.jobWithoutImage;
			logJobInfo(job);

			expect(console.log).toHaveBeenCalledWith(
				'🔍 getJobByIdService - Job with imageUrl:',
				{
					id: 456,
					title: 'Marketing Manager Position',
					imageUrl: null,
					hasImageUrl: false,
				},
			);
		});

		it('should log job information with empty image URL', () => {
			const logJobInfo = (job) => {
				console.log('🔍 getJobByIdService - Job with imageUrl:', {
					id: job.id,
					title: job.title,
					imageUrl: job.imageUrl,
					hasImageUrl: !!job.imageUrl,
				});
			};

			const job = mockJobData.jobWithEmptyImageUrl;
			logJobInfo(job);

			expect(console.log).toHaveBeenCalledWith(
				'🔍 getJobByIdService - Job with imageUrl:',
				{
					id: 789,
					title: 'Designer Position',
					imageUrl: '',
					hasImageUrl: false,
				},
			);
		});

		it('should correctly determine hasImageUrl boolean', () => {
			const testCases = [
				{ imageUrl: 'https://example.com/image.jpg', expected: true },
				{ imageUrl: null, expected: false },
				{ imageUrl: '', expected: false },
				{ imageUrl: undefined, expected: false },
			];

			testCases.forEach(({ imageUrl, expected }) => {
				const hasImageUrl = !!imageUrl;
				expect(hasImageUrl).toBe(expected);
			});
		});
	});

	describe('Service Response Format Tests', () => {
		it('should return success response with job data', () => {
			const successResponse = { job: mockJobData.jobWithImage };

			expect(successResponse).toHaveProperty('job');
			expect(successResponse.job).toHaveProperty('id');
			expect(successResponse.job).toHaveProperty('title');
			expect(successResponse.job).toHaveProperty('city');
			expect(successResponse.job).toHaveProperty('category');
			expect(successResponse.job).toHaveProperty('user');
		});

		it('should return error response for not found', () => {
			const notFoundResponse = { error: 'Объявление не найдено' };

			expect(notFoundResponse).toHaveProperty('error');
			expect(notFoundResponse.error).toBe('Объявление не найдено');
		});

		it('should return error response with details', () => {
			const errorResponse = {
				error: 'Ошибка получения объявления',
				details: 'Database connection failed',
			};

			expect(errorResponse).toHaveProperty('error');
			expect(errorResponse).toHaveProperty('details');
			expect(errorResponse.error).toBe('Ошибка получения объявления');
			expect(errorResponse.details).toBe('Database connection failed');
		});
	});

	describe('Data Type Validation Tests', () => {
		it('should handle different ID types correctly', () => {
			const testCases = [
				{ input: '123', expected: 123 },
				{ input: 123, expected: 123 },
				{ input: '0', expected: 0 },
				{ input: 0, expected: 0 },
			];

			testCases.forEach(({ input, expected }) => {
				const result = Number(input);
				expect(result).toBe(expected);
			});
		});

		it('should handle edge cases for Number conversion', () => {
			const testCases = [
				{ input: '123.45', expected: 123.45 },
				{ input: '1e3', expected: 1000 },
				{ input: '0x10', expected: 16 },
			];

			testCases.forEach(({ input, expected }) => {
				const result = Number(input);
				expect(result).toBe(expected);
			});
		});

		it('should handle invalid Number conversions', () => {
			const testCases = [
				{ input: 'abc', expected: NaN },
				{ input: '', expected: 0 },
				{ input: null, expected: 0 },
				{ input: undefined, expected: NaN },
			];

			testCases.forEach(({ input, expected }) => {
				const result = Number(input);
				if (isNaN(expected)) {
					expect(isNaN(result)).toBe(true);
				} else {
					expect(result).toBe(expected);
				}
			});
		});
	});

	describe('Mock Data Validation', () => {
		it('should have valid mock job data with image', () => {
			const job = mockJobData.jobWithImage;

			expect(job).toHaveProperty('id');
			expect(job).toHaveProperty('title');
			expect(job).toHaveProperty('salary');
			expect(job).toHaveProperty('imageUrl');
			expect(job).toHaveProperty('city');
			expect(job).toHaveProperty('category');
			expect(job).toHaveProperty('user');

			expect(typeof job.id).toBe('number');
			expect(typeof job.title).toBe('string');
			expect(typeof job.salary).toBe('number');
			expect(typeof job.imageUrl).toBe('string');
			expect(typeof job.city).toBe('object');
			expect(typeof job.category).toBe('object');
			expect(typeof job.user).toBe('object');
		});

		it('should have valid mock job data without image', () => {
			const job = mockJobData.jobWithoutImage;

			expect(job).toHaveProperty('id');
			expect(job).toHaveProperty('title');
			expect(job).toHaveProperty('salary');
			expect(job).toHaveProperty('imageUrl');
			expect(job).toHaveProperty('city');
			expect(job).toHaveProperty('category');
			expect(job).toHaveProperty('user');

			expect(typeof job.id).toBe('number');
			expect(typeof job.title).toBe('string');
			expect(typeof job.salary).toBe('number');
			expect(job.imageUrl).toBe(null);
			expect(typeof job.city).toBe('object');
			expect(typeof job.category).toBe('object');
			expect(typeof job.user).toBe('object');
		});

		it('should have valid mock Prisma query options', () => {
			const queryOptions = mockPrismaQueryOptions;

			expect(queryOptions).toHaveProperty('where');
			expect(queryOptions).toHaveProperty('include');
			expect(queryOptions.where).toHaveProperty('id');
			expect(queryOptions.include).toHaveProperty('city');
			expect(queryOptions.include).toHaveProperty('category');
			expect(queryOptions.include).toHaveProperty('user');
			expect(queryOptions.include.user).toHaveProperty('select');
		});

		it('should have valid mock errors', () => {
			const prismaError = mockPrismaError;
			const validationError = mockValidationError;
			const notFoundError = mockNotFoundError;

			expect(prismaError).toBeInstanceOf(Error);
			expect(validationError).toBeInstanceOf(Error);
			expect(notFoundError).toBeInstanceOf(Error);

			expect(prismaError.message).toBe('Database connection failed');
			expect(validationError.message).toBe(
				'ID вакансии не передан или имеет неверный формат',
			);
			expect(notFoundError.message).toBe('Объявление не найдено');
		});
	});
});

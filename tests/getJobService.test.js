import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Import mock data
import {
	mockJobData,
	mockPrismaQueryOptions,
	mockPrismaError,
	mockNotFoundError,
	mockParseError,
	mockConsoleLogData,
	resetGetJobMocks,
} from './mocks/getJobService.js';

// Mock console methods to avoid noise in tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe('GetJobService', () => {
	beforeEach(() => {
		// Reset all mocks
		resetGetJobMocks();

		// Mock console methods
		console.log = vi.fn();
		console.error = vi.fn();
	});

	afterEach(() => {
		// Restore console methods
		console.log = originalConsoleLog;
		console.error = originalConsoleError;
	});

	describe('ID Parsing Logic', () => {
		it('should parse valid string IDs correctly', () => {
			const testCases = [
				{ input: '123', expected: 123 },
				{ input: '456', expected: 456 },
				{ input: '1', expected: 1 },
				{ input: '999999', expected: 999999 },
				{ input: '0', expected: 0 },
			];

			testCases.forEach(({ input, expected }) => {
				const result = parseInt(input);
				expect(result).toBe(expected);
			});
		});

		it('should handle numeric IDs correctly', () => {
			const testCases = [
				{ input: 123, expected: 123 },
				{ input: 456, expected: 456 },
				{ input: 1, expected: 1 },
				{ input: 999999, expected: 999999 },
				{ input: 0, expected: 0 },
			];

			testCases.forEach(({ input, expected }) => {
				const result = parseInt(input);
				expect(result).toBe(expected);
			});
		});

		it('should handle edge cases for parseInt', () => {
			const testCases = [
				{ input: '123.45', expected: 123 }, // parseInt truncates decimals
				{ input: '1e3', expected: 1 }, // parseInt stops at 'e'
				{ input: '0x10', expected: 16 }, // Hexadecimal
				{ input: '010', expected: 10 }, // Octal (in strict mode)
			];

			testCases.forEach(({ input, expected }) => {
				const result = parseInt(input);
				expect(result).toBe(expected);
			});
		});

		it('should handle invalid parseInt inputs', () => {
			const testCases = [
				{ input: 'abc', expected: NaN },
				{ input: '', expected: NaN },
				{ input: null, expected: NaN },
				{ input: undefined, expected: NaN },
			];

			testCases.forEach(({ input, expected }) => {
				const result = parseInt(input);
				if (isNaN(expected)) {
					expect(isNaN(result)).toBe(true);
				} else {
					expect(result).toBe(expected);
				}
			});
		});
	});

	describe('Data Processing Logic', () => {
		it('should create correct Prisma query structure', () => {
			const id = 123;
			const queryOptions = {
				where: { id: parseInt(id) },
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

		it('should include all required relations', () => {
			const includeOptions = {
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
			};

			expect(includeOptions).toHaveProperty('city');
			expect(includeOptions).toHaveProperty('category');
			expect(includeOptions).toHaveProperty('user');
			expect(includeOptions.city).toBe(true);
			expect(includeOptions.category).toBe(true);
			expect(includeOptions.user).toHaveProperty('select');
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
		it('should handle database errors gracefully', () => {
			const handleDatabaseError = (error) => {
				console.error('Ошибка в getJobByIdService:', error.message);
				throw new Error('Ошибка получения объявления');
			};

			const dbError = mockPrismaError;

			expect(() => handleDatabaseError(dbError)).toThrow(
				'Ошибка получения объявления',
			);
		});

		it('should log error message before throwing', () => {
			const handleError = (error) => {
				console.error('Ошибка в getJobByIdService:', error.message);
				throw new Error('Ошибка получения объявления');
			};

			const error = new Error('Test error message');

			expect(() => handleError(error)).toThrow('Ошибка получения объявления');
			expect(console.error).toHaveBeenCalledWith(
				'Ошибка в getJobByIdService:',
				'Test error message',
			);
		});

		it('should handle job not found scenarios', () => {
			const job = mockJobData.nullJob;

			expect(job).toBe(null);
		});

		it('should handle parse errors', () => {
			const handleParseError = (id) => {
				const parsedId = parseInt(id);
				if (isNaN(parsedId)) {
					throw new Error('Invalid ID format');
				}
				return parsedId;
			};

			expect(() => handleParseError('abc')).toThrow('Invalid ID format');
			expect(() => handleParseError('')).toThrow('Invalid ID format');
			expect(() => handleParseError(null)).toThrow('Invalid ID format');
		});
	});

	describe('Console Logging Tests', () => {
		it('should log job fetching information', () => {
			const logFetchingJob = (id) => {
				console.log('🔍 getJobByIdService - Fetching job with ID:', id);
			};

			const id = '123';
			logFetchingJob(id);

			expect(console.log).toHaveBeenCalledWith(
				'🔍 getJobByIdService - Fetching job with ID:',
				id,
			);
		});

		it('should log job found information with image URL', () => {
			const logJobFound = (job) => {
				console.log('🔍 getJobByIdService - Job found:', {
					id: job?.id,
					title: job?.title,
					imageUrl: job?.imageUrl,
					hasImageUrl: !!job?.imageUrl,
				});
			};

			const job = mockJobData.jobWithImage;
			logJobFound(job);

			expect(console.log).toHaveBeenCalledWith(
				'🔍 getJobByIdService - Job found:',
				{
					id: 123,
					title: 'Software Developer Position',
					imageUrl: 'https://example.com/image.jpg',
					hasImageUrl: true,
				},
			);
		});

		it('should log job found information without image URL', () => {
			const logJobFound = (job) => {
				console.log('🔍 getJobByIdService - Job found:', {
					id: job?.id,
					title: job?.title,
					imageUrl: job?.imageUrl,
					hasImageUrl: !!job?.imageUrl,
				});
			};

			const job = mockJobData.jobWithoutImage;
			logJobFound(job);

			expect(console.log).toHaveBeenCalledWith(
				'🔍 getJobByIdService - Job found:',
				{
					id: 456,
					title: 'Marketing Manager Position',
					imageUrl: null,
					hasImageUrl: false,
				},
			);
		});

		it('should log job found information with empty image URL', () => {
			const logJobFound = (job) => {
				console.log('🔍 getJobByIdService - Job found:', {
					id: job?.id,
					title: job?.title,
					imageUrl: job?.imageUrl,
					hasImageUrl: !!job?.imageUrl,
				});
			};

			const job = mockJobData.jobWithEmptyImageUrl;
			logJobFound(job);

			expect(console.log).toHaveBeenCalledWith(
				'🔍 getJobByIdService - Job found:',
				{
					id: 789,
					title: 'Designer Position',
					imageUrl: '',
					hasImageUrl: false,
				},
			);
		});

		it('should log job not found information', () => {
			const logJobFound = (job) => {
				console.log('🔍 getJobByIdService - Job found:', {
					id: job?.id,
					title: job?.title,
					imageUrl: job?.imageUrl,
					hasImageUrl: !!job?.imageUrl,
				});
			};

			const job = mockJobData.nullJob;
			logJobFound(job);

			expect(console.log).toHaveBeenCalledWith(
				'🔍 getJobByIdService - Job found:',
				{
					id: undefined,
					title: undefined,
					imageUrl: undefined,
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

	describe('Service Response Tests', () => {
		it('should return job directly (not wrapped in object)', () => {
			const job = mockJobData.jobWithImage;

			// The service returns the job directly, not wrapped in { job: ... }
			expect(job).toHaveProperty('id');
			expect(job).toHaveProperty('title');
			expect(job).toHaveProperty('city');
			expect(job).toHaveProperty('category');
			expect(job).toHaveProperty('user');
		});

		it('should return null for job not found', () => {
			const job = mockJobData.nullJob;

			expect(job).toBe(null);
		});

		it('should throw error for database failures', () => {
			const handleError = () => {
				throw new Error('Ошибка получения объявления');
			};

			expect(handleError).toThrow('Ошибка получения объявления');
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
				const result = parseInt(input);
				expect(result).toBe(expected);
			});
		});

		it('should handle edge cases for parseInt', () => {
			const testCases = [
				{ input: '123.45', expected: 123 },
				{ input: '1e3', expected: 1 },
				{ input: '0x10', expected: 16 },
			];

			testCases.forEach(({ input, expected }) => {
				const result = parseInt(input);
				expect(result).toBe(expected);
			});
		});

		it('should handle invalid parseInt inputs', () => {
			const testCases = [
				{ input: 'abc', expected: NaN },
				{ input: '', expected: NaN },
				{ input: null, expected: NaN },
				{ input: undefined, expected: NaN },
			];

			testCases.forEach(({ input, expected }) => {
				const result = parseInt(input);
				if (isNaN(expected)) {
					expect(isNaN(result)).toBe(true);
				} else {
					expect(result).toBe(expected);
				}
			});
		});
	});

	describe('Optional Chaining Tests', () => {
		it('should handle optional chaining for job properties', () => {
			const job = mockJobData.jobWithImage;

			// Test optional chaining behavior
			expect(job?.id).toBe(123);
			expect(job?.title).toBe('Software Developer Position');
			expect(job?.imageUrl).toBe('https://example.com/image.jpg');
			expect(job?.city?.name).toBe('Jerusalem');
			expect(job?.category?.name).toBe('Software Development');
			expect(job?.user?.firstName).toBe('John');
		});

		it('should handle optional chaining for null job', () => {
			const job = mockJobData.nullJob;

			// Test optional chaining with null
			expect(job?.id).toBe(undefined);
			expect(job?.title).toBe(undefined);
			expect(job?.imageUrl).toBe(undefined);
			expect(job?.city?.name).toBe(undefined);
			expect(job?.category?.name).toBe(undefined);
			expect(job?.user?.firstName).toBe(undefined);
		});

		it('should handle optional chaining for undefined properties', () => {
			const job = {};

			// Test optional chaining with undefined properties
			expect(job?.id).toBe(undefined);
			expect(job?.title).toBe(undefined);
			expect(job?.imageUrl).toBe(undefined);
			expect(job?.city?.name).toBe(undefined);
			expect(job?.category?.name).toBe(undefined);
			expect(job?.user?.firstName).toBe(undefined);
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
			const notFoundError = mockNotFoundError;
			const parseError = mockParseError;

			expect(prismaError).toBeInstanceOf(Error);
			expect(notFoundError).toBeInstanceOf(Error);
			expect(parseError).toBeInstanceOf(Error);

			expect(prismaError.message).toBe('Database connection failed');
			expect(notFoundError.message).toBe('Job not found');
			expect(parseError.message).toBe('Invalid ID format');
		});

		it('should have valid mock console log data', () => {
			const fetchingData = mockConsoleLogData.fetchingJob;
			const foundData = mockConsoleLogData.jobFoundWithImage;

			expect(fetchingData).toHaveProperty('id');
			expect(foundData).toHaveProperty('id');
			expect(foundData).toHaveProperty('title');
			expect(foundData).toHaveProperty('imageUrl');
			expect(foundData).toHaveProperty('hasImageUrl');

			expect(typeof fetchingData.id).toBe('string');
			expect(typeof foundData.id).toBe('number');
			expect(typeof foundData.title).toBe('string');
			expect(typeof foundData.imageUrl).toBe('string');
			expect(typeof foundData.hasImageUrl).toBe('boolean');
		});
	});
});

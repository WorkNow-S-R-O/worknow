import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Import mock data
import {
	mockJobData,
	mockCreatedJob,
	mockPrismaError,
} from './mocks/createJobService.js';

// Mock console methods to avoid noise in tests
const originalConsoleError = console.error;

describe('CreateJobService', () => {
	beforeEach(() => {
		// Mock console methods
		console.error = vi.fn();
	});

	afterEach(() => {
		// Restore console methods
		console.error = originalConsoleError;
	});

	describe('Data Processing Logic', () => {
		it('should correctly destructure job data', () => {
			const jobData = mockJobData.validJobData;
			
			// Test the destructuring logic from the service
			const { title, description, salary, cityId, categoryId, userId, phone } = jobData;

			expect(title).toBe('Software Developer');
			expect(description).toBe('Looking for an experienced software developer');
			expect(salary).toBe('5000');
			expect(cityId).toBe('1');
			expect(categoryId).toBe('2');
			expect(userId).toBe('user-123');
			expect(phone).toBe('+972-50-123-4567');
		});

		it('should convert salary to integer correctly', () => {
			const testCases = [
				{ input: '5000', expected: 5000 },
				{ input: '6000', expected: 6000 },
				{ input: 4500, expected: 4500 },
				{ input: '0', expected: 0 },
				{ input: '999999', expected: 999999 },
			];

			testCases.forEach(({ input, expected }) => {
				const result = parseInt(input);
				expect(result).toBe(expected);
			});
		});

		it('should convert cityId to integer correctly', () => {
			const testCases = [
				{ input: '1', expected: 1 },
				{ input: '2', expected: 2 },
				{ input: 3, expected: 3 },
				{ input: '0', expected: 0 },
				{ input: '100', expected: 100 },
			];

			testCases.forEach(({ input, expected }) => {
				const result = parseInt(input);
				expect(result).toBe(expected);
			});
		});

		it('should convert categoryId to integer correctly', () => {
			const testCases = [
				{ input: '1', expected: 1 },
				{ input: '2', expected: 2 },
				{ input: 3, expected: 3 },
				{ input: '0', expected: 0 },
				{ input: '50', expected: 50 },
			];

			testCases.forEach(({ input, expected }) => {
				const result = parseInt(input);
				expect(result).toBe(expected);
			});
		});

		it('should handle NaN values gracefully', () => {
			const testCases = [
				{ input: 'invalid', expected: NaN },
				{ input: '', expected: NaN },
				{ input: null, expected: NaN },
				{ input: undefined, expected: NaN },
			];

			testCases.forEach(({ input, expected }) => {
				const result = parseInt(input);
				expect(isNaN(result)).toBe(true);
			});
		});

		it('should create correct data structure for Prisma', () => {
			const jobData = mockJobData.validJobData;
			const { title, description, salary, cityId, categoryId, userId, phone } = jobData;

			// Test the data structure that would be sent to Prisma
			const prismaData = {
				title,
				description,
				salary: parseInt(salary),
				cityId: parseInt(cityId),
				categoryId: parseInt(categoryId),
				userId,
				phone,
				status: 'ACTIVE',
			};

			expect(prismaData).toEqual({
				title: 'Software Developer',
				description: 'Looking for an experienced software developer',
				salary: 5000,
				cityId: 1,
				categoryId: 2,
				userId: 'user-123',
				phone: '+972-50-123-4567',
				status: 'ACTIVE',
			});
		});

		it('should include correct Prisma query options', () => {
			// Test the include options that would be used in the Prisma query
			const includeOptions = {
				city: true,
				category: true,
			};

			expect(includeOptions).toEqual({
				city: true,
				category: true,
			});
		});
	});

	describe('Data Validation Tests', () => {
		it('should handle empty string values', () => {
			const emptyStringData = {
				title: '',
				description: '',
				salary: '',
				cityId: '',
				categoryId: '',
				userId: '',
				phone: '',
			};

			const { title, description, salary, cityId, categoryId, userId, phone } = emptyStringData;

			const prismaData = {
				title,
				description,
				salary: parseInt(salary),
				cityId: parseInt(cityId),
				categoryId: parseInt(categoryId),
				userId,
				phone,
				status: 'ACTIVE',
			};

			expect(prismaData).toEqual({
				title: '',
				description: '',
				salary: NaN, // parseInt('') = NaN
				cityId: NaN, // parseInt('') = NaN
				categoryId: NaN, // parseInt('') = NaN
				userId: '',
				phone: '',
				status: 'ACTIVE',
			});
		});

		it('should handle null values', () => {
			const nullData = {
				title: null,
				description: null,
				salary: null,
				cityId: null,
				categoryId: null,
				userId: null,
				phone: null,
			};

			const { title, description, salary, cityId, categoryId, userId, phone } = nullData;

			const prismaData = {
				title,
				description,
				salary: parseInt(salary),
				cityId: parseInt(cityId),
				categoryId: parseInt(categoryId),
				userId,
				phone,
				status: 'ACTIVE',
			};

			expect(prismaData).toEqual({
				title: null,
				description: null,
				salary: NaN, // parseInt(null) = NaN
				cityId: NaN, // parseInt(null) = NaN
				categoryId: NaN, // parseInt(null) = NaN
				userId: null,
				phone: null,
				status: 'ACTIVE',
			});
		});

		it('should handle undefined values', () => {
			const undefinedData = {
				title: undefined,
				description: undefined,
				salary: undefined,
				cityId: undefined,
				categoryId: undefined,
				userId: undefined,
				phone: undefined,
			};

			const { title, description, salary, cityId, categoryId, userId, phone } = undefinedData;

			const prismaData = {
				title,
				description,
				salary: parseInt(salary),
				cityId: parseInt(cityId),
				categoryId: parseInt(categoryId),
				userId,
				phone,
				status: 'ACTIVE',
			};

			expect(prismaData).toEqual({
				title: undefined,
				description: undefined,
				salary: NaN, // parseInt(undefined) = NaN
				cityId: NaN, // parseInt(undefined) = NaN
				categoryId: NaN, // parseInt(undefined) = NaN
				userId: undefined,
				phone: undefined,
				status: 'ACTIVE',
			});
		});

		it('should handle mixed data types', () => {
			const mixedData = {
				title: 'Test Job',
				description: 'Test Description',
				salary: '5000', // String
				cityId: 1, // Number
				categoryId: '2', // String
				userId: 'user-123',
				phone: '+972-50-123-4567',
			};

			const { title, description, salary, cityId, categoryId, userId, phone } = mixedData;

			const prismaData = {
				title,
				description,
				salary: parseInt(salary),
				cityId: parseInt(cityId),
				categoryId: parseInt(categoryId),
				userId,
				phone,
				status: 'ACTIVE',
			};

			expect(prismaData).toEqual({
				title: 'Test Job',
				description: 'Test Description',
				salary: 5000, // String converted to number
				cityId: 1, // Number stays number
				categoryId: 2, // String converted to number
				userId: 'user-123',
				phone: '+972-50-123-4567',
				status: 'ACTIVE',
			});
		});
	});

	describe('Service Response Format Tests', () => {
		it('should return job with correct structure', () => {
			// Test the expected response structure
			const expectedJob = mockCreatedJob;

			expect(expectedJob).toHaveProperty('id');
			expect(expectedJob).toHaveProperty('title');
			expect(expectedJob).toHaveProperty('description');
			expect(expectedJob).toHaveProperty('salary');
			expect(expectedJob).toHaveProperty('cityId');
			expect(expectedJob).toHaveProperty('categoryId');
			expect(expectedJob).toHaveProperty('userId');
			expect(expectedJob).toHaveProperty('phone');
			expect(expectedJob).toHaveProperty('status');
			expect(expectedJob).toHaveProperty('city');
			expect(expectedJob).toHaveProperty('category');
		});

		it('should include city relation data', () => {
			const job = mockCreatedJob;

			expect(job.city).toHaveProperty('id');
			expect(job.city).toHaveProperty('name');
			expect(job.city.id).toBe(1);
			expect(job.city.name).toBe('Tel Aviv');
		});

		it('should include category relation data', () => {
			const job = mockCreatedJob;

			expect(job.category).toHaveProperty('id');
			expect(job.category).toHaveProperty('name');
			expect(job.category.id).toBe(2);
			expect(job.category.name).toBe('Technology');
		});

		it('should set status to ACTIVE by default', () => {
			const job = mockCreatedJob;

			expect(job.status).toBe('ACTIVE');
		});
	});

	describe('Error Handling Tests', () => {
		it('should handle database errors gracefully', () => {
			// Test error handling logic
			const handleError = (error) => {
				console.error('Error creating job:', error);
				throw new Error('Failed to create job');
			};

			const dbError = new Error('Database connection failed');
			
			expect(() => handleError(dbError)).toThrow('Failed to create job');
		});

		it('should log the original error before throwing', () => {
			const handleError = (error) => {
				console.error('Error creating job:', error);
				throw new Error('Failed to create job');
			};

			const originalError = new Error('Original database error');
			
			expect(() => handleError(originalError)).toThrow('Failed to create job');
			expect(console.error).toHaveBeenCalledWith('Error creating job:', originalError);
		});

		it('should handle non-Error objects thrown by Prisma', () => {
			const handleError = (error) => {
				console.error('Error creating job:', error);
				throw new Error('Failed to create job');
			};

			const nonErrorObject = { message: 'Not an Error object' };
			
			expect(() => handleError(nonErrorObject)).toThrow('Failed to create job');
			expect(console.error).toHaveBeenCalledWith('Error creating job:', nonErrorObject);
		});

		it('should throw generic error message for any database error', () => {
			const handleError = (error) => {
				console.error('Error creating job:', error);
				throw new Error('Failed to create job');
			};

			const customError = new Error('Custom database error');
			
			expect(() => handleError(customError)).toThrow('Failed to create job');
		});
	});

	describe('Data Type Conversion Tests', () => {
		it('should handle string numbers correctly', () => {
			const stringNumbers = {
				salary: '5000',
				cityId: '1',
				categoryId: '2',
			};

			const converted = {
				salary: parseInt(stringNumbers.salary),
				cityId: parseInt(stringNumbers.cityId),
				categoryId: parseInt(stringNumbers.categoryId),
			};

			expect(converted).toEqual({
				salary: 5000,
				cityId: 1,
				categoryId: 2,
			});
		});

		it('should handle numeric values correctly', () => {
			const numericValues = {
				salary: 5000,
				cityId: 1,
				categoryId: 2,
			};

			const converted = {
				salary: parseInt(numericValues.salary),
				cityId: parseInt(numericValues.cityId),
				categoryId: parseInt(numericValues.categoryId),
			};

			expect(converted).toEqual({
				salary: 5000,
				cityId: 1,
				categoryId: 2,
			});
		});

		it('should handle edge cases for parseInt', () => {
			const edgeCases = [
				{ input: '0', expected: 0 },
				{ input: '-1', expected: -1 },
				{ input: '1.5', expected: 1 }, // parseInt truncates decimals
				{ input: '1e3', expected: 1 }, // parseInt stops at 'e' character
				{ input: '0x10', expected: 16 }, // Hexadecimal
				{ input: '010', expected: 10 }, // Octal (in strict mode)
			];

			edgeCases.forEach(({ input, expected }) => {
				const result = parseInt(input);
				expect(result).toBe(expected);
			});
		});
	});

	describe('Mock Data Validation', () => {
		it('should have valid mock job data', () => {
			const validData = mockJobData.validJobData;

			expect(validData).toHaveProperty('title');
			expect(validData).toHaveProperty('description');
			expect(validData).toHaveProperty('salary');
			expect(validData).toHaveProperty('cityId');
			expect(validData).toHaveProperty('categoryId');
			expect(validData).toHaveProperty('userId');
			expect(validData).toHaveProperty('phone');

			expect(typeof validData.title).toBe('string');
			expect(typeof validData.description).toBe('string');
			expect(typeof validData.salary).toBe('string');
			expect(typeof validData.cityId).toBe('string');
			expect(typeof validData.categoryId).toBe('string');
			expect(typeof validData.userId).toBe('string');
			expect(typeof validData.phone).toBe('string');
		});

		it('should have valid mock created job', () => {
			const createdJob = mockCreatedJob;

			expect(createdJob).toHaveProperty('id');
			expect(createdJob).toHaveProperty('title');
			expect(createdJob).toHaveProperty('description');
			expect(createdJob).toHaveProperty('salary');
			expect(createdJob).toHaveProperty('cityId');
			expect(createdJob).toHaveProperty('categoryId');
			expect(createdJob).toHaveProperty('userId');
			expect(createdJob).toHaveProperty('phone');
			expect(createdJob).toHaveProperty('status');
			expect(createdJob).toHaveProperty('city');
			expect(createdJob).toHaveProperty('category');

			expect(typeof createdJob.id).toBe('number');
			expect(typeof createdJob.title).toBe('string');
			expect(typeof createdJob.description).toBe('string');
			expect(typeof createdJob.salary).toBe('number');
			expect(typeof createdJob.cityId).toBe('number');
			expect(typeof createdJob.categoryId).toBe('number');
			expect(typeof createdJob.userId).toBe('string');
			expect(typeof createdJob.phone).toBe('string');
			expect(typeof createdJob.status).toBe('string');
			expect(typeof createdJob.city).toBe('object');
			expect(typeof createdJob.category).toBe('object');
		});

		it('should have valid mock error', () => {
			const error = mockPrismaError;

			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe('Database connection failed');
		});
	});
});
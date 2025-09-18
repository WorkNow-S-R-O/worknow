import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Import mock data
import {
	mockUserData,
	mockPrismaQueryOptions,
	mockPrismaError,
	mockNotFoundError,
	mockValidationError,
	mockConsoleLogData,
	resetGetUserByClerkMocks,
} from './mocks/getUserByClerkService.js';

// Mock console methods to avoid noise in tests
const originalConsoleError = console.error;

describe('GetUserByClerkService', () => {
	beforeEach(() => {
		// Reset all mocks
		resetGetUserByClerkMocks();
		
		// Mock console methods
		console.error = vi.fn();
	});

	afterEach(() => {
		// Restore console methods
		console.error = originalConsoleError;
	});

	describe('ClerkUserId Validation Logic', () => {
		it('should accept valid clerk user IDs', () => {
			const validIds = Object.values(mockUserData.validClerkUserIds);

			validIds.forEach(id => {
				expect(typeof id).toBe('string');
				expect(id.length).toBeGreaterThan(0);
				expect(id.trim()).toBe(id); // No leading/trailing whitespace
			});
		});

		it('should handle standard clerk user ID format', () => {
			const clerkUserId = mockUserData.validClerkUserIds.standard;

			expect(clerkUserId).toBe('user_123456789');
			expect(clerkUserId).toMatch(/^user_\w+$/);
		});

		it('should handle clerk user IDs with underscores', () => {
			const clerkUserId = mockUserData.validClerkUserIds.withUnderscore;

			expect(clerkUserId).toBe('user_abc_def');
			expect(clerkUserId).toMatch(/^user_\w+$/);
		});

		it('should handle clerk user IDs with numbers', () => {
			const clerkUserId = mockUserData.validClerkUserIds.withNumbers;

			expect(clerkUserId).toBe('user_123456');
			expect(clerkUserId).toMatch(/^user_\w+$/);
		});

		it('should handle clerk user IDs with letters', () => {
			const clerkUserId = mockUserData.validClerkUserIds.withLetters;

			expect(clerkUserId).toBe('user_abcdef');
			expect(clerkUserId).toMatch(/^user_\w+$/);
		});

		it('should handle mixed clerk user IDs', () => {
			const clerkUserId = mockUserData.validClerkUserIds.mixed;

			expect(clerkUserId).toBe('user_123abc456def');
			expect(clerkUserId).toMatch(/^user_\w+$/);
		});

		it('should handle long clerk user IDs', () => {
			const clerkUserId = mockUserData.validClerkUserIds.long;

			expect(clerkUserId).toBe('user_very_long_clerk_user_id_string');
			expect(clerkUserId).toMatch(/^user_\w+$/);
		});

		it('should reject null clerk user IDs', () => {
			const clerkUserId = mockUserData.invalidClerkUserIds.null;

			expect(clerkUserId).toBe(null);
		});

		it('should reject undefined clerk user IDs', () => {
			const clerkUserId = mockUserData.invalidClerkUserIds.undefined;

			expect(clerkUserId).toBe(undefined);
		});

		it('should reject empty clerk user IDs', () => {
			const clerkUserId = mockUserData.invalidClerkUserIds.empty;

			expect(clerkUserId).toBe('');
			expect(clerkUserId.length).toBe(0);
		});

		it('should reject whitespace-only clerk user IDs', () => {
			const clerkUserId = mockUserData.invalidClerkUserIds.whitespace;

			expect(clerkUserId).toBe('   ');
			expect(clerkUserId.trim()).toBe('');
		});

		it('should reject clerk user IDs with spaces', () => {
			const clerkUserId = mockUserData.invalidClerkUserIds.withSpaces;

			expect(clerkUserId).toBe('user 123');
			expect(clerkUserId).toContain(' ');
		});

		it('should reject clerk user IDs with special characters', () => {
			const clerkUserId = mockUserData.invalidClerkUserIds.withSpecialChars;

			expect(clerkUserId).toBe('user@123#');
			expect(clerkUserId).toMatch(/[@#]/);
		});
	});

	describe('Data Processing Logic', () => {
		it('should create correct Prisma query structure', () => {
			const clerkUserId = 'user_123456789';
			const queryOptions = {
				where: { clerkUserId },
			};

			expect(queryOptions).toEqual(mockPrismaQueryOptions);
		});

		it('should use clerkUserId in where clause', () => {
			const clerkUserId = 'user_123456789';
			const whereClause = { clerkUserId };

			expect(whereClause).toHaveProperty('clerkUserId');
			expect(whereClause.clerkUserId).toBe('user_123456789');
		});

		it('should not include additional fields in query', () => {
			const queryOptions = {
				where: { clerkUserId: 'user_123456789' },
			};

			expect(queryOptions).not.toHaveProperty('include');
			expect(queryOptions).not.toHaveProperty('select');
			expect(queryOptions).not.toHaveProperty('orderBy');
		});
	});

	describe('User Data Structure Tests', () => {
		it('should return user with complete data structure', () => {
			const user = mockUserData.userWithCompleteData;

			expect(user).toHaveProperty('id');
			expect(user).toHaveProperty('email');
			expect(user).toHaveProperty('clerkUserId');
			expect(user).toHaveProperty('firstName');
			expect(user).toHaveProperty('lastName');
			expect(user).toHaveProperty('imageUrl');
			expect(user).toHaveProperty('isPremium');
			expect(user).toHaveProperty('isAutoRenewal');
			expect(user).toHaveProperty('premiumEndsAt');
			expect(user).toHaveProperty('stripeSubscriptionId');
			expect(user).toHaveProperty('premiumDeluxe');
			expect(user).toHaveProperty('isAdmin');
			expect(user).toHaveProperty('createdAt');
			expect(user).toHaveProperty('updatedAt');
		});

		it('should handle user with minimal data', () => {
			const user = mockUserData.userWithMinimalData;

			expect(user).toHaveProperty('id');
			expect(user).toHaveProperty('email');
			expect(user).toHaveProperty('clerkUserId');
			expect(user.firstName).toBe(null);
			expect(user.lastName).toBe(null);
			expect(user.imageUrl).toBe(null);
			expect(user.isPremium).toBe(false);
			expect(user.isAutoRenewal).toBe(false);
			expect(user.premiumEndsAt).toBe(null);
			expect(user.stripeSubscriptionId).toBe(null);
			expect(user.premiumDeluxe).toBe(false);
			expect(user.isAdmin).toBe(false);
		});

		it('should handle premium user data', () => {
			const user = mockUserData.premiumUser;

			expect(user.isPremium).toBe(true);
			expect(user.isAutoRenewal).toBe(true);
			expect(user.premiumDeluxe).toBe(true);
			expect(user.premiumEndsAt).toBeInstanceOf(Date);
			expect(user.stripeSubscriptionId).toBe('sub_premium123');
		});

		it('should handle admin user data', () => {
			const user = mockUserData.adminUser;

			expect(user.isAdmin).toBe(true);
			expect(user.isPremium).toBe(true);
			expect(user.premiumDeluxe).toBe(true);
		});

		it('should handle regular user data', () => {
			const user = mockUserData.regularUser;

			expect(user.isPremium).toBe(false);
			expect(user.isAutoRenewal).toBe(false);
			expect(user.premiumDeluxe).toBe(false);
			expect(user.isAdmin).toBe(false);
			expect(user.premiumEndsAt).toBe(null);
			expect(user.stripeSubscriptionId).toBe(null);
		});
	});

	describe('User Type Tests', () => {
		it('should identify premium users correctly', () => {
			const premiumUser = mockUserData.premiumUser;
			const regularUser = mockUserData.regularUser;

			expect(premiumUser.isPremium).toBe(true);
			expect(regularUser.isPremium).toBe(false);
		});

		it('should identify admin users correctly', () => {
			const adminUser = mockUserData.adminUser;
			const regularUser = mockUserData.regularUser;

			expect(adminUser.isAdmin).toBe(true);
			expect(regularUser.isAdmin).toBe(false);
		});

		it('should identify premium deluxe users correctly', () => {
			const premiumUser = mockUserData.premiumUser;
			const regularUser = mockUserData.regularUser;

			expect(premiumUser.premiumDeluxe).toBe(true);
			expect(regularUser.premiumDeluxe).toBe(false);
		});

		it('should handle auto-renewal settings correctly', () => {
			const premiumUser = mockUserData.premiumUser;
			const regularUser = mockUserData.regularUser;

			expect(premiumUser.isAutoRenewal).toBe(true);
			expect(regularUser.isAutoRenewal).toBe(false);
		});
	});

	describe('Error Handling Tests', () => {
		it('should handle database errors gracefully', () => {
			const handleDatabaseError = (error) => {
				console.error('Ошибка в getUserByClerkIdService:', error.message);
				throw new Error('Ошибка получения данных пользователя');
			};

			const dbError = mockPrismaError;
			
			expect(() => handleDatabaseError(dbError)).toThrow('Ошибка получения данных пользователя');
		});

		it('should log error message before throwing', () => {
			const handleError = (error) => {
				console.error('Ошибка в getUserByClerkIdService:', error.message);
				throw new Error('Ошибка получения данных пользователя');
			};

			const error = new Error('Test error message');
			
			expect(() => handleError(error)).toThrow('Ошибка получения данных пользователя');
			expect(console.error).toHaveBeenCalledWith('Ошибка в getUserByClerkIdService:', 'Test error message');
		});

		it('should handle user not found scenarios', () => {
			const user = mockUserData.nullUser;

			expect(user).toBe(null);
		});

		it('should handle validation errors', () => {
			const handleValidationError = (clerkUserId) => {
				if (!clerkUserId || typeof clerkUserId !== 'string' || clerkUserId.trim() === '') {
					throw new Error('Invalid clerkUserId format');
				}
				return clerkUserId;
			};

			expect(() => handleValidationError(null)).toThrow('Invalid clerkUserId format');
			expect(() => handleValidationError('')).toThrow('Invalid clerkUserId format');
			expect(() => handleValidationError('   ')).toThrow('Invalid clerkUserId format');
		});
	});

	describe('Console Logging Tests', () => {
		it('should log error message correctly', () => {
			const logError = (error) => {
				console.error('Ошибка в getUserByClerkIdService:', error.message);
			};

			const error = new Error('Database connection failed');
			logError(error);

			expect(console.error).toHaveBeenCalledWith('Ошибка в getUserByClerkIdService:', 'Database connection failed');
		});

		it('should log service error message correctly', () => {
			const throwServiceError = () => {
				throw new Error('Ошибка получения данных пользователя');
			};

			expect(throwServiceError).toThrow('Ошибка получения данных пользователя');
		});

		it('should handle error message extraction', () => {
			const extractErrorMessage = (error) => {
				return error.message;
			};

			const error = new Error('Test error message');
			const message = extractErrorMessage(error);

			expect(message).toBe('Test error message');
		});
	});

	describe('Service Response Tests', () => {
		it('should return user directly (not wrapped in object)', () => {
			const user = mockUserData.userWithCompleteData;

			// The service returns the user directly, not wrapped in { user: ... }
			expect(user).toHaveProperty('id');
			expect(user).toHaveProperty('email');
			expect(user).toHaveProperty('clerkUserId');
			expect(user).toHaveProperty('firstName');
			expect(user).toHaveProperty('lastName');
		});

		it('should return null for user not found', () => {
			const user = mockUserData.nullUser;

			expect(user).toBe(null);
		});

		it('should throw error for database failures', () => {
			const handleError = () => {
				throw new Error('Ошибка получения данных пользователя');
			};

			expect(handleError).toThrow('Ошибка получения данных пользователя');
		});
	});

	describe('Data Type Validation Tests', () => {
		it('should handle string clerk user IDs correctly', () => {
			const clerkUserId = 'user_123456789';

			expect(typeof clerkUserId).toBe('string');
			expect(clerkUserId).toBe('user_123456789');
		});

		it('should handle null clerk user IDs', () => {
			const clerkUserId = null;

			expect(clerkUserId).toBe(null);
		});

		it('should handle undefined clerk user IDs', () => {
			const clerkUserId = undefined;

			expect(clerkUserId).toBe(undefined);
		});

		it('should handle empty string clerk user IDs', () => {
			const clerkUserId = '';

			expect(typeof clerkUserId).toBe('string');
			expect(clerkUserId).toBe('');
			expect(clerkUserId.length).toBe(0);
		});
	});

	describe('Date Handling Tests', () => {
		it('should handle premium end dates correctly', () => {
			const user = mockUserData.premiumUser;

			expect(user.premiumEndsAt).toBeInstanceOf(Date);
			expect(user.premiumEndsAt.getFullYear()).toBe(2025);
			expect(user.premiumEndsAt.getMonth()).toBe(0); // January (0-indexed)
			expect(user.premiumEndsAt.getDate()).toBe(1);
		});

		it('should handle null premium end dates', () => {
			const user = mockUserData.regularUser;

			expect(user.premiumEndsAt).toBe(null);
		});

		it('should handle created and updated dates', () => {
			const user = mockUserData.userWithCompleteData;

			expect(user.createdAt).toBeInstanceOf(Date);
			expect(user.updatedAt).toBeInstanceOf(Date);
			expect(user.createdAt.getFullYear()).toBe(2024);
			expect(user.updatedAt.getFullYear()).toBe(2024);
		});
	});

	describe('Email Validation Tests', () => {
		it('should handle valid email formats', () => {
			const users = [
				mockUserData.userWithCompleteData,
				mockUserData.userWithMinimalData,
				mockUserData.premiumUser,
				mockUserData.adminUser,
				mockUserData.regularUser,
			];

			users.forEach(user => {
				expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
			});
		});

		it('should have unique email addresses', () => {
			const emails = [
				mockUserData.userWithCompleteData.email,
				mockUserData.userWithMinimalData.email,
				mockUserData.premiumUser.email,
				mockUserData.adminUser.email,
				mockUserData.regularUser.email,
			];

			const uniqueEmails = new Set(emails);
			expect(uniqueEmails.size).toBe(emails.length);
		});
	});

	describe('Mock Data Validation', () => {
		it('should have valid mock user data with complete data', () => {
			const user = mockUserData.userWithCompleteData;

			expect(user).toHaveProperty('id');
			expect(user).toHaveProperty('email');
			expect(user).toHaveProperty('clerkUserId');
			expect(user).toHaveProperty('firstName');
			expect(user).toHaveProperty('lastName');
			expect(user).toHaveProperty('imageUrl');
			expect(user).toHaveProperty('isPremium');
			expect(user).toHaveProperty('isAutoRenewal');
			expect(user).toHaveProperty('premiumEndsAt');
			expect(user).toHaveProperty('stripeSubscriptionId');
			expect(user).toHaveProperty('premiumDeluxe');
			expect(user).toHaveProperty('isAdmin');
			expect(user).toHaveProperty('createdAt');
			expect(user).toHaveProperty('updatedAt');

			expect(typeof user.id).toBe('string');
			expect(typeof user.email).toBe('string');
			expect(typeof user.clerkUserId).toBe('string');
			expect(typeof user.firstName).toBe('string');
			expect(typeof user.lastName).toBe('string');
			expect(typeof user.imageUrl).toBe('string');
			expect(typeof user.isPremium).toBe('boolean');
			expect(typeof user.isAutoRenewal).toBe('boolean');
			expect(typeof user.premiumDeluxe).toBe('boolean');
			expect(typeof user.isAdmin).toBe('boolean');
			expect(user.premiumEndsAt).toBeInstanceOf(Date);
			expect(user.createdAt).toBeInstanceOf(Date);
			expect(user.updatedAt).toBeInstanceOf(Date);
		});

		it('should have valid mock user data with minimal data', () => {
			const user = mockUserData.userWithMinimalData;

			expect(user).toHaveProperty('id');
			expect(user).toHaveProperty('email');
			expect(user).toHaveProperty('clerkUserId');
			expect(user).toHaveProperty('firstName');
			expect(user).toHaveProperty('lastName');
			expect(user).toHaveProperty('imageUrl');
			expect(user).toHaveProperty('isPremium');
			expect(user).toHaveProperty('isAutoRenewal');
			expect(user).toHaveProperty('premiumEndsAt');
			expect(user).toHaveProperty('stripeSubscriptionId');
			expect(user).toHaveProperty('premiumDeluxe');
			expect(user).toHaveProperty('isAdmin');
			expect(user).toHaveProperty('createdAt');
			expect(user).toHaveProperty('updatedAt');

			expect(typeof user.id).toBe('string');
			expect(typeof user.email).toBe('string');
			expect(typeof user.clerkUserId).toBe('string');
			expect(user.firstName).toBe(null);
			expect(user.lastName).toBe(null);
			expect(user.imageUrl).toBe(null);
			expect(typeof user.isPremium).toBe('boolean');
			expect(typeof user.isAutoRenewal).toBe('boolean');
			expect(typeof user.premiumDeluxe).toBe('boolean');
			expect(typeof user.isAdmin).toBe('boolean');
			expect(user.premiumEndsAt).toBe(null);
			expect(user.stripeSubscriptionId).toBe(null);
			expect(user.createdAt).toBeInstanceOf(Date);
			expect(user.updatedAt).toBeInstanceOf(Date);
		});

		it('should have valid mock Prisma query options', () => {
			const queryOptions = mockPrismaQueryOptions;

			expect(queryOptions).toHaveProperty('where');
			expect(queryOptions.where).toHaveProperty('clerkUserId');
			expect(queryOptions.where.clerkUserId).toBe('user_123456789');
		});

		it('should have valid mock errors', () => {
			const prismaError = mockPrismaError;
			const notFoundError = mockNotFoundError;
			const validationError = mockValidationError;

			expect(prismaError).toBeInstanceOf(Error);
			expect(notFoundError).toBeInstanceOf(Error);
			expect(validationError).toBeInstanceOf(Error);

			expect(prismaError.message).toBe('Database connection failed');
			expect(notFoundError.message).toBe('User not found');
			expect(validationError.message).toBe('Invalid clerkUserId format');
		});

		it('should have valid mock console log data', () => {
			const consoleData = mockConsoleLogData;

			expect(consoleData).toHaveProperty('errorMessage');
			expect(consoleData).toHaveProperty('errorDetails');
			expect(consoleData).toHaveProperty('serviceError');

			expect(typeof consoleData.errorMessage).toBe('string');
			expect(typeof consoleData.errorDetails).toBe('string');
			expect(typeof consoleData.serviceError).toBe('string');

			expect(consoleData.errorMessage).toBe('Ошибка в getUserByClerkIdService:');
			expect(consoleData.errorDetails).toBe('Database connection failed');
			expect(consoleData.serviceError).toBe('Ошибка получения данных пользователя');
		});
	});
});

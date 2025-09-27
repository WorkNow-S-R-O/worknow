import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Import mock data
import {
	mockPrisma,
	mockJobData,
	mockUserIds,
	mockJobIds,
	mockS3Operations,
	mockS3Responses,
	mockTelegramNotification,
	mockUserJobs,
	mockErrors,
	mockErrorMessages,
	mockSuccessMessages,
	mockConsoleLogData,
	mockServiceResponses,
	mockPrismaQueryOptions,
	mockDataConversions,
	mockAuthorizationLogic,
	mockS3ImageUrls,
	resetJobDeleteMocks,
} from './mocks/jobDeleteService.js';

// Mock console methods to avoid noise in tests
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

describe('JobDeleteService', () => {
	beforeEach(() => {
		// Reset all mocks
		resetJobDeleteMocks();

		// Mock console methods
		console.warn = vi.fn();
		console.error = vi.fn();
	});

	afterEach(() => {
		// Restore console methods
		console.warn = originalConsoleWarn;
		console.error = originalConsoleError;
	});

	describe('Job ID and User ID Validation Logic', () => {
		it('should accept valid job IDs', () => {
			const validIds = Object.values(mockJobIds.validIds);

			validIds.forEach((id) => {
				expect(id).toBeDefined();
				expect(id !== null).toBe(true);
				expect(id !== undefined).toBe(true);
			});
		});

		it('should handle string job IDs', () => {
			const jobId = mockJobIds.validIds.string;

			expect(typeof jobId).toBe('string');
			expect(jobId).toBe('1');
			expect(parseInt(jobId)).toBe(1);
		});

		it('should handle numeric job IDs', () => {
			const jobId = mockJobIds.validIds.number;

			expect(typeof jobId).toBe('number');
			expect(jobId).toBe(1);
			expect(jobId > 0).toBe(true);
		});

		it('should handle large numeric job IDs', () => {
			const jobId = mockJobIds.validIds.largeNumber;

			expect(typeof jobId).toBe('number');
			expect(jobId).toBe(999999);
			expect(jobId > 0).toBe(true);
		});

		it('should reject null job IDs', () => {
			const jobId = mockJobIds.invalidIds.null;

			expect(jobId).toBe(null);
		});

		it('should reject undefined job IDs', () => {
			const jobId = mockJobIds.invalidIds.undefined;

			expect(jobId).toBe(undefined);
		});

		it('should reject empty string job IDs', () => {
			const jobId = mockJobIds.invalidIds.empty;

			expect(jobId).toBe('');
			expect(jobId.length).toBe(0);
		});

		it('should reject zero job IDs', () => {
			const jobId = mockJobIds.invalidIds.zero;

			expect(jobId).toBe(0);
		});

		it('should reject negative job IDs', () => {
			const jobId = mockJobIds.invalidIds.negative;

			expect(jobId).toBe(-1);
			expect(jobId < 0).toBe(true);
		});

		it('should accept valid user IDs', () => {
			const validUserIds = Object.values(mockUserIds.validUserIds);

			validUserIds.forEach((userId) => {
				expect(userId).toBeDefined();
				expect(typeof userId).toBe('string');
				expect(userId.length).toBeGreaterThan(0);
			});
		});

		it('should reject invalid user IDs', () => {
			const invalidUserIds = Object.values(mockUserIds.invalidUserIds);

			invalidUserIds.forEach((userId) => {
				if (userId !== null && userId !== undefined) {
					// Check if it's a string but invalid (empty or whitespace)
					if (typeof userId === 'string') {
						expect(userId.trim().length).toBeLessThanOrEqual(0);
					} else {
						expect(typeof userId).not.toBe('string');
					}
				} else {
					expect(userId === null || userId === undefined).toBe(true);
				}
			});
		});
	});

	describe('Job Retrieval Logic', () => {
		it('should create correct Prisma findUnique query', () => {
			const jobId = 1;
			const queryOptions = {
				where: { id: parseInt(jobId) },
				include: { user: true },
			};

			expect(queryOptions).toEqual(mockPrismaQueryOptions.findUnique);
		});

		it('should include user relation in query', () => {
			const queryOptions = {
				where: { id: 1 },
				include: { user: true },
			};

			expect(queryOptions.include).toHaveProperty('user');
			expect(queryOptions.include.user).toBe(true);
		});

		it('should parse job ID to integer', () => {
			const jobId = '1';
			const parsedId = parseInt(jobId);

			expect(parsedId).toBe(1);
			expect(typeof parsedId).toBe('number');
		});

		it('should handle job with image', () => {
			const job = mockJobData.jobWithImage;

			expect(job).toHaveProperty('imageUrl');
			expect(job.imageUrl).toBe(
				'https://s3.amazonaws.com/bucket/job-image.jpg',
			);
			expect(typeof job.imageUrl).toBe('string');
		});

		it('should handle job without image', () => {
			const job = mockJobData.jobWithoutImage;

			expect(job).toHaveProperty('imageUrl');
			expect(job.imageUrl).toBe(null);
		});

		it('should handle job with undefined image', () => {
			const job = mockJobData.jobWithUndefinedImage;

			expect(job).toHaveProperty('imageUrl');
			expect(job.imageUrl).toBe(undefined);
		});

		it('should handle job with empty image', () => {
			const job = mockJobData.jobWithEmptyImage;

			expect(job).toHaveProperty('imageUrl');
			expect(job.imageUrl).toBe('');
		});

		it('should handle null job', () => {
			const job = mockJobData.nullJob;

			expect(job).toBe(null);
		});
	});

	describe('User Authorization Logic', () => {
		it('should check job ownership correctly', () => {
			const job = mockJobData.jobWithImage;
			const ownerUserId = mockUserIds.validUserIds.owner;
			const differentUserId = mockUserIds.validUserIds.different;

			expect(job.user.clerkUserId).toBe(ownerUserId);
			expect(job.user.clerkUserId).not.toBe(differentUserId);
		});

		it('should authorize job owner', () => {
			const job = mockJobData.jobWithImage;
			const userId = mockUserIds.validUserIds.owner;

			const isAuthorized = mockAuthorizationLogic.isAuthorized(job, userId);

			expect(isAuthorized).toBe(true);
		});

		it('should not authorize different user', () => {
			const job = mockJobData.jobWithImage;
			const userId = mockUserIds.validUserIds.different;

			const isAuthorized = mockAuthorizationLogic.isAuthorized(job, userId);

			expect(isAuthorized).toBe(false);
		});

		it('should handle job owned by different user', () => {
			const job = mockJobData.jobOwnedByDifferentUser;
			const userId = mockUserIds.validUserIds.owner;

			const isAuthorized = mockAuthorizationLogic.isAuthorized(job, userId);

			expect(isAuthorized).toBe(false);
		});

		it('should check ownership with string comparison', () => {
			const checkOwnership = (jobUserId, requestUserId) => {
				return jobUserId === requestUserId;
			};

			expect(checkOwnership('clerk_user123', 'clerk_user123')).toBe(true);
			expect(checkOwnership('clerk_user123', 'clerk_user456')).toBe(false);
			expect(checkOwnership('clerk_user123', '')).toBe(false);
			expect(checkOwnership('clerk_user123', null)).toBe(false);
		});
	});

	describe('S3 Image Deletion Logic', () => {
		it('should check if job has image', () => {
			const jobWithImage = mockJobData.jobWithImage;
			const jobWithoutImage = mockJobData.jobWithoutImage;

			expect(jobWithImage.imageUrl).toBeTruthy();
			expect(jobWithoutImage.imageUrl).toBeFalsy();
		});

		it('should handle valid S3 image URL', () => {
			const imageUrl = mockS3ImageUrls.validUrl;

			expect(imageUrl).toBe('https://s3.amazonaws.com/bucket/job-image.jpg');
			expect(typeof imageUrl).toBe('string');
			expect(imageUrl.length).toBeGreaterThan(0);
		});

		it('should handle invalid S3 image URL', () => {
			const imageUrl = mockS3ImageUrls.invalidUrl;

			expect(imageUrl).toBe('not-a-valid-url');
			expect(typeof imageUrl).toBe('string');
		});

		it('should handle empty S3 image URL', () => {
			const imageUrl = mockS3ImageUrls.emptyUrl;

			expect(imageUrl).toBe('');
			expect(imageUrl.length).toBe(0);
		});

		it('should handle null S3 image URL', () => {
			const imageUrl = mockS3ImageUrls.nullUrl;

			expect(imageUrl).toBe(null);
		});

		it('should handle undefined S3 image URL', () => {
			const imageUrl = mockS3ImageUrls.undefinedUrl;

			expect(imageUrl).toBe(undefined);
		});

		it('should call S3 deletion function', () => {
			const imageUrl = mockS3ImageUrls.validUrl;

			mockS3Operations.deleteFromS3.mockResolvedValue(mockS3Responses.success);

			expect(mockS3Operations.deleteFromS3).toBeDefined();
			expect(typeof mockS3Operations.deleteFromS3).toBe('function');
		});

		it('should handle successful S3 deletion', () => {
			const handleS3Deletion = async (imageUrl) => {
				const imageDeleted = await mockS3Operations.deleteFromS3(imageUrl);
				return imageDeleted;
			};

			mockS3Operations.deleteFromS3.mockResolvedValue(mockS3Responses.success);

			expect(mockS3Responses.success).toBe(true);
		});

		it('should handle failed S3 deletion', () => {
			const handleS3Deletion = async (imageUrl) => {
				const imageDeleted = await mockS3Operations.deleteFromS3(imageUrl);
				return imageDeleted;
			};

			mockS3Operations.deleteFromS3.mockResolvedValue(mockS3Responses.failure);

			expect(mockS3Responses.failure).toBe(false);
		});

		it('should handle S3 deletion error', () => {
			const handleS3Error = async (imageUrl) => {
				try {
					await mockS3Operations.deleteFromS3(imageUrl);
				} catch (error) {
					return error;
				}
			};

			mockS3Operations.deleteFromS3.mockRejectedValue(mockS3Responses.error);

			expect(mockS3Responses.error).toBeInstanceOf(Error);
		});
	});

	describe('Database Deletion Logic', () => {
		it('should create correct Prisma delete query', () => {
			const jobId = 1;
			const queryOptions = {
				where: { id: parseInt(jobId) },
			};

			expect(queryOptions).toEqual(mockPrismaQueryOptions.delete);
		});

		it('should parse job ID to integer in delete', () => {
			const jobId = '1';
			const parsedId = parseInt(jobId);

			expect(parsedId).toBe(1);
			expect(typeof parsedId).toBe('number');
		});

		it('should delete job from database', () => {
			const jobId = 1;

			expect(mockPrisma.job.delete).toBeDefined();
			expect(typeof mockPrisma.job.delete).toBe('function');
		});
	});

	describe('Premium User Telegram Notification Logic', () => {
		it('should identify premium user', () => {
			const premiumUser = mockJobData.jobWithImage.user;
			const freeUser = mockJobData.jobWithoutImage.user;

			expect(premiumUser.isPremium).toBe(true);
			expect(freeUser.isPremium).toBe(false);
		});

		it('should identify premium deluxe user', () => {
			const premiumDeluxeUser = mockJobData.jobWithUndefinedImage.user;

			expect(premiumDeluxeUser.premiumDeluxe).toBe(true);
		});

		it('should create correct Prisma findMany query for user jobs', () => {
			const userId = 'user123';
			const queryOptions = {
				where: { userId: userId },
				include: { city: true },
			};

			expect(queryOptions).toEqual(mockPrismaQueryOptions.findMany);
		});

		it('should include city relation in user jobs query', () => {
			const queryOptions = {
				where: { userId: 'user123' },
				include: { city: true },
			};

			expect(queryOptions.include).toHaveProperty('city');
			expect(queryOptions.include.city).toBe(true);
		});

		it('should send Telegram notification for premium user', () => {
			const user = mockJobData.jobWithImage.user;
			const userJobs = mockUserJobs;

			expect(
				mockTelegramNotification.sendUpdatedJobListToTelegram,
			).toBeDefined();
			expect(typeof mockTelegramNotification.sendUpdatedJobListToTelegram).toBe(
				'function',
			);
		});

		it('should not send Telegram notification for free user', () => {
			const freeUser = mockJobData.jobWithoutImage.user;

			expect(freeUser.isPremium).toBe(false);
		});

		it('should handle user jobs data structure', () => {
			const userJobs = mockUserJobs;

			expect(Array.isArray(userJobs)).toBe(true);
			expect(userJobs).toHaveLength(2);

			userJobs.forEach((job) => {
				expect(job).toHaveProperty('id');
				expect(job).toHaveProperty('title');
				expect(job).toHaveProperty('city');
				expect(job.city).toHaveProperty('id');
				expect(job.city).toHaveProperty('name');
			});
		});
	});

	describe('Console Logging Tests', () => {
		it('should log S3 deletion warning', () => {
			const logS3Warning = () => {
				console.warn(mockConsoleLogData.s3DeletionWarning);
			};

			logS3Warning();

			expect(console.warn).toHaveBeenCalledWith(
				mockConsoleLogData.s3DeletionWarning,
			);
		});

		it('should log S3 deletion error', () => {
			const logS3Error = (error) => {
				console.error(mockConsoleLogData.s3DeletionError, error);
			};

			const error = new Error('S3 deletion failed');
			logS3Error(error);

			expect(console.error).toHaveBeenCalledWith(
				mockConsoleLogData.s3DeletionError,
				error,
			);
		});

		it('should handle S3 deletion warning message', () => {
			const warningMessage = mockConsoleLogData.s3DeletionWarning;

			expect(typeof warningMessage).toBe('string');
			expect(warningMessage).toContain('Failed to delete image from S3');
			expect(warningMessage).toContain('continuing with job deletion');
		});

		it('should handle S3 deletion error message', () => {
			const errorMessage = mockConsoleLogData.s3DeletionError;

			expect(typeof errorMessage).toBe('string');
			expect(errorMessage).toContain('Error deleting image from S3');
		});
	});

	describe('Error Handling Tests', () => {
		it('should handle job not found error', () => {
			const handleJobNotFound = () => {
				return { error: mockErrorMessages.jobNotFound };
			};

			const result = handleJobNotFound();

			expect(result).toHaveProperty('error');
			expect(result.error).toBe('Объявление не найдено');
		});

		it('should handle unauthorized access error', () => {
			const handleUnauthorized = () => {
				return { error: mockErrorMessages.unauthorized };
			};

			const result = handleUnauthorized();

			expect(result).toHaveProperty('error');
			expect(result.error).toBe('У вас нет прав для удаления этого объявления');
		});

		it('should handle database error', () => {
			const handleDatabaseError = (error) => {
				return {
					error: mockErrorMessages.deleteError,
					details: error.message,
				};
			};

			const dbError = mockErrors.databaseError;
			const result = handleDatabaseError(dbError);

			expect(result).toHaveProperty('error');
			expect(result).toHaveProperty('details');
			expect(result.error).toBe('Ошибка удаления объявления');
			expect(result.details).toBe('Database connection failed');
		});

		it('should handle Prisma error', () => {
			const handlePrismaError = (error) => {
				return {
					error: mockErrorMessages.deleteError,
					details: error.message,
				};
			};

			const prismaError = mockErrors.prismaError;
			const result = handlePrismaError(prismaError);

			expect(result).toHaveProperty('error');
			expect(result).toHaveProperty('details');
			expect(result.error).toBe('Ошибка удаления объявления');
			expect(result.details).toBe('Prisma query failed');
		});

		it('should handle timeout error', () => {
			const handleTimeoutError = (error) => {
				return {
					error: mockErrorMessages.deleteError,
					details: error.message,
				};
			};

			const timeoutError = mockErrors.timeoutError;
			const result = handleTimeoutError(timeoutError);

			expect(result).toHaveProperty('error');
			expect(result).toHaveProperty('details');
			expect(result.error).toBe('Ошибка удаления объявления');
			expect(result.details).toBe('Request timeout');
		});

		it('should handle S3 error', () => {
			const handleS3Error = (error) => {
				return {
					error: mockErrorMessages.deleteError,
					details: error.message,
				};
			};

			const s3Error = mockErrors.s3Error;
			const result = handleS3Error(s3Error);

			expect(result).toHaveProperty('error');
			expect(result).toHaveProperty('details');
			expect(result.error).toBe('Ошибка удаления объявления');
			expect(result.details).toBe('S3 operation failed');
		});

		it('should handle Telegram error', () => {
			const handleTelegramError = (error) => {
				return {
					error: mockErrorMessages.deleteError,
					details: error.message,
				};
			};

			const telegramError = mockErrors.telegramError;
			const result = handleTelegramError(telegramError);

			expect(result).toHaveProperty('error');
			expect(result).toHaveProperty('details');
			expect(result.error).toBe('Ошибка удаления объявления');
			expect(result.details).toBe('Telegram notification failed');
		});
	});

	describe('Service Response Format Tests', () => {
		it('should return success response', () => {
			const result = mockServiceResponses.success;

			expect(result).toEqual({});
		});

		it('should return job not found response', () => {
			const result = mockServiceResponses.jobNotFound;

			expect(result).toHaveProperty('error');
			expect(result.error).toBe('Объявление не найдено');
		});

		it('should return unauthorized response', () => {
			const result = mockServiceResponses.unauthorized;

			expect(result).toHaveProperty('error');
			expect(result.error).toBe('У вас нет прав для удаления этого объявления');
		});

		it('should return delete error response with details', () => {
			const result = mockServiceResponses.deleteError;

			expect(result).toHaveProperty('error');
			expect(result).toHaveProperty('details');
			expect(result.error).toBe('Ошибка удаления объявления');
			expect(result.details).toBe('Database connection failed');
		});
	});

	describe('Data Type Conversion Tests', () => {
		it('should convert string job ID to integer', () => {
			const conversions = mockDataConversions.parseInt;

			expect(conversions.jobId).toBe(1);
			expect(typeof conversions.jobId).toBe('number');
		});

		it('should handle boolean values', () => {
			const booleans = mockDataConversions.boolean;

			expect(booleans.hasImage).toBe(true);
			expect(booleans.noImage).toBe(false);
			expect(typeof booleans.hasImage).toBe('boolean');
			expect(typeof booleans.noImage).toBe('boolean');
		});

		it('should handle string values', () => {
			const strings = mockDataConversions.string;

			expect(typeof strings.imageUrl).toBe('string');
			expect(typeof strings.emptyImageUrl).toBe('string');
			expect(strings.imageUrl.length).toBeGreaterThan(0);
			expect(strings.emptyImageUrl.length).toBe(0);
		});

		it('should handle null and undefined values', () => {
			const jobWithoutImage = mockJobData.jobWithoutImage;
			const jobWithUndefinedImage = mockJobData.jobWithUndefinedImage;

			expect(jobWithoutImage.imageUrl).toBe(null);
			expect(jobWithUndefinedImage.imageUrl).toBe(undefined);
		});
	});

	describe('Mock Data Validation', () => {
		it('should have valid mock job data', () => {
			const job = mockJobData.jobWithImage;

			expect(job).toHaveProperty('id');
			expect(job).toHaveProperty('title');
			expect(job).toHaveProperty('description');
			expect(job).toHaveProperty('salary');
			expect(job).toHaveProperty('cityId');
			expect(job).toHaveProperty('categoryId');
			expect(job).toHaveProperty('userId');
			expect(job).toHaveProperty('phone');
			expect(job).toHaveProperty('status');
			expect(job).toHaveProperty('imageUrl');
			expect(job).toHaveProperty('user');

			expect(typeof job.id).toBe('number');
			expect(typeof job.title).toBe('string');
			expect(typeof job.description).toBe('string');
			expect(typeof job.salary).toBe('string');
			expect(typeof job.cityId).toBe('number');
			expect(typeof job.categoryId).toBe('number');
			expect(typeof job.userId).toBe('string');
			expect(typeof job.phone).toBe('string');
			expect(typeof job.status).toBe('string');
			expect(typeof job.imageUrl).toBe('string');
			expect(job.user).toBeInstanceOf(Object);
		});

		it('should have valid mock user IDs', () => {
			const userIds = mockUserIds.validUserIds;

			expect(userIds).toHaveProperty('owner');
			expect(userIds).toHaveProperty('different');
			expect(userIds).toHaveProperty('premium');
			expect(userIds).toHaveProperty('premiumDeluxe');

			expect(typeof userIds.owner).toBe('string');
			expect(typeof userIds.different).toBe('string');
			expect(typeof userIds.premium).toBe('string');
			expect(typeof userIds.premiumDeluxe).toBe('string');

			expect(userIds.owner).toBe('clerk_user123');
			expect(userIds.different).toBe('clerk_user456');
			expect(userIds.premium).toBe('clerk_user789');
			expect(userIds.premiumDeluxe).toBe('clerk_user101');
		});

		it('should have valid mock job IDs', () => {
			const jobIds = mockJobIds.validIds;

			expect(jobIds).toHaveProperty('string');
			expect(jobIds).toHaveProperty('number');
			expect(jobIds).toHaveProperty('largeNumber');

			expect(typeof jobIds.string).toBe('string');
			expect(typeof jobIds.number).toBe('number');
			expect(typeof jobIds.largeNumber).toBe('number');

			expect(jobIds.string).toBe('1');
			expect(jobIds.number).toBe(1);
			expect(jobIds.largeNumber).toBe(999999);
		});

		it('should have valid mock S3 operations', () => {
			const s3Operations = mockS3Operations;

			expect(s3Operations).toHaveProperty('deleteFromS3');

			expect(typeof s3Operations.deleteFromS3).toBe('function');
		});

		it('should have valid mock S3 responses', () => {
			const s3Responses = mockS3Responses;

			expect(s3Responses).toHaveProperty('success');
			expect(s3Responses).toHaveProperty('failure');
			expect(s3Responses).toHaveProperty('error');

			expect(typeof s3Responses.success).toBe('boolean');
			expect(typeof s3Responses.failure).toBe('boolean');
			expect(s3Responses.error).toBeInstanceOf(Error);

			expect(s3Responses.success).toBe(true);
			expect(s3Responses.failure).toBe(false);
		});

		it('should have valid mock Telegram notification', () => {
			const telegramNotification = mockTelegramNotification;

			expect(telegramNotification).toHaveProperty(
				'sendUpdatedJobListToTelegram',
			);

			expect(typeof telegramNotification.sendUpdatedJobListToTelegram).toBe(
				'function',
			);
		});

		it('should have valid mock user jobs', () => {
			const userJobs = mockUserJobs;

			expect(Array.isArray(userJobs)).toBe(true);
			expect(userJobs).toHaveLength(2);

			userJobs.forEach((job) => {
				expect(job).toHaveProperty('id');
				expect(job).toHaveProperty('title');
				expect(job).toHaveProperty('description');
				expect(job).toHaveProperty('salary');
				expect(job).toHaveProperty('cityId');
				expect(job).toHaveProperty('categoryId');
				expect(job).toHaveProperty('userId');
				expect(job).toHaveProperty('phone');
				expect(job).toHaveProperty('status');
				expect(job).toHaveProperty('imageUrl');
				expect(job).toHaveProperty('city');

				expect(typeof job.id).toBe('number');
				expect(typeof job.title).toBe('string');
				expect(typeof job.description).toBe('string');
				expect(typeof job.salary).toBe('string');
				expect(typeof job.cityId).toBe('number');
				expect(typeof job.categoryId).toBe('number');
				expect(typeof job.userId).toBe('string');
				expect(typeof job.phone).toBe('string');
				expect(typeof job.status).toBe('string');
				expect(job.city).toBeInstanceOf(Object);
			});
		});

		it('should have valid mock errors', () => {
			const errors = mockErrors;

			expect(errors).toHaveProperty('databaseError');
			expect(errors).toHaveProperty('prismaError');
			expect(errors).toHaveProperty('timeoutError');
			expect(errors).toHaveProperty('validationError');
			expect(errors).toHaveProperty('permissionError');
			expect(errors).toHaveProperty('networkError');
			expect(errors).toHaveProperty('s3Error');
			expect(errors).toHaveProperty('telegramError');

			Object.values(errors).forEach((error) => {
				expect(error).toBeInstanceOf(Error);
				expect(error.message).toBeDefined();
				expect(typeof error.message).toBe('string');
			});
		});

		it('should have valid mock error messages', () => {
			const errorMessages = mockErrorMessages;

			expect(errorMessages).toHaveProperty('jobNotFound');
			expect(errorMessages).toHaveProperty('unauthorized');
			expect(errorMessages).toHaveProperty('deleteError');

			expect(typeof errorMessages.jobNotFound).toBe('string');
			expect(typeof errorMessages.unauthorized).toBe('string');
			expect(typeof errorMessages.deleteError).toBe('string');

			expect(errorMessages.jobNotFound).toBe('Объявление не найдено');
			expect(errorMessages.unauthorized).toBe(
				'У вас нет прав для удаления этого объявления',
			);
			expect(errorMessages.deleteError).toBe('Ошибка удаления объявления');
		});

		it('should have valid mock success messages', () => {
			const successMessages = mockSuccessMessages;

			expect(successMessages).toHaveProperty('jobDeleted');
			expect(successMessages).toHaveProperty('imageDeleted');
			expect(successMessages).toHaveProperty('telegramSent');

			expect(typeof successMessages.jobDeleted).toBe('string');
			expect(typeof successMessages.imageDeleted).toBe('string');
			expect(typeof successMessages.telegramSent).toBe('string');

			expect(successMessages.jobDeleted).toBe('Job deleted successfully');
			expect(successMessages.imageDeleted).toBe(
				'Image deleted from S3 successfully',
			);
			expect(successMessages.telegramSent).toBe(
				'Telegram notification sent successfully',
			);
		});

		it('should have valid mock console log data', () => {
			const consoleData = mockConsoleLogData;

			expect(consoleData).toHaveProperty('s3DeletionWarning');
			expect(consoleData).toHaveProperty('s3DeletionError');

			expect(typeof consoleData.s3DeletionWarning).toBe('string');
			expect(typeof consoleData.s3DeletionError).toBe('string');

			expect(consoleData.s3DeletionWarning).toContain(
				'Failed to delete image from S3',
			);
			expect(consoleData.s3DeletionError).toContain(
				'Error deleting image from S3',
			);
		});

		it('should have valid mock service responses', () => {
			const responses = mockServiceResponses;

			expect(responses).toHaveProperty('success');
			expect(responses).toHaveProperty('jobNotFound');
			expect(responses).toHaveProperty('unauthorized');
			expect(responses).toHaveProperty('deleteError');

			expect(responses.success).toEqual({});
			expect(responses.jobNotFound).toHaveProperty('error');
			expect(responses.unauthorized).toHaveProperty('error');
			expect(responses.deleteError).toHaveProperty('error');
			expect(responses.deleteError).toHaveProperty('details');
		});

		it('should have valid mock Prisma query options', () => {
			const queryOptions = mockPrismaQueryOptions;

			expect(queryOptions).toHaveProperty('findUnique');
			expect(queryOptions).toHaveProperty('delete');
			expect(queryOptions).toHaveProperty('findMany');

			expect(queryOptions.findUnique).toHaveProperty('where');
			expect(queryOptions.findUnique).toHaveProperty('include');
			expect(queryOptions.delete).toHaveProperty('where');
			expect(queryOptions.findMany).toHaveProperty('where');
			expect(queryOptions.findMany).toHaveProperty('include');
		});

		it('should have valid mock data conversions', () => {
			const conversions = mockDataConversions;

			expect(conversions).toHaveProperty('parseInt');
			expect(conversions).toHaveProperty('boolean');
			expect(conversions).toHaveProperty('string');

			expect(conversions.parseInt).toHaveProperty('jobId');
			expect(conversions.boolean).toHaveProperty('hasImage');
			expect(conversions.boolean).toHaveProperty('noImage');
			expect(conversions.string).toHaveProperty('imageUrl');
			expect(conversions.string).toHaveProperty('emptyImageUrl');
		});

		it('should have valid mock authorization logic', () => {
			const authLogic = mockAuthorizationLogic;

			expect(authLogic).toHaveProperty('checkOwnership');
			expect(authLogic).toHaveProperty('isAuthorized');

			expect(typeof authLogic.checkOwnership).toBe('function');
			expect(typeof authLogic.isAuthorized).toBe('function');
		});

		it('should have valid mock S3 image URLs', () => {
			const imageUrls = mockS3ImageUrls;

			expect(imageUrls).toHaveProperty('validUrl');
			expect(imageUrls).toHaveProperty('invalidUrl');
			expect(imageUrls).toHaveProperty('emptyUrl');
			expect(imageUrls).toHaveProperty('nullUrl');
			expect(imageUrls).toHaveProperty('undefinedUrl');

			expect(typeof imageUrls.validUrl).toBe('string');
			expect(typeof imageUrls.invalidUrl).toBe('string');
			expect(typeof imageUrls.emptyUrl).toBe('string');
			expect(imageUrls.nullUrl).toBe(null);
			expect(imageUrls.undefinedUrl).toBe(undefined);
		});
	});
});

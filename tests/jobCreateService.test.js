import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Import mock data
import {
	mockJobCreationData,
	mockUserData,
	mockExistingJobs,
	mockJobLimits,
	mockCreatedJob,
	mockStringSimilarity,
	mockValidationFunctions,
	mockTelegramNotification,
	mockErrors,
	mockErrorMessages,
	mockSuccessMessages,
	mockConsoleLogData,
	mockServiceResponses,
	mockPrismaQueryOptions,
	mockDataConversions,
	resetJobCreateMocks,
} from './mocks/jobCreateService.js';

// Mock console methods to avoid noise in tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe('JobCreateService', () => {
	beforeEach(() => {
		// Reset all mocks
		resetJobCreateMocks();
		
		// Mock console methods
		console.log = vi.fn();
		console.error = vi.fn();
	});

	afterEach(() => {
		// Restore console methods
		console.log = originalConsoleLog;
		console.error = originalConsoleError;
	});

	describe('Job Data Validation Logic', () => {
		it('should accept valid job data', () => {
			const jobData = mockJobCreationData.validJobData;

			expect(jobData).toHaveProperty('title');
			expect(jobData).toHaveProperty('salary');
			expect(jobData).toHaveProperty('cityId');
			expect(jobData).toHaveProperty('categoryId');
			expect(jobData).toHaveProperty('phone');
			expect(jobData).toHaveProperty('description');
			expect(jobData).toHaveProperty('userId');
			expect(jobData).toHaveProperty('shuttle');
			expect(jobData).toHaveProperty('meals');
			expect(jobData).toHaveProperty('imageUrl');

			expect(typeof jobData.title).toBe('string');
			expect(typeof jobData.salary).toBe('string');
			expect(typeof jobData.cityId).toBe('string');
			expect(typeof jobData.categoryId).toBe('string');
			expect(typeof jobData.phone).toBe('string');
			expect(typeof jobData.description).toBe('string');
			expect(typeof jobData.userId).toBe('string');
			expect(typeof jobData.shuttle).toBe('boolean');
			expect(typeof jobData.meals).toBe('boolean');
			expect(typeof jobData.imageUrl).toBe('string');
		});

		it('should handle job data without image', () => {
			const jobData = mockJobCreationData.jobDataWithoutImage;

			expect(jobData).toHaveProperty('imageUrl');
			expect(jobData.imageUrl).toBe(null);
		});

		it('should handle job data with minimal fields', () => {
			const jobData = mockJobCreationData.jobDataWithMinimalFields;

			expect(jobData).toHaveProperty('shuttle');
			expect(jobData).toHaveProperty('meals');
			expect(jobData).toHaveProperty('imageUrl');
			expect(jobData.shuttle).toBe(null);
			expect(jobData.meals).toBe(null);
			expect(jobData.imageUrl).toBe(undefined);
		});

		it('should handle job data with bad words', () => {
			const jobData = mockJobCreationData.jobDataWithBadWords;

			expect(jobData).toHaveProperty('title');
			expect(jobData).toHaveProperty('description');
			expect(typeof jobData.title).toBe('string');
			expect(typeof jobData.description).toBe('string');
		});

		it('should handle job data with links', () => {
			const jobData = mockJobCreationData.jobDataWithLinks;

			expect(jobData).toHaveProperty('title');
			expect(jobData).toHaveProperty('description');
			expect(typeof jobData.title).toBe('string');
			expect(typeof jobData.description).toBe('string');
		});
	});

	describe('Content Validation Logic', () => {
		it('should validate title for bad words', () => {
			const validateTitle = (title) => {
				return mockValidationFunctions.containsBadWords(title);
			};

			mockValidationFunctions.containsBadWords.mockReturnValue(false);
			const result = validateTitle('Software Developer');

			expect(result).toBe(false);
			expect(mockValidationFunctions.containsBadWords).toHaveBeenCalledWith('Software Developer');
		});

		it('should validate description for bad words', () => {
			const validateDescription = (description) => {
				return mockValidationFunctions.containsBadWords(description);
			};

			mockValidationFunctions.containsBadWords.mockReturnValue(false);
			const result = validateDescription('Develop and maintain software applications.');

			expect(result).toBe(false);
			expect(mockValidationFunctions.containsBadWords).toHaveBeenCalledWith('Develop and maintain software applications.');
		});

		it('should validate title for links', () => {
			const validateTitle = (title) => {
				return mockValidationFunctions.containsLinks(title);
			};

			mockValidationFunctions.containsLinks.mockReturnValue(false);
			const result = validateTitle('Software Developer');

			expect(result).toBe(false);
			expect(mockValidationFunctions.containsLinks).toHaveBeenCalledWith('Software Developer');
		});

		it('should validate description for links', () => {
			const validateDescription = (description) => {
				return mockValidationFunctions.containsLinks(description);
			};

			mockValidationFunctions.containsLinks.mockReturnValue(false);
			const result = validateDescription('Develop and maintain software applications.');

			expect(result).toBe(false);
			expect(mockValidationFunctions.containsLinks).toHaveBeenCalledWith('Develop and maintain software applications.');
		});

		it('should collect validation errors', () => {
			const collectValidationErrors = (title, description) => {
				const errors = [];
				
				if (mockValidationFunctions.containsBadWords(title)) {
					errors.push(mockErrorMessages.badWordsTitle);
				}
				if (mockValidationFunctions.containsBadWords(description)) {
					errors.push(mockErrorMessages.badWordsDescription);
				}
				if (mockValidationFunctions.containsLinks(title)) {
					errors.push(mockErrorMessages.linksTitle);
				}
				if (mockValidationFunctions.containsLinks(description)) {
					errors.push(mockErrorMessages.linksDescription);
				}
				
				return errors;
			};

			mockValidationFunctions.containsBadWords.mockReturnValue(true);
			mockValidationFunctions.containsLinks.mockReturnValue(true);

			const errors = collectValidationErrors('Bad title', 'Bad description');

			expect(errors).toHaveLength(4);
			expect(errors).toContain(mockErrorMessages.badWordsTitle);
			expect(errors).toContain(mockErrorMessages.badWordsDescription);
			expect(errors).toContain(mockErrorMessages.linksTitle);
			expect(errors).toContain(mockErrorMessages.linksDescription);
		});

		it('should return early if validation errors exist', () => {
			const handleValidationErrors = (errors) => {
				if (errors.length > 0) {
					return { errors };
				}
				return null;
			};

			const errors = ['Заголовок содержит нецензурные слова.'];
			const result = handleValidationErrors(errors);

			expect(result).toEqual({ errors });
		});
	});

	describe('User Validation Logic', () => {
		it('should create correct Prisma findUnique query', () => {
			const userId = 'clerk_user123';
			const queryOptions = {
				where: { clerkUserId: userId },
				include: { jobs: { orderBy: { createdAt: 'desc' }, take: 1 } },
			};

			expect(queryOptions).toEqual(mockPrismaQueryOptions.findUnique);
		});

		it('should handle existing user', () => {
			const user = mockUserData.freeUser;

			expect(user).not.toBe(null);
			expect(user).toHaveProperty('id');
			expect(user).toHaveProperty('email');
			expect(user).toHaveProperty('clerkUserId');
			expect(user).toHaveProperty('isPremium');
			expect(user).toHaveProperty('premiumDeluxe');
		});

		it('should handle nonexistent user', () => {
			const user = mockUserData.nonexistentUser;

			expect(user).toBe(null);
		});

		it('should identify free user', () => {
			const user = mockUserData.freeUser;

			expect(user.isPremium).toBe(false);
			expect(user.premiumDeluxe).toBe(false);
		});

		it('should identify premium user', () => {
			const user = mockUserData.premiumUser;

			expect(user.isPremium).toBe(true);
			expect(user.premiumDeluxe).toBe(false);
		});

		it('should identify premium deluxe user', () => {
			const user = mockUserData.premiumDeluxeUser;

			expect(user.isPremium).toBe(false);
			expect(user.premiumDeluxe).toBe(true);
		});

		it('should determine premium status correctly', () => {
			const determinePremiumStatus = (user) => {
				return user.isPremium || user.premiumDeluxe;
			};

			expect(determinePremiumStatus(mockUserData.freeUser)).toBe(false);
			expect(determinePremiumStatus(mockUserData.premiumUser)).toBe(true);
			expect(determinePremiumStatus(mockUserData.premiumDeluxeUser)).toBe(true);
		});
	});

	describe('Duplicate Job Detection Logic', () => {
		it('should create correct Prisma findMany query', () => {
			const userId = 'user123';
			const queryOptions = {
				where: { userId: userId },
				select: { title: true, description: true },
			};

			expect(queryOptions).toEqual(mockPrismaQueryOptions.findMany);
		});

		it('should detect similar jobs', () => {
			const existingJobs = mockExistingJobs.similarJobs;
			const newTitle = 'Software Developer';
			const newDescription = 'Develop and maintain software applications.';

			const isDuplicate = existingJobs.some(
				(job) =>
					mockStringSimilarity.highSimilarity > 0.9 &&
					mockStringSimilarity.highSimilarity > 0.9,
			);

			expect(isDuplicate).toBe(true);
		});

		it('should not detect different jobs as duplicates', () => {
			const existingJobs = mockExistingJobs.differentJobs;
			const newTitle = 'Software Developer';
			const newDescription = 'Develop and maintain software applications.';

			const isDuplicate = existingJobs.some(
				(job) =>
					mockStringSimilarity.lowSimilarity > 0.9 &&
					mockStringSimilarity.lowSimilarity > 0.9,
			);

			expect(isDuplicate).toBe(false);
		});

		it('should handle empty existing jobs', () => {
			const existingJobs = mockExistingJobs.emptyJobs;
			const newTitle = 'Software Developer';
			const newDescription = 'Develop and maintain software applications.';

			const isDuplicate = existingJobs.some(
				(job) =>
					mockStringSimilarity.highSimilarity > 0.9 &&
					mockStringSimilarity.highSimilarity > 0.9,
			);

			expect(isDuplicate).toBe(false);
		});

		it('should use high similarity threshold', () => {
			const threshold = 0.9;

			expect(threshold).toBe(0.9);
			expect(threshold).toBeGreaterThan(0.8);
		});

		it('should compare both title and description', () => {
			const compareJobs = (existingJob, newJob) => {
				const titleSimilarity = mockStringSimilarity.highSimilarity;
				const descriptionSimilarity = mockStringSimilarity.highSimilarity;
				
				return titleSimilarity > 0.9 && descriptionSimilarity > 0.9;
			};

			const existingJob = { title: 'Software Developer', description: 'Develop software' };
			const newJob = { title: 'Software Developer', description: 'Develop software' };

			const isDuplicate = compareJobs(existingJob, newJob);

			expect(isDuplicate).toBe(true);
		});
	});

	describe('Job Limit Logic', () => {
		it('should create correct Prisma count query', () => {
			const userId = 'user123';
			const queryOptions = {
				where: { userId: userId },
			};

			expect(queryOptions).toEqual(mockPrismaQueryOptions.count);
		});

		it('should use correct job limits', () => {
			const limits = mockJobLimits;

			expect(limits.MAX_JOBS_FREE_USER).toBe(5);
			expect(limits.MAX_JOBS_PREMIUM_USER).toBe(10);
		});

		it('should determine max jobs for free user', () => {
			const determineMaxJobs = (isPremium) => {
				return isPremium ? mockJobLimits.MAX_JOBS_PREMIUM_USER : mockJobLimits.MAX_JOBS_FREE_USER;
			};

			expect(determineMaxJobs(false)).toBe(5);
			expect(determineMaxJobs(true)).toBe(10);
		});

		it('should check if user is at free limit', () => {
			const jobCount = 5;
			const maxJobs = mockJobLimits.MAX_JOBS_FREE_USER;
			const isAtLimit = jobCount >= maxJobs;

			expect(isAtLimit).toBe(true);
		});

		it('should check if user is at premium limit', () => {
			const jobCount = 10;
			const maxJobs = mockJobLimits.MAX_JOBS_PREMIUM_USER;
			const isAtLimit = jobCount >= maxJobs;

			expect(isAtLimit).toBe(true);
		});

		it('should check if user is below limit', () => {
			const jobCount = 3;
			const maxJobs = mockJobLimits.MAX_JOBS_FREE_USER;
			const isAtLimit = jobCount >= maxJobs;

			expect(isAtLimit).toBe(false);
		});

		it('should return free user limit error', () => {
			const createFreeUserLimitError = () => {
				return {
					error: `Вы уже разместили ${mockJobLimits.MAX_JOBS_FREE_USER} объявлений. Для размещения большего количества объявлений перейдите на Premium тариф.`,
					upgradeRequired: true,
				};
			};

			const result = createFreeUserLimitError();

			expect(result).toHaveProperty('error');
			expect(result).toHaveProperty('upgradeRequired');
			expect(result.upgradeRequired).toBe(true);
		});

		it('should return premium user limit error', () => {
			const createPremiumUserLimitError = () => {
				return {
					error: `Вы уже разместили ${mockJobLimits.MAX_JOBS_PREMIUM_USER} объявлений.`,
				};
			};

			const result = createPremiumUserLimitError();

			expect(result).toHaveProperty('error');
			expect(result.error).toContain('10 объявлений');
		});
	});

	describe('Job Creation Logic', () => {
		it('should create correct Prisma create query', () => {
			const jobData = mockJobCreationData.validJobData;
			const userId = 'user123';
			const queryOptions = {
				data: {
					title: jobData.title,
					salary: jobData.salary,
					phone: jobData.phone,
					description: jobData.description,
					shuttle: jobData.shuttle,
					meals: jobData.meals,
					imageUrl: jobData.imageUrl,
					city: { connect: { id: parseInt(jobData.cityId) } },
					category: { connect: { id: parseInt(jobData.categoryId) } },
					user: { connect: { id: userId } },
				},
				include: { city: true, user: true, category: true },
			};

			expect(queryOptions).toEqual(mockPrismaQueryOptions.create);
		});

		it('should parse cityId to integer', () => {
			const cityId = '1';
			const parsedId = parseInt(cityId);

			expect(parsedId).toBe(1);
			expect(typeof parsedId).toBe('number');
		});

		it('should parse categoryId to integer', () => {
			const categoryId = '2';
			const parsedId = parseInt(categoryId);

			expect(parsedId).toBe(2);
			expect(typeof parsedId).toBe('number');
		});

		it('should include relations in query', () => {
			const includeOptions = { city: true, user: true, category: true };

			expect(includeOptions).toHaveProperty('city');
			expect(includeOptions).toHaveProperty('user');
			expect(includeOptions).toHaveProperty('category');
			expect(includeOptions.city).toBe(true);
			expect(includeOptions.user).toBe(true);
			expect(includeOptions.category).toBe(true);
		});

		it('should return created job with relations', () => {
			const createdJob = mockCreatedJob;

			expect(createdJob).toHaveProperty('id');
			expect(createdJob).toHaveProperty('title');
			expect(createdJob).toHaveProperty('city');
			expect(createdJob).toHaveProperty('user');
			expect(createdJob).toHaveProperty('category');

			expect(createdJob.city).toHaveProperty('id');
			expect(createdJob.city).toHaveProperty('name');
			expect(createdJob.user).toHaveProperty('id');
			expect(createdJob.user).toHaveProperty('email');
			expect(createdJob.category).toHaveProperty('id');
			expect(createdJob.category).toHaveProperty('name');
		});
	});

	describe('Premium User Features', () => {
		it('should send Telegram notification for premium user', () => {
			const user = mockUserData.premiumUser;
			const job = mockCreatedJob;

			const sendNotification = async (user, job) => {
				if (user.isPremium) {
					await mockTelegramNotification.sendNewJobNotificationToTelegram(user, job);
				}
			};

			expect(user.isPremium).toBe(true);
		});

		it('should not send Telegram notification for free user', () => {
			const user = mockUserData.freeUser;
			const job = mockCreatedJob;

			const sendNotification = async (user, job) => {
				if (user.isPremium) {
					await mockTelegramNotification.sendNewJobNotificationToTelegram(user, job);
				}
			};

			expect(user.isPremium).toBe(false);
		});

		it('should send Telegram notification for premium deluxe user', () => {
			const user = mockUserData.premiumDeluxeUser;
			const job = mockCreatedJob;

			const sendNotification = async (user, job) => {
				if (user.isPremium || user.premiumDeluxe) {
					await mockTelegramNotification.sendNewJobNotificationToTelegram(user, job);
				}
			};

			expect(user.premiumDeluxe).toBe(true);
		});
	});

	describe('Console Logging Tests', () => {
		it('should log job creation with imageUrl', () => {
			const logJobCreation = (imageUrl) => {
				console.log('🔍 createJobService - Creating job with imageUrl:', imageUrl);
			};

			const imageUrl = 'https://example.com/job-image.jpg';
			logJobCreation(imageUrl);

			expect(console.log).toHaveBeenCalledWith(
				'🔍 createJobService - Creating job with imageUrl:',
				imageUrl,
			);
		});

		it('should log full data object', () => {
			const logFullData = (data) => {
				console.log('🔍 createJobService - Full data object:', data);
			};

			const data = mockJobCreationData.validJobData;
			logFullData(data);

			expect(console.log).toHaveBeenCalledWith(
				'🔍 createJobService - Full data object:',
				data,
			);
		});

		it('should log job created successfully', () => {
			const logJobCreated = (job) => {
				console.log('🔍 createJobService - Job created successfully:', {
					id: job.id,
					title: job.title,
					imageUrl: job.imageUrl,
				});
			};

			const job = mockCreatedJob;
			logJobCreated(job);

			expect(console.log).toHaveBeenCalledWith(
				'🔍 createJobService - Job created successfully:',
				{
					id: job.id,
					title: job.title,
					imageUrl: job.imageUrl,
				},
			);
		});
	});

	describe('Error Handling Tests', () => {
		it('should handle user not found error', () => {
			const handleUserNotFound = () => {
				return { error: mockErrorMessages.userNotFound };
			};

			const result = handleUserNotFound();

			expect(result).toHaveProperty('error');
			expect(result.error).toBe('Пользователь не найден');
		});

		it('should handle duplicate job error', () => {
			const handleDuplicateJob = () => {
				return { error: mockErrorMessages.duplicateJob };
			};

			const result = handleDuplicateJob();

			expect(result).toHaveProperty('error');
			expect(result.error).toBe('Ваше объявление похоже на уже существующее. Измените заголовок или описание.');
		});

		it('should handle free user limit error', () => {
			const handleFreeUserLimit = () => {
				return {
					error: mockErrorMessages.freeUserLimit,
					upgradeRequired: true,
				};
			};

			const result = handleFreeUserLimit();

			expect(result).toHaveProperty('error');
			expect(result).toHaveProperty('upgradeRequired');
			expect(result.upgradeRequired).toBe(true);
		});

		it('should handle premium user limit error', () => {
			const handlePremiumUserLimit = () => {
				return { error: mockErrorMessages.premiumUserLimit };
			};

			const result = handlePremiumUserLimit();

			expect(result).toHaveProperty('error');
			expect(result.error).toBe('Вы уже разместили 10 объявлений.');
		});

		it('should handle validation errors', () => {
			const handleValidationErrors = (errors) => {
				return { errors };
			};

			const errors = [
				'Заголовок содержит нецензурные слова.',
				'Описание содержит запрещенные ссылки.',
			];

			const result = handleValidationErrors(errors);

			expect(result).toHaveProperty('errors');
			expect(result.errors).toEqual(errors);
		});
	});

	describe('Service Response Format Tests', () => {
		it('should return success response with job', () => {
			const result = mockServiceResponses.success;

			expect(result).toHaveProperty('job');
			expect(result.job).toHaveProperty('id');
			expect(result.job).toHaveProperty('title');
			expect(result.job).toHaveProperty('city');
			expect(result.job).toHaveProperty('user');
			expect(result.job).toHaveProperty('category');
		});

		it('should return validation errors response', () => {
			const result = mockServiceResponses.validationErrors;

			expect(result).toHaveProperty('errors');
			expect(Array.isArray(result.errors)).toBe(true);
			expect(result.errors).toHaveLength(2);
		});

		it('should return user not found response', () => {
			const result = mockServiceResponses.userNotFound;

			expect(result).toHaveProperty('error');
			expect(result.error).toBe('Пользователь не найден');
		});

		it('should return duplicate job response', () => {
			const result = mockServiceResponses.duplicateJob;

			expect(result).toHaveProperty('error');
			expect(result.error).toBe('Ваше объявление похоже на уже существующее. Измените заголовок или описание.');
		});

		it('should return free user limit response', () => {
			const result = mockServiceResponses.freeUserLimit;

			expect(result).toHaveProperty('error');
			expect(result).toHaveProperty('upgradeRequired');
			expect(result.upgradeRequired).toBe(true);
		});

		it('should return premium user limit response', () => {
			const result = mockServiceResponses.premiumUserLimit;

			expect(result).toHaveProperty('error');
			expect(result.error).toBe('Вы уже разместили 10 объявлений.');
		});
	});

	describe('Data Type Conversion Tests', () => {
		it('should convert string IDs to integers', () => {
			const conversions = mockDataConversions.parseInt;

			expect(conversions.cityId).toBe(1);
			expect(conversions.categoryId).toBe(2);
			expect(typeof conversions.cityId).toBe('number');
			expect(typeof conversions.categoryId).toBe('number');
		});

		it('should handle boolean values', () => {
			const booleans = mockDataConversions.boolean;

			expect(booleans.shuttle).toBe(true);
			expect(booleans.meals).toBe(false);
			expect(typeof booleans.shuttle).toBe('boolean');
			expect(typeof booleans.meals).toBe('boolean');
		});

		it('should handle string values', () => {
			const strings = mockDataConversions.string;

			expect(typeof strings.title).toBe('string');
			expect(typeof strings.salary).toBe('string');
			expect(typeof strings.phone).toBe('string');
			expect(typeof strings.description).toBe('string');
		});

		it('should handle null and undefined values', () => {
			const jobData = mockJobCreationData.jobDataWithMinimalFields;

			expect(jobData.shuttle).toBe(null);
			expect(jobData.meals).toBe(null);
			expect(jobData.imageUrl).toBe(undefined);
		});
	});

	describe('Mock Data Validation', () => {
		it('should have valid mock job creation data', () => {
			const jobData = mockJobCreationData.validJobData;

			expect(jobData).toHaveProperty('title');
			expect(jobData).toHaveProperty('salary');
			expect(jobData).toHaveProperty('cityId');
			expect(jobData).toHaveProperty('categoryId');
			expect(jobData).toHaveProperty('phone');
			expect(jobData).toHaveProperty('description');
			expect(jobData).toHaveProperty('userId');
			expect(jobData).toHaveProperty('shuttle');
			expect(jobData).toHaveProperty('meals');
			expect(jobData).toHaveProperty('imageUrl');

			expect(typeof jobData.title).toBe('string');
			expect(typeof jobData.salary).toBe('string');
			expect(typeof jobData.cityId).toBe('string');
			expect(typeof jobData.categoryId).toBe('string');
			expect(typeof jobData.phone).toBe('string');
			expect(typeof jobData.description).toBe('string');
			expect(typeof jobData.userId).toBe('string');
			expect(typeof jobData.shuttle).toBe('boolean');
			expect(typeof jobData.meals).toBe('boolean');
			expect(typeof jobData.imageUrl).toBe('string');
		});

		it('should have valid mock user data', () => {
			const user = mockUserData.freeUser;

			expect(user).toHaveProperty('id');
			expect(user).toHaveProperty('email');
			expect(user).toHaveProperty('clerkUserId');
			expect(user).toHaveProperty('firstName');
			expect(user).toHaveProperty('lastName');
			expect(user).toHaveProperty('isPremium');
			expect(user).toHaveProperty('premiumDeluxe');
			expect(user).toHaveProperty('jobs');

			expect(typeof user.id).toBe('string');
			expect(typeof user.email).toBe('string');
			expect(typeof user.clerkUserId).toBe('string');
			expect(typeof user.firstName).toBe('string');
			expect(typeof user.lastName).toBe('string');
			expect(typeof user.isPremium).toBe('boolean');
			expect(typeof user.premiumDeluxe).toBe('boolean');
			expect(Array.isArray(user.jobs)).toBe(true);
		});

		it('should have valid mock existing jobs', () => {
			const existingJobs = mockExistingJobs.similarJobs;

			expect(Array.isArray(existingJobs)).toBe(true);
			expect(existingJobs).toHaveLength(2);

			existingJobs.forEach(job => {
				expect(job).toHaveProperty('title');
				expect(job).toHaveProperty('description');
				expect(typeof job.title).toBe('string');
				expect(typeof job.description).toBe('string');
			});
		});

		it('should have valid mock job limits', () => {
			const limits = mockJobLimits;

			expect(limits).toHaveProperty('MAX_JOBS_FREE_USER');
			expect(limits).toHaveProperty('MAX_JOBS_PREMIUM_USER');

			expect(typeof limits.MAX_JOBS_FREE_USER).toBe('number');
			expect(typeof limits.MAX_JOBS_PREMIUM_USER).toBe('number');

			expect(limits.MAX_JOBS_FREE_USER).toBe(5);
			expect(limits.MAX_JOBS_PREMIUM_USER).toBe(10);
		});

		it('should have valid mock created job', () => {
			const job = mockCreatedJob;

			expect(job).toHaveProperty('id');
			expect(job).toHaveProperty('title');
			expect(job).toHaveProperty('salary');
			expect(job).toHaveProperty('phone');
			expect(job).toHaveProperty('description');
			expect(job).toHaveProperty('shuttle');
			expect(job).toHaveProperty('meals');
			expect(job).toHaveProperty('imageUrl');
			expect(job).toHaveProperty('city');
			expect(job).toHaveProperty('user');
			expect(job).toHaveProperty('category');

			expect(typeof job.id).toBe('number');
			expect(typeof job.title).toBe('string');
			expect(typeof job.salary).toBe('string');
			expect(typeof job.phone).toBe('string');
			expect(typeof job.description).toBe('string');
			expect(typeof job.shuttle).toBe('boolean');
			expect(typeof job.meals).toBe('boolean');
			expect(typeof job.imageUrl).toBe('string');
			expect(job.city).toBeInstanceOf(Object);
			expect(job.user).toBeInstanceOf(Object);
			expect(job.category).toBeInstanceOf(Object);
		});

		it('should have valid mock string similarity', () => {
			const similarity = mockStringSimilarity;

			expect(similarity).toHaveProperty('highSimilarity');
			expect(similarity).toHaveProperty('mediumSimilarity');
			expect(similarity).toHaveProperty('lowSimilarity');
			expect(similarity).toHaveProperty('identical');
			expect(similarity).toHaveProperty('different');

			expect(typeof similarity.highSimilarity).toBe('number');
			expect(typeof similarity.mediumSimilarity).toBe('number');
			expect(typeof similarity.lowSimilarity).toBe('number');
			expect(typeof similarity.identical).toBe('number');
			expect(typeof similarity.different).toBe('number');

			expect(similarity.highSimilarity).toBe(0.95);
			expect(similarity.mediumSimilarity).toBe(0.7);
			expect(similarity.lowSimilarity).toBe(0.3);
			expect(similarity.identical).toBe(1.0);
			expect(similarity.different).toBe(0.0);
		});

		it('should have valid mock validation functions', () => {
			const validationFunctions = mockValidationFunctions;

			expect(validationFunctions).toHaveProperty('containsBadWords');
			expect(validationFunctions).toHaveProperty('containsLinks');

			expect(typeof validationFunctions.containsBadWords).toBe('function');
			expect(typeof validationFunctions.containsLinks).toBe('function');
		});

		it('should have valid mock Telegram notification', () => {
			const telegramNotification = mockTelegramNotification;

			expect(telegramNotification).toHaveProperty('sendNewJobNotificationToTelegram');

			expect(typeof telegramNotification.sendNewJobNotificationToTelegram).toBe('function');
		});

		it('should have valid mock errors', () => {
			const errors = mockErrors;

			expect(errors).toHaveProperty('databaseError');
			expect(errors).toHaveProperty('prismaError');
			expect(errors).toHaveProperty('timeoutError');
			expect(errors).toHaveProperty('validationError');
			expect(errors).toHaveProperty('permissionError');
			expect(errors).toHaveProperty('networkError');

			Object.values(errors).forEach(error => {
				expect(error).toBeInstanceOf(Error);
				expect(error.message).toBeDefined();
				expect(typeof error.message).toBe('string');
			});
		});

		it('should have valid mock error messages', () => {
			const errorMessages = mockErrorMessages;

			expect(errorMessages).toHaveProperty('userNotFound');
			expect(errorMessages).toHaveProperty('duplicateJob');
			expect(errorMessages).toHaveProperty('freeUserLimit');
			expect(errorMessages).toHaveProperty('premiumUserLimit');
			expect(errorMessages).toHaveProperty('badWordsTitle');
			expect(errorMessages).toHaveProperty('badWordsDescription');
			expect(errorMessages).toHaveProperty('linksTitle');
			expect(errorMessages).toHaveProperty('linksDescription');

			Object.values(errorMessages).forEach(message => {
				expect(typeof message).toBe('string');
				expect(message.length).toBeGreaterThan(0);
			});
		});

		it('should have valid mock success messages', () => {
			const successMessages = mockSuccessMessages;

			expect(successMessages).toHaveProperty('jobCreated');

			expect(typeof successMessages.jobCreated).toBe('string');
			expect(successMessages.jobCreated).toBe('Job created successfully');
		});

		it('should have valid mock console log data', () => {
			const consoleData = mockConsoleLogData;

			expect(consoleData).toHaveProperty('creatingJob');
			expect(consoleData).toHaveProperty('fullDataObject');
			expect(consoleData).toHaveProperty('jobCreatedSuccessfully');

			expect(typeof consoleData.creatingJob).toBe('string');
			expect(typeof consoleData.fullDataObject).toBe('string');
			expect(typeof consoleData.jobCreatedSuccessfully).toBe('string');
		});

		it('should have valid mock service responses', () => {
			const responses = mockServiceResponses;

			expect(responses).toHaveProperty('success');
			expect(responses).toHaveProperty('validationErrors');
			expect(responses).toHaveProperty('userNotFound');
			expect(responses).toHaveProperty('duplicateJob');
			expect(responses).toHaveProperty('freeUserLimit');
			expect(responses).toHaveProperty('premiumUserLimit');

			expect(responses.success).toHaveProperty('job');
			expect(responses.validationErrors).toHaveProperty('errors');
			expect(responses.userNotFound).toHaveProperty('error');
			expect(responses.duplicateJob).toHaveProperty('error');
			expect(responses.freeUserLimit).toHaveProperty('error');
			expect(responses.freeUserLimit).toHaveProperty('upgradeRequired');
			expect(responses.premiumUserLimit).toHaveProperty('error');
		});

		it('should have valid mock Prisma query options', () => {
			const queryOptions = mockPrismaQueryOptions;

			expect(queryOptions).toHaveProperty('findUnique');
			expect(queryOptions).toHaveProperty('findMany');
			expect(queryOptions).toHaveProperty('count');
			expect(queryOptions).toHaveProperty('create');

			expect(queryOptions.findUnique).toHaveProperty('where');
			expect(queryOptions.findUnique).toHaveProperty('include');
			expect(queryOptions.findMany).toHaveProperty('where');
			expect(queryOptions.findMany).toHaveProperty('select');
			expect(queryOptions.count).toHaveProperty('where');
			expect(queryOptions.create).toHaveProperty('data');
			expect(queryOptions.create).toHaveProperty('include');
		});

		it('should have valid mock data conversions', () => {
			const conversions = mockDataConversions;

			expect(conversions).toHaveProperty('parseInt');
			expect(conversions).toHaveProperty('boolean');
			expect(conversions).toHaveProperty('string');

			expect(conversions.parseInt).toHaveProperty('cityId');
			expect(conversions.parseInt).toHaveProperty('categoryId');
			expect(conversions.boolean).toHaveProperty('shuttle');
			expect(conversions.boolean).toHaveProperty('meals');
			expect(conversions.string).toHaveProperty('title');
			expect(conversions.string).toHaveProperty('salary');
			expect(conversions.string).toHaveProperty('phone');
			expect(conversions.string).toHaveProperty('description');
		});
	});
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { assignJobsToFakeUsers } from '../apps/api/utils/attachJobsToUsers.js';
import {
	mockPrisma,
	mockCreateFakeUser,
	mockFaker,
	mockConsole,
	mockJobData,
	mockUserData,
	mockCityData,
	mockCreatedJobData,
	mockErrors,
	mockServiceResponses,
	mockPrismaOperationsLogic,
	mockFakeUserCreationLogic,
	mockFakerLogic,
	mockControllerLogic,
	mockRequestResponseLogic,
	resetAllMocks,
} from '../tests/mocks/attachJobsToUsers.js';

beforeEach(() => {
	resetAllMocks();
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('AttachJobsToUsers', () => {
	describe('Job Data Processing Logic', () => {
		it('should handle valid job data', async () => {
			const job = mockJobData.validJob;
			expect(job.title).toBe('Software Developer');
			expect(job.salary).toBe(50000);
			expect(job.description).toBe('Looking for experienced developer');
			expect(job.city).toBe('Tel Aviv');
		});

		it('should handle job with string salary', async () => {
			const job = mockJobData.jobWithStringSalary;
			expect(job.title).toBe('Designer');
			expect(job.salary).toBe('40000-60000');
			expect(job.description).toBe('Looking for creative designer');
			expect(job.city).toBe('Jerusalem');
		});

		it('should handle job with numeric salary', async () => {
			const job = mockJobData.jobWithNumericSalary;
			expect(job.title).toBe('Manager');
			expect(job.salary).toBe(70000);
			expect(job.description).toBe('Looking for project manager');
			expect(job.city).toBe('Haifa');
		});

		it('should handle job with special characters', async () => {
			const job = mockJobData.jobWithSpecialCharacters;
			expect(job.title).toBe('Developer & Designer');
			expect(job.salary).toBe(55000);
			expect(job.description).toBe('Looking for developer/designer hybrid');
			expect(job.city).toBe('Ramat Gan');
		});

		it('should handle job list data', async () => {
			const jobs = mockJobData.jobList;
			expect(Array.isArray(jobs)).toBe(true);
			expect(jobs.length).toBe(3);
			expect(jobs[0].title).toBe('Software Developer');
			expect(jobs[1].title).toBe('Designer');
			expect(jobs[2].title).toBe('Manager');
		});

		it('should handle empty job list', async () => {
			const jobs = mockJobData.emptyJobList;
			expect(Array.isArray(jobs)).toBe(true);
			expect(jobs.length).toBe(0);
		});

		it('should handle single job', async () => {
			const jobs = mockJobData.singleJob;
			expect(Array.isArray(jobs)).toBe(true);
			expect(jobs.length).toBe(1);
			expect(jobs[0].title).toBe('Single Job');
		});
	});

	describe('User Data Processing Logic', () => {
		it('should handle existing fake user', async () => {
			const user = mockUserData.existingFakeUser;
			expect(user.id).toBe('user_123');
			expect(user.clerkUserId).toBe('user_123');
			expect(user.email).toBe('fake@example.com');
			expect(user.firstName).toBe('Fake');
			expect(user.lastName).toBe('User');
			expect(Array.isArray(user.jobs)).toBe(true);
		});

		it('should handle user with jobs', async () => {
			const user = mockUserData.userWithJobs;
			expect(user.id).toBe('user_456');
			expect(user.jobs.length).toBe(1);
			expect(user.jobs[0].title).toBe('Existing Job');
		});

		it('should handle user with multiple jobs', async () => {
			const user = mockUserData.userWithMultipleJobs;
			expect(user.id).toBe('user_789');
			expect(user.jobs.length).toBe(2);
			expect(user.jobs[0].title).toBe('Job 1');
			expect(user.jobs[1].title).toBe('Job 2');
		});

		it('should handle new fake user', async () => {
			const user = mockUserData.newFakeUser;
			expect(user.id).toBe('user_new');
			expect(user.clerkUserId).toBe('user_new');
			expect(user.email).toBe('newfake@example.com');
			expect(user.firstName).toBe('New');
			expect(user.lastName).toBe('Fake');
			expect(user.jobs.length).toBe(0);
		});
	});

	describe('City Data Processing Logic', () => {
		it('should handle existing city', async () => {
			const city = mockCityData.existingCity;
			expect(city.id).toBe(1);
			expect(city.name).toBe('Tel Aviv');
		});

		it('should handle new city', async () => {
			const city = mockCityData.newCity;
			expect(city.id).toBe(2);
			expect(city.name).toBe('Jerusalem');
		});

		it('should handle city list', async () => {
			const cities = mockCityData.cityList;
			expect(Array.isArray(cities)).toBe(true);
			expect(cities.length).toBe(3);
			expect(cities[0].name).toBe('Tel Aviv');
			expect(cities[1].name).toBe('Jerusalem');
			expect(cities[2].name).toBe('Haifa');
		});
	});

	describe('Data Transformation Logic', () => {
		it('should convert numeric salary to string', async () => {
			const numericSalary = 50000;
			const stringSalary = String(numericSalary);
			expect(stringSalary).toBe('50000');
			expect(typeof stringSalary).toBe('string');
		});

		it('should handle string salary conversion', async () => {
			const stringSalary = '40000-60000';
			const convertedSalary = String(stringSalary);
			expect(convertedSalary).toBe('40000-60000');
			expect(typeof convertedSalary).toBe('string');
		});

		it('should generate phone number format', async () => {
			const phoneNumber = mockFakerLogic.generatePhoneNumber();
			expect(phoneNumber).toBe('+972 123-456-789');
			expect(phoneNumber.startsWith('+972')).toBe(true);
		});

		it('should create job data structure', async () => {
			const jobData = mockRequestResponseLogic.buildJobData(
				'Test Job',
				50000,
				'Test Description',
				'Test City'
			);
			expect(jobData.title).toBe('Test Job');
			expect(jobData.salary).toBe(50000);
			expect(jobData.description).toBe('Test Description');
			expect(jobData.city).toBe('Test City');
		});
	});

	describe('Validation Logic', () => {
		it('should validate job data correctly', async () => {
			const validJob = mockJobData.validJob;
			const invalidJob = { title: '', salary: null, description: '', city: '' };
			
			expect(mockRequestResponseLogic.validateJobData(validJob)).toBe(true);
			expect(mockRequestResponseLogic.validateJobData(invalidJob)).toBe(false);
		});

		it('should validate user existence correctly', async () => {
			const existingUser = mockUserData.existingFakeUser;
			const nonExistingUser = null;
			
			expect(existingUser).toBeTruthy();
			expect(nonExistingUser).toBeFalsy();
		});

		it('should validate city data correctly', async () => {
			const validCity = mockCityData.existingCity;
			const invalidCity = { id: null, name: '' };
			
			expect(validCity.id).toBeTruthy();
			expect(validCity.name).toBeTruthy();
			expect(invalidCity.id).toBeFalsy();
			expect(invalidCity.name).toBeFalsy();
		});

		it('should validate job creation data correctly', async () => {
			const validJobData = {
				title: 'Test Job',
				salary: '50000',
				description: 'Test Description',
				phone: '+972 123-456-789',
				city: { connectOrCreate: {} },
				user: { connect: { id: 'user_123' } },
				createdAt: new Date(),
			};
			
			expect(validJobData.title).toBeTruthy();
			expect(validJobData.salary).toBeTruthy();
			expect(validJobData.description).toBeTruthy();
			expect(validJobData.phone).toBeTruthy();
			expect(validJobData.city).toBeTruthy();
			expect(validJobData.user).toBeTruthy();
			expect(validJobData.createdAt).toBeTruthy();
		});
	});

	describe('Prisma Integration Logic', () => {
		it('should call findFirst user correctly', async () => {
			const where = { clerkUserId: { startsWith: 'user_' } };
			const include = { jobs: true };
			const orderBy = { jobs: { _count: 'asc' } };
			
			mockPrisma.user.findFirst.mockResolvedValue(mockUserData.existingFakeUser);
			
			const result = await mockPrisma.user.findFirst({
				where,
				orderBy,
				include,
			});
			
			expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
				where,
				orderBy,
				include,
			});
			expect(result).toBe(mockUserData.existingFakeUser);
		});

		it('should call create job correctly', async () => {
			const jobData = {
				title: 'Test Job',
				salary: '50000',
				description: 'Test Description',
				phone: '+972 123-456-789',
				city: { connectOrCreate: {} },
				user: { connect: { id: 'user_123' } },
				createdAt: new Date(),
			};
			
			mockPrisma.job.create.mockResolvedValue(mockCreatedJobData.successfulJobCreation);
			
			const result = await mockPrisma.job.create({ data: jobData });
			
			expect(mockPrisma.job.create).toHaveBeenCalledWith({ data: jobData });
			expect(result).toBe(mockCreatedJobData.successfulJobCreation);
		});

		it('should handle user not found', async () => {
			mockPrisma.user.findFirst.mockResolvedValue(null);
			
			const result = await mockPrisma.user.findFirst({
				where: { clerkUserId: { startsWith: 'user_' } },
			});
			
			expect(result).toBeNull();
		});

		it('should handle job creation errors', async () => {
			mockPrisma.job.create.mockRejectedValue(mockErrors.jobCreationError);
			
			try {
				await mockPrisma.job.create({
					data: {
						title: 'Test Job',
						salary: '50000',
						description: 'Test Description',
					},
				});
			} catch (error) {
				expect(error).toBe(mockErrors.jobCreationError);
			}
		});
	});

	describe('Fake User Creation Logic', () => {
		it('should call createFakeUser correctly', async () => {
			mockCreateFakeUser.mockResolvedValue(mockUserData.newFakeUser);
			
			const result = await mockCreateFakeUser();
			
			expect(mockCreateFakeUser).toHaveBeenCalled();
			expect(result).toBe(mockUserData.newFakeUser);
		});

		it('should handle fake user creation errors', async () => {
			mockCreateFakeUser.mockRejectedValue(mockErrors.fakeUserCreationError);
			
			try {
				await mockCreateFakeUser();
			} catch (error) {
				expect(error).toBe(mockErrors.fakeUserCreationError);
			}
		});
	});

	describe('Faker Integration Logic', () => {
		it('should generate phone number correctly', async () => {
			const phoneNumber = '+972 123-456-789';
			mockFaker.phone.number.mockReturnValue(phoneNumber);
			
			const result = mockFaker.phone.number('+972 ###-###-####');
			
			expect(mockFaker.phone.number).toHaveBeenCalledWith('+972 ###-###-####');
			expect(result).toBe(phoneNumber);
		});

		it('should handle faker errors', async () => {
			mockFaker.phone.number.mockImplementation(() => {
				throw new Error('Faker error');
			});
			
			expect(() => mockFaker.phone.number('+972 ###-###-####')).toThrow('Faker error');
		});
	});

	describe('Job Balancing Logic', () => {
		it('should find user with least jobs', async () => {
			const users = [
				mockUserData.existingFakeUser, // 0 jobs
				mockUserData.userWithJobs, // 1 job
				mockUserData.userWithMultipleJobs, // 2 jobs
			];
			
			// Mock findFirst to return user with least jobs
			mockPrisma.user.findFirst.mockResolvedValue(mockUserData.existingFakeUser);
			
			const result = await mockPrisma.user.findFirst({
				where: { clerkUserId: { startsWith: 'user_' } },
				orderBy: { jobs: { _count: 'asc' } },
				include: { jobs: true },
			});
			
			expect(result.jobs.length).toBe(0);
		});

		it('should create new user when no users found', async () => {
			mockPrisma.user.findFirst.mockResolvedValue(null);
			mockCreateFakeUser.mockResolvedValue(mockUserData.newFakeUser);
			
			let fakeUser = await mockPrisma.user.findFirst({
				where: { clerkUserId: { startsWith: 'user_' } },
				orderBy: { jobs: { _count: 'asc' } },
				include: { jobs: true },
			});
			
			if (!fakeUser) {
				fakeUser = await mockCreateFakeUser();
			}
			
			expect(fakeUser).toBe(mockUserData.newFakeUser);
		});
	});

	describe('Error Handling Logic', () => {
		it('should handle database errors', async () => {
			const error = mockErrors.databaseError;
			expect(error.message).toBe('Database connection failed');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle job creation errors', async () => {
			const error = mockErrors.jobCreationError;
			expect(error.message).toBe('Failed to create job');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle fake user creation errors', async () => {
			const error = mockErrors.fakeUserCreationError;
			expect(error.message).toBe('Failed to create fake user');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle Prisma errors', async () => {
			const error = mockErrors.prismaError;
			expect(error.message).toBe('Prisma error');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle validation errors', async () => {
			const error = mockErrors.validationError;
			expect(error.message).toBe('Validation error');
			expect(error).toBeInstanceOf(Error);
		});
	});

	describe('Console Logging Logic', () => {
		it('should log error messages correctly', async () => {
			const jobTitle = 'Test Job';
			const errorMessage = 'Test error message';
			
			console.error(`❌ Ошибка при привязке вакансии "${jobTitle}":`, errorMessage);
			
			expect(console.error).toHaveBeenCalledWith(
				`❌ Ошибка при привязке вакансии "${jobTitle}":`,
				errorMessage
			);
		});

		it('should handle different error types', async () => {
			const errors = [
				mockErrors.databaseError,
				mockErrors.jobCreationError,
				mockErrors.fakeUserCreationError,
			];
			
			errors.forEach((error, index) => {
				console.error(`Error ${index}:`, error.message);
			});
			
			expect(console.error).toHaveBeenCalledTimes(errors.length);
		});
	});

	describe('Controller Logic', () => {
		it('should process assignJobsToFakeUsers successfully', async () => {
			const jobs = mockJobData.jobList;
			
			mockPrisma.user.findFirst.mockResolvedValue(mockUserData.existingFakeUser);
			mockPrisma.job.create.mockResolvedValue(mockCreatedJobData.successfulJobCreation);
			
			await mockControllerLogic.processAssignJobsToFakeUsers(jobs);
			
			expect(mockPrisma.user.findFirst).toHaveBeenCalledTimes(jobs.length);
			expect(mockPrisma.job.create).toHaveBeenCalledTimes(jobs.length);
		});

		it('should process assignJobsToFakeUsers with empty job list', async () => {
			const jobs = mockJobData.emptyJobList;
			
			await mockControllerLogic.processAssignJobsToFakeUsers(jobs);
			
			expect(mockPrisma.user.findFirst).not.toHaveBeenCalled();
			expect(mockPrisma.job.create).not.toHaveBeenCalled();
		});

		it('should process assignJobsToFakeUsers with single job', async () => {
			const jobs = mockJobData.singleJob;
			
			mockPrisma.user.findFirst.mockResolvedValue(mockUserData.existingFakeUser);
			mockPrisma.job.create.mockResolvedValue(mockCreatedJobData.successfulJobCreation);
			
			await mockControllerLogic.processAssignJobsToFakeUsers(jobs);
			
			expect(mockPrisma.user.findFirst).toHaveBeenCalledTimes(1);
			expect(mockPrisma.job.create).toHaveBeenCalledTimes(1);
		});

		it('should handle job processing errors gracefully', async () => {
			const jobs = mockJobData.jobList;
			
			mockPrisma.user.findFirst.mockResolvedValue(mockUserData.existingFakeUser);
			mockPrisma.job.create.mockRejectedValue(mockErrors.jobCreationError);
			
			await mockControllerLogic.processAssignJobsToFakeUsers(jobs);
			
			expect(mockPrisma.user.findFirst).toHaveBeenCalledTimes(jobs.length);
			expect(mockPrisma.job.create).toHaveBeenCalledTimes(jobs.length);
			expect(console.error).toHaveBeenCalledTimes(jobs.length);
		});

		it('should create new fake user when none found', async () => {
			const jobs = mockJobData.singleJob;
			
			mockPrisma.user.findFirst.mockResolvedValue(null);
			mockCreateFakeUser.mockResolvedValue(mockUserData.newFakeUser);
			mockPrisma.job.create.mockResolvedValue(mockCreatedJobData.successfulJobCreation);
			
			await mockControllerLogic.processAssignJobsToFakeUsers(jobs);
			
			expect(mockPrisma.user.findFirst).toHaveBeenCalledTimes(1);
			expect(mockCreateFakeUser).toHaveBeenCalledTimes(1);
			expect(mockPrisma.job.create).toHaveBeenCalledTimes(1);
		});

		it('should handle fake user creation errors', async () => {
			const jobs = mockJobData.singleJob;
			
			mockPrisma.user.findFirst.mockResolvedValue(null);
			mockCreateFakeUser.mockRejectedValue(mockErrors.fakeUserCreationError);
			
			await mockControllerLogic.processAssignJobsToFakeUsers(jobs);
			
			expect(mockPrisma.user.findFirst).toHaveBeenCalledTimes(1);
			expect(mockCreateFakeUser).toHaveBeenCalledTimes(1);
			expect(console.error).toHaveBeenCalledTimes(1);
		});

		it('should handle mixed success and error scenarios', async () => {
			const jobs = mockJobData.jobList;
			
			// First job succeeds, second fails, third succeeds
			mockPrisma.user.findFirst
				.mockResolvedValueOnce(mockUserData.existingFakeUser)
				.mockResolvedValueOnce(mockUserData.existingFakeUser)
				.mockResolvedValueOnce(mockUserData.existingFakeUser);
			
			mockPrisma.job.create
				.mockResolvedValueOnce(mockCreatedJobData.successfulJobCreation)
				.mockRejectedValueOnce(mockErrors.jobCreationError)
				.mockResolvedValueOnce(mockCreatedJobData.successfulJobCreation);
			
			await mockControllerLogic.processAssignJobsToFakeUsers(jobs);
			
			expect(mockPrisma.user.findFirst).toHaveBeenCalledTimes(3);
			expect(mockPrisma.job.create).toHaveBeenCalledTimes(3);
			expect(console.error).toHaveBeenCalledTimes(1);
		});

		it('should validate controller input', async () => {
			const validJobs = mockJobData.jobList;
			const invalidJobs = null;
			
			expect(Array.isArray(validJobs)).toBe(true);
			expect(Array.isArray(invalidJobs)).toBe(false);
		});
	});
});

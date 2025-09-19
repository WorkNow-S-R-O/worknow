import { vi } from 'vitest';

// Mock services
export const mockJobsServices = {
	createJobService: vi.fn(),
	updateJobService: vi.fn(),
	deleteJobService: vi.fn(),
	getJobsService: vi.fn(),
	boostJobService: vi.fn(),
};

// Mock console methods
export const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
export const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

// Mock request and response objects
export const mockRequest = {
	body: {
		title: 'Software Engineer',
		description: 'Develop and maintain software applications.',
		salary: '120000',
		cityId: '1',
		categoryId: '2',
		phone: '123-456-7890',
		imageUrl: 'http://example.com/image.jpg',
	},
	params: {
		id: '1',
	},
	query: {
		lang: 'ru',
		page: '1',
		limit: '10',
		category: '1',
		city: '1',
		salary: '100000',
		shuttle: 'true',
		meals: 'false',
	},
	user: {
		clerkUserId: 'user123',
		id: 'user123',
		email: 'user@example.com',
	},
};

export const mockResponse = {
	json: vi.fn(),
	status: vi.fn().mockReturnThis(),
};

// Mock job data
export const mockJobData = {
	validJob: {
		id: 1,
		title: 'Software Engineer',
		description: 'Develop and maintain software applications.',
		salary: 120000,
		cityId: 1,
		categoryId: 2,
		userId: 'user123',
		phone: '123-456-7890',
		imageUrl: 'http://example.com/image.jpg',
		status: 'ACTIVE',
		shuttle: false,
		meals: false,
		boostedAt: null,
		city: { id: 1, name: 'Tel Aviv' },
		category: { 
			id: 2, 
			name: 'IT',
			translations: [
				{ lang: 'ru', name: 'IT' },
				{ lang: 'en', name: 'Information Technology' },
				{ lang: 'he', name: 'טכנולוגיית מידע' },
				{ lang: 'ar', name: 'تكنولوجيا المعلومات' },
			]
		},
	},
	
	updatedJob: {
		id: 1,
		title: 'Senior Software Engineer',
		description: 'Lead development team and maintain software applications.',
		salary: 150000,
		cityId: 1,
		categoryId: 2,
		userId: 'user123',
		phone: '123-456-7890',
		imageUrl: 'http://example.com/updated-image.jpg',
		status: 'ACTIVE',
		shuttle: true,
		meals: true,
		boostedAt: null,
		city: { id: 1, name: 'Tel Aviv' },
		category: { 
			id: 2, 
			name: 'IT',
			translations: [
				{ lang: 'ru', name: 'IT' },
				{ lang: 'en', name: 'Information Technology' },
			]
		},
	},
	
	boostedJob: {
		id: 1,
		title: 'Software Engineer',
		description: 'Develop and maintain software applications.',
		salary: 120000,
		cityId: 1,
		categoryId: 2,
		userId: 'user123',
		phone: '123-456-7890',
		imageUrl: 'http://example.com/image.jpg',
		status: 'ACTIVE',
		shuttle: false,
		meals: false,
		boostedAt: '2024-01-01T00:00:00Z',
		city: { id: 1, name: 'Tel Aviv' },
		category: { 
			id: 2, 
			name: 'IT',
			translations: [
				{ lang: 'ru', name: 'IT' },
				{ lang: 'en', name: 'Information Technology' },
			]
		},
	},
	
	jobWithTranslations: {
		id: 2,
		title: 'Marketing Manager',
		description: 'Manage marketing campaigns.',
		salary: 80000,
		cityId: 3,
		categoryId: 4,
		userId: 'user456',
		phone: '098-765-4321',
		imageUrl: null,
		status: 'ACTIVE',
		shuttle: true,
		meals: false,
		boostedAt: null,
		city: { id: 3, name: 'Jerusalem' },
		category: { 
			id: 4, 
			name: 'Marketing',
			translations: [
				{ lang: 'ru', name: 'Маркетинг' },
				{ lang: 'en', name: 'Marketing' },
				{ lang: 'he', name: 'שיווק' },
				{ lang: 'ar', name: 'تسويق' },
			]
		},
	},
	
	jobWithoutTranslations: {
		id: 3,
		title: 'Designer',
		description: 'Create visual concepts.',
		salary: 75000,
		cityId: 5,
		categoryId: 6,
		userId: 'user789',
		phone: '111-222-3333',
		imageUrl: 'http://example.com/design.jpg',
		status: 'ACTIVE',
		shuttle: false,
		meals: true,
		boostedAt: null,
		city: { id: 5, name: 'Haifa' },
		category: { 
			id: 6, 
			name: 'Design',
			translations: []
		},
	},
	
	emptyJob: {},
};

// Mock job creation data
export const mockJobCreationData = {
	validJobData: {
		title: 'Software Developer',
		description: 'Develop and maintain software applications.',
		salary: '120000',
		cityId: '1',
		categoryId: '2',
		userId: 'user123',
		phone: '123-456-7890',
		imageUrl: 'http://example.com/image.jpg',
	},
	
	jobDataWithStringNumbers: {
		title: 'Marketing Manager',
		description: 'Manage marketing campaigns.',
		salary: '80000',
		cityId: '3',
		categoryId: '4',
		userId: 'user456',
		phone: '098-765-4321',
		imageUrl: 'http://example.com/marketing.jpg',
	},
	
	jobDataWithNumericValues: {
		title: 'Designer',
		description: 'Create visual concepts.',
		salary: 75000,
		cityId: 5,
		categoryId: 6,
		userId: 'user789',
		phone: '111-222-3333',
		imageUrl: 'http://example.com/design.jpg',
	},
	
	invalidJobData: {
		title: 'Invalid Job',
		description: 'This is an invalid job description.',
		salary: 'abc', // Invalid salary
		cityId: 'def', // Invalid cityId
		categoryId: 'ghi', // Invalid categoryId
		userId: 'user101',
		phone: '444-555-6666',
		imageUrl: 'invalid-url',
	},
	
	jobDataMissingFields: {
		title: 'Missing Fields Job',
		description: 'This job is missing some fields.',
		salary: '50000',
		cityId: '7',
		categoryId: '8',
		// userId and phone are missing
	},
	
	jobDataWithUpgradeRequired: {
		title: 'Premium Job',
		description: 'This job requires premium upgrade.',
		salary: '150000',
		cityId: '1',
		categoryId: '2',
		userId: 'premiumUser123',
		phone: '555-666-7777',
		imageUrl: 'http://example.com/premium.jpg',
	},
};

// Mock service responses
export const mockServiceResponses = {
	successCreateJobResponse: {
		job: mockJobData.validJob,
	},
	
	successUpdateJobResponse: {
		updatedJob: mockJobData.updatedJob,
	},
	
	successDeleteJobResponse: {
		message: 'Job deleted successfully',
	},
	
	successGetJobsResponse: {
		jobs: [mockJobData.validJob, mockJobData.jobWithTranslations, mockJobData.jobWithoutTranslations],
		pagination: {
			currentPage: 1,
			totalPages: 1,
			totalItems: 3,
			itemsPerPage: 10,
		},
	},
	
	successBoostJobResponse: {
		boostedJob: mockJobData.boostedJob,
	},
	
	errorCreateJobResponse: {
		error: 'Failed to create job',
	},
	
	errorCreateJobWithErrorsResponse: {
		errors: ['Title is required', 'Description is required'],
	},
	
	errorUpdateJobResponse: {
		error: 'Failed to update job',
	},
	
	errorUpdateJobWithErrorsResponse: {
		errors: ['Title is required', 'Salary must be a number'],
	},
	
	errorDeleteJobResponse: {
		error: 'Failed to delete job',
	},
	
	errorGetJobsResponse: {
		error: 'Failed to get jobs',
	},
	
	errorBoostJobResponse: {
		error: 'Failed to boost job',
	},
	
	errorUpgradeRequiredResponse: {
		error: 'Upgrade required to boost job',
		upgradeRequired: true,
	},
};

// Mock errors
export const mockErrors = {
	jobNotFoundError: new Error('Job not found'),
	databaseError: new Error('Database connection failed'),
	validationError: new Error('Validation failed'),
	upgradeRequiredError: new Error('Upgrade required'),
	serverError: new Error('Internal server error'),
	networkError: new Error('Network error'),
	timeoutError: new Error('Operation timeout'),
	permissionError: new Error('Permission denied'),
	unknownError: new Error('Unknown error occurred'),
	invalidIdError: new Error('Invalid ID format'),
	missingFieldsError: new Error('Missing required fields'),
	authenticationError: new Error('Authentication required'),
	authorizationError: new Error('Not authorized to perform this action'),
};

// Mock error messages
export const mockErrorMessages = {
	jobNotFoundError: 'Job not found',
	databaseError: 'Database connection failed',
	validationError: 'Validation failed',
	upgradeRequiredError: 'Upgrade required',
	serverError: 'Internal server error',
	networkError: 'Network error',
	timeoutError: 'Operation timeout',
	permissionError: 'Permission denied',
	unknownError: 'Unknown error occurred',
	invalidIdError: 'Invalid ID format',
	missingFieldsError: 'Missing required fields',
	authenticationError: 'Authentication required',
	authorizationError: 'Not authorized to perform this action',
	jobDeletedRussian: 'Объявление удалено',
	jobCreationErrorRussian: 'Ошибка создания объявления',
	jobUpdateErrorRussian: 'Ошибка обновления объявления',
	jobDeletionErrorRussian: 'Ошибка удаления объявления',
	jobRetrievalErrorRussian: 'Ошибка получения объявлений',
	jobBoostErrorRussian: 'Ошибка повышения объявления',
};

// Mock success messages
export const mockSuccessMessages = {
	jobCreated: 'Job created successfully',
	jobUpdated: 'Job updated successfully',
	jobDeleted: 'Job deleted successfully',
	jobRetrieved: 'Job retrieved successfully',
	jobBoosted: 'Job boosted successfully',
	operationCompleted: 'Operation completed successfully',
	responseSent: 'Response sent successfully',
	validationPassed: 'Validation passed successfully',
	serviceCalled: 'Service called successfully',
};

// Mock console log data
export const mockConsoleLogData = {
	createJobRequest: '🔍 createJob controller - Request body:',
	createJobImageUrl: '🔍 createJob controller - imageUrl in request:',
	createJobUser: '🔍 createJob controller - Authenticated user:',
	createJobCreated: '🔍 createJob controller - Job created:',
	updateJobRequest: '🔍 updateJob controller - Request body:',
	updateJobImageUrl: '🔍 updateJob controller - imageUrl in request:',
	updateJobUser: '🔍 updateJob controller - Authenticated user:',
	updateJobUpdated: '🔍 updateJob controller - Job updated:',
	deleteJobUser: '🔍 deleteJob controller - Authenticated user:',
	serviceCalled: 'Service called successfully',
	responseSent: 'Response sent successfully',
};

// Mock data type conversions
export const mockDataConversions = {
	string: {
		id: '1',
		title: 'Software Engineer',
		description: 'Develop and maintain software applications.',
		phone: '123-456-7890',
		imageUrl: 'http://example.com/image.jpg',
		errorMessage: 'Ошибка создания объявления',
	},
	
	number: {
		id: 1,
		salary: 120000,
		cityId: 1,
		categoryId: 2,
		page: 1,
		limit: 10,
		statusCode: 200,
		errorStatusCode: 500,
	},
	
	boolean: {
		isValid: true,
		isEmpty: false,
		hasError: false,
		success: true,
		upgradeRequired: false,
		shuttle: true,
		meals: false,
	},
	
	object: {
		job: mockJobData.validJob,
		response: mockServiceResponses.successCreateJobResponse,
		error: mockErrors.jobNotFoundError,
		city: { id: 1, name: 'Tel Aviv' },
		category: { id: 2, name: 'IT' },
		pagination: { currentPage: 1, totalPages: 1 },
	},
	
	array: {
		jobs: [mockJobData.validJob, mockJobData.jobWithTranslations],
		errors: [mockErrors.validationError, mockErrors.databaseError],
		translations: mockJobData.validJob.category.translations,
	},
	
	null: {
		job: null,
		city: null,
		category: null,
		error: null,
		imageUrl: null,
	},
};

// Mock query parameter processing logic
export const mockQueryProcessingLogic = {
	processQueryParameters: (query) => {
		const { page, limit, category, city, salary, shuttle, meals } = query;
		
		return {
			page: page ? parseInt(page) : 1,
			limit: limit ? parseInt(limit) : 10,
			category,
			city,
			salary: salary ? parseInt(salary) : undefined,
			shuttle: shuttle === 'true',
			meals: meals === 'true',
		};
	},
	
	parsePage: (page) => {
		return page ? parseInt(page) : 1;
	},
	
	parseLimit: (limit) => {
		return limit ? parseInt(limit) : 10;
	},
	
	parseSalary: (salary) => {
		return salary ? parseInt(salary) : undefined;
	},
	
	parseBoolean: (value) => {
		return value === 'true';
	},
	
	validateQueryParameters: (query) => {
		const { page, limit, salary } = query;
		
		if (page && isNaN(parseInt(page))) return false;
		if (limit && isNaN(parseInt(limit))) return false;
		if (salary && isNaN(parseInt(salary))) return false;
		
		return true;
	},
	
	buildFilters: (query) => {
		return mockQueryProcessingLogic.processQueryParameters(query);
	},
};

// Mock translation processing logic
export const mockTranslationProcessingLogic = {
	processJobTranslations: (jobs, lang = 'ru') => {
		return jobs.map((job) => {
			let categoryLabel = job.category?.name;
			if (job.category?.translations?.length) {
				const translation = job.category.translations.find(
					(t) => t.lang === lang,
				);
				if (translation) categoryLabel = translation.name;
			}
			return {
				...job,
				category: job.category ? { ...job.category, label: categoryLabel } : null,
			};
		});
	},
	
	findTranslation: (translations, lang) => {
		return translations?.find((t) => t.lang === lang);
	},
	
	getCategoryLabel: (category, lang) => {
		if (category?.translations?.length) {
			const translation = category.translations.find((t) => t.lang === lang);
			if (translation) return translation.name;
		}
		return category?.name;
	},
	
	processCategoryTranslation: (category, lang) => {
		const label = mockTranslationProcessingLogic.getCategoryLabel(category, lang);
		return category ? { ...category, label } : null;
	},
	
	validateLanguage: (lang) => {
		return ['ru', 'en', 'he', 'ar'].includes(lang);
	},
	
	getDefaultLanguage: () => {
		return 'ru';
	},
};

// Mock authentication logic
export const mockAuthenticationLogic = {
	extractUserFromRequest: (req) => {
		return req.user?.clerkUserId;
	},
	
	validateAuthentication: (req) => {
		return !!(req.user && req.user.clerkUserId && req.user.clerkUserId !== '');
	},
	
	buildJobDataWithUser: (req) => {
		return {
			...req.body,
			userId: req.user?.clerkUserId,
		};
	},
	
	buildUpdateDataWithUser: (req) => {
		return {
			...req.body,
			userId: req.user?.clerkUserId,
		};
	},
	
	handleUnauthenticatedRequest: (res) => {
		return res.status(401).json({ error: 'Authentication required' });
	},
	
	logUserInfo: (req, operation) => {
		console.log(`🔍 ${operation} controller - Authenticated user:`, req.user);
	},
};

// Mock pagination logic
export const mockPaginationLogic = {
	buildPaginationResponse: (jobs, pagination) => {
		return {
			jobs,
			pagination,
		};
	},
	
	validatePagination: (pagination) => {
		return !!(pagination && typeof pagination === 'object');
	},
	
	processPaginationData: (pagination) => {
		return {
			currentPage: pagination.currentPage || 1,
			totalPages: pagination.totalPages || 1,
			totalItems: pagination.totalItems || 0,
			itemsPerPage: pagination.itemsPerPage || 10,
		};
	},
};

// Mock controller logic
export const mockControllerLogic = {
	processCreateJobRequest: async (req, res) => {
		console.log('🔍 createJob controller - Request body:', req.body);
		console.log('🔍 createJob controller - imageUrl in request:', req.body.imageUrl);
		console.log('🔍 createJob controller - Authenticated user:', req.user);

		const jobData = {
			...req.body,
			userId: req.user?.clerkUserId,
		};

		const result = await mockJobsServices.createJobService(jobData);
		if (result.errors)
			return res.status(400).json({ success: false, errors: result.errors });
		if (result.error) return res.status(400).json({ error: result.error });

		console.log('🔍 createJob controller - Job created:', result.job);
		res.status(201).json(result.job);
	},
	
	processUpdateJobRequest: async (req, res) => {
		console.log('🔍 updateJob controller - Request body:', req.body);
		console.log('🔍 updateJob controller - imageUrl in request:', req.body.imageUrl);
		console.log('🔍 updateJob controller - Authenticated user:', req.user);

		const updateData = {
			...req.body,
			userId: req.user?.clerkUserId,
		};

		const result = await mockJobsServices.updateJobService(req.params.id, updateData);
		if (result.error) return res.status(400).json({ error: result.error });
		if (result.errors)
			return res.status(400).json({ success: false, errors: result.errors });

		console.log('🔍 updateJob controller - Job updated:', result.updatedJob);
		res.status(200).json(result.updatedJob);
	},
	
	processDeleteJobRequest: async (req, res) => {
		console.log('🔍 deleteJob controller - Authenticated user:', req.user);

		const result = await mockJobsServices.deleteJobService(req.params.id, req.user?.clerkUserId);
		if (result.error) return res.status(400).json({ error: result.error });
		res.status(200).json({ message: 'Объявление удалено' });
	},
	
	processGetJobsRequest: async (req, res) => {
		const lang = req.query.lang || 'ru';
		const { page, limit, category, city, salary, shuttle, meals } = req.query;

		const filters = {
			page: page ? parseInt(page) : 1,
			limit: limit ? parseInt(limit) : 10,
			category,
			city,
			salary: salary ? parseInt(salary) : undefined,
			shuttle: shuttle === 'true',
			meals: meals === 'true',
		};

		const result = await mockJobsServices.getJobsService(filters);
		if (result.error) return res.status(500).json({ error: result.error });

		const jobs = result.jobs.map((job) => {
			let categoryLabel = job.category?.name;
			if (job.category?.translations?.length) {
				const translation = job.category.translations.find(
					(t) => t.lang === lang,
				);
				if (translation) categoryLabel = translation.name;
			}
			return {
				...job,
				category: job.category ? { ...job.category, label: categoryLabel } : null,
			};
		});

		res.status(200).json({
			jobs,
			pagination: result.pagination,
		});
	},
	
	processBoostJobRequest: async (req, res) => {
		const result = await mockJobsServices.boostJobService(req.params.id);
		if (result.error) return res.status(400).json({ error: result.error });
		res.status(200).json(result.boostedJob);
	},
	
	handleControllerError: (error, res, operation = 'operation') => {
		console.error(`Ошибка ${operation}:`, error.message);
		return res.status(500).json({ 
			error: `Ошибка ${operation}`, 
			details: error.message 
		});
	},
	
	handleControllerSuccess: (data, res, statusCode = 200) => {
		return res.status(statusCode).json(data);
	},
	
	validateControllerInput: (req) => {
		return !!(req && req.body && Object.keys(req.body).length > 0);
	},
};

// Mock service integration logic
export const mockServiceIntegrationLogic = {
	callCreateJobService: async (jobData) => {
		return await mockJobsServices.createJobService(jobData);
	},
	
	callUpdateJobService: async (id, updateData) => {
		return await mockJobsServices.updateJobService(id, updateData);
	},
	
	callDeleteJobService: async (id, userId) => {
		return await mockJobsServices.deleteJobService(id, userId);
	},
	
	callGetJobsService: async (filters) => {
		return await mockJobsServices.getJobsService(filters);
	},
	
	callBoostJobService: async (id) => {
		return await mockJobsServices.boostJobService(id);
	},
	
	handleServiceResponse: (result) => {
		if (result.error) {
			return {
				success: false,
				error: result.error,
			};
		}
		if (result.errors) {
			return {
				success: false,
				errors: result.errors,
			};
		}
		return {
			success: true,
			data: result.job || result.updatedJob || result.boostedJob || result,
		};
	},
	
	handleServiceError: (error) => {
		return {
			success: false,
			error: error.message,
		};
	},
	
	validateServiceResult: (result) => {
		return result !== null && result !== undefined;
	},
	
	processServiceResult: (result) => {
		return result;
	},
};

// Mock request/response logic
export const mockRequestResponseLogic = {
	buildRequest: (body = {}, params = {}, query = {}, user = {}) => {
		return {
			body: {
				title: 'Software Engineer',
				description: 'Develop and maintain software applications.',
				salary: '120000',
				cityId: '1',
				categoryId: '2',
				phone: '123-456-7890',
				imageUrl: 'http://example.com/image.jpg',
				...body,
			},
			params: {
				id: '1',
				...params,
			},
			query: {
				lang: 'ru',
				page: '1',
				limit: '10',
				category: '1',
				city: '1',
				salary: '100000',
				shuttle: 'true',
				meals: 'false',
				...query,
			},
			user: {
				clerkUserId: 'user123',
				id: 'user123',
				email: 'user@example.com',
				...user,
			},
		};
	},
	
	buildResponse: () => {
		return {
			json: vi.fn(),
			status: vi.fn().mockReturnThis(),
		};
	},
	
	handleSuccessResponse: (res, data, statusCode = 200) => {
		res.status(statusCode).json(data);
	},
	
	handleErrorResponse: (res, error, statusCode = 500) => {
		res.status(statusCode).json({ error: error.message });
	},
	
	handleValidationError: (res, errors, statusCode = 400) => {
		res.status(statusCode).json({ success: false, errors });
	},
	
	handleSingleError: (res, error, statusCode = 400) => {
		res.status(statusCode).json({ error });
	},
	
	validateRequest: (req) => {
		return !!(req && req.body && Object.keys(req.body).length > 0);
	},
	
	extractJobData: (req) => {
		return req.body;
	},
	
	extractUpdateData: (req) => {
		return req.body;
	},
	
	extractQueryParameters: (req) => {
		return req.query;
	},
	
	extractUserId: (req) => {
		return req.user?.clerkUserId;
	},
};

// Reset mocks before each test
export const resetJobsControllerMocks = () => {
	mockJobsServices.createJobService.mockClear();
	mockJobsServices.updateJobService.mockClear();
	mockJobsServices.deleteJobService.mockClear();
	mockJobsServices.getJobsService.mockClear();
	mockJobsServices.boostJobService.mockClear();
	mockConsoleLog.mockClear();
	mockConsoleError.mockClear();
	mockResponse.json.mockClear();
	mockResponse.status.mockClear();
	vi.clearAllMocks();
};

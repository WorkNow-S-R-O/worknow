import { vi } from 'vitest';

// Mock services
export const mockJobServices = {
	getJobByIdService: vi.fn(),
	createJobService: vi.fn(),
};

// Mock console methods
export const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
export const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

// Mock request and response objects
export const mockRequest = {
	params: {
		id: '1',
	},
	body: {
		title: 'Software Engineer',
		description: 'Develop and maintain software applications.',
		salary: '120000',
		cityId: '1',
		categoryId: '2',
		userId: 'user123',
		phone: '123-456-7890',
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
		status: 'ACTIVE',
		city: { id: 1, name: 'Tel Aviv' },
		category: { id: 2, name: 'IT' },
	},
	
	anotherValidJob: {
		id: 2,
		title: 'Marketing Manager',
		description: 'Manage marketing campaigns.',
		salary: 80000,
		cityId: 3,
		categoryId: 4,
		userId: 'user456',
		phone: '098-765-4321',
		status: 'ACTIVE',
		city: { id: 3, name: 'Jerusalem' },
		category: { id: 4, name: 'Marketing' },
	},
	
	jobWithNullRelations: {
		id: 3,
		title: 'Designer',
		description: 'Create visual concepts.',
		salary: 75000,
		cityId: null,
		categoryId: null,
		userId: 'user789',
		phone: '111-222-3333',
		status: 'ACTIVE',
		city: null,
		category: null,
	},
	
	jobWithMissingFields: {
		id: 4,
		title: 'Incomplete Job',
		// description, salary, cityId, categoryId, userId, phone are missing
		status: 'ACTIVE',
		city: null,
		category: null,
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
	},
	
	jobDataWithStringNumbers: {
		title: 'Marketing Manager',
		description: 'Manage marketing campaigns.',
		salary: '80000',
		cityId: '3',
		categoryId: '4',
		userId: 'user456',
		phone: '098-765-4321',
	},
	
	jobDataWithNumericValues: {
		title: 'Designer',
		description: 'Create visual concepts.',
		salary: 75000,
		cityId: 5,
		categoryId: 6,
		userId: 'user789',
		phone: '111-222-3333',
	},
	
	invalidJobData: {
		title: 'Invalid Job',
		description: 'This is an invalid job description.',
		salary: 'abc', // Invalid salary
		cityId: 'def', // Invalid cityId
		categoryId: 'ghi', // Invalid categoryId
		userId: 'user101',
		phone: '444-555-6666',
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
	},
};

// Mock service responses
export const mockServiceResponses = {
	successJobByIdResponse: {
		job: mockJobData.validJob,
	},
	
	successCreateJobResponse: {
		id: 1,
		title: 'Software Developer',
		description: 'Develop and maintain software applications.',
		salary: 120000,
		cityId: 1,
		categoryId: 2,
		userId: 'user123',
		phone: '123-456-7890',
		status: 'ACTIVE',
		city: { id: 1, name: 'Tel Aviv' },
		category: { id: 2, name: 'IT' },
	},
	
	errorJobNotFoundResponse: {
		error: 'Объявление не найдено.',
	},
	
	errorCreateJobResponse: {
		error: 'Failed to create job',
	},
	
	errorUpgradeRequiredResponse: {
		error: 'Вы уже разместили максимальное количество объявлений.',
		upgradeRequired: true,
	},
	
	errorValidationResponse: {
		error: 'Validation failed',
	},
	
	errorServerResponse: {
		error: 'Server error occurred',
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
	jobNotFoundRussian: 'Объявление не найдено.',
	jobCreationErrorRussian: 'Ошибка создания объявления',
	jobRetrievalErrorRussian: 'Ошибка получения объявления',
	invalidIdRussian: 'ID вакансии обязателен и должен быть числом',
	upgradeRequiredRussian: 'Для размещения большего количества объявлений перейдите на Premium тариф',
};

// Mock success messages
export const mockSuccessMessages = {
	jobRetrieved: 'Job retrieved successfully',
	jobCreated: 'Job created successfully',
	operationCompleted: 'Operation completed successfully',
	responseSent: 'Response sent successfully',
	validationPassed: 'Validation passed successfully',
	serviceCalled: 'Service called successfully',
};

// Mock console log data
export const mockConsoleLogData = {
	jobRetrieved: '🔍 getJobById - Job data:',
	jobCreationError: 'Ошибка создания объявления:',
	jobRetrievalError: 'Ошибка получения объявления:',
	serviceCalled: 'Service called successfully',
	validationPassed: 'Validation passed successfully',
	responseSent: 'Response sent successfully',
};

// Mock data type conversions
export const mockDataConversions = {
	string: {
		id: '1',
		title: 'Software Engineer',
		description: 'Develop and maintain software applications.',
		phone: '123-456-7890',
		errorMessage: 'Ошибка получения объявления',
	},
	
	number: {
		id: 1,
		salary: 120000,
		cityId: 1,
		categoryId: 2,
		statusCode: 200,
		errorStatusCode: 500,
	},
	
	boolean: {
		isValid: true,
		isEmpty: false,
		hasError: false,
		success: true,
		upgradeRequired: false,
	},
	
	object: {
		job: mockJobData.validJob,
		response: mockServiceResponses.successJobByIdResponse,
		error: mockErrors.jobNotFoundError,
		city: { id: 1, name: 'Tel Aviv' },
		category: { id: 2, name: 'IT' },
	},
	
	array: {
		jobs: [mockJobData.validJob, mockJobData.anotherValidJob],
		errors: [mockErrors.validationError, mockErrors.databaseError],
	},
	
	null: {
		job: null,
		city: null,
		category: null,
		error: null,
	},
};

// Mock ID validation logic
export const mockIdValidationLogic = {
	validateId: (id) => {
		return !!(id && !isNaN(Number(id)) && Number(id) > 0);
	},
	
	parseId: (id) => {
		return Number(id);
	},
	
	isValidId: (id) => {
		return typeof id === 'string' && !isNaN(Number(id)) && Number(id) > 0;
	},
	
	isInvalidId: (id) => {
		return !id || isNaN(Number(id)) || Number(id) <= 0;
	},
	
	handleInvalidId: (res) => {
		return res.status(400).json({ 
			error: 'ID вакансии обязателен и должен быть числом' 
		});
	},
	
	handleValidId: (id) => {
		return Number(id);
	},
};

// Mock job processing logic
export const mockJobProcessingLogic = {
	processJobByIdRequest: async (req, res) => {
		const { id } = req.params;

		if (!id || isNaN(Number(id))) {
			return res.status(400).json({ 
				error: 'ID вакансии обязателен и должен быть числом' 
			});
		}

		try {
			const result = await mockJobServices.getJobByIdService(Number(id));

			if (result.error) {
				return res.status(404).json({ error: result.error });
			}

			console.log('🔍 getJobById - Job data:', result.job);
			res.status(200).json(result.job);
		} catch (error) {
			console.error('Ошибка получения объявления:', error.message);
			res.status(500).json({ 
				error: 'Ошибка получения объявления', 
				details: error.message 
			});
		}
	},
	
	processCreateJobRequest: async (req, res) => {
		const jobData = req.body;

		try {
			const result = await mockJobServices.createJobService(jobData);

			if (result.error) {
				if (result.upgradeRequired) {
					return res.status(403).json({
						error: result.error,
						upgradeRequired: true,
						message: 'Для размещения большего количества объявлений перейдите на Premium тариф',
					});
				}
				return res.status(400).json({ error: result.error });
			}

			res.status(201).json(result);
		} catch (error) {
			console.error('Ошибка создания объявления:', error.message);
			res.status(500).json({ 
				error: 'Ошибка создания объявления', 
				details: error.message 
			});
		}
	},
	
	handleJobByIdSuccess: (job, res) => {
		console.log('🔍 getJobById - Job data:', job);
		return res.status(200).json(job);
	},
	
	handleJobByIdError: (error, res) => {
		console.error('Ошибка получения объявления:', error.message);
		return res.status(500).json({ 
			error: 'Ошибка получения объявления', 
			details: error.message 
		});
	},
	
	handleCreateJobSuccess: (result, res) => {
		return res.status(201).json(result);
	},
	
	handleCreateJobError: (error, res) => {
		console.error('Ошибка создания объявления:', error.message);
		return res.status(500).json({ 
			error: 'Ошибка создания объявления', 
			details: error.message 
		});
	},
	
	handleUpgradeRequired: (result, res) => {
		return res.status(403).json({
			error: result.error,
			upgradeRequired: true,
			message: 'Для размещения большего количества объявлений перейдите на Premium тариф',
		});
	},
};

// Mock service integration logic
export const mockServiceIntegrationLogic = {
	callGetJobByIdService: async (id) => {
		return await mockJobServices.getJobByIdService(id);
	},
	
	callCreateJobService: async (jobData) => {
		return await mockJobServices.createJobService(jobData);
	},
	
	handleServiceResponse: (result) => {
		if (result.error) {
			return {
				success: false,
				error: result.error,
				upgradeRequired: result.upgradeRequired || false,
			};
		}
		return {
			success: true,
			data: result.job || result,
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
	buildRequest: (params = {}, body = {}) => {
		return {
			params: {
				id: '1',
				...params,
			},
			body: {
				title: 'Software Engineer',
				description: 'Develop and maintain software applications.',
				salary: '120000',
				cityId: '1',
				categoryId: '2',
				userId: 'user123',
				phone: '123-456-7890',
				...body,
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
	
	handleValidationError: (res, message, statusCode = 400) => {
		res.status(statusCode).json({ error: message });
	},
	
	handleNotFoundError: (res, message, statusCode = 404) => {
		res.status(statusCode).json({ error: message });
	},
	
	handleUpgradeRequiredError: (res, error, message, statusCode = 403) => {
		res.status(statusCode).json({
			error: error,
			upgradeRequired: true,
			message: message,
		});
	},
	
	validateRequest: (req) => {
		return !!(req && req.params && req.params.id);
	},
	
	extractId: (req) => {
		return req.params?.id;
	},
	
	extractJobData: (req) => {
		return req.body;
	},
};

// Mock controller logic
export const mockControllerLogic = {
	processGetJobByIdRequest: async (req, res) => {
		const { id } = req.params;

		if (!id || isNaN(Number(id))) {
			return res.status(400).json({ 
				error: 'ID вакансии обязателен и должен быть числом' 
			});
		}

		try {
			const result = await mockJobServices.getJobByIdService(Number(id));

			if (result.error) {
				return res.status(404).json({ error: result.error });
			}

			console.log('🔍 getJobById - Job data:', result.job);
			res.status(200).json(result.job);
		} catch (error) {
			console.error('Ошибка получения объявления:', error.message);
			res.status(500).json({ 
				error: 'Ошибка получения объявления', 
				details: error.message 
			});
		}
	},
	
	processCreateJobRequest: async (req, res) => {
		const jobData = req.body;

		try {
			const result = await mockJobServices.createJobService(jobData);

			if (result.error) {
				if (result.upgradeRequired) {
					return res.status(403).json({
						error: result.error,
						upgradeRequired: true,
						message: 'Для размещения большего количества объявлений перейдите на Premium тариф',
					});
				}
				return res.status(400).json({ error: result.error });
			}

			res.status(201).json(result);
		} catch (error) {
			console.error('Ошибка создания объявления:', error.message);
			res.status(500).json({ 
				error: 'Ошибка создания объявления', 
				details: error.message 
			});
		}
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
		return !!(req && req.params && req.params.id);
	},
	
	processControllerResponse: (result, res, operation = 'operation') => {
		if (result.error) {
			if (result.upgradeRequired) {
				return mockControllerLogic.handleUpgradeRequired(result, res);
			}
			return res.status(400).json({ error: result.error });
		}
		return mockControllerLogic.handleControllerSuccess(result, res, 201);
	},
	
	handleUpgradeRequired: (result, res) => {
		return res.status(403).json({
			error: result.error,
			upgradeRequired: true,
			message: 'Для размещения большего количества объявлений перейдите на Premium тариф',
		});
	},
};

// Reset mocks before each test
export const resetJobControllerMocks = () => {
	mockJobServices.getJobByIdService.mockClear();
	mockJobServices.createJobService.mockClear();
	mockConsoleLog.mockClear();
	mockConsoleError.mockClear();
	mockResponse.json.mockClear();
	mockResponse.status.mockClear();
	vi.clearAllMocks();
};

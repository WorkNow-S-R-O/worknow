import { vi } from 'vitest';

// Mock services
export const mockMessagesServices = {
	createMessage: vi.fn(),
	getUserMessages: vi.fn(),
	markMessageRead: vi.fn(),
	broadcastMessage: vi.fn(),
	deleteMessage: vi.fn(),
};

// Mock Prisma
export const mockPrisma = {
	message: {
		create: vi.fn(),
		findMany: vi.fn(),
		findUnique: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
	},
	user: {
		findUnique: vi.fn(),
		findMany: vi.fn(),
	},
};

// Mock console methods
export const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
export const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

// Mock sendEmail function
export const mockSendEmail = vi.fn();

// Mock request and response objects
export const mockRequest = {
	body: {
		clerkUserId: 'user123',
		title: 'Test Message',
		body: 'This is a test message body.',
		type: 'system',
		fromAdminId: 'admin456',
	},
	params: {
		id: 'msg123',
	},
	query: {
		clerkUserId: 'user123',
	},
};

export const mockResponse = {
	json: vi.fn(),
	status: vi.fn().mockReturnThis(),
};

// Mock message data
export const mockMessageData = {
	validMessage: {
		id: 'msg123',
		clerkUserId: 'user123',
		title: 'Welcome Message',
		body: 'Welcome to our platform!',
		type: 'system',
		isRead: false,
		fromAdminId: null,
		createdAt: '2024-01-01T00:00:00Z',
	},
	
	adminMessage: {
		id: 'msg456',
		clerkUserId: 'user123',
		title: 'Admin Notification',
		body: 'This is an admin notification.',
		type: 'admin',
		isRead: false,
		fromAdminId: 'admin456',
		createdAt: '2024-01-02T00:00:00Z',
	},
	
	readMessage: {
		id: 'msg789',
		clerkUserId: 'user123',
		title: 'Read Message',
		body: 'This message has been read.',
		type: 'system',
		isRead: true,
		fromAdminId: null,
		createdAt: '2024-01-03T00:00:00Z',
	},
	
	messageWithHtml: {
		id: 'msg101',
		clerkUserId: 'user123',
		title: 'HTML Message',
		body: '<h2>HTML Title</h2><p>This is HTML content.</p>',
		type: 'system',
		isRead: false,
		fromAdminId: null,
		createdAt: '2024-01-04T00:00:00Z',
	},
	
	emptyMessage: {},
};

// Mock user data
export const mockUserData = {
	validUser: {
		id: 'user123',
		clerkUserId: 'user123',
		email: 'user@example.com',
		firstName: 'John',
		lastName: 'Doe',
		isPremium: false,
	},
	
	userWithoutEmail: {
		id: 'user456',
		clerkUserId: 'user456',
		email: null,
		firstName: 'Jane',
		lastName: 'Smith',
		isPremium: true,
	},
	
	premiumUser: {
		id: 'user789',
		clerkUserId: 'user789',
		email: 'premium@example.com',
		firstName: 'Premium',
		lastName: 'User',
		isPremium: true,
	},
	
	adminUser: {
		id: 'admin123',
		clerkUserId: 'admin123',
		email: 'admin@example.com',
		firstName: 'Admin',
		lastName: 'User',
		isAdmin: true,
	},
};

// Mock message creation data
export const mockMessageCreationData = {
	validMessageData: {
		clerkUserId: 'user123',
		title: 'New Message',
		body: 'This is a new message.',
		type: 'system',
		fromAdminId: null,
	},
	
	adminMessageData: {
		clerkUserId: 'user123',
		title: 'Admin Message',
		body: 'This is an admin message.',
		type: 'admin',
		fromAdminId: 'admin456',
	},
	
	messageDataWithHtml: {
		clerkUserId: 'user123',
		title: 'HTML Message',
		body: '<h2>HTML Title</h2><p>This is HTML content.</p>',
		type: 'system',
		fromAdminId: null,
	},
	
	invalidMessageData: {
		// Missing required fields
		title: 'Invalid Message',
		body: 'This message is missing clerkUserId.',
	},
	
	messageDataMissingTitle: {
		clerkUserId: 'user123',
		body: 'This message is missing title.',
		type: 'system',
	},
	
	messageDataMissingBody: {
		clerkUserId: 'user123',
		title: 'This message is missing body.',
		type: 'system',
	},
};

// Mock broadcast data
export const mockBroadcastData = {
	validBroadcastData: {
		title: 'Broadcast Message',
		body: 'This is a broadcast message to all users.',
		clerkUserIds: ['user123', 'user456', 'user789'],
	},
	
	broadcastToAllUsers: {
		title: 'Broadcast to All',
		body: 'This is a broadcast message to all users.',
		clerkUserIds: [],
	},
	
	broadcastToSpecificUsers: {
		title: 'Specific Broadcast',
		body: 'This is a broadcast message to specific users.',
		clerkUserIds: ['user123', 'user456'],
	},
	
	invalidBroadcastData: {
		// Missing required fields
		clerkUserIds: ['user123', 'user456'],
	},
	
	broadcastDataMissingTitle: {
		body: 'This broadcast is missing title.',
		clerkUserIds: ['user123'],
	},
	
	broadcastDataMissingBody: {
		title: 'This broadcast is missing body.',
		clerkUserIds: ['user123'],
	},
};

// Mock service responses
export const mockServiceResponses = {
	successCreateMessageResponse: {
		success: true,
		message: mockMessageData.validMessage,
	},
	
	successGetUserMessagesResponse: {
		messages: [mockMessageData.validMessage, mockMessageData.adminMessage, mockMessageData.readMessage],
	},
	
	successMarkMessageReadResponse: {
		success: true,
		message: mockMessageData.readMessage,
	},
	
	successBroadcastMessageResponse: {
		success: true,
		count: 3,
	},
	
	successDeleteMessageResponse: {
		success: true,
		message: 'Сообщение удалено',
	},
	
	errorCreateMessageResponse: {
		error: 'Ошибка создания сообщения',
	},
	
	errorGetUserMessagesResponse: {
		error: 'Ошибка получения сообщений',
	},
	
	errorMarkMessageReadResponse: {
		error: 'Ошибка отметки сообщения',
	},
	
	errorBroadcastMessageResponse: {
		error: 'Ошибка рассылки',
	},
	
	errorDeleteMessageResponse: {
		error: 'Ошибка удаления сообщения',
	},
	
	errorValidationResponse: {
		error: 'clerkUserId, title и body обязательны',
	},
	
	errorMissingClerkUserIdResponse: {
		error: 'clerkUserId обязателен',
	},
	
	errorMessageNotFoundResponse: {
		error: 'Сообщение не найдено',
	},
	
	errorInvalidMessageIdResponse: {
		error: 'Invalid message ID format',
	},
	
	errorMissingMessageIdResponse: {
		error: 'Message ID is required',
	},
	
	errorMissingTitleResponse: {
		error: 'title и body обязательны',
	},
};

// Mock errors
export const mockErrors = {
	messageNotFoundError: new Error('Message not found'),
	databaseError: new Error('Database connection failed'),
	validationError: new Error('Validation failed'),
	emailError: new Error('Email sending failed'),
	serverError: new Error('Internal server error'),
	networkError: new Error('Network error'),
	timeoutError: new Error('Operation timeout'),
	permissionError: new Error('Permission denied'),
	unknownError: new Error('Unknown error occurred'),
	invalidIdError: new Error('Invalid ID format'),
	missingFieldsError: new Error('Missing required fields'),
	prismaError: new Error('Prisma operation failed'),
	emailSendingError: new Error('Failed to send email'),
	broadcastError: new Error('Broadcast operation failed'),
	userNotFoundError: new Error('User not found'),
};

// Mock Prisma errors
export const mockPrismaErrors = {
	p2025Error: {
		code: 'P2025',
		message: 'Record not found',
	},
	
	p2002Error: {
		code: 'P2002',
		message: 'Unique constraint failed',
	},
	
	p2003Error: {
		code: 'P2003',
		message: 'Foreign key constraint failed',
	},
	
	p2014Error: {
		code: 'P2014',
		message: 'Required relation missing',
	},
};

// Mock error messages
export const mockErrorMessages = {
	messageNotFoundError: 'Сообщение не найдено',
	databaseError: 'Ошибка создания сообщения',
	validationError: 'clerkUserId, title и body обязательны',
	emailError: 'Ошибка отправки email',
	serverError: 'Ошибка создания сообщения',
	networkError: 'Network error',
	timeoutError: 'Operation timeout',
	permissionError: 'Permission denied',
	unknownError: 'Unknown error occurred',
	invalidIdError: 'Invalid message ID format',
	missingFieldsError: 'Missing required fields',
	prismaError: 'Prisma operation failed',
	emailSendingError: 'Failed to send email',
	broadcastError: 'Ошибка рассылки',
	userNotFoundError: 'User not found',
	missingClerkUserId: 'clerkUserId обязателен',
	missingTitleAndBody: 'title и body обязательны',
	messageIdRequired: 'Message ID is required',
	messageDeleted: 'Сообщение удалено',
};

// Mock success messages
export const mockSuccessMessages = {
	messageCreated: 'Message created successfully',
	messageRetrieved: 'Messages retrieved successfully',
	messageMarkedRead: 'Message marked as read successfully',
	messageBroadcasted: 'Message broadcasted successfully',
	messageDeleted: 'Message deleted successfully',
	operationCompleted: 'Operation completed successfully',
	responseSent: 'Response sent successfully',
	validationPassed: 'Validation passed successfully',
	serviceCalled: 'Service called successfully',
	emailSent: 'Email sent successfully',
};

// Mock console log data
export const mockConsoleLogData = {
	messageCreationError: 'Ошибка создания сообщения:',
	messageRetrievalError: 'Ошибка получения сообщений:',
	messageMarkReadError: 'Ошибка отметки сообщения как прочитанного:',
	broadcastError: 'Ошибка рассылки:',
	deleteMessageError: 'Error in deleteMessage:',
	emailSendingError: 'Ошибка отправки email:',
	attemptingDelete: 'Attempting to delete message with ID:',
	noMessageId: 'No message ID provided',
	messageFound: 'Message found:',
	messageNotFound: 'Message not found for ID:',
	messageDeletedSuccess: 'Message deleted successfully:',
	serviceCalled: 'Service called successfully',
	responseSent: 'Response sent successfully',
};

// Mock data type conversions
export const mockDataConversions = {
	string: {
		id: 'msg123',
		clerkUserId: 'user123',
		title: 'Test Message',
		body: 'This is a test message body.',
		type: 'system',
		fromAdminId: 'admin456',
		email: 'user@example.com',
		errorMessage: 'Ошибка создания сообщения',
	},
	
	number: {
		count: 3,
		statusCode: 200,
		errorStatusCode: 500,
		successStatusCode: 201,
	},
	
	boolean: {
		isValid: true,
		isEmpty: false,
		hasError: false,
		success: true,
		isRead: false,
		isAdmin: false,
		isPremium: false,
	},
	
	object: {
		message: mockMessageData.validMessage,
		user: mockUserData.validUser,
		response: mockServiceResponses.successCreateMessageResponse,
		error: mockErrors.messageNotFoundError,
	},
	
	array: {
		messages: [mockMessageData.validMessage, mockMessageData.adminMessage],
		users: [mockUserData.validUser, mockUserData.premiumUser],
		clerkUserIds: ['user123', 'user456', 'user789'],
		errors: [mockErrors.validationError, mockErrors.databaseError],
	},
	
	null: {
		message: null,
		user: null,
		error: null,
		fromAdminId: null,
		email: null,
	},
};

// Mock validation logic
export const mockValidationLogic = {
	validateCreateMessageData: (data) => {
		const { clerkUserId, title, body } = data;
		if (!clerkUserId || !title || !body) {
			return {
				isValid: false,
				error: 'clerkUserId, title и body обязательны',
			};
		}
		return { isValid: true };
	},
	
	validateGetUserMessagesData: (query) => {
		const { clerkUserId } = query;
		if (!clerkUserId) {
			return {
				isValid: false,
				error: 'clerkUserId обязателен',
			};
		}
		return { isValid: true };
	},
	
	validateBroadcastData: (data) => {
		const { title, body } = data;
		if (!title || !body) {
			return {
				isValid: false,
				error: 'title и body обязательны',
			};
		}
		return { isValid: true };
	},
	
	validateDeleteMessageData: (params) => {
		const { id } = params;
		if (!id) {
			return {
				isValid: false,
				error: 'Message ID is required',
			};
		}
		return { isValid: true };
	},
	
	validateMessageId: (id) => {
		return !!(id && typeof id === 'string' && id.length > 0);
	},
	
	validateClerkUserId: (clerkUserId) => {
		return !!(clerkUserId && typeof clerkUserId === 'string' && clerkUserId.length > 0);
	},
	
	validateTitle: (title) => {
		return !!(title && typeof title === 'string' && title.length > 0);
	},
	
	validateBody: (body) => {
		return !!(body && typeof body === 'string' && body.length > 0);
	},
	
	validateEmail: (email) => {
		return !!(email && typeof email === 'string' && email.includes('@'));
	},
	
	validateMessageType: (type) => {
		return ['system', 'admin'].includes(type);
	},
};

// Mock email processing logic
export const mockEmailProcessingLogic = {
	processEmailContent: (title, body) => {
		return `<h2>${title}</h2><p>${body}</p>`;
	},
	
	processHtmlEmailContent: (title, body) => {
		return `<h2>${title}</h2><p>${body}</p>`;
	},
	
	validateEmailContent: (content) => {
		return !!(content && typeof content === 'string' && content.length > 0);
	},
	
	formatEmailSubject: (title) => {
		return title || 'No Subject';
	},
	
	formatEmailBody: (body) => {
		return body || 'No Content';
	},
	
	handleEmailError: (error) => {
		console.error('Ошибка отправки email:', error);
		return {
			success: false,
			error: error.message,
		};
	},
	
	handleEmailSuccess: (email) => {
		return {
			success: true,
			email: email,
		};
	},
};

// Mock broadcast processing logic
export const mockBroadcastProcessingLogic = {
	processBroadcastUsers: (clerkUserIds) => {
		if (Array.isArray(clerkUserIds) && clerkUserIds.length > 0) {
			return { specificUsers: true, userIds: clerkUserIds };
		}
		return { specificUsers: false, userIds: [] };
	},
	
	processBroadcastMessage: (title, body) => {
		return {
			title: title || 'No Title',
			body: body || 'No Content',
			type: 'admin',
		};
	},
	
	handleBroadcastError: (error) => {
		console.error('Ошибка рассылки:', error);
		return {
			success: false,
			error: error.message,
		};
	},
	
	handleBroadcastSuccess: (count) => {
		return {
			success: true,
			count: count || 0,
		};
	},
	
	validateBroadcastData: (data) => {
		const { title, body, clerkUserIds } = data;
		if (!title || !body) {
			return {
				isValid: false,
				error: 'title и body обязательны',
			};
		}
		return { isValid: true };
	},
};

// Mock controller logic
export const mockControllerLogic = {
	processCreateMessageRequest: async (req, res) => {
		try {
			const { clerkUserId, title, body, type = 'system', fromAdminId } = req.body;
			if (!clerkUserId || !title || !body) {
				return res
					.status(400)
					.json({ error: 'clerkUserId, title и body обязательны' });
			}
			
			const message = await mockPrisma.message.create({
				data: { clerkUserId, title, body, type, fromAdminId },
			});
			
			const user = await mockPrisma.user.findUnique({ where: { clerkUserId } });
			if (user && user.email) {
				try {
					await mockSendEmail(user.email, title, `<h2>${title}</h2><p>${body}</p>`);
				} catch (e) {
					console.error('Ошибка отправки email:', e);
				}
			}
			
			return res.json({ success: true, message });
		} catch (error) {
			console.error('Ошибка создания сообщения:', error);
			return res.status(500).json({ error: 'Ошибка создания сообщения' });
		}
	},
	
	processGetUserMessagesRequest: async (req, res) => {
		try {
			const { clerkUserId } = req.query;
			if (!clerkUserId)
				return res.status(400).json({ error: 'clerkUserId обязателен' });
			
			const messages = await mockPrisma.message.findMany({
				where: { clerkUserId },
				orderBy: { createdAt: 'desc' },
			});
			
			return res.json({ messages });
		} catch (error) {
			console.error('Ошибка получения сообщений:', error);
			return res.status(500).json({ error: 'Ошибка получения сообщений' });
		}
	},
	
	processMarkMessageReadRequest: async (req, res) => {
		try {
			const { id } = req.params;
			const message = await mockPrisma.message.update({
				where: { id },
				data: { isRead: true },
			});
			
			return res.json({ success: true, message });
		} catch (error) {
			console.error('Ошибка отметки сообщения как прочитанного:', error);
			return res.status(500).json({ error: 'Ошибка отметки сообщения' });
		}
	},
	
	processBroadcastMessageRequest: async (req, res) => {
		try {
			const { title, body, clerkUserIds } = req.body;
			if (!title || !body) {
				return res.status(400).json({ error: 'title и body обязательны' });
			}
			
			let users;
			if (Array.isArray(clerkUserIds) && clerkUserIds.length > 0) {
				users = await mockPrisma.user.findMany({
					where: { clerkUserId: { in: clerkUserIds } },
				});
			} else {
				users = await mockPrisma.user.findMany();
			}
			
			let sent = 0;
			for (const user of users) {
				await mockPrisma.message.create({
					data: {
						clerkUserId: user.clerkUserId,
						title,
						body,
						type: 'admin',
					},
				});
				
				if (user.email) {
					try {
						await mockSendEmail(user.email, title, body);
					} catch (e) {
						console.error('Ошибка отправки email:', e);
					}
				}
				sent++;
			}
			
			return res.json({ success: true, count: sent });
		} catch (error) {
			console.error('Ошибка рассылки:', error);
			return res.status(500).json({ error: 'Ошибка рассылки' });
		}
	},
	
	processDeleteMessageRequest: async (req, res) => {
		try {
			const { id } = req.params;
			console.log('Attempting to delete message with ID:', id);
			
			if (!id) {
				console.log('No message ID provided');
				return res.status(400).json({ error: 'Message ID is required' });
			}
			
			const message = await mockPrisma.message.findUnique({
				where: { id },
			});
			
			console.log('Message found:', message ? 'Yes' : 'No');
			
			if (!message) {
				console.log('Message not found for ID:', id);
				return res.status(404).json({ error: 'Сообщение не найдено' });
			}
			
			const deletedMessage = await mockPrisma.message.delete({
				where: { id },
			});
			
			console.log('Message deleted successfully:', deletedMessage.id);
			
			return res.json({ success: true, message: 'Сообщение удалено' });
		} catch (error) {
			console.error('Error in deleteMessage:', error);
			
			if (error.code === 'P2025') {
				return res.status(404).json({ error: 'Сообщение не найдено' });
			}
			
			if (error.code === 'P2002') {
				return res.status(400).json({ error: 'Invalid message ID format' });
			}
			
			return res.status(500).json({ error: 'Ошибка удаления сообщения' });
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
		return !!(req && req.body && Object.keys(req.body).length > 0);
	},
};

// Mock service integration logic
export const mockServiceIntegrationLogic = {
	callCreateMessageService: async (messageData) => {
		return await mockPrisma.message.create({
			data: messageData,
		});
	},
	
	callGetUserMessagesService: async (clerkUserId) => {
		return await mockPrisma.message.findMany({
			where: { clerkUserId },
			orderBy: { createdAt: 'desc' },
		});
	},
	
	callMarkMessageReadService: async (id) => {
		return await mockPrisma.message.update({
			where: { id },
			data: { isRead: true },
		});
	},
	
	callBroadcastMessageService: async (broadcastData) => {
		const { title, body, clerkUserIds } = broadcastData;
		let users;
		if (Array.isArray(clerkUserIds) && clerkUserIds.length > 0) {
			users = await mockPrisma.user.findMany({
				where: { clerkUserId: { in: clerkUserIds } },
			});
		} else {
			users = await mockPrisma.user.findMany();
		}
		
		let sent = 0;
		for (const user of users) {
			await mockPrisma.message.create({
				data: {
					clerkUserId: user.clerkUserId,
					title,
					body,
					type: 'admin',
				},
			});
			sent++;
		}
		
		return { success: true, count: sent };
	},
	
	callDeleteMessageService: async (id) => {
		return await mockPrisma.message.delete({
			where: { id },
		});
	},
	
	handleServiceResponse: (result) => {
		if (result.error) {
			return {
				success: false,
				error: result.error,
			};
		}
		return {
			success: true,
			data: result,
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
	buildRequest: (body = {}, params = {}, query = {}) => {
		return {
			body: {
				clerkUserId: 'user123',
				title: 'Test Message',
				body: 'This is a test message body.',
				type: 'system',
				fromAdminId: 'admin456',
				...body,
			},
			params: {
				id: 'msg123',
				...params,
			},
			query: {
				clerkUserId: 'user123',
				...query,
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
	
	handleValidationError: (res, error, statusCode = 400) => {
		res.status(statusCode).json({ error });
	},
	
	handleNotFoundError: (res, error, statusCode = 404) => {
		res.status(statusCode).json({ error });
	},
	
	validateRequest: (req) => {
		return !!(req && (req.body || req.params || req.query));
	},
	
	extractMessageData: (req) => {
		return req.body;
	},
	
	extractQueryParameters: (req) => {
		return req.query;
	},
	
	extractParams: (req) => {
		return req.params;
	},
};

// Reset mocks before each test
export const resetMessagesControllerMocks = () => {
	mockPrisma.message.create.mockClear();
	mockPrisma.message.findMany.mockClear();
	mockPrisma.message.findUnique.mockClear();
	mockPrisma.message.update.mockClear();
	mockPrisma.message.delete.mockClear();
	mockPrisma.user.findUnique.mockClear();
	mockPrisma.user.findMany.mockClear();
	mockSendEmail.mockClear();
	mockConsoleLog.mockClear();
	mockConsoleError.mockClear();
	mockResponse.json.mockClear();
	mockResponse.status.mockClear();
	vi.clearAllMocks();
};

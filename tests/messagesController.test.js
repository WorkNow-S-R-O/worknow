import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Import mock data
import {
	mockPrisma,
	mockConsoleLog,
	mockConsoleError,
	mockSendEmail,
	mockRequest,
	mockResponse,
	mockMessageData,
	mockUserData,
	mockMessageCreationData,
	mockBroadcastData,
	mockServiceResponses,
	mockErrors,
	mockPrismaErrors,
	mockErrorMessages,
	mockSuccessMessages,
	mockConsoleLogData,
	mockDataConversions,
	mockValidationLogic,
	mockEmailProcessingLogic,
	mockBroadcastProcessingLogic,
	mockControllerLogic,
	mockServiceIntegrationLogic,
	mockRequestResponseLogic,
	resetMessagesControllerMocks,
} from './mocks/messagesController.js';

// Mock console methods to avoid noise in tests
const originalConsoleError = console.error;
const originalConsoleLog = console.log;

describe('MessagesController', () => {
	beforeEach(() => {
		// Reset all mocks
		resetMessagesControllerMocks();
		
		// Mock console methods
		console.error = vi.fn();
		console.log = vi.fn();
	});

	afterEach(() => {
		// Restore console methods
		console.error = originalConsoleError;
		console.log = originalConsoleLog;
	});

	describe('Message Data Processing Logic', () => {
		it('should handle valid message data', () => {
			const message = mockMessageData.validMessage;
			expect(message).toHaveProperty('id');
			expect(message).toHaveProperty('clerkUserId');
			expect(message).toHaveProperty('title');
			expect(message).toHaveProperty('body');
			expect(message).toHaveProperty('type');
			expect(message).toHaveProperty('isRead');
			expect(message).toHaveProperty('fromAdminId');
			expect(message).toHaveProperty('createdAt');
		});

		it('should handle admin message data', () => {
			const message = mockMessageData.adminMessage;
			expect(message.type).toBe('admin');
			expect(message.fromAdminId).toBe('admin456');
		});

		it('should handle read message data', () => {
			const message = mockMessageData.readMessage;
			expect(message.isRead).toBe(true);
		});

		it('should handle message with HTML content', () => {
			const message = mockMessageData.messageWithHtml;
			expect(message.body).toContain('<h2>');
			expect(message.body).toContain('<p>');
		});

		it('should handle empty message data', () => {
			const message = mockMessageData.emptyMessage;
			expect(typeof message).toBe('object');
		});
	});

	describe('User Data Processing Logic', () => {
		it('should handle valid user data', () => {
			const user = mockUserData.validUser;
			expect(user).toHaveProperty('id');
			expect(user).toHaveProperty('clerkUserId');
			expect(user).toHaveProperty('email');
			expect(user).toHaveProperty('firstName');
			expect(user).toHaveProperty('lastName');
			expect(user).toHaveProperty('isPremium');
		});

		it('should handle user without email', () => {
			const user = mockUserData.userWithoutEmail;
			expect(user.email).toBeNull();
		});

		it('should handle premium user data', () => {
			const user = mockUserData.premiumUser;
			expect(user.isPremium).toBe(true);
		});

		it('should handle admin user data', () => {
			const user = mockUserData.adminUser;
			expect(user.isAdmin).toBe(true);
		});
	});

	describe('Validation Logic', () => {
		it('should validate create message data correctly', () => {
			const validData = mockMessageCreationData.validMessageData;
			const invalidData = mockMessageCreationData.invalidMessageData;
			
			expect(mockValidationLogic.validateCreateMessageData(validData).isValid).toBe(true);
			expect(mockValidationLogic.validateCreateMessageData(invalidData).isValid).toBe(false);
			expect(mockValidationLogic.validateCreateMessageData(invalidData).error).toBe('clerkUserId, title и body обязательны');
		});

		it('should validate get user messages data correctly', () => {
			const validQuery = { clerkUserId: 'user123' };
			const invalidQuery = {};
			
			expect(mockValidationLogic.validateGetUserMessagesData(validQuery).isValid).toBe(true);
			expect(mockValidationLogic.validateGetUserMessagesData(invalidQuery).isValid).toBe(false);
			expect(mockValidationLogic.validateGetUserMessagesData(invalidQuery).error).toBe('clerkUserId обязателен');
		});

		it('should validate broadcast data correctly', () => {
			const validData = mockBroadcastData.validBroadcastData;
			const invalidData = mockBroadcastData.invalidBroadcastData;
			
			expect(mockValidationLogic.validateBroadcastData(validData).isValid).toBe(true);
			expect(mockValidationLogic.validateBroadcastData(invalidData).isValid).toBe(false);
			expect(mockValidationLogic.validateBroadcastData(invalidData).error).toBe('title и body обязательны');
		});

		it('should validate delete message data correctly', () => {
			const validParams = { id: 'msg123' };
			const invalidParams = {};
			
			expect(mockValidationLogic.validateDeleteMessageData(validParams).isValid).toBe(true);
			expect(mockValidationLogic.validateDeleteMessageData(invalidParams).isValid).toBe(false);
			expect(mockValidationLogic.validateDeleteMessageData(invalidParams).error).toBe('Message ID is required');
		});

		it('should validate message ID correctly', () => {
			expect(mockValidationLogic.validateMessageId('msg123')).toBe(true);
			expect(mockValidationLogic.validateMessageId('')).toBe(false);
			expect(mockValidationLogic.validateMessageId(null)).toBe(false);
			expect(mockValidationLogic.validateMessageId(undefined)).toBe(false);
		});

		it('should validate clerk user ID correctly', () => {
			expect(mockValidationLogic.validateClerkUserId('user123')).toBe(true);
			expect(mockValidationLogic.validateClerkUserId('')).toBe(false);
			expect(mockValidationLogic.validateClerkUserId(null)).toBe(false);
		});

		it('should validate title correctly', () => {
			expect(mockValidationLogic.validateTitle('Test Title')).toBe(true);
			expect(mockValidationLogic.validateTitle('')).toBe(false);
			expect(mockValidationLogic.validateTitle(null)).toBe(false);
		});

		it('should validate body correctly', () => {
			expect(mockValidationLogic.validateBody('Test Body')).toBe(true);
			expect(mockValidationLogic.validateBody('')).toBe(false);
			expect(mockValidationLogic.validateBody(null)).toBe(false);
		});

		it('should validate email correctly', () => {
			expect(mockValidationLogic.validateEmail('user@example.com')).toBe(true);
			expect(mockValidationLogic.validateEmail('invalid-email')).toBe(false);
			expect(mockValidationLogic.validateEmail('')).toBe(false);
		});

		it('should validate message type correctly', () => {
			expect(mockValidationLogic.validateMessageType('system')).toBe(true);
			expect(mockValidationLogic.validateMessageType('admin')).toBe(true);
			expect(mockValidationLogic.validateMessageType('invalid')).toBe(false);
		});
	});

	describe('Email Processing Logic', () => {
		it('should process email content correctly', () => {
			const title = 'Test Title';
			const body = 'Test Body';
			const result = mockEmailProcessingLogic.processEmailContent(title, body);
			
			expect(result).toBe('<h2>Test Title</h2><p>Test Body</p>');
		});

		it('should process HTML email content correctly', () => {
			const title = 'HTML Title';
			const body = '<p>HTML Body</p>';
			const result = mockEmailProcessingLogic.processHtmlEmailContent(title, body);
			
			expect(result).toBe('<h2>HTML Title</h2><p><p>HTML Body</p></p>');
		});

		it('should validate email content correctly', () => {
			expect(mockEmailProcessingLogic.validateEmailContent('Valid content')).toBe(true);
			expect(mockEmailProcessingLogic.validateEmailContent('')).toBe(false);
			expect(mockEmailProcessingLogic.validateEmailContent(null)).toBe(false);
		});

		it('should format email subject correctly', () => {
			expect(mockEmailProcessingLogic.formatEmailSubject('Test Subject')).toBe('Test Subject');
			expect(mockEmailProcessingLogic.formatEmailSubject('')).toBe('No Subject');
			expect(mockEmailProcessingLogic.formatEmailSubject(null)).toBe('No Subject');
		});

		it('should format email body correctly', () => {
			expect(mockEmailProcessingLogic.formatEmailBody('Test Body')).toBe('Test Body');
			expect(mockEmailProcessingLogic.formatEmailBody('')).toBe('No Content');
			expect(mockEmailProcessingLogic.formatEmailBody(null)).toBe('No Content');
		});

		it('should handle email error correctly', () => {
			const error = mockErrors.emailError;
			const result = mockEmailProcessingLogic.handleEmailError(error);
			
			expect(result.success).toBe(false);
			expect(result.error).toBe(error.message);
		});

		it('should handle email success correctly', () => {
			const email = 'user@example.com';
			const result = mockEmailProcessingLogic.handleEmailSuccess(email);
			
			expect(result.success).toBe(true);
			expect(result.email).toBe(email);
		});
	});

	describe('Broadcast Processing Logic', () => {
		it('should process broadcast users correctly', () => {
			const specificUsers = ['user123', 'user456'];
			const allUsers = [];
			
			const specificResult = mockBroadcastProcessingLogic.processBroadcastUsers(specificUsers);
			const allResult = mockBroadcastProcessingLogic.processBroadcastUsers(allUsers);
			
			expect(specificResult.specificUsers).toBe(true);
			expect(specificResult.userIds).toEqual(specificUsers);
			expect(allResult.specificUsers).toBe(false);
			expect(allResult.userIds).toEqual([]);
		});

		it('should process broadcast message correctly', () => {
			const title = 'Broadcast Title';
			const body = 'Broadcast Body';
			const result = mockBroadcastProcessingLogic.processBroadcastMessage(title, body);
			
			expect(result.title).toBe(title);
			expect(result.body).toBe(body);
			expect(result.type).toBe('admin');
		});

		it('should handle broadcast error correctly', () => {
			const error = mockErrors.broadcastError;
			const result = mockBroadcastProcessingLogic.handleBroadcastError(error);
			
			expect(result.success).toBe(false);
			expect(result.error).toBe(error.message);
		});

		it('should handle broadcast success correctly', () => {
			const count = 5;
			const result = mockBroadcastProcessingLogic.handleBroadcastSuccess(count);
			
			expect(result.success).toBe(true);
			expect(result.count).toBe(count);
		});

		it('should validate broadcast data correctly', () => {
			const validData = mockBroadcastData.validBroadcastData;
			const invalidData = mockBroadcastData.invalidBroadcastData;
			
			expect(mockBroadcastProcessingLogic.validateBroadcastData(validData).isValid).toBe(true);
			expect(mockBroadcastProcessingLogic.validateBroadcastData(invalidData).isValid).toBe(false);
		});
	});

	describe('Controller Logic', () => {
		it('should process createMessage request successfully', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();
			
			mockPrisma.message.create.mockResolvedValue(mockMessageData.validMessage);
			mockPrisma.user.findUnique.mockResolvedValue(mockUserData.validUser);
			mockSendEmail.mockResolvedValue(true);
			
			await mockControllerLogic.processCreateMessageRequest(req, res);
			
			expect(mockPrisma.message.create).toHaveBeenCalledWith({
				data: {
					clerkUserId: 'user123',
					title: 'Test Message',
					body: 'This is a test message body.',
					type: 'system',
					fromAdminId: 'admin456',
				},
			});
			expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
				where: { clerkUserId: 'user123' },
			});
			expect(mockSendEmail).toHaveBeenCalledWith(
				'user@example.com',
				'Test Message',
				'<h2>Test Message</h2><p>This is a test message body.</p>'
			);
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				message: mockMessageData.validMessage,
			});
		});

		it('should process createMessage request with validation error', async () => {
			const req = mockRequestResponseLogic.buildRequest({
				clerkUserId: '',
				title: 'Test Message',
				body: 'This is a test message body.',
			});
			const res = mockRequestResponseLogic.buildResponse();
			
			await mockControllerLogic.processCreateMessageRequest(req, res);
			
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				error: 'clerkUserId, title и body обязательны',
			});
		});

		it('should process createMessage request with database error', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();
			
			mockPrisma.message.create.mockRejectedValue(mockErrors.databaseError);
			
			await mockControllerLogic.processCreateMessageRequest(req, res);
			
			expect(console.error).toHaveBeenCalledWith('Ошибка создания сообщения:', mockErrors.databaseError);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Ошибка создания сообщения',
			});
		});

		it('should process getUserMessages request successfully', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();
			
			mockPrisma.message.findMany.mockResolvedValue([
				mockMessageData.validMessage,
				mockMessageData.adminMessage,
			]);
			
			await mockControllerLogic.processGetUserMessagesRequest(req, res);
			
			expect(mockPrisma.message.findMany).toHaveBeenCalledWith({
				where: { clerkUserId: 'user123' },
				orderBy: { createdAt: 'desc' },
			});
			expect(res.json).toHaveBeenCalledWith({
				messages: [mockMessageData.validMessage, mockMessageData.adminMessage],
			});
		});

		it('should process getUserMessages request with missing clerkUserId', async () => {
			const req = mockRequestResponseLogic.buildRequest({}, {}, { clerkUserId: '' });
			const res = mockRequestResponseLogic.buildResponse();
			
			await mockControllerLogic.processGetUserMessagesRequest(req, res);
			
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				error: 'clerkUserId обязателен',
			});
		});

		it('should process markMessageRead request successfully', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();
			
			mockPrisma.message.update.mockResolvedValue(mockMessageData.readMessage);
			
			await mockControllerLogic.processMarkMessageReadRequest(req, res);
			
			expect(mockPrisma.message.update).toHaveBeenCalledWith({
				where: { id: 'msg123' },
				data: { isRead: true },
			});
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				message: mockMessageData.readMessage,
			});
		});

		it('should process broadcastMessage request successfully', async () => {
			const req = mockRequestResponseLogic.buildRequest(mockBroadcastData.validBroadcastData);
			const res = mockRequestResponseLogic.buildResponse();
			
			mockPrisma.user.findMany.mockResolvedValue([
				mockUserData.validUser,
				mockUserData.premiumUser,
			]);
			mockPrisma.message.create.mockResolvedValue(mockMessageData.validMessage);
			mockSendEmail.mockResolvedValue(true);
			
			await mockControllerLogic.processBroadcastMessageRequest(req, res);
			
			expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
				where: { clerkUserId: { in: ['user123', 'user456', 'user789'] } },
			});
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				count: 2,
			});
		});

		it('should process broadcastMessage request to all users', async () => {
			const req = mockRequestResponseLogic.buildRequest(mockBroadcastData.broadcastToAllUsers);
			const res = mockRequestResponseLogic.buildResponse();
			
			mockPrisma.user.findMany.mockResolvedValue([
				mockUserData.validUser,
				mockUserData.premiumUser,
				mockUserData.adminUser,
			]);
			mockPrisma.message.create.mockResolvedValue(mockMessageData.validMessage);
			mockSendEmail.mockResolvedValue(true);
			
			await mockControllerLogic.processBroadcastMessageRequest(req, res);
			
			expect(mockPrisma.user.findMany).toHaveBeenCalledWith();
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				count: 3,
			});
		});

		it('should process deleteMessage request successfully', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();
			
			mockPrisma.message.findUnique.mockResolvedValue(mockMessageData.validMessage);
			mockPrisma.message.delete.mockResolvedValue(mockMessageData.validMessage);
			
			await mockControllerLogic.processDeleteMessageRequest(req, res);
			
			expect(console.log).toHaveBeenCalledWith('Attempting to delete message with ID:', 'msg123');
			expect(mockPrisma.message.findUnique).toHaveBeenCalledWith({
				where: { id: 'msg123' },
			});
			expect(console.log).toHaveBeenCalledWith('Message found:', 'Yes');
			expect(mockPrisma.message.delete).toHaveBeenCalledWith({
				where: { id: 'msg123' },
			});
			expect(console.log).toHaveBeenCalledWith('Message deleted successfully:', mockMessageData.validMessage.id);
			expect(res.json).toHaveBeenCalledWith({
				success: true,
				message: 'Сообщение удалено',
			});
		});

		it('should process deleteMessage request with missing ID', async () => {
			const req = mockRequestResponseLogic.buildRequest({}, { id: '' });
			const res = mockRequestResponseLogic.buildResponse();
			
			await mockControllerLogic.processDeleteMessageRequest(req, res);
			
			expect(console.log).toHaveBeenCalledWith('No message ID provided');
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Message ID is required',
			});
		});

		it('should process deleteMessage request with message not found', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();
			
			mockPrisma.message.findUnique.mockResolvedValue(null);
			
			await mockControllerLogic.processDeleteMessageRequest(req, res);
			
			expect(console.log).toHaveBeenCalledWith('Message not found for ID:', 'msg123');
			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Сообщение не найдено',
			});
		});

		it('should process deleteMessage request with Prisma P2025 error', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();
			
			mockPrisma.message.findUnique.mockResolvedValue(mockMessageData.validMessage);
			mockPrisma.message.delete.mockRejectedValue(mockPrismaErrors.p2025Error);
			
			await mockControllerLogic.processDeleteMessageRequest(req, res);
			
			expect(console.error).toHaveBeenCalledWith('Error in deleteMessage:', mockPrismaErrors.p2025Error);
			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Сообщение не найдено',
			});
		});

		it('should process deleteMessage request with Prisma P2002 error', async () => {
			const req = mockRequestResponseLogic.buildRequest();
			const res = mockRequestResponseLogic.buildResponse();
			
			mockPrisma.message.findUnique.mockResolvedValue(mockMessageData.validMessage);
			mockPrisma.message.delete.mockRejectedValue(mockPrismaErrors.p2002Error);
			
			await mockControllerLogic.processDeleteMessageRequest(req, res);
			
			expect(console.error).toHaveBeenCalledWith('Error in deleteMessage:', mockPrismaErrors.p2002Error);
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Invalid message ID format',
			});
		});

		it('should handle controller errors', () => {
			const error = mockErrors.databaseError;
			const res = mockRequestResponseLogic.buildResponse();
			
			mockControllerLogic.handleControllerError(error, res, 'создания сообщения');
			
			expect(console.error).toHaveBeenCalledWith('Ошибка создания сообщения:', 'Database connection failed');
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Ошибка создания сообщения',
				details: 'Database connection failed',
			});
		});

		it('should handle controller success', () => {
			const data = mockMessageData.validMessage;
			const res = mockRequestResponseLogic.buildResponse();
			
			mockControllerLogic.handleControllerSuccess(data, res);
			
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(data);
		});

		it('should handle controller success with custom status code', () => {
			const data = mockServiceResponses.successCreateMessageResponse;
			const res = mockRequestResponseLogic.buildResponse();
			
			mockControllerLogic.handleControllerSuccess(data, res, 201);
			
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith(data);
		});

		it('should validate controller input', () => {
			const validRequest = { body: { title: 'Test Message' }, params: {}, query: {} };
			const invalidRequest = { body: {} };
			
			expect(mockControllerLogic.validateControllerInput(validRequest)).toBe(true);
			expect(mockControllerLogic.validateControllerInput(invalidRequest)).toBe(false);
		});
	});
});

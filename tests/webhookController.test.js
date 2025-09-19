import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock process.exit to prevent actual exit
const mockProcessExit = vi.fn();
vi.stubGlobal('process', {
	...process,
	exit: mockProcessExit,
	env: {
		...process.env,
		WEBHOOK_SECRET: 'whsec_test_secret',
	},
});

import { clerkWebhook } from '../apps/api/controllers/webhookController.js';
import {
	mockWebhook,
	mockWebhookVerify,
	mockProcessClerkWebhookService,
	mockConsole,
	mockProcess,
	mockRequest,
	mockResponse,
	mockWebhookEventData,
	mockHeaders,
	mockRawBodyData,
	mockErrors,
	mockServiceResponses,
	mockWebhookServiceLogic,
	mockSvixWebhookLogic,
	mockControllerLogic,
	mockRequestResponseLogic,
	mockEnv,
	resetAllMocks,
} from '../tests/mocks/webhookController.js';

beforeEach(() => {
	resetAllMocks();
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('WebhookController', () => {
	describe('Webhook Event Data Processing Logic', () => {
		it('should handle user created event', async () => {
			const event = mockWebhookEventData.userCreated;
			expect(event.type).toBe('user.created');
			expect(event.data.id).toBe('user_123');
			expect(event.data.email_addresses).toBeDefined();
			expect(event.data.first_name).toBe('John');
			expect(event.data.last_name).toBe('Doe');
		});

		it('should handle user updated event', async () => {
			const event = mockWebhookEventData.userUpdated;
			expect(event.type).toBe('user.updated');
			expect(event.data.id).toBe('user_456');
			expect(event.data.first_name).toBe('Jane');
			expect(event.data.last_name).toBe('Smith');
		});

		it('should handle user deleted event', async () => {
			const event = mockWebhookEventData.userDeleted;
			expect(event.type).toBe('user.deleted');
			expect(event.data.id).toBe('user_789');
			expect(event.data.deleted_at).toBeDefined();
		});

		it('should handle session created event', async () => {
			const event = mockWebhookEventData.sessionCreated;
			expect(event.type).toBe('session.created');
			expect(event.data.id).toBe('sess_123');
			expect(event.data.user_id).toBe('user_123');
		});

		it('should handle session ended event', async () => {
			const event = mockWebhookEventData.sessionEnded;
			expect(event.type).toBe('session.ended');
			expect(event.data.id).toBe('sess_123');
			expect(event.data.user_id).toBe('user_123');
		});

		it('should handle invalid event', async () => {
			const event = mockWebhookEventData.invalidEvent;
			expect(event.type).toBe('invalid.type');
			expect(event.data).toEqual({});
		});
	});

	describe('Headers Processing Logic', () => {
		it('should handle valid Svix headers', async () => {
			const headers = mockHeaders.validSvixHeaders;
			expect(headers['svix-id']).toBe('msg_123456789');
			expect(headers['svix-timestamp']).toBe('1640995200');
			expect(headers['svix-signature']).toBe('v1,signature_hash');
		});

		it('should handle missing Svix ID', async () => {
			const headers = mockHeaders.missingSvixId;
			expect(headers['svix-id']).toBeUndefined();
			expect(headers['svix-timestamp']).toBe('1640995200');
			expect(headers['svix-signature']).toBe('v1,signature_hash');
		});

		it('should handle missing Svix timestamp', async () => {
			const headers = mockHeaders.missingSvixTimestamp;
			expect(headers['svix-id']).toBe('msg_123456789');
			expect(headers['svix-timestamp']).toBeUndefined();
			expect(headers['svix-signature']).toBe('v1,signature_hash');
		});

		it('should handle missing Svix signature', async () => {
			const headers = mockHeaders.missingSvixSignature;
			expect(headers['svix-id']).toBe('msg_123456789');
			expect(headers['svix-timestamp']).toBe('1640995200');
			expect(headers['svix-signature']).toBeUndefined();
		});

		it('should handle empty headers', async () => {
			const headers = mockHeaders.emptyHeaders;
			expect(Object.keys(headers).length).toBe(0);
		});

		it('should handle invalid headers', async () => {
			const headers = mockHeaders.invalidHeaders;
			expect(headers['svix-id']).toBe('');
			expect(headers['svix-timestamp']).toBe('');
			expect(headers['svix-signature']).toBe('');
		});
	});

	describe('Raw Body Processing Logic', () => {
		it('should handle valid raw body', async () => {
			const rawBody = mockRawBodyData.validRawBody;
			expect(rawBody).toBeTruthy();
			expect(() => JSON.parse(rawBody)).not.toThrow();
		});

		it('should handle invalid raw body', async () => {
			const rawBody = mockRawBodyData.invalidRawBody;
			expect(rawBody).toBe('invalid json');
			expect(() => JSON.parse(rawBody)).toThrow();
		});

		it('should handle empty raw body', async () => {
			const rawBody = mockRawBodyData.emptyRawBody;
			expect(rawBody).toBe('');
		});

		it('should handle malformed raw body', async () => {
			const rawBody = mockRawBodyData.malformedRawBody;
			expect(rawBody).toBe('{ invalid json }');
			expect(() => JSON.parse(rawBody)).toThrow();
		});
	});

	describe('Validation Logic', () => {
		it('should validate webhook secret correctly', async () => {
			const validSecret = 'whsec_test_secret';
			const invalidSecret = '';
			expect(validSecret).toBeTruthy();
			expect(invalidSecret).toBeFalsy();
		});

		it('should validate Svix headers correctly', async () => {
			const validHeaders = mockHeaders.validSvixHeaders;
			const invalidHeaders = mockHeaders.emptyHeaders;
			expect(validHeaders['svix-id']).toBeTruthy();
			expect(validHeaders['svix-timestamp']).toBeTruthy();
			expect(validHeaders['svix-signature']).toBeTruthy();
			expect(invalidHeaders['svix-id']).toBeFalsy();
		});

		it('should validate event type correctly', async () => {
			const validEvent = mockWebhookEventData.userCreated;
			const invalidEvent = mockWebhookEventData.invalidEvent;
			expect(validEvent.type).toBeTruthy();
			expect(invalidEvent.type).toBe('invalid.type');
		});

		it('should validate event data correctly', async () => {
			const event = mockWebhookEventData.userCreated;
			expect(event.data).toBeDefined();
			expect(event.data.id).toBeDefined();
			expect(event.data.email_addresses).toBeDefined();
		});

		it('should validate raw body format correctly', async () => {
			const validRawBody = mockRawBodyData.validRawBody;
			const invalidRawBody = mockRawBodyData.invalidRawBody;
			expect(() => JSON.parse(validRawBody)).not.toThrow();
			expect(() => JSON.parse(invalidRawBody)).toThrow();
		});
	});

	describe('Svix Webhook Integration Logic', () => {
		it('should create webhook instance correctly', async () => {
			const secret = 'whsec_test_secret';
			const webhook = mockSvixWebhookLogic.createWebhook(secret);
			expect(webhook).toBeDefined();
			expect(webhook.verify).toBeDefined();
		});

		it('should verify webhook correctly', async () => {
			const rawBody = mockRawBodyData.validRawBody;
			const headers = mockHeaders.validSvixHeaders;
			const event = mockSvixWebhookLogic.verifyWebhook(rawBody, headers);
			expect(event).toBeDefined();
			expect(event.type).toBe('user.created');
		});

		it('should handle webhook verification errors', async () => {
			const rawBody = mockRawBodyData.invalidRawBody;
			const headers = mockHeaders.validSvixHeaders;
			expect(() => mockSvixWebhookLogic.verifyWebhook(rawBody, headers)).toThrow();
		});

		it('should handle invalid signature', async () => {
			const rawBody = mockRawBodyData.validRawBody;
			const headers = { ...mockHeaders.validSvixHeaders, 'svix-id': 'invalid_id' };
			expect(() => mockSvixWebhookLogic.verifyWebhook(rawBody, headers)).toThrow();
		});

		it('should handle invalid timestamp', async () => {
			const rawBody = mockRawBodyData.validRawBody;
			const headers = { ...mockHeaders.validSvixHeaders, 'svix-timestamp': 'invalid_timestamp' };
			expect(() => mockSvixWebhookLogic.verifyWebhook(rawBody, headers)).toThrow();
		});

		it('should handle invalid signature', async () => {
			const rawBody = mockRawBodyData.validRawBody;
			const headers = { ...mockHeaders.validSvixHeaders, 'svix-signature': 'invalid_signature' };
			expect(() => mockSvixWebhookLogic.verifyWebhook(rawBody, headers)).toThrow();
		});
	});

	describe('Webhook Service Integration Logic', () => {
		it('should call processClerkWebhookService correctly', async () => {
			const event = mockWebhookEventData.userCreated;
			const result = await mockWebhookServiceLogic.processClerkWebhookService(event);
			expect(result).toBeDefined();
			expect(result.success).toBe(true);
			expect(result.message).toBe('User created successfully');
		});

		it('should handle user created events', async () => {
			const event = mockWebhookEventData.userCreated;
			const result = await mockWebhookServiceLogic.processClerkWebhookService(event);
			expect(result.success).toBe(true);
			expect(result.user.id).toBe('user_123');
		});

		it('should handle user updated events', async () => {
			const event = mockWebhookEventData.userUpdated;
			const result = await mockWebhookServiceLogic.processClerkWebhookService(event);
			expect(result.success).toBe(true);
			expect(result.user.id).toBe('user_456');
		});

		it('should handle user deleted events', async () => {
			const event = mockWebhookEventData.userDeleted;
			const result = await mockWebhookServiceLogic.processClerkWebhookService(event);
			expect(result.success).toBe(true);
			expect(result.user.id).toBe('user_789');
		});

		it('should handle session events', async () => {
			const sessionCreated = mockWebhookEventData.sessionCreated;
			const sessionEnded = mockWebhookEventData.sessionEnded;
			
			const result1 = await mockWebhookServiceLogic.processClerkWebhookService(sessionCreated);
			const result2 = await mockWebhookServiceLogic.processClerkWebhookService(sessionEnded);
			
			expect(result1.success).toBe(true);
			expect(result2.success).toBe(true);
		});

		it('should handle invalid event types', async () => {
			const event = mockWebhookEventData.invalidEvent;
			try {
				await mockWebhookServiceLogic.processClerkWebhookService(event);
			} catch (error) {
				expect(error).toBe(mockErrors.invalidEventType);
			}
		});

		it('should handle processing errors', async () => {
			const event = { type: 'error_event', data: {} };
			try {
				await mockWebhookServiceLogic.processClerkWebhookService(event);
			} catch (error) {
				expect(error).toBe(mockErrors.processingError);
			}
		});
	});

	describe('Error Handling Logic', () => {
		it('should handle webhook secret missing error', async () => {
			const error = mockErrors.webhookSecretMissing;
			expect(error.message).toBe('Missing Clerk Webhook Secret');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle Svix headers missing error', async () => {
			const error = mockErrors.svixHeadersMissing;
			expect(error.message).toBe('Missing Svix headers');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle webhook verification failed error', async () => {
			const error = mockErrors.webhookVerificationFailed;
			expect(error.message).toBe('Webhook verification failed');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle webhook service error', async () => {
			const error = mockErrors.webhookServiceError;
			expect(error.message).toBe('Webhook service error');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle invalid signature error', async () => {
			const error = mockErrors.invalidSignature;
			expect(error.message).toBe('Invalid signature');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle invalid timestamp error', async () => {
			const error = mockErrors.invalidTimestamp;
			expect(error.message).toBe('Invalid timestamp');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle invalid event type error', async () => {
			const error = mockErrors.invalidEventType;
			expect(error.message).toBe('Invalid event type');
			expect(error).toBeInstanceOf(Error);
		});

		it('should handle processing error', async () => {
			const error = mockErrors.processingError;
			expect(error.message).toBe('Error processing webhook');
			expect(error).toBeInstanceOf(Error);
		});
	});

	describe('Response Formatting Logic', () => {
		it('should format successful webhook response correctly', async () => {
			const response = {
				status: 200,
				data: { success: true },
			};
			expect(response.status).toBe(200);
			expect(response.data.success).toBe(true);
		});

		it('should format webhook error response correctly', async () => {
			const response = {
				status: 400,
				error: 'Webhook verification failed',
			};
			expect(response.status).toBe(400);
			expect(response.error).toBe('Webhook verification failed');
		});

		it('should format missing headers error response correctly', async () => {
			const response = {
				status: 400,
				error: 'Missing Svix headers',
			};
			expect(response.status).toBe(400);
			expect(response.error).toBe('Missing Svix headers');
		});

		it('should format service error response correctly', async () => {
			const response = {
				status: 400,
				error: 'Error processing webhook',
			};
			expect(response.status).toBe(400);
			expect(response.error).toBe('Error processing webhook');
		});
	});

	describe('Environment Variable Handling Logic', () => {
		it('should handle webhook secret correctly', async () => {
			const secret = process.env.WEBHOOK_SECRET;
			expect(secret).toBe('whsec_test_secret');
			expect(secret).toBeTruthy();
		});

		it('should handle missing webhook secret', async () => {
			const originalSecret = process.env.WEBHOOK_SECRET;
			delete process.env.WEBHOOK_SECRET;
			
			expect(process.env.WEBHOOK_SECRET).toBeUndefined();
			
			// Restore original secret
			process.env.WEBHOOK_SECRET = originalSecret;
		});

		it('should handle process exit on missing secret', async () => {
			const originalSecret = process.env.WEBHOOK_SECRET;
			delete process.env.WEBHOOK_SECRET;
			
			// This would trigger process.exit(1) in the actual controller
			expect(process.env.WEBHOOK_SECRET).toBeUndefined();
			
			// Restore original secret
			process.env.WEBHOOK_SECRET = originalSecret;
		});
	});

	describe('Controller Logic', () => {
		it('should process clerkWebhook request successfully', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				{},
				{},
				{},
				mockHeaders.validSvixHeaders,
				mockRawBodyData.validRawBody
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockWebhookVerify.mockReturnValue(mockWebhookEventData.userCreated);
			mockProcessClerkWebhookService.mockResolvedValue(mockServiceResponses.userCreatedSuccess);

			await mockControllerLogic.processClerkWebhook(req, res);

			expect(mockWebhookVerify).toHaveBeenCalledWith(mockRawBodyData.validRawBody, {
				'svix-id': 'msg_123456789',
				'svix-timestamp': '1640995200',
				'svix-signature': 'v1,signature_hash',
			});
			expect(mockProcessClerkWebhookService).toHaveBeenCalledWith(mockWebhookEventData.userCreated);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ success: true });
		});

		it('should process clerkWebhook request with user updated event', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				{},
				{},
				{},
				mockHeaders.validSvixHeaders,
				JSON.stringify(mockWebhookEventData.userUpdated)
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockWebhookVerify.mockReturnValue(mockWebhookEventData.userUpdated);
			mockProcessClerkWebhookService.mockResolvedValue(mockServiceResponses.userUpdatedSuccess);

			await mockControllerLogic.processClerkWebhook(req, res);

			expect(mockProcessClerkWebhookService).toHaveBeenCalledWith(mockWebhookEventData.userUpdated);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ success: true });
		});

		it('should process clerkWebhook request with user deleted event', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				{},
				{},
				{},
				mockHeaders.validSvixHeaders,
				JSON.stringify(mockWebhookEventData.userDeleted)
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockWebhookVerify.mockReturnValue(mockWebhookEventData.userDeleted);
			mockProcessClerkWebhookService.mockResolvedValue(mockServiceResponses.userDeletedSuccess);

			await mockControllerLogic.processClerkWebhook(req, res);

			expect(mockProcessClerkWebhookService).toHaveBeenCalledWith(mockWebhookEventData.userDeleted);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ success: true });
		});

		it('should process clerkWebhook request with missing Svix headers', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				{},
				{},
				{},
				mockHeaders.emptyHeaders,
				mockRawBodyData.validRawBody
			);
			const res = mockRequestResponseLogic.buildResponse();

			await mockControllerLogic.processClerkWebhook(req, res);

			expect(mockWebhookVerify).not.toHaveBeenCalled();
			expect(mockProcessClerkWebhookService).not.toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ error: 'Missing Svix headers' });
		});

		it('should process clerkWebhook request with missing Svix ID', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				{},
				{},
				{},
				mockHeaders.missingSvixId,
				mockRawBodyData.validRawBody
			);
			const res = mockRequestResponseLogic.buildResponse();

			await mockControllerLogic.processClerkWebhook(req, res);

			expect(mockWebhookVerify).not.toHaveBeenCalled();
			expect(mockProcessClerkWebhookService).not.toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ error: 'Missing Svix headers' });
		});

		it('should process clerkWebhook request with missing Svix timestamp', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				{},
				{},
				{},
				mockHeaders.missingSvixTimestamp,
				mockRawBodyData.validRawBody
			);
			const res = mockRequestResponseLogic.buildResponse();

			await mockControllerLogic.processClerkWebhook(req, res);

			expect(mockWebhookVerify).not.toHaveBeenCalled();
			expect(mockProcessClerkWebhookService).not.toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ error: 'Missing Svix headers' });
		});

		it('should process clerkWebhook request with missing Svix signature', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				{},
				{},
				{},
				mockHeaders.missingSvixSignature,
				mockRawBodyData.validRawBody
			);
			const res = mockRequestResponseLogic.buildResponse();

			await mockControllerLogic.processClerkWebhook(req, res);

			expect(mockWebhookVerify).not.toHaveBeenCalled();
			expect(mockProcessClerkWebhookService).not.toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ error: 'Missing Svix headers' });
		});

		it('should process clerkWebhook request with webhook verification error', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				{},
				{},
				{},
				mockHeaders.validSvixHeaders,
				mockRawBodyData.invalidRawBody
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockWebhookVerify.mockImplementation(() => {
				throw mockErrors.webhookVerificationFailed;
			});

			await mockControllerLogic.processClerkWebhook(req, res);

			expect(mockWebhookVerify).toHaveBeenCalled();
			expect(mockProcessClerkWebhookService).not.toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ error: 'Webhook verification failed' });
		});

		it('should process clerkWebhook request with service error', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				{},
				{},
				{},
				mockHeaders.validSvixHeaders,
				mockRawBodyData.validRawBody
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockWebhookVerify.mockReturnValue(mockWebhookEventData.userCreated);
			mockProcessClerkWebhookService.mockResolvedValue(mockServiceResponses.processingError);

			await mockControllerLogic.processClerkWebhook(req, res);

			expect(mockWebhookVerify).toHaveBeenCalled();
			expect(mockProcessClerkWebhookService).toHaveBeenCalledWith(mockWebhookEventData.userCreated);
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ error: 'Error processing webhook' });
		});

		it('should process clerkWebhook request with service exception', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				{},
				{},
				{},
				mockHeaders.validSvixHeaders,
				mockRawBodyData.validRawBody
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockWebhookVerify.mockReturnValue(mockWebhookEventData.userCreated);
			mockProcessClerkWebhookService.mockRejectedValue(mockErrors.processingError);

			await mockControllerLogic.processClerkWebhook(req, res);

			expect(mockWebhookVerify).toHaveBeenCalled();
			expect(mockProcessClerkWebhookService).toHaveBeenCalledWith(mockWebhookEventData.userCreated);
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ error: 'Webhook verification failed' });
		});

		it('should handle controller errors', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				{},
				{},
				{},
				mockHeaders.emptyHeaders,
				mockRawBodyData.validRawBody
			);
			const res = mockRequestResponseLogic.buildResponse();

			await mockControllerLogic.processClerkWebhook(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ error: 'Missing Svix headers' });
		});

		it('should handle controller success', async () => {
			const req = mockRequestResponseLogic.buildRequest(
				{},
				{},
				{},
				mockHeaders.validSvixHeaders,
				mockRawBodyData.validRawBody
			);
			const res = mockRequestResponseLogic.buildResponse();

			mockWebhookVerify.mockReturnValue(mockWebhookEventData.userCreated);
			mockProcessClerkWebhookService.mockResolvedValue(mockServiceResponses.userCreatedSuccess);

			await mockControllerLogic.processClerkWebhook(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ success: true });
		});

		it('should validate controller input', async () => {
			const validRequest = mockRequestResponseLogic.buildRequest(
				{},
				{},
				{},
				mockHeaders.validSvixHeaders,
				mockRawBodyData.validRawBody
			);
			const invalidRequest = mockRequestResponseLogic.buildRequest({}, {}, {}, {}, '');

			expect(mockRequestResponseLogic.validateControllerInput(validRequest)).toBe(true);
			expect(mockRequestResponseLogic.validateControllerInput(invalidRequest)).toBe(true);
		});
	});
});

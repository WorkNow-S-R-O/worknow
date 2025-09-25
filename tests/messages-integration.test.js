import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';

// Import mocks
import {
	mockPrismaInstance,
	mockSendEmail,
	mockRequireAdmin,
	mockMessageData,
	mockUserData,
	mockAdminUserData,
	mockMessagesList,
	mockUsersList,
	mockServiceResponses,
	mockErrors,
	mockEmailResponses,
	resetMessagesMocks,
} from './mocks/messages-integration.js';

// Import the route after mocking
import messagesRoutes from '../apps/api/routes/messages.js';

// Create Express app for testing
const createTestApp = () => {
	const app = express();
	app.use(express.json());
	app.use('/api/messages', messagesRoutes);
	return app;
};

// Mock console methods
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe('Messages Integration Tests', () => {
	let app;

	beforeEach(() => {
		// Create fresh app instance
		app = createTestApp();
		
		// Mock console methods to avoid noise in tests
		console.log = vi.fn();
		console.error = vi.fn();
		
		// Reset all mocks
		resetMessagesMocks();
	});

	afterEach(() => {
		// Restore console methods
		console.log = originalConsoleLog;
		console.error = originalConsoleError;
	});

	describe('GET /api/messages', () => {
		describe('Successful Requests', () => {
			it('should return user messages with clerkUserId query parameter', async () => {
				// Arrange
				mockPrismaInstance.message.findMany.mockResolvedValue(mockMessagesList);

				// Act
				const response = await request(app)
					.get('/api/messages?clerkUserId=user_123456789')
					.expect(200);

				// Assert
				expect(response.body).toEqual({
					messages: mockMessagesList,
				});
				expect(mockPrismaInstance.message.findMany).toHaveBeenCalledWith({
					where: { clerkUserId: 'user_123456789' },
					orderBy: { createdAt: 'desc' },
				});
			});

			it('should return empty messages list for user with no messages', async () => {
				// Arrange
				mockPrismaInstance.message.findMany.mockResolvedValue([]);

				// Act
				const response = await request(app)
					.get('/api/messages?clerkUserId=user_no_messages')
					.expect(200);

				// Assert
				expect(response.body).toEqual({
					messages: [],
				});
			});

			it('should handle messages with different types', async () => {
				// Arrange
				const mixedMessages = [
					{ ...mockMessagesList[0], type: 'system' },
					{ ...mockMessagesList[1], type: 'admin' },
				];
				mockPrismaInstance.message.findMany.mockResolvedValue(mixedMessages);

				// Act
				const response = await request(app)
					.get('/api/messages?clerkUserId=user_123456789')
					.expect(200);

				// Assert
				expect(response.body.messages).toHaveLength(2);
				expect(response.body.messages[0].type).toBe('system');
				expect(response.body.messages[1].type).toBe('admin');
			});
		});

		describe('Error Handling', () => {
			it('should require clerkUserId parameter', async () => {
				// Act
				const response = await request(app)
					.get('/api/messages')
					.expect(400);

				// Assert
				expect(response.body).toEqual({
					error: 'clerkUserId обязателен',
				});
			});

			it('should handle database errors', async () => {
				// Arrange
				mockPrismaInstance.message.findMany.mockRejectedValue(new Error('Database connection failed'));

				// Act
				const response = await request(app)
					.get('/api/messages?clerkUserId=user_123456789')
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					error: 'Ошибка получения сообщений',
				});
			});

			it('should handle empty clerkUserId', async () => {
				// Act
				const response = await request(app)
					.get('/api/messages?clerkUserId=')
					.expect(400);

				// Assert
				expect(response.body).toEqual({
					error: 'clerkUserId обязателен',
				});
			});
		});

		describe('HTTP Method Validation', () => {
			it('should reject POST requests', async () => {
				// Act & Assert
				await request(app)
					.post('/api/messages')
					.expect(400); // Will hit createMessage which requires body
			});

			it('should reject PUT requests', async () => {
				// Act & Assert
				await request(app)
					.put('/api/messages')
					.expect(404);
			});

			it('should reject DELETE requests', async () => {
				// Act & Assert
				await request(app)
					.delete('/api/messages')
					.expect(404);
			});
		});

		describe('Response Format Validation', () => {
			it('should return valid JSON response', async () => {
				// Arrange
				mockPrismaInstance.message.findMany.mockResolvedValue(mockMessagesList);

				// Act
				const response = await request(app)
					.get('/api/messages?clerkUserId=user_123456789')
					.expect(200)
					.expect('Content-Type', /json/);

				// Assert
				expect(typeof response.body).toBe('object');
				expect(response.body).toHaveProperty('messages');
				expect(Array.isArray(response.body.messages)).toBe(true);
			});
		});
	});

	describe('GET /api/messages/user/:userId', () => {
		describe('Successful Requests', () => {
			it('should return user messages by path parameter', async () => {
				// Arrange
				mockPrismaInstance.message.findMany.mockResolvedValue(mockMessagesList);

				// Act
				const response = await request(app)
					.get('/api/messages/user/user_123456789')
					.expect(200);

				// Assert
				expect(response.body).toEqual({
					messages: mockMessagesList,
				});
				expect(mockPrismaInstance.message.findMany).toHaveBeenCalledWith({
					where: { clerkUserId: 'user_123456789' },
					orderBy: { createdAt: 'desc' },
				});
			});
		});

		describe('Error Handling', () => {
			it('should handle database errors for path parameter', async () => {
				// Arrange
				mockPrismaInstance.message.findMany.mockRejectedValue(new Error('Database error'));

				// Act
				const response = await request(app)
					.get('/api/messages/user/user_123456789')
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					error: 'Ошибка получения сообщений',
				});
			});
		});
	});

	describe('POST /api/messages', () => {
		describe('Successful Requests', () => {
			it('should create a new message and send email', async () => {
				// Arrange
				const messageData = {
					clerkUserId: 'user_123456789',
					title: 'Test Message',
					body: 'This is a test message',
					type: 'system',
				};
				mockPrismaInstance.message.create.mockResolvedValue(mockMessageData);
				mockPrismaInstance.user.findUnique.mockResolvedValue(mockUserData);
				mockSendEmail.mockResolvedValue(mockEmailResponses.success);

				// Act
				const response = await request(app)
					.post('/api/messages')
					.send(messageData)
					.expect(200);

				// Assert
				expect(response.body).toEqual({
					success: true,
					message: mockMessageData,
				});
				expect(mockPrismaInstance.message.create).toHaveBeenCalledWith({
					data: messageData,
				});
				expect(mockSendEmail).toHaveBeenCalledWith(
					'test@example.com',
					'Test Message',
					'<h2>Test Message</h2><p>This is a test message</p>'
				);
			});

			it('should create message without email if user not found', async () => {
				// Arrange
				const messageData = {
					clerkUserId: 'user_not_found',
					title: 'Test Message',
					body: 'This is a test message',
				};
				mockPrismaInstance.message.create.mockResolvedValue(mockMessageData);
				mockPrismaInstance.user.findUnique.mockResolvedValue(null);

				// Act
				const response = await request(app)
					.post('/api/messages')
					.send(messageData)
					.expect(200);

				// Assert
				expect(response.body).toEqual({
					success: true,
					message: mockMessageData,
				});
				expect(mockSendEmail).not.toHaveBeenCalled();
			});

			it('should create message with fromAdminId', async () => {
				// Arrange
				const messageData = {
					clerkUserId: 'user_123456789',
					title: 'Admin Message',
					body: 'Message from admin',
					type: 'admin',
					fromAdminId: 'admin_clerk_123',
				};
				mockPrismaInstance.message.create.mockResolvedValue({
					...mockMessageData,
					...messageData,
				});
				mockPrismaInstance.user.findUnique.mockResolvedValue(mockUserData);
				mockSendEmail.mockResolvedValue(mockEmailResponses.success);

				// Act
				const response = await request(app)
					.post('/api/messages')
					.send(messageData)
					.expect(200);

				// Assert
				expect(response.body.success).toBe(true);
				expect(mockPrismaInstance.message.create).toHaveBeenCalledWith({
					data: messageData,
				});
			});
		});

		describe('Error Handling', () => {
			it('should require clerkUserId, title, and body', async () => {
				// Act
				const response = await request(app)
					.post('/api/messages')
					.send({ clerkUserId: 'user_123456789' })
					.expect(400);

				// Assert
				expect(response.body).toEqual({
					error: 'clerkUserId, title и body обязательны',
				});
			});

			it('should handle missing title', async () => {
				// Act
				const response = await request(app)
					.post('/api/messages')
					.send({
						clerkUserId: 'user_123456789',
						body: 'Test body',
					})
					.expect(400);

				// Assert
				expect(response.body).toEqual({
					error: 'clerkUserId, title и body обязательны',
				});
			});

			it('should handle missing body', async () => {
				// Act
				const response = await request(app)
					.post('/api/messages')
					.send({
						clerkUserId: 'user_123456789',
						title: 'Test title',
					})
					.expect(400);

				// Assert
				expect(response.body).toEqual({
					error: 'clerkUserId, title и body обязательны',
				});
			});

			it('should handle database errors', async () => {
				// Arrange
				const messageData = {
					clerkUserId: 'user_123456789',
					title: 'Test Message',
					body: 'This is a test message',
				};
				mockPrismaInstance.message.create.mockRejectedValue(new Error('Database error'));

				// Act
				const response = await request(app)
					.post('/api/messages')
					.send(messageData)
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					error: 'Ошибка создания сообщения',
				});
			});

			it('should handle email sending errors gracefully', async () => {
				// Arrange
				const messageData = {
					clerkUserId: 'user_123456789',
					title: 'Test Message',
					body: 'This is a test message',
				};
				mockPrismaInstance.message.create.mockResolvedValue(mockMessageData);
				mockPrismaInstance.user.findUnique.mockResolvedValue(mockUserData);
				mockSendEmail.mockRejectedValue(new Error('SMTP error'));

				// Act
				const response = await request(app)
					.post('/api/messages')
					.send(messageData)
					.expect(200); // Should still succeed even if email fails

				// Assert
				expect(response.body.success).toBe(true);
				expect(mockSendEmail).toHaveBeenCalled();
			});
		});
	});

	describe('PATCH /api/messages/:id/read', () => {
		describe('Successful Requests', () => {
			it('should mark message as read', async () => {
				// Arrange
				const updatedMessage = { ...mockMessageData, isRead: true };
				mockPrismaInstance.message.update.mockResolvedValue(updatedMessage);

				// Act
				const response = await request(app)
					.patch('/api/messages/msg_123456789/read')
					.expect(200);

				// Assert
				expect(response.body).toEqual({
					success: true,
					message: updatedMessage,
				});
				expect(mockPrismaInstance.message.update).toHaveBeenCalledWith({
					where: { id: 'msg_123456789' },
					data: { isRead: true },
				});
			});
		});

		describe('Error Handling', () => {
			it('should handle database errors', async () => {
				// Arrange
				mockPrismaInstance.message.update.mockRejectedValue(new Error('Database error'));

				// Act
				const response = await request(app)
					.patch('/api/messages/msg_123456789/read')
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					error: 'Ошибка отметки сообщения',
				});
			});

			it('should handle invalid message ID', async () => {
				// Arrange
				mockPrismaInstance.message.update.mockRejectedValue(new Error('Record not found'));

				// Act
				const response = await request(app)
					.patch('/api/messages/invalid_id/read')
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					error: 'Ошибка отметки сообщения',
				});
			});
		});
	});

	describe('DELETE /api/messages/:id', () => {
		describe('Successful Requests', () => {
			it('should delete message successfully', async () => {
				// Arrange
				mockPrismaInstance.message.findUnique.mockResolvedValue(mockMessageData);
				mockPrismaInstance.message.delete.mockResolvedValue(mockMessageData);

				// Act
				const response = await request(app)
					.delete('/api/messages/msg_123456789')
					.expect(200);

				// Assert
				expect(response.body).toEqual({
					success: true,
					message: 'Сообщение удалено',
				});
				expect(mockPrismaInstance.message.findUnique).toHaveBeenCalledWith({
					where: { id: 'msg_123456789' },
				});
				expect(mockPrismaInstance.message.delete).toHaveBeenCalledWith({
					where: { id: 'msg_123456789' },
				});
			});
		});

		describe('Error Handling', () => {
			it('should handle message not found', async () => {
				// Arrange
				mockPrismaInstance.message.findUnique.mockResolvedValue(null);

				// Act
				const response = await request(app)
					.delete('/api/messages/nonexistent_id')
					.expect(404);

				// Assert
				expect(response.body).toEqual({
					error: 'Сообщение не найдено',
				});
			});

			it('should handle missing message ID', async () => {
				// Act
				const response = await request(app)
					.delete('/api/messages/')
					.expect(404); // Will hit wrong route
			});

			it('should handle Prisma P2025 error (record not found)', async () => {
				// Arrange
				const prismaError = new Error('Record not found');
				prismaError.code = 'P2025';
				mockPrismaInstance.message.findUnique.mockResolvedValue(mockMessageData);
				mockPrismaInstance.message.delete.mockRejectedValue(prismaError);

				// Act
				const response = await request(app)
					.delete('/api/messages/msg_123456789')
					.expect(404);

				// Assert
				expect(response.body).toEqual({
					error: 'Сообщение не найдено',
				});
			});

			it('should handle Prisma P2002 error (invalid format)', async () => {
				// Arrange
				const prismaError = new Error('Invalid format');
				prismaError.code = 'P2002';
				mockPrismaInstance.message.findUnique.mockResolvedValue(mockMessageData);
				mockPrismaInstance.message.delete.mockRejectedValue(prismaError);

				// Act
				const response = await request(app)
					.delete('/api/messages/invalid_format')
					.expect(400);

				// Assert
				expect(response.body).toEqual({
					error: 'Invalid message ID format',
				});
			});

			it('should handle general database errors', async () => {
				// Arrange
				mockPrismaInstance.message.findUnique.mockResolvedValue(mockMessageData);
				mockPrismaInstance.message.delete.mockRejectedValue(new Error('Database error'));

				// Act
				const response = await request(app)
					.delete('/api/messages/msg_123456789')
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					error: 'Ошибка удаления сообщения',
				});
			});
		});
	});

	describe('POST /api/messages/broadcast', () => {
		describe('Authentication', () => {
			it('should require admin authentication', async () => {
				// Act
				const response = await request(app)
					.post('/api/messages/broadcast')
					.send({
						title: 'Broadcast Message',
						body: 'This is a broadcast message',
					})
					.expect(403);

				// Assert
				expect(response.body).toEqual({
					error: 'Доступ запрещен. Требуются права администратора.',
				});
			});

			it('should accept admin authentication', async () => {
				// Arrange
				mockPrismaInstance.user.findMany.mockResolvedValue(mockUsersList);
				mockPrismaInstance.message.create.mockResolvedValue(mockMessageData);
				mockSendEmail.mockResolvedValue(mockEmailResponses.success);

				// Act
				const response = await request(app)
					.post('/api/messages/broadcast')
					.set('x-admin', 'true')
					.send({
						title: 'Broadcast Message',
						body: 'This is a broadcast message',
					})
					.expect(200);

				// Assert
				expect(response.body).toEqual({
					success: true,
					count: 3,
				});
			});
		});

		describe('Successful Requests', () => {
			it('should broadcast message to all users', async () => {
				// Arrange
				mockPrismaInstance.user.findMany.mockResolvedValue(mockUsersList);
				mockPrismaInstance.message.create.mockResolvedValue(mockMessageData);
				mockSendEmail.mockResolvedValue(mockEmailResponses.success);

				// Act
				const response = await request(app)
					.post('/api/messages/broadcast')
					.set('x-admin', 'true')
					.send({
						title: 'Broadcast Message',
						body: 'This is a broadcast message',
					})
					.expect(200);

				// Assert
				expect(response.body).toEqual({
					success: true,
					count: 3,
				});
				expect(mockPrismaInstance.user.findMany).toHaveBeenCalledWith();
				expect(mockPrismaInstance.message.create).toHaveBeenCalledTimes(3);
				expect(mockSendEmail).toHaveBeenCalledTimes(3);
			});

			it('should broadcast message to specific users', async () => {
				// Arrange
				const specificUsers = [mockUsersList[0], mockUsersList[1]];
				mockPrismaInstance.user.findMany.mockResolvedValue(specificUsers);
				mockPrismaInstance.message.create.mockResolvedValue(mockMessageData);
				mockSendEmail.mockResolvedValue(mockEmailResponses.success);

				// Act
				const response = await request(app)
					.post('/api/messages/broadcast')
					.set('x-admin', 'true')
					.send({
						title: 'Targeted Message',
						body: 'This is a targeted message',
						clerkUserIds: ['user_123456789', 'user_123456790'],
					})
					.expect(200);

				// Assert
				expect(response.body).toEqual({
					success: true,
					count: 2,
				});
				expect(mockPrismaInstance.user.findMany).toHaveBeenCalledWith({
					where: { clerkUserId: { in: ['user_123456789', 'user_123456790'] } },
				});
			});

			it('should handle users without email addresses', async () => {
				// Arrange
				const usersWithoutEmail = [
					{ ...mockUsersList[0], email: null },
					{ ...mockUsersList[1], email: '' },
				];
				mockPrismaInstance.user.findMany.mockResolvedValue(usersWithoutEmail);
				mockPrismaInstance.message.create.mockResolvedValue(mockMessageData);

				// Act
				const response = await request(app)
					.post('/api/messages/broadcast')
					.set('x-admin', 'true')
					.send({
						title: 'Broadcast Message',
						body: 'This is a broadcast message',
					})
					.expect(200);

				// Assert
				expect(response.body).toEqual({
					success: true,
					count: 2,
				});
				expect(mockSendEmail).not.toHaveBeenCalled();
			});
		});

		describe('Error Handling', () => {
			it('should require title and body', async () => {
				// Act
				const response = await request(app)
					.post('/api/messages/broadcast')
					.set('x-admin', 'true')
					.send({
						title: 'Broadcast Message',
					})
					.expect(400);

				// Assert
				expect(response.body).toEqual({
					error: 'title и body обязательны',
				});
			});

			it('should handle database errors', async () => {
				// Arrange
				mockPrismaInstance.user.findMany.mockRejectedValue(new Error('Database error'));

				// Act
				const response = await request(app)
					.post('/api/messages/broadcast')
					.set('x-admin', 'true')
					.send({
						title: 'Broadcast Message',
						body: 'This is a broadcast message',
					})
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					error: 'Ошибка рассылки',
				});
			});

			it('should handle email sending errors gracefully', async () => {
				// Arrange
				mockPrismaInstance.user.findMany.mockResolvedValue(mockUsersList);
				mockPrismaInstance.message.create.mockResolvedValue(mockMessageData);
				mockSendEmail.mockRejectedValue(new Error('SMTP error'));

				// Act
				const response = await request(app)
					.post('/api/messages/broadcast')
					.set('x-admin', 'true')
					.send({
						title: 'Broadcast Message',
						body: 'This is a broadcast message',
					})
					.expect(200); // Should still succeed even if emails fail

				// Assert
				expect(response.body.success).toBe(true);
				expect(response.body.count).toBe(3);
			});
		});
	});

	describe('Performance and Caching', () => {
		it('should handle concurrent GET requests', async () => {
			// Arrange
			mockPrismaInstance.message.findMany.mockResolvedValue(mockMessagesList);

			// Act - Make multiple concurrent requests
			const promises = Array.from({ length: 5 }).map(() =>
				request(app).get('/api/messages?clerkUserId=user_123456789')
			);

			const responses = await Promise.all(promises);

			// Assert
			responses.forEach((response) => {
				expect(response.status).toBe(200);
				expect(response.body.messages).toHaveLength(2);
			});
			expect(mockPrismaInstance.message.findMany).toHaveBeenCalledTimes(5);
		});

		it('should handle concurrent POST requests', async () => {
			// Arrange
			mockPrismaInstance.message.create.mockResolvedValue(mockMessageData);
			mockPrismaInstance.user.findUnique.mockResolvedValue(mockUserData);
			mockSendEmail.mockResolvedValue(mockEmailResponses.success);

			// Act - Make multiple concurrent requests
			const promises = Array.from({ length: 3 }).map(() =>
				request(app)
					.post('/api/messages')
					.send({
						clerkUserId: 'user_123456789',
						title: 'Test Message',
						body: 'This is a test message',
					})
			);

			const responses = await Promise.all(promises);

			// Assert
			responses.forEach((response) => {
				expect(response.status).toBe(200);
				expect(response.body.success).toBe(true);
			});
			expect(mockPrismaInstance.message.create).toHaveBeenCalledTimes(3);
		});
	});
});


